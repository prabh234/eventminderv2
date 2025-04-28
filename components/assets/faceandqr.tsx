"use client"
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { BrowserQRCodeReader } from '@zxing/browser';

interface FaceResult {
  name: string;
  confidence: number;
}

const FaceRecognizerAndQr = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const [results, setResults] = useState<FaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [mode, setMode] = useState<'face' | 'qr'>('face');
  const codeReaderRef = useRef<BrowserQRCodeReader>(null);

  // Load models and initialize
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize face-api.js models
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);

        // Initialize QR code reader
        codeReaderRef.current = new BrowserQRCodeReader();

        // Load face descriptors
        const faces = await axios.get("/api/register").then((data) => data.data);
        const labeledDescriptors = faces.map((face: { id: string; descriptor: number[] }) =>
          new faceapi.LabeledFaceDescriptors(
            `user_${face.id}`,
            [new Float32Array(face.descriptor)]
          )
        );
        setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to initialize system');
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Start camera and detection loop
  useEffect(() => {
    if (!videoRef.current || loading) return;
 if (!faceMatcher || !videoRef.current) return;

    let stream: MediaStream;
    let intervalId: NodeJS.Timeout;

    const startDetection = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoRef.current!.srcObject = stream;

        intervalId = setInterval(async () => {
          if (!videoRef.current || !canvasRef.current) return;

          if (mode === 'face') {
            // Face recognition logic
            const detections = await faceapi
              .detectAllFaces(videoRef.current)
              .withFaceLandmarks()
              .withFaceDescriptors();

            if (faceMatcher) {
              const results = detections.map(face => {
                const bestMatch = faceMatcher.findBestMatch(face.descriptor);
                return {
                  name: bestMatch.label,
                  confidence: Math.round((1 - bestMatch.distance) * 100)
                };
              });
              setResults(results);
              updateFaceCanvas(detections, results);
            }
          } else {
            // QR code scanning logic
            try {
              const result = await new Promise<string | null>((resolve, reject) => {
                codeReaderRef.current!.decodeFromVideoElement(videoRef.current!, (result, error) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result?.getText() || null);
                  }
                });
              });
              if (result) setQrContent(result);
            } catch (error) {
                console.log(error);
              // Quietly handle no QR code found
            }
          }
        }, 100);
      } catch (err) {
        console.error(err);
        setError('Camera access denied');
      }
    };

    startDetection();

    return () => {
      clearInterval(intervalId);
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [faceMatcher, mode, loading]);

  const updateFaceCanvas = (
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
      <div className="mode-selector">
        <button onClick={() => setMode('face')} disabled={mode === 'face'}>
          Face Recognition
        </button>
        <button onClick={() => setMode('qr')} disabled={mode === 'qr'}>
          QR Scanner
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <video ref={videoRef} autoPlay muted playsInline />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>

      {mode === 'face' ? (
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
      ) : (
        <div className="qr-results">
          <h3>QR Code Content:</h3>
          {qrContent ? (
            <div className="qr-content">{qrContent}</div>
          ) : (
            <div className="qr-prompt">Scanning QR code...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceRecognizerAndQr;