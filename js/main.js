import ScreenManager from './ScreenManager.js';


const screens = document.querySelectorAll(".screen");
const modals = document.querySelectorAll(".modal");
const screenManager = new ScreenManager(screens, modals);
const title = document.querySelector('.title');
// const header_menu = document.querySelector('.header-menu');
// const login_btn = document.querySelector('.login-btn');
// const pause_btn = document.querySelector('.pause-btn');
// const continue_btn = document.querySelector('.continue-btn');
// const stats = document.querySelector('.stats');

document.addEventListener('DOMContentLoaded', () => {
    screenManager.init();
});

const play_btn = document.querySelector(".play-btn");

play_btn.addEventListener("click", () => {
    screenManager.showModal('.levels');
});

// const home_btns = document.querySelectorAll('.home-btn');
// home_btns.forEach(button => {
//     button.addEventListener('click', () => {
//         screenManager.hideAllScreens();
//         title.textContent = 'Автомобили';
//         screenManager.showScreen('.main-menu');
//         header_menu.classList.remove('active');
//         login_btn.classList.add('active');
//         stats.classList.remove('active');
//     });
// });

const question_btn = document.querySelector('.question-btn');
question_btn.addEventListener('click', () => {
    screenManager.showModal('.help');
});

const chart_btn = document.querySelector('.chart_btn');
chart_btn.addEventListener('click', () => {
    screenManager.showModal('.rating');
});

const close_btns = document.querySelectorAll('.close-window-btn');
close_btns.forEach(button => {
    button.addEventListener('click', () => {
        screenManager.hide("." + button.closest('.modal, .screen').classList[1]);
    });
});


// level_btns.forEach(button => {
//     button.addEventListener('click', () => {
//         screenManager.showScreen('.game');
//         title.textContent = '';     
//         header_menu.classList.add('active');
//         login_btn.classList.remove('active');
//         stats.classList.add('active');
//     });

//     // LOCKED LEVELS
//     // button.addEventListener('hover', () => {
//     //     if (button.getda)
//     // });
// });


// pause_btn.addEventListener('click', () => {
//     screenManager.showModal('.pause')
//     // timer stops
// });

// continue_btn.addEventListener('click', () => {
//     screenManager.hide('.pause')
//     // timer starts
// });

// continue_btn.addEventListener('click', () => {
//     // reset stats
//     screenManager.showScreen('.game');
// });