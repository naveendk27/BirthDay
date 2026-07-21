// ================================================================
// 7 PHOTOS FOR KRUTHI 💋😘❤️
// ================================================================

var PHOTOS = [
    "photos/photo1.jpeg",
    "photos/photo2.jpeg",
    "photos/photo3.jpeg",
    "photos/photo4.jpeg",
    "photos/photo5.jpeg",
    "photos/photo6.jpeg",
    "photos/photo7.jpeg"
];

var CAPTIONS = [
    "You are so special to me Kruthi 💖",
    "Every moment with you is magical ✨",
    "Your smile makes everything better 😊",
    "Memories we will cherish forever 💫",
    "You make the world a beautiful place 🌹",
    "So grateful to have you in my life 💝",
    "Happy Birthday my dear Kruthi! 🎂❤️"
];

// ================================================================
// DO NOT EDIT BELOW
// ================================================================

var TRANSITIONS = ['anim-fade', 'anim-zoom', 'anim-left', 'anim-right', 'anim-top', 'anim-rotate', 'anim-flip', 'anim-bounce'];
var FLOAT_EMOJIS = ['💖', '💕', '✨', '🎂', '🎉', '🎈', '🌹', '💝', '🎊', '⭐', '💫', '🥳', '💋', '😘', '❤️'];
var INTRO_DURATION = 5000;
var OUTRO_DURATION = 8000;

var audio = null;
var isPlaying = false;
var isMuted = false;
var totalDuration = 0;
var photoInterval = 0;
var currentIndex = 0;
var slideTimer = null;
var progressRAF = null;
var showStartTime = 0;
var loadedCount = 0;
var totalToLoad = PHOTOS.length + 1;
var audioReady = false;

// ================================================================
// PAGE LOAD
// ================================================================
window.addEventListener('DOMContentLoaded', function () {
    console.log('[Birthday] Starting...');

    audio = document.getElementById('bgMusic');

    if (!audio) {
        console.log('[Birthday] ERROR: bgMusic not found!');
        return;
    }

    loadPhotos();
    loadAudio();
    setupButtons();
});

// ================================================================
// LOAD PHOTOS
// ================================================================
function loadPhotos() {
    for (var i = 0; i < PHOTOS.length; i++) {
        (function (index, src) {
            var img = new Image();
            img.onload = function () {
                console.log('[Birthday] ✅ Photo ' + (index + 1) + ' loaded');
                itemLoaded();
            };
            img.onerror = function () {
                console.log('[Birthday] ❌ Photo ' + (index + 1) + ' FAILED: ' + src);
                itemLoaded();
            };
            img.src = src;
        })(i, PHOTOS[i]);
    }
}

// ================================================================
// LOAD AUDIO
// ================================================================
function loadAudio() {
    console.log('[Birthday] Loading audio...');

    audio.addEventListener('canplaythrough', function () {
        if (!audioReady) {
            audioReady = true;
            console.log('[Birthday] ✅ Audio ready! Duration: ' + audio.duration);
            itemLoaded();
        }
    });

    audio.addEventListener('loadeddata', function () {
        if (!audioReady) {
            audioReady = true;
            console.log('[Birthday] ✅ Audio data loaded');
            itemLoaded();
        }
    });

    audio.addEventListener('error', function (e) {
        console.log('[Birthday] ❌ Audio FAILED');
        if (!audioReady) {
            audioReady = true;
            itemLoaded();
        }
    });

    try {
        audio.load();
    } catch (e) {
        console.log('[Birthday] Audio load error:', e);
    }

    setTimeout(function () {
        if (!audioReady) {
            console.log('[Birthday] ⚠️ Audio timeout - continuing');
            audioReady = true;
            itemLoaded();
        }
    }, 6000);
}

function itemLoaded() {
    loadedCount++;
    var pct = Math.round((loadedCount / totalToLoad) * 100);
    var bar = document.getElementById('loadingBar');
    if (bar) bar.style.width = pct + '%';

    if (loadedCount >= totalToLoad) {
        setTimeout(showStartScreen, 500);
    }
}

// ================================================================
// SETUP BUTTONS
// ================================================================
function setupButtons() {
    var startBtn = document.getElementById('startPlayBtn');
    if (startBtn) startBtn.addEventListener('click', beginShow);

    var playBtn = document.getElementById('playPauseBtn');
    if (playBtn) playBtn.addEventListener('click', togglePlay);

    var restBtn = document.getElementById('restartBtn');
    if (restBtn) restBtn.addEventListener('click', replayShow);

    var mutBtn = document.getElementById('muteBtn');
    if (mutBtn) mutBtn.addEventListener('click', toggleMute);

    var fsBtn = document.getElementById('fullscreenBtn');
    if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

    var repBtn = document.getElementById('replayBtn');
    if (repBtn) repBtn.addEventListener('click', replayShow);
}

