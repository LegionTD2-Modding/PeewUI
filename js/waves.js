const coolDownTime = 1000;
const wavesIcons = document.querySelector('.ui-container .ui-text .grid-item.top-row.right-col');
const pingTypeName = ['send', 'save', 'rec'];
const pingTypeIconPath = ['img/icons/sending.png', 'img/icons/saving.png', 'img/icons/receiving.png'];

const touchLongPressTime = 600;
let touchTimer;

// playersPings[player_id][ping_type] = wave_id (if < 0 => thinking about)
let playersPings = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
let playersCoolDown = [0, 0, 0, 0];

function onLeftClickWaveIcon(ctrl, wave_id) {
    if (wave_id <= currentWave) {
        return;
    }
    if (ctrl) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` is thinking about sending <span style="font-weight: bold">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/save.ogg');
        ChatPrint(playerIndex, ` wants to send <span style="font-weight: bold">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 0, ctrl);
}

function onMiddleClickWaveIcon(ctrl, wave_id) {
    if (wave_id <= currentWave) {
        return;
    }
    if (ctrl) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` is thinking about saving from <span style="font-weight: bold">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/save.ogg');
        ChatPrint(playerIndex, ` wants to start saving <span style="font-weight: bold">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 1, ctrl);
}

function onRightClickWaveIcon(ctrl, wave_id) {
    if (wave_id <= currentWave) {
        return;
    }
    if (ctrl) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` thinks he may get sent <span style="font-weight: bold">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/expecting-send.ogg');
        ChatPrint(playerIndex, ` expects the ennemy to send at <span style="font-weight: bold">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 2, ctrl);
}

function createImageContainer(index) {
    // Container
    const container = document.createElement('div');
    const wave_id_capped = Math.max(1, Math.min(21, index));

    container.id = `wave-${index}`;
    container.className = 'wave-container';

    container.style.cursor = 'pointer';

    const aura = document.createElement('div');
    aura.className = 'wave-container-aura-ping';

    const sendIcon = document.createElement('img');
    sendIcon.className = 'wave-ping-icon';
    sendIcon.id = 'ping-icon-send';
    sendIcon.src = 'img/icons/sending.png';
    const thinkSendIcon = document.createElement('img');
    thinkSendIcon.className = 'wave-ping-icon';
    thinkSendIcon.id = 'ping-icon-think-send';
    thinkSendIcon.src = 'img/icons/thinking_sending.png';

    const saveIcon = document.createElement('img');
    saveIcon.className = 'wave-ping-icon';
    saveIcon.id = 'ping-icon-save';
    saveIcon.src = 'img/icons/saving.png';
    const thinkSaveIcon = document.createElement('img');
    thinkSaveIcon.className = 'wave-ping-icon';
    thinkSaveIcon.id = 'ping-icon-think-save';
    thinkSaveIcon.src = 'img/icons/thinking_saving.png';

    const recIcon = document.createElement('img');
    recIcon.className = 'wave-ping-icon';
    recIcon.id = 'ping-icon-rec';
    recIcon.src = 'img/icons/receiving.png';
    const thinkRecIcon = document.createElement('img');
    thinkRecIcon.className = 'wave-ping-icon';
    thinkRecIcon.id = 'ping-icon-think-rec';
    thinkRecIcon.src = 'img/icons/thinking_receiving.png';

    container.appendChild(aura);
    container.appendChild(sendIcon); container.appendChild(thinkSendIcon);
    container.appendChild(saveIcon); container.appendChild(thinkSaveIcon);
    container.appendChild(recIcon); container.appendChild(thinkRecIcon);

    const clickWaveIconFunc = (event) => {

        event.preventDefault();

        if (isPlayerCoolDowned(playerIndex)) {
            return;
        }

        if (event.buttons & 1) {
            onLeftClickWaveIcon(event.ctrlKey, index);
        } else if (event.buttons & 2) {
            onRightClickWaveIcon(event.ctrlKey, index);
        } else if (event.buttons & 4) {
            onMiddleClickWaveIcon(event.ctrlKey, index);
        } else {
            console.log('Unknown click type detected.');
        }
    };

    const handleLongTouchPress = (event) => {
        clickWaveIconFuncTouch(event, 2);
    };
    const clickWaveIconFuncTouch = (event, touch_type) => {

        if (isPlayerCoolDowned(playerIndex)) {
            return;
        }

        if (touch_type === 1) { // simple press
            onLeftClickWaveIcon(event.ctrlKey, index);
        } else if (touch_type === 2) { // long press
            onMiddleClickWaveIcon(false, index);
        }
    };

    container.addEventListener('mousedown', clickWaveIconFunc);

    container.addEventListener('touchstart', (event) => {
        event.preventDefault();
        touchTimer = setTimeout(handleLongTouchPress, touchLongPressTime);
    });
    container.addEventListener('touchend', (event) => {
        event.preventDefault();
        clearTimeout(touchTimer);
        clickWaveIconFuncTouch(event, 1);
    });
    container.addEventListener('touchcancel', (event) => {
        event.preventDefault();
        clearTimeout(touchTimer);
        clickWaveIconFuncTouch(event, 1);
    });

    container.addEventListener('mouseenter', () => {
        document.getElementById('wave-infos-tooltip').innerHTML = getWaveInfosTooltip(index);
        document.getElementById('wave-infos-tooltip').style.display = 'block';
    });
    container.addEventListener('mouseleave', () => {
        document.getElementById('wave-infos-tooltip').style.display = 'none';
    });

    // Wave icon
    const mainImage = document.createElement('img');
    mainImage.src = `img/${wave_id_capped}.png`;
    mainImage.className = 'wave-main-image';

    container.appendChild(mainImage);

    for (let num_id = 1; num_id <= 4; num_id++) {
        const detailImage = document.createElement('img');
        detailImage.src = `img/icons/${num_id}.png`;
        detailImage.className = 'wave-num-votes-image';
        detailImage.id = `wave-${index}-votes-${num_id}`;

        detailImage.style.display = 'none';

        container.appendChild(detailImage);
    }

    return container;
}

