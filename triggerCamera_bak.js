// Ensure you load the required MediaPipe Tasks Vision library
import { FaceDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

// HTML element references
const videoElement = document.getElementById("video");
const liveView = document.getElementById("liveView");
let faceDetector;

// Load the Face Detection model
export const initializeFaceDetector = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      faceDetector = await FaceDetector.createFromModelPath(vision, 
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite", 
        { runningMode: 'VIDEO' }
      );
      console.log("Face Detector initialized");
    } catch (error) {
      console.error("Error initializing Face Detector: ", error);
    }
};
// Function to start webcam feed and detect faces
export const startWebcam = async () => {
  // Ensure the face detector is initialized
  if (!faceDetector) {
    console.log("Face detector is loading, please wait...");
    return;
  }

  // Access the webcam
  const constraints = {
    video: true
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    videoElement.addEventListener("loadeddata", predictWebcam);
  } catch (err) {
    console.error("Error accessing webcam: ", err);
  }
};

// Function to predict faces on each video frame
let lastVideoTime = -1;
async function predictWebcam() {
    if (!faceDetector) {
        console.error('Face detector is not initialized!');
        return;
    }
  const startTimeMs = performance.now();
  console.log("Starting frame prediction at:", startTimeMs);
  const detections = await faceDetector.detectForVideo(videoElement, startTimeMs);

  displayVideoDetections(detections.detections);

  window.requestAnimationFrame(predictWebcam);  // Keep detecting on next frame
}

// Function to display the bounding box and estimate the distance
function displayVideoDetections(detections) {
  // Clear any previous drawing
  liveView.innerHTML = "";

  // Iterate over each detection (in case of multiple faces)
  for (let detection of detections) {
    const { boundingBox } = detection;

    // Calculate the "distance" based on the bounding box area (this is a simplified method)
    const faceWidth = boundingBox.width;
    const faceHeight = boundingBox.height;
    const area = faceWidth * faceHeight;
    const distance = estimateDistance(area); // Estimating distance based on face area

    // Create the bounding box and info display
    const highlighter = document.createElement("div");
    highlighter.setAttribute("class", "highlighter");
    highlighter.style = `left: ${boundingBox.originX}px; top: ${boundingBox.originY}px; width: ${boundingBox.width}px; height: ${boundingBox.height}px;`;

    const info = document.createElement("p");
    info.classList.add("info");
    info.innerText = `Distance Estimate: ${Math.round(distance)} cm`;

    // Append to live view
    liveView.appendChild(highlighter);
    liveView.appendChild(info);
  }
}

// Function to estimate the distance based on face area (bounding box size)
function estimateDistance(faceArea) {
  // A simple inverse relationship between the face area and distance to the camera.
  // This is a mock function. You'll need a calibration model to refine this.
  const focalLength = 500; // Adjust based on the camera's focal length or assumptions
  const realFaceWidth = 14; // Approximate real width of a face in cm (can be adjusted)

  // Assume that a larger bounding box means the face is closer to the camera
  const distance = focalLength * realFaceWidth / Math.sqrt(faceArea);
  return distance;
}

// Start the webcam feed and face detection once the page is ready
initializeFaceDetector();
