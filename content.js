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
                <div id="camera-button" class="button">Do it</div>
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
        }` 

        style.innerHTML = rules;

        document.body.appendChild(reminder);
        document.head.appendChild(style);

        document.getElementById("posture-button").addEventListener("click", () => {
            document.body.removeChild(reminder);
        })

        document.getElementById("camera-button").addEventListener("click", () => {
            // THIS IS WHERE IT CONNECTS TO triggerCamera.js
        })
    }
                    


}