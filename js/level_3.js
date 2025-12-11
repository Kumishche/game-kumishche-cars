import {show_modal, hide_modal} from "./functions.js";


const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');

const time = 120*1000;
const time_text = document.querySelector('.time');
let current_time = time;
time_text.textContent = current_time;

let score = time;

let interval = setInterval(() => {
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

const car = document.querySelector('.car');
const road = document.querySelector('.road');
const finish = document.querySelector('.finish');
document.addEventListener("dragover", e => {
    e.preventDefault();
    const rect = road.getBoundingClientRect();
    const y = e.clientY;

    const isTopOut = (y - rect.top - (car.offsetHeight / 2) + 10) < 0;
    const isBottomOut = (y - rect.bottom + (car.offsetHeight / 2) - 5) > 0;
    const isVerticallyOut = isTopOut || isBottomOut;

    if (isVerticallyOut) {
        current_time -= 400;
        road.classList.add('active');
    }
    else
    {
        road.classList.remove('active');
    }
});

road.addEventListener("drop", (e) => {
    e.preventDefault();
    const dragged = document.querySelector('.car');
    dragged.style.position = "absolute";

    const rect = road.getBoundingClientRect();
    const x = e.clientX - rect.left - dragged.offsetWidth / 2;
    const y = e.clientY - rect.top - dragged.offsetHeight / 2;

    dragged.style.left = x + "px";
    dragged.style.top = y + "px";

    if (dragged.getBoundingClientRect().left >= finish.getBoundingClientRect().left) {
        clearInterval(interval);
        show_modal('win');
    }
});

road.addEventListener("click", (e) => {
    if (e.target.classList.contains("word")) {
        const span = document.createElement("span");
        span.textContent = e.target.textContent + " ";
        span.style.color = e.target.style.backgroundColor;
        output.appendChild(span);
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