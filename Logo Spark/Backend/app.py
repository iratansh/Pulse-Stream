# Information Flow: Input -> Python Backend - > Generate Logo -> Output
# User Wants to Save Logo to Postgres: Input -> ASP.NET Backend -> Find Image from Images Folder -> Append Image to User Image Subfolder
# User goes to show Saved Logos: Input -> ASP.NET Backend -> PostgreSQL Database for Path -> Go to User Image Subfolder -> Show Images

import fastapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import logging
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from AILogoModel import LogoGenerator
import json


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

# Store active generation tasks
active_tasks = {}

class Design(BaseModel):
    uInput: str

class GenerationTask(BaseModel):
    task_id: str

@app.post("/api/generate")
async def generate_logo(data: Design):
    try:
        # Generate first logo to return immediately
        first_logo = logo_gen.generate_logo_one_by_one(data.uInput, 0)
        
        # Generate a unique task ID for the remaining logos
        import uuid
        task_id = str(uuid.uuid4())
        
        # Store this task ID as active
        active_tasks[task_id] = {
            "active": True,
            "company_name": data.uInput,
            "generated_count": 1  # Start with 1 as we've generated the first logo
        }
        
        # Return the first logo and task ID
        return {
            "status": "success",
            "logo": first_logo,
            "task_id": task_id
        }
    except Exception as e:
        logger.error(f"Error generating logo: {e}")
        return {"status": "error", "message": f"Error generating logo: {e}"}

@app.get("/api/stream-logos/{task_id}")
async def stream_logos(task_id: str, company_name: str, total_logos: int = 6):
    async def generate_stream():
        try:
            if task_id not in active_tasks:
                active_tasks[task_id] = {
                    "active": True,
                    "company_name": company_name,
                    "generated_count": 1  # Start with 1 as we're assuming the first logo was already generated
                }
            
            def should_abort():
                # Check if task exists and is still active
                return task_id not in active_tasks or not active_tasks[task_id]["active"]
            
            # Start from index 1 since we already generated the first logo
            for i in range(1, total_logos):
                # Check if task was aborted before starting generation
                if should_abort():
                    logger.info(f"Task {task_id} was aborted before generating logo {i}")
                    generated_count = active_tasks[task_id]["generated_count"] if task_id in active_tasks else i - 1
                    
                    # Send an abort message 
                    abort_data = {
                        "status": "aborted",
                        "message": "Logo generation was aborted",
                        "total_generated": generated_count
                    }
                    yield f"data: {json.dumps(abort_data)}\n\n".encode('utf-8')
                    
                    if task_id in active_tasks:
                        del active_tasks[task_id]
                    break
                    
                # Generate the next logo with abortion checking
                logo_path = logo_gen.generate_logo_one_by_one(company_name, i, should_abort)
                
                # If logo_path is None, generation was aborted
                if logo_path is None:
                    logger.info(f"Task {task_id} was aborted during logo {i} generation")
                    generated_count = active_tasks[task_id]["generated_count"] if task_id in active_tasks else i - 1
                    
                    # Send an abort message 
                    abort_data = {
                        "status": "aborted",
                        "message": "Logo generation was aborted",
                        "total_generated": generated_count
                    }
                    yield f"data: {json.dumps(abort_data)}\n\n".encode('utf-8')
                    
                    if task_id in active_tasks:
                        del active_tasks[task_id]
                    break
                
                # Update the generated count
                if task_id in active_tasks:
                    active_tasks[task_id]["generated_count"] = i + 1
            
                response_data = {
                    "status": "success", 
                    "logo": logo_path, 
                    "index": i,
                    "is_last": i == total_logos - 1
                }
                
                # Send the response in SSE
                yield f"data: {json.dumps(response_data)}\n\n".encode('utf-8')
                
                # If this was the last logo, we're done
                if i == total_logos - 1:
                    if task_id in active_tasks:
                        del active_tasks[task_id]
        except Exception as e:
            logger.error(f"Error in streaming logos: {e}")
            error_data = {"status": "error", "message": str(e)}
            yield f"data: {json.dumps(error_data)}\n\n".encode('utf-8')
        
            if task_id in active_tasks:
                del active_tasks[task_id]
    
    logger.info(f"Streaming logos for task {task_id}")
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream"
    )

@app.delete("/api/abort-generation/{task_id}")
async def abort_generation(task_id: str):
    logger.info(f"Received abort request for task {task_id}")
    
    if task_id in active_tasks: # Check if the task exists
        active_tasks[task_id]["active"] = False
        logger.info(f"Generation task {task_id} marked for abortion")
        generated_count = active_tasks[task_id]["generated_count"]  # Get the current count of generated logos
        
        return {
            "status": "success", 
            "message": f"Generation task {task_id} aborted",
            "total_generated": generated_count
        }
    else:
        logger.warning(f"Task {task_id} not found or already completed")
        return {"status": "error", "message": "Task not found or already completed"}
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5080)