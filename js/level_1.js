import {show_modal} from "./functions.js";

const distance = Math.round(Math.random()*1500);
const time = Math.round(Math.random()*150);
const task_1 = document.querySelector('.condition1');
const task_2 = document.querySelector('.condition2');
task_1.textContent = "Автомобиль проехал " + distance + "км";
task_2.textContent = "Время в дороге составило " + time + "ч";


const check_btn = document.querySelector('.check-btn');
check_btn.addEventListener('click', () => {
    const speedInput = document.querySelector('.speed');
    const speed = speedInput.value === "" ? 0 : Number(speedInput.value);

    if (Math.round(distance / time, 1) == Math.round(speed, 1)) {
        show_modal('win');
    } 
    else {
        show_modal('lose');
    }
})