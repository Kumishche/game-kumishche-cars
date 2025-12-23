
import {show_modal, hide_modal, getScores, updateScore} from "./functions.js";

const help_btn = document.querySelector('.question-btn');
const pause_btn = document.querySelector('.pause-btn');
const continue_btn = document.querySelector('.continue-btn');
const canvas = document.querySelector('.roadCanvas');
const car = document.querySelector('.car');
const distanceEl = document.querySelector('.road-wrapper .distance');
const username = document.querySelector('.username');

let interval;

let points = []; 
let cumLengths = [];
let totalLength = 0;
let fullMeters = 2000;
let targetMeters = 2000;

let dragging = false;
let dragOffset = {x:0,y:0};
const time = 20000;
let timerMs = time;



document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    drawRoad();
    if (username) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) username.textContent = currentUser;
    }
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
    const p1 = {x: w * 0.33, y: h * (0.2 + Math.random() * 0.6)};
    const p2 = {x: w * 0.66, y: h * (0.2 + Math.random() * 0.6)};

    const segments = 3 + Math.floor(Math.random()*3); 
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

    fullMeters = Math.max(200, Math.round(totalLength / 5)); 
    targetMeters = 200 + Math.floor(Math.random() * (Math.max(1, fullMeters - 200) + 1));
    const cond = document.querySelector('.condition');
    if (cond) cond.textContent = `Пройдите ${targetMeters} м по дороге`;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.strokeStyle = '#acacacff';
    ctx.lineWidth = 18;
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
    updateDistance(0);
}

function updateDistance(meters) {
    distanceEl.textContent = `${Math.max(0, Math.round(meters))} м`;
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

function updateTimerDisplay(ms) {
    const s = Math.max(0, ms/1000);
    const tEl = document.querySelector('.road-wrapper .timer');
    if (tEl) tEl.textContent = `${s.toFixed(1)} с`;
}

function startTimerOnce() {
    if (interval) return;
    updateTimerDisplay(timerMs);
    interval = setInterval(() => {
        timerMs -= 100;
        if (timerMs <= 0) {
            clearInterval(interval);
            interval = null;
            updateTimerDisplay(0);
            show_modal('lose');
        } else {
            updateTimerDisplay(timerMs);
        }
    }, 100);
}

car.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    dragging = true;
    car.setPointerCapture(e.pointerId);
    const crect = car.getBoundingClientRect();
    dragOffset.x = e.clientX - crect.left;
    dragOffset.y = e.clientY - crect.top;
    startTimerOnce();
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
        updateDistance(meters);
        if (meters >= targetMeters) {
            show_modal('win');
        }
    } else {
        car.classList.add('offroad');
        timerMs = time;
        clearInterval(interval);
        interval = setInterval(() => {
            timerMs -= 100;
            if (timerMs <= 0) {
                clearInterval(interval);
                interval = null;
                updateTimerDisplay(0);
                show_modal('lose');
            } else {
                updateTimerDisplay(timerMs);
            }
        }, 100);
        if (points && points.length) {
            placeCarAtPoint(points[0]);
        }
        car.dataset.progress = 0;
        updateDistance(0);
        setTimeout(() => car.classList.remove('offroad'), 200);
        dragging = false;
    }
});

window.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    try { car.releasePointerCapture(e.pointerId); } catch(e){}
});

help_btn.addEventListener('mouseenter', () => {
    show_modal('help');
    clearInterval(interval);
});

help_btn.addEventListener('mouseleave', () => {
    hide_modal('help');
    interval = setInterval(() => {
        timerMs -= 100;
        if (timerMs <= 0) {
            clearInterval(interval);
            interval = null;
            updateTimerDisplay(0);
            show_modal('lose');
        } else {
            updateTimerDisplay(timerMs);
        }
    }, 100);
});

pause_btn.addEventListener('click', () => {
    show_modal('pause');
    clearInterval(interval);
});

continue_btn.addEventListener('click', () => {
    hide_modal('pause');
    interval = setInterval(() => {
        timerMs -= 100;
        if (timerMs <= 0) {
            clearInterval(interval);
            interval = null;
            updateTimerDisplay(0);
            show_modal('lose');
        } else {
            updateTimerDisplay(timerMs);
        }
    }, 100);
});