from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import shutil
import subprocess
from pathlib import Path

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
BASE_DIR = Path(__file__).resolve().parent
TEMP_DIR = BASE_DIR / "temp"
OUTPUT_DIR = BASE_DIR / "outputs"

# Ensure directories exist
TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Mount static files to serve the separated audio
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

@app.get("/")
def read_root():
    return {"message": "Vocal Separator API is running"}

@app.post("/separate")
async def separate_audio(file: UploadFile = File(...)):
    try:
        # 1. Save uploaded file
        filename = file.filename
        input_path = TEMP_DIR / filename
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Run Demucs
        # We use subprocess to call demucs. 
        # --two-stems=vocals separates into 'vocals' and 'no_vocals' (accompaniment)
        # -n htdemucs is the model (High Quality)
        # -o specifies output directory
        command = [
            "demucs",
            "--two-stems=vocals",
            "-n", "htdemucs",
            "-o", str(OUTPUT_DIR),
            str(input_path)
        ]
        
        print(f"Running command: {' '.join(command)}")
        process = subprocess.run(command, capture_output=True, text=True)
        
        if process.returncode != 0:
            print(f"Demucs Error: {process.stderr}")
            raise HTTPException(status_code=500, detail=f"Demucs failed: {process.stderr}")

        # 3. Construct response paths
        # Demucs output structure: output_dir/htdemucs/filename_no_ext/vocals.wav
        file_stem = input_path.stem
        model_name = "htdemucs"
        result_dir = OUTPUT_DIR / model_name / file_stem
        
        vocals_path = result_dir / "vocals.wav"
        no_vocals_path = result_dir / "no_vocals.wav"

        if not vocals_path.exists() or not no_vocals_path.exists():
             raise HTTPException(status_code=500, detail="Output files not found after processing")

        # Return URLs relative to the static mount
        return {
            "message": "Separation complete",
            "vocals": f"/outputs/{model_name}/{file_stem}/vocals.wav",
            "accompaniment": f"/outputs/{model_name}/{file_stem}/no_vocals.wav"
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup input file if needed, but maybe keep for now
        pass
