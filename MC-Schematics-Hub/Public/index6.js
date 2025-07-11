// Mapping game ID to actual download link
const downloadLinks = {
    "Farmhouse": "https://www.dropbox.com/scl/fi/b7c7gysjsx3xs2raw4j42/Medival-Farmhouse.schem?rlkey=qf614865a8ekdf313l81zq5y9&st=2t6ucwm4&dl=0"
};

function startVipCountdown(gameId) {
    const popup = document.getElementById("vip-popup");
    const countdown = document.getElementById("vip-countdown");

    const downloadUrl = downloadLinks[gameId];
    if (!downloadUrl) {
        alert("Download link not found.");
        return;
    }

    let seconds = 20;
    popup.style.display = "flex";
    countdown.textContent = seconds;

    const interval = setInterval(() => {
        seconds--;
        countdown.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(interval);
            popup.style.display = "none";
            window.location.href = downloadUrl;
        }
    }, 1000);
}

function useSkipPass() {
    alert("Coming soon: Skip passes will be available for purchase for the small price of 5 EGP.");
    // Future feature: check if the user has a skip pass and skip the countdown
}
