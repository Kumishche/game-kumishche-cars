import {show_modal, hide_modal, getScores, updateScore} from "./functions.js";


const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');
const help_btn = document.querySelector('.question-btn');
const close_btn = document.querySelector('.close-btn');
const final_score = document.querySelector('.final-score');
const final_time = document.querySelector('.final-time');
const complexity = document.querySelectorAll('.complexity-btn');

let time = 0;
let current_time;
let num_obstacles = 5;
const time_text = document.querySelector('.time');
let score = 0;
let score_koef = 1;
time_text.textContent = current_time;

let crashed = false;
let interval;

document.addEventListener('DOMContentLoaded', () => {
    show_modal('complexity');
});

complexity.forEach(button => {
    button.addEventListener('click', () => {
        hide_modal('complexity');

        switch (button.classList[1])
        {
            case 'easy':
                time = 5;
                num_obstacles = 4;
                score_koef = 1;
                break;
            case 'medium':
                time = 8;
                num_obstacles = 5;
                score_koef = 1.15;
                break;
            case 'hard':
                time = 6;
                num_obstacles = 6;
                score_koef = 2;
                break;
        }
    
        create_obstacles(num_obstacles);
        time *= 1000;
        current_time = time;
        interval = setInterval(() => {
            current_time -= 150;
            const min = Math.floor(current_time / 60000);
            const sec = Math.floor(current_time % 60000 / 1000);
            const ms = Math.floor(current_time % 1000);
            time_text.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
            if (current_time <= 0) {
                clearInterval(interval);
                time_text.textContent = "о нет..";
                show_modal('lose');
            }
        }, 150);
    });
});

let crashCheckInterval;

const car = document.querySelector('.car');
const road = document.querySelector('.road');
const finish = document.querySelector('.finish');

const rect = road.getBoundingClientRect();

car.addEventListener('dragstart', (e) => {
    car.classList.add('active');
    e.dataTransfer.setData('type', 'car');
    const carRect = car.getBoundingClientRect();
    const offsetX = e.clientX - carRect.left;
    const offsetY = e.clientY - carRect.top;
    
    car.dataset.dragOffsetX = offsetX;
    car.dataset.dragOffsetY = offsetY;
})

car.addEventListener('dragend', (e) => {
    clearInterval(crashCheckInterval);
});

document.addEventListener("dragover", e => {
    e.preventDefault();
    const rect = road.getBoundingClientRect();
    const x = e.clientX - car.dataset.dragOffsetX;
    const y = e.clientY - car.dataset.dragOffsetY;

    //!!!!!!!!!!!!!!!!!
    // ДЛЯ УжАСА:
    // car.style.bottom = new_y + "px";
    //!!!!!!!!!!!!!!!!!!!!!!!!!!

    const isTopOut = (y - rect.top + 14) < 0;
    const isBottomOut = (y - rect.bottom + car.offsetHeight - 6) > 0;
    const isLeftOut = (x - rect.left + 6) < 0;
    const isRightOut = (x - rect.right + car.offsetWidth - 8) > 0;
    const isOut = isTopOut || isBottomOut || isLeftOut || isRightOut;

    const obstacle_cars = document.querySelectorAll('.obstacle-car');
    obstacle_cars.forEach(obstacle_car => {
        const obstacleRect = obstacle_car.getBoundingClientRect(); 
        if (x + car.offsetWidth < obstacleRect.left + 16 ||
            x > obstacleRect.right - 16 ||
            y > obstacleRect.bottom - 24 ||
            y + car.offsetHeight < obstacleRect.top + 22
        ) return;
        crashed = true;
    });

    if (isOut || crashed) {
        current_time = 0;
        road.classList.add('active');
        return;
    }
    else
    {
        road.classList.remove('active');
    }

    if (x >= finish.getBoundingClientRect().left && !isTopOut && !isBottomOut) {
        clearInterval(interval);
        score = Math.round(score_koef * 100 * (1/((time - current_time)/1000)));
        show_modal('win');
        final_score.textContent = score;
        const min = Math.floor((time - current_time) / 60000);
        const sec = Math.floor((time - current_time) % 60000 / 1000);
        const ms = Math.floor((time - current_time) % 1000);
        final_time.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
    
        const login = localStorage.getItem('currentUser')
        const records = getScores(login);
        if (records[2] < score) {
            records[2] = score;
            updateScore(login, records);
        }
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

function create_obstacles(num_obstacles) {
    const obstacles = [];
    const patterns = [
        [true, false, false],
        [false, true, false],
        [false, false, true],
        [true, true, false],
        [false, true, true],
        [true, false, true]
    ]

    for (let i = 0; i < num_obstacles; i++) {
        let pattern;
        let attempts = 0;
        let k = 1;

        do {
            pattern = patterns[Math.floor(Math.random() * patterns.length)];
            attempts++;
            
            if (i === 0) break;
            
            const prevRow = obstacles[i - 1];

            let sameAsPrev = true;
            for (let j = 0; j < pattern.length; j++) {
                if (prevRow[i] !== pattern[i]) sameAsPrev = false;
            }
            
            if (sameAsPrev) {
                k += 1;
            }

            if (k < 3) {
                break;
            }    
        } while (attempts < 100);
        
        obstacles.push([...pattern]);
    }


    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = document.createElement('div');
        obstacle.className = "obstacle";
        obstacle.style.position = 'absolute';
        for (let j = 0; j < obstacles[i].length; j++) {
            if (obstacles[i][j]) {
                const new_obstacle = document.createElement("img");
                new_obstacle.src = '../images/car_object.svg';
                new_obstacle.className = 'obstacle-car';
                new_obstacle.style.position = 'absolute';
                new_obstacle.style.width = '70px';
                new_obstacle.style.height = '70px';
                new_obstacle.style.top = j*(rect.height/3) + 'px';
                obstacle.appendChild(new_obstacle);
            }
        }

        obstacle.style.width = '70px';
        obstacle.style.height = '100%';
        obstacle.style.left = 100 + i*(((rect.width-120)/obstacles.length)) + 'px' ;   
        road.appendChild(obstacle);
    };
};