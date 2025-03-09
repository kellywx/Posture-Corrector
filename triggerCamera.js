import { FaceDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let faceDetector;
let runningMode = "IMAGE";
let currentStream = null;
export let isTooClose = false;

let video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
let reminderIntervalId = null;
let timeoutId = null; // Track timeout for camera duration
let isWebcamRunning = false; // Track webcam state
let children = [];
let lastVideoTime = -1;

// Initialize the face detector
const initializeFaceDetector = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
      delegate: "GPU",
    },
    runningMode: runningMode,
  });
};
initializeFaceDetector();

// Check if webcam access is supported
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia();

// Start the webcam
async function enableCam() {
  if (!faceDetector) {
    alert("Face Detector is still loading. Please try again.");
    return;
  }

  const constraints = { video: true };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
    video.style.display = "block"; // Show video element

    video.addEventListener("loadeddata", predictWebcam);
    isWebcamRunning = true; // Mark webcam as running
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Could not access webcam.");
  }
}

// Webcam prediction loop
async function predictWebcam() {
  if (!video.srcObject) {
    console.warn("Video stream is not available.");
    return;
  }

  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await faceDetector.setOptions({ runningMode: "VIDEO" });
  }

  let startTimeMs = performance.now();

  // Detect faces
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const detections = faceDetector.detectForVideo(video, startTimeMs).detections;
    displayVideoDetections(detections);
  }

  window.requestAnimationFrame(predictWebcam);
}

// Estimate the distance from the face to the screen
function estimateFaceDistance(faceWidth) {
  const screenThreshold = (2 / 5) * video.offsetWidth;
  return faceWidth >= screenThreshold;
}

// Display face detection results
function displayVideoDetections(detections) {
  for (let child of children) {
    liveView.removeChild(child);
  }
  children.splice(0);

  for (let detection of detections) {
    const detectionBoxLeft = video.offsetWidth - detection.boundingBox.width - detection.boundingBox.originX;
    isTooClose = estimateFaceDistance(detection.boundingBox.width);

    const p = document.createElement("p");
    p.style = `left: ${detectionBoxLeft}px; top: ${(detection.boundingBox.originY - 30)}px; width: ${(detection.boundingBox.width - 10)}px;`;

    const highlighter = document.createElement("div");
    highlighter.setAttribute("class", "highlighter");
    highlighter.style = `left: ${detectionBoxLeft}px; top: ${detection.boundingBox.originY}px; width: ${(detection.boundingBox.width - 10)}px; height: ${detection.boundingBox.height}px;`;

    if (isTooClose) {
      p.innerText = "!!! Face too close to screen !!!";
      p.classList.add("red-background");
      p.classList.remove("green-background");

      highlighter.classList.add("red-background");
      highlighter.classList.remove("green-background");

      showBrowserNotification("!!! You are probably slouched !!!");
    } else {
      p.innerText = "Good distance from screen";
      p.classList.add("green-background");
      p.classList.remove("red-background");

      highlighter.classList.add("green-background");
      highlighter.classList.remove("red-background");
    }

    liveView.appendChild(highlighter);
    liveView.appendChild(p);
    children.push(highlighter);
    children.push(p);

    for (let keypoint of detection.keypoints) {
      const keypointEl = document.createElement("span");
      keypointEl.className = "key-point";
      keypointEl.style.top = `${keypoint.y * video.offsetHeight - 3}px`;
      keypointEl.style.left = `${video.offsetWidth - keypoint.x * video.offsetWidth - 3}px`;
      liveView.appendChild(keypointEl);
      children.push(keypointEl);
    }
  }
}

// Stop the camera
function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
    video.srcObject = null;
    video.style.display = "none";
    console.log("Webcam stopped");
  }

  isWebcamRunning = false; // Mark webcam as stopped
  hideDetectionElements();
}

// Hide all detection elements
function hideDetectionElements() {
  const liveView = document.getElementById("liveView");
  const highlighters = liveView.querySelectorAll(".highlighter");
  const paragraphs = liveView.querySelectorAll("p");
  const keypoints = liveView.querySelectorAll(".key-point");

  highlighters.forEach(el => el.style.display = "none");
  paragraphs.forEach(el => el.style.display = "none");
  keypoints.forEach(el => el.style.display = "none");

  console.log("Detection elements hidden.");
}

// Re-initialize the face detection model
async function reinitializeFaceDetector() {
  try {
    await initializeFaceDetector();
    console.log("Face detector re-initialized.");
  } catch (error) {
    console.error("Error re-initializing face detector:", error);
  }
}

// Set reminder to start webcam at specific intervals
function startReminder(interval) {
  // Clear any existing interval
  if (reminderIntervalId) {
    clearInterval(reminderIntervalId);
  }

  // Function to toggle camera on and off
  function toggleCamera() {
    if (isWebcamRunning) {
      stopCamera();
    } else {
      enableCam();
    }
  }

  // Start the interval to toggle the camera
  reminderIntervalId = setInterval(() => {
    // Toggle camera on for 5 seconds
    toggleCamera();
    
    timeoutId = setTimeout(() => {
      // After 5 seconds, stop the camera
      if (isWebcamRunning) {
        stopCamera();
      }
    }, 5000); // Camera stays on for 5 seconds

  }, interval); // Set the interval between camera toggles
}

// Handle reminder interval change
document.getElementById("reminderInterval").addEventListener("change", (event) => {
  const interval = parseInt(event.target.value) * 1000; // Convert seconds to milliseconds
  startReminder(interval);
});

// Attach event listener to the "SETUP TIMER" button
document.getElementById("webcamButton").addEventListener("click", () => {
  const interval = parseInt(document.getElementById("reminderInterval").value) * 1000; // Convert seconds to milliseconds
  startReminder(interval);
  console.log("Reminder set successfully.");
});

// Attach event listener to the "Cancel" button
document.getElementById("cancelButton").addEventListener("click", () => {
  stopCamera();
  if (reminderIntervalId) {
    clearInterval(reminderIntervalId);
    reminderIntervalId = null;
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  console.log("Reminder canceled.");
});

// Function to show the browser notification
function showBrowserNotification(message) {
  if (Notification.permission === "granted") {
    const notification = new Notification("Face Detection Alert", {
      body: message,
      // icon: "icon.png",  // Optional: Add an icon if needed
    });
    
    // Close notification after a few seconds
    setTimeout(() => {
      notification.close();
    }, 5000); // Notification will disappear after 5 seconds
  } else {
    console.log("Notification permission not granted.");
  }
}
