// background.js
// Messages for posture reminders
const postureMessages = [
    "Time to sit up straight! Check your posture.",
    "Posture check! Are your shoulders relaxed?",
    "Remember to align your spine and relax your shoulders.",
    "Posture reminder: Keep your head aligned with your spine.",
    "Are you slouching? Take a moment to correct your posture.",
    "Gentle reminder to check your sitting position.",
    "Time for a posture reset! Sit tall and roll your shoulders back.",
    "Don't forget to keep your monitor at eye level for better posture."
  ];
  
  // Get a random posture message
  function getRandomPostureMessage() {
    const randomIndex = Math.floor(Math.random() * postureMessages.length);
    return postureMessages[randomIndex];
  }
  
  // Handle messages from the popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'createPostureReminder') {
      const { minutes, recurring } = request.data;
      
      // Clear any existing posture reminder
      chrome.alarms.clear('postureReminder');
      
      // Create a new alarm
      chrome.alarms.create('postureReminder', {
        delayInMinutes: minutes,
        periodInMinutes: recurring ? minutes : null
      });
      
      // Save the settings
      chrome.storage.local.set({
        'postureReminderSettings': {
          active: true,
          minutes: minutes,
          recurring: recurring,
          createdAt: Date.now()
        }
      });
      
      console.log(`Posture reminder set to trigger every ${minutes} minutes`);
      sendResponse({ success: true });
      return true; // Keep the message channel open for async response
    }
    
    if (request.action === 'stopPostureReminders') {
      // Clear the alarm
      chrome.alarms.clear('postureReminder', function(wasCleared) {
        // Update the settings
        chrome.storage.local.set({
          'postureReminderSettings': {
            active: false
          }
        });
        
        console.log('Posture reminders stopped');
        sendResponse({ success: wasCleared });
      });
      
      return true; // Keep the message channel open for async response
    }
  });
  
  // Listen for alarm events
  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'postureReminder') {
      // Create and show the notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/posture.png',
        title: 'Posture Check!',
        message: getRandomPostureMessage(),
        priority: 2,
        requireInteraction: true // Makes the notification stay until user interacts with it
      });
    }
  });
  
  // When the extension is installed or updated
  chrome.runtime.onInstalled.addListener(function() {
    // Initialize settings
    chrome.storage.local.get('postureReminderSettings', function(data) {
      if (!data.postureReminderSettings) {
        chrome.storage.local.set({
          'postureReminderSettings': {
            active: false
          }
        });
      } else if (data.postureReminderSettings.active) {
        // Restore alarm if it was active
        chrome.alarms.create('postureReminder', {
          delayInMinutes: data.postureReminderSettings.minutes,
          periodInMinutes: data.postureReminderSettings.recurring ? data.postureReminderSettings.minutes : null
        });
      }
    });
  });