const help_btn = document.querySelector('.question-btn');
const canvas = document.querySelector('.roadCanvas');
const car = document.querySelector('.car');
const distance = document.querySelector('.distance');
const username = document.querySelector('.username');
const complexity = document.querySelectorAll('.complexity-btn');
const complexity_modal = document.querySelector('.complexity');
const timer = document.querySelector('.timer');
const final_score = document.querySelector('.final-score');

let interval;

let points = []; 
let cumLengths = [];
let totalLength = 0;
let fullMeters = 2000;
let targetMeters = 2000;

let dragging = false;
let dragOffset = {x:0,y:0};
let dragged = false;
const time = 10000;
let timerMs = time;

let score = 0;
let score_koef = 1;

let difficulty = 'easy';
let maxAttempts = Infinity;
let attemptsLeft = Infinity;
const attemptsDisplay = document.querySelector('.attempts');

document.addEventListener('DOMContentLoaded', () => {
    if (username) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) username.textContent = currentUser;
    }
    show_modal('complexity');
});

complexity.forEach(button => {
    button.addEventListener('click', () => {
        hide_modal('complexity');
        difficulty = button.classList[1];
        
        switch (difficulty) {
            case 'easy':
                maxAttempts = Infinity;
                attemptsDisplay.style.display = 'none';
                score_koef = 1;
                break;
            case 'medium':
                maxAttempts = 3;
                attemptsDisplay.style.display = 'block';
                score_koef = 1.2;
                break;
            case 'hard':
                maxAttempts = 2;
                attemptsDisplay.style.display = 'block';
                score_koef = 2;
                break;
        }
        
        attemptsLeft = maxAttempts
        attemptsDisplay.textContent = maxAttempts;
        resizeCanvas();
        drawRoad();
        timerMs = time;
    });
});

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
}

function cubicPoint(t, p0, p1, p2, p3) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
    return {x, y};
}

function sampleBezier(p0,p1,p2,p3, samples=1200) {
    const arr = [];
    for (let i=0;i<=samples;i++) arr.push(cubicPoint(i/samples,p0,p1,p2,p3));
    return arr;
}

function drawRoad() {
    const ctx = canvas.getContext('2d');
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0,0,w,h);

    const margin = 80;
    const p0 = {x: margin, y: h * 0.75};
    const p3 = {x: w - margin, y: h * 0.25};

    let segments, curveVariation;
    switch (difficulty) {
        case 'easy':
            segments = 2 + Math.floor(Math.random() * 2); 
            curveVariation = 0.4;
            break;
        case 'medium':
            segments = 3 + Math.floor(Math.random() * 2);
            curveVariation = 0.6; 
            break;
        case 'hard':
            segments = 4 + Math.floor(Math.random() * 2);
            curveVariation = 0.8;
            break;
        default:
            segments = 3;
            curveVariation = 0.6;
    }
    
    const p1 = {x: w * 0.33, y: h * (0.2 + Math.random() * curveVariation)};
    const p2 = {x: w * 0.66, y: h * (0.2 + Math.random() * curveVariation)}; 
    points = [];
    const samplesPerSegment = 1000;
    let last = p0;
    for (let s = 0; s < segments; s++) {
        const startX = margin + (s) * ((w - 2*margin) / segments);
        const endX = margin + (s+1) * ((w - 2*margin) / segments);
        const p0s = s === 0 ? p0 : {x: startX, y: last.y};
        const p3s = {x: endX, y: h * (0.2 + Math.random() * 0.6)};
        const p1s = {x: startX + (endX - startX) * 0.25, y: h * (0.1 + Math.random() * 0.8)};
        const p2s = {x: startX + (endX - startX) * 0.75, y: h * (0.1 + Math.random() * 0.8)};
        const segPoints = sampleBezier(p0s,p1s,p2s,p3s,samplesPerSegment);
        if (s > 0) segPoints.shift();
        points = points.concat(segPoints);
        last = p3s;
    }

    cumLengths = [0];
    totalLength = 0;
    for (let i=1;i<points.length;i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        totalLength += Math.hypot(dx,dy);
        cumLengths.push(totalLength);
    }

    fullMeters = Math.max(250, Math.round(totalLength / 5)); 
    targetMeters = 100 + Math.floor(Math.random() * (Math.max(1, fullMeters - 200) + 1));
    const cond = document.querySelector('.condition');
    if (cond) cond.textContent = `Пройдите ${targetMeters} м по дороге`;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.strokeStyle = '#acacacff';
    ctx.lineWidth = 16;
    ctx.beginPath();
    for (let i=0; i<points.length; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y);
        else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    placeCarAtPoint(points[0]);
}

function placeCarAtPoint(pt) {
    const wrapper = canvas.parentElement;
    const wrapperRect = wrapper.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const offsetLeft = canvasRect.left - wrapperRect.left;
    const offsetTop = canvasRect.top - wrapperRect.top;
    car.style.left = (offsetLeft + pt.x) + 'px';
    car.style.top = (offsetTop + pt.y) + 'px';
    car.dataset.progress = 0;
    car.style.display = 'block';
    distance.textContent = `0 м`;
}


