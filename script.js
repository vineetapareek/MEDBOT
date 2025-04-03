// ✅ Add Your Existing API Key Here
const API_KEY = "AIzaSyA7Wer3jMUqZzKKev5Zqn7NJFXauyzKrg4";

// ✅ Function to show a specific page and hide others
function showPage(pageId) {
    document.querySelectorAll("div").forEach(div => {
        div.classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");
}

// ✅ Handle Login
function login() {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    if (username && password) {
        localStorage.setItem("user", username);
        document.getElementById("userName").innerText = username;
        showPage("dashboard");
    } else {
        alert("Please enter username and password!");
    }
}

// ✅ Save Medical History Using Your API
function saveMedicalHistory() {
    let condition = document.getElementById("condition").value;
    let allergies = document.getElementById("allergies").value;
    let medications = document.getElementById("medications").value;

    if (condition || allergies || medications) {
        fetch("https://your-api-url.com/saveMedicalHistory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                username: localStorage.getItem("user"),
                condition: condition,
                allergies: allergies,
                medications: medications
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Medical history saved!");
        })
        .catch(error => {
            console.error("Error saving data: ", error);
        });
    } else {
        alert("Please enter medical details!");
    }
}

// ✅ Set Medication Alarm & Save Using Your API
function setAlarm() {
    let medName = document.getElementById("medName").value;
    let medTime = document.getElementById("medTime").value;

    if (medName && medTime) {
        let alarm = { name: medName, time: medTime };

        fetch("https://your-api-url.com/setAlarm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                username: localStorage.getItem("user"),
                name: medName,
                time: medTime
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(`Alarm set for ${medTime} to take ${medName}!`);
            scheduleAlarm(alarm);
            updateReminders();
        })
        .catch(error => {
            console.error("Error setting alarm: ", error);
        });
    } else {
        alert("Please enter medication name and time!");
    }
}

// ✅ Function to schedule the alarm
function scheduleAlarm(alarm) {
    let now = new Date();
    let alarmTime = new Date();
    let [hours, minutes] = alarm.time.split(":");
    alarmTime.setHours(hours, minutes, 0);

    let timeDiff = alarmTime - now;
    if (timeDiff < 0) timeDiff += 86400000; // If time has passed, set for next day

    setTimeout(() => {
        alert(`MEDBOT says: Time to take ${alarm.name}!`);
        updateReminders();
    }, timeDiff);
}

// ✅ Load Reminders from API
function updateReminders() {
    let reminderList = document.getElementById("reminderList");
    reminderList.innerHTML = "";

    fetch("https://your-api-url.com/getReminders", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    })
    .then(response => response.json())
    .then(alarms => {
        alarms.forEach((alarm, index) => {
            let listItem = document.createElement("li");
            listItem.innerText = `Take ${alarm.name} at ${alarm.time}`;

            // Add delete button
            let deleteBtn = document.createElement("button");
            deleteBtn.innerText = "❌";
            deleteBtn.onclick = function() {
                deleteReminder(alarm.id);
            };
            listItem.appendChild(deleteBtn);

            reminderList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error loading reminders: ", error);
    });
}

// ✅ Delete Reminder Using Your API
function deleteReminder(alarmId) {
    fetch(`https://your-api-url.com/deleteReminder/${alarmId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    })
    .then(() => {
        updateReminders();
    })
    .catch(error => {
        console.error("Error deleting reminder: ", error);
    });
}

// ✅ Load reminders on page load
document.addEventListener("DOMContentLoaded", updateReminders);
