document.addEventListener('DOMContentLoaded', () => {
    const elementsToHide = [
        '.levels',
        '.game', 
        '.rating',
        '.results',
        '.pause',
        '.help'
    ];
    
    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.style.display = 'none';
    });
    
    const mainMenu = document.querySelector('.main-menu');
    if (mainMenu) mainMenu.style.display = 'block';
})