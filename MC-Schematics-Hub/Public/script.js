// Unregister all service workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

// Logo movement on scroll
window.addEventListener("scroll", () => {
    const logo = document.getElementById("logo");
    if (window.scrollY > 50) {
        document.body.classList.add("scrolled");
    } else {
        document.body.classList.remove("scrolled");
    }
});
function checkVIPAccess(themeName) {
  const isVIP = localStorage.getItem('isVIP') === 'true';

  // List your VIP theme names here
  const vipThemes = ['vip-aurora'];

  if (vipThemes.includes(themeName) && !isVIP) {
    alert('🔒 VIP access required to use this theme!');
    console.log('VIP=False');
    return false; // block theme switch
  }

  console.log('VIP=True');
  setTheme(themeName); // call your existing theme switching function
  return true;
}


// Functions to be called from module script below (if needed)
// Or just keep the UI logic here, Supabase handled separately
