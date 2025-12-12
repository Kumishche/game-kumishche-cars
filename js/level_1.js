import {show_modal} from "./functions.js";

const speedOutput = document.querySelector('.speed');
const distance = Math.round(Math.random()*1500);
const time = Math.round(Math.random()*150);
const task_1 = document.querySelector('.condition1');
const task_2 = document.querySelector('.condition2');
task_1.textContent = "Автомобиль проехал " + distance + "км";
task_2.textContent = "Время в дороге составило " + time + "ч";


const check_btn = document.querySelector('.check-btn');
check_btn.addEventListener('click', () => {
    const speed = Number(speedOutput.textContent);
    if (Math.ceil(distance / time) == Math.round(speed)) {
        show_modal('win');
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