import {show_modal, hide_modal, getScores, updateScore} from "./functions.js";

const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');
const close_btn = document.querySelector('.close-btn');
const help_btn = document.querySelector('.question-btn');
const final_score = document.querySelector('.final-score');
const complexity = document.querySelectorAll('.complexity-btn');
const target = Math.round(Math.random()*1000) + 400;
const task = document.querySelector('.condition');
const car = document.querySelector('.car');
task.textContent = "Останови таймер, когда автомобиль проедет " + target + "км";

const distance_text = document.querySelector('.distance')

let speed = 10;
let current_distance = 0;
let score = 0;
let interval;
let speed_koef = 1;
let score_koef = 1;

document.addEventListener('DOMContentLoaded', () => {
    show_modal('complexity');
});


let car_anim;

complexity.forEach(button => {
    button.addEventListener('click', () => {
        hide_modal('complexity');

        switch (button.classList[1])
        {
            case 'easy':
                speed_koef = 1;
                score_koef = 1;
                break;
            case 'medium':
                speed_koef = 1.3;
                score_koef = 1.1;
                break;
            case 'hard':
                speed_koef = 2;
                score_koef = 1.3;
                break;
        }

        speed *= speed_koef;
        interval = setInterval(() => {
            current_distance += speed;
            distance_text.textContent = Math.floor(current_distance);
        }, 50);

        car.style.animation = "moveRight 6s forwards infinite";
    });
});



const check_btn = document.querySelector('.check-btn');
check_btn.addEventListener('click', () => {
    clearInterval(interval);
    car.style.animationPlayState = 'paused';
    score = Math.round(score_koef * (1/(Math.pow(Math.abs((current_distance-target)/1000), 2)+0.001)));
    if (Math.abs(current_distance-target) <= 80) {
        final_score.textContent = score;
        show_modal('win');
        const login = localStorage.getItem('currentUser')
        const records = getScores(login);
        if (records[1] < score) {
            records[1] = score;
            updateScore(login, records);
        };
    } 
    else {
        show_modal('lose');
    }
});


pause_btn.addEventListener('click', () => {
    show_modal('pause');
    clearInterval(interval);
    car.style.animationPlayState = 'paused';
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
    interval = setInterval(() => {
        current_distance += speed*0.1;
        distance_text.textContent = Math.floor(current_distance);
    }, 50);
    car.style.animationPlayState = 'running';
});

help_btn.addEventListener('click', () => {
    show_modal('help');
    clearInterval(interval);
    car.style.animationPlayState = 'paused';
});


close_btn.addEventListener('click', () => {
    hide_modal('help');
    interval = setInterval(() => {
        current_distance += speed*0.1;
        distance_text.textContent = Math.floor(current_distance);
    }, 50);
    car.style.animationPlayState = 'running';
});

