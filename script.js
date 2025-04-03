// Function to show a specific page and hide others
function showPage(pageId) {
    document.querySelectorAll("div").forEach(div => {
        div.classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");
}

// Handle Login
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

// Handle Signup
function signUp() {
    let name = document.getElementById("signupName").value;
    let password = document.getElementById("signupPassword").value;

    if (name && password) {
        localStorage.setItem("user", name);
        document.getElementById("userName").innerText = name;
        showPage("dashboard");
    } else {
        alert("Please fill in all fields!");
    }
}

// Handle Logout
function logout() {
    localStorage.removeItem("user");
    showPage("landingPage"); // Return to login/signup page
}

// Save Medical History
function saveMedicalHistory() {
    let condition = document.getElementById("condition").value;
    let allergies = document.getElementById("allergies").value;
    let medications = document.getElementById("medications").value;

    if (condition || allergies || medications) {
        let historyList = document.getElementById("medicalHistoryList");
        let listItem = document.createElement("li");
        listItem.innerText = `Condition: ${condition}, Allergies: ${allergies}, Medications: ${medications}`;
        
        // Add delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "❌";
        deleteBtn.onclick = function() {
            historyList.removeChild(listItem);
        };
        listItem.appendChild(deleteBtn);
        
        historyList.appendChild(listItem);
    } else {
        alert("Please enter medical details!");
    }
}

// Set Medication Alarm & Save in Local Storage// Set Medication Alarm & Save in Local Storage
function setAlarm() {
    let medName = document.getElementById("medName").value;
    let medTime = document.getElementById("medTime").value;

    if (medName && medTime) {
        let alarm = { name: medName, time: medTime };
        let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
        alarms.push(alarm);
        localStorage.setItem("alarms", JSON.stringify(alarms));

        // Show confirmation message
        alert(`Alarm set for ${medTime} to take ${medName}!`);

        // Schedule alarm notification
        scheduleAlarm(alarm);

        // Update the reminders list
        updateReminders();
    } else {
        alert("Please enter medication name and time!");
    }
}


// Function to schedule the alarm
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

// Load and display saved alarms in Reminders
function updateReminders() {
    let reminderList = document.getElementById("reminderList");
    reminderList.innerHTML = "";
    let alarms = JSON.parse(localStorage.getItem("alarms")) || [];

    alarms.forEach((alarm, index) => {
        let listItem = document.createElement("li");
        listItem.innerText = `Take ${alarm.name} at ${alarm.time}`;

        // Add delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "❌";
        deleteBtn.onclick = function() {
            alarms.splice(index, 1);
            localStorage.setItem("alarms", JSON.stringify(alarms));
            updateReminders();
        };
        listItem.appendChild(deleteBtn);

        reminderList.appendChild(listItem);
    });
}

// Load reminders on page load
document.addEventListener("DOMContentLoaded", updateReminders);
