import {
  FaceDetector,
  FilesetResolver,
  // Detection
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let faceDetector;
let runningMode = "IMAGE";
export let isTooClose = false;

// Initialize the object detector
const initializefaceDetector = async () => {
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
initializefaceDetector();

let video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
let enableWebcamButton;

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// Keep a reference of all the child elements we create
// so we can remove them easilly on each render.
var children = [];

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
async function enableCam(event) {
  if (!faceDetector) {
    alert("Face Detector is still loading. Please try again..");
    return;
  }

  // Hide the button after activating camera:
  // enableWebcamButton.classList.add("removed");

  // getUsermedia parameters
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
    })
    .catch((err) => {
      console.error(err);
    });
}

let lastVideoTime = -1;
async function predictWebcam() {
  // if image mode is initialized, create a new classifier with video runningMode
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await faceDetector.setOptions({ runningMode: "VIDEO" });
  }
  let startTimeMs = performance.now();

  // Detect faces using detectForVideo
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const detections = faceDetector.detectForVideo(
      video,
      startTimeMs
    ).detections;
    displayVideoDetections(detections);
  }

  // Call this function again to keep predicting when the browser is ready
  window.requestAnimationFrame(predictWebcam);
}

// Estimate the distance based on the bounding box width
function estimateFaceDistance(faceWidth) {
  const screenThreshold = (2 / 5) * video.offsetWidth;
  return faceWidth >= screenThreshold;
}

function displayVideoDetections(detections) {
  // Remove any previous drawings
  for (let child of children) {
    liveView.removeChild(child);
  }
  children.splice(0);

  // Iterate through predictions and draw them to the live view
  for (let detection of detections) {
    const detectionBoxLeft =
      video.offsetWidth -
      detection.boundingBox.width -
      detection.boundingBox.originX;

    
    // Check if the face is too close based on bounding box width
    isTooClose = estimateFaceDistance(detection.boundingBox.width);

    const p = document.createElement("p");

    p.style =
      "left: " +
      detectionBoxLeft +
      "px;" +
      "top: " +
      (detection.boundingBox.originY - 30) +
      "px; " +
      "width: " +
      (detection.boundingBox.width - 10) +
      "px;";

    const highlighter = document.createElement("div");

    highlighter.setAttribute("class", "highlighter");

    highlighter.style =
      "left: " +
      detectionBoxLeft +
      "px;" +
      "top: " +
      detection.boundingBox.originY +
      "px;" +
      "width: " +
      (detection.boundingBox.width - 10) +
      "px;" +
      "height: " +
      detection.boundingBox.height +
      "px;";

    if (isTooClose) {
        p.innerText = "!!! Face too close to screen !!!";

        p.classList.add("red-background"); // Add red background class
        p.classList.remove("green-background"); // Remove green background class if exists

        highlighter.classList.add("red-background");
        highlighter.classList.remove("green-background");
        alert( "!!! Face too close to screen !!!");
    } else {
        p.innerText = "Good distance from screen";

        p.classList.add("green-background"); // Add green background class
        p.classList.remove("red-background"); // Remove red background class if exists

        highlighter.classList.add("green-background"); 
        highlighter.classList.remove("red-background");
    }

    liveView.appendChild(highlighter);
    liveView.appendChild(p);

    // Store drawn objects in memory so they are queued to delete at next call
    children.push(highlighter);
    children.push(p);

    // Display keypoints if available
    for (let keypoint of detection.keypoints) {
      const keypointEl = document.createElement("span");
      keypointEl.className = "key-point";
      keypointEl.style.top = `${keypoint.y * video.offsetHeight - 3}px`;
      keypointEl.style.left = `${
        video.offsetWidth - keypoint.x * video.offsetWidth - 3
      }px`;
      liveView.appendChild(keypointEl);
      children.push(keypointEl);
    }
  }
}