function findNearestIndex(x,y) {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < points.length; i += 6) { 
        const dx = points[i].x - x;
        const dy = points[i].y - y;
        const d = dx*dx + dy*dy;
        if (d < bestDist) { bestDist = d; best = i; }
    }

    const start = Math.max(0, best - 12);
    const end = Math.min(points.length-1, best + 12);
    for (let i=start;i<=end;i++) {
        const dx = points[i].x - x;
        const dy = points[i].y - y;
        const d = dx*dx + dy*dy;
        if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
}

function isOnRoadAt(x,y) {
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const cx = Math.round((x - rect.left));
    const cy = Math.round((y - rect.top));
    if (cx < 0 || cy < 0 || cx >= rect.width || cy >= rect.height) return false;
    const dpr = window.devicePixelRatio || 1;
    try {
        const data = ctx.getImageData(Math.round(cx * dpr), Math.round(cy * dpr), 1, 1).data;
        return data[3] > 10;
    } catch (e) {
        return false;
    }
}

function lengthToMeters(len) {
    return (len / totalLength) * fullMeters;
}

car.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    dragging = true;
    dragged = true;
    car.setPointerCapture(e.pointerId);
    const crect = car.getBoundingClientRect();
    dragOffset.x = e.clientX - crect.left;
    dragOffset.y = e.clientY - crect.top;

    if (!interval) {
        interval = setInterval(() => {
            timerMs -= 100;
            const min = Math.floor(timerMs / 60000);
            const sec = Math.floor(timerMs % 60000 / 1000);
            const ms = Math.floor(timerMs % 1000);
            timer.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
            if (timerMs <= 0) {
                clearInterval(interval);
                timer.textContent = "о нет..";
                show_modal('lose');
                car.style.display = 'none';
            }
        }, 100);
    }
});

window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left - dragOffset.x + car.offsetWidth/2;
    let y = e.clientY - rect.top - dragOffset.y + car.offsetHeight/2;

    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));

    const wrapper = canvas.parentElement;
    const wrapperRect = wrapper.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const offsetLeft = canvasRect.left - wrapperRect.left;
    const offsetTop = canvasRect.top - wrapperRect.top;

    car.style.left = (offsetLeft + x) + 'px';
    car.style.top = (offsetTop + y) + 'px';

    const globalX = rect.left + x;
    const globalY = rect.top + y;
    const onRoad = isOnRoadAt(globalX, globalY);

    if (onRoad) {
        car.classList.remove('offroad');
        const idx = findNearestIndex(x,y);
        const len = cumLengths[idx];
        const meters = lengthToMeters(len);
        car.dataset.progress = meters;
        distance.textContent = `${Math.max(0, Math.round(meters))} м`;
    } else {
        car.classList.add('offroad');
        
        if (attemptsLeft !== Infinity) {
            attemptsLeft--;

            attemptsDisplay.textContent = attemptsLeft;
            if (attemptsLeft <= 0) {
                clearInterval(interval);
                interval = null;
                show_modal('lose');
                dragging = false;
                car.style.display = 'none';
                return;
            }
        }

        if (points && points.length) {
            placeCarAtPoint(points[0]);
        }
        car.dataset.progress = 0;
        distance.textContent = `0 м`;
        setTimeout(() => car.classList.remove('offroad'), 200);
        dragging = false;
    }
});

window.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    try { car.releasePointerCapture(e.pointerId); } catch(e){}
    
    const meters = parseFloat(car.dataset.progress) || 0;
    if (Math.round(meters) === targetMeters) {
        clearInterval(interval);
        show_modal('win');
        car.style.display = 'none';
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => obstacle.style.animationPlayState = 'paused');

        const timeSpent = Math.max(0.001, time - timerMs);
        const timeLeft = Math.max(0, timerMs);
        score = Math.round(score_koef * 10 * Math.pow(time / timeSpent, 0.8) * Math.sqrt(timeLeft + 1));
        score = Math.max(0, score);


        final_score.textContent = score;
    
        const login = localStorage.getItem('currentUser')
        const records = getScores(login);
        if (records[3] < score) {
            records[3] = score;
            updateScore(login, records);
        }
    }
});

help_btn.addEventListener('mouseenter', () => {
    show_modal('help');
    clearInterval(interval);
});

help_btn.addEventListener('mouseleave', () => {
    hide_modal('help');
    if (!dragged) return;
    interval = setInterval(() => {
        timerMs -= 100;
        const min = Math.floor(timerMs / 60000);
        const sec = Math.floor(timerMs % 60000 / 1000);
        const ms = Math.floor(timerMs % 1000);
        timer.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
        if (timerMs <= 0) {
            clearInterval(interval);
            timer.textContent = "о нет..";
            show_modal('lose');
            car.style.display = 'none';
        }
    }, 100);
    
});

pause_btn.addEventListener('click', () => {
    show_modal('pause');
    clearInterval(interval);
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
    if (!dragged) return;
    interval = setInterval(() => {
        timerMs -= 100;
        const min = Math.floor(timerMs / 60000);
        const sec = Math.floor(timerMs % 60000 / 1000);
        const ms = Math.floor(timerMs % 1000);
        timer.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${(ms/10).toString().padStart(2, '0')}`;
        if (timerMs <= 0) {
            clearInterval(interval);
            timer.textContent = "о нет..";
            show_modal('lose');
            car.style.display = 'none';
        }
    }, 100);
});