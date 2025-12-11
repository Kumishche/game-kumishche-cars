export const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

export const Scoring = {
    correctAnswer: 10,
    timeBonus: (timeLeft) => timeLeft * 2,
    penaltyWrong: -5,
    penaltyTime: -2,
    
    calculateFinalScore(correct, wrong, timeLeft) {
        // Расчёт финального счёта
    }
};