let deviceData = {};

// Load devices.json
fetch("devices.json")
  .then(response => response.json())
  .then(data => {
    deviceData = data;
    console.log("✅ Devices loaded:", deviceData);
    showRandomTip();
  })
  .catch(error => console.error("Error loading devices.json:", error));

// Show random tip
const tips = [
  "Clean laptop fans every 6 months.",
  "Avoid charging overnight.",
  "Uninstall unused apps to improve speed.",
  "Use surge protectors for safety.",
  "Keep devices away from extreme heat."
];
function showRandomTip() {
  document.getElementById("tipText").innerText =
    tips[Math.floor(Math.random() * tips.length)];
}

// Autocomplete suggestions
function showSuggestions(query) {
  const suggestionsBox = document.getElementById("suggestions");
  suggestionsBox.innerHTML = "";
  if (!query) {
    suggestionsBox.style.display = "none";
    return;
  }

  const matches = Object.keys(deviceData).filter(d =>
    d.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  matches.forEach(device => {
    const div = document.createElement("div");
    div.textContent = device;
    div.onclick = () => {
      document.getElementById("deviceInput").value = device;
      suggestionsBox.style.display = "none";
    };
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
}

// Check lifespan
function checkLifespan() {
  const device = document.getElementById("deviceInput").value.trim();
  const year = parseInt(document.getElementById("yearInput").value);
  const currentYear = new Date().getFullYear();
  const resultDiv = document.getElementById("result");

  if (!deviceData[device]) {
    resultDiv.innerHTML = "❌ Device not found in database.";
    resetBattery();
    return;
  }

  const info = deviceData[device];
  const lifespanText = info.lifespan;
  let lifespanYears = 5;

  const match = lifespanText.match(/\d+/);
  if (match) lifespanYears = parseInt(match[0]);

  let age = year ? currentYear - year : 0;
  let remaining = Math.max(lifespanYears - age, 0);

  let usedPercent = Math.min((age / lifespanYears) * 100, 100);
  let remainingPercent = Math.max(100 - usedPercent, 0);

  updateBattery(remainingPercent);

  let msg = `
    <h2>${device}</h2>
    <p><strong>Lifespan:</strong> ${lifespanText}</p>
    <p><strong>Common Problems:</strong> ${info.problems}</p>
    <p><strong>Recycling Info:</strong> ${info.recycling}</p>
    <p><strong>Tips:</strong> ${info.tips}</p>
    <p><strong>Device Age:</strong> ${age} years</p>
    <p><strong>Estimated Remaining Life:</strong> ~${remaining} years</p>
  `;

  resultDiv.innerHTML = msg;
}

// Update battery meter
function updateBattery(percent) {
  const fill = document.getElementById("batteryFill");
  const percentText = document.getElementById("batteryPercent");
  fill.style.width = percent + "%";
  percentText.innerHTML = `🔋 Estimated Health: ${Math.round(percent)}<sup>%</sup>`;
}

// Reset battery meter
function resetBattery() {
  const fill = document.getElementById("batteryFill");
  const percentText = document.getElementById("batteryPercent");
  fill.style.width = "0%";
  percentText.innerHTML = `🔋 Estimated Health: 0<sup>%</sup>`;
}

// Dark mode toggle
document
  .getElementById("darkModeToggle")
  .addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

