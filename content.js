window.onload = () => {
    let time = null;
    let reminder = null;
    console.log("hlo")
    chrome.runtime.onMessage.addListener((request) => {
        console.log("got msg")
        if (request.from === "popup" && request.data.msg === "start") {
            time = setInterval(showReminder, request.data.interval);
        } else if (request.from === "popup" && request.data.msg === "stop") {
            clearInterval(time);
            console.log("clear")
            time = null;
        }
        // sendResponse({ status: "Received" });
      });
      
    function showReminder() {
        reminder = document.createElement("div");
        reminder.innerHTML = `
        <div id="posture-div">
            <p id="posture-heading">Correct your posture!</p>
            <div id="button-container">
                <div id="posture-button" class="button">OK</div>
                <div id="liveView" class="videoView">
                    <button id="webcamButton" class="mdc-button mdc-button--raised">
                        <span class="mdc-button_ripple"></span>
                        <span class="mdc-button_label">Camera</span>
                    <button>
                    <video id="webcam" autoplay playsinline></video>
                </div>
            </div>
        </div>`;
        const style = document.createElement('style');
        const rules = `
        #posture-heading {
            font-size: 18px;
             color: red;
             margin-bottom: 15px;
        }

        .button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 90px;
            height: 40px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: red;
            color: white;
            text-align: center;
            cursor: pointer;
            border-radius: 8px;
        }

        #button-container {
            display: flex;
            justify-content: center;
            gap: 10px; 
        }

        #posture-div {
            position: fixed;
            top: 50vh;
            left: 50vw;
            z-index: 5;
            padding: 20px;
            border-radius: 10px;
            background-color: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
            
        


        video {
            clear: both;
            display: block;
            transform: rotateY(180deg);
             -webkit-transform: rotateY(180deg);
            -moz-transform: rotateY(180deg);
        }

        section {
            opacity: 1;
             transition: opacity 500ms ease-in-out;
        }
        
        .mdc-button.mdc-button--raised.removed {
            display: none;
        }

        .invisible {
            opacity: 0.2;
        }
        
        .videoView,
        .detectOnClick {
            position: relative;
            float: left;
            width: 48%;
            margin: 2% 1%;
             cursor: pointer;
        }

        .detectOnClick p {
            position: absolute;
            padding: 5px;
            background-color: #007f8b;
            color: #fff;
            border: 1px dashed rgba(255, 255, 255, 0.7);
            z-index: 2;
            font-size: 12px;
            margin: 0;
        }     

        .videoView p {
            position: absolute;
            padding-bottom: 5px;
            padding-top: 5px;
            /* background-color: #007f8b; */
            color: #fff;
            border: 1px dashed rgba(255, 255, 255, 0.7);
            z-index: 2;
            font-size: 16px;
            margin: 0;
            text-align: center;
            font-weight: bold;
        }


        .highlighter {
            /* background: rgba(0, 255, 0, 0.25); */
            border: 1px dashed #fff;
            z-index: 1;
            position: absolute;
            font-size: 16px;
        }
  
        .detectOnClick {
            z-index: 0;
        }
  
        .detectOnClick img {
            width: 100%;
        }
  
        .key-point {
            position: absolute;
            z-index: 1;
            width: 3px;
            height: 3px;
            background-color: #ff0000;
            border-radius: 50%;
            display: block;
        }
  
        /* Class for red background (when too close) */
        .red-background {
        background-color: rgba(255, 0, 0, 0.3); 
        }

        /* Class for green background (good distance) */
            .green-background {
            background-color: rgba(0, 255, 255, 0.3); 
        } 
        ` 

        style.innerHTML = rules;

        document.body.appendChild(reminder);
        document.head.appendChild(style);



        // Load external scripts and styles dynamically
    const scripts = [
        "triggerCamera.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0",
        "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js",
        "https://cdn.jsdelivr.net/npm/@material/web@latest/dist/mdc.web.min.js"
    ];

    scripts.forEach(src => {
        let script = document.createElement("script");
        script.src = src;
        script.type = src.includes("mediapipe") ? "module" : "text/javascript";
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
    });

    // Load Material Components CSS
    const styles = [
        "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css",
        "https://cdn.jsdelivr.net/npm/@material/web@latest/dist/mdc.web.min.css"
    ];

    styles.forEach(href => {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    });




        document.getElementById("posture-button").addEventListener("click", () => {
            document.body.removeChild(reminder);
        })

        document.getElementById("webcam-button").addEventListener("click", () => {
            // ???? how to connect triggerCamera.js?
        })

    }
}