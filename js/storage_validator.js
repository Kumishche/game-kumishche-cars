const STORAGE_KEYS = {
    USERS: "users",
    CURRENT_USER: "currentUser"
};

function isValidUser(user) {
    return user &&
        typeof user === 'object' &&
        typeof user.login === 'string' &&
        user.login.length > 0 &&
        typeof user.createdAt === 'string' &&
        Array.isArray(user.levelScores) &&
        user.levelScores.every(score => typeof score === 'number' && score >= 0);
}

function isValidUsersList(users) {
    return Array.isArray(users) && users.every(isValidUser);
}

export function validateAndRepairStorage() {
    try {
        const usersJSON = localStorage.getItem(STORAGE_KEYS.USERS);
        
        if (usersJSON) {
            try {
                const users = JSON.parse(usersJSON);
                if (!isValidUsersList(users)) {
                    console.warn("Обнаружены некорректные данные пользователей. Очищаем...");
                    localStorage.removeItem(STORAGE_KEYS.USERS);
                }
            } catch (error) {
                console.warn("Невозможно распарсить данные пользователей:", error.message);
                localStorage.removeItem(STORAGE_KEYS.USERS);
            }
        }

        const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        
        if (currentUser) {
            const users = getAllUsersFromStorage();
            const userExists = users.some(user => user.login === currentUser);
            
            if (!userExists) {
                console.warn(`Текущий пользователь "${currentUser}" не найден в списке. Очищаем...`);
                localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            }
        }
        
        console.log("Проверка localStorage завершена успешно");
        return true;
        
    } catch (error) {
        console.error("Ошибка при проверке хранилища: ", error);
        return false;
    }
}

function getAllUsersFromStorage() {
    try {
        const usersJSON = localStorage.getItem(STORAGE_KEYS.USERS);
        if (!usersJSON) {
            return [];
        }
        
        const users = JSON.parse(usersJSON);
        
        if (!isValidUsersList(users)) {
            return [];
        }
        
        return users;
    } catch (error) {
        console.error("Ошибка при получении пользователей: ", error);
        return [];
    }
}

export function initializeStorage() {
    validateAndRepairStorage();
    console.log("Storage инициализирована и готова к работе");
}
