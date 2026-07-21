// ================================================================
// 7 PHOTOS + birthday.mp4 - Ready for Kruthi 💋😘❤️
// ================================================================

var PHOTOS = [
    "./assets/photos/photo1.jpeg",
    "./assets/photos/photo2.jpeg",
    "./assets/photos/photo3.jpeg",
    "./assets/photos/photo4.jpeg",
    "./assets/photos/photo5.jpeg",
    "./assets/photos/photo6.jpeg",
    "./assets/photos/photo7.jpeg"
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

var MUSIC_FILE = "./assets/music/birthday.mp4";

// ================================================================
// DO NOT EDIT BELOW THIS LINE
// ================================================================

var TRANSITIONS = ['anim-fade','anim-zoom','anim-left','anim-right','anim-top','anim-rotate','anim-flip','anim-bounce'];
var FLOAT_EMOJIS = ['💖','💕','✨','🎂','🎉','🎈','🌹','💝','🎊','⭐','💫','🥳','💋','😘','❤️'];
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

// ================================================================
// WAIT FOR PAGE LOAD
// ================================================================
window.addEventListener('load', function() {
    startLoading();
});

// ================================================================
// LOADING
// ================================================================
function startLoading() {
    var bar = document.getElementById('loadingBar');
    var loaded = 0;
    var total = PHOTOS.length + 1;
    var audioLoaded = false;

    function tick() {
        loaded++;
        var pct = Math.round((loaded / total) * 100);
        bar.style.width = pct + '%';
        if (loaded >= total) {
            setTimeout(function() {
                showStartScreen();
            }, 800);
        }
    }

    // Preload images
    for (var i = 0; i < PHOTOS.length; i++) {
        (function(src) {
            var img = new Image();
            img.onload = function() { tick(); };
            img.onerror = function() {
                console.log('Failed to load: ' + src);
                tick();
            };
            img.src = src;
        })(PHOTOS[i]);
    }

    // Create audio element
    audio = new Audio();
    audio.preload = 'auto';
    audio.src = MUSIC_FILE;

    audio.addEventListener('canplaythrough', function() {
        if (!audioLoaded) {
            audioLoaded = true;
            tick();
        }
    });

    audio.addEventListener('loadeddata', function() {
        if (!audioLoaded) {
            audioLoaded = true;
            tick();
        }
    });

    audio.addEventListener('error', function(e) {
        console.log('Audio error:', e);
        if (!audioLoaded) {
            audioLoaded = true;
            tick();
        }
    });

    // Fallback if audio takes too long
    setTimeout(function() {
        if (!audioLoaded) {
            audioLoaded = true;
            tick();
        }
    }, 5000);

    audio.load();
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
    setInterval(function() {
        var el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.left = Math.random() * 100 + '%';
        el.style.bottom = '-50px';
        el.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        el.style.animation = 'floatUp ' + (Math.random() * 5 + 6) + 's linear forwards';
        el.style.pointerEvents = 'none';
        el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
        container.appendChild(el);
        setTimeout(function() { el.remove(); }, 12000);
    }, 700);
}

// ================================================================
// EVENT LISTENERS
// ================================================================
document.getElementById('startPlayBtn').addEventListener('click', function() {
    beginShow();
});

document.getElementById('playPauseBtn').addEventListener('click', function() {
    togglePlay();
});

document.getElementById('restartBtn').addEventListener('click', function() {
    replayShow();
});

document.getElementById('muteBtn').addEventListener('click', function() {
    toggleMute();
});

document.getElementById('fullscreenBtn').addEventListener('click', function() {
    toggleFullscreen();
});

document.getElementById('replayBtn').addEventListener('click', function() {
    replayShow();
});

// ================================================================
// BEGIN SHOW
// ================================================================
function beginShow() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('playerScreen').classList.remove('hidden');

    // Try fullscreen
    try {
        var el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } catch(e) {}

    // Get audio duration
    if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        startShow();
    } else {
        audio.addEventListener('loadedmetadata', function() {
            startShow();
        });
        setTimeout(function() {
            if (!isPlaying) startShow();
        }, 3000);
    }
}

function startShow() {
    if (isPlaying) return;

    // Duration
    if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        totalDuration = audio.duration * 1000;
    } else {
        totalDuration = 180000;
    }

    // Photo timing
    var photoTime = totalDuration - INTRO_DURATION - OUTRO_DURATION;
    photoInterval = Math.max(photoTime / PHOTOS.length, 3000);

    // Play audio
    audio.currentTime = 0;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(function() {
            isPlaying = true;
        }).catch(function(err) {
            console.log('Audio play error:', err);
            isPlaying = true;
        });
    }
    isPlaying = true;

    // Init visuals
    initParticles();
    initFloatingEmojis();
    initVisualizer();

    // Progress
    showStartTime = Date.now();
    initProgressBar();
    startProgressTracker();

    // Audio end
    audio.addEventListener('ended', function() {
        isPlaying = false;
        document.getElementById('playIcon').textContent = '▶️';
        showOutro();
    });

    // Show intro
    showIntro();
}

// ================================================================
// PROGRESS BAR
// ================================================================
function initProgressBar() {
    var bar = document.getElementById('progressBar');
    var fill = bar.querySelector('.progress-fill');
    if (!fill) {
        fill = document.createElement('div');
        fill.className = 'progress-fill';
        bar.appendChild(fill);
    }
}

