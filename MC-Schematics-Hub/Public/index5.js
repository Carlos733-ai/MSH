// Mapping game ID to actual download link
const downloadLinks = {
    "Country": "https://www.dropbox.com/scl/fi/hmkyjsgjmzf8foge9dk2c/Country-House.litematic?rlkey=5692d1ldk1bpijbm9ofyjlh5c&st=ytvv97bx&dl=1"
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
