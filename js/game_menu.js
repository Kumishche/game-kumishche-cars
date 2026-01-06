import {show_modal, hide_modal, hide_all_modals} from "./functions.js";
import { initializeStorage } from "./storage_validator.js";


const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');
const question_btn = document.querySelector('.question-btn');
const close_btns = document.querySelectorAll('.close-btn');

document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
    hide_all_modals();
});

pause_btn.addEventListener('click', () => {
    show_modal('pause');
});

question_btn.addEventListener('click', () => {
    show_modal('help');
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
});

close_btns.forEach(button => {
    button.addEventListener('click', () => {
        hide_modal(button.closest('.modal').classList[1]);
    });
});