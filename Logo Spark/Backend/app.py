# Information Flow: Input -> Python Backend - > Generate Logo -> Output
# User Wants to Save Logo to Postgres: Input -> ASP.NET Backend -> Find Image from Images Folder -> Append Image to User Image Subfolder
# User goes to show Saved Logos: Input -> ASP.NET Backend -> PostgreSQL Database for Path -> Go to User Image Subfolder -> Show Images

import fastapi
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from AILogoModel import LogoGenerator


logo_gen = LogoGenerator()

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

class Design(BaseModel):
    uInput: str

@app.post("/api/generate-logo")
async def generate_logo(data: Design):
    try: 
        logo_gen.generate_logo(data.uInput)
        logger.info("Logo generated successfully")
        return {"status": "success", "message": "Logo generated successfully"}
    except Exception as e:
        logger.error(f"Error generating logo: {e}")
        return {"status": "error", "message": f"Error generating logo: {e}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5080)