// ================================================================
// START SCREEN
// ================================================================
function showStartScreen() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    spawnStartFloats();
}

function spawnStartFloats() {
    var container = document.getElementById('startFloats');
    if (!container) return;
    setInterval(function () {
        var el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.left = Math.random() * 100 + '%';
        el.style.bottom = '-50px';
        el.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        el.style.animation = 'floatUp ' + (Math.random() * 5 + 6) + 's linear forwards';
        el.style.pointerEvents = 'none';
        el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
        container.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 12000);
    }, 700);
}

// ================================================================
// BEGIN SHOW
// ================================================================
function beginShow() {
    console.log('[Birthday] Starting show!');

    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('playerScreen').classList.remove('hidden');

    try {
        var el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } catch (e) { }

    try {
        audio.currentTime = 0;
        var p = audio.play();
        if (p && p.then) {
            p.then(function () {
                console.log('[Birthday] Audio playing!');
                isPlaying = true;
                setupShow();
            }).catch(function (err) {
                console.log('[Birthday] Audio play error:', err);
                isPlaying = true;
                setupShow();
            });
        } else {
            isPlaying = true;
            setupShow();
        }
    } catch (e) {
        isPlaying = true;
        setupShow();
    }
}

function setupShow() {
    if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        totalDuration = audio.duration * 1000;
    } else {
        totalDuration = 180000;
    }

    var photoTime = totalDuration - INTRO_DURATION - OUTRO_DURATION;
    if (photoTime < PHOTOS.length * 2000) {
        photoTime = PHOTOS.length * 3000;
    }
    photoInterval = Math.max(photoTime / PHOTOS.length, 3000);

    showStartTime = Date.now();

    initParticles();
    initFloatingEmojis();
    initVisualizer();
    startProgressTracker();

    audio.addEventListener('ended', function () {
        isPlaying = false;
        var pi = document.getElementById('playIcon');
        if (pi) pi.textContent = '▶️';
        showOutro();
    });

    showIntro();
}

// ================================================================
// SCREENS
// ================================================================
function showIntro() {
    document.getElementById('introScreen').classList.remove('hidden');
    document.getElementById('photoDisplay').classList.add('hidden');
    document.getElementById('outroScreen').classList.add('hidden');

    clearTimeout(slideTimer);
    slideTimer = setTimeout(function () {
        document.getElementById('introScreen').classList.add('hidden');
        showPhoto(0);
    }, INTRO_DURATION);
}

function showPhoto(index) {
    if (index >= PHOTOS.length) {
        showOutro();
        return;
    }

    var elapsed = Date.now() - showStartTime;
    var remaining = totalDuration - elapsed;
    if (remaining <= OUTRO_DURATION && index > 0) {
        showOutro();
        return;
    }

    currentIndex = index;

    var frame = document.getElementById('photoFrame');
    var img = document.getElementById('currentPhoto');
    var caption = document.getElementById('photoCaption');
    var number = document.getElementById('photoNumber');

    document.getElementById('photoDisplay').classList.remove('hidden');
    document.getElementById('introScreen').classList.add('hidden');
    document.getElementById('outroScreen').classList.add('hidden');

    for (var i = 0; i < TRANSITIONS.length; i++) {
        frame.classList.remove(TRANSITIONS[i]);
    }
    frame.classList.remove('ken-burns');

    img.src = PHOTOS[index];

    var t = TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
    void frame.offsetWidth;
    frame.classList.add(t);

    setTimeout(function () {
        for (var j = 0; j < TRANSITIONS.length; j++) {
            frame.classList.remove(TRANSITIONS[j]);
        }
        frame.classList.add('ken-burns');
    }, 1200);

    caption.style.animation = 'none';
    void caption.offsetWidth;
    caption.textContent = CAPTIONS[index] || '✨';
    caption.style.animation = 'captionIn 0.8s ease forwards';

    number.textContent = '📸 ' + (index + 1) + ' / ' + PHOTOS.length;

    clearTimeout(slideTimer);
    slideTimer = setTimeout(function () {
        showPhoto(index + 1);
    }, photoInterval);
}