function clearAllWaveInfoContainers() {
    document.querySelectorAll('.wave-container').forEach(e => e.remove());
}

function initializeWaveInfoContainers() {
    for (let wave_id = 1; wave_id < wavesData.length; wave_id++) {
        wavesIcons.appendChild(createImageContainer(wave_id));
    }
}

function clearPings() {
    document.querySelectorAll(`.wave-num-votes-image`).forEach(img => {
        img.style.display = 'none';
    });
    for (let player_id = 0; player_id < playersPings.length; player_id++) {
        playersPings[player_id] = [0, 0, 0];
    }
    hideSubUI();
}

function pingWaveFor(wave_id, player_id, ping_type, is_ctrl) {
    let absLastValue = Math.abs(playersPings[player_id][ping_type]);
    playersPings[player_id][ping_type] = (is_ctrl ? -wave_id : wave_id);

    if (absLastValue !== 0) {
        updateVoteCountThisWave(absLastValue);
    }

    updateVoteCountThisWave(wave_id);

    pingVisualEffects(wave_id, player_id, ping_type, is_ctrl);
}

function pingVisualEffects(wave_id, player_id, ping_type, is_ctrl) {

    const aura = document.querySelector(`#wave-${wave_id} .wave-container-aura-ping`);

    aura.style.background = getPlayerAura(player_id);
    aura.style.animation = 'waveAuraEffect 2s linear 1';

    aura.addEventListener('animationend',  () => {
        aura.style.animation = '';
    });

    let pingName = pingTypeName[ping_type];
    let pingId = (is_ctrl ? `ping-icon-think-${pingName}` : `ping-icon-${pingName}`);
    const pingIconElement = document.querySelector(`#wave-${wave_id} #${pingId}`);

    pingIconElement.style.display = 'block';
    pingIconElement.style.animation = `wavePingIconEffect 2s linear 1`;

    pingIconElement.addEventListener('animationend',  function () {
        pingIconElement.style.animation = '';
        pingIconElement.style.display = 'none';
    });
}

