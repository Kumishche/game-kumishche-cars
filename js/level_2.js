import {show_modal} from "./functions.js";

const target = Math.round(Math.random()*1000) + 400;
const task = document.querySelector('.condition');
task.textContent = "Останови таймер, когда автомобиль проедет " + target + "км";

// const speed = Math.round(Math.random()*40);
const speed = 100;
const distance_text = document.querySelector('.distance')

let current_distance = 0;
const interval = setInterval(() => {
    current_distance += speed*0.1;
    distance_text.textContent = Math.floor(current_distance);
}, 50);

const check_btn = document.querySelector('.check-btn');
check_btn.addEventListener('click', () => {
    clearInterval(interval)
    if (Math.abs(current_distance-target) <= (target % 20)) {
        show_modal('win');
    } 
    else {
        show_modal('lose');
    }
})





