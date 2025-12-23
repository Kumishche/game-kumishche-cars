import * as func from "./functions.js";

const play_btn = document.querySelector(".play-btn");
const question_btn = document.querySelector('.question-btn');
const help_modal = document.querySelector('.help');
const chart_btn = document.querySelector('.chart-btn');
const close_btns = document.querySelectorAll('.close-btn');
const signin_btn = document.querySelector('.signin-btn');
const signup_btn = document.querySelector('.signup-btn');
const logout_btn = document.querySelector('.logout-btn');
const rating_btns = document.querySelectorAll('.rating-btn');
const rating_table = document.querySelector('.rating-table');
const username = document.querySelector('.username');
const level_btns = document.querySelectorAll('.level-btn');

let scores;
let currentUser;

document.addEventListener('DOMContentLoaded', () => {
    func.hide_all_modals();
    
    if (!func.findUserByLogin('admin')) {
        func.addNewUser('admin', level_btns.length);
        scores = new Array(level_btns.length).fill(value);
    }

    currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        username.textContent = currentUser;
        scores = func.getScores(currentUser);
        console.log(scores);
        if (currentUser != 'admin') {
            level_btns.forEach(button => {
                const level = button.dataset.level;
                if (level > 1 && scores[level-2] == 0) {
                    const img = new Image();
                    img.src = "./images/Lock.svg";
                    button.innerHTML = "";
                    button.appendChild(img);   
                    button.addEventListener('click', preventClick);
                }
            });
        }
    } else {
        func.show_modal('login');
    };
});

play_btn.addEventListener("click", () => {
    func.show_modal('levels');
});

question_btn.addEventListener('mouseenter', () => {
    func.show_modal('help');
});

question_btn.addEventListener('mouseleave', () => {
    func.hide_modal('help');
});

chart_btn.addEventListener('click', () => {
    func.show_modal('rating');
    rating_click(1);
    rating_btns[0].classList.add('active');
});

close_btns.forEach(button => {
    button.addEventListener('click', () => {
        func.hide_modal(button.closest('.modal').classList[1]);
        rating_btns.forEach(btn => btn.classList.remove('active'));
    });
});

signin_btn.addEventListener('click', () => {
    signin();
});

document.addEventListener('keydown', e => {
    if (e.key == 'Enter')  signin();
});

function signin() {
    const input_login = document.querySelector('.login-input');
    const login = input_login.value.trim();
    
    if (!login) {
        input_login.placeholder = 'Введите логин';
        input_login.focus();
        return;
    };
    
    const existingUser = func.findUserByLogin(login);
    
    if (existingUser) {
        localStorage.setItem("currentUser", login);
        currentUser = login;
        func.hide_modal('login');
        scores = func.getScores(login);
        console.log(scores);
        username.textContent = login;
    } else {
        alert(`Пользователь с таким логином отсутствует`);
    };

    if (login != 'admin') {
        level_btns.forEach(button => {
            const level = button.dataset.level;
            if (level > 1 && scores[level-2] == 0) {
                const img = new Image();
                img.src = "./images/Lock.svg";
                button.innerHTML = "";
                button.appendChild(img);   
                button.addEventListener('click', preventClick);
            }
        });
    } else {
        level_btns.forEach(button => {
            const level = button.dataset.level;
            button.innerHTML = level;
            button.removeEventListener('click', preventClick);
        });
    }
};

const preventClick = (e) => e.preventDefault();

signup_btn.addEventListener('click', () => {
    const input_login = document.querySelector('.login-input');
    const login = input_login.value.trim();
    
    if (!login) {
        input_login.placeholder = 'Введите логин';
        input_login.focus();
        return;
    };
    
    const existingUser = func.findUserByLogin(login);
    if (!existingUser) {
        if (func.addNewUser(login, level_btns.length)) {  
            let value = 0;
            localStorage.setItem("currentUser", login);
            currentUser = login;
            alert(`Новый пользователь ${login} зарегистрирован!`)
            scores = new Array(level_btns.length).fill(value);
            func.hide_modal('login');
            username.textContent = login;
        } else {
            alert('Ошибка при регистрации');
        };
    };

    level_btns.forEach(button => {
        const level = button.dataset.level;
        if (level > 1 && scores[level-2] == 0) {
            const img = new Image();
            img.src = "./images/Lock.svg";
            button.innerHTML = "";
            button.appendChild(img);   
            button.addEventListener('click', (e) => e.preventDefault());
        }
    })
});


logout_btn.addEventListener('click', () => {
    const login = localStorage.getItem('currentUser');
    if (!login) {
        alert('Пользователь не авторизован');
        return;
    }
    localStorage.setItem('currentUser', "");
    func.show_modal('login');
    username.textContent = "";
});


rating_btns.forEach(button => {
    button.addEventListener('click', () => {
        rating_click(button.dataset.level);
        rating_btns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

function rating_click(level) {
    const users = func.getAllUsers();
    level--;
    const sortedUsers = users.sort((userA, userB) => {
        const scoreA = userA.levelScores[level];
        const scoreB = userB.levelScores[level];
        return scoreB - scoreA;
    });

    displayRating(sortedUsers, level);
}

function displayRating(users, level) {
    rating_table.innerHTML = "";
    let index = 0;
    users.forEach(user => {
        if (user.login != 'admin' || currentUser == 'admin') {
            const row = document.createElement('div');
            row.className = 'rating-row';
            row.innerHTML = `
                <span>${index + 1}</span>
                <span>${user.login}</span>
                <span>${user.levelScores[level]}</span>
            `;
            index++;
            rating_table.appendChild(row);
        }
    }); 
}