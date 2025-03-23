/**
 * emissionsController.js - Steuerung für die Emissionen-Seite
 * 
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Emissionen-Seite geladen");
    // Sanftes Scrollen für interne Links unter Berücksichtigung des Headers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            let oTarget = document.querySelector(this.getAttribute("href"));

            if (oTarget) {
                let nHeaderOffset = document.querySelector("header").offsetHeight;
                let nElementPosition = oTarget.getBoundingClientRect().top + window.scrollY;

                // Scrollen mit Korrektur für den fixierten Header
                window.scrollTo({
                    top: nElementPosition - nHeaderOffset - 20, // 20px extra Abstand
                    behavior: "smooth"
                });
            }
        });
    });
});