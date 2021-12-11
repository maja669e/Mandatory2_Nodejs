document.addEventListener("DOMContentLoaded", burgerMenu);

function burgerMenu() {
    var burger = document.getElementById("myTopnav");

    if (burger.className === "topnav") {
        burger.className += " responsive";
    } else {
        burger.className = "topnav";
    }

}