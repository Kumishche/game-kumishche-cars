export function show_modal(className) {
    const modal = document.querySelector('.' + className);
    if (modal) {
        modal.classList.add('active');
    }
}

export function hide_modal(className) {
    const modal = document.querySelector('.' + className);
    if (modal) {
        modal.classList.remove('active');
    }
}

export function hide_all_modals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}


export function getAllUsers() {
    try {
        const usersJSON = localStorage.getItem("users");
        if (!usersJSON) {
            return [];
        }
        
        const users = JSON.parse(usersJSON);
        if (!Array.isArray(users)) {
            console.warn("Данные пользователей повреждены. Очищаем...");
            localStorage.removeItem("users");
            return [];
        }
        
        return users;
    } catch (error) {
        console.error("Ошибка при чтении пользователей из localStorage: ", error);
        console.warn("Очищаем некорректные данные...");
        localStorage.removeItem("users");
        return [];
    }
};

export function saveAllUsers(users) {
    try {
        localStorage.setItem("users", JSON.stringify(users));
    } catch (error) {
        console.error("Ошибка при сохранении пользователей в localStorage: ", error);
    }
};

export function getScores(login) {
    try {
        const users = getAllUsers();
        const user = users.find(user => user.login === login);
        
        if (user && Array.isArray(user.levelScores)) {
            return user.levelScores;
        }
        console.warn(`Некорректные данные уровней для пользователя ${login}`);
        return new Array(4).fill(0);
    } catch (error) {
        console.error("Ошибка при получении очков: ", error);
        return new Array(4).fill(0);
    }
};

export function updateScore(login, scores) {
    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.login === login);

    users[userIndex].levelScores = scores;
    saveAllUsers(users);
}

export function findUserByLogin(login) {
    const users = getAllUsers();
    return users.find(user => user.login === login);
};

export function addNewUser(login, num_levels) {
    const users = getAllUsers();
    if (users.some(user => user.login === login)) {
        return false;
    };
    const newUser = {
        login: login,
        createdAt: new Date().toISOString(),
        levelScores: new Array(num_levels).fill(0)
    };
    
    users.push(newUser);
    saveAllUsers(users);
    return true;
};