import ScreenManager from './ScreenManager.js';


const screens = document.querySelectorAll(".screen");
const modals = document.querySelectorAll(".modal");
const screenManager = new ScreenManager(screens, modals);

document.addEventListener('DOMContentLoaded', () => {
    screenManager.init();
});

const play_btn = document.querySelector(".play-btn");
const game = document.querySelector('.game');

play_btn.addEventListener("click", () => {
    game.classList.add('active');
})

const home_btns = document.querySelectorAll('.home-btn');
home_btns.forEach(button => {
    button.addEventListener('click', () => {
    screenManager.hideAllScreens();
    screenManager.showScreen('.main-menu');
    })
})