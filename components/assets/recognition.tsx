"use client"
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';


interface FaceResult {
  name: string;
  confidence: number;
}

const FaceRecognizer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const [results, setResults] = useState<FaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load models and descriptors
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load face-api.js models
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);

        // Load descriptors from PostgreSQL
        const faces = await axios.get("/api/register").then((data)=>{return data.data})
        const labeledDescriptors: faceapi.LabeledFaceDescriptors[] = faces.map((face: { id: string; descriptor: number[] }) =>
          new faceapi.LabeledFaceDescriptors(
            `user_${face.id}`, // Or use a name field if you have one
            [new Float32Array(face.descriptor)]
          )
        );

        setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors));
        setLoading(false);
      } catch (err) {
        console.log(err);
        
        setError('Failed to initialize recognition system');
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Start camera and recognition loop
  useEffect(() => {
    if (!faceMatcher) return;

    let stream: MediaStream;
    let intervalId: NodeJS.Timeout;

    const startRecognition = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        
        intervalId = setInterval(async () => {
          if (!videoRef.current || !canvasRef.current) return;

          // Detect faces
          const detections = await faceapi
            .detectAllFaces(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptors();

          // Match faces
          const results = detections.map(face => {
            const bestMatch = faceMatcher.findBestMatch(face.descriptor);
            return {
              name: bestMatch.label,
              confidence: Math.round((1 - bestMatch.distance) * 100)
            };
          });

          setResults(results);
          updateCanvas(detections, results);
        }, 100);
      } catch (err) {
        console.log(err);
        
        setError('Camera access denied');
      }
    };

    startRecognition();

    return () => {
      clearInterval(intervalId);
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [faceMatcher]);

  const updateCanvas = (
    detections: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>>[],
    results: FaceResult[]
  ) => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight };

    faceapi.matchDimensions(canvas, displaySize);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    resizedDetections.forEach((detection, i) => {
      const box = detection.detection.box;
      const text = `${results[i].name} (${results[i].confidence}%)`;
      
      new faceapi.draw.DrawBox(box, { 
        label: text,
        boxColor: '#00ff00',
        lineWidth: 2
      }).draw(canvas);
    });
  };

  if (loading) return <div>Loading recognition system...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="recognizer">
      <div style={{ position: 'relative' }}>
        <video ref={videoRef} autoPlay muted playsInline />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>
      
      <div className="results">
        <h3>Recognized Faces:</h3>
        <ul>
          {results.map((result, i) => (
            <li key={i}>
              {result.name} - {result.confidence}% confidence
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FaceRecognizer;