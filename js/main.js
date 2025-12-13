import * as func from "./functions.js";

const play_btn = document.querySelector(".play-btn");
const question_btn = document.querySelector('.question-btn');
const chart_btn = document.querySelector('.chart-btn');
const close_btns = document.querySelectorAll('.close-btn');
const signin_btn = document.querySelector('.signin-btn');
const signup_btn = document.querySelector('.signup-btn');
const logout_btn = document.querySelector('.logout-btn');

let scores;

document.addEventListener('DOMContentLoaded', () => {
    func.hide_all_modals();

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        console.log(`Текущий пользователь: ${currentUser}`);
    } else {
        func.show_modal('login');
    };
});

play_btn.addEventListener("click", () => {
    func.show_modal('levels');
});

question_btn.addEventListener('click', () => {
    func.show_modal('help');
});

chart_btn.addEventListener('click', () => {
    func.show_modal('rating');
});

close_btns.forEach(button => {
    button.addEventListener('click', () => {
        func.hide_modal(button.closest('.modal').classList[1]);
    });
});

signin_btn.addEventListener('click', () => {
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
        alert(`Добро пожаловать, ${login}!`);
        func.hide_modal('login');
        scores = func.getScores(login);
        console.log(scores);
    } else {
        alert(`Пользователь с таким логином отсутствует`);
    };
});

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
        if (func.addNewUser(login)) {  
            localStorage.setItem("currentUser", login);
            alert(`Новый пользователь ${login} зарегистрирован!`);
            scores = [0, 0, 0];
            console.log(scores);
            func.hide_modal('login');
        } else {
            alert('Ошибка при регистрации');
        };
    };
});


logout_btn.addEventListener('click', () => {
    const login = localStorage.getItem('currentUser');
    if (!login) {
        alert('Пользователь не авторизован');
        return;
    }
    localStorage.setItem('currentUser', "");
    func.show_modal('login');
});
