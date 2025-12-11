import {show_modal, hide_modal, hide_all_modals} from "./functions.js";


const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');
const restart_btn = document.querySelector('.restart-btn');
const question_btn = document.querySelector('.question-btn');
const close_btns = document.querySelectorAll('.close-btn');

document.addEventListener('DOMContentLoaded', () => {
    hide_all_modals();
});



pause_btn.addEventListener('click', () => {
    show_modal('pause');
    // timer stops
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
    // timer starts
});

restart_btn.addEventListener('click', () => {
    // reset stats
    
});

question_btn.addEventListener('click', () => {
    show_modal('help');
});

close_btns.forEach(button => {
    button.addEventListener('click', () => {
        hide_modal(button.closest('.modal').classList[1]);
    });
});