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
    const usersJSON = localStorage.getItem("users");
    return usersJSON ? JSON.parse(usersJSON) : [];
};

export function saveAllUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
};

export function getScores(login) {
    const users = getAllUsers();
    const user = users.find(user => user.login === login);
    
    if (user && user.levelScores) {
        return user.levelScores;
    }
    return [0, 0, 0];
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