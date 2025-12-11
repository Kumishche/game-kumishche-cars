import {show_modal, hide_modal, hide_all_modals} from "./functions.js";

const play_btn = document.querySelector(".play-btn");
const question_btn = document.querySelector('.question-btn');
const chart_btn = document.querySelector('.chart-btn');
const close_btns = document.querySelectorAll('.close-btn');

document.addEventListener('DOMContentLoaded', () => {
    hide_all_modals();
});



play_btn.addEventListener("click", () => {
    show_modal('levels');
});

question_btn.addEventListener('click', () => {
    show_modal('help');
});

chart_btn.addEventListener('click', () => {
    show_modal('rating');
});

close_btns.forEach(button => {
    button.addEventListener('click', () => {
        hide_modal(button.closest('.modal').classList[1]);
    });
});