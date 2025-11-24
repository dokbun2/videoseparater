# Vocal Separator

A web application that separates vocals and accompaniment from MP4 video files using the Demucs AI model.

## Features

-   **MP4 Upload**: Drag and drop your video files.
-   **AI Separation**: Uses Meta's Demucs model for high-quality stem separation.
-   **Instant Playback**: Listen to isolated vocals and music directly in the browser.
-   **Download**: Download the separated tracks as WAV files.
-   **Modern UI**: Dark-themed, responsive interface built with Next.js and Tailwind CSS.

## Prerequisites

-   **Python 3.8+**
-   **Node.js 18+**
-   **FFmpeg**: Must be installed and available in your system PATH.

## Installation

1.  **Backend Setup**:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    ```

## Running the App

1.  **Start the Backend**:
    ```bash
    # In the backend directory
    uvicorn main:app --reload
    ```
    The API will run at `http://localhost:8000`.

2.  **Start the Frontend**:
    ```bash
    # In the frontend directory
    npm run dev
    ```
    Open `http://localhost:3000` in your browser.

## Usage

1.  Open the web app.
2.  Drag and drop an MP4 file into the upload area.
3.  Click "Start Separation".
4.  Wait for the AI to process the file (this may take a minute depending on your hardware).
5.  Play or download the separated "Vocals" and "Accompaniment" tracks.
