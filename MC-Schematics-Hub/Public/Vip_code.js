function unlockVIP() {
  const code = document.getElementById('vip-code').value.trim();
  const feedback = document.getElementById('code-feedback');

  const SECRET_CODE = "911977185475415";

  if (code === SECRET_CODE || code === SECRET_CODE) {
    localStorage.setItem("isVIP", "true");
    document.getElementById('vip-status').textContent = "VIP Access: ✅";
    feedback.style.color = "limegreen";
    feedback.textContent = "🎉 VIP Unlocked! Redirecting...";

    console.log(`[VIP UNLOCKED] Code used: ${code}`);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } else {
    feedback.style.color = "red";
    feedback.textContent = "❌ Invalid code. Please try again.";
    console.log(`[VIP FAILED] Invalid code attempt: ${code}`);
  }
}