function showOutro() {
    clearTimeout(slideTimer);
    document.getElementById('photoDisplay').classList.add('hidden');
    document.getElementById('introScreen').classList.add('hidden');
    document.getElementById('outroScreen').classList.remove('hidden');
}

// ================================================================
// PROGRESS
// ================================================================
function startProgressTracker() {
    var fill = document.getElementById('progressFill');
    var timeEl = document.getElementById('progressTime');

    function update() {
        if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            var elapsed = audio.currentTime;
            var pct = Math.min((elapsed / audio.duration) * 100, 100);
            if (fill) fill.style.width = pct + '%';

            var mins = Math.floor(elapsed / 60);
            var secs = Math.floor(elapsed % 60);
            if (secs < 10) secs = '0' + secs;
            if (timeEl) timeEl.textContent = mins + ':' + secs;
        }
        progressRAF = requestAnimationFrame(update);
    }

    progressRAF = requestAnimationFrame(update);
}

// ================================================================
// CONTROLS
// ================================================================
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        clearTimeout(slideTimer);
        isPlaying = false;
        document.getElementById('playIcon').textContent = '▶️';
    } else {
        audio.play();
        isPlaying = true;
        document.getElementById('playIcon').textContent = '⏸️';
    }
}

function toggleMute() {
    isMuted = !isMuted;
    audio.muted = isMuted;
    document.getElementById('muteIcon').textContent = isMuted ? '🔇' : '🔊';
}

function replayShow() {
    clearTimeout(slideTimer);
    cancelAnimationFrame(progressRAF);

    isPlaying = false;
    audio.pause();
    audio.currentTime = 0;
    showStartTime = Date.now();

    if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        totalDuration = audio.duration * 1000;
    } else {
        totalDuration = 180000;
    }

    var photoTime = totalDuration - INTRO_DURATION - OUTRO_DURATION;
    photoInterval = Math.max(photoTime / PHOTOS.length, 3000);

    var p = audio.play();
    if (p && p.then) {
        p.then(function () {
            isPlaying = true;
            document.getElementById('playIcon').textContent = '⏸️';
        }).catch(function () {
            isPlaying = true;
        });
    }
    isPlaying = true;

    startProgressTracker();
    showIntro();
}

function toggleFullscreen() {
    try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            var el = document.documentElement;
            if (el.requestFullscreen) el.requestFullscreen();
            else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    } catch (e) { }
}

document.addEventListener('keydown', function (e) {
    if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    else if (e.key === 'f' || e.key === 'F') { toggleFullscreen(); }
    else if (e.key === 'm' || e.key === 'M') { toggleMute(); }
    else if (e.key === 'r' || e.key === 'R') { replayShow(); }
});

// ================================================================
// PARTICLES
// ================================================================
function initParticles() {
    var canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var COLORS = ['#ff6b9d', '#ff8a5c', '#ffa751', '#c471ed', '#ffd700', '#ff69b4'];
    var particles = [];

    for (var i = 0; i < 100; i++) {
        particles.push(makeP());
    }

    function makeP() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            s: Math.random() * 2.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            a: Math.random() * Math.PI * 2,
            sp: (Math.random() - 0.5) * 0.03,
            c: COLORS[Math.floor(Math.random() * COLORS.length)],
            l: Math.random() * 0.5 + 0.5
        };
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx + Math.sin(p.a) * 0.3;
            p.y += p.vy;
            p.a += p.sp;
            p.l -= 0.002;
            if (p.l <= 0 || p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
                particles[i] = makeP();
                continue;
            }
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.l * 0.6);
            ctx.fillStyle = p.c;
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.c;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ================================================================
// FLOATING EMOJIS
// ================================================================
function initFloatingEmojis() {
    var container = document.getElementById('floatingElements');
    if (!container) return;
    setInterval(function () {
        var el = document.createElement('div');
        el.className = 'floating-item';
        el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        el.style.animationDuration = (Math.random() * 6 + 7) + 's';
        container.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 14000);
    }, 900);
}

// ================================================================
// VISUALIZER
// ================================================================
function initVisualizer() {
    var el = document.getElementById('visualizer');
    if (!el) return;
    el.innerHTML = '';
    var bars = [];
    for (var i = 0; i < 35; i++) {
        var b = document.createElement('div');
        b.className = 'vis-bar';
        b.style.height = '2px';
        el.appendChild(b);
        bars.push(b);
    }
    setInterval(function () {
        for (var j = 0; j < bars.length; j++) {
            bars[j].style.height = (isPlaying ? Math.random() * 18 + 2 : 2) + 'px';
        }
    }, 120);
}
