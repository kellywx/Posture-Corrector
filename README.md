# PosturePal

Presenting PosturePal! A Chrome extension designed to help users improve their posture and sitting position through a face-detection algorithm that provides instant feedback.


## Inspiration

Whether you are sitting at your desk, buried under a mountain of never-ending school assignments, or staring at the red error lines under your code during an intense 24-hour hackathon, everyone’s posture can be improved, especially those who find themselves hunched over like an old tortoise after a few hours in front of a computer. Bad posture can be damaging and lead to long-term health issues, which is why we created PostureBuddy. 

## What it does

Powered by the MediaPipe library, PosturePal uses a face detection algorithm to analyze your posture and provide instant feedback. Users can set how often they want to be reminded, and when the time comes, PosturePal analyzes the user's distance from the screen using the computerUsing your computer's camera.

PostureAI addresses the issue of poor posture among students and professionals who spend long hours at their desks. The extension uses AI-powered posture detection via webcam to analyze a user's sitting position and provide real-time feedback. If the user is too close from the screen, the extension displays corrective messages. Additionally, it allows users to set reminder intervals to encourage healthy posture habits, reducing the risk of chronic pain and discomfort.

### Features

1. **Real-time Posture Monitoring**

   The extension accesses the webcam to scan the user's face and measure the distance from the laptop screen.
   
   If the user is sitting too close or too far, the extension provides real-time feedback like “Too Close”
   
   If the posture is correct, a green indicator confirms “Good to go”.
   
   Users receive posture correction guidance based on detected deviations.

2. **Customizable Reminder Intervals**

   Users can set reminders at preferred intervals (every 60 minutes, 2 hours, or 4 hours).
   
   The extension sends gentle notifications as side pop-ups to prompt posture correction.

3. **Non-Intrusive & Easy to Use**

   No need for external devices—only a webcam and a Chrome browser are required.
   
   The extension runs in the background and provides real-time posture correction without disrupting workflow.


### User Stories

**As a student or professional** :

- I want to be reminded about my posture while working for long hours so that I don’t develop chronic pain or discomfort.

- I want to receive real-time feedback on my sitting position so that I can adjust my posture as needed.

- I want to set customized reminder intervals so that I can control how often I am prompted to check my posture.

- I want a simple and non-intrusive way to monitor my posture without needing to wear external devices.

**As a developer**:

- I want to use AI-based posture detection so that users can receive accurate real-time feedback.

- I want to provide users with easy-to-understand visual feedback so they can quickly correct their posture.

- I want the extension to be lightweight and efficient so that it does not slow down users' workflow.


## Getting Started

### Dependencies
* Google Chrome browser
* Operating System: Windows, macOS, Linux
* Webcam access enabled

### Installing

* Clone the repository:
* git clone https://github.com/kellywx/Posture-Corrector.git
* Navigate to chrome://extensions/ in your Chrome browser.
* Enable Developer Mode (toggle in the top-right corner).
* Click Load Unpacked and select the cloned project folder.
* The extension will now be installed and ready to use


### Executing program

* Open Chrome and ensure the extension is active.
* Click on the PostureAI extension icon to access settings.
* Allow webcam access for posture detection.
Adjust the reminder intervals as needed.
The extension will now monitor posture in real time and provide feedback.

## Help

For common issues:

* Ensure webcam access is granted.

* Restart Chrome if posture detection is not working.

* Check if the extension is enabled in chrome://extensions/.


## Authors

Contributors names and contact info

-Josceline @...
-Kelly @...
-Runtan @...
-Praneet @...

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the MIT License

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)
