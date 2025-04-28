import * as faceapi from 'face-api.js';

type DetectionResult = faceapi.WithFaceDescriptor<
  faceapi.WithFaceLandmarks<
    faceapi.WithFaceDetection<object>,
    faceapi.FaceLandmarks68
  >
>;

export async function loadModels(): Promise<void> {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

export async function detectFaces(
  video: HTMLVideoElement
): Promise<DetectionResult[]> {
  return faceapi.detectAllFaces(video)
    .withFaceLandmarks()
    .withFaceDescriptors();
}