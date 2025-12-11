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
});

const home_btns = document.querySelectorAll('.home-btn');
home_btns.forEach(button => {
    button.addEventListener('click', () => {
    screenManager.hideAllScreens();
    screenManager.showScreen('.main-menu');
    });
});


const question_btn = document.querySelector('.question-btn');
question_btn.addEventListener('click', () => {
    screenManager.showModal('.help');
});

const chart_btn = document.querySelector('.chart_btn');
chart_btn.addEventListener('click', () => {
    screenManager.showScreen('.rating');
});

const close_btns = document.querySelectorAll('.close-window-btn');
close_btns.forEach(button => {
    button.addEventListener('click', () => {
        screenManager.hide("." + button.closest('.modal, .screen').classList[1]);
        screenManager.showScreen('.main-menu');
    });
});