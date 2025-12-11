export default class ScreenManager {
    constructor(screens, modals) {
        this.screens = screens;
        this.modals = modals;
    }
    
    init() {
        this.hideAllScreens();
        this.showScreen('.main-menu');
    }
    
    hideAllScreens() {
        this.screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        this.modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    showScreen(screenClass) {
        this.hideAllScreens();
        this.screens.forEach(screen => {
            screen.classList.remove('active');
        });
        const screen = document.querySelector(screenClass);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenClass;
        }
    }
    
    showModal(modalClass) {
        const modal = document.querySelector(modalClass);
        if (modal) {
            modal.classList.add('active');
        }
    }
    
    hide(windowClass) {
        const window = document.querySelector(windowClass);
        if (window) {
            window.classList.remove('active');
        }
        this.showScreen(this.currentScreen);
    }
}