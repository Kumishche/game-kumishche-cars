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