(() => {
  'use strict';

  const dom = {
    canvas: document.getElementById('game-canvas'),
    labelLayer: document.getElementById('label-layer'),
    damageOverlay: document.getElementById('damage-overlay'),
    hud: document.getElementById('hud'),
    loadingScreen: document.getElementById('loading-screen'),
    loadingSubtitle: document.getElementById('loading-subtitle'),
    loadingFill: document.getElementById('loading-fill'),
    loadingSteps: Array.from(document.querySelectorAll('#loading-steps li')),
    bootActions: document.getElementById('boot-actions'),
    playerNameInput: document.getElementById('player-name-input'),
    avatarPresetButtons: Array.from(document.querySelectorAll('[data-avatar-preset]')),
    avatarPresetDescription: document.getElementById('avatar-preset-description'),
    directModeToggle: document.getElementById('direct-mode-toggle'),
    soloButton: document.getElementById('solo-button'),
    hostButton: document.getElementById('host-button'),
    joinButton: document.getElementById('join-button'),
    menuButton: document.getElementById('menu-button'),
    playersButton: document.getElementById('players-button'),
    backpackButton: document.getElementById('backpack-button'),
    onlineButton: document.getElementById('online-button'),
    resumeButton: document.getElementById('resume-button'),
    resetButton: document.getElementById('reset-button'),
    fullscreenButton: document.getElementById('fullscreen-button'),
    menuWindow: document.getElementById('menu-window'),
    backpackWindow: document.getElementById('backpack-window'),
    networkWindow: document.getElementById('network-window'),
    closeNetworkButton: document.getElementById('close-network-button'),
    chatPanel: document.getElementById('chat-panel'),
    chatLog: document.getElementById('chat-log'),
    chatEntry: document.getElementById('chat-entry'),
    chatInput: document.getElementById('chat-input'),
    scorePanel: document.getElementById('score-panel'),
    scoreBody: document.querySelector('#score-table tbody'),
    healthPanel: document.getElementById('health-panel'),
    healthFill: document.getElementById('health-fill'),
    healthText: document.getElementById('health-text'),
    hotbarSlots: Array.from(document.querySelectorAll('.hotbar-slot')),
    backpackItems: Array.from(document.querySelectorAll('[data-slot-select]')),
    cameraButtons: Array.from(document.querySelectorAll('[data-camera]')),
    toolDescription: document.getElementById('tool-description'),
    hintBar: document.getElementById('hint-bar'),
    placeName: document.getElementById('place-name'),
    serverName: document.getElementById('server-name'),
    networkRoleLine: document.getElementById('network-role-line'),
    networkStatus: document.getElementById('network-status'),
    hostControls: document.getElementById('host-controls'),
    joinControls: document.getElementById('join-controls'),
    createInviteButton: document.getElementById('create-invite-button'),
    hostOfferOutput: document.getElementById('host-offer-output'),
    copyHostOfferButton: document.getElementById('copy-host-offer-button'),
    clearHostOfferButton: document.getElementById('clear-host-offer-button'),
    hostAnswerInput: document.getElementById('host-answer-input'),
    completeJoinButton: document.getElementById('complete-join-button'),
    clearHostAnswerButton: document.getElementById('clear-host-answer-button'),
    connectedPlayers: document.getElementById('connected-players'),
    joinOfferInput: document.getElementById('join-offer-input'),
    generateAnswerButton: document.getElementById('generate-answer-button'),
    clearJoinOfferButton: document.getElementById('clear-join-offer-button'),
    joinAnswerOutput: document.getElementById('join-answer-output'),
    copyJoinAnswerButton: document.getElementById('copy-join-answer-button'),
    clearJoinAnswerButton: document.getElementById('clear-join-answer-button')
  };

  const TAU = Math.PI * 2;
  const OUTLINE = rgba(18, 18, 18, 1);
  const DEFAULT_ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' }
  ];

  const COLORS = {
    grass: rgba(112, 159, 69, 1),
    grassDark: rgba(88, 131, 48, 1),
    stone: rgba(162, 162, 167, 1),
    stoneDark: rgba(102, 102, 106, 1),
    white: rgba(244, 244, 244, 1),
    roof: rgba(198, 40, 28, 1),
    brown: rgba(110, 74, 42, 1),
    darkBrown: rgba(82, 55, 31, 1),
    blue: rgba(13, 105, 172, 1),
    yellow: rgba(245, 205, 48, 1),
    green: rgba(75, 151, 75, 1),
    orange: rgba(218, 133, 65, 1),
    leaf: rgba(83, 143, 59, 1),
    leafDark: rgba(60, 109, 42, 1),
    black: rgba(16, 16, 16, 1),
    water: rgba(88, 161, 255, 0.55),
    glass: rgba(166, 231, 255, 0.45),
    spawn: rgba(168, 255, 255, 0.62),
    swordSteel: rgba(212, 212, 212, 1),
    swordHilt: rgba(152, 111, 52, 1),
    ballRed: rgba(204, 30, 30, 1),
    pellet: rgba(94, 157, 255, 1),
    forcefield: rgba(114, 244, 255, 0.78),
    kill: rgba(228, 22, 22, 1),
    navy: rgba(34, 56, 121, 1),
    mask: rgba(230, 238, 245, 1),
    glove: rgba(246, 246, 246, 1),
    badge: rgba(250, 214, 74, 1)
  };

  const STORAGE_KEYS = {
    playerName: 'build-and-learn-name',
    avatarPreset: 'build-and-learn-avatar-preset'
  };

  const DEFAULT_AVATAR_PRESET = 'regular';

  const AVATAR_PRESETS = {
    regular: {
      key: 'regular',
      label: 'Regular',
      description: 'Regular: the starter noob-style builder preset.',
      bodyColors: {
        head: COLORS.yellow,
        torso: COLORS.blue,
        arms: COLORS.yellow,
        legs: COLORS.green
      },
      accessories: {}
    },
    doctor: {
      key: 'doctor',
      label: 'Doctor',
      description: 'Doctor: a clean white medical outfit with a face mask and gloves.',
      bodyColors: {
        head: COLORS.yellow,
        torso: COLORS.white,
        arms: rgba(232, 232, 232, 1),
        legs: rgba(206, 216, 232, 1)
      },
      accessories: {
        doctorMask: true,
        doctorGloves: true
      }
    },
    police: {
      key: 'police',
      label: 'Police Man',
      description: 'Police Man: a dark blue uniform preset with a police hat.',
      bodyColors: {
        head: COLORS.yellow,
        torso: COLORS.navy,
        arms: COLORS.navy,
        legs: rgba(42, 48, 84, 1)
      },
      accessories: {
        policeHat: true
      }
    }
  };

  const TOOL_DEFS = [
    {
      id: 'linked-sword',
      slot: 1,
      name: 'Linked Sword',
      description: 'A close-range sword with chunky knockback.',
      useHint: 'Click without dragging to swing the sword.'
    },
    {
      id: 'superball',
      slot: 2,
      name: 'Superball',
      description: 'Throws a bouncy red superball that ricochets around the map.',
      useHint: 'Click without dragging to throw a superball.'
    },
    {
      id: 'slingshot',
      slot: 3,
      name: 'Slingshot',
      description: 'Launches quick pellets in the direction of the camera.',
      useHint: 'Click without dragging to fire a pellet.'
    }
  ];

  const CLASSIC_SPAWNS = [
    v3(0, 0.01, 0),
    v3(10, 0.01, 10),
    v3(-12, 0.01, -8),
    v3(18, 0.01, -14),
    v3(-18, 0.01, 12),
    v3(26, 0.01, 18),
    v3(-26, 0.01, -18),
    v3(0, 0.01, 26)
  ];

  let game = null;
  let loadProgress = 0;
  let loadStep = 0;
  let selectedAvatarPreset = DEFAULT_AVATAR_PRESET;

  simulateLoading();
  bindBootUi();

  function simulateLoading() {
    const stepCaptions = [
      'Connecting to server...',
      'Receiving place data...',
      'Building place geometry...',
      'Launching Build and Learn...'
    ];

    const tick = () => {
      const target = [26, 56, 84, 100][loadStep] ?? 100;
      loadProgress = Math.min(loadProgress + randRange(3.2, 8.6), target);
      dom.loadingFill.style.width = `${loadProgress}%`;
      dom.loadingSubtitle.textContent = stepCaptions[Math.min(loadStep, stepCaptions.length - 1)];

      dom.loadingSteps.forEach((item, index) => {
        item.classList.toggle('active', index === loadStep);
      });

      if (loadProgress >= target) {
        loadStep += 1;
      }

      if (loadProgress >= 100) {
        dom.loadingSubtitle.textContent = 'Choose how to play.';
        dom.loadingSteps.forEach((item, index) => {
          item.classList.toggle('active', index === dom.loadingSteps.length - 1);
        });
        dom.bootActions.classList.remove('hidden');
        return;
      }

      window.setTimeout(tick, randRange(170, 300));
    };

    tick();
  }

  function bindBootUi() {
    dom.playerNameInput.value = localStorage.getItem(STORAGE_KEYS.playerName) || 'Player';
    selectedAvatarPreset = normalizeAvatarPresetKey(localStorage.getItem(STORAGE_KEYS.avatarPreset));
    updateBootAvatarPresetUi();

    dom.avatarPresetButtons.forEach((button) => {
      button.addEventListener('click', () => {
        selectedAvatarPreset = normalizeAvatarPresetKey(button.dataset.avatarPreset);
        localStorage.setItem(STORAGE_KEYS.avatarPreset, selectedAvatarPreset);
        updateBootAvatarPresetUi();
      });
    });

    dom.soloButton.addEventListener('click', () => launchSession('solo'));
    dom.hostButton.addEventListener('click', () => launchSession('host'));
    dom.joinButton.addEventListener('click', () => launchSession('client'));
  }

  function updateBootAvatarPresetUi() {
    const preset = getAvatarPreset(selectedAvatarPreset);
    dom.avatarPresetButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.avatarPreset === preset.key);
    });
    dom.avatarPresetDescription.textContent = preset.description;
  }

  function launchSession(mode) {
    if (game) {
      return;
    }

    const playerName = sanitizeName(dom.playerNameInput.value);
    const avatarPreset = normalizeAvatarPresetKey(selectedAvatarPreset);
    localStorage.setItem(STORAGE_KEYS.playerName, playerName);
    localStorage.setItem(STORAGE_KEYS.avatarPreset, avatarPreset);

    try {
      game = new ClassicOnlineReplica(dom, {
        mode,
        playerName,
        avatarPreset,
        useStun: !dom.directModeToggle.checked
      });
      dom.loadingScreen.classList.add('hidden');
      dom.hud.classList.remove('hidden');
      game.start();
      if (mode === 'host') {
        game.toggleNetworkWindow(true);
        game.network.createInvite().catch((error) => game.setNetworkStatus(`Invite creation failed.\n${String(error.message || error)}`));
      } else if (mode === 'client') {
        game.toggleNetworkWindow(true);
        game.setHint('Paste a host invite code into the Online window, then generate your answer code.', 12);
      }
    } catch (error) {
      console.error(error);
      dom.loadingSubtitle.textContent = 'This browser could not start Build and Learn.';
    }
  }

  class ClassicOnlineReplica {
    constructor(elements, options) {
      this.dom = elements;
      this.mode = options.mode;
      this.world = buildClassicWorld();
      this.renderer = new Renderer(elements.canvas);
      this.renderer.setStaticWorld(this.world);
      this.audio = new AudioEngine();
      this.time = 0;
      this.lastFrame = 0;
      this.running = false;
      this.keys = new Set();
      this.characters = new Map();
      this.projectiles = [];
      this.corpses = [];
      this.pendingUse = false;
      this.uiRefresh = 0;
      this.hintTimer = 10;
      this.lastSentInputSignature = '';
      this.inputSendCooldown = 0;
      this.snapshotCooldown = 0;
      this.localAuthorityState = null;
      this.dragState = {
        active: false,
        moved: false,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
      };
      this.pointerLockSupported = typeof this.dom.canvas.requestPointerLock === 'function';
      this.camera = {
        yaw: 0.72,
        pitch: 0.28,
        distance: 14,
        eye: v3(),
        target: v3(),
        lookDir: v3(0, 0, 1),
        forwardXZ: v3(0, 0, 1),
        firstPerson: false,
        matrix: mat4Identity(),
        width: 1,
        height: 1
      };

      this.localPlayerId = makeId(10);
      this.localPlayer = this.createPlayerCharacter({
        id: this.localPlayerId,
        name: options.playerName,
        spawn: vCopy(CLASSIC_SPAWNS[0]),
        avatarPreset: options.avatarPreset,
        isLocal: true
      });
      this.addCharacter(this.localPlayer);

      this.network = new ManualRtcNetwork(this, {
        role: this.mode,
        useStun: options.useStun
      });

      if (this.mode === 'host') {
        this.localPlayer.forcefield = 4.2;
      }

      this.bindUi();
      this.bindInput();
      this.updateHotbar();
      this.updateToolDescription();
      this.refreshScoreboard(true);
      this.refreshConnectedPlayers();
      this.refreshNetworkWindow();
      this.updateSessionHeader();
      this.pushChat('System', this.mode === 'solo'
        ? 'Solo session ready. Only real players join online sessions now.'
        : this.mode === 'host'
          ? 'Hosting a private Build and Learn session. Share the invite code from the Online panel.'
          : 'Join mode ready. Paste a host invite code into the Online panel.', true);
      this.setHint(this.mode === 'client'
        ? 'Join mode: open Online, paste the host invite, and generate your answer code.'
        : 'WASD follows the camera. Drag in third person, or zoom all the way in and click the game for first-person mouse lock.', 12);
      this.onResize();
    }

    get localCharacter() {
      return this.characters.get(this.localPlayerId) || null;
    }

    start() {
      if (this.running) {
        return;
      }

      this.running = true;
      this.audio.init();
      this.audio.playRespawn();
      this.lastFrame = performance.now();
      requestAnimationFrame((timestamp) => this.frame(timestamp));
    }

    applyLookDelta(deltaX, deltaY) {
      if (!deltaX && !deltaY) {
        return;
      }
      this.camera.yaw -= deltaX * 0.008;
      this.camera.pitch = clamp(this.camera.pitch + deltaY * 0.008, -0.65, 0.85);
    }

    setCameraDistance(nextDistance, notify = true) {
      const wasFirstPerson = this.camera.distance <= 1;
      const roundedDistance = clamp(Math.round(nextDistance * 2) / 2, 0.5, 22);
      const isFirstPerson = roundedDistance <= 1;
      this.camera.distance = roundedDistance;
      this.camera.firstPerson = isFirstPerson;

      if (isFirstPerson !== wasFirstPerson) {
        this.dragState.active = false;
        this.dragState.moved = false;
      }

      if (isFirstPerson && !wasFirstPerson && notify) {
        this.setHint('First person ready. Click the game to lock the mouse and look around.', 6);
      }

      if (!isFirstPerson && wasFirstPerson) {
        this.releasePointerLock();
      }
    }

    isPointerLocked() {
      return document.pointerLockElement === this.dom.canvas;
    }

    requestPointerLock() {
      if (!this.camera.firstPerson || this.isUiBlockingInput()) {
        return;
      }
      if (this.isPointerLocked()) {
        return;
      }
      if (!this.pointerLockSupported) {
        this.setHint('This browser could not lock the mouse for first person.', 5.5);
        return;
      }
      this.dom.canvas.requestPointerLock();
    }

    releasePointerLock() {
      if (this.isPointerLocked() && document.exitPointerLock) {
        document.exitPointerLock();
      }
      document.body.classList.remove('pointer-locked');
    }

    handlePointerLockChange() {
      const locked = this.isPointerLocked() && this.camera.firstPerson;
      document.body.classList.toggle('pointer-locked', locked);
      this.dragState.active = false;
      this.dragState.moved = false;
      if (locked) {
        this.setHint('Mouse locked. Move to look around. Press Esc to unlock.', 3.5);
      }
    }

    handlePointerLockError() {
      this.setHint('Mouse lock could not start here. Try clicking the game again or stay in third person.', 5.5);
    }

    createPlayerCharacter({ id, name, spawn, avatarPreset, isLocal }) {
      const character = createCharacter({
        id,
        name,
        spawn,
        avatarPreset,
        isLocal
      });
      character.remoteInput = makeNeutralInput();
      character.lastConsumedUseNonce = 0;
      character.lastConsumedResetNonce = 0;
      character.netTarget = null;
      character.netReceivedAt = 0;
      character.connectionKey = null;
      character.initializedFromNetwork = isLocal;
      return character;
    }

    addCharacter(character) {
      this.characters.set(character.id, character);
      this.makeLabelElements(character);
      this.refreshScoreboard(true);
      this.refreshConnectedPlayers();
      this.updateSessionHeader();
    }

    removeCharacter(id) {
      const character = this.characters.get(id);
      if (!character || character.isLocal) {
        return;
      }

      if (character.label) {
        character.label.name.remove();
        character.label.bubble.remove();
      }
      this.characters.delete(id);
      this.refreshScoreboard(true);
      this.refreshConnectedPlayers();
      this.updateSessionHeader();
    }

    createRemoteCharacter(playerData, connectionKey) {
      const spawn = this.allocateSpawn(this.characters.size);
      const character = this.createPlayerCharacter({
        id: playerData.id,
        name: sanitizeName(playerData.name),
        spawn,
        avatarPreset: playerData.avatarPreset,
        isLocal: false
      });
      character.connectionKey = connectionKey || null;
      character.initializedFromNetwork = false;
      this.addCharacter(character);
      return character;
    }

    applyCharacterAppearance(character, avatarPreset) {
      const preset = getAvatarPreset(avatarPreset);
      character.avatarPreset = preset.key;
      character.bodyColors = cloneBodyColors(preset.bodyColors);
    }

    allocateSpawn(index) {
      return vCopy(CLASSIC_SPAWNS[index % CLASSIC_SPAWNS.length]);
    }

    bindUi() {
      this.dom.menuButton.addEventListener('click', () => this.toggleMenu());
      this.dom.playersButton.addEventListener('click', () => this.togglePlayers());
      this.dom.backpackButton.addEventListener('click', () => this.toggleBackpack());
      this.dom.onlineButton.addEventListener('click', () => this.toggleNetworkWindow());
      this.dom.resumeButton.addEventListener('click', () => this.toggleMenu(false));
      this.dom.resetButton.addEventListener('click', () => this.requestReset());
      this.dom.fullscreenButton.addEventListener('click', () => this.enterFullscreen());
      this.dom.closeNetworkButton.addEventListener('click', () => this.toggleNetworkWindow(false));

      this.dom.hotbarSlots.forEach((slot) => {
        slot.addEventListener('click', () => {
          this.selectTool(Number(slot.dataset.slot), true);
        });
      });

      this.dom.backpackItems.forEach((button) => {
        button.addEventListener('click', () => {
          this.selectTool(Number(button.dataset.slotSelect), true);
          this.toggleBackpack(false);
        });
      });

      this.dom.cameraButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const mode = button.dataset.camera;
          if (mode === 'tilt-up') {
            this.camera.pitch = clamp(this.camera.pitch - 0.12, -0.65, 0.85);
          } else if (mode === 'tilt-down') {
            this.camera.pitch = clamp(this.camera.pitch + 0.12, -0.65, 0.85);
          } else if (mode === 'zoom-in') {
            this.setCameraDistance(this.camera.distance - 2);
          } else if (mode === 'zoom-out') {
            this.setCameraDistance(this.camera.distance + 2);
          }
        });
      });

      this.dom.chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const content = this.dom.chatInput.value.trim();
          if (content) {
            this.sendLocalChat(content);
          }
          this.closeChatEntry();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          this.closeChatEntry();
        }
      });

      this.dom.createInviteButton.addEventListener('click', () => {
        this.network.createInvite().catch((error) => this.setNetworkStatus(`Invite creation failed.\n${String(error.message || error)}`));
      });

      this.dom.copyHostOfferButton.addEventListener('click', async () => {
        await copyTextToClipboard(this.dom.hostOfferOutput.value);
        this.setNetworkStatus('Invite code copied. Send it to the joiner.');
      });

      this.dom.clearHostOfferButton.addEventListener('click', () => {
        this.dom.hostOfferOutput.value = '';
      });

      this.dom.completeJoinButton.addEventListener('click', () => {
        this.network.acceptAnswer(this.dom.hostAnswerInput.value).catch((error) => {
          this.setNetworkStatus(`Could not finish the join.\n${String(error.message || error)}`);
        });
      });

      this.dom.clearHostAnswerButton.addEventListener('click', () => {
        this.dom.hostAnswerInput.value = '';
      });

      this.dom.generateAnswerButton.addEventListener('click', () => {
        this.network.generateAnswer(this.dom.joinOfferInput.value).catch((error) => {
          this.setNetworkStatus(`Could not generate an answer.\n${String(error.message || error)}`);
        });
      });

      this.dom.clearJoinOfferButton.addEventListener('click', () => {
        this.dom.joinOfferInput.value = '';
      });

      this.dom.copyJoinAnswerButton.addEventListener('click', async () => {
        await copyTextToClipboard(this.dom.joinAnswerOutput.value);
        this.setNetworkStatus('Answer code copied. Send it back to the host.');
      });

      this.dom.clearJoinAnswerButton.addEventListener('click', () => {
        this.dom.joinAnswerOutput.value = '';
      });
    }

    bindInput() {
      window.addEventListener('resize', () => this.onResize());
      window.addEventListener('blur', () => {
        this.keys.clear();
        this.dragState.active = false;
        this.releasePointerLock();
      });
      document.addEventListener('pointerlockchange', () => this.handlePointerLockChange());
      document.addEventListener('pointerlockerror', () => this.handlePointerLockError());

      window.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        const typing = activeElement === this.dom.chatInput
          || activeElement === this.dom.playerNameInput
          || activeElement === this.dom.joinOfferInput
          || activeElement === this.dom.hostAnswerInput
          || activeElement === this.dom.hostOfferOutput
          || activeElement === this.dom.joinAnswerOutput;

        if (typing && event.key !== 'Escape') {
          return;
        }

        if (event.key === '/') {
          event.preventDefault();
          if (!typing) {
            this.openChatEntry();
          }
          return;
        }

        if (typing && event.key === 'Escape') {
          event.preventDefault();
          if (activeElement === this.dom.chatInput) {
            this.closeChatEntry();
          } else if (activeElement && typeof activeElement.blur === 'function') {
            activeElement.blur();
          }
          return;
        }

        if (event.key === 'Escape' && this.isPointerLocked()) {
          event.preventDefault();
          this.releasePointerLock();
          return;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          if (!this.dom.chatEntry.classList.contains('hidden')) {
            this.closeChatEntry();
          } else if (!this.dom.networkWindow.classList.contains('hidden')) {
            this.toggleNetworkWindow(false);
          } else {
            this.toggleMenu();
          }
          return;
        }

        const lower = event.key.toLowerCase();
        this.keys.add(lower);

        if (lower === 'tab') {
          event.preventDefault();
          this.togglePlayers();
        }

        if (lower === 'b' || lower === '`') {
          event.preventDefault();
          this.toggleBackpack();
        }

        if (lower === 'o') {
          event.preventDefault();
          this.toggleNetworkWindow();
        }

        if (lower === 'r') {
          event.preventDefault();
          this.requestReset();
        }

        if (lower === 'backspace') {
          event.preventDefault();
          const local = this.localCharacter;
          if (!local) {
            return;
          }
          local.selectedTool = -1;
          this.updateHotbar();
          this.updateToolDescription();
          this.setHint('Unequipped the current tool.', 3.5);
        }

        if (lower >= '1' && lower <= '3') {
          event.preventDefault();
          this.selectTool(Number(lower), true);
        }

        if (lower === '0') {
          event.preventDefault();
          const local = this.localCharacter;
          if (!local) {
            return;
          }
          local.selectedTool = -1;
          this.updateHotbar();
          this.updateToolDescription();
        }
      });

      window.addEventListener('keyup', (event) => {
        this.keys.delete(event.key.toLowerCase());
      });

      this.dom.canvas.addEventListener('mousedown', (event) => {
        if (event.button !== 0 || this.isUiBlockingInput()) {
          return;
        }

        if (this.camera.firstPerson) {
          event.preventDefault();
          this.dragState.active = false;
          this.dragState.moved = false;
          if (this.isPointerLocked()) {
            this.pendingUse = true;
          } else {
            this.requestPointerLock();
          }
          return;
        }

        this.dragState.active = true;
        this.dragState.moved = false;
        this.dragState.startX = event.clientX;
        this.dragState.startY = event.clientY;
        this.dragState.lastX = event.clientX;
        this.dragState.lastY = event.clientY;
      });

      window.addEventListener('mousemove', (event) => {
        if (this.isPointerLocked() && this.camera.firstPerson) {
          this.applyLookDelta(event.movementX, event.movementY);
          return;
        }

        if (!this.dragState.active) {
          return;
        }

        const dx = event.clientX - this.dragState.lastX;
        const dy = event.clientY - this.dragState.lastY;
        const travel = Math.hypot(event.clientX - this.dragState.startX, event.clientY - this.dragState.startY);
        if (travel > 3) {
          this.dragState.moved = true;
        }
        this.dragState.lastX = event.clientX;
        this.dragState.lastY = event.clientY;

        this.applyLookDelta(dx, dy);
      });

      window.addEventListener('mouseup', (event) => {
        if (event.button !== 0 || this.camera.firstPerson || this.isPointerLocked() || !this.dragState.active) {
          return;
        }
        const shouldUse = !this.dragState.moved;
        this.dragState.active = false;
        if (shouldUse) {
          this.pendingUse = true;
        }
      });

      this.dom.canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
        const direction = Math.sign(event.deltaY);
        const step = direction > 0 ? 2 : -2;
        this.setCameraDistance(this.camera.distance + step);
      }, { passive: false });

      this.dom.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    }

    frame(timestamp) {
      if (!this.running) {
        return;
      }

      const dt = Math.min((timestamp - this.lastFrame) / 1000, 1 / 24);
      this.lastFrame = timestamp;
      this.time += dt;
      this.update(dt);
      this.render();
      requestAnimationFrame((nextTimestamp) => this.frame(nextTimestamp));
    }

    update(dt) {
      this.updateUiState(dt);

      if (this.mode === 'solo' || this.mode === 'host') {
        this.updateAuthoritative(dt);
      } else {
        this.updateClient(dt);
      }

      this.updateCamera();
      this.updateHud();
      this.updateLabels();

      const local = this.localCharacter;
      if (local) {
        this.dom.damageOverlay.style.opacity = String(clamp(local.damageFlash + (1 - local.health / local.maxHealth) * 0.22, 0, 0.75));
        local.damageFlash = Math.max(0, local.damageFlash - dt * 1.4);
      }
    }

    updateUiState(dt) {
      if (this.hintTimer > 0) {
        this.hintTimer -= dt;
        if (this.hintTimer <= 0) {
          this.dom.hintBar.style.opacity = '0.3';
        }
      }

      this.uiRefresh -= dt;
      if (this.uiRefresh <= 0) {
        this.refreshScoreboard(false);
        this.refreshConnectedPlayers();
        this.updateSessionHeader();
        this.uiRefresh = 0.15;
      }
    }

    updateAuthoritative(dt) {
      const local = this.localCharacter;
      const liveInput = this.getLiveInput();

      if (local) {
        local.selectedTool = liveInput.selectedTool;
        this.updateControlledCharacter(local, liveInput, dt, true, this.pendingUse && !this.isUiBlockingInput());
      }
      this.pendingUse = false;

      for (const character of this.characters.values()) {
        if (character.isLocal) {
          continue;
        }

        const input = character.remoteInput || makeNeutralInput();
        character.selectedTool = input.selectedTool;

        if (input.resetNonce !== character.lastConsumedResetNonce) {
          character.lastConsumedResetNonce = input.resetNonce;
          this.killCharacter(character, null);
        }

        this.updateControlledCharacter(character, input, dt, true, input.useNonce !== character.lastConsumedUseNonce);
        if (input.useNonce !== character.lastConsumedUseNonce) {
          character.lastConsumedUseNonce = input.useNonce;
        }
      }

      this.updateProjectiles(dt, true);
      this.updateCorpses(dt);
      this.respawnCharacters();

      if (this.mode === 'host') {
        this.snapshotCooldown -= dt;
        if (this.snapshotCooldown <= 0) {
          this.snapshotCooldown = 1 / 15;
          this.network.broadcastSnapshot();
        }
      }
    }

    updateClient(dt) {
      const local = this.localCharacter;
      const liveInput = this.getLiveInput();
      this.maybeSendClientInput(liveInput, dt);

      if (local && this.network.isGameplayReady()) {
        local.selectedTool = liveInput.selectedTool;
        this.updateControlledCharacter(local, liveInput, dt, false, false);
      }

      if (this.pendingUse && !this.isUiBlockingInput()) {
        this.pendingUse = false;
        this.clientToolUse(liveInput);
      } else {
        this.pendingUse = false;
      }

      for (const character of this.characters.values()) {
        if (character.isLocal) {
          continue;
        }
        this.applyRemoteSmoothing(character, dt);
        this.updateCharacterTools(character, dt, false);
      }

      if (local) {
        this.applyLocalCorrection(local, dt);
      }

      this.updateProjectiles(dt, false);
      this.updateCorpses(dt);
    }

    updateControlledCharacter(character, input, dt, canDamage, consumeToolUse) {
      if (character.dead) {
        this.updateCharacterTools(character, dt, false);
        return;
      }

      const inputX = Number(Boolean(input.right)) - Number(Boolean(input.left));
      const inputZ = Number(Boolean(input.forward)) - Number(Boolean(input.back));
      const jumpPressed = Boolean(input.jump);
      const climbIntent = inputZ;
      const inputVector = v3(inputX, 0, inputZ);
      const moveWorld = character.isLocal
        ? cameraRelativeFromForward(inputVector, this.camera.forwardXZ)
        : cameraRelativeWorld(inputVector, input.cameraYaw);
      const wantsJump = jumpPressed && !character.jumpHeld;
      character.jumpHeld = jumpPressed;

      this.updateCharacterMotion(character, moveWorld, wantsJump, climbIntent, dt);
      this.updateCharacterTools(character, dt, canDamage);

      if (consumeToolUse) {
        this.useCurrentTool(character, input);
      }
    }

    getLiveInput() {
      const local = this.localCharacter;
      const locked = this.isUiBlockingInput() || (this.mode === 'client' && !this.network.isGameplayReady());
      return {
        left: !locked && (this.keys.has('a') || this.keys.has('arrowleft')),
        right: !locked && (this.keys.has('d') || this.keys.has('arrowright')),
        forward: !locked && (this.keys.has('w') || this.keys.has('arrowup')),
        back: !locked && (this.keys.has('s') || this.keys.has('arrowdown')),
        jump: !locked && this.keys.has(' '),
        cameraYaw: this.camera.yaw,
        cameraPitch: this.camera.pitch,
        firstPerson: this.camera.distance <= 1,
        selectedTool: local ? local.selectedTool : 0
      };
    }

    maybeSendClientInput(input, dt) {
      if (this.mode !== 'client' || !this.network.isChannelOpen()) {
        return;
      }

      this.inputSendCooldown -= dt;
      const packet = {
        left: Boolean(input.left),
        right: Boolean(input.right),
        forward: Boolean(input.forward),
        back: Boolean(input.back),
        jump: Boolean(input.jump),
        cameraYaw: roundNetworkFloat(input.cameraYaw),
        cameraPitch: roundNetworkFloat(input.cameraPitch),
        firstPerson: Boolean(input.firstPerson),
        selectedTool: input.selectedTool
      };

      const signature = JSON.stringify(packet);
      if (signature !== this.lastSentInputSignature || this.inputSendCooldown <= 0) {
        this.lastSentInputSignature = signature;
        this.inputSendCooldown = 1 / 20;
        this.network.sendInput(packet);
      }
    }

    clientToolUse(input) {
      const local = this.localCharacter;
      if (!local || local.dead || local.selectedTool < 0 || !this.network.isGameplayReady()) {
        return;
      }

      const tool = TOOL_DEFS[local.selectedTool];
      if (!tool || local.toolCooldown > 0) {
        return;
      }

      const action = {
        useNonce: (local.remoteInput.useNonce || 0) + 1,
        selectedTool: local.selectedTool,
        cameraYaw: roundNetworkFloat(input.cameraYaw),
        cameraPitch: roundNetworkFloat(input.cameraPitch),
        firstPerson: Boolean(input.firstPerson)
      };
      local.remoteInput.useNonce = action.useNonce;

      if (tool.id === 'linked-sword') {
        local.toolCooldown = 0.52;
        local.swing.time = 0.34;
        local.swing.didHit = true;
        const look = getAimDirectionFromView(action.cameraYaw, action.cameraPitch, action.firstPerson);
        local.yaw = Math.atan2(look.x, look.z);
        this.audio.playSwordSwing();
      } else if (tool.id === 'superball') {
        local.toolCooldown = 0.68;
        this.audio.playThrow();
      } else if (tool.id === 'slingshot') {
        local.toolCooldown = 0.22;
        this.audio.playPellet();
      }

      this.network.sendToolUse(action);
    }

    updateCharacterMotion(character, moveWorld, wantsJump, climbIntent, dt) {
      const moveMag = Math.hypot(moveWorld.x, moveWorld.z);
      const targetSpeed = moveMag > 0.01 ? character.walkSpeed : 0;
      const desired = moveMag > 0.01 ? vScale(vNormalizeXZ(moveWorld), targetSpeed) : v3();
      const accel = character.grounded ? 80 : 50;

      character.forcefield = Math.max(0, character.forcefield - dt);
      character.lastDamageAgo += dt;

      if (character.lastDamageAgo > 5 && character.health < character.maxHealth) {
        character.health = Math.min(character.maxHealth, character.health + dt * 1);
      }

      const ladder = this.findLadder(character);
      if (ladder && Math.abs(climbIntent) > 0.05) {
        character.climbing = true;
      }
      if (!ladder || Math.abs(climbIntent) <= 0.01) {
        character.climbing = false;
      }

      if (character.climbing && ladder) {
        character.pos.x = lerp(character.pos.x, ladder.center.x, 0.18);
        character.pos.z = lerp(character.pos.z, ladder.center.z, 0.18);
        character.vel.x = 0;
        character.vel.z = 0;
        character.vel.y = climbIntent * 10.5;
        if (wantsJump) {
          character.climbing = false;
          character.vel.y = 20;
          const jumpForward = yawForward(character.yaw);
          character.vel.x += jumpForward.x * 5;
          character.vel.z += jumpForward.z * 5;
          if (character.isLocal) {
            this.audio.playJump();
          }
        }
      } else {
        character.vel.x = approach(character.vel.x, desired.x, accel * dt);
        character.vel.z = approach(character.vel.z, desired.z, accel * dt);

        if (moveMag <= 0.01) {
          const drag = character.grounded ? 12 : 3.4;
          character.vel.x = approach(character.vel.x, 0, drag * dt);
          character.vel.z = approach(character.vel.z, 0, drag * dt);
        }

        if (wantsJump && character.grounded) {
          character.vel.y = 23.5;
          character.grounded = false;
          if (character.isLocal) {
            this.audio.playJump();
          }
        }

        character.vel.y -= 52 * dt;
      }

      if (moveMag > 0.05) {
        const targetYaw = Math.atan2(desired.x, desired.z);
        character.yaw = turnTowardsAngle(character.yaw, targetYaw, dt * 11);
      }

      character.walkCycle += dt * (0.9 + clamp(moveMag, 0, 1) * 5.6);

      this.moveCharacterAxis(character, 'x', character.vel.x * dt);
      this.moveCharacterAxis(character, 'z', character.vel.z * dt);
      character.grounded = false;
      this.moveCharacterAxis(character, 'y', character.vel.y * dt);

      if (character.pos.y < -18) {
        this.applyDamage(character, 999, null, null);
      }

      const aabb = getCharacterAabb(character);
      for (const collider of this.world.colliders) {
        if (!aabbOverlap(aabb, collider)) {
          continue;
        }
        if (collider.kill) {
          this.applyDamage(character, 999, null, null);
        }
      }
    }

    moveCharacterAxis(character, axis, amount) {
      if (amount === 0) {
        return;
      }

      character.pos[axis] += amount;
      let aabb = getCharacterAabb(character);

      for (const collider of this.world.colliders) {
        if (!collider.solid || collider.transparentOnly) {
          continue;
        }
        if (!aabbOverlap(aabb, collider)) {
          continue;
        }

        if (axis === 'x') {
          if (amount > 0) {
            character.pos.x = collider.min.x - character.bounds.halfX - 0.001;
          } else {
            character.pos.x = collider.max.x + character.bounds.halfX + 0.001;
          }
          character.vel.x = 0;
        } else if (axis === 'z') {
          if (amount > 0) {
            character.pos.z = collider.min.z - character.bounds.halfZ - 0.001;
          } else {
            character.pos.z = collider.max.z + character.bounds.halfZ + 0.001;
          }
          character.vel.z = 0;
        } else if (axis === 'y') {
          if (amount > 0) {
            character.pos.y = collider.min.y - character.bounds.top - 0.001;
            character.vel.y = Math.min(character.vel.y, 0);
          } else {
            character.pos.y = collider.max.y - character.bounds.bottom + 0.001;
            character.vel.y = 0;
            character.grounded = true;
          }
        }

        aabb = getCharacterAabb(character);
      }
    }

    updateCharacterTools(character, dt, allowDamage) {
      if (character.swing.time > 0) {
        character.swing.time -= dt;
        if (character.swing.time < 0) {
          character.swing.time = 0;
        }
        if (allowDamage && !character.swing.didHit && character.swing.time <= 0.17) {
          character.swing.didHit = true;
          this.resolveSwordHit(character);
        }
      }

      character.toolCooldown = Math.max(0, character.toolCooldown - dt);
    }

    useCurrentTool(character, controlState) {
      if (character.dead || character.selectedTool < 0 || character.toolCooldown > 0) {
        return;
      }

      const tool = TOOL_DEFS[character.selectedTool];
      if (!tool) {
        return;
      }

      const viewState = controlState || {
        cameraYaw: -character.yaw,
        cameraPitch: 0,
        firstPerson: false
      };

      if (tool.id === 'linked-sword') {
        character.toolCooldown = 0.52;
        character.swing.time = 0.34;
        character.swing.didHit = false;
        const look = getAimDirectionFromView(viewState.cameraYaw, viewState.cameraPitch, viewState.firstPerson);
        character.yaw = Math.atan2(look.x, look.z);
        if (character.isLocal) {
          this.audio.playSwordSwing();
        }
      } else if (tool.id === 'superball') {
        character.toolCooldown = 0.68;
        this.spawnProjectile(character, 'superball', viewState);
        if (character.isLocal) {
          this.audio.playThrow();
        }
      } else if (tool.id === 'slingshot') {
        character.toolCooldown = 0.22;
        this.spawnProjectile(character, 'slingshot', viewState);
        if (character.isLocal) {
          this.audio.playPellet();
        }
      }
    }

    resolveSwordHit(attacker) {
      const forward = yawForward(attacker.yaw);
      const origin = vAdd(attacker.pos, v3(0, 3.2, 0));
      for (const target of this.characters.values()) {
        if (target.id === attacker.id || target.dead) {
          continue;
        }

        const targetPoint = vAdd(target.pos, v3(0, 3, 0));
        const delta = vSub(targetPoint, origin);
        const distance = vLength(delta);
        if (distance > 5.2) {
          continue;
        }

        const dir = vNormalize(delta);
        if (vDot(dir, forward) < 0.38) {
          continue;
        }

        const impulse = vAdd(vScale(forward, 12), v3(0, 6, 0));
        if (this.applyDamage(target, 36, attacker, impulse)) {
          if (attacker.isLocal) {
            this.audio.playHit();
          }
        }
      }
    }

    spawnProjectile(owner, type, viewState) {
      const aim = getAimDirectionFromView(viewState.cameraYaw, viewState.cameraPitch, viewState.firstPerson);
      const right = v3(aim.z, 0, -aim.x);
      const spawn = vAdd(vAdd(owner.pos, v3(0, 4.25, 0)), vAdd(vScale(aim, 1.75), vScale(vNormalize(right), 0.3)));
      const projectile = {
        id: `proj-${makeId(8)}`,
        type,
        ownerId: owner.id,
        pos: spawn,
        vel: vScale(aim, type === 'slingshot' ? 48 : 24),
        radius: type === 'slingshot' ? 0.22 : 0.54,
        gravity: type === 'slingshot' ? 18 : 42,
        bounce: type === 'slingshot' ? 0.15 : 0.88,
        life: type === 'slingshot' ? 4.6 : 9.2,
        damage: type === 'slingshot' ? 14 : 25,
        color: type === 'slingshot' ? COLORS.pellet : COLORS.ballRed,
        recentHits: new Map()
      };
      if (type === 'superball') {
        projectile.vel.y += 5.5;
      }
      this.projectiles.push(projectile);
    }

    updateProjectiles(dt, canDamage) {
      const survivors = [];
      for (const projectile of this.projectiles) {
        projectile.life -= dt;
        if (projectile.life <= 0) {
          continue;
        }

        projectile.vel.y -= projectile.gravity * dt;
        const steps = projectile.type === 'slingshot' ? 2 : 3;
        const stepDt = dt / steps;
        let alive = true;

        for (let step = 0; step < steps && alive; step += 1) {
          projectile.pos = vAdd(projectile.pos, vScale(projectile.vel, stepDt));

          for (const collider of this.world.colliders) {
            if (!collider.solid || collider.transparentOnly) {
              continue;
            }

            const hit = sphereAabbCollision(projectile.pos, projectile.radius, collider);
            if (!hit) {
              continue;
            }

            projectile.pos = vAdd(projectile.pos, vScale(hit.normal, hit.penetration + 0.001));
            projectile.vel = reflect(projectile.vel, hit.normal, projectile.bounce);
            if (projectile.type === 'slingshot') {
              alive = false;
              break;
            }
          }

          if (!alive || !canDamage) {
            continue;
          }

          const owner = this.characters.get(projectile.ownerId);
          for (const target of this.characters.values()) {
            if (owner && target.id === owner.id) {
              continue;
            }
            if (target.dead) {
              continue;
            }

            const recent = projectile.recentHits.get(target.id) || -999;
            if (this.time - recent < 0.35) {
              continue;
            }

            if (!sphereIntersectsAabb(projectile.pos, projectile.radius, getCharacterAabb(target))) {
              continue;
            }

            projectile.recentHits.set(target.id, this.time);
            const knock = vAdd(vScale(vNormalize(vSub(vAdd(target.pos, v3(0, 2, 0)), projectile.pos)), projectile.type === 'slingshot' ? 4 : 8), v3(0, 2.2, 0));
            if (this.applyDamage(target, projectile.damage, owner || null, knock)) {
              if (owner && owner.isLocal) {
                this.audio.playHit();
              }
            }

            if (projectile.type === 'slingshot') {
              alive = false;
              break;
            }

            projectile.vel = vScale(projectile.vel, 0.78);
          }
        }

        if (alive) {
          survivors.push(projectile);
        }
      }

      this.projectiles = survivors;
    }

    updateCorpses(dt) {
      const survivors = [];
      for (const corpse of this.corpses) {
        corpse.timer -= dt;
        for (const part of corpse.parts) {
          part.vel.y -= 48 * dt;
          part.pos = vAdd(part.pos, vScale(part.vel, dt));
          part.rot.x += part.spin.x * dt;
          part.rot.y += part.spin.y * dt;
          part.rot.z += part.spin.z * dt;

          if (part.pos.y < 0.2) {
            part.pos.y = 0.2;
            part.vel.y *= -0.22;
            part.vel.x *= 0.82;
            part.vel.z *= 0.82;
          }
        }
        if (corpse.timer > 0) {
          survivors.push(corpse);
        }
      }
      this.corpses = survivors;
    }

    respawnCharacters() {
      for (const character of this.characters.values()) {
        if (character.dead && this.time >= character.respawnAt) {
          this.respawnCharacter(character);
        }
      }
    }

    respawnCharacter(character) {
      character.dead = false;
      character.health = character.maxHealth;
      character.pos = vCopy(character.spawn);
      character.vel = v3();
      character.forcefield = 4;
      character.lastDamageAgo = 10;
      character.grounded = false;
      character.climbing = false;
      character.swing.time = 0;
      character.damageFlash = 0;
      character.bubble = null;
      character.bubbleUntil = 0;
      if (character.isLocal) {
        this.audio.playRespawn();
        this.setHint('ForceField active. You have a few seconds of spawn protection.', 5.5);
      }
    }

    applyDamage(target, amount, source, impulse) {
      if (target.dead || target.forcefield > 0) {
        return false;
      }

      target.health = Math.max(0, target.health - amount);
      target.lastDamageAgo = 0;
      if (impulse) {
        target.vel = vAdd(target.vel, impulse);
      }

      if (target.isLocal) {
        target.damageFlash = Math.min(0.8, target.damageFlash + 0.5);
      }

      if (target.health <= 0) {
        this.killCharacter(target, source);
      }
      return true;
    }

    killCharacter(target, source) {
      if (target.dead) {
        return;
      }

      target.dead = true;
      target.health = 0;
      target.wo += 1;
      target.respawnAt = this.time + 3.2;
      const corpse = createCorpse(target);
      this.corpses.push(corpse);

      const speaker = source && source.id !== target.id ? `${target.name} was KO'd by ${source.name}.` : `${target.name} reset.`;
      this.pushChat('System', speaker, true);
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(speaker);
      }

      if (source && source.id !== target.id) {
        source.ko += 1;
      }

      if (target.isLocal) {
        this.audio.playDeath();
        this.setHint('Oof! Respawning shortly.', 3.2);
      }
    }

    findLadder(character) {
      const aabb = getCharacterAabb(character);
      for (const collider of this.world.colliders) {
        if (!collider.climbable) {
          continue;
        }
        if (aabbOverlap(aabb, collider)) {
          return collider;
        }
      }
      return null;
    }

    updateCamera() {
      const focusCharacter = this.localCharacter || [...this.characters.values()][0];
      if (!focusCharacter) {
        return;
      }

      const focus = vAdd(focusCharacter.pos, v3(0, 4, 0));
      const wasFirstPerson = this.camera.firstPerson;
      this.camera.firstPerson = this.camera.distance <= 1;
      if (wasFirstPerson && !this.camera.firstPerson) {
        this.releasePointerLock();
      }

      if (this.camera.firstPerson) {
        const eye = vAdd(focusCharacter.pos, v3(0, 4.55, 0));
        const aim = getAimDirectionFromView(this.camera.yaw, this.camera.pitch, true);
        this.camera.eye = eye;
        this.camera.target = vAdd(eye, aim);
      } else {
        const offset = v3(
          Math.sin(this.camera.yaw) * Math.cos(this.camera.pitch) * this.camera.distance,
          Math.sin(this.camera.pitch) * this.camera.distance,
          -Math.cos(this.camera.yaw) * Math.cos(this.camera.pitch) * this.camera.distance
        );
        let eye = vAdd(focus, offset);
        eye = this.resolveCameraCollision(focus, eye);
        this.camera.eye = eye;
        this.camera.target = focus;
      }

      this.camera.lookDir = vNormalize(vSub(this.camera.target, this.camera.eye));
      const projectedForward = vNormalizeXZ(this.camera.lookDir);
      this.camera.forwardXZ = Math.hypot(projectedForward.x, projectedForward.z) > 0.0001
        ? projectedForward
        : cameraViewForwardXZ(this.camera.yaw);

      const aspect = this.camera.width / this.camera.height;
      const projection = mat4Perspective(degToRad(64), aspect, 0.1, 200);
      const view = mat4LookAt(this.camera.eye, this.camera.target, v3(0, 1, 0));
      this.camera.matrix = mat4Multiply(projection, view);
    }

    resolveCameraCollision(target, desiredEye) {
      let nearestT = 1;
      for (const collider of this.world.colliders) {
        if (!collider.solid || collider.transparentOnly) {
          continue;
        }
        const hit = segmentIntersectsAabb(target, desiredEye, expandAabb(collider, 0.18));
        if (hit !== null) {
          nearestT = Math.min(nearestT, Math.max(0, hit - 0.05));
        }
      }
      return vLerp(target, desiredEye, nearestT);
    }

    render() {
      const dynamicSolid = createTriBuilder();
      const dynamicLines = createLineBuilder();

      for (const character of this.characters.values()) {
        if (character.dead) {
          continue;
        }
        renderCharacter(dynamicSolid, dynamicLines, character, this.camera.firstPerson && character.isLocal);
      }

      for (const corpse of this.corpses) {
        renderCorpse(dynamicSolid, dynamicLines, corpse);
      }

      for (const projectile of this.projectiles) {
        renderProjectile(dynamicSolid, dynamicLines, projectile);
      }

      this.renderer.render({
        cameraMatrix: this.camera.matrix,
        cameraPos: this.camera.eye,
        staticSolid: this.world.solid,
        staticTransparent: this.world.transparent,
        staticLines: this.world.lines,
        dynamicSolid,
        dynamicLines
      });
    }

    updateHud() {
      const local = this.localCharacter;
      if (!local) {
        return;
      }

      const healthPct = clamp(local.health / local.maxHealth, 0, 1);
      this.dom.healthFill.style.width = `${healthPct * 100}%`;
      this.dom.healthText.textContent = `${Math.round(local.health)} / ${local.maxHealth}`;
      this.dom.healthFill.style.background = healthPct > 0.5
        ? 'linear-gradient(#7bff6b, #3baa2f)'
        : healthPct > 0.22
          ? 'linear-gradient(#ffdb6b, #d7991e)'
          : 'linear-gradient(#ff7a7a, #bf1b1b)';
    }

    refreshScoreboard(force) {
      if (!force && this.dom.scorePanel.classList.contains('hidden')) {
        return;
      }

      this.dom.scoreBody.textContent = '';
      const ordered = [...this.characters.values()].sort((a, b) => {
        if (b.ko !== a.ko) {
          return b.ko - a.ko;
        }
        return a.name.localeCompare(b.name);
      });

      for (const character of ordered) {
        const row = document.createElement('tr');
        if (character.isLocal) {
          row.style.fontWeight = '700';
          row.style.background = 'rgba(255, 239, 118, 0.35)';
        }
        row.innerHTML = `<td>${escapeHtml(character.name)}</td><td>${character.ko}</td><td>${character.wo}</td>`;
        this.dom.scoreBody.appendChild(row);
      }
    }

    updateLabels() {
      const width = this.camera.width;
      const height = this.camera.height;
      for (const character of this.characters.values()) {
        if (character.dead || (character.isLocal && this.camera.firstPerson)) {
          character.label.name.style.display = 'none';
          character.label.bubble.style.display = 'none';
          continue;
        }

        const headPoint = vAdd(character.pos, v3(0, 6.2, 0));
        const clip = projectPoint(this.camera.matrix, headPoint);
        if (!clip || clip.w <= 0) {
          character.label.name.style.display = 'none';
          character.label.bubble.style.display = 'none';
          continue;
        }

        const screenX = (clip.x * 0.5 + 0.5) * width;
        const screenY = (-clip.y * 0.5 + 0.5) * height;
        character.label.name.style.left = `${screenX}px`;
        character.label.name.style.top = `${screenY - 10}px`;
        character.label.name.style.display = 'block';

        if (character.bubble && character.bubbleUntil > this.time) {
          character.label.bubble.textContent = character.bubble;
          character.label.bubble.style.left = `${screenX}px`;
          character.label.bubble.style.top = `${screenY - 38}px`;
          character.label.bubble.style.display = 'block';
        } else {
          character.label.bubble.style.display = 'none';
        }
      }
    }

    makeLabelElements(character) {
      const name = document.createElement('div');
      name.className = 'nameplate';
      name.textContent = character.name;
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble';
      bubble.style.display = 'none';
      this.dom.labelLayer.append(name, bubble);
      character.label = { name, bubble };
    }

    openChatEntry() {
      this.releasePointerLock();
      this.dom.chatEntry.classList.remove('hidden');
      this.dom.chatInput.value = '';
      this.dom.chatInput.focus();
    }

    closeChatEntry() {
      this.dom.chatEntry.classList.add('hidden');
      this.dom.chatInput.blur();
    }

    pushChat(speaker, message, isSystem) {
      const line = document.createElement('div');
      line.className = `chat-line${isSystem ? ' system' : ''}`;
      line.innerHTML = `<span class="speaker">${escapeHtml(speaker)}</span>: ${escapeHtml(message)}`;
      this.dom.chatLog.appendChild(line);
      while (this.dom.chatLog.children.length > 8) {
        this.dom.chatLog.removeChild(this.dom.chatLog.firstChild);
      }
    }

    sendLocalChat(message) {
      const local = this.localCharacter;
      if (!local) {
        return;
      }
      local.bubble = message;
      local.bubbleUntil = this.time + 6;
      this.pushChat(local.name, message, false);

      if (this.mode === 'host') {
        this.network.broadcastChat(local.id, local.name, message);
      } else if (this.mode === 'client') {
        this.network.sendChat(message);
      }
    }

    receiveRemoteSpeech(playerId, speakerName, message) {
      const character = this.characters.get(playerId);
      if (character) {
        character.bubble = message;
        character.bubbleUntil = this.time + 6;
      }
      this.pushChat(speakerName, message, false);
    }

    receiveSystemChat(message) {
      this.pushChat('System', message, true);
    }

    setHint(text, duration) {
      this.dom.hintBar.textContent = text;
      this.dom.hintBar.style.opacity = '1';
      this.hintTimer = duration;
    }

    selectTool(slotNumber, notify) {
      const local = this.localCharacter;
      if (!local) {
        return;
      }
      const index = TOOL_DEFS.findIndex((tool) => tool.slot === slotNumber);
      if (index === -1) {
        return;
      }
      local.selectedTool = index;
      this.updateHotbar();
      this.updateToolDescription();
      if (notify) {
        this.setHint(`${TOOL_DEFS[index].name} equipped. ${TOOL_DEFS[index].useHint}`, 4.2);
      }
    }

    updateHotbar() {
      const local = this.localCharacter;
      const selected = local ? local.selectedTool : -1;
      this.dom.hotbarSlots.forEach((slot, slotIndex) => {
        slot.classList.toggle('active', slotIndex === selected);
      });
    }

    updateToolDescription() {
      const local = this.localCharacter;
      const tool = local ? TOOL_DEFS[local.selectedTool] : null;
      this.dom.toolDescription.textContent = tool ? tool.description : 'No tool equipped.';
    }

    toggleMenu(force) {
      const show = typeof force === 'boolean' ? force : this.dom.menuWindow.classList.contains('hidden');
      if (show) {
        this.releasePointerLock();
      }
      this.dom.menuWindow.classList.toggle('hidden', !show);
    }

    togglePlayers(force) {
      const show = typeof force === 'boolean' ? force : this.dom.scorePanel.classList.contains('hidden');
      this.dom.scorePanel.classList.toggle('hidden', !show);
      this.dom.healthPanel.classList.toggle('hidden', !show);
    }

    toggleBackpack(force) {
      const show = typeof force === 'boolean' ? force : this.dom.backpackWindow.classList.contains('hidden');
      if (show) {
        this.releasePointerLock();
      }
      this.dom.backpackWindow.classList.toggle('hidden', !show);
    }

    toggleNetworkWindow(force) {
      const show = typeof force === 'boolean' ? force : this.dom.networkWindow.classList.contains('hidden');
      if (show) {
        this.releasePointerLock();
      }
      this.dom.networkWindow.classList.toggle('hidden', !show);
      if (show) {
        this.refreshNetworkWindow();
      }
    }

    refreshNetworkWindow() {
      const roleLabel = this.mode === 'host' ? 'Host' : this.mode === 'client' ? 'Join Player' : 'Solo';
      this.dom.networkRoleLine.textContent = `Mode: ${roleLabel}`;
      this.dom.hostControls.classList.toggle('hidden', this.mode !== 'host');
      this.dom.joinControls.classList.toggle('hidden', this.mode !== 'client');
      if (this.mode === 'solo') {
        this.setNetworkStatus('Solo session only. Restart with Host Online or Join Online from the launch screen if you want multiplayer.');
      }
    }

    setNetworkStatus(text) {
      this.dom.networkStatus.textContent = text;
    }

    updateSessionHeader() {
      this.dom.placeName.textContent = 'Build and Learn';
      if (this.mode === 'solo') {
        this.dom.serverName.textContent = 'Solo Session';
      } else if (this.mode === 'host') {
        this.dom.serverName.textContent = `Private Host • ${this.characters.size} player${this.characters.size === 1 ? '' : 's'}`;
      } else if (this.network.isGameplayReady()) {
        this.dom.serverName.textContent = 'Connected to Private Host';
      } else {
        this.dom.serverName.textContent = 'Awaiting Host Connection';
      }
    }

    refreshConnectedPlayers() {
      if (this.mode !== 'host') {
        return;
      }
      const names = [...this.characters.values()].map((character) => {
        const suffix = character.isLocal ? ' (Host)' : '';
        return `${character.name}${suffix}`;
      });
      this.dom.connectedPlayers.textContent = names.length ? names.join('\n') : 'No one connected yet.';
    }

    requestReset() {
      if (this.mode === 'client') {
        if (!this.network.isGameplayReady()) {
          this.setHint('Not connected to a host yet.', 3);
          return;
        }
        this.network.sendReset();
        this.setHint('Reset request sent to the host.', 2.5);
        return;
      }
      const local = this.localCharacter;
      if (local) {
        this.killCharacter(local, null);
      }
    }

    enterFullscreen() {
      const element = document.documentElement;
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (element.requestFullscreen) {
        element.requestFullscreen().catch(() => {});
      }
    }

    isUiBlockingInput() {
      return !this.dom.chatEntry.classList.contains('hidden')
        || !this.dom.menuWindow.classList.contains('hidden')
        || !this.dom.backpackWindow.classList.contains('hidden')
        || !this.dom.networkWindow.classList.contains('hidden')
        || document.activeElement === this.dom.chatInput
        || document.activeElement === this.dom.playerNameInput
        || document.activeElement === this.dom.joinOfferInput
        || document.activeElement === this.dom.hostAnswerInput
        || document.activeElement === this.dom.hostOfferOutput
        || document.activeElement === this.dom.joinAnswerOutput;
    }

    onResize() {
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      this.camera.width = width;
      this.camera.height = height;
      this.renderer.resize(width, height);
    }

    applyRemoteInput(playerId, input) {
      const character = this.characters.get(playerId);
      if (!character) {
        return;
      }
      character.remoteInput = {
        ...makeNeutralInput(),
        ...input
      };
    }

    applyRemoteToolUse(playerId, action) {
      const character = this.characters.get(playerId);
      if (!character) {
        return;
      }
      character.remoteInput = {
        ...character.remoteInput,
        ...action,
        useNonce: action.useNonce
      };
    }

    applyRemoteReset(playerId) {
      const character = this.characters.get(playerId);
      if (!character) {
        return;
      }
      character.remoteInput.resetNonce += 1;
    }

    onPeerHello(connectionKey, playerData) {
      let character = this.characters.get(playerData.id);
      if (!character) {
        character = this.createRemoteCharacter(playerData, connectionKey);
      }
      character.connectionKey = connectionKey;
      character.name = sanitizeName(playerData.name);
      this.applyCharacterAppearance(character, playerData.avatarPreset);
      character.spawn = this.allocateSpawn(this.characters.size - 1);
      character.pos = vCopy(character.spawn);
      character.forcefield = 4;
      character.initializedFromNetwork = true;
      this.refreshScoreboard(true);
      this.refreshConnectedPlayers();
      this.updateSessionHeader();
      const message = `${character.name} joined Build and Learn.`;
      this.pushChat('System', message, true);
      this.network.broadcastSystemChat(message, connectionKey);
      this.network.sendWelcome(connectionKey, character.id);
      this.network.broadcastSnapshot();
    }

    onPeerLeft(playerId) {
      const character = this.characters.get(playerId);
      if (!character) {
        return;
      }
      const message = `${character.name} left Build and Learn.`;
      this.removeCharacter(playerId);
      this.pushChat('System', message, true);
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(message);
        this.network.broadcastSnapshot();
      }
    }

    onConnectedToHost() {
      this.setNetworkStatus('Connected to host. Waiting for world snapshots...');
      this.updateSessionHeader();
    }

    onWelcomeFromHost(playerId) {
      this.localPlayerId = playerId;
      this.setNetworkStatus('Connected to host. Gameplay is now active.');
      this.updateSessionHeader();
      this.toggleNetworkWindow(false);
      this.setHint('Connected! Real players are live now. Zoom all the way in, then click the game for first-person mouse lock.', 8);
    }

    buildSnapshot() {
      return {
        serverTime: roundNetworkFloat(this.time),
        players: [...this.characters.values()].map((character) => serializeCharacter(character)),
        projectiles: this.projectiles.map((projectile) => serializeProjectile(projectile)),
        corpses: this.corpses.map((corpse) => serializeCorpse(corpse))
      };
    }

    applySnapshot(snapshot) {
      if (!snapshot || !Array.isArray(snapshot.players)) {
        return;
      }

      const seenIds = new Set();
      for (const playerData of snapshot.players) {
        seenIds.add(playerData.id);
        if (playerData.id === this.localPlayerId) {
          this.localAuthorityState = playerData;
          const local = this.localCharacter;
          if (local) {
            local.name = playerData.name;
            this.applyCharacterAppearance(local, playerData.avatarPreset);
            local.maxHealth = playerData.maxHealth;
            local.forcefield = playerData.forcefield;
            local.selectedTool = playerData.selectedTool;
            local.ko = playerData.ko;
            local.wo = playerData.wo;
            local.spawn = vCopy(playerData.spawn || local.spawn);
            this.updateHotbar();
          }
          continue;
        }

        let character = this.characters.get(playerData.id);
        if (!character) {
          character = this.createRemoteCharacter(playerData, null);
        }

        character.name = playerData.name;
        this.applyCharacterAppearance(character, playerData.avatarPreset);
        character.maxHealth = playerData.maxHealth;
        character.forcefield = playerData.forcefield;
        character.selectedTool = playerData.selectedTool;
        character.ko = playerData.ko;
        character.wo = playerData.wo;
        character.netTarget = playerData;
        character.netReceivedAt = this.time;
        character.initializedFromNetwork = true;

        if (!character.netInitialized) {
          character.pos = vCopy(playerData.pos);
          character.vel = vCopy(playerData.vel);
          character.yaw = playerData.yaw;
          character.walkCycle = playerData.walkCycle;
          character.health = playerData.health;
          character.dead = playerData.dead;
          character.netInitialized = true;
        }
      }

      for (const character of [...this.characters.values()]) {
        if (character.isLocal) {
          continue;
        }
        if (!seenIds.has(character.id)) {
          this.removeCharacter(character.id);
        }
      }

      this.projectiles = Array.isArray(snapshot.projectiles)
        ? snapshot.projectiles.map((data) => deserializeProjectile(data))
        : [];
      this.corpses = Array.isArray(snapshot.corpses)
        ? snapshot.corpses.map((data) => deserializeCorpse(data))
        : [];

      this.refreshScoreboard(true);
      this.updateSessionHeader();
    }

    applyRemoteSmoothing(character, dt) {
      if (!character.netTarget) {
        return;
      }

      const target = character.netTarget;
      character.dead = Boolean(target.dead);
      character.health = lerp(character.health, target.health, clamp(dt * 12, 0, 1));
      character.forcefield = target.forcefield;
      character.selectedTool = target.selectedTool;
      character.ko = target.ko;
      character.wo = target.wo;
      character.climbing = Boolean(target.climbing);
      character.swing.time = Math.max(character.swing.time - dt, target.swingTime);
      character.pos = vLerp(character.pos, target.pos, clamp(dt * 12, 0, 1));
      character.vel = vLerp(character.vel, target.vel, clamp(dt * 10, 0, 1));
      character.yaw = turnTowardsAngle(character.yaw, target.yaw, dt * 12);
      character.walkCycle += dt * (0.9 + clamp(Math.hypot(character.vel.x, character.vel.z) / character.walkSpeed, 0, 1) * 5.6);
    }

    applyLocalCorrection(local, dt) {
      if (!this.localAuthorityState) {
        return;
      }

      const auth = this.localAuthorityState;
      const wasDead = local.dead;
      local.dead = Boolean(auth.dead);
      this.applyCharacterAppearance(local, auth.avatarPreset);
      local.maxHealth = auth.maxHealth;
      local.forcefield = auth.forcefield;
      local.health = auth.health;
      local.ko = auth.ko;
      local.wo = auth.wo;
      local.selectedTool = auth.selectedTool;
      local.climbing = Boolean(auth.climbing);
      local.swing.time = Math.max(local.swing.time, auth.swingTime);
      local.spawn = vCopy(auth.spawn || local.spawn);

      if (local.dead) {
        local.pos = vCopy(auth.pos);
        local.vel = vCopy(auth.vel);
      } else {
        const error = vLength(vSub(local.pos, auth.pos));
        if (error > 4) {
          local.pos = vCopy(auth.pos);
        } else {
          local.pos = vLerp(local.pos, auth.pos, clamp(dt * 6, 0, 1) * 0.55);
        }
        local.vel = vLerp(local.vel, auth.vel, 0.25);
        local.yaw = turnTowardsAngle(local.yaw, auth.yaw, dt * 12);
      }

      if (wasDead && !local.dead) {
        this.audio.playRespawn();
      }

      this.updateHotbar();
      this.updateToolDescription();
    }
  }

  class ManualRtcNetwork {
    constructor(gameInstance, options) {
      this.game = gameInstance;
      this.role = options.role;
      this.useStun = options.useStun;
      this.peers = new Map();
      this.gameplayReady = this.role !== 'client';
      this.joinConnectionKey = null;
      this.rtcAvailable = typeof RTCPeerConnection !== 'undefined';

      if (!this.rtcAvailable && this.role !== 'solo') {
        this.game.setNetworkStatus('WebRTC is not available in this browser. Multiplayer cannot start here.');
      } else if (this.role === 'solo') {
        this.game.setNetworkStatus('Offline solo session.');
      } else if (this.role === 'host') {
        this.game.setNetworkStatus(this.useStun
          ? 'Hosting with wider internet mode. Create an invite code below.'
          : 'Hosting in strict direct mode. Best for LAN or very direct peer links.');
      } else {
        this.game.setNetworkStatus(this.useStun
          ? 'Join mode ready. Paste a host invite, generate your answer, then wait for the host to finish the handshake.'
          : 'Join mode ready in strict direct mode. Best for LAN or direct peer links.');
      }
    }

    get rtcConfig() {
      return {
        iceServers: this.useStun ? DEFAULT_ICE_SERVERS : []
      };
    }

    isChannelOpen() {
      if (this.role === 'host') {
        return true;
      }
      const peer = this.joinConnectionKey ? this.peers.get(this.joinConnectionKey) : null;
      return Boolean(peer && peer.channel && peer.channel.readyState === 'open');
    }

    isGameplayReady() {
      return this.gameplayReady;
    }

    async createInvite() {
      if (this.role !== 'host') {
        return;
      }
      if (!this.rtcAvailable) {
        throw new Error('WebRTC is unavailable in this browser.');
      }

      const connectionKey = makeId(8);
      const pc = new RTCPeerConnection(this.rtcConfig);
      const channel = pc.createDataChannel('build-and-learn', { ordered: true });
      const peer = this.attachPeer(connectionKey, pc, channel);
      peer.inviteId = connectionKey;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIceGatheringComplete(pc);

      const signal = encodeSignal({
        kind: 'offer',
        inviteId: connectionKey,
        description: pc.localDescription
      });

      this.game.dom.hostOfferOutput.value = signal;
      this.game.setNetworkStatus('Invite code ready. Send it to the joiner, then paste their answer below.');
      return signal;
    }

    async acceptAnswer(text) {
      if (this.role !== 'host') {
        return;
      }
      const data = decodeSignal(text);
      if (!data || data.kind !== 'answer' || !data.inviteId || !data.description) {
        throw new Error('That answer code is not valid.');
      }

      const peer = this.peers.get(data.inviteId);
      if (!peer) {
        throw new Error('No pending invite matches that answer code.');
      }

      await peer.pc.setRemoteDescription(new RTCSessionDescription(data.description));
      this.game.setNetworkStatus('Answer accepted. Waiting for the joiner connection to open...');
      this.game.dom.hostAnswerInput.value = '';
    }

    async generateAnswer(text) {
      if (this.role !== 'client') {
        return;
      }
      if (!this.rtcAvailable) {
        throw new Error('WebRTC is unavailable in this browser.');
      }

      const data = decodeSignal(text);
      if (!data || data.kind !== 'offer' || !data.description || !data.inviteId) {
        throw new Error('That invite code is not valid.');
      }

      const connectionKey = data.inviteId;
      const pc = new RTCPeerConnection(this.rtcConfig);
      const peer = this.attachPeer(connectionKey, pc, null);
      this.joinConnectionKey = connectionKey;

      pc.ondatachannel = (event) => {
        this.attachChannel(peer, event.channel);
      };

      await pc.setRemoteDescription(new RTCSessionDescription(data.description));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitForIceGatheringComplete(pc);

      const signal = encodeSignal({
        kind: 'answer',
        inviteId: data.inviteId,
        description: pc.localDescription
      });

      this.game.dom.joinAnswerOutput.value = signal;
      this.game.setNetworkStatus('Answer ready. Send it back to the host, then wait for the connection to finish opening.');
      return signal;
    }

    attachPeer(connectionKey, pc, channel) {
      const peer = {
        connectionKey,
        pc,
        channel,
        playerId: null,
        opened: false
      };
      this.peers.set(connectionKey, peer);

      pc.addEventListener('connectionstatechange', () => {
        const state = pc.connectionState;
        if (state === 'failed' || state === 'closed' || state === 'disconnected') {
          this.handlePeerClosed(peer);
        }
      });

      if (channel) {
        this.attachChannel(peer, channel);
      }

      return peer;
    }

    attachChannel(peer, channel) {
      peer.channel = channel;
      channel.addEventListener('open', () => {
        peer.opened = true;
        if (this.role === 'client') {
          this.game.onConnectedToHost();
          this.send(peer, {
            type: 'hello',
            player: {
              id: this.game.localPlayerId,
              name: this.game.localCharacter.name,
              avatarPreset: this.game.localCharacter.avatarPreset,
              bodyColors: plainBodyColors(this.game.localCharacter.bodyColors)
            }
          });
        } else {
          this.game.setNetworkStatus('Joiner connected. Waiting for their player data...');
        }
      });

      channel.addEventListener('message', (event) => {
        this.handleMessage(peer, event.data);
      });

      channel.addEventListener('close', () => {
        this.handlePeerClosed(peer);
      });
    }

    handlePeerClosed(peer) {
      if (!this.peers.has(peer.connectionKey)) {
        return;
      }
      this.peers.delete(peer.connectionKey);
      if (this.role === 'client') {
        this.gameplayReady = false;
        this.game.setNetworkStatus('Disconnected from the host.');
        this.game.updateSessionHeader();
      } else if (peer.playerId) {
        this.game.onPeerLeft(peer.playerId);
      }
    }

    handleMessage(peer, raw) {
      let message;
      try {
        message = JSON.parse(raw);
      } catch {
        return;
      }

      if (this.role === 'host') {
        this.handleHostMessage(peer, message);
      } else if (this.role === 'client') {
        this.handleClientMessage(peer, message);
      }
    }

    handleHostMessage(peer, message) {
      if (message.type === 'hello') {
        peer.playerId = message.player.id;
        this.game.onPeerHello(peer.connectionKey, message.player);
        return;
      }

      if (!peer.playerId) {
        return;
      }

      if (message.type === 'input') {
        this.game.applyRemoteInput(peer.playerId, message.input);
      } else if (message.type === 'tool') {
        this.game.applyRemoteToolUse(peer.playerId, message.action);
      } else if (message.type === 'reset') {
        this.game.applyRemoteReset(peer.playerId);
      } else if (message.type === 'chat') {
        const character = this.game.characters.get(peer.playerId);
        if (!character) {
          return;
        }
        this.game.receiveRemoteSpeech(character.id, character.name, message.message);
        this.broadcast({
          type: 'chat',
          playerId: character.id,
          speaker: character.name,
          message: message.message
        }, peer.connectionKey);
      }
    }

    handleClientMessage(peer, message) {
      if (message.type === 'welcome') {
        this.gameplayReady = true;
        this.game.onWelcomeFromHost(message.playerId);
        return;
      }

      if (message.type === 'snapshot') {
        this.game.applySnapshot(message.snapshot);
        return;
      }

      if (message.type === 'chat') {
        this.game.receiveRemoteSpeech(message.playerId, message.speaker, message.message);
        return;
      }

      if (message.type === 'system-chat') {
        this.game.receiveSystemChat(message.message);
      }
    }

    send(peer, payload) {
      if (!peer || !peer.channel || peer.channel.readyState !== 'open') {
        return;
      }
      peer.channel.send(JSON.stringify(payload));
    }

    broadcast(payload, exceptConnectionKey = null) {
      for (const peer of this.peers.values()) {
        if (exceptConnectionKey && peer.connectionKey === exceptConnectionKey) {
          continue;
        }
        this.send(peer, payload);
      }
    }

    sendWelcome(connectionKey, playerId) {
      const peer = this.peers.get(connectionKey);
      this.send(peer, {
        type: 'welcome',
        playerId
      });
    }

    sendInput(input) {
      if (this.role !== 'client' || !this.joinConnectionKey) {
        return;
      }
      const peer = this.peers.get(this.joinConnectionKey);
      this.send(peer, {
        type: 'input',
        input
      });
    }

    sendToolUse(action) {
      if (this.role !== 'client' || !this.joinConnectionKey) {
        return;
      }
      const peer = this.peers.get(this.joinConnectionKey);
      this.send(peer, {
        type: 'tool',
        action
      });
    }

    sendReset() {
      if (this.role !== 'client' || !this.joinConnectionKey) {
        return;
      }
      const peer = this.peers.get(this.joinConnectionKey);
      this.send(peer, {
        type: 'reset'
      });
    }

    sendChat(message) {
      if (this.role !== 'client' || !this.joinConnectionKey) {
        return;
      }
      const peer = this.peers.get(this.joinConnectionKey);
      this.send(peer, {
        type: 'chat',
        message
      });
    }

    broadcastChat(playerId, speaker, message, exceptConnectionKey = null) {
      if (this.role !== 'host') {
        return;
      }
      this.broadcast({
        type: 'chat',
        playerId,
        speaker,
        message
      }, exceptConnectionKey);
    }

    broadcastSystemChat(message, exceptConnectionKey = null) {
      if (this.role !== 'host') {
        return;
      }
      this.broadcast({
        type: 'system-chat',
        message
      }, exceptConnectionKey);
    }

    broadcastSnapshot() {
      if (this.role !== 'host') {
        return;
      }
      this.broadcast({
        type: 'snapshot',
        snapshot: this.game.buildSnapshot()
      });
    }
  }

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
      if (!gl) {
        throw new Error('WebGL is required for this recreation.');
      }
      this.gl = gl;
      this.programs = createPrograms(gl);
      this.staticSolid = createGpuMesh(gl, 'triangles', gl.STATIC_DRAW);
      this.staticTransparent = createGpuMesh(gl, 'triangles', gl.STATIC_DRAW);
      this.staticLines = createGpuMesh(gl, 'lines', gl.STATIC_DRAW);
      this.dynamicSolid = createGpuMesh(gl, 'triangles', gl.DYNAMIC_DRAW);
      this.dynamicLines = createGpuMesh(gl, 'lines', gl.DYNAMIC_DRAW);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clearColor(0.56, 0.73, 0.99, 1);
    }

    setStaticWorld(world) {
      uploadTriMesh(this.gl, this.staticSolid, world.solid);
      uploadTriMesh(this.gl, this.staticTransparent, world.transparent);
      uploadLineMesh(this.gl, this.staticLines, world.lines);
    }

    resize(width, height) {
      this.canvas.width = Math.floor(width);
      this.canvas.height = Math.floor(height);
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    render(scene) {
      const gl = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      uploadTriMesh(gl, this.dynamicSolid, scene.dynamicSolid);
      uploadLineMesh(gl, this.dynamicLines, scene.dynamicLines);

      gl.disable(gl.BLEND);
      gl.depthMask(true);
      this.drawTriMesh(this.staticSolid, scene.cameraMatrix, scene.cameraPos);
      this.drawTriMesh(this.dynamicSolid, scene.cameraMatrix, scene.cameraPos);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
      this.drawTriMesh(this.staticTransparent, scene.cameraMatrix, scene.cameraPos);
      this.drawLineMesh(this.staticLines, scene.cameraMatrix, scene.cameraPos);
      this.drawLineMesh(this.dynamicLines, scene.cameraMatrix, scene.cameraPos);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }

    drawTriMesh(mesh, cameraMatrix, cameraPos) {
      if (!mesh.count) {
        return;
      }

      const gl = this.gl;
      const program = this.programs.tri;
      gl.useProgram(program.program);
      gl.uniformMatrix4fv(program.uniforms.viewProj, false, cameraMatrix);
      gl.uniform3f(program.uniforms.cameraPos, cameraPos.x, cameraPos.y, cameraPos.z);
      gl.uniform3f(program.uniforms.lightDir, 0.42, 1, 0.3);
      gl.uniform3f(program.uniforms.fogColor, 0.68, 0.82, 0.98);
      gl.uniform1f(program.uniforms.fogNear, 35);
      gl.uniform1f(program.uniforms.fogFar, 140);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
      gl.enableVertexAttribArray(program.attributes.position);
      gl.vertexAttribPointer(program.attributes.position, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normal);
      gl.enableVertexAttribArray(program.attributes.normal);
      gl.vertexAttribPointer(program.attributes.normal, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.color);
      gl.enableVertexAttribArray(program.attributes.color);
      gl.vertexAttribPointer(program.attributes.color, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    }

    drawLineMesh(mesh, cameraMatrix, cameraPos) {
      if (!mesh.count) {
        return;
      }

      const gl = this.gl;
      const program = this.programs.line;
      gl.useProgram(program.program);
      gl.uniformMatrix4fv(program.uniforms.viewProj, false, cameraMatrix);
      gl.uniform3f(program.uniforms.cameraPos, cameraPos.x, cameraPos.y, cameraPos.z);
      gl.uniform3f(program.uniforms.fogColor, 0.68, 0.82, 0.98);
      gl.uniform1f(program.uniforms.fogNear, 35);
      gl.uniform1f(program.uniforms.fogFar, 140);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
      gl.enableVertexAttribArray(program.attributes.position);
      gl.vertexAttribPointer(program.attributes.position, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.color);
      gl.enableVertexAttribArray(program.attributes.color);
      gl.vertexAttribPointer(program.attributes.color, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.LINES, 0, mesh.count);
    }
  }

  class AudioEngine {
    constructor() {
      this.context = null;
      this.master = null;
    }

    init() {
      if (this.context) {
        return;
      }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        return;
      }
      this.context = new AudioCtx();
      this.master = this.context.createGain();
      this.master.gain.value = 0.18;
      this.master.connect(this.context.destination);
    }

    tone(type, frequency, duration, volume, attack, release, detune = 0) {
      if (!this.context || !this.master) {
        return;
      }
      const start = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(volume, start + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration + release);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(start);
      osc.stop(start + duration + release + 0.02);
    }

    noise(duration, volume) {
      if (!this.context || !this.master) {
        return;
      }
      const buffer = this.context.createBuffer(1, Math.floor(this.context.sampleRate * duration), this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }
      const source = this.context.createBufferSource();
      const gain = this.context.createGain();
      source.buffer = buffer;
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(this.master);
      source.start();
    }

    playJump() {
      this.tone('square', 320, 0.06, 0.12, 0.004, 0.08, -80);
      this.tone('triangle', 520, 0.04, 0.08, 0.002, 0.06, -40);
    }

    playSwordSwing() {
      this.noise(0.08, 0.06);
      this.tone('sawtooth', 210, 0.07, 0.08, 0.002, 0.09, 250);
    }

    playThrow() {
      this.tone('square', 180, 0.08, 0.08, 0.004, 0.08, 0);
    }

    playPellet() {
      this.tone('square', 480, 0.04, 0.07, 0.002, 0.04, 0);
    }

    playHit() {
      this.noise(0.05, 0.08);
      this.tone('triangle', 150, 0.06, 0.07, 0.001, 0.06, -50);
    }

    playRespawn() {
      this.tone('sine', 480, 0.08, 0.08, 0.002, 0.12, 0);
      this.tone('sine', 680, 0.07, 0.05, 0.002, 0.1, 0);
    }

    playDeath() {
      this.tone('square', 220, 0.12, 0.08, 0.003, 0.14, -300);
      this.noise(0.07, 0.05);
    }
  }

  function createCharacter(options) {
    const avatarPreset = normalizeAvatarPresetKey(options.avatarPreset);
    const preset = getAvatarPreset(avatarPreset);
    return {
      id: options.id,
      name: options.name,
      isLocal: Boolean(options.isLocal),
      avatarPreset,
      spawn: vCopy(options.spawn),
      pos: vCopy(options.spawn),
      vel: v3(),
      yaw: 0.78,
      health: 100,
      maxHealth: 100,
      walkSpeed: 16,
      ko: 0,
      wo: 0,
      grounded: false,
      climbing: false,
      jumpHeld: false,
      forcefield: 0,
      lastDamageAgo: 99,
      damageFlash: 0,
      dead: false,
      respawnAt: 0,
      selectedTool: 0,
      toolCooldown: 0,
      walkCycle: randRange(0, TAU),
      bodyColors: cloneBodyColors(options.bodyColors || preset.bodyColors),
      swing: {
        time: 0,
        didHit: false
      },
      bubble: null,
      bubbleUntil: 0,
      label: null,
      bounds: {
        halfX: 1.05,
        halfZ: 1.05,
        bottom: 0,
        top: 5.85
      }
    };
  }

  function createCorpse(character) {
    const parts = [];
    const base = character.pos;
    const colors = character.bodyColors;
    const pose = getCharacterPose(character);

    const definitions = [
      { name: 'head', center: vAdd(base, rotateAroundY(v3(0, 5.2, 0), character.yaw)), size: v3(1.8, 1.55, 1.55), color: colors.head },
      { name: 'torso', center: vAdd(base, rotateAroundY(v3(0, 3.1, 0), character.yaw)), size: v3(2, 2, 1), color: colors.torso },
      { name: 'left-arm', center: pose.leftArmCenter, size: v3(1, 2, 1), color: colors.arms },
      { name: 'right-arm', center: pose.rightArmCenter, size: v3(1, 2, 1), color: colors.arms },
      { name: 'left-leg', center: pose.leftLegCenter, size: v3(1, 2, 1), color: colors.legs },
      { name: 'right-leg', center: pose.rightLegCenter, size: v3(1, 2, 1), color: colors.legs }
    ];

    for (const definition of definitions) {
      parts.push({
        name: definition.name,
        pos: vCopy(definition.center),
        size: definition.size,
        color: definition.color,
        vel: vAdd(v3(randRange(-5.5, 5.5), randRange(8, 13), randRange(-5.5, 5.5)), vScale(character.vel, 0.12)),
        rot: v3(randRange(0, TAU), randRange(0, TAU), randRange(0, TAU)),
        spin: v3(randRange(-4, 4), randRange(-4, 4), randRange(-4, 4))
      });
    }

    return {
      owner: character.name,
      timer: 3.1,
      parts
    };
  }

  function buildClassicWorld() {
    const solid = createTriBuilder();
    const transparent = createTriBuilder();
    const lines = createLineBuilder();
    const colliders = [];

    const addBrick = ({ target = solid, center, size, color, studs = false, lineColor = OUTLINE, solidCollider = true, kill = false, climbable = false, transparentOnly = false }) => {
      appendAxisAlignedBox(target, lines, center, size, color, { studs, lineColor });
      if (solidCollider || kill || climbable) {
        colliders.push({
          min: v3(center.x - size.x / 2, center.y - size.y / 2, center.z - size.z / 2),
          max: v3(center.x + size.x / 2, center.y + size.y / 2, center.z + size.z / 2),
          center: vCopy(center),
          solid: solidCollider,
          kill,
          climbable,
          transparentOnly
        });
      }
    };

    addBrick({ center: v3(0, -1, 0), size: v3(128, 2, 128), color: COLORS.grass, studs: true });
    addBrick({ center: v3(0, -2.2, 0), size: v3(132, 0.4, 132), color: COLORS.grassDark, solidCollider: false });
    addBrick({ center: v3(0, 0.25, 0), size: v3(8, 0.5, 8), color: COLORS.stone, studs: false });
    addBrick({ target: transparent, center: v3(0, 0.65, 0), size: v3(7.2, 0.3, 7.2), color: COLORS.spawn, solidCollider: false, transparentOnly: true });
    addBrick({ center: v3(0, 0.85, 0), size: v3(4, 0.1, 1), color: COLORS.white, solidCollider: false });
    addBrick({ center: v3(0, 0.85, 0), size: v3(1, 0.1, 4), color: COLORS.white, solidCollider: false });

    addHouse(addBrick, transparent, 24, -20);
    addTree(addBrick, -18, -20);
    addTree(addBrick, 30, -30);
    addTower(addBrick, -28, 24);
    addBridgeArea(addBrick, transparent, 20, 22);
    addObby(addBrick, 0, 30);
    addColorStacks(addBrick, -18, 8);
    addBrick({ center: v3(-36, 0.5, -34), size: v3(12, 1, 12), color: COLORS.stone, studs: true });
    addBrick({ center: v3(-36, 4, -34), size: v3(12, 6, 1), color: COLORS.white });
    addBrick({ center: v3(-31, 2, -34), size: v3(1, 4, 8), color: COLORS.stoneDark });
    addBrick({ center: v3(-41, 2, -34), size: v3(1, 4, 8), color: COLORS.stoneDark });

    return {
      solid,
      transparent,
      lines,
      colliders,
      spawnPoint: v3(0, 0.01, 0)
    };
  }

  function addHouse(addBrick, transparentBuilder, x, z) {
    addBrick({ center: v3(x, 0.5, z), size: v3(16, 1, 16), color: COLORS.stone, studs: true });
    addBrick({ center: v3(x, 4.5, z - 7.5), size: v3(16, 8, 1), color: COLORS.white });
    addBrick({ center: v3(x - 7.5, 4.5, z), size: v3(1, 8, 16), color: COLORS.white });
    addBrick({ center: v3(x + 7.5, 4.5, z), size: v3(1, 8, 16), color: COLORS.white });
    addBrick({ center: v3(x - 4.5, 4.5, z + 7.5), size: v3(7, 8, 1), color: COLORS.white });
    addBrick({ center: v3(x + 4.5, 4.5, z + 7.5), size: v3(7, 8, 1), color: COLORS.white });
    addBrick({ center: v3(x, 7.5, z + 7.5), size: v3(2, 2, 1), color: COLORS.white });
    addBrick({ target: transparentBuilder, center: v3(x - 4.6, 4.7, z - 7.35), size: v3(3, 3, 0.2), color: COLORS.glass, solidCollider: false, transparentOnly: true });
    addBrick({ target: transparentBuilder, center: v3(x + 4.6, 4.7, z - 7.35), size: v3(3, 3, 0.2), color: COLORS.glass, solidCollider: false, transparentOnly: true });
    addBrick({ center: v3(x, 2, z + 7.2), size: v3(2.5, 4, 0.3), color: COLORS.brown, solidCollider: false });
    const roofLayers = [18, 14, 10, 6];
    roofLayers.forEach((size, index) => {
      addBrick({ center: v3(x, 8.6 + index, z), size: v3(size, 1, size), color: COLORS.roof, solidCollider: index === 0 });
    });
    addBrick({ center: v3(x + 5, 11.2, z - 2), size: v3(1.2, 3.6, 1.2), color: COLORS.darkBrown });
  }

  function addTree(addBrick, x, z) {
    addBrick({ center: v3(x, 3, z), size: v3(2, 6, 2), color: COLORS.darkBrown });
    addBrick({ center: v3(x, 7.5, z), size: v3(6, 4, 6), color: COLORS.leaf });
    addBrick({ center: v3(x, 10, z), size: v3(4, 2, 4), color: COLORS.leafDark, solidCollider: false });
  }

  function addTower(addBrick, x, z) {
    addBrick({ center: v3(x, 0.5, z), size: v3(12, 1, 12), color: COLORS.stone, studs: true });
    addBrick({ center: v3(x, 14.5, z), size: v3(12, 1, 12), color: COLORS.stone, studs: true });
    addBrick({ center: v3(x - 5, 7.5, z - 5), size: v3(1, 14, 1), color: COLORS.stoneDark });
    addBrick({ center: v3(x + 5, 7.5, z - 5), size: v3(1, 14, 1), color: COLORS.stoneDark });
    addBrick({ center: v3(x - 5, 7.5, z + 5), size: v3(1, 14, 1), color: COLORS.stoneDark });
    addBrick({ center: v3(x + 5, 7.5, z + 5), size: v3(1, 14, 1), color: COLORS.stoneDark });
    addBrick({ center: v3(x, 16.5, z - 5), size: v3(10, 2, 1), color: COLORS.white });
    addBrick({ center: v3(x, 16.5, z + 5), size: v3(10, 2, 1), color: COLORS.white });
    addBrick({ center: v3(x - 5, 16.5, z), size: v3(1, 2, 10), color: COLORS.white });
    addBrick({ center: v3(x + 5, 16.5, z), size: v3(1, 2, 10), color: COLORS.white });
    addTruss(addBrick, x, z - 3.5, 2.2, 14, 1.2);
    addBrick({ center: v3(x, 15.2, z), size: v3(4, 0.5, 4), color: COLORS.yellow, solidCollider: false });
    addBrick({ center: v3(x + 4, 15.2, z + 4), size: v3(2, 1, 2), color: COLORS.kill, kill: true });
  }

  function addTruss(addBrick, x, z, width, height, depth) {
    addBrick({ center: v3(x - width / 2 + 0.12, height / 2, z), size: v3(0.24, height, depth), color: COLORS.brown, climbable: true, solidCollider: false });
    addBrick({ center: v3(x + width / 2 - 0.12, height / 2, z), size: v3(0.24, height, depth), color: COLORS.brown, climbable: true, solidCollider: false });
    for (let y = 1; y < height; y += 2) {
      addBrick({ center: v3(x, y, z), size: v3(width, 0.18, depth), color: COLORS.brown, climbable: true, solidCollider: false });
    }
  }

  function addBridgeArea(addBrick, transparentBuilder, x, z) {
    addBrick({ target: transparentBuilder, center: v3(x, -1.4, z), size: v3(18, 3, 14), color: COLORS.water, solidCollider: false, transparentOnly: true });
    addBrick({ center: v3(x - 7, 0.5, z), size: v3(4, 1, 14), color: COLORS.stone, studs: true });
    addBrick({ center: v3(x + 7, 0.5, z), size: v3(4, 1, 14), color: COLORS.stone, studs: true });
    addBrick({ center: v3(x, 1, z), size: v3(6, 1, 14), color: COLORS.brown, studs: true });
    addBrick({ center: v3(x, 4, z - 6.6), size: v3(18, 6, 0.8), color: COLORS.white });
    addBrick({ center: v3(x, 4, z + 6.6), size: v3(18, 6, 0.8), color: COLORS.white });
  }

  function addObby(addBrick, x, z) {
    addBrick({ center: v3(x, -1.5, z), size: v3(16, 2, 16), color: COLORS.kill, kill: true });
    const stones = [-5, -2.5, 0, 2.5, 5];
    stones.forEach((offset, index) => {
      addBrick({ center: v3(x + offset, 0.5 + index * 0.25, z), size: v3(2, 1, 2), color: index % 2 === 0 ? COLORS.stone : COLORS.yellow, studs: true });
    });
    addBrick({ center: v3(x, 4.5, z + 6), size: v3(8, 1, 4), color: COLORS.stone, studs: true });
  }

  function addColorStacks(addBrick, x, z) {
    addBrick({ center: v3(x, 0.5, z), size: v3(8, 1, 8), color: COLORS.stone, studs: true });
    addBrick({ center: v3(x - 2, 2, z), size: v3(2, 2, 2), color: COLORS.blue, studs: true });
    addBrick({ center: v3(x, 3.5, z), size: v3(2, 3, 2), color: COLORS.roof, studs: true });
    addBrick({ center: v3(x + 2, 5.5, z), size: v3(2, 5, 2), color: COLORS.yellow, studs: true });
    addBrick({ center: v3(x + 4, 7, z), size: v3(2, 8, 2), color: COLORS.green, studs: true });
  }

  function renderCharacter(triBuilder, lineBuilder, character, hideBody) {
    const colors = character.bodyColors;
    const pose = getCharacterPose(character);
    const root = character.pos;
    const yaw = character.yaw;

    if (!hideBody) {
      addBodyBox(triBuilder, lineBuilder, root, yaw, { x: -1, y: 2.1, z: -0.5 }, { x: 1, y: 4.1, z: 0.5 }, colors.torso, true);
      addHead(triBuilder, lineBuilder, root, yaw, colors.head);
      addLimb(triBuilder, lineBuilder, pose.leftArmJoint, pose.leftArmRot, yaw, colors.arms);
      addLimb(triBuilder, lineBuilder, pose.rightArmJoint, pose.rightArmRot, yaw, colors.arms);
      addLimb(triBuilder, lineBuilder, pose.leftLegJoint, pose.leftLegRot, yaw, colors.legs);
      addLimb(triBuilder, lineBuilder, pose.rightLegJoint, pose.rightLegRot, yaw, colors.legs);
      renderAvatarAccessories(triBuilder, lineBuilder, character, pose);
      if (character.forcefield > 0) {
        addForcefieldRings(lineBuilder, vAdd(root, v3(0, 2.9, 0)), 3.6, COLORS.forcefield);
      }
    }

    if (character.selectedTool >= 0) {
      const tool = TOOL_DEFS[character.selectedTool];
      if (!tool) {
        return;
      }

      if (tool.id === 'linked-sword') {
        addHeldSword(triBuilder, lineBuilder, pose, yaw, character.swing.time);
      } else if (!hideBody && tool.id === 'slingshot') {
        addHeldSlingshot(triBuilder, lineBuilder, pose, yaw);
      } else if (!hideBody && tool.id === 'superball') {
        appendSphere(triBuilder, vAdd(pose.rightArmJoint, rotateAroundY(v3(0.25, -1.9, 0.7), yaw)), 0.42, COLORS.ballRed, 5, 7);
      }
    }
  }

  function getCharacterPose(character) {
    const moveStrength = clamp(Math.hypot(character.vel.x, character.vel.z) / character.walkSpeed, 0, 1);
    const walk = Math.sin(character.walkCycle) * 0.95 * moveStrength;
    const armBase = character.climbing ? -0.9 : 0;
    let rightArmRot = armBase + walk;
    let leftArmRot = armBase - walk;
    if (character.swing.time > 0) {
      const t = 1 - character.swing.time / 0.34;
      rightArmRot = -1.2 + Math.sin(t * Math.PI) * 2.45;
      leftArmRot *= 0.45;
    }
    return {
      leftArmJoint: vAdd(character.pos, rotateAroundY(v3(-1.5, 4.1, 0), character.yaw)),
      rightArmJoint: vAdd(character.pos, rotateAroundY(v3(1.5, 4.1, 0), character.yaw)),
      leftLegJoint: vAdd(character.pos, rotateAroundY(v3(-0.5, 2.05, 0), character.yaw)),
      rightLegJoint: vAdd(character.pos, rotateAroundY(v3(0.5, 2.05, 0), character.yaw)),
      leftArmRot,
      rightArmRot,
      leftLegRot: -walk,
      rightLegRot: walk,
      leftArmCenter: limbCenter(vAdd(character.pos, rotateAroundY(v3(-1.5, 4.1, 0), character.yaw)), -walk, character.yaw),
      rightArmCenter: limbCenter(vAdd(character.pos, rotateAroundY(v3(1.5, 4.1, 0), character.yaw)), walk, character.yaw),
      leftLegCenter: limbCenter(vAdd(character.pos, rotateAroundY(v3(-0.5, 2.05, 0), character.yaw)), -walk, character.yaw),
      rightLegCenter: limbCenter(vAdd(character.pos, rotateAroundY(v3(0.5, 2.05, 0), character.yaw)), walk, character.yaw)
    };
  }

  function limbCenter(joint, rotX, yaw) {
    return transformJointLocal(joint, yaw, rotX, v3(0, -1, 0));
  }

  function renderCorpse(triBuilder, lineBuilder, corpse) {
    for (const part of corpse.parts) {
      appendOrientedBox(triBuilder, lineBuilder, part.pos, part.size, part.rot, part.color, OUTLINE, false);
    }
  }

  function renderProjectile(triBuilder, lineBuilder, projectile) {
    if (projectile.type === 'slingshot') {
      appendSphere(triBuilder, projectile.pos, projectile.radius, projectile.color, 4, 6);
    } else {
      appendSphere(triBuilder, projectile.pos, projectile.radius, projectile.color, 5, 7);
      addForcefieldRings(lineBuilder, projectile.pos, projectile.radius + 0.12, shade(projectile.color, 1.15, 0.6), 8);
    }
  }

  function addHead(triBuilder, lineBuilder, root, yaw, color) {
    addBodyBox(triBuilder, lineBuilder, root, yaw, { x: -0.9, y: 4.45, z: -0.78 }, { x: 0.9, y: 5.95, z: 0.78 }, color, false);
    appendStudCaps(triBuilder, root, yaw, [v3(0, 5.95, 0)], color);
    const eyeOffset = 0.26;
    const faceY = 5.2;
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(-eyeOffset, faceY + 0.18, 0.82), v3(0.12, 0.22, 0.05));
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(eyeOffset, faceY + 0.18, 0.82), v3(0.12, 0.22, 0.05));
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(0, faceY - 0.15, 0.82), v3(0.4, 0.12, 0.05));
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(-0.26, faceY - 0.05, 0.82), v3(0.12, 0.12, 0.05));
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(0.26, faceY - 0.05, 0.82), v3(0.12, 0.12, 0.05));
  }

  function addFaceFeature(triBuilder, lineBuilder, root, yaw, localCenter, size) {
    const center = vAdd(root, rotateAroundY(localCenter, yaw));
    appendOrientedBox(triBuilder, lineBuilder, center, size, v3(0, yaw, 0), COLORS.black, OUTLINE, false);
  }

  function addLimb(triBuilder, lineBuilder, jointWorld, rotX, yaw, color) {
    const center = transformJointLocal(jointWorld, yaw, rotX, v3(0, -1, 0));
    appendOrientedBox(triBuilder, lineBuilder, center, v3(1, 2, 1), v3(rotX, yaw, 0), color, OUTLINE, false);
  }

  function addBodyBox(triBuilder, lineBuilder, root, yaw, min, max, color, studsTop) {
    const center = vAdd(root, rotateAroundY(v3((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2), yaw));
    const size = v3(max.x - min.x, max.y - min.y, max.z - min.z);
    appendOrientedBox(triBuilder, lineBuilder, center, size, v3(0, yaw, 0), color, OUTLINE, studsTop);
  }

  function addHeldSword(triBuilder, lineBuilder, pose, yaw, swingTime) {
    const grip = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.12, -1.9, 0.48));
    const rotX = pose.rightArmRot + (swingTime > 0 ? 0.45 : 0.1);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, rotX, v3(0.08, -2.65, 0.66)), v3(0.18, 2.2, 0.18), v3(rotX, yaw, 0), COLORS.swordSteel, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, grip, v3(0.9, 0.18, 0.18), v3(rotX, yaw, 0), COLORS.swordHilt, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, rotX, v3(0.08, -1.9, 0.48)), v3(0.18, 0.9, 0.18), v3(rotX, yaw, 0), COLORS.swordHilt, OUTLINE, false);
  }

  function addHeldSlingshot(triBuilder, lineBuilder, pose, yaw) {
    const hand = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.05, -1.85, 0.35));
    appendOrientedBox(triBuilder, lineBuilder, hand, v3(0.18, 1, 0.18), v3(pose.rightArmRot, yaw, 0), COLORS.brown, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.32, -1.18, 0.35)), v3(0.18, 0.8, 0.18), v3(pose.rightArmRot + 0.4, yaw, 0), COLORS.brown, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(-0.22, -1.18, 0.35)), v3(0.18, 0.8, 0.18), v3(pose.rightArmRot + 0.4, yaw, 0), COLORS.brown, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.05, -0.88, 0.38)), v3(0.45, 0.14, 0.12), v3(pose.rightArmRot, yaw, 0), COLORS.black, OUTLINE, false);
  }

  function renderAvatarAccessories(triBuilder, lineBuilder, character, pose) {
    const preset = getAvatarPreset(character.avatarPreset);
    if (preset.accessories.doctorMask) {
      renderDoctorMask(triBuilder, lineBuilder, character.pos, character.yaw);
    }
    if (preset.accessories.doctorGloves) {
      renderDoctorGloves(triBuilder, lineBuilder, pose, character.yaw);
    }
    if (preset.accessories.policeHat) {
      renderPoliceHat(triBuilder, lineBuilder, character.pos, character.yaw);
    }
  }

  function renderDoctorMask(triBuilder, lineBuilder, root, yaw) {
    addBodyBox(triBuilder, lineBuilder, root, yaw, { x: -0.64, y: 4.72, z: 0.76 }, { x: 0.64, y: 5.42, z: 0.94 }, COLORS.mask, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, { x: -0.82, y: 5.02, z: 0.08 }, { x: -0.68, y: 5.14, z: 0.88 }, shade(COLORS.mask, 0.92), false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, { x: 0.68, y: 5.02, z: 0.08 }, { x: 0.82, y: 5.14, z: 0.88 }, shade(COLORS.mask, 0.92), false);
  }

  function renderDoctorGloves(triBuilder, lineBuilder, pose, yaw) {
    renderDoctorGlove(triBuilder, lineBuilder, pose.leftArmJoint, pose.leftArmRot, yaw);
    renderDoctorGlove(triBuilder, lineBuilder, pose.rightArmJoint, pose.rightArmRot, yaw);
  }

  function renderDoctorGlove(triBuilder, lineBuilder, armJoint, armRot, yaw) {
    const gloveCenter = transformJointLocal(armJoint, yaw, armRot, v3(0, -1.66, 0));
    appendOrientedBox(triBuilder, lineBuilder, gloveCenter, v3(1.06, 0.68, 1.06), v3(armRot, yaw, 0), COLORS.glove, OUTLINE, false);
  }

  function renderPoliceHat(triBuilder, lineBuilder, root, yaw) {
    addBodyBox(triBuilder, lineBuilder, root, yaw, { x: -1.12, y: 5.96, z: -0.88 }, { x: 1.12, y: 6.14, z: 0.88 }, COLORS.navy, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, { x: -0.74, y: 6.14, z: -0.54 }, { x: 0.74, y: 6.82, z: 0.56 }, COLORS.navy, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, { x: -0.7, y: 5.98, z: 0.58 }, { x: 0.7, y: 6.08, z: 1.08 }, COLORS.black, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, { x: -0.14, y: 6.26, z: 0.56 }, { x: 0.14, y: 6.52, z: 0.8 }, COLORS.badge, false);
  }

  function addForcefieldRings(lineBuilder, center, radius, color, segments = 18) {
    appendRingLines(lineBuilder, center, radius, 'xy', color, segments);
    appendRingLines(lineBuilder, center, radius, 'xz', color, segments);
    appendRingLines(lineBuilder, center, radius, 'yz', color, segments);
  }

  function createTriBuilder() {
    return {
      positions: [],
      normals: [],
      colors: []
    };
  }

  function createLineBuilder() {
    return {
      positions: [],
      colors: []
    };
  }

  function appendAxisAlignedBox(triBuilder, lineBuilder, center, size, color, options = {}) {
    appendOrientedBox(triBuilder, lineBuilder, center, size, v3(0, 0, 0), color, options.lineColor || OUTLINE, options.studs || false);
  }

  function appendOrientedBox(triBuilder, lineBuilder, center, size, rotation, color, lineColor, studsTop) {
    const half = vScale(size, 0.5);
    const corners = [
      transformBoxCorner(center, half, rotation, -1, -1, -1),
      transformBoxCorner(center, half, rotation, 1, -1, -1),
      transformBoxCorner(center, half, rotation, 1, 1, -1),
      transformBoxCorner(center, half, rotation, -1, 1, -1),
      transformBoxCorner(center, half, rotation, -1, -1, 1),
      transformBoxCorner(center, half, rotation, 1, -1, 1),
      transformBoxCorner(center, half, rotation, 1, 1, 1),
      transformBoxCorner(center, half, rotation, -1, 1, 1)
    ];

    const normalFront = rotateXYZ(v3(0, 0, 1), rotation);
    const normalBack = rotateXYZ(v3(0, 0, -1), rotation);
    const normalLeft = rotateXYZ(v3(-1, 0, 0), rotation);
    const normalRight = rotateXYZ(v3(1, 0, 0), rotation);
    const normalTop = rotateXYZ(v3(0, 1, 0), rotation);
    const normalBottom = rotateXYZ(v3(0, -1, 0), rotation);

    addQuad(triBuilder, corners[4], corners[5], corners[6], corners[7], normalFront, color);
    addQuad(triBuilder, corners[1], corners[0], corners[3], corners[2], normalBack, shade(color, 0.93));
    addQuad(triBuilder, corners[0], corners[4], corners[7], corners[3], normalLeft, shade(color, 0.88));
    addQuad(triBuilder, corners[5], corners[1], corners[2], corners[6], normalRight, shade(color, 0.88));
    addQuad(triBuilder, corners[3], corners[7], corners[6], corners[2], normalTop, shade(color, 1.05));
    addQuad(triBuilder, corners[0], corners[1], corners[5], corners[4], normalBottom, shade(color, 0.82));

    if (lineBuilder) {
      const edgePairs = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];
      for (const [a, b] of edgePairs) {
        addLine(lineBuilder, corners[a], corners[b], lineColor || OUTLINE);
      }
    }

    if (studsTop) {
      const studs = [];
      if (size.x >= 1.9 && size.z >= 1.9) {
        const spacing = size.x >= 10 || size.z >= 10 ? 4 : 2;
        const xCount = Math.max(1, Math.floor(size.x / spacing));
        const zCount = Math.max(1, Math.floor(size.z / spacing));
        for (let xi = 0; xi < xCount; xi += 1) {
          for (let zi = 0; zi < zCount; zi += 1) {
            const local = v3(
              -half.x + (xi + 0.5) * (size.x / xCount),
              half.y,
              -half.z + (zi + 0.5) * (size.z / zCount)
            );
            studs.push(transformPoint(center, local, rotation));
          }
        }
      }
      appendStudCaps(triBuilder, null, null, studs, color, rotation);
    }
  }

  function appendStudCaps(triBuilder, root, yaw, studCenters, baseColor, rotation = v3(0, yaw || 0, 0)) {
    const studColor = shade(baseColor, 1.08);
    for (const center of studCenters) {
      const worldCenter = root ? vAdd(root, rotateAroundY(center, yaw || 0)) : center;
      appendCylinder(triBuilder, worldCenter, 0.32, 0.26, studColor, rotation, 8);
    }
  }

  function appendCylinder(triBuilder, center, radius, height, color, rotation, segments = 8) {
    const halfHeight = height / 2;
    const topCenter = transformPoint(center, v3(0, halfHeight, 0), rotation);
    const bottomCenter = transformPoint(center, v3(0, -halfHeight, 0), rotation);
    for (let i = 0; i < segments; i += 1) {
      const a0 = (i / segments) * TAU;
      const a1 = ((i + 1) / segments) * TAU;
      const p0 = transformPoint(center, v3(Math.cos(a0) * radius, -halfHeight, Math.sin(a0) * radius), rotation);
      const p1 = transformPoint(center, v3(Math.cos(a1) * radius, -halfHeight, Math.sin(a1) * radius), rotation);
      const p2 = transformPoint(center, v3(Math.cos(a1) * radius, halfHeight, Math.sin(a1) * radius), rotation);
      const p3 = transformPoint(center, v3(Math.cos(a0) * radius, halfHeight, Math.sin(a0) * radius), rotation);
      const sideNormal = vNormalize(rotateXYZ(v3(Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)), rotation));
      addQuad(triBuilder, p0, p1, p2, p3, sideNormal, color);
      addTriangle(triBuilder, p3, p2, topCenter, rotateXYZ(v3(0, 1, 0), rotation), shade(color, 1.06));
      addTriangle(triBuilder, p1, p0, bottomCenter, rotateXYZ(v3(0, -1, 0), rotation), shade(color, 0.88));
    }
  }

  function appendSphere(triBuilder, center, radius, color, latBands, lonBands) {
    for (let lat = 0; lat < latBands; lat += 1) {
      const theta0 = (lat / latBands) * Math.PI;
      const theta1 = ((lat + 1) / latBands) * Math.PI;
      for (let lon = 0; lon < lonBands; lon += 1) {
        const phi0 = (lon / lonBands) * TAU;
        const phi1 = ((lon + 1) / lonBands) * TAU;
        const v00 = spherePoint(center, radius, theta0, phi0);
        const v10 = spherePoint(center, radius, theta1, phi0);
        const v11 = spherePoint(center, radius, theta1, phi1);
        const v01 = spherePoint(center, radius, theta0, phi1);
        addTriangle(triBuilder, v00, v10, v11, vNormalize(vSub(v00, center)), color);
        addTriangle(triBuilder, v00, v11, v01, vNormalize(vSub(v01, center)), shade(color, 1.04));
      }
    }
  }

  function spherePoint(center, radius, theta, phi) {
    return v3(
      center.x + Math.sin(theta) * Math.cos(phi) * radius,
      center.y + Math.cos(theta) * radius,
      center.z + Math.sin(theta) * Math.sin(phi) * radius
    );
  }

  function appendRingLines(lineBuilder, center, radius, plane, color, segments) {
    for (let i = 0; i < segments; i += 1) {
      const a0 = (i / segments) * TAU;
      const a1 = ((i + 1) / segments) * TAU;
      let p0;
      let p1;
      if (plane === 'xy') {
        p0 = v3(center.x + Math.cos(a0) * radius, center.y + Math.sin(a0) * radius, center.z);
        p1 = v3(center.x + Math.cos(a1) * radius, center.y + Math.sin(a1) * radius, center.z);
      } else if (plane === 'xz') {
        p0 = v3(center.x + Math.cos(a0) * radius, center.y, center.z + Math.sin(a0) * radius);
        p1 = v3(center.x + Math.cos(a1) * radius, center.y, center.z + Math.sin(a1) * radius);
      } else {
        p0 = v3(center.x, center.y + Math.cos(a0) * radius, center.z + Math.sin(a0) * radius);
        p1 = v3(center.x, center.y + Math.cos(a1) * radius, center.z + Math.sin(a1) * radius);
      }
      addLine(lineBuilder, p0, p1, color);
    }
  }

  function addTriangle(triBuilder, a, b, c, normal, color) {
    addVertex(triBuilder, a, normal, color);
    addVertex(triBuilder, b, normal, color);
    addVertex(triBuilder, c, normal, color);
  }

  function addQuad(triBuilder, a, b, c, d, normal, color) {
    addTriangle(triBuilder, a, b, c, normal, color);
    addTriangle(triBuilder, a, c, d, normal, color);
  }

  function addVertex(triBuilder, point, normal, color) {
    triBuilder.positions.push(point.x, point.y, point.z);
    triBuilder.normals.push(normal.x, normal.y, normal.z);
    triBuilder.colors.push(color.r, color.g, color.b, color.a);
  }

  function addLine(lineBuilder, a, b, color) {
    lineBuilder.positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    lineBuilder.colors.push(color.r, color.g, color.b, color.a, color.r, color.g, color.b, color.a);
  }

  function createPrograms(gl) {
    const triProgram = createProgram(gl, `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec4 aColor;
      uniform mat4 uViewProj;
      uniform vec3 uCameraPos;
      varying vec3 vNormal;
      varying vec4 vColor;
      varying float vDistance;
      void main() {
        gl_Position = uViewProj * vec4(aPosition, 1.0);
        vNormal = aNormal;
        vColor = aColor;
        vDistance = distance(aPosition, uCameraPos);
      }
    `, `
      precision mediump float;
      varying vec3 vNormal;
      varying vec4 vColor;
      varying float vDistance;
      uniform vec3 uLightDir;
      uniform vec3 uFogColor;
      uniform float uFogNear;
      uniform float uFogFar;
      void main() {
        float diffuse = max(dot(normalize(vNormal), normalize(uLightDir)), 0.0);
        float shade = 0.45 + diffuse * 0.55;
        vec3 lit = vColor.rgb * shade;
        float fog = clamp((vDistance - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
        gl_FragColor = vec4(mix(lit, uFogColor, fog), vColor.a);
      }
    `);

    const lineProgram = createProgram(gl, `
      attribute vec3 aPosition;
      attribute vec4 aColor;
      uniform mat4 uViewProj;
      uniform vec3 uCameraPos;
      varying vec4 vColor;
      varying float vDistance;
      void main() {
        gl_Position = uViewProj * vec4(aPosition, 1.0);
        vColor = aColor;
        vDistance = distance(aPosition, uCameraPos);
      }
    `, `
      precision mediump float;
      varying vec4 vColor;
      varying float vDistance;
      uniform vec3 uFogColor;
      uniform float uFogNear;
      uniform float uFogFar;
      void main() {
        float fog = clamp((vDistance - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
        gl_FragColor = vec4(mix(vColor.rgb, uFogColor, fog), vColor.a);
      }
    `);

    return {
      tri: {
        program: triProgram,
        attributes: {
          position: gl.getAttribLocation(triProgram, 'aPosition'),
          normal: gl.getAttribLocation(triProgram, 'aNormal'),
          color: gl.getAttribLocation(triProgram, 'aColor')
        },
        uniforms: {
          viewProj: gl.getUniformLocation(triProgram, 'uViewProj'),
          cameraPos: gl.getUniformLocation(triProgram, 'uCameraPos'),
          lightDir: gl.getUniformLocation(triProgram, 'uLightDir'),
          fogColor: gl.getUniformLocation(triProgram, 'uFogColor'),
          fogNear: gl.getUniformLocation(triProgram, 'uFogNear'),
          fogFar: gl.getUniformLocation(triProgram, 'uFogFar')
        }
      },
      line: {
        program: lineProgram,
        attributes: {
          position: gl.getAttribLocation(lineProgram, 'aPosition'),
          color: gl.getAttribLocation(lineProgram, 'aColor')
        },
        uniforms: {
          viewProj: gl.getUniformLocation(lineProgram, 'uViewProj'),
          cameraPos: gl.getUniformLocation(lineProgram, 'uCameraPos'),
          fogColor: gl.getUniformLocation(lineProgram, 'uFogColor'),
          fogNear: gl.getUniformLocation(lineProgram, 'uFogNear'),
          fogFar: gl.getUniformLocation(lineProgram, 'uFogFar')
        }
      }
    };
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'WebGL program link failed.');
    }
    return program;
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'WebGL shader compile failed.');
    }
    return shader;
  }

  function createGpuMesh(gl, kind, usage) {
    return {
      kind,
      usage,
      position: gl.createBuffer(),
      normal: kind === 'triangles' ? gl.createBuffer() : null,
      color: gl.createBuffer(),
      count: 0
    };
  }

  function uploadTriMesh(gl, mesh, builder) {
    mesh.count = builder.positions.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(builder.positions), mesh.usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normal);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(builder.normals), mesh.usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(builder.colors), mesh.usage);
  }

  function uploadLineMesh(gl, mesh, builder) {
    mesh.count = builder.positions.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(builder.positions), mesh.usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(builder.colors), mesh.usage);
  }

  function getCharacterAabb(character) {
    return {
      min: v3(character.pos.x - character.bounds.halfX, character.pos.y + character.bounds.bottom, character.pos.z - character.bounds.halfZ),
      max: v3(character.pos.x + character.bounds.halfX, character.pos.y + character.bounds.top, character.pos.z + character.bounds.halfZ)
    };
  }

  function aabbOverlap(a, b) {
    return a.min.x < b.max.x && a.max.x > b.min.x
      && a.min.y < b.max.y && a.max.y > b.min.y
      && a.min.z < b.max.z && a.max.z > b.min.z;
  }

  function sphereAabbCollision(center, radius, box) {
    const closest = v3(
      clamp(center.x, box.min.x, box.max.x),
      clamp(center.y, box.min.y, box.max.y),
      clamp(center.z, box.min.z, box.max.z)
    );
    const delta = vSub(center, closest);
    const distSq = vDot(delta, delta);
    if (distSq > radius * radius) {
      return null;
    }
    if (distSq > 0.000001) {
      const dist = Math.sqrt(distSq);
      return {
        normal: vScale(delta, 1 / dist),
        penetration: radius - dist
      };
    }
    const distances = [
      { value: Math.min(Math.abs(center.x - box.min.x), Math.abs(box.max.x - center.x)), normal: center.x > (box.min.x + box.max.x) * 0.5 ? v3(1, 0, 0) : v3(-1, 0, 0) },
      { value: Math.min(Math.abs(center.y - box.min.y), Math.abs(box.max.y - center.y)), normal: center.y > (box.min.y + box.max.y) * 0.5 ? v3(0, 1, 0) : v3(0, -1, 0) },
      { value: Math.min(Math.abs(center.z - box.min.z), Math.abs(box.max.z - center.z)), normal: center.z > (box.min.z + box.max.z) * 0.5 ? v3(0, 0, 1) : v3(0, 0, -1) }
    ].sort((a, b) => a.value - b.value);
    return { normal: distances[0].normal, penetration: radius };
  }

  function sphereIntersectsAabb(center, radius, box) {
    return sphereAabbCollision(center, radius, box) !== null;
  }

  function reflect(velocity, normal, bounce) {
    const dot = vDot(velocity, normal);
    const reflected = vSub(velocity, vScale(normal, 2 * dot));
    return vScale(reflected, bounce);
  }

  function segmentIntersectsAabb(start, end, box) {
    let tMin = 0;
    let tMax = 1;
    const delta = vSub(end, start);
    for (const axis of ['x', 'y', 'z']) {
      const d = delta[axis];
      if (Math.abs(d) < 0.000001) {
        if (start[axis] < box.min[axis] || start[axis] > box.max[axis]) {
          return null;
        }
      } else {
        const inv = 1 / d;
        let t1 = (box.min[axis] - start[axis]) * inv;
        let t2 = (box.max[axis] - start[axis]) * inv;
        if (t1 > t2) {
          const temp = t1;
          t1 = t2;
          t2 = temp;
        }
        tMin = Math.max(tMin, t1);
        tMax = Math.min(tMax, t2);
        if (tMin > tMax) {
          return null;
        }
      }
    }
    return tMin;
  }

  function expandAabb(box, amount) {
    return {
      min: v3(box.min.x - amount, box.min.y - amount, box.min.z - amount),
      max: v3(box.max.x + amount, box.max.y + amount, box.max.z + amount)
    };
  }

  function projectPoint(matrix, point) {
    const x = point.x;
    const y = point.y;
    const z = point.z;
    const clipX = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
    const clipY = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
    const clipZ = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
    const clipW = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
    if (clipW <= 0.0001) {
      return null;
    }
    return {
      x: clipX / clipW,
      y: clipY / clipW,
      z: clipZ / clipW,
      w: clipW
    };
  }

  function mat4Identity() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  function mat4Perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ]);
  }

  function mat4LookAt(eye, target, up) {
    const z = vNormalize(vSub(eye, target));
    const x = vNormalize(vCross(z, up));
    const y = vCross(x, z);
    return new Float32Array([
      x.x, y.x, z.x, 0,
      x.y, y.y, z.y, 0,
      x.z, y.z, z.z, 0,
      -vDot(x, eye), -vDot(y, eye), -vDot(z, eye), 1
    ]);
  }

  function mat4Multiply(a, b) {
    const out = new Float32Array(16);
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        out[col * 4 + row] =
          a[0 * 4 + row] * b[col * 4 + 0] +
          a[1 * 4 + row] * b[col * 4 + 1] +
          a[2 * 4 + row] * b[col * 4 + 2] +
          a[3 * 4 + row] * b[col * 4 + 3];
      }
    }
    return out;
  }

  function transformBoxCorner(center, half, rotation, sx, sy, sz) {
    const local = v3(half.x * sx, half.y * sy, half.z * sz);
    return transformPoint(center, local, rotation);
  }

  function transformPoint(center, local, rotation) {
    return vAdd(center, rotateXYZ(local, rotation));
  }

  function rotateXYZ(vector, rotation) {
    let point = vector;
    if (rotation.x) {
      point = rotateAroundX(point, rotation.x);
    }
    if (rotation.y) {
      point = rotateAroundY(point, rotation.y);
    }
    if (rotation.z) {
      point = rotateAroundZ(point, rotation.z);
    }
    return point;
  }

  function rotateAroundX(point, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return v3(point.x, point.y * c - point.z * s, point.y * s + point.z * c);
  }

  function rotateAroundY(point, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return v3(point.x * c + point.z * s, point.y, -point.x * s + point.z * c);
  }

  function rotateAroundZ(point, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return v3(point.x * c - point.y * s, point.x * s + point.y * c, point.z);
  }

  function transformJointLocal(jointWorld, yaw, rotX, local) {
    return vAdd(jointWorld, rotateAroundY(rotateAroundX(local, rotX), yaw));
  }

  function cameraRelativeWorld(inputVector, cameraYaw) {
    return cameraRelativeFromForward(inputVector, cameraViewForwardXZ(cameraYaw));
  }

  function cameraRelativeFromForward(inputVector, forward) {
    if (inputVector.x === 0 && inputVector.z === 0) {
      return v3();
    }
    const norm = vNormalizeXZ(inputVector);
    const normalizedForward = vNormalizeXZ(forward);
    const basisForward = Math.hypot(normalizedForward.x, normalizedForward.z) > 0.0001
      ? normalizedForward
      : v3(0, 0, 1);
    const right = v3(basisForward.z, 0, -basisForward.x);
    return vNormalizeXZ(vAdd(vScale(right, norm.x), vScale(basisForward, norm.z)));
  }

  function cameraViewForwardXZ(cameraYaw) {
    return v3(-Math.sin(cameraYaw), 0, Math.cos(cameraYaw));
  }

  function getAimDirectionFromView(yaw, pitch, firstPerson) {
    const aimPitch = pitch;
    return vNormalize(v3(
      -Math.sin(yaw) * Math.cos(aimPitch),
      -Math.sin(aimPitch),
      Math.cos(yaw) * Math.cos(aimPitch)
    ));
  }

  function yawForward(yaw) {
    return v3(Math.sin(yaw), 0, Math.cos(yaw));
  }

  function turnTowardsAngle(current, target, amount) {
    let delta = ((target - current + Math.PI) % TAU) - Math.PI;
    if (delta < -Math.PI) {
      delta += TAU;
    }
    return current + clamp(delta, -amount, amount);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function approach(current, target, amount) {
    if (current < target) {
      return Math.min(current + amount, target);
    }
    return Math.max(current - amount, target);
  }

  function shade(color, factor, alpha = color.a) {
    return {
      r: clamp(color.r * factor, 0, 1),
      g: clamp(color.g * factor, 0, 1),
      b: clamp(color.b * factor, 0, 1),
      a: alpha
    };
  }

  function rgba(r, g, b, a) {
    return { r: r / 255, g: g / 255, b: b / 255, a };
  }

  function v3(x = 0, y = 0, z = 0) {
    return { x, y, z };
  }

  function vCopy(vector) {
    return v3(vector.x, vector.y, vector.z);
  }

  function vAdd(a, b) {
    return v3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  function vSub(a, b) {
    return v3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  function vScale(vector, scalar) {
    return v3(vector.x * scalar, vector.y * scalar, vector.z * scalar);
  }

  function vDot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function vCross(a, b) {
    return v3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }

  function vLength(vector) {
    return Math.hypot(vector.x, vector.y, vector.z);
  }

  function vNormalize(vector) {
    const length = vLength(vector);
    if (length < 0.000001) {
      return v3();
    }
    return vScale(vector, 1 / length);
  }

  function vNormalizeXZ(vector) {
    const length = Math.hypot(vector.x, vector.z);
    if (length < 0.000001) {
      return v3();
    }
    return v3(vector.x / length, 0, vector.z / length);
  }

  function vLerp(a, b, t) {
    return v3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
  }

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function roundNetworkFloat(value) {
    return Math.round(value * 1000) / 1000;
  }

  function sanitizeName(value) {
    const trimmed = String(value || '').replace(/[^a-zA-Z0-9 _\-\.]/g, '').trim();
    return trimmed.slice(0, 18) || 'Player';
  }

  function makeNeutralInput() {
    return {
      left: false,
      right: false,
      forward: false,
      back: false,
      jump: false,
      cameraYaw: 0,
      cameraPitch: 0,
      firstPerson: false,
      selectedTool: 0,
      useNonce: 0,
      resetNonce: 0
    };
  }

  function normalizeAvatarPresetKey(value) {
    return Object.prototype.hasOwnProperty.call(AVATAR_PRESETS, value) ? value : DEFAULT_AVATAR_PRESET;
  }

  function getAvatarPreset(value) {
    return AVATAR_PRESETS[normalizeAvatarPresetKey(value)];
  }

  function pickPlayerColors() {
    return cloneBodyColors(getAvatarPreset(DEFAULT_AVATAR_PRESET).bodyColors);
  }

  function cloneBodyColors(colors) {
    return {
      head: { ...colors.head },
      torso: { ...colors.torso },
      arms: { ...colors.arms },
      legs: { ...colors.legs }
    };
  }

  function plainBodyColors(colors) {
    return cloneBodyColors(colors);
  }

  function serializeCharacter(character) {
    return {
      id: character.id,
      name: character.name,
      avatarPreset: normalizeAvatarPresetKey(character.avatarPreset),
      bodyColors: plainBodyColors(character.bodyColors),
      spawn: vCopy(character.spawn),
      pos: vCopy(character.pos),
      vel: vCopy(character.vel),
      yaw: roundNetworkFloat(character.yaw),
      health: Math.round(character.health * 100) / 100,
      maxHealth: character.maxHealth,
      dead: Boolean(character.dead),
      forcefield: Math.round(character.forcefield * 100) / 100,
      ko: character.ko,
      wo: character.wo,
      selectedTool: character.selectedTool,
      walkCycle: roundNetworkFloat(character.walkCycle),
      climbing: Boolean(character.climbing),
      swingTime: Math.round(character.swing.time * 1000) / 1000
    };
  }

  function serializeProjectile(projectile) {
    return {
      id: projectile.id,
      type: projectile.type,
      ownerId: projectile.ownerId,
      pos: vCopy(projectile.pos),
      vel: vCopy(projectile.vel),
      radius: projectile.radius,
      gravity: projectile.gravity,
      bounce: projectile.bounce,
      life: projectile.life,
      damage: projectile.damage,
      color: { ...projectile.color }
    };
  }

  function serializeCorpse(corpse) {
    return {
      owner: corpse.owner,
      timer: corpse.timer,
      parts: corpse.parts.map((part) => ({
        name: part.name,
        pos: vCopy(part.pos),
        size: vCopy(part.size),
        color: { ...part.color },
        vel: vCopy(part.vel),
        rot: vCopy(part.rot),
        spin: vCopy(part.spin)
      }))
    };
  }

  function deserializeProjectile(data) {
    return {
      id: data.id,
      type: data.type,
      ownerId: data.ownerId,
      pos: vCopy(data.pos),
      vel: vCopy(data.vel),
      radius: data.radius,
      gravity: data.gravity,
      bounce: data.bounce,
      life: data.life,
      damage: data.damage,
      color: { ...data.color },
      recentHits: new Map()
    };
  }

  function deserializeCorpse(data) {
    return {
      owner: data.owner,
      timer: data.timer,
      parts: data.parts.map((part) => ({
        name: part.name,
        pos: vCopy(part.pos),
        size: vCopy(part.size),
        color: { ...part.color },
        vel: vCopy(part.vel),
        rot: vCopy(part.rot),
        spin: vCopy(part.spin)
      }))
    };
  }

  function makeId(length = 8) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    const values = crypto.getRandomValues(new Uint8Array(length));
    for (let i = 0; i < length; i += 1) {
      out += alphabet[values[i] % alphabet.length];
    }
    return out;
  }

  async function copyTextToClipboard(text) {
    if (!text) {
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // fall through
      }
    }
    const scratch = document.createElement('textarea');
    scratch.value = text;
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.appendChild(scratch);
    scratch.select();
    document.execCommand('copy');
    scratch.remove();
  }

  function encodeSignal(payload) {
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    let binary = '';
    for (const value of bytes) {
      binary += String.fromCharCode(value);
    }
    return btoa(binary);
  }

  function decodeSignal(text) {
    const trimmed = String(text || '').trim();
    if (!trimmed) {
      throw new Error('No code was provided.');
    }

    try {
      const binary = atob(trimmed);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return JSON.parse(trimmed);
    }
  }

  function waitForIceGatheringComplete(pc) {
    return new Promise((resolve) => {
      if (pc.iceGatheringState === 'complete') {
        resolve();
        return;
      }

      const done = () => {
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', done);
          resolve();
        }
      };

      pc.addEventListener('icegatheringstatechange', done);
      window.setTimeout(() => {
        pc.removeEventListener('icegatheringstatechange', done);
        resolve();
      }, 8000);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
})();
