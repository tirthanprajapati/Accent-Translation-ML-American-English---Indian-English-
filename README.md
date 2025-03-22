# Capstone Project
# Accent Conversion Web App

## Project Overview
This is a full-stack MERN (MongoDB, Express, React, Node.js) application for converting audio accents using a machine learning model. Users can log in, upload or record audio, and receive the processed output with the converted accent. The backend utilizes Python and PyTorch to run the accent conversion model.

## Features
- User authentication with JWT
- Audio upload and recording
- Accent conversion using `accent_conversion_model.pth`
- Audio playback and download options
- MongoDB integration for user data and audio file management

## Tech Stack
### Frontend:
- React.js
- Tailwind CSS
- Redux for state management

### Backend:
- Node.js with Express
- MongoDB with Mongoose
- Multer for file handling
- JWT for authentication
- Python (Flask/FastAPI) for ML inference

## Installation

### Prerequisites
- Node.js and npm
- MongoDB instance (local or Atlas)
- Python (with dependencies for ML inference)

### Backend Setup
```sh
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in `backend/` and add:
```env
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
PYTHON_SERVER_URL=http://localhost:8000/predict
```

Start the backend:
```sh
npm start
```

### Python ML API Setup
```sh
cd ml-api
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```sh
cd frontend
npm install
npm start
```

## API Endpoints
### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Audio Handling
- `POST /api/audio/upload` - Uploads an audio file
- `POST /api/audio/record` - Sends recorded audio
- `GET /api/audio/:id` - Retrieve processed audio

### ML Model Integration
- `POST /predict` (Python API) - Accepts audio input and returns processed audio

## Usage
1. Sign up or log in.
2. Upload or record an audio file.
3. Process the file through the ML model.
4. Play or download the converted accent audio.

## Future Enhancements
- Real-time processing via WebSockets
- Multiple accent options
- UI/UX improvements

## License
MIT License

