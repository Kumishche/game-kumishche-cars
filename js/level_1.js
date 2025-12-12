import {show_modal, hide_modal} from "./functions.js";

const speedOutput = document.querySelector('.speed');
const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');
const close_btn = document.querySelectorAll('.close-btn');
const help_btn = document.querySelector('.question-btn');
const distance = Math.round(Math.random()*1500);
const time = Math.round(Math.random()*150);
const task_1 = document.querySelector('.condition1');
const task_2 = document.querySelector('.condition2');
const final_score = document.querySelector('.final-score');
const final_time = document.querySelector('.final-time');

task_1.textContent = "Автомобиль проехал " + distance + "км";
task_2.textContent = "Время в дороге составило " + time + "ч";

let score;
let current_time = 0;
let interval = setInterval(() => {
        current_time += 100;
    }, 100);

const check_btn = document.querySelector('.check-btn');
check_btn.addEventListener('click', () => {
    const speed = Number(speedOutput.textContent);
    const eps = Math.abs(speed*time - distance);
    clearInterval(interval);
    console.log(current_time);
    console.log(eps);
    if (eps <= 100) {
        score = Math.round(100/(current_time/1000) + 100/Math.pow(eps, 2));
        show_modal('win');
        final_score.textContent = score;
        const min = Math.floor(current_time / 60000);
        const sec = Math.floor(current_time % 60000 / 1000);
        const ms = Math.floor(current_time % 1000);
        final_time.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
    } 
    else {
        show_modal('lose');
    }
})

const arrow = document.querySelector('.arrow');
const minAngle = -90; 
const maxAngle = 90;  

arrow.setAttribute('draggable', 'true');
arrow.addEventListener('dragstart', (e) => {
    arrow.style.cursor = 'grabbing';
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);
});

document.addEventListener('dragover', (e) => {
    const rect = arrow.parentElement.getBoundingClientRect();
    const pivotX = rect.left + rect.width / 2;
    const pivotY = rect.bottom - (rect.height * 0.3);
    
    const deltaX = e.clientX - pivotX;
    const deltaY = pivotY - e.clientY; 
    
    let angle = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
    if (angle < minAngle) angle = minAngle;
    if (angle > maxAngle) angle = maxAngle;
    
    arrow.style.transform = `rotate(${angle}deg)`;

    const speed = Math.round(((angle - minAngle) / 180).toFixed(3) * 500);
    speedOutput.textContent = Math.min(500, Math.max(0, speed));
});

pause_btn.addEventListener('click', () => {
    show_modal('pause');
    clearInterval(interval);
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
    interval = setInterval(() => {
        current_time += 100;
    }, 100);
});

help_btn.addEventListener('click', () => {
    show_modal('help');
    clearInterval(interval);
});

close_btn.addEventListener('click', () => {
    hide_modal('help');
    interval = setInterval(() => {
        current_time += 100;
    }, 100);
});