import { isTooClose } from "./triggerCamera";

// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const setReminderButton = document.getElementById('set-reminder');
    const stopReminderButton = document.getElementById('stop-reminder');
    const intervalSelect = document.getElementById('interval');
    const statusDiv = document.getElementById('status');
    const activeReminderDiv = document.getElementById('active-reminder');
    
    // Check if a reminder is already active
    // checkActiveReminder();
    
    setReminderButton.addEventListener('click', function() {
      const hours = parseInt(intervalSelect.value, 10);
      
      // Calculate when the reminder should fire (in minutes)
      const minutes = hours * 60;
      
      // Send message to background script
      chrome.runtime.sendMessage({
        action: 'createPostureReminder',
        data: {
          minutes: minutes,
          recurring: true
        }
      }, function(response) {
        if (response && response.success) {
          showStatus(`Posture reminders set for every ${hours} hour${hours > 1 ? 's' : ''}.`, 'success');
          checkActiveReminder();
        } else {
          showStatus('Error setting reminder. Please try again.', 'error');
        }
      });
    });
    
    stopReminderButton.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: 'stopPostureReminders'
      }, function(response) {
        if (response && response.success) {
          showStatus('Posture reminders stopped.', 'success');
          stopReminderButton.style.display = 'none';
          setReminderButton.style.display = 'block';
          activeReminderDiv.style.display = 'none';
        } else {
          showStatus('Error stopping reminders. Please try again.', 'error');
        }
      });
    });
    
    // function checkActiveReminder() {
    //   chrome.storage.local.get('postureReminderSettings', function(data) {
    //     if (data.postureReminderSettings && data.postureReminderSettings.active) {
    //       const settings = data.postureReminderSettings;
    //       const hours = settings.minutes / 60;
          
    //       activeReminderDiv.textContent = `Currently reminding every ${hours} hour${hours > 1 ? 's' : ''}.`;
    //       activeReminderDiv.style.display = 'block';
          
    //       stopReminderButton.style.display = 'block';
    //       setReminderButton.style.display = 'none';
          
    //       // Set the select to the current interval
    //       intervalSelect.value = hours.toString();
    //     } else {
    //       activeReminderDiv.style.display = 'none';
    //       stopReminderButton.style.display = 'none';
    //       setReminderButton.style.display = 'block';
    //     }
    //   });
    // }
    
    function showStatus(message, type) {
      statusDiv.textContent = message;
      statusDiv.className = 'status';
      if (type === 'success') {
        statusDiv.classList.add('success');
      } else if (type === 'error') {
        statusDiv.classList.add('error');
      }
      
      // Hide status after 3 seconds
      setTimeout(function() {
        statusDiv.style.display = 'none';
      }, 3000);
    }
  });

