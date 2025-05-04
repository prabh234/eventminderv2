"use client"
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const FaceRegister = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'registering' | 'error'>('loading');
  const [message, setMessage] = useState('Initializing face detection...');
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  // Load models and initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initializeFaceDetection = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);

        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise(resolve => {
            videoRef.current!.onloadedmetadata = resolve;
          });
          
          // Start face detection loop
          detectionInterval.current = setInterval(detectFace, 100);
          setStatus('ready');
          setMessage('Position your face in the frame');
        }
      } catch (err) {
        setStatus('error');
        setMessage(`Error: ${err instanceof Error ? err.message : 'Failed to initialize'}`);
      }
    };

    initializeFaceDetection();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (detection) {
      // Draw face detection box
      const dims = faceapi.matchDimensions(canvas, videoRef.current, true);
      const resizedDetection = faceapi.resizeResults(detection, dims);
      faceapi.draw.drawDetections(canvas, resizedDetection);
    }
  };

  const handleRegister = async () => {
    if (!videoRef.current) return;

    setStatus('registering');
    setMessage('Capturing face data...');

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatus('ready'); // Reset to ready state
        setMessage('No face detected - Please center your face and try again');
        return;
      }
      console.log(detection.descriptor);
      
      const response = await axios.post("/api/participant/registerface", {
        descriptor: Array.from(detection.descriptor),
      });

      if (response.status === 200) {
        setMessage('Face registered successfully!');
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      setStatus('ready'); // Reset to ready state on error
      setMessage('Registration failed - Please try again');
    } finally {
      setStatus('ready'); // Always reset to ready state after attempt
    }
  };

  return (
    <div className="face-register-container">
      <div className="video-wrapper">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="mirror-mode"
          style={{ transform: 'scaleX(-1)' }} // Added inline mirror flip
        />
        <canvas 
          ref={canvasRef}
          className="overlay-canvas"
          style={{ transform: 'scaleX(-1)' }} // Mirror canvas to match video
        />
        
        <div className="instruction-box">
          <p>{message}</p>
          <button 
            onClick={handleRegister}
            disabled={status === 'registering'} // Only disable during registration
            className={`register-btn ${status === 'ready' ? 'active' : ''}`}
          >
            {status === 'registering' ? 'Processing...' : 'Register Face'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceRegister;