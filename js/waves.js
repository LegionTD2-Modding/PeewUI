const coolDownTime = 1000;
const wavesIcons = document.querySelector('.ui-container .ui-text .grid-item.top-row.right-col');
const pingTypeName = ['send', 'save', 'rec'];


// playersPings[player_id][ping_type] = wave_id (if < 0 => thinking about)
let playersPings = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
let playersCoolDown = [0, 0, 0, 0];

function onLeftClickWaveIcon(event, wave_id) {
    if (event.ctrlKey) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` is thinking about sending <span style="font-weight: bold">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/save.ogg');
        ChatPrint(playerIndex, ` wants to send <span style="font-weight: bold">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 0, event.ctrlKey);
    event.preventDefault();
}

function onMiddleClickWaveIcon(event, wave_id) {
    if (event.ctrlKey) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` is thinking about saving from <span style="font-weight: bold">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/save.ogg');
        ChatPrint(playerIndex, ` wants to start saving <span style="font-weight: bold">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 1, event.ctrlKey);
    event.preventDefault();
}

function onRightClickWaveIcon(event, wave_id) {
    if (event.ctrlKey) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` thinks he may get sent <span style="font-weight: bold">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/expecting-send.ogg');
        ChatPrint(playerIndex, ` expects the ennemy to send at <span style="font-weight: bold">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 2, event.ctrlKey);
    event.preventDefault();
}

function createImageContainer(index) {
    // Container
    const container = document.createElement('div');
    const wave_id_capped = Math.max(1, Math.min(21, index));

    container.id = `wave-${index}`;
    container.className = 'wave-container';

    const aura = document.createElement('div');
    aura.className = 'wave-container-aura-ping';

    const sendIcon = document.createElement('img');
    sendIcon.className = 'wave-ping-icon';
    sendIcon.id = 'ping-icon-send';
    sendIcon.src = '../img/icons/sending.png';
    const thinkSendIcon = document.createElement('img');
    thinkSendIcon.className = 'wave-ping-icon';
    thinkSendIcon.id = 'ping-icon-think-send';
    thinkSendIcon.src = '../img/icons/thinking_sending.png';

    const saveIcon = document.createElement('img');
    saveIcon.className = 'wave-ping-icon';
    saveIcon.id = 'ping-icon-save';
    saveIcon.src = '../img/icons/saving.png';
    const thinkSaveIcon = document.createElement('img');
    thinkSaveIcon.className = 'wave-ping-icon';
    thinkSaveIcon.id = 'ping-icon-think-save';
    thinkSaveIcon.src = '../img/icons/thinking_saving.png';

    const recIcon = document.createElement('img');
    recIcon.className = 'wave-ping-icon';
    recIcon.id = 'ping-icon-rec';
    recIcon.src = '../img/icons/receiving.png';
    const thinkRecIcon = document.createElement('img');
    thinkRecIcon.className = 'wave-ping-icon';
    thinkRecIcon.id = 'ping-icon-think-rec';
    thinkRecIcon.src = '../img/icons/thinking_receiving.png';

    container.appendChild(aura);
    container.appendChild(sendIcon); container.appendChild(thinkSendIcon);
    container.appendChild(saveIcon); container.appendChild(thinkSaveIcon);
    container.appendChild(recIcon); container.appendChild(thinkRecIcon);

    container.addEventListener('mousedown', event => {

        if (isPlayerCoolDowned(playerIndex)) {
            return;
        }

        if (event.buttons & 1) {
            onLeftClickWaveIcon(event, index);
        } else if (event.buttons & 2) {
            onRightClickWaveIcon(event, index);
        } else if (event.buttons & 4) {
            onMiddleClickWaveIcon(event, index);
        } else {
            console.log('Unknown click type detected.');
        }
    });

    // Main image
    const mainImage = document.createElement('img');
    mainImage.src = `img/${wave_id_capped}.png`;
    mainImage.className = 'wave-main-image';

    container.appendChild(mainImage);

    // Corner images
    const cornersClasses = ['wave-corner-0', 'wave-corner-1', 'wave-corner-2', 'wave-corner-3'];
    cornersClasses.forEach((corner, corner_id) => {
        const detailImage = document.createElement('img');
        detailImage.src = 'img/icons/1.png';
        detailImage.classList.add('wave-corner-image', corner);

        // Tint the image
        detailImage.style.filter = `hue-rotate(${playerColorsHueRotateFromYellow[corner_id]});`;
        detailImage.style.display = 'none';

        container.appendChild(detailImage);
    });

    return container;
}

function initializeWaveInfoContainers() {
    for (let wave_id = 1; wave_id < wavesData.length; wave_id++) {
        wavesIcons.appendChild(createImageContainer(wave_id));
    }
}

function clearPings() {
    document.querySelectorAll(`.wave-corner-image`).forEach(img => {
        img.style.display = 'none';
    });
}

function pingWaveFor(wave_id, player_id, ping_type, is_ctrl) {
    let absLastValue = Math.abs(playersPings[player_id][ping_type]);
    playersPings[player_id][ping_type] = (is_ctrl ? -wave_id : wave_id);

    if (absLastValue !== 0) {
        const oldCorner = document.querySelector(`#wave-${absLastValue} .wave-corner-${player_id}`);
        oldCorner.style.display = 'none';
    }

    const cornerImg = document.querySelector(`#wave-${wave_id} .wave-corner-${player_id}`);
    cornerImg.style.display = 'block';

    pingVisualEffects(wave_id, player_id, ping_type, is_ctrl);
}

function pingVisualEffects(wave_id, player_id, ping_type, is_ctrl) {

    const aura = document.querySelector(`#wave-${wave_id} .wave-container-aura-ping`);

    aura.style.background = getPlayerAura(player_id);
    aura.style.animation = 'waveAuraEffect 2s linear 1';

    aura.addEventListener('animationend',  () => {
        aura.style.animation = '';
        aura.style.visibility = 'none';
    });

    let pingName = pingTypeName[ping_type];
    let pingId = (is_ctrl ? `ping-icon-think-${pingName}` : `ping-icon-${pingName}`);
    const pingIconElement = document.querySelector(`#wave-${wave_id} #${pingId}`);

    pingIconElement.style.animation = `wavePingIconEffect 2s linear 1`;

    pingIconElement.addEventListener('animationend',  (wave_id) => showMostPingedTypeThisWave);
}

function showMostPingedTypeThisWave(wave_id) {

    let votes = [0, 0, 0];

    for (let player_id = 0; player_id < playersPings.length; player_id++) {
        for (let ping_id = 0; ping_id < votes.length; ping_id++) {
            if (playersPings[player_id][ping_id] === wave_id) {
                votes[ping_id]++;
            }
        }
    }

    let ping_type_winner = votes.indexOf(Math.max(...votes));

    if (ping_type_winner >= 0) {

        let pingName = pingTypeName[ping_type_winner];
        let pingId = `ping-icon-${pingName}`;
        const pingIconElement = document.querySelector(`#wave-${wave_id} #${pingId}`);

        pingIconElement.style.visibility = 'block';
        pingIconElement.style.opacity = '1';
    }

    for (let ping_type_other = 0; ping_type_other < 3; ping_type_other) {
        if (ping_type_other !== ping_type_winner) {

            let pingName = pingTypeName[ping_type_other];
            let pingId = `ping-icon-${pingName}`;
            const pingIconElementRandom = document.querySelector(`#wave-${wave_id} #${pingId}`);
            pingIconElementRandom.style.visibilit = 'none';
        }
    }
}
