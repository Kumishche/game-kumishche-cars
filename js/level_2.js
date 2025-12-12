import {show_modal, hide_modal} from "./functions.js";

const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');
const close_btn = document.querySelectorAll('.close-btn');
const help_btn = document.querySelector('.question-btn');
const final_score = document.querySelector('.final-score');
const final_time = document.querySelector('.final-time');
const target = Math.round(Math.random()*1000) + 400;
const task = document.querySelector('.condition');
task.textContent = "Останови таймер, когда автомобиль проедет " + target + "км";

// const speed = Math.round(Math.random()*40);
const speed = 100;
const distance_text = document.querySelector('.distance')

let current_distance = 0;
let score = 0;
let interval = setInterval(() => {
    current_distance += speed*0.1;
    distance_text.textContent = Math.floor(current_distance);
}, 50);

const check_btn = document.querySelector('.check-btn');
check_btn.addEventListener('click', () => {
    clearInterval(interval)
    score = Math.round(1/Math.pow(Math.abs((current_distance-target)/1000), 2));
    // console.log(Math.abs(current_distance-target) <= (target / 100 * 20));
    if (Math.abs(current_distance-target) <= (target / 100 * 20)) {
        final_score.textContent = score;
        const min = Math.floor(current_distance / 60000);
        const sec = Math.floor(current_distance % 60000 / 1000);
        const ms = Math.floor(current_distance % 1000);
        final_time.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
        show_modal('win');
    } 
    else {
        show_modal('lose');
    }
});


pause_btn.addEventListener('click', () => {
    show_modal('pause');
    clearInterval(interval);
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
    interval = setInterval(() => {
        current_time -= 150;
        const min = Math.floor(current_time / 60000);
        const sec = Math.floor(current_time % 60000 / 1000);
        const ms = Math.floor(current_time % 1000);
        time_text.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
        if (current_time <= 0) {
            clearInterval(interval);
            show_modal('lose');
        }
    }, 150);
});

help_btn.addEventListener('click', () => {
    show_modal('help');
    clearInterval(interval);
});

close_btn.addEventListener('click', () => {
    hide_modal('help');
    interval = setInterval(() => {
        current_distance += speed*0.1;
        distance_text.textContent = Math.floor(current_distance);
    }, 50);
});



pause_btn.addEventListener('click', () => {
    show_modal('pause');
    clearInterval(interval);
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
    interval = setInterval(() => {
        current_distance += speed*0.1;
        distance_text.textContent = Math.floor(current_distance);
    }, 50);
});

help_btn.addEventListener('click', () => {
    show_modal('help');
    clearInterval(interval);
});

close_btn.addEventListener('click', () => {
    hide_modal('help');
    interval = setInterval(() => {
        current_distance += speed*0.1;
        distance_text.textContent = Math.floor(current_distance);
    }, 50);
});

