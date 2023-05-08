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

const fontSizeRatio = 0.024;
const playerColors = ['#ec474e', '#417ded', '#f48b22', '#ac64d2'];
const playerAuras = ['236, 71, 78', '65, 125, 237', '244, 139, 34', '172, 100, 210'];

let playerIndex = 0;

let mouseOverChatArea = false;
let chatInputFocused = false;

let chatAlwaysDisplayed = false;

window.addEventListener('DOMContentLoaded', initializeAndCache);
window.addEventListener('resize', updateDimensions);
window.addEventListener('load', updateDimensions);

function initializeAndCache() {

    console.info('DOM Content Loaded');

    preloadSounds(soundUrls).then(() => {
        console.info('All sounds loaded');
        setPlayButtonVisibility(true);
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
            startUILoop();
            setPlayButtonVisibility(false);
        }
    });

    document.getElementById("chat-area-container").addEventListener('mouseenter', () => {
        mouseOverChatArea = true;
    });
    document.getElementById("chat-area-container").addEventListener('mouseleave', () => {
        mouseOverChatArea = false;
        checkIfWholeChatIsOutOfFocus();
    });
    document.getElementById("bottom-left-input").addEventListener('blur', event => {
        chatInputFocused = false;
        checkIfWholeChatIsOutOfFocus();
    });
    document.getElementById("bottom-left-input").addEventListener('focus', event => {
        chatInputFocused = true;
        document.getElementById("bottom-left-txt").style.animation = '';
        document.getElementById("bottom-left-txt").style.opacity = '1';
        autoScrollDownChat();
    });

    document.getElementById("bottom-left-input").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const typedText = document.getElementById("bottom-left-input").value;
            document.getElementById("bottom-left-input").value = '';

            autoScrollDownChat();

            if (isPlayerCoolDowned(playerIndex)) {
                return;
            }

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
                    startUILoop();
                    setPlayButtonVisibility(false);
                }
            }
            else if (typedText === '/help') {
                ChatPrintAll(`<span style="color: green">Commands: /help, /fast, /slow, /mute, /unmute<br/>/start, /reset, /stop, /restart, /idX, /chat, /fiesta<br/><br/>Made with love by Kidev :)</span>`);
            }
            else if (typedText === '/id0') {
                playerIndex = 0;
                ChatPrintAll(`<span style="color: green">You are now <span style="color: ${playerColors[playerIndex]}">player</span> with id: 0</span>`);
            }
            else if (typedText === '/id1') {
                playerIndex = 1;
                ChatPrintAll(`<span style="color: green">You are now <span style="color: ${playerColors[playerIndex]}">player</span> with id: 1</span>`);
            }
            else if (typedText === '/id2') {
                playerIndex = 2;
                ChatPrintAll(`<span style="color: green">You are now <span style="color: ${playerColors[playerIndex]}">player</span> with id: 2</span>`);
            }
            else if (typedText === '/id3') {
                playerIndex = 3;
                ChatPrintAll(`<span style="color: green">You are now <span style="color: ${playerColors[playerIndex]}">player</span> with id: 3</span>`);
            }
            else if (typedText === '/clear') {
                ChatPrintAll(`<span style="color: green">You cleared all pings</span>`);
                clearPings();
            }
            else if (typedText === '/chat') {
                chatAlwaysDisplayed = !chatAlwaysDisplayed;
                if (chatAlwaysDisplayed) {
                    ChatPrintAll(`<span style="color: green">Your chat is now always displayed</span>`);
                } else {
                    ChatPrintAll(`<span style="color: green">Your chat will now auto hide after some time</span>`);
                }
            }
            else if (typedText === '/fiesta') {
                playOggSound('snd/Fiesta.ogg');
            }
            else if (typedText === '/pause') {
                togglePause();
                if (pauseCycle) {
                    ChatPrintAll(`<span style="color: green">Game paused !</span>`);
                } else {
                    ChatPrintAll(`<span style="color: green">Game resumed !</span>`);
                }
            }
            else if (typedText === '/reset' || typedText === '/stop' || typedText === '/restart') {
                ChatPrintAll(`<span style="color: green">Game restarted!</span>`);
                resetGame();
            } else {
                ChatPrint(playerIndex, `: ${typedText}`);
            }
        }
    });
}

function checkIfWholeChatIsOutOfFocus() {
    if (!mouseOverChatArea && !chatInputFocused && !chatAlwaysDisplayed
        && document.getElementById("bottom-left-txt").style.opacity === '1')
    {
        document.getElementById("bottom-left-txt").style.animation = 'fadeOut 0.5s forwards';
    }
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

console.log = (function (originalLog) {
    return function (...args) {
        originalLog.apply(console, args); // Call the original console.log function

        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
        ConsolePrintAll(`[log] ${message}`);
    };
})(console.log);

console.info = (function (originalLog) {
    return function (...args) {
        originalLog.apply(console, args); // Call the original console.log function

        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
        ConsolePrintAll(`[info] ${message}`);
    };
})(console.info);

console.error = (function (originalLog) {
    return function (...args) {
        originalLog.apply(console, args); // Call the original console.log function

        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
        ConsolePrintAll(message, true);
    };
})(console.error);
