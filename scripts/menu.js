/**
 * menu.js - Lädt das Navigationsmenü für alle Seiten
 */

document.addEventListener("DOMContentLoaded", function() {

    const oMenuToggle = document.getElementById("menu-toggle");
    const oLocalMenu = document.getElementById("local-menu");

    if (oMenuToggle && oLocalMenu) {
        oMenuToggle.addEventListener("click", function () {
            oLocalMenu.classList.toggle("active");
        });
    }

    fetch("../public/data/navigation.json")
        .then(response => response.json())
        .then(aMenuItems => {
            let oNav = document.getElementById("oNavigation");
            let oUl = document.createElement("ul");

            aMenuItems.forEach(oItem => {
                let oLi = document.createElement("li");
                let oA = document.createElement("a");
                oA.href = oItem.link;
                oA.innerText = oItem.text;
                oLi.appendChild(oA);
                oUl.appendChild(oLi);
            });

            oNav.appendChild(oUl);
        });
});
