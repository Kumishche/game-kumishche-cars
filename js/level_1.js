import {show_modal} from "./functions.js";

const distance = Math.round(Math.random()*1500);
const task = document.querySelector('.condition');
task.textContent = "Автомобиль едет " + distance + "км";

const check_btn = document.querySelector('.check-btn');
check_btn.addEventListener('click', () => {
    const speedInput = document.querySelector('.speed');
    const timeInput = document.querySelector('.time');
    const speed = speedInput.value === "" ? 0 : Number(speedInput.value);
    const time = timeInput.value === "" ? 0 : Number(timeInput.value);

    console.log(speed);
    console.log(time);
    if (Math.ceil(distance / speed) == time) {
        show_modal('win');
    } 
    else {
        show_modal('lose');
    }
})