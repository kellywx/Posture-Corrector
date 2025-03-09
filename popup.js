// CORRECT VERSION
const startButton = document.getElementById("start");
let toggle = false;
chrome.storage.local.get(["toggle"], (result) => {
    if (result.toggle) {
        toggle = result.toggle;
        if (toggle) {
            startButton.innerHTML = "Stop Reminder"
        } else {
            startButton.innerHTML = "Start Reminder"
        }
    }
})
startButton.addEventListener("click", () => {
    
    const interval = 5000;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (toggle) {
            // stop
            chrome.tabs.sendMessage(tab.id, { from: "popup", data: {
                msg: "stop"
            } });
            startButton.innerHTML = 'Start Reminder'
            toggle = false
        } else {
            // start
            chrome.tabs.sendMessage(tab.id, { from: "popup", data: {
                msg: "start",
                interval: interval
            } });
            startButton.innerHTML = 'Stop Reminder'
            toggle = true
        }
        chrome.storage.local.set({
            toggle: toggle
        })
    });
  });