function computeWavePingVotes(wave_id) {
    let votes = [0, 0, 0];

    for (let player_id = 0; player_id < playersPings.length; player_id++) {
        for (let ping_id = 0; ping_id < votes.length; ping_id++) {
            if (playersPings[player_id][ping_id] === wave_id) {
                votes[ping_id]++;
            }
        }
    }
    return votes;
}

function updateVoteCountThisWave(wave_id) {

    for (let n_p = 1; n_p <= 4; n_p++) {
        const elem_t = document.getElementById(`wave-${wave_id}-votes-${n_p}`);
        elem_t.style.display = 'none';
    }

    let votes = computeWavePingVotes(wave_id);
    let ping_type_winner = votes.indexOf(Math.max(...votes));
    if (ping_type_winner >= 0) {
        let num_votes= votes[ping_type_winner];
        if (num_votes >= 1) {
            const elem = document.getElementById(`wave-${wave_id}-votes-${num_votes}`);
            elem.style.display = 'block';
        }
    }

}

function showMostPingedTypeThisWave(wave_id) {

    for (let n_p = 1; n_p <= 4; n_p++) {
        const elem_t = document.getElementById(`wave-${wave_id}-votes-${n_p}`);
        elem_t.style.display = 'none';
    }

    let votes = computeWavePingVotes(wave_id);
    let ping_type_winner = votes.indexOf(Math.max(...votes));

    if (ping_type_winner >= 0 && votes[ping_type_winner] >= 1) {
        document.getElementById('icon-team-choice').src = pingTypeIconPath[ping_type_winner];

        showSubUI();
    }
}

function showSubUI() {
    const sub_ui = document.getElementById("ui-info-pings");
    if (!sub_ui.classList.contains('sub-ui-deployed')) {
        sub_ui.style.animation = 'slideOutOfTop 0.5s forwards';
        sub_ui.addEventListener('animationend',  function () {
            sub_ui.classList.add('sub-ui-deployed');
        });
    }
}

function hideSubUI() {
    const sub_ui = document.getElementById("ui-info-pings");
    if (sub_ui.classList.contains('sub-ui-deployed')) {
        sub_ui.style.animation = 'slideUnderTop 0.5s forwards';
        sub_ui.addEventListener('animationend',  function () {
            sub_ui.classList.remove('sub-ui-deployed');
        });
    }
}

function getWaveInfosTooltip(wave_id) {
    const wave = wavesData[wave_id];
    return   `<span style="color: #ffcc00"><br/>Wave ${wave.wave}</span><br/>`
        + `<span style="color: #909090">${wave.creature} (${wave.amount})</span><br/><br/>`
        + `<img style="height: 2vh; width: 2vh;" src="img/types/${wave.dmgType}.png"> ${wave.dmgType}<br/>`
        + `<img style="height: 2vh; width: 2vh;" src="img/types/${wave.defType}.png"> ${wave.defType}<br/><br/>`
        + `<img style="height: 1.5vh; width: 1.5vh;" src="img/icons/Gold.png"><span style="color: #ffcc00"> ${wave.reward}</span>`
        + `&nbsp;&nbsp;&nbsp;&nbsp;<img style="height: 1.5vh; width: 1.5vh;" src="img/icons/Value.png"><span style="color: #ffffff"> ${wave.value}</span><br/>`
        + `<img style="height: 2vh; width: 1.5vh;" src="img/icons/Health.png"><span style="color: #ffcc00"> ${wave.hp}</span>`
        + `&nbsp;&nbsp;&nbsp;&nbsp;<img style="height: 1.5vh; width: 1.5vh;" src="img/icons/Damage.png"><span style="color: #ffffff"> ${wave.dps}</span>`
        + (wave.range > 100 ? `&nbsp;&nbsp;&nbsp;&nbsp;<img style="height: 1.5vh; width: 1.5vh;" src="img/icons/Range.png"><span style="color: #ffffff"> ${wave.range}</span><br/>` : `<br/>`);
}
