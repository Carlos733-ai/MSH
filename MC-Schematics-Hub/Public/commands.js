// === DONATE CODE CHECK ===
const DONATE_CODE = "0114809910319313514112507"; // Replace with your actual secret code

let hasDonateAccess = localStorage.getItem('donateAccess') === 'true';

window.setDonateCode = function(code) {
  if (code === DONATE_CODE) {
    hasDonateAccess = true;
    localStorage.setItem('donateAccess', 'true');
    console.log("Donate access granted!");
    logConsoleCommand("Donate code accepted");  // Log successful code entry
  } else {
    hasDonateAccess = false;
    localStorage.removeItem('donateAccess');
    console.log("Invalid donate code.");
  }
};

// === DARK MODE TOGGLE ===
window.toggleDarkMode = function() {
  if (!hasDonateAccess) return console.warn("Access denied: Enter the Secret Donate code first.");
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  console.log(`Dark mode: ${isDark}`);
  logConsoleCommand("toggleDarkMode");
};

(function() {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
  }
})();

// === VIP TOGGLE ===
window.toggleVIP = function() {
  if (!hasDonateAccess) return console.warn("Access denied: Enter the donate code first.");
  const isVIP = localStorage.getItem("isVIP") === "true";
  if (isVIP) {
    localStorage.removeItem("isVIP");
    document.body.classList.remove("vip-mode");
    console.log("VIP mode disabled.");
    logConsoleCommand("toggleVIP (off)");
  } else {
    localStorage.setItem("isVIP", "true");
    document.body.classList.add("vip-mode");
    console.log("VIP mode enabled.");
    logConsoleCommand("toggleVIP (on)");
  }
};

(function() {
  const isVIP = localStorage.getItem("isVIP") === "true";
  if (isVIP) {
    document.body.classList.add("vip-mode");
    console.log("VIP UI applied on load.");
  }
})();

// === THEME TOGGLE ===
const themes = [
  "vip-neon", "vip-sun", "vip-drift"
];

window.SetTheme = function(n) {
  if (!hasDonateAccess) return console.warn("Access denied: Enter the donate code first.");
  if (n < 0 || n >= themes.length) {
    console.warn("Invalid theme number.");
    return;
  }
  themes.forEach(t => document.body.classList.remove(t));
  const newTheme = themes[n];
  document.body.classList.add(newTheme);
  localStorage.setItem("theme", newTheme);
  console.log(`Theme set to: ${newTheme}`);
  logConsoleCommand(`SetTheme(${n}) → ${newTheme}`);
};

(function() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && themes.includes(savedTheme)) {
    document.body.classList.add(savedTheme);
    console.log(`Theme loaded: ${savedTheme}`);
  }
})();

// === THEMES COMMAND ===
window.themes = function() {
  if (!hasDonateAccess) return console.warn("Access denied: Enter the donate code first.");
  console.log("Available themes:\n" + themes.map((t, i) => `${i}: ${t}`).join("\n"));
  logConsoleCommand("themes");
};

// === HELP COMMAND ===
window.Help = function() {
  logConsoleCommand("Help");
  console.log(`Available Console Commands:

toggleDarkMode() - Toggles dark mode
toggleVIP() - Toggles VIP mode
SetTheme(n) - Sets a theme by number
Help() - Displays this help message
listThemes() - Shows The Current Themes
Send("Message") - Sends A Message From The Discord Bot`);
};

// === SEND COMMAND ===
window.Send = function(message) {
  if (typeof message !== 'string' || !message.trim()) {
    console.warn("Send: Please provide a non-empty message string.");
    return;
  }
  console.log(`[Send] Sending message: ${message}`);

  fetch('/log-command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: "Send", message: message, timestamp: new Date().toISOString() })
  }).then(res => {
    if (!res.ok) {
      console.error("[Send] Server responded with error:", res.statusText);
    } else {
      console.log("[Send] Message sent successfully.");
    }
  }).catch(err => console.error("[Send] Sending failed:", err));

  logConsoleCommand(`Send(${message})`);
};

// === LOG TO SERVER ===
function logConsoleCommand(commandName) {
  console.log(`[logConsoleCommand] Sending command: ${commandName}`);
  fetch('/log-command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: commandName, timestamp: new Date().toISOString() })
  }).then(res => {
    if (!res.ok) {
      console.error("[logConsoleCommand] Server responded with error:", res.statusText);
    } else {
      console.log("[logConsoleCommand] Logged successfully");
    }
  }).catch(err => console.error("[logConsoleCommand] Logging failed:", err));
}
