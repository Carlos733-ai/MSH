document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById("vip-popup");
    const countdownElem = document.getElementById("vip-countdown");

    let countdownInterval;
    let seconds = 20;

    // Download links stored securely in JS
    const downloadLinks = {
        "Overgrown": "https://www.dropbox.com/scl/fi/a4b4nsb8dqgc0cvgty8w3/Overgrown-Survival-Castle.litematic?rlkey=hh3ra4bjkt2zv3b7h7le97cvk&st=301qfbnm&dl=1"
    };

    // Expose start function to global scope
    window.startVipCountdown = function(gameId) {
        const downloadUrl = downloadLinks[gameId];
        if (!downloadUrl) {
            alert("Invalid download ID.");
            return;
        }

        seconds = 20;
        popup.style.display = "flex";
        countdownElem.textContent = seconds;

        countdownInterval = setInterval(() => {
            seconds--;
            countdownElem.textContent = seconds;

            if (seconds <= 0) {
                clearInterval(countdownInterval);
                popup.style.display = "none";
                triggerHiddenDownload(downloadUrl);
            }
        }, 1000);
    };

    window.useSkipPass = function() {
        alert("Coming soon: Skip passes will be available for purchase for the small price of 5 EGP.");
        // In the future, you can add logic to check if the user has a skip pass.
    };

    function triggerHiddenDownload(url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = '';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
