"use client"
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import { AlertCircle, ArrowLeft, Loader, RefreshCw } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface Face {
  status: boolean;
  attendee: {
    id: string;
    fname: string;
    lname: string;
    Face: number[];
  }
}

interface AttendeeApiResponse {
  res: Face[];
}

const FaceAndQrRecognizer = ({ eventid,onAttendanceMarked  }: { eventid: string,onAttendanceMarked: () => void }) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'face' | 'qr'>('face');
  const [faceResult, setFaceResult] = useState<{ name: string; confidence: number } | null>(null);
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const scannerControls = useRef<IScannerControls | null>(null);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [attendees, setAttendees] = useState<Face[]>([]);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  // Load models and initialize face matcher (UNCHANGED)
  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        const { data } = await axios.get<AttendeeApiResponse>(`/api/moderator/attendence?id=${eventid}`);
        setAttendees(data.res);
        const labeledDescriptors = data.res.map((face: Face) =>
          new faceapi.LabeledFaceDescriptors(
            `${face.attendee.fname} ${face.attendee.lname}`,
            [new Float32Array(face.attendee.Face)]
          )
        );
        setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors));
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 300) {
          setError('No one participated in this event...');
        } else {
          console.error(err);
          setError('Failed to initialize system');
        }
        setLoading(false);
      }
    };
    initialize();
  }, [router, eventid]);

  // Face detection and canvas update (UNCHANGED)
  const updateFaceCanvas = useCallback((
    detection: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{
      detection: faceapi.FaceDetection;
    }, faceapi.FaceLandmarks68>> | null,
    result?: { name: string; confidence: number }
  ) => {
    // ... existing implementation
       const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;
    
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        if (detection) {
          const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetection = faceapi.resizeResults(detection, displaySize);
          new faceapi.draw.DrawBox(resizedDetection.detection.box, {
            label: result ? `${result.name} (${result.confidence}%)` : 'Recognizing...',
            boxColor: '#00ff00',
            lineWidth: 2
          }).draw(canvas);
        }
  }, []);

  // Face detection logic (UNCHANGED)
  const detectFace = useCallback(async () => {
    // ... existing implementation
      const detection = await faceapi
          .detectSingleFace(videoRef.current as faceapi.TNetInput)
          .withFaceLandmarks()
          .withFaceDescriptor();
    
        if (detection) {
          if (!faceMatcher) {
            console.error('FaceMatcher is not initialized');
            return;
          }
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          const result = {
            name: bestMatch.label,
            confidence: Math.round((1 - bestMatch.distance) * 100)
          };
          updateFaceCanvas(detection, result);
          setFaceResult(result);
        } else {
          updateFaceCanvas(null);
          setFaceResult(null);
        }
  }, [faceMatcher, updateFaceCanvas]);

  // ========== KEY FIXES START HERE ========== //
  
  // New camera initialization with retry logic
  const initializeCamera = useCallback(async () => {
    let retryCount = 0;
    const maxRetries = 3;

    const attemptInitialization = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        const facingMode = mode === 'face' ? 'user' : 'environment';
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          await new Promise<void>((resolve) => {
            if (!videoRef.current) return;
            videoRef.current.onloadedmetadata = () => resolve();
          });
          await videoRef.current.play();
        }

        if (mode === 'face') {
          detectionInterval.current = setInterval(detectFace, 300);
        } else {
          const codeReader = new BrowserQRCodeReader();
          if (videoRef.current) {
            const controls = await codeReader.decodeFromVideoElement(
              videoRef.current,
              (result) => result && setQrContent(result.getText())
            );
            scannerControls.current = controls;
          }
        }
      } catch (err) {
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 500));
          await attemptInitialization();
        } else {
          if (err instanceof DOMException && err.name === "NotAllowedError") {
            setError("Camera access was denied. Please allow camera access to use this feature.");
          } else {
            setError(err instanceof Error ? err.message : 'Camera access failed');
          }
        }
      }
    };

    await attemptInitialization();
  }, [mode, detectFace]);

  // Improved cleanup
  const cleanupCamera = useCallback(() => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
    if (scannerControls.current) {
      scannerControls.current.stop();
      scannerControls.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Camera management effect
  useEffect(() => {
    // let isMounted = true;

    const handleCamera = async () => {
      if (!loading && !error) {
        await cleanupCamera();
        await initializeCamera();
      }
    };

    handleCamera();

    return () => {
      // isMounted = false;
      cleanupCamera();
    };
  }, [mode, loading, error, cleanupCamera, initializeCamera]);

  // ========== KEY FIXES END HERE ========== //

useEffect(() => {
  const handleFaceMatch = async () => {
    if (faceResult && faceResult.confidence > 60) {
      const matchedAttendee = attendees.find(attendee => 
        `${attendee.attendee.fname} ${attendee.attendee.lname}` === faceResult.name
      );

      if (matchedAttendee && !processedIds.has(matchedAttendee.attendee.id)) {
        try {
          await axios.post('/api/moderator/attendence', {
            eventId: eventid,
            userId: matchedAttendee.attendee.id,
            status: true
          });
          
          setProcessedIds(prev => new Set([...prev, matchedAttendee.attendee.id]));
          onAttendanceMarked()
          toast.success(`Attendance marked for ${faceResult.name}`);
          setFaceResult(null);
        } catch (error) {
          console.error('Error updating attendance:', error);
          toast.error('Failed to mark attendance');
        }
      }
    }
  };

  handleFaceMatch();
}, [faceResult, attendees, eventid, processedIds,onAttendanceMarked]);

// Add this useEffect for handling QR code matches
useEffect(() => {
  const handleQrMatch = async () => {
    if (qrContent) {
      const matchedAttendee = attendees.find(attendee => 
        attendee.attendee.id === qrContent
      );

      if (matchedAttendee && !processedIds.has(matchedAttendee.attendee.id)) {
        try {
          await axios.post('/api/moderator/attendence', {
            eventId: eventid,
            userId: matchedAttendee.attendee.id,
            status: true
          });
          
          setProcessedIds(prev => new Set([...prev, matchedAttendee.attendee.id]));
          toast.success(`Attendance marked for ${matchedAttendee.attendee.fname}`);
          onAttendanceMarked();
          setQrContent(null);
        } catch (error) {
          console.error('Error updating attendance:', error);
          toast.error('Failed to mark attendance');
        }
      }
    }
  };

  handleQrMatch();
}, [qrContent, attendees, eventid, processedIds,onAttendanceMarked]);



  // Loading/error states (UNCHANGED)
 
{/* Loading State */}
if (loading) return (
  <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 dark:bg-gray-900/80 dark:text-gray-100 transition-colors duration-300">
    <div className="relative">
      <Loader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      <div className="absolute inset-0 rounded-full bg-blue-100/50 dark:bg-blue-900/20 animate-ping"></div>
    </div>
    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Initializing recognition system...</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few seconds</p>
  </div>
);

{/* Error State */}
if (error) return (
  <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-6 rounded-lg bg-red-50 dark:bg-red-950/50 border transition-colors duration-300 border-red-200 dark:border-red-800">
    <div className="flex items-center gap-2">
      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error</h3>
    </div>
    <p className="text-center text-red-700 dark:text-red-300">{error}</p>
    <Button 
      variant="outline" 
      className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
      onClick={() => window.location.reload()}
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Try Again
    </Button>
    <Button 
      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
      onClick={() => router.back()}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Return To Edit Page
    </Button>
  </div>
);

  return (
    <div className="flex flex-col items-center gap-6 p-4 max-w-4xl mx-auto">
      <div className="flex gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
        <button
          onClick={() => setMode('face')}
          className={`px-4 py-2 rounded-md ${
            mode === 'face' ? 'bg-blue-600 text-white' : 'bg-transparent'
          }`}
        >
          Face Recognition
        </button>
        <button
          onClick={() => setMode('qr')}
          className={`px-4 py-2 rounded-md ${
            mode === 'qr' ? 'bg-blue-600 text-white' : 'bg-transparent'
          }`}
        >
          QR Scanner
        </button>
      </div>

      {/* Video container with fixed aspect ratio */}
      <div className="relative w-full max-w-2xl mx-auto aspect-video bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: mode === 'face' ? 'scaleX(-1)' : 'none' }}
        />
        {mode === 'face' && (
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}
      </div>
      {/* ... existing QR code display ... */}
{qrContent && !processedIds.has(qrContent) && (
  <div className="mt-2 text-yellow-600">Valid QR code detected - processing...</div>
)}

{faceResult && faceResult.confidence > 60 && !processedIds.has(
  attendees.find(a => `${a.attendee.fname} ${a.attendee.lname}` === faceResult.name)?.attendee.id || ''
) && (
  <div className="mt-2 text-yellow-600">Valid face match detected - processing...</div>
)}

      <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        {mode === 'face' ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recognition Results</h3>
            {faceResult ? (
              <div className="text-green-600">
                {faceResult.name} - {faceResult.confidence}% confidence
              </div>
            ) : (
              <div className="text-gray-500">No face detected</div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">QR Code Content</h3>
            {qrContent ? (
              <div className="break-all font-mono bg-gray-100 p-3 rounded">
                {qrContent}
              </div>
            ) : (
              <div className="text-gray-500">Scan QR code to continue</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceAndQrRecognizer;