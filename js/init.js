const soundUrls = [
    'snd/battle-begin.ogg',
    'snd/expecting-send.ogg',
    'snd/ping-thinking-about.ogg',
    'snd/save.ogg',
    'snd/send.ogg',
    'snd/tick-tock.ogg',
    'snd/welcome.ogg',
    'snd/windgust.ogg',
    'snd/Fiesta.ogg'
];

const buildPhaseDuration = [13, 7];
const fightPhaseDuration = 5;
const maxWaves = 30;
const fontSizeRatio = 0.024;
const playerColors = ['red', 'blue', 'orange', 'purple', 'yellow', 'cyan', 'green', 'pink'];
const playerColorsHueRotateFromYellow = ['-60deg', '180deg', '-30deg', '-120deg', '0deg', '120deg', '60deg', '90deg'];

let playerIndex = 0;
let playerColor = playerColors[playerIndex];

window.addEventListener('DOMContentLoaded', initializeAndCache);
window.addEventListener('resize', updateDimensions);
window.addEventListener('load', updateDimensions);

function initializeAndCache() {

    console.info('DOM Content Loaded');

    preloadSounds(soundUrls).then(() => {
        console.info('All sounds loaded');
        document.getElementById("start-button").style.opacity = '1';
    }).catch(error => {
        console.error('Error while preloading sounds:', error);
    });

    updateDimensions();
    initializeWaveInfoContainers();

    document.getElementById("pub-span-kidev").addEventListener('mousedown', event => {
        if (event.buttons & 1) {
            playOggSound('snd/Fiesta.ogg');
        }
    });

    document.getElementById("start-button").addEventListener('mousedown', event => {
        if (event.buttons & 1) {
            window.startUILoop();
            document.getElementById("start-button").style.opacity = '0';
        }
    });

    document.getElementById("bottom-left-input").addEventListener('blur', event => {
        document.getElementById("bottom-left-txt").style.animation = 'fadeOut 1s forwards';
    });

    document.getElementById("bottom-left-input").addEventListener('focus', event => {
        document.getElementById("bottom-left-txt").style.animation = '';
        document.getElementById("bottom-left-txt").style.opacity = '1';
    });

    document.getElementById("bottom-left-input").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const typedText = document.getElementById("bottom-left-input").value;

            if (typedText === '/fast') {
                timeReducer = 5.0;
                endLoopingInterval();
                phaseTimer = setInterval(nextSecond, 1000 / timeReducer);
                ChatPrintAll(`<span style="color: green">Fast mode enabled</span>`);
            }
            else if (typedText === '/slow') {
                timeReducer = 1.0;
                endLoopingInterval();
                phaseTimer = setInterval(nextSecond, 1000);
                ChatPrintAll(`<span style="color: green">Fast mode disabled</span>`);
            }
            else if (typedText === '/mute') {
                soundVolume = 0.0;
                ChatPrintAll(`<span style="color: green">Sounds disabled</span>`);
            }
            else if (typedText === '/unmute') {
                soundVolume = 0.1;
                ChatPrintAll(`<span style="color: green">Sounds enabled</span>`);
            }
            else if (typedText === '/start') {
                if (document.getElementById("start-button").style.opacity === '1') {
                    ChatPrintAll(`<span style="color: green">Started game!</span>`);
                    window.startUILoop();
                    document.getElementById("start-button").style.opacity = '0';
                }
            }
            else if (typedText === '/help') {
                ChatPrintAll(`<span style="color: green">Commands: /help, /fast, /slow, /mute, /unmute<br/>/start, /reset, /stop, /restart, /idX<br/><br/>Made with love by Kidev :)</span>`);
            }
            else if (typedText === '/id0') {
                ChatPrintAll(`<span style="color: green">You are now player with id=0<br/></span>`);
                playerIndex = 0;
            }
            else if (typedText === '/id1') {
                ChatPrintAll(`<span style="color: green">You are now player with id=0<br/></span>`);
                playerIndex = 1;
            }
            else if (typedText === '/id2') {
                ChatPrintAll(`<span style="color: green">You are now player with id=0<br/></span>`);
                playerIndex = 2;
            }
            else if (typedText === '/id3') {
                ChatPrintAll(`<span style="color: green">You are now player with id=0<br/></span>`);
                playerIndex = 3;
            }
            else if (typedText === '/clear') {
                ChatPrintAll(`<span style="color: green">You cleared all pings<br/></span>`);
                clearPings();
            }
            else if (typedText === '/reset' || typedText === '/stop' || typedText === '/restart') {
                ChatPrintAll(`<span style="color: green">Game restarted!</span>`);
                resetGame();
            } else {
                ChatPrint(playerIndex, `<span style="color: ${playerColor}">player_${playerIndex}</span>: ${typedText}`);
            }

            document.getElementById("bottom-left-input").value = '';
        }
    });
}

function updateDimensions() {
    const screenW = window.innerWidth;
    const imageW = uiImage.clientWidth;

    if (screenW < imageW) {
        const scaleFactor = screenW / imageW;
        uiContainer.style.transform = `scale(${scaleFactor})`;
        uiContainer.style.transformOrigin = 'top left';
    } else {
        uiContainer.style.transform = 'scale(1)';
    }

    //const containerHeight = uiContainer.clientHeight;
    const containerWidth = uiImage.clientWidth;

    uiContainer.style.width = `${containerWidth}px`;
    const fontSize = containerWidth * fontSizeRatio; // Adjust the multiplier to change the font size
    uiText.style.fontSize = `${fontSize}px`;

    timerText.textContent = '';
    timerText.style.fontSize = `${fontSize * 3.5}px`;
    timerText.style.marginBottom = `${fontSize * 1.5}px`;

    line1mid.style.fontSize = `${fontSize * 1.1}px`;
    line2mid.style.fontSize = `${fontSize * 2.0}px`;
    line3mid.style.fontSize = `${fontSize * 1.1}px`;

    midText.style.marginTop = `${fontSize * 0.5}px`;

    document.getElementById('top-right-txt').style.fontSize = `${fontSize * 0.7}px`;
    document.getElementById('bottom-left-txt').style.fontSize = `${fontSize * 1.1}px`;
}

function loadAudio(url) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.addEventListener('canplaythrough', () => {
            resolve(audio);
        });
        audio.addEventListener('error', () => {
            reject(new Error(`Error loading sound: ${url}`));
        });
    });
}

function preloadSounds(soundUrls) {
    return Promise.all(soundUrls.map(loadAudio));
}

function writeToLogDiv(message, error = false) {
    const msg = document.createElement('span');
    const chatTxt = document.getElementById('top-right-txt');

    if (error) {
        msg.innerHTML =  `<span style="color: red;">${message}</span><br/>`;
    } else {
        msg.innerHTML =  `<span style="color: white; font-style: italic;">${message}</span><br/>`;
    }

    chatTxt.appendChild(msg)
}

console.log = (function (originalLog) {
    return function (...args) {
        originalLog.apply(console, args); // Call the original console.log function

        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
        writeToLogDiv(message);
    };
})(console.log);

console.info = (function (originalLog) {
    return function (...args) {
        originalLog.apply(console, args); // Call the original console.log function

        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
        writeToLogDiv(`<span style="color: grey">LOG: ${message}</span>`);
    };
})(console.info);

console.error = (function (originalLog) {
    return function (...args) {
        originalLog.apply(console, args); // Call the original console.log function

        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
        writeToLogDiv(message, true);
    };
})(console.error);
