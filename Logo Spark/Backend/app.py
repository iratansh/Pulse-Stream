import fastapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import logging
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from AILogoModel import LogoGenerator
import json
import asyncio

IMAGES_DIR = "/Users/ishaanratanshi/Logo Spark/images"
logo_gen = LogoGenerator(output_dir=IMAGES_DIR)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app = fastapi.FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path(IMAGES_DIR).mkdir(exist_ok=True)

# Mount the images directory to serve static files
app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

active_tasks = {}

class Design(BaseModel):
    uInput: str

@app.post("/api/generate")
async def generate_logo(data: Design):
    """
    Generate a logo based on the user's input and initiate a logo generation task.

    This endpoint creates a single logo using the provided user input and returns the
    logo along with a unique task ID. It records the task as active and stores the 
    company name and initial generation count.

    Args:
        data (Design): The user's design input containing the prompt for logo generation.

    Returns:
        dict: A JSON response with the following keys:
            - status (str): 'success' if the logo was generated, otherwise 'error'.
            - logo (str): File path to the generated logo if successful.
            - task_id (str): Unique identifier for the logo generation task.
            - message (str, optional): Error message if the generation fails.
    """

    try:
        first_logo = logo_gen.generate_logo_one_by_one(data.uInput, 0)
        import uuid
        task_id = str(uuid.uuid4())
        active_tasks[task_id] = {"active": True, "company_name": data.uInput, "generated_count": 1}
        return {"status": "success", "logo": first_logo, "task_id": task_id}
    except Exception as e:
        logger.error(f"Error generating logo: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/stream-logos/{task_id}")
async def stream_logos(task_id: str, company_name: str, total_logos: int = 6):
    """
    Stream generated logos for a specific task.

    This endpoint yields EventStream data containing status updates, generated logos, 
    or error messages. It periodically checks if the task has been aborted and yields 
    appropriate messages. Upon completion or abortion, it ensures proper cleanup of task 
    data.

    Args:
        task_id (str): The task ID to stream
        company_name (str): The company name to generate logos for
        total_logos (int): The total number of logos to generate

    Yields:
        bytes: EventStream data containing status updates, generated logos, 
            or error messages.
    """
    
    # Check if task is already streaming
    if active_tasks.get(task_id, {}).get("streaming"):
        logger.warning(f"Duplicate stream attempt for task {task_id} — ignoring")
        return fastapi.Response(status_code=409, content="Stream already active")
    
    # Mark the task as streaming
    if task_id in active_tasks:
        active_tasks[task_id]["streaming"] = True
    else:
        # Initialize the task if it doesn't exist
        active_tasks[task_id] = {"active": True, "company_name": company_name, "generated_count": 1, "streaming": True}
    
    async def generate_stream():
        """
        Asynchronously stream generated logos for a specific task.

        Yields:
            bytes: EventStream data containing status updates, generated logos, 
                or error messages.

        This function keeps streaming logo generation updates for a given task. 
        It periodically checks if the task has been aborted and yields appropriate 
        messages. Upon completion or abortion, it ensures proper cleanup of task 
        data.
        """

        try:
            # Send a keepalive message with a long retry
            yield b"retry: 3600000\n\n"
            await asyncio.sleep(0.1)
            
            # Generate remaining logos
            for i in range(1, total_logos):
                # Check if the task should be aborted
                if task_id not in active_tasks or not active_tasks[task_id]["active"]:
                    abort_data = {
                        "status": "aborted",
                        "message": "Logo generation was aborted",
                        "total_generated": active_tasks.get(task_id, {}).get("generated_count", i - 1)
                    }
                    yield f"data: {json.dumps(abort_data)}\n\n".encode('utf-8')
                    await asyncio.sleep(0.1)
                    break
                
                # Generate the logo
                try:
                    logo_path = logo_gen.generate_logo_one_by_one(
                        company_name, 
                        i,
                        # Pass a function to check if abortion was requested
                        should_abort=lambda: task_id not in active_tasks or not active_tasks[task_id]["active"]
                    )
                except Exception as e:
                    logger.error(f"Error generating logo {i}: {e}")
                    logo_path = None
                
                # Handle aborted generation
                if logo_path is None:
                    abort_data = {
                        "status": "aborted",
                        "message": "Aborted mid-generation",
                        "total_generated": active_tasks.get(task_id, {}).get("generated_count", i - 1)
                    }
                    yield f"data: {json.dumps(abort_data)}\n\n".encode('utf-8')
                    await asyncio.sleep(0.1)
                    break
                
                # Update generated count and send success response
                if task_id in active_tasks:
                    active_tasks[task_id]["generated_count"] = i + 1
                
                payload = {
                    "status": "success", 
                    "logo": logo_path, 
                    "index": i, 
                    "is_last": i == total_logos - 1
                }
                yield f"data: {json.dumps(payload)}\n\n".encode('utf-8')
                # Small sleep to allow client processing
                await asyncio.sleep(0.1)
            
            # Always signal completion
            yield b"event: done\ndata: {}\n\n"
            await asyncio.sleep(0.1)
            
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield f"data: {json.dumps({'status': 'error', 'message': str(e)})}\n\n".encode('utf-8')
            await asyncio.sleep(0.1)
        finally:
            # Clean up when done
            if task_id in active_tasks:
                active_tasks[task_id].pop("streaming", None)
                if not active_tasks[task_id]["active"]:
                    del active_tasks[task_id]

    logger.info(f"Starting logo stream for task {task_id}")
    return StreamingResponse(generate_stream(), media_type="text/event-stream")

@app.delete("/api/abort-generation/{task_id}")
async def abort_generation(task_id: str):
    """
    Abort an active logo generation task.

    Args:
        task_id (str): The task ID to abort.

    Returns:
        dict: A JSON response with the following keys:
            status (str): 'success' or 'error'
            message (str): A human-readable message
            total_generated (int): The number of logos generated by the aborted task
    """
    
    logger.info(f"Received abort request for task {task_id}")
    if task_id in active_tasks:
        active_tasks[task_id]["active"] = False
        count = active_tasks[task_id]["generated_count"]
        return {"status": "success", "message": f"Generation task {task_id} aborted", "total_generated": count}
    return {"status": "error", "message": "Task not found or already completed"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5080)