function startProgressTracker() {
    var fill = document.querySelector('.progress-fill');
    var timeEl = document.getElementById('progressTime');

    function update() {
        if (!audio || !audio.duration || isNaN(audio.duration)) {
            progressRAF = requestAnimationFrame(update);
            return;
        }

        var elapsed = audio.currentTime;
        var pct = Math.min((elapsed / audio.duration) * 100, 100);

        if (fill) fill.style.width = pct + '%';

        var mins = Math.floor(elapsed / 60);
        var secs = Math.floor(elapsed % 60);
        if (secs < 10) secs = '0' + secs;
        timeEl.textContent = mins + ':' + secs;

        progressRAF = requestAnimationFrame(update);
    }

    progressRAF = requestAnimationFrame(update);
}

// ================================================================
// SCREENS
// ================================================================
function showIntro() {
    document.getElementById('introScreen').classList.remove('hidden');
    document.getElementById('photoDisplay').classList.add('hidden');
    document.getElementById('outroScreen').classList.add('hidden');

    clearTimeout(slideTimer);
    slideTimer = setTimeout(function() {
        document.getElementById('introScreen').classList.add('hidden');
        showPhoto(0);
    }, INTRO_DURATION);
}

function showPhoto(index) {
    var elapsed = Date.now() - showStartTime;
    var remaining = totalDuration - elapsed;

    if (index >= PHOTOS.length || remaining <= OUTRO_DURATION) {
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

    // Remove old transitions
    for (var i = 0; i < TRANSITIONS.length; i++) {
        frame.classList.remove(TRANSITIONS[i]);
    }
    frame.classList.remove('ken-burns');

    // Set image
    img.src = PHOTOS[index];

    // Random transition
    var t = TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
    frame.offsetWidth;
    frame.classList.add(t);

    // Ken Burns after transition
    setTimeout(function() {
        for (var j = 0; j < TRANSITIONS.length; j++) {
            frame.classList.remove(TRANSITIONS[j]);
        }
        frame.classList.add('ken-burns');
    }, 1200);

    // Caption
    var capText = CAPTIONS[index];
    caption.style.animation = 'none';
    caption.offsetWidth;
    caption.textContent = capText;
    caption.style.animation = 'captionIn 0.8s ease forwards';

    // Counter
    number.textContent = '📸 ' + (index + 1) + ' / ' + PHOTOS.length;

    // Next photo
    clearTimeout(slideTimer);
    slideTimer = setTimeout(function() {
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

        var elapsed = audio.currentTime * 1000;
        var outroStart = totalDuration - OUTRO_DURATION;

        if (elapsed < INTRO_DURATION) {
            showIntro();
        } else if (elapsed >= outroStart) {
            showOutro();
        } else {
            var photoElapsed = elapsed - INTRO_DURATION;
            var photoIdx = Math.floor(photoElapsed / photoInterval);
            showPhoto(Math.min(photoIdx, PHOTOS.length - 1));
        }
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

    audio.play().then(function() {
        isPlaying = true;
        document.getElementById('playIcon').textContent = '⏸️';
    }).catch(function() {
        isPlaying = true;
    });

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
    } catch(e) {}
}

// Keyboard
document.addEventListener('keydown', function(e) {
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
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var COLORS = ['#ff6b9d','#ff8a5c','#ffa751','#c471ed','#ffd700','#ff69b4'];
    var particles = [];

    for (var i = 0; i < 100; i++) {
        particles.push(makeParticle());
    }

    function makeParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.03,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: Math.random() * 0.5 + 0.5
        };
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx + Math.sin(p.angle) * 0.3;
            p.y += p.vy;
            p.angle += p.spin;
            p.life -= 0.002;

            if (p.life <= 0 || p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
                particles[i] = makeParticle();
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life * 0.6);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        for (var a = 0; a < particles.length; a += 3) {
            for (var b = a + 1; b < particles.length; b += 3) {
                var dx = particles[a].x - particles[b].x;
                var dy = particles[a].y - particles[b].y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < 80) {
                    ctx.save();
                    ctx.globalAlpha = 0.05 * (1 - d / 80);
                    ctx.strokeStyle = particles[a].color;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        requestAnimationFrame(loop);
    }

    loop();

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ================================================================
// FLOATING EMOJIS
// ================================================================
function initFloatingEmojis() {
    var container = document.getElementById('floatingElements');
    setInterval(function() {
        var el = document.createElement('div');
        el.className = 'floating-item';
        el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        el.style.animationDuration = (Math.random() * 6 + 7) + 's';
        container.appendChild(el);
        setTimeout(function() { el.remove(); }, 14000);
    }, 900);
}

// ================================================================
// VISUALIZER
// ================================================================
function initVisualizer() {
    var el = document.getElementById('visualizer');
    el.innerHTML = '';
    var count = 35;
    var bars = [];

    for (var i = 0; i < count; i++) {
        var b = document.createElement('div');
        b.className = 'vis-bar';
        b.style.height = '2px';
        el.appendChild(b);
        bars.push(b);
    }

    setInterval(function() {
        for (var j = 0; j < bars.length; j++) {
            var h = isPlaying ? Math.random() * 18 + 2 : 2;
            bars[j].style.height = h + 'px';
        }
    }, 120);
}