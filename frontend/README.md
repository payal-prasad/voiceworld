# Google Meet Clone

A simple video conferencing application using mediasoup SFU for real-time communication.

## Features

- Join video conference rooms
- Share video and audio
- Real-time communication using WebRTC and mediasoup

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone or download the project.
2. Run `npm install` to install dependencies.

## Running the Application

1. Start the server: `npm start`
2. Open your browser and go to `http://localhost:3000`
3. Enter a room ID and click "Join Room"
4. Click "Start Video" to begin sharing your camera and microphone.

## Production Notes

- For production use, configure HTTPS as WebRTC requires secure contexts.
- Scale the mediasoup worker and router as needed for multiple rooms.
- Add authentication and room management for security.

## Technologies Used

- Backend: Node.js, Express, Socket.IO, mediasoup
- Frontend: HTML, JavaScript, mediasoup-client