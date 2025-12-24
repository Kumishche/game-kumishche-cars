import {show_modal, hide_modal, getScores, updateScore} from "./functions.js";

const speedOutput = document.querySelector('.speed');
const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');
const help_btn = document.querySelector('.question-btn');
const speedometer = document.querySelector('.speedometer');

const task_1 = document.querySelector('.condition1');
const task_2 = document.querySelector('.condition2');
const final_score = document.querySelector('.final-score');
const final_time = document.querySelector('.final-time');
const complexity = document.querySelectorAll('.complexity-btn');
const username = document.querySelector('.username');

let score;
let current_time = 0;
let interval;

let speed_koef;
let time_koef;
let score_koef;

let distance;
let time;
let started = false;

document.addEventListener('DOMContentLoaded', () => {
    show_modal('complexity');
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        username.textContent = currentUser;
    };
});

complexity.forEach(button => {
    button.addEventListener('click', () => {
        hide_modal('complexity');

        switch (button.classList[1])
        {
            case 'easy':
                speed_koef = 2;
                time_koef = 1;
                score_koef = 1;
                break;
            case 'medium':
                speed_koef = 2;
                time_koef = 2;
                score_koef = 1.1;
                break;
            case 'hard':
                speed_koef = 3;
                time_koef = 2;
                score_koef = 1.2;
                break;
        }

        distance = 400 + Math.round(Math.random().toFixed(speed_koef)*10000);
        do {
            time = 10 + Math.round(Math.random().toFixed(time_koef)*100);
        } while (distance / time > 500);

        task_1.textContent = "Автомобиль проехал " + distance + "км";
        task_2.textContent = "Время в дороге составило " + time + "ч";

        started = true;
        interval = setInterval(() => {
            current_time += 100;
        }, 100);
    })
});


const check_btn = document.querySelector('.check-btn');
check_btn.addEventListener('click', () => {
    const speed = Number(speedOutput.textContent);
    const eps = Math.abs(speed*time - distance);
    clearInterval(interval);
    if (eps <= 300) {
        const normalizedTime = current_time / 1000;
        const normalizedEps = eps / 100;
        const baseScore = 800;
        const timePenalty = 1 + normalizedTime * 0.5;
        const accuracyPenalty = 1 + normalizedEps * 0.2;
        score = Math.round(score_koef * baseScore / (timePenalty * accuracyPenalty));
        score = Math.max(0, score);

        show_modal('win');
        final_score.textContent = score;
        const min = Math.floor(current_time / 60000);
        const sec = Math.floor(current_time % 60000 / 1000);
        const ms = Math.floor(current_time % 1000);
        final_time.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
    
        const login = localStorage.getItem('currentUser')
        const records = getScores(login);
        console.log(login);
        console.log(records);
        console.log(score);
        if (records[0] < score) {
            records[0] = score;
            updateScore(login, records);
        };
    } 
    else {
        show_modal('lose');
    };
});

const arrow = document.querySelector('.arrow');
const minAngle = -160; 
const maxAngle = 160;  

arrow.setAttribute('draggable', 'true');
arrow.addEventListener('dragstart', (e) => {
    arrow.style.cursor = 'grabbing';
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);
});

arrow.addEventListener('dragend', (e) => {
    arrow.style.cursor = 'grab';
});

speedometer.addEventListener('dragover', (e) => {
    const rect = arrow.parentElement.getBoundingClientRect();
    const pivotX = rect.left + rect.width / 2;
    const pivotY = rect.bottom - (rect.height * 0.3);
    
    const deltaX = e.clientX - pivotX;
    const deltaY = pivotY - e.clientY; 
    
    const range = (Math.abs(minAngle) + Math.abs(maxAngle));
    let angle = Math.atan2(deltaX, deltaY) * (range / Math.PI);
    if (angle < minAngle) angle = minAngle;
    if (angle > maxAngle) angle = maxAngle;
    
    arrow.style.transform = `rotate(${angle}deg)`;

    const speed = Math.round(((angle - minAngle) / range).toFixed(5) * 500);
    speedOutput.textContent = Math.min(500, Math.max(0, speed));
});

pause_btn.addEventListener('click', () => {
    show_modal('pause');
    clearInterval(interval);
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
    if (!started) return;
    interval = setInterval(() => {
        current_time += 100;
    }, 100);
});

help_btn.addEventListener('mouseenter', () => {
    show_modal('help');
    clearInterval(interval);
});

help_btn.addEventListener('mouseleave', () => {
    hide_modal('help');
    if (!started) return;
    interval = setInterval(() => {
        current_time += 100;
    }, 100);
});