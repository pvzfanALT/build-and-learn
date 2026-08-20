(() => {
  'use strict';

  const dom = {
    canvas: document.getElementById('game-canvas'),
    labelLayer: document.getElementById('label-layer'),
    damageOverlay: document.getElementById('damage-overlay'),
    crosshair: document.getElementById('crosshair'),
    shiftlockToggle: document.getElementById('shiftlock-toggle'),
    hud: document.getElementById('hud'),
    loadingScreen: document.getElementById('loading-screen'),
    loadingSubtitle: document.getElementById('loading-subtitle'),
    loadingFill: document.getElementById('loading-fill'),
    loadingSteps: Array.from(document.querySelectorAll('#loading-steps li')),
    bootActions: document.getElementById('boot-actions'),
    playerNameInput: document.getElementById('player-name-input'),
    avatarPresetButtons: Array.from(document.querySelectorAll('[data-avatar-preset]')),
    avatarPresetDescription: document.getElementById('avatar-preset-description'),
    customAvatarPanel: document.getElementById('custom-avatar-panel'),
    customAvatarSlots: document.getElementById('custom-avatar-slots'),
    debugEnableButton: document.getElementById('debug-enable-button'),
    studioButton: document.getElementById('studio-button'),
    studioScreen: document.getElementById('studio-screen'),
    gameCards: Array.from(document.querySelectorAll('[data-game]')),
    debugMenuButton: document.getElementById('debug-menu-button'),
    debugWindow: document.getElementById('debug-window'),
    debugEnemySelect: document.getElementById('debug-enemy-select'),
    debugSpawnButton: document.getElementById('debug-spawn-button'),
    debugAllWeaponsButton: document.getElementById('debug-all-weapons-button'),
    debugClearEnemiesButton: document.getElementById('debug-clear-enemies-button'),
    debugNoWavesToggle: document.getElementById('debug-no-waves-toggle'),
    debugFreezeToggle: document.getElementById('debug-freeze-toggle'),
    debugInfiniteHpToggle: document.getElementById('debug-infinite-hp-toggle'),
    debugFlyToggle: document.getElementById('debug-fly-toggle'),
    closeDebugButton: document.getElementById('close-debug-button'),
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
    menuTitle: document.querySelector('#menu-window .window-title'),
    backpackWindow: document.getElementById('backpack-window'),
    backpackTitle: document.querySelector('#backpack-window .window-title'),
    backpackCopy: document.querySelector('#backpack-window .backpack-copy'),
    backpackList: document.querySelector('#backpack-window .backpack-list'),
    networkWindow: document.getElementById('network-window'),
    closeNetworkButton: document.getElementById('close-network-button'),
    chatPanel: document.getElementById('chat-panel'),
    chatLog: document.getElementById('chat-log'),
    chatEntry: document.getElementById('chat-entry'),
    chatInput: document.getElementById('chat-input'),
    scorePanel: document.getElementById('score-panel'),
    scoreHeading: document.querySelector('#score-panel .panel-heading'),
    scoreHeaders: Array.from(document.querySelectorAll('#score-table th')),
    scoreBody: document.querySelector('#score-table tbody'),
    healthPanel: document.getElementById('health-panel'),
    healthFill: document.getElementById('health-fill'),
    healthText: document.getElementById('health-text'),
    hotbar: document.getElementById('hotbar'),
    zombieClassPanel: document.getElementById('zombie-class-panel'),
    zombieClassGrid: document.getElementById('zombie-class-grid'),
    zombieClassCooldown: document.getElementById('zombie-class-cooldown'),
    victoryBanner: document.getElementById('victory-banner'),
    weaponSelectWindow: document.getElementById('weapon-select-window'),
    weaponSelectGrid: document.getElementById('weapon-select-grid'),
    weaponSelectConfirm: document.getElementById('weapon-select-confirm'),
    weaponSelectTimer: document.getElementById('wsw-timer'),
    weaponSelectCount: document.getElementById('wsw-count'),
    cameraButtons: Array.from(document.querySelectorAll('[data-camera]')),
    toolDescription: document.getElementById('tool-description'),
    hintBar: document.getElementById('hint-bar'),
    placeName: document.getElementById('place-name'),
    serverName: document.getElementById('server-name'),
    networkRoleLine: document.getElementById('network-role-line'),
    networkStatus: document.getElementById('network-status'),
    hostControls: document.getElementById('host-controls'),
    joinControls: document.getElementById('join-controls'),
    connectedPlayers: document.getElementById('connected-players'),
    brokerSelect: document.getElementById('broker-select'),
    refreshServersButton: document.getElementById('refresh-servers-button'),
    serverList: document.getElementById('server-list')
  };

  const TAU = Math.PI * 2;
  const OUTLINE = rgba(18, 18, 18, 1);
  const COLORS = {
    grass: rgba(58, 82, 54, 1),
    grassDark: rgba(44, 64, 42, 1),
    dirt: rgba(92, 76, 56, 1),
    dirtDark: rgba(70, 58, 42, 1),
    wallStone: rgba(96, 98, 108, 1),
    wallStoneDark: rgba(64, 66, 76, 1),
    woodPlank: rgba(96, 68, 40, 1),
    woodPlankDark: rgba(72, 50, 30, 1),
    lampPost: rgba(40, 42, 50, 1),
    lampGlow: rgba(255, 226, 140, 1),
    moon: rgba(245, 248, 255, 1),
    moonGlow: rgba(188, 202, 232, 1),
    concrete: rgba(148, 148, 154, 1),
    concreteDark: rgba(108, 108, 116, 1),
    asphalt: rgba(72, 78, 88, 1),
    asphaltDark: rgba(46, 52, 60, 1),
    white: rgba(244, 244, 244, 1),
    roof: rgba(198, 40, 28, 1),
    brown: rgba(110, 74, 42, 1),
    darkBrown: rgba(82, 55, 31, 1),
    blue: rgba(13, 105, 172, 1),
    yellow: rgba(245, 205, 48, 1),
    green: rgba(75, 151, 75, 1),
    orange: rgba(218, 133, 65, 1),
    black: rgba(16, 16, 16, 1),
    water: rgba(88, 161, 255, 0.55),
    glass: rgba(166, 231, 255, 0.45),
    spawn: rgba(168, 255, 255, 0.62),
    swordSteel: rgba(212, 212, 212, 1),
    swordHilt: rgba(152, 111, 52, 1),
    pellet: rgba(94, 157, 255, 1),
    zombieEye: rgba(210, 255, 90, 1),
    rivalSkin: rgba(232, 205, 150, 1),
    forcefield: rgba(114, 244, 255, 0.78),
    navy: rgba(34, 56, 121, 1),
    mask: rgba(126, 200, 189, 1),
    maskLight: rgba(158, 222, 212, 1),
    maskStrap: rgba(236, 242, 246, 1),
    maskClip: rgba(168, 178, 192, 1),
    glove: rgba(246, 246, 246, 1),
    gloveMed: rgba(96, 178, 226, 1),
    gloveShine: rgba(148, 214, 246, 1),
    gloveCuff: rgba(62, 132, 182, 1),
    blood: rgba(148, 28, 26, 1),
    bloodBright: rgba(202, 44, 34, 1),
    bone: rgba(230, 226, 208, 1),
    pumpkinDark: rgba(170, 94, 36, 1),
    tongue: rgba(222, 108, 128, 1),
    badge: rgba(250, 214, 74, 1),
    brass: rgba(225, 178, 56, 1),
    steel: rgba(194, 198, 208, 1),
    ice: rgba(144, 232, 255, 1),
    iceDark: rgba(88, 174, 214, 1),
    goo: rgba(106, 220, 74, 1),
    gooDark: rgba(58, 136, 43, 0.92),
    toxic: rgba(166, 78, 218, 1),
    toxicDark: rgba(118, 44, 160, 0.9),
    sandvichBread: rgba(195, 145, 76, 1),
    sandvichMeat: rgba(146, 68, 52, 1),
    canRed: rgba(220, 48, 48, 1),
    heal: rgba(120, 255, 150, 1),
    sentry: rgba(196, 124, 48, 1),
    sentryDark: rgba(124, 74, 28, 1),
    zombieSkin: rgba(88, 182, 84, 1),
    zombieSkinDark: rgba(58, 126, 56, 1),
    zombieRag: rgba(86, 76, 92, 1),
    zombieBlue: rgba(58, 86, 132, 1),
    zombieHazmat: rgba(224, 205, 66, 1),
    medicRed: rgba(196, 44, 44, 1),
    poisonCloud: rgba(136, 78, 180, 0.82),
    muzzle: rgba(255, 240, 155, 1),
    warning: rgba(255, 134, 92, 1),
    aimLine: rgba(120, 236, 255, 0.85),
    aimDot: rgba(255, 96, 96, 1),
    partyHat: rgba(236, 72, 132, 1),
    partyStripe: rgba(255, 224, 92, 1),
    glasses: rgba(28, 28, 34, 1),
    suit: rgba(46, 48, 58, 1),
    suitShirt: rgba(238, 238, 244, 1),
    suitTie: rgba(196, 40, 40, 1)
  };

  const STORAGE_KEYS = {
    playerName: 'build-and-learn-name',
    avatarPreset: 'build-and-learn-avatar-preset',
    shiftLock: 'build-and-learn-shiftlock',
    customAvatar: 'build-and-learn-custom-avatar'
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
    },
    custom: {
      key: 'custom',
      label: 'Custom',
      description: 'Custom: build your own look — mix hats, glasses, masks, gloves and outfits.',
      bodyColors: {
        head: COLORS.yellow,
        torso: COLORS.blue,
        arms: COLORS.yellow,
        legs: COLORS.green
      },
      accessories: {}
    }
  };

  // Roblox-style accessory catalog — one item per slot.
  const AVATAR_ACCESSORIES = {
    hat: [
      { id: 'none', name: 'None' },
      { id: 'police', name: 'Police Hat' },
      { id: 'party', name: 'Party Hat ★' }
    ],
    glasses: [
      { id: 'none', name: 'None' },
      { id: 'glasses', name: 'Glasses ★' }
    ],
    mask: [
      { id: 'none', name: 'None' },
      { id: 'doctor', name: 'Doctor Mask' }
    ],
    gloves: [
      { id: 'none', name: 'None' },
      { id: 'doctor', name: 'Doctor Gloves' }
    ],
    shirt: [
      { id: 'blue', name: 'Blue Tee', torso: COLORS.blue, arms: COLORS.yellow },
      { id: 'white', name: 'Doctor Coat', torso: COLORS.white, arms: rgba(232, 232, 232, 1) },
      { id: 'navy', name: 'Police Blue', torso: COLORS.navy, arms: COLORS.navy },
      { id: 'suit', name: 'Fancy Suit ★', torso: COLORS.suit, arms: COLORS.suit }
    ],
    pants: [
      { id: 'green', name: 'Green', legs: COLORS.green },
      { id: 'policeblue', name: 'Police Blue', legs: rgba(42, 48, 84, 1) },
      { id: 'grey', name: 'Grey', legs: COLORS.concreteDark },
      { id: 'black', name: 'Black', legs: COLORS.black }
    ]
  };

  const customAvatar = {
    hat: 'none',
    glasses: 'none',
    mask: 'none',
    gloves: 'none',
    shirt: 'blue',
    pants: 'green'
  };

  function buildCustomAvatarPreset() {
    const shirt = AVATAR_ACCESSORIES.shirt.find((s) => s.id === customAvatar.shirt) || AVATAR_ACCESSORIES.shirt[0];
    const pants = AVATAR_ACCESSORIES.pants.find((p) => p.id === customAvatar.pants) || AVATAR_ACCESSORIES.pants[0];
    return {
      key: 'custom',
      label: 'Custom',
      description: 'Your custom avatar.',
      bodyColors: {
        head: COLORS.yellow,
        torso: shirt.torso,
        arms: shirt.arms,
        legs: pants.legs
      },
      accessories: {
        doctorMask: customAvatar.mask === 'doctor',
        doctorGloves: customAvatar.gloves === 'doctor',
        policeHat: customAvatar.hat === 'police',
        partyHat: customAvatar.hat === 'party',
        glasses: customAvatar.glasses === 'glasses',
        suit: customAvatar.shirt === 'suit'
      }
    };
  }

  const STARTER_WEAPON_KEY = 'pistol';
  const AUTO_RESTART_DELAY = 5;
  const SPAWN_PROTECTION = 3.5;
  const BASE_WEAPON_LANES = [
    ['bat', 'sword'],
    ['revolver', 'rifle'],
    ['goo-blaster', 'ice-blaster'],
    ['regular-blaster', 'minigun'],
    ['stickybomb-launcher', 'sentry-builder']
  ];
  const VIP_WEAPON_KEYS = ['super-shotgun', 'stun-stick', 'sandvich', 'cola', 'wrench'];
  const WEAPON_UI_ORDER = [
    'pistol',
    'bat',
    'revolver',
    'goo-blaster',
    'regular-blaster',
    'sword',
    'rifle',
    'ice-blaster',
    'stickybomb-launcher',
    'minigun',
    'sentry-builder',
    'super-shotgun',
    'stun-stick',
    'sandvich',
    'cola',
    'wrench'
  ];

  const WEAPON_DEFS = {
    pistol: {
      key: 'pistol',
      name: 'Pistol',
      uiTag: 'PI',
      description: 'Reliable starter sidearm with solid accuracy and steady fire.',
      useHint: 'Hold or click to fire quick accurate shots.',
      category: 'starter',
      kind: 'bullet',
      cooldown: 0.22,
      damage: 12,
      speed: 90,
      gravity: 0,
      radius: 0.12,
      life: 2.2,
      spread: 0.02,
      pellets: 1,
      knockback: 2.2,
      color: COLORS.brass,
      sound: 'pistol'
    },
    revolver: {
      key: 'revolver',
      name: 'Revolver',
      uiTag: 'RV',
      description: 'Hard-hitting precision sidearm for chunking tougher zombies.',
      useHint: 'Time your shots for heavy single-target damage.',
      category: 'base',
      kind: 'bullet',
      cooldown: 0.44,
      damage: 28,
      speed: 98,
      gravity: 0,
      radius: 0.13,
      life: 2.6,
      spread: 0.012,
      pellets: 1,
      knockback: 3.8,
      color: COLORS.orange,
      sound: 'revolver'
    },
    rifle: {
      key: 'rifle',
      name: 'Rifle',
      uiTag: 'RF',
      description: 'Accurate long gun that punches straight through clustered targets.',
      useHint: 'Clean up lanes with accurate piercing shots.',
      category: 'base',
      kind: 'bullet',
      cooldown: 0.33,
      damage: 32,
      speed: 112,
      gravity: 0,
      radius: 0.11,
      life: 2.8,
      spread: 0.008,
      pellets: 1,
      knockback: 4.4,
      color: COLORS.white,
      pierce: 1,
      sound: 'rifle'
    },
    'regular-blaster': {
      key: 'regular-blaster',
      name: 'Regular Blaster',
      uiTag: 'RB',
      description: 'Mid-range blaster with dependable damage and fast projectile travel.',
      useHint: 'Great all-rounder once the waves start mixing enemy types.',
      category: 'base',
      kind: 'bullet',
      cooldown: 0.16,
      damage: 18,
      speed: 64,
      gravity: 0,
      radius: 0.18,
      life: 2.8,
      spread: 0.028,
      pellets: 1,
      knockback: 3,
      color: COLORS.blue,
      sound: 'blaster'
    },
    sword: {
      key: 'sword',
      name: 'Sword',
      uiTag: 'SW',
      description: 'Wide melee cleave with big knockback and strong burst damage.',
      useHint: 'Step in close and sweep multiple zombies at once.',
      category: 'base',
      kind: 'melee',
      cooldown: 0.55,
      swingTime: 0.32,
      damage: 44,
      range: 4.9,
      arcCos: 0.2,
      knockback: 14,
      sound: 'swing'
    },
    'goo-blaster': {
      key: 'goo-blaster',
      name: 'Goo Blaster',
      uiTag: 'GOO',
      description: 'Lobs sticky slowing goo that clumps the horde into easy targets.',
      useHint: 'Splash lanes and choke points to slow big pushes.',
      category: 'base',
      kind: 'lob',
      cooldown: 0.72,
      damage: 10,
      speed: 28,
      gravity: 24,
      radius: 0.28,
      life: 4.4,
      spread: 0.018,
      pellets: 1,
      knockback: 2,
      splashRadius: 3.2,
      color: COLORS.goo,
      hazard: {
        type: 'goo-puddle',
        radius: 3.4,
        life: 5.4,
        dps: 2.2,
        slowFactor: 0.52,
        slowTime: 0.32,
        affect: 'zombie',
        color: COLORS.gooDark
      },
      sound: 'goo'
    },
    'ice-blaster': {
      key: 'ice-blaster',
      name: 'Ice Blaster',
      uiTag: 'ICE',
      description: 'Freezing shots slow zombies immediately and can lock them in place.',
      useHint: 'Use it to freeze specials and peel fast zombies off the team.',
      category: 'base',
      kind: 'bullet',
      cooldown: 0.34,
      damage: 12,
      speed: 58,
      gravity: 0,
      radius: 0.2,
      life: 3,
      spread: 0.026,
      pellets: 1,
      knockback: 2.2,
      color: COLORS.ice,
      slowFactor: 0.58,
      slowTime: 2.6,
      freeze: 0.55,
      sound: 'ice'
    },
    minigun: {
      key: 'minigun',
      name: 'Minigun',
      uiTag: 'MINI',
      description: 'Rapid bullet hose with incredible sustained DPS once you commit to firing.',
      useHint: 'Hold the trigger in first person and mow down grouped zombies.',
      category: 'base',
      kind: 'bullet',
      cooldown: 0.08,
      damage: 8,
      speed: 88,
      gravity: 0,
      radius: 0.12,
      life: 2.2,
      spread: 0.05,
      pellets: 1,
      knockback: 1.5,
      color: COLORS.brass,
      sound: 'minigun'
    },
    'sentry-builder': {
      key: 'sentry-builder',
      name: 'Sentry Builder',
      uiTag: 'SG',
      description: 'Drops one automatic sentry. Building another replaces your previous one.',
      useHint: 'Place it near cover so it can thin out waves while you rotate.',
      category: 'base',
      kind: 'build-sentry',
      cooldown: 1.2,
      sound: 'deploy'
    },
    bat: {
      key: 'bat',
      name: 'Bat',
      uiTag: 'BAT',
      description: 'Fast melee panic option with strong knockback against lighter zombies.',
      useHint: 'Swat fast targets away when they break through.',
      category: 'base',
      kind: 'melee',
      cooldown: 0.28,
      swingTime: 0.22,
      damage: 20,
      range: 4.2,
      arcCos: 0.25,
      knockback: 12,
      stun: 0.18,
      sound: 'swing'
    },
    'stickybomb-launcher': {
      key: 'stickybomb-launcher',
      name: 'Stickybomb Launcher',
      uiTag: 'STK',
      description: 'Arcing bombs stick to surfaces and detonate when the horde reaches them.',
      useHint: 'Seed corners and lanes before the next rush arrives.',
      category: 'base',
      kind: 'sticky',
      cooldown: 0.92,
      damage: 62,
      speed: 26,
      gravity: 22,
      radius: 0.34,
      life: 5.6,
      spread: 0.016,
      pellets: 1,
      knockback: 10,
      splashRadius: 5.4,
      color: COLORS.toxic,
      fuse: 2.6,
      armDelay: 0.45,
      sound: 'sticky'
    },
    'super-shotgun': {
      key: 'super-shotgun',
      name: 'Super Shotgun',
      uiTag: 'SS',
      description: 'Devastating close-range blast that erases anything too near the team.',
      useHint: 'Get close and unload huge burst damage.',
      category: 'vip',
      kind: 'shotgun',
      cooldown: 0.88,
      damage: 11,
      speed: 82,
      gravity: 0,
      radius: 0.13,
      life: 1.25,
      spread: 0.18,
      pellets: 10,
      knockback: 5.2,
      color: COLORS.steel,
      vipCost: 50,
      sound: 'shotgun'
    },
    'stun-stick': {
      key: 'stun-stick',
      name: 'Stun Stick',
      uiTag: 'STN',
      description: 'Fast electric baton that briefly stuns specials and crushes armor.',
      useHint: 'Perfect for locking down tanks, medics, and armored targets.',
      category: 'vip',
      kind: 'melee',
      cooldown: 0.25,
      swingTime: 0.18,
      damage: 24,
      range: 4.3,
      arcCos: 0.22,
      knockback: 10,
      stun: 0.9,
      bonusVsArmor: 1.7,
      sound: 'stun'
    },
    sandvich: {
      key: 'sandvich',
      name: 'Sandvich',
      uiTag: 'SAN',
      description: 'Slow but powerful heal item that saves a damaged run.',
      useHint: 'Use it between pushes to restore a big chunk of health.',
      category: 'vip',
      kind: 'heal',
      cooldown: 16,
      heal: 55,
      vipCost: 20,
      sound: 'heal'
    },
    cola: {
      key: 'cola',
      name: 'Cola',
      uiTag: 'COLA',
      description: 'Temporary speed and fire-rate boost for panic moments and clutch revenges.',
      useHint: 'Pop it before a heavy wave or while kiting fast zombies.',
      category: 'vip',
      kind: 'buff',
      cooldown: 18,
      buffTime: 8,
      vipCost: 15,
      sound: 'buff'
    },
    wrench: {
      key: 'wrench',
      name: 'Wrench',
      uiTag: 'WR',
      description: 'Repairs sentries and smashes armor better than a normal melee weapon.',
      useHint: 'Keep your sentry alive or crack armored zombies in close quarters.',
      category: 'vip',
      kind: 'melee-repair',
      cooldown: 0.3,
      swingTime: 0.2,
      damage: 19,
      range: 4.2,
      arcCos: 0.22,
      knockback: 6,
      repair: 36,
      bonusVsArmor: 1.45,
      vipCost: 35,
      sound: 'wrench'
    }
  };

  const ZOMBIE_DEFS = {
    'fast-zombie': {
      key: 'fast-zombie',
      name: 'Fast Zombie',
      cost: 1,
      intro: 1,
      weight: 5,
      health: 36,
      walkSpeed: 17,
      meleeDamage: 10,
      meleeRange: 3.1,
      meleeArcCos: 0.15,
      attackCooldown: 0.75,
      renderScale: 0.92,
      clothing: { torso: COLORS.zombieRag, legs: COLORS.black }
    },
    'crawling-zombie': {
      key: 'crawling-zombie',
      name: 'Crawling Zombie',
      cost: 1,
      intro: 2,
      weight: 3,
      health: 28,
      walkSpeed: 13,
      meleeDamage: 8,
      meleeRange: 2.7,
      meleeArcCos: 0.12,
      attackCooldown: 0.68,
      renderScale: 0.72,
      bounds: { halfX: 0.9, halfZ: 0.9, bottom: 0, top: 3.9 },
      clothing: { torso: COLORS.dirtDark, legs: COLORS.dirt }
    },
    'poison-zombie': {
      key: 'poison-zombie',
      name: 'Poison Zombie',
      cost: 2,
      intro: 2,
      weight: 2,
      health: 55,
      walkSpeed: 10.8,
      meleeDamage: 10,
      meleeRange: 3.2,
      meleeArcCos: 0.12,
      attackCooldown: 1,
      specialCooldown: 2.3,
      spitRange: 18,
      poisonDps: 5,
      poisonTime: 4.6,
      clothing: { torso: COLORS.toxicDark, legs: COLORS.black }
    },
    'police-zombie': {
      key: 'police-zombie',
      name: 'Police Zombie',
      cost: 2,
      intro: 3,
      weight: 2,
      health: 82,
      walkSpeed: 11.4,
      meleeDamage: 14,
      meleeRange: 3.3,
      meleeArcCos: 0.12,
      attackCooldown: 0.95,
      auraCooldown: 5,
      auraRange: 10,
      auraTime: 2.8,
      auraFactor: 1.28,
      clothing: { torso: COLORS.navy, legs: COLORS.black }
    },
    'shield-zombie': {
      key: 'shield-zombie',
      name: 'Shield Zombie',
      cost: 3,
      intro: 4,
      weight: 2,
      health: 110,
      walkSpeed: 8.3,
      meleeDamage: 13,
      meleeRange: 3.4,
      meleeArcCos: 0.15,
      attackCooldown: 1.2,
      frontReduction: 0.82,
      clothing: { torso: COLORS.concreteDark, legs: COLORS.black }
    },
    'hazmat-zombie': {
      key: 'hazmat-zombie',
      name: 'Hazmat Zombie',
      cost: 2,
      intro: 5,
      weight: 2,
      health: 70,
      walkSpeed: 9.5,
      meleeDamage: 11,
      meleeRange: 3.2,
      meleeArcCos: 0.12,
      attackCooldown: 1.05,
      immuneGoo: true,
      immunePoison: true,
      immuneIceSlow: true,
      deathCloud: true,
      clothing: { torso: COLORS.zombieHazmat, legs: COLORS.asphaltDark }
    },
    'box-armor-zombie': {
      key: 'box-armor-zombie',
      name: 'Box Armor Zombie',
      cost: 3,
      intro: 6,
      weight: 2,
      health: 92,
      armor: 55,
      walkSpeed: 8.2,
      meleeDamage: 14,
      meleeRange: 3.4,
      meleeArcCos: 0.13,
      attackCooldown: 1.12,
      armorBurstFactor: 1.22,
      clothing: { torso: COLORS.brown, legs: COLORS.darkBrown }
    },
    'medic-zombie': {
      key: 'medic-zombie',
      name: 'Medic Zombie',
      cost: 4,
      intro: 7,
      weight: 1,
      health: 64,
      walkSpeed: 9.4,
      meleeDamage: 8,
      meleeRange: 3.1,
      meleeArcCos: 0.12,
      attackCooldown: 1.12,
      specialCooldown: 3.4,
      healRange: 16,
      healAmount: 22,
      clothing: { torso: COLORS.white, legs: COLORS.medicRed }
    },
    'blaster-soldier-zombie': {
      key: 'blaster-soldier-zombie',
      name: 'Blaster Soldier Zombie',
      cost: 4,
      intro: 8,
      weight: 1,
      health: 94,
      walkSpeed: 8.8,
      meleeDamage: 10,
      meleeRange: 3.2,
      meleeArcCos: 0.12,
      attackCooldown: 1.15,
      specialCooldown: 1.65,
      shootRange: 20,
      clothing: { torso: COLORS.zombieBlue, legs: COLORS.asphaltDark }
    },
    'cloak-zombie': {
      key: 'cloak-zombie',
      name: 'Cloak Zombie',
      cost: 4,
      intro: 9,
      weight: 1,
      health: 72,
      walkSpeed: 12,
      meleeDamage: 12,
      meleeRange: 3.2,
      meleeArcCos: 0.12,
      attackCooldown: 0.92,
      cloaked: true,
      clothing: { torso: COLORS.black, legs: COLORS.asphaltDark }
    },
    'tank-zombie': {
      key: 'tank-zombie',
      name: 'Tank Zombie',
      cost: 8,
      intro: 10,
      weight: 0.5,
      health: 280,
      walkSpeed: 6.4,
      meleeDamage: 24,
      meleeRange: 3.8,
      meleeArcCos: 0.08,
      attackCooldown: 1.8,
      slamRadius: 4.3,
      renderScale: 1.28,
      bounds: { halfX: 1.42, halfZ: 1.42, bottom: 0, top: 7.3 },
      clothing: { torso: COLORS.concreteDark, legs: COLORS.concrete }
    },
    rival: {
      key: 'rival',
      name: 'Rival',
      cost: 2,
      intro: 999,
      weight: 1,
      health: 70,
      walkSpeed: 12,
      meleeDamage: 8,
      meleeRange: 3.2,
      meleeArcCos: 0.12,
      attackCooldown: 1,
      specialCooldown: 1.4,
      shootRange: 24,
      clothing: { torso: COLORS.blue, legs: COLORS.navy }
    }
  };

  let game = null;
  let loadProgress = 0;
  let loadStep = 0;
  let selectedAvatarPreset = DEFAULT_AVATAR_PRESET;
  let debugRequested = false;
  let studio = null;
  let activeStudioProject = null;
  let selectedGame = 'zombie';

  simulateLoading();
  bindBootUi();

  // Clear our public-server presence when the tab closes so stale games vanish.
  window.addEventListener('beforeunload', () => {
    if (game && game.network && game.network.leave) {
      game.network.leave();
    }
    if (game && game.stopBackgroundTicker) {
      game.stopBackgroundTicker();
    }
  });

  function simulateLoading() {
    const stepCaptions = [
      'Connecting to server...',
      'Receiving place data...',
      'Building survival arena...',
      'Launching zombie survival...'
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
        dom.loadingSubtitle.textContent = 'Choose how to survive.';
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
    document.title = 'Build and Learn - Zombie Survival';
    dom.canvas.setAttribute('aria-label', 'Build and Learn zombie survival game');
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

    loadCustomAvatar();
    buildCustomAvatarUi();

    dom.gameCards.forEach((card) => {
      card.addEventListener('click', () => {
        selectedGame = card.dataset.game;
        dom.gameCards.forEach((c) => c.classList.toggle('active', c === card));
      });
    });

    dom.soloButton.addEventListener('click', () => launchSession('solo', gameLaunchExtra()));
    dom.hostButton.addEventListener('click', () => launchSession('host', gameLaunchExtra()));
    dom.joinButton.addEventListener('click', () => launchSession('client', gameLaunchExtra()));

    if (dom.debugEnableButton) {
      dom.debugEnableButton.addEventListener('click', () => {
        debugRequested = !debugRequested;
        dom.debugEnableButton.textContent = debugRequested ? 'Debug: On (Solo only)' : 'Debug: Off';
        dom.debugEnableButton.classList.toggle('debug-on', debugRequested);
      });
    }

    if (dom.studioButton) {
      dom.studioButton.addEventListener('click', () => {
        if (game) return;
        if (!studio) {
          studio = new Studio(dom);
        }
        studio.setGame(selectedGame);
        dom.bootActions.classList.add('hidden');
        dom.loadingScreen.classList.add('hidden');
        studio.open();
      });
    }
  }

  function gameLaunchExtra() {
    if (selectedGame === 'crossroads') {
      return { worldBlocks: makeCrossroadsMap(), crossroads: true };
    }
    return { versus: true };
  }

  function updateBootAvatarPresetUi() {
    const preset = getAvatarPreset(selectedAvatarPreset);
    dom.avatarPresetButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.avatarPreset === preset.key);
    });
    dom.avatarPresetDescription.textContent = preset.description;
    if (dom.customAvatarPanel) {
      dom.customAvatarPanel.classList.toggle('hidden', selectedAvatarPreset !== 'custom');
    }
  }

  function loadCustomAvatar() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.customAvatar) || '{}');
      for (const slot of Object.keys(customAvatar)) {
        if (saved[slot] && AVATAR_ACCESSORIES[slot] && AVATAR_ACCESSORIES[slot].some((o) => o.id === saved[slot])) {
          customAvatar[slot] = saved[slot];
        }
      }
    } catch (error) {
      /* ignore */
    }
  }

  function buildCustomAvatarUi() {
    if (!dom.customAvatarSlots) {
      return;
    }
    dom.customAvatarSlots.textContent = '';
    const labels = { hat: 'Hat', glasses: 'Glasses', mask: 'Mask', gloves: 'Gloves', shirt: 'Shirt', pants: 'Pants' };
    for (const slot of Object.keys(AVATAR_ACCESSORIES)) {
      const wrap = document.createElement('label');
      wrap.className = 'custom-slot';
      const title = document.createElement('span');
      title.textContent = labels[slot] || slot;
      const select = document.createElement('select');
      for (const item of AVATAR_ACCESSORIES[slot]) {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = item.name;
        select.appendChild(opt);
      }
      select.value = customAvatar[slot];
      select.addEventListener('change', () => {
        customAvatar[slot] = select.value;
        localStorage.setItem(STORAGE_KEYS.customAvatar, JSON.stringify(customAvatar));
      });
      wrap.append(title, select);
      dom.customAvatarSlots.appendChild(wrap);
    }
  }

  function launchSession(mode, extra = {}) {
    if (game) {
      return;
    }
    // A normal (non-studio) session must never render leftover studio models.
    if (!extra.studioProject) {
      activeStudioProject = null;
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
        debug: debugRequested || Boolean(extra.studioProject),
        worldBlocks: extra.worldBlocks || null,
        studioProject: extra.studioProject || null,
        crossroads: Boolean(extra.crossroads),
        versus: Boolean(extra.versus)
      });
      dom.loadingScreen.classList.add('hidden');
      dom.hud.classList.remove('hidden');
      game.start();
      if (extra.studioProject) {
        game.runStudioScripts('onStart');
      }
      if (mode === 'host') {
        game.toggleNetworkWindow(true);
        game.network.startHosting({ name: `${playerName}'s Zombie Versus`, host: playerName, map: 'Zombie Versus' });
        game.setHint('You are hosting! Friends open Join Online and pick your game from the server list.', 12);
      } else if (mode === 'client') {
        game.toggleNetworkWindow(true);
        game.startServerBrowser();
        game.setHint('Pick a game from the server list to join. Hit Refresh if it looks empty.', 12);
      }
    } catch (error) {
      console.error(error);
      dom.loadingSubtitle.textContent = 'This browser could not start zombie survival.';
    }
  }

class ClassicOnlineReplica {
  constructor(elements, options) {
    if (elements.canvas) {
      elements.canvas.style.display = 'block';
    }
    this.dom = elements;
    this.mode = options.mode;
    this.studioProject = options.studioProject || null;
    this.studioScripts = (options.studioProject && options.studioProject.scripts) || null;
    this.studioRules = (options.studioProject && options.studioProject.rules) || null;
    this.crossroads = Boolean(options.crossroads);
    // Visual-scripting runtime state.
    this.scriptJumpPower = 1;
    this.scriptGravity = 1;
    this.scriptDamageMul = 1;
    this.scriptFreezeAI = false;
    this.scriptInvincible = false;
    this.scriptScore = 0;
    this.scriptSecondTimer = 0;
    this.scriptFiveTimer = 0;
    this.summonMode = Boolean(this.studioRules && this.studioRules.mode === 'summon');
    this.versus = Boolean(options.versus);
    this.vs = {
      phase: 'lobby',
      timer: 0,
      countdown: 0,
      roundLimit: 60,
      result: '',
      buttonCooldown: 0,
      bots: [],
      round: 0,
      respawns: [],
      playerRespawns: [],
      classCooldown: 0,
      classCooldownMax: 8,
      loadout: [],
      weaponSelectOpen: false,
      mapIndex: 0
    };
    this.vsWorldTag = 'lobby';
    this.appliedVersusResult = '';
    this.world = this.versus
      ? buildWorldFromBlocks(makeVersusLobby())
      : (options.worldBlocks ? buildWorldFromBlocks(options.worldBlocks) : buildZombieWorld());
    this.renderer = new Renderer(elements.canvas);
    this.renderer.setStaticWorld(this.world);
    this.audio = new AudioEngine();
    this.time = 0;
    this.lastFrame = 0;
    this.running = false;
    this.keys = new Set();
    this.characters = new Map();
    this.zombies = new Map();
    this.projectiles = [];
    this.corpses = [];
    this.hazards = [];
    this.sentries = [];
    this.pendingUse = false;
    this.fireHeld = false;
    this.uiRefresh = 0;
    this.hintTimer = 10;
    this.lastEquipmentUiSignature = '';
    this.lastToolDescriptionSignature = '';
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
    this.shiftLock = {
      enabled: false,
      active: false
    };
    this.viewKick = 0;
    this.viewSwingKick = 0;
    this.prevLocalCooldown = 0;
    this.prevLocalSwing = 0;
    this.debug = {
      available: Boolean(options.debug) && options.mode === 'solo',
      freezeAI: false,
      fly: false,
      infiniteHp: false,
      noWaves: false
    };
    this.camera = {
      yaw: 0.72,
      pitch: 0.22,
      distance: 12,
      eye: v3(),
      target: v3(),
      lookDir: v3(0, 0, 1),
      forwardXZ: v3(0, 0, 1),
      firstPerson: false,
      matrix: mat4Identity(),
      width: 1,
      height: 1
    };

    this.sharedArmory = {
      gold: 0,
      ownedVipKeys: new Set()
    };

    this.round = {
      phase: 'intermission',
      wave: 0,
      lastClearedWave: 0,
      unlockQueue: [],
      unlockedBaseKeys: [STARTER_WEAPON_KEY],
      nextUnlockIndex: 0,
      spawnQueue: [],
      spawnBudgetRemaining: 0,
      maxAlive: 8,
      spawnCooldown: 0,
      intermissionUntil: 0,
      payoutGold: 0,
      gameOverReason: '',
      autoRestartAt: 0
    };

// 1. Initialize the network FIRST — public broker relay (server-list based, no manual codes).
this.network = new PublicServerNetwork(this, {
  role: this.mode
});

// 2. THEN create and add the player
this.localPlayerId = makeId(10);
this.localPlayer = this.createPlayerCharacter({
  id: this.localPlayerId,
  name: options.playerName,
  spawn: vCopy(this.world.playerSpawns[0] || v3(0, 60, 0)),
  avatarPreset: options.avatarPreset,
  isLocal: true
});
this.addCharacter(this.localPlayer);

    this.setupChrome();
    this.bindUi();
    this.bindInput();

    // Studio playtest gets a clean "Return to Studio" button in the top-left controls.
    if (options.studioProject) {
      this.addReturnToStudioButton();
      this.applyStudioRules(options.studioProject);
    }

    this.startNewRun(false);
    this.refreshAllUi(true);
    this.updateSessionHeader();
    if (this.versus) {
      this.dom.placeName.textContent = 'Zombie Versus';
      if (this.mode === 'client') {
        // The host owns the versus lobby/round; the joiner just mirrors it from snapshots.
        this.buildZombieClassPanel();
        this.pushChat('System', 'Connecting to the host\'s Zombie Versus session...', true);
        this.setHint('Join mode: open Online, paste the host invite, and generate your answer code.', 12);
      } else {
        this.enterLobby();
        this.pushChat('System', 'Zombie Versus — welcome to the lobby! Step the green pad to summon a bot to play against.', true);
      }
      this.onResize();
      return;
    }
    this.pushChat('System', this.crossroads
      ? 'Crossroads PvP arena ready. Fight off waves of rival shooters!'
      : this.mode === 'solo'
      ? 'Solo zombie survival ready. Survive as many endless waves as you can.'
      : this.mode === 'host'
        ? 'Hosting a private zombie survival session. Share the invite code from the Online panel.'
        : 'Join mode ready. Paste a host invite code into the Online panel.', true);
    this.setHint(this.mode === 'client'
      ? 'Join mode: open Online, paste the host invite, and generate your answer code.'
      : 'Survive endless waves. Use 1-9 to equip, B for the Armory, and zoom all the way in for mouse-lock first person.', 12);
    this.onResize();
  }

    addReturnToStudioButton() {
      if (this.returnButton) {
        return;
      }
      const button = document.createElement('button');
      button.className = 'chrome-button return-to-studio';
      button.textContent = '↩ Studio';
      button.title = 'Stop the playtest and go back to Studio';
      button.addEventListener('click', () => this.returnToStudio());
      const controls = this.dom.menuButton.parentNode;
      if (controls) {
        controls.appendChild(button);
      }
      this.returnButton = button;
    }

    stopBackgroundTicker() {
      if (this.bgWorker) {
        try { this.bgWorker.terminate(); } catch (error) { /* ignore */ }
        this.bgWorker = null;
      }
      if (this.bgInterval) {
        clearInterval(this.bgInterval);
        this.bgInterval = null;
      }
    }

    returnToStudio() {
      // Cleanly tear the playtest down so Studio (and later sessions) work.
      this.running = false;
      this.stopBackgroundTicker();
      this.fireHeld = false;
      if (this.audio) {
        this.audio.stopWalk();
        this.audio.stopMusic();
      }
      this.releasePointerLock();
      this.dom.hud.classList.add('hidden');
      if (this.returnButton) {
        this.returnButton.remove();
        this.returnButton = null;
      }
      activeStudioProject = null;
      game = null;
      if (studio) {
        studio.open();
      } else {
        this.dom.bootActions.classList.remove('hidden');
        this.dom.loadingScreen.classList.remove('hidden');
      }
    }

    setupChrome() {
      this.dom.scoreHeading.textContent = 'Survivors';
      this.dom.scoreHeaders[0].textContent = 'Player';
      this.dom.scoreHeaders[1].textContent = 'Kills';
      this.dom.scoreHeaders[2].textContent = 'Downs';
      this.dom.backpackTitle.textContent = 'Armory';
      this.dom.backpackButton.textContent = 'Armory';
      this.dom.backpackCopy.textContent = 'Base weapons unlock during each run. VIP gear stays unlocked until you leave this session.';
      this.dom.toolDescription.textContent = 'Starter weapon: Pistol. Survive waves to unlock more gear.';
      this.dom.menuTitle.textContent = 'Zombie Survival';
      this.dom.resumeButton.textContent = 'Resume';
      this.dom.resetButton.textContent = 'Restart / Give Up';
      this.dom.placeName.textContent = 'Zombie Survival';
      this.dom.hintBar.textContent = 'Survive the endless waves. Use 1-9 to equip, B for the Armory, and click in first person to lock the mouse.';
    }

    get localCharacter() {
      return this.characters.get(this.localPlayerId) || null;
    }

    get availableWeaponKeys() {
      // A zombie has claws, not guns — empty their hotbar.
      if (this.versus) {
        const lc = this.localCharacter;
        if (lc && lc.vsRole === 'zombie') {
          return [];
        }
      }
      const unlocked = new Set(this.round.unlockedBaseKeys);
      for (const key of this.sharedArmory.ownedVipKeys) {
        unlocked.add(key);
      }
      return WEAPON_UI_ORDER.filter((key) => unlocked.has(key));
    }

    get livingZombies() {
      return [...this.zombies.values()].filter((zombie) => !zombie.dead);
    }

    get livingPlayers() {
      return [...this.characters.values()].filter((character) => !character.dead);
    }

    start() {
      if (this.running) {
        return;
      }
      this.running = true;
      this.audio.init();
      this.audio.playRespawn();
      this.lastFrame = performance.now();
      this.startBackgroundTicker();
      requestAnimationFrame(() => this.frame());
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
      if ((!this.camera.firstPerson && !this.shiftLock.active) || this.isUiBlockingInput()) {
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
      this.fireHeld = false;
      if (this.isPointerLocked() && document.exitPointerLock) {
        document.exitPointerLock();
      }
      document.body.classList.remove('pointer-locked');
    }

    handlePointerLockChange() {
      const looking = this.pointerLookActive();
      document.body.classList.toggle('pointer-locked', looking);
      this.dragState.active = false;
      this.dragState.moved = false;
      if (!this.isPointerLocked()) {
        this.fireHeld = false;
        if (this.shiftLock.active) {
          this.shiftLock.active = false;
        }
      }
      this.updateCrosshair();
      if (looking && this.camera.firstPerson) {
        this.setHint('Mouse locked. Move to look around. Hold click to keep firing. Press Esc to unlock.', 3.5);
      }
    }

    handlePointerLockError() {
      this.setHint('Mouse lock could not start here. Try clicking the game again or stay in third person.', 5.5);
    }

    pointerLookActive() {
      return this.isPointerLocked() && (this.camera.firstPerson || this.shiftLock.active);
    }

    setShiftLockEnabled(enabled) {
      this.shiftLock.enabled = Boolean(enabled);
      if (this.dom.shiftlockToggle) {
        this.dom.shiftlockToggle.checked = this.shiftLock.enabled;
      }
      try {
        localStorage.setItem(STORAGE_KEYS.shiftLock, this.shiftLock.enabled ? '1' : '0');
      } catch (error) {
        /* ignore storage errors */
      }
      if (!this.shiftLock.enabled && this.shiftLock.active) {
        this.deactivateShiftLock();
      }
    }

    toggleShiftLock() {
      if (!this.shiftLock.enabled) {
        this.setHint('Enable Shift Lock in the Menu (Esc) first.', 3);
        return;
      }
      if (this.shiftLock.active) {
        this.deactivateShiftLock();
      } else {
        this.activateShiftLock();
      }
    }

    activateShiftLock() {
      if (this.camera.firstPerson) {
        this.setHint('Zoom out of first person to use shift lock.', 3);
        return;
      }
      this.shiftLock.active = true;
      this.updateCrosshair();
      if (!this.pointerLockSupported) {
        this.setHint('Shift lock on, but this browser could not lock the mouse.', 4);
        return;
      }
      if (!this.isPointerLocked()) {
        this.dom.canvas.requestPointerLock();
      }
      this.setHint('Shift lock on. Camera follows your mouse. Press Shift or Esc to release.', 3.5);
    }

    deactivateShiftLock() {
      const wasActive = this.shiftLock.active;
      this.shiftLock.active = false;
      this.updateCrosshair();
      if (wasActive && !this.camera.firstPerson && this.isPointerLocked() && document.exitPointerLock) {
        document.exitPointerLock();
      }
    }

    updateCrosshair() {
      if (!this.dom.crosshair) {
        return;
      }
      const local = this.localCharacter;
      // Show the center crosshair whenever you're holding a gun — shots travel along the
      // view center, so this reads in first person, third person and shift lock alike.
      const show = Boolean(local) && !local.dead
        && getWeaponHoldStyle(local.selectedTool) === 'gun'
        && !this.isUiBlockingInput();
      this.dom.crosshair.classList.toggle('hidden', !show);
    }

    createPlayerCharacter({ id, name, spawn, avatarPreset, isLocal }) {
      const character = createCharacter({
        id,
        name,
        spawn,
        avatarPreset,
        isLocal,
        kind: 'player',
        team: 'human',
        selectedTool: STARTER_WEAPON_KEY
      });
      character.remoteInput = makeNeutralInput();
      character.lastConsumedResetNonce = 0;
      character.connectionKey = null;
      character.netTarget = null;
      character.netReceivedAt = 0;
      character.initializedFromNetwork = isLocal;
      return character;
    }

    createRemoteCharacter(playerData, connectionKey) {
      const spawn = this.allocatePlayerSpawn(this.characters.size);
      const character = this.createPlayerCharacter({
        id: playerData.id,
        name: sanitizeName(playerData.name),
        spawn,
        avatarPreset: playerData.avatarPreset,
        isLocal: false
      });
      character.connectionKey = connectionKey || null;
      character.initializedFromNetwork = false;
      this.ensurePlayerWeapon(character);
      this.addCharacter(character);
      return character;
    }

    createZombieFromSnapshot(data) {
      const zombie = createCharacter({
        id: data.id,
        name: data.name,
        spawn: vCopy(data.pos),
        bodyColors: cloneBodyColors(data.bodyColors),
        isLocal: false,
        kind: 'zombie',
        team: 'zombie',
        noFace: true,
        renderScale: data.renderScale || 1,
        walkSpeed: data.walkSpeed || 8,
        selectedTool: data.selectedTool || null,
        bounds: data.bounds || undefined
      });
      zombie.zombieType = data.zombieType;
      zombie.health = data.health;
      zombie.maxHealth = data.maxHealth;
      zombie.dead = Boolean(data.dead);
      zombie.armor = data.armor || 0;
      zombie.walkCycle = data.walkCycle || 0;
      zombie.yaw = data.yaw || 0;
      zombie.forcefield = 0;
      zombie.noFace = true;
      zombie.netTarget = null;
      zombie.netInitialized = false;
      zombie.hiddenLabel = true;
      zombie.cloakRevealUntil = this.time + (data.cloakRevealTimer || 0);
      return zombie;
    }

    createZombie(zombieType, spawn) {
      const definition = ZOMBIE_DEFS[zombieType];
      const isRival = zombieType === 'rival';
      const zombie = createCharacter({
        id: `z-${makeId(8)}`,
        name: definition.name,
        spawn,
        bodyColors: getZombieBodyColors(zombieType),
        isLocal: false,
        kind: 'zombie',
        team: 'zombie',
        noFace: !isRival,
        renderScale: definition.renderScale || 1,
        walkSpeed: definition.walkSpeed,
        selectedTool: (definition.key === 'blaster-soldier-zombie' || isRival) ? 'regular-blaster' : null,
        bounds: definition.bounds
      });
      zombie.zombieType = zombieType;
      zombie.health = definition.health;
      zombie.maxHealth = definition.health;
      zombie.armor = definition.armor || 0;
      zombie.specialCooldown = randRange(0.2, definition.specialCooldown || 0.8);
      zombie.attackCooldown = randRange(0, definition.attackCooldown * 0.45);
      zombie.noFace = !isRival;
      zombie.hiddenLabel = true;
      return zombie;
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

    addZombie(zombie) {
      this.zombies.set(zombie.id, zombie);
    }

    removeZombie(id) {
      this.zombies.delete(id);
    }

allocatePlayerSpawn(index) {
      if (this.world.playerSpawns && this.world.playerSpawns.length > 0) {
        return vCopy(this.world.playerSpawns[index % this.world.playerSpawns.length]);
      }
      // Safe fallback for custom/crossroads maps: drop from the sky so they hit the floor
      return v3(0, 60, 0); 
    }

    ensurePlayerWeapon(character) {
      if (character.isBot) {
        // Bots manage their own loadout; never clamp them to the local player's unlocks.
        return;
      }
      const available = this.availableWeaponKeys;
      if (!available.length) {
        character.selectedTool = null;
        return;
      }
      if (!character.selectedTool || !available.includes(character.selectedTool)) {
        character.selectedTool = available[0];
      }
    }

    createUnlockQueue() {
      const firstLayer = shuffleArray(BASE_WEAPON_LANES.map((lane) => lane[0]));
      const secondLayer = shuffleArray(BASE_WEAPON_LANES.map((lane) => lane[1]));
      return [...firstLayer, ...secondLayer];
    }

    startNewRun(announce = true) {
      this.round.phase = 'intermission';
      this.round.wave = 0;
      this.round.lastClearedWave = 0;
      this.round.unlockQueue = this.createUnlockQueue();
      this.round.unlockedBaseKeys = [STARTER_WEAPON_KEY];
      this.round.nextUnlockIndex = 0;
      this.round.spawnQueue = [];
      this.round.spawnBudgetRemaining = 0;
      this.round.maxAlive = 8;
      this.round.spawnCooldown = 0;
      this.round.intermissionUntil = this.time + 3.2;
      this.round.payoutGold = 0;
      this.round.gameOverReason = '';
      this.round.autoRestartAt = 0;
      this.zombies.clear();
      this.projectiles = [];
      this.hazards = [];
      this.sentries = [];
      this.corpses = [];

      let spawnIndex = 0;
      for (const character of this.characters.values()) {
        this.resetCharacterForNewRun(character, this.allocatePlayerSpawn(spawnIndex));
        spawnIndex += 1;
      }

      this.refreshAllUi(true);
      if (announce) {
        this.pushChat('System', 'New run starting. The horde is regrouping...', true);
        if (this.mode === 'host') {
          this.network.broadcastSystemChat('New run starting. The horde is regrouping...');
        }
      }
    }

    resetCharacterForNewRun(character, spawn) {
      character.spawn = vCopy(spawn);
      character.pos = vCopy(spawn);
      character.vel = v3();
      if (character.isLocal && this.studioRules && this.studioRules.playerMaxHp) {
        character.maxHealth = Math.max(1, this.studioRules.playerMaxHp);
      }
      character.health = character.maxHealth;
      character.dead = false;
      character.forcefield = SPAWN_PROTECTION;
      character.lastDamageAgo = 99;
      character.grounded = false;
      character.climbing = false;
      character.jumpHeld = false;
      character.toolCooldown = 0;
      character.swing.time = 0;
      character.swing.didHit = false;
      character.swing.weaponKey = null;
      character.damageFlash = 0;
      character.walkCycle = randRange(0, TAU);
      character.selectedTool = (character.isLocal && this.studioStartWeapon) ? this.studioStartWeapon : STARTER_WEAPON_KEY;
      character.poisonTimer = 0;
      character.poisonDps = 0;
      character.slowTimer = 0;
      character.slowFactor = 1;
      character.hasteTimer = 0;
      character.hasteFactor = 1;
      character.colaTimer = 0;
      character.freezeMeter = 0;
      character.frozenTimer = 0;
      character.stunTimer = 0;
      character.armor = 0;
      character.armorBroken = false;
      character.specialCooldown = 0;
      character.bubble = null;
      character.bubbleUntil = 0;
      character.cloakRevealUntil = 0;
      this.ensurePlayerWeapon(character);
      if (character.isLocal) {
        this.audio.playRespawn();
        this.runStudioScripts('onPlayerSpawn');
      }
    }

    reviveDownedPlayers() {
      let spawnIndex = 0;
      let revivedAny = false;
      for (const character of this.characters.values()) {
        if (character.dead) {
          this.resetCharacterForNewRun(character, this.allocatePlayerSpawn(spawnIndex));
          revivedAny = true;
        }
        spawnIndex += 1;
      }
      if (revivedAny) {
        const reviveMessage = 'Downed survivors are back on their feet for the next wave.';
        this.pushChat('System', reviveMessage, true);
        if (this.mode === 'host') {
          this.network.broadcastSystemChat(reviveMessage);
        }
      }
    }

    unlockNextWeapon() {
      const nextKey = this.round.unlockQueue[this.round.nextUnlockIndex];
      if (!nextKey) {
        return null;
      }
      this.round.nextUnlockIndex += 1;
      if (!this.round.unlockedBaseKeys.includes(nextKey)) {
        this.round.unlockedBaseKeys.push(nextKey);
      }
      const weapon = getWeaponDef(nextKey);
      for (const character of this.characters.values()) {
        this.ensurePlayerWeapon(character);
      }
      this.refreshAllUi(true);
      const message = `${weapon.name} unlocked for this run.`;
      this.pushChat('System', message, true);
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(message);
      }
      return weapon;
    }

    buyVipWeapon(weaponKey, requestedByRemote = false) {
      const weapon = getWeaponDef(weaponKey);
      if (!weapon || weapon.category !== 'vip') {
        return false;
      }
      if (this.round.phase === 'playing') {
        if (!requestedByRemote) {
          this.setHint('VIP purchases are only available between runs.', 4);
        }
        return false;
      }
      if (this.sharedArmory.ownedVipKeys.has(weaponKey)) {
        if (!requestedByRemote) {
          this.setHint(`${weapon.name} is already unlocked for this session.`, 3.5);
        }
        return false;
      }
      if (this.sharedArmory.gold < weapon.vipCost) {
        if (!requestedByRemote) {
          this.setHint(`You need ${weapon.vipCost} gold for ${weapon.name}.`, 3.5);
        }
        return false;
      }
      this.sharedArmory.gold -= weapon.vipCost;
      this.sharedArmory.ownedVipKeys.add(weaponKey);
      for (const character of this.characters.values()) {
        this.ensurePlayerWeapon(character);
      }
      this.refreshAllUi(true);
      const message = `${weapon.name} is now unlocked for the whole session.`;
      this.pushChat('System', message, true);
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(message);
      }
      return true;
    }

    requestVipPurchase(weaponKey) {
      if (this.mode === 'client') {
        this.network.sendVipPurchase(weaponKey);
        this.setHint('VIP purchase request sent to the host.', 3.5);
      } else {
        this.buyVipWeapon(weaponKey);
      }
    }

    setupBackpackButton(button, text, weaponKey, disabled, secondary = '') {
      button.className = `backpack-item chrome-button${disabled ? ' locked' : ''}`;
      button.type = 'button';
      button.dataset.weaponKey = weaponKey;
      button.disabled = disabled;
      button.textContent = secondary ? `${text} — ${secondary}` : text;
    }

    refreshAllUi(force = false) {
      this.refreshEquipmentUi(force);
      this.refreshScoreboard(force);
      this.refreshConnectedPlayers();
      this.refreshNetworkWindow();
      this.updateSessionHeader();
      this.updateToolDescription(force);
    }

    refreshEquipmentUi(force = false) {
      const local = this.localCharacter;
      if (!local) {
        return;
      }
      this.ensurePlayerWeapon(local);

      const available = this.availableWeaponKeys;
      const isVsZombie = this.versus && local.vsRole === 'zombie';
      const equipmentSignature = JSON.stringify({
        available,
        selectedTool: local.selectedTool,
        phase: this.round.phase,
        wave: this.round.wave,
        gold: this.sharedArmory.gold,
        ownedVipKeys: [...this.sharedArmory.ownedVipKeys].sort(),
        vsRole: local.vsRole || '',
        vsClass: isVsZombie ? local.vsClass : '',
        vsSpecialCd: isVsZombie ? Math.ceil(local.specialCooldown || 0) : 0
      });
      if (!force && equipmentSignature === this.lastEquipmentUiSignature) {
        return;
      }
      this.lastEquipmentUiSignature = equipmentSignature;
      this.dom.hotbar.textContent = '';

      // A zombie carries its class tool (claws / pan / saw), not a gun hotbar.
      if (isVsZombie) {
        const cls = VERSUS_ZOMBIE_CLASSES[local.vsClass] || VERSUS_ZOMBIE_CLASSES.normal;
        const slot = document.createElement('div');
        slot.className = 'hotbar-slot active';
        slot.innerHTML = `
          <div class="slot-number">${escapeHtml(cls.emoji || '🧟')}</div>
          <div class="slot-icon weapon-icon-label">${escapeHtml(cls.toolTag || 'CLW')}</div>
          <div class="slot-name">${escapeHtml(cls.tool || 'Claws')}</div>
        `;
        this.dom.hotbar.appendChild(slot);
        if (cls.special) {
          const onCd = (local.specialCooldown || 0) > 0;
          const spSlot = document.createElement('div');
          spSlot.className = 'hotbar-slot';
          spSlot.style.opacity = onCd ? '0.45' : '1';
          spSlot.innerHTML = `
            <div class="slot-number">F</div>
            <div class="slot-icon weapon-icon-label">${onCd ? `${Math.ceil(local.specialCooldown)}s` : 'THR'}</div>
            <div class="slot-name">${escapeHtml(cls.special.name)}</div>
          `;
          this.dom.hotbar.appendChild(spSlot);
        }
        this.dom.backpackList.textContent = '';
        const note = document.createElement('div');
        note.className = 'armory-section-title';
        note.textContent = `You are a ${cls.name}. Click to swing your ${cls.tool}. Use the class panel to transform.`;
        this.dom.backpackList.appendChild(note);
        return;
      }

      available.forEach((weaponKey, index) => {
        const weapon = getWeaponDef(weaponKey);
        const slot = document.createElement('div');
        slot.className = `hotbar-slot${local.selectedTool === weaponKey ? ' active' : ''}`;
        slot.dataset.weaponKey = weaponKey;
        slot.innerHTML = `
          <div class="slot-number">${index < 9 ? index + 1 : ''}</div>
          <div class="slot-icon weapon-icon-label">${escapeHtml(weapon.uiTag)}</div>
          <div class="slot-name">${escapeHtml(weapon.name)}</div>
        `;
        this.dom.hotbar.appendChild(slot);
      });

      this.dom.backpackList.textContent = '';
      const ownedHeader = document.createElement('div');
      ownedHeader.className = 'armory-section-title';
      ownedHeader.textContent = 'Run Weapons';
      this.dom.backpackList.appendChild(ownedHeader);

      if (available.length) {
        for (const weaponKey of available) {
          const weapon = getWeaponDef(weaponKey);
          const button = document.createElement('button');
          this.setupBackpackButton(button, weapon.name, weaponKey, false, local.selectedTool === weaponKey ? 'Equipped' : 'Equip');
          this.dom.backpackList.appendChild(button);
        }
      }

      const lockedHeader = document.createElement('div');
      lockedHeader.className = 'armory-section-title';
      lockedHeader.textContent = 'Future Run Unlocks';
      this.dom.backpackList.appendChild(lockedHeader);
      for (const weaponKey of WEAPON_UI_ORDER) {
        const weapon = getWeaponDef(weaponKey);
        if (!weapon || weapon.category === 'vip' || available.includes(weaponKey) || weaponKey === STARTER_WEAPON_KEY) {
          continue;
        }
        const button = document.createElement('button');
        this.setupBackpackButton(button, weapon.name, weaponKey, true, 'Unlocks later this run');
        this.dom.backpackList.appendChild(button);
      }

      const vipHeader = document.createElement('div');
      vipHeader.className = 'armory-section-title';
      vipHeader.textContent = `VIP Shop • ${this.sharedArmory.gold} Gold`;
      this.dom.backpackList.appendChild(vipHeader);
      for (const weaponKey of VIP_WEAPON_KEYS) {
        const weapon = getWeaponDef(weaponKey);
        const owned = this.sharedArmory.ownedVipKeys.has(weaponKey);
        const disabled = this.round.phase === 'playing' || owned || this.sharedArmory.gold < weapon.vipCost;
        const button = document.createElement('button');
        this.setupBackpackButton(button, weapon.name, weaponKey, disabled, owned ? 'Owned' : `${weapon.vipCost} Gold`);
        button.dataset.vipPurchase = owned ? '' : '1';
        this.dom.backpackList.appendChild(button);
      }

      this.dom.backpackCopy.textContent = this.round.phase === 'playing'
        ? `Wave ${this.round.wave} in progress. Base unlocks reset on defeat. Team gold is spent between runs.`
        : `Team gold: ${this.sharedArmory.gold}. Buy VIP gear between runs. Base unlocks reset each new run.`;
    }

    bindUi() {
      this.dom.menuButton.addEventListener('click', () => this.toggleMenu());
      this.dom.playersButton.addEventListener('click', () => this.togglePlayers());
      this.dom.backpackButton.addEventListener('click', () => this.toggleBackpack());
      this.dom.onlineButton.addEventListener('click', () => this.toggleNetworkWindow());
      this.dom.resumeButton.addEventListener('click', () => this.toggleMenu(false));
      this.dom.resetButton.addEventListener('click', () => this.requestReset());
      this.dom.fullscreenButton.addEventListener('click', () => this.enterFullscreen());

      if (this.dom.shiftlockToggle) {
        let storedShiftLock = '0';
        try {
          storedShiftLock = localStorage.getItem(STORAGE_KEYS.shiftLock) || '0';
        } catch (error) {
          storedShiftLock = '0';
        }
        this.shiftLock.enabled = storedShiftLock === '1';
        this.dom.shiftlockToggle.checked = this.shiftLock.enabled;
        this.dom.shiftlockToggle.addEventListener('change', () => {
          this.setShiftLockEnabled(this.dom.shiftlockToggle.checked);
        });
      }
      this.setupDebugPanel();
      this.dom.closeNetworkButton.addEventListener('click', () => this.toggleNetworkWindow(false));

      this.buildZombieClassPanel();
      if (this.dom.weaponSelectConfirm) {
        this.dom.weaponSelectConfirm.addEventListener('click', () => this.confirmWeaponSelect());
      }

      this.dom.hotbar.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target.closest('[data-weapon-key]') : null;
        if (!target) {
          return;
        }
        this.equipWeapon(target.dataset.weaponKey, true);
      });

      this.dom.backpackList.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target.closest('[data-weapon-key]') : null;
        if (!target || !(target instanceof HTMLButtonElement)) {
          return;
        }
        const weaponKey = target.dataset.weaponKey;
        if (!weaponKey) {
          return;
        }
        if (target.dataset.vipPurchase === '1') {
          this.requestVipPurchase(weaponKey);
        } else {
          this.equipWeapon(weaponKey, true);
          this.toggleBackpack(false);
        }
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

      this.setupNetworkUi();
    }

    setupNetworkUi() {
      // Public-server picker (all players must match to see each other).
      if (this.dom.brokerSelect) {
        this.dom.brokerSelect.textContent = '';
        for (const b of PUBLIC_BROKERS) {
          const opt = document.createElement('option');
          opt.value = b.url;
          opt.textContent = b.name;
          this.dom.brokerSelect.appendChild(opt);
        }
        this.dom.brokerSelect.value = this.network.brokerUrl;
        this.dom.brokerSelect.addEventListener('change', () => {
          this.network.setBrokerUrl(this.dom.brokerSelect.value);
          // Reconnect on the new broker for the current role.
          this.network.leave();
          if (this.mode === 'host') {
            this.network.startHosting({ name: `${this.localCharacter.name}'s Zombie Versus`, host: this.localCharacter.name, map: 'Zombie Versus' });
          } else if (this.mode === 'client') {
            this.startServerBrowser();
          }
        });
      }
      if (this.dom.refreshServersButton) {
        this.dom.refreshServersButton.addEventListener('click', () => this.renderServerList());
      }
      if (this.dom.serverList) {
        this.dom.serverList.addEventListener('click', (event) => {
          const target = event.target instanceof Element ? event.target.closest('[data-server-id]') : null;
          if (!target) return;
          this.network.joinServer(target.dataset.serverId);
          this.setNetworkStatus('Joining… you will spawn in once the host answers.');
        });
      }
    }

    startServerBrowser() {
      this.network.startBrowsing(() => this.renderServerList());
      this.renderServerList();
    }

    renderServerList() {
      if (!this.dom.serverList) return;
      const servers = this.network.getServerList ? this.network.getServerList() : [];
      if (!servers.length) {
        this.dom.serverList.innerHTML = '<div class="server-empty">No live games yet. Ask a friend to press Host Online (on the same public server), then hit Refresh.</div>';
        return;
      }
      this.dom.serverList.innerHTML = servers.map((s) => `
        <div class="server-row">
          <div class="server-info">
            <div class="server-name">${escapeHtml(s.name || 'Zombie Versus')}</div>
            <div class="server-sub">${escapeHtml(s.host || 'Host')} • ${s.players || 1} player${(s.players || 1) === 1 ? '' : 's'} • ${escapeHtml(s.phase || 'lobby')}</div>
          </div>
          <button class="chrome-button" type="button" data-server-id="${escapeHtml(s.serverId)}">Join</button>
        </div>
      `).join('');
    }

    equipWeapon(weaponKey, notify) {
      const local = this.localCharacter;
      if (!local || !weaponKey || !this.availableWeaponKeys.includes(weaponKey)) {
        return;
      }
      local.selectedTool = weaponKey;
      this.refreshEquipmentUi();
      this.updateToolDescription();
      if (notify) {
        const weapon = getWeaponDef(weaponKey);
        this.setHint(`${weapon.name} equipped. ${weapon.useHint}`, 4.2);
      }
    }

    bindInput() {
      window.addEventListener('resize', () => this.onResize());
      window.addEventListener('blur', () => {
        this.keys.clear();
        this.fireHeld = false;
        this.dragState.active = false;
        this.releasePointerLock();
      });
      document.addEventListener('pointerlockchange', () => this.handlePointerLockChange());
      document.addEventListener('pointerlockerror', () => this.handlePointerLockError());

      window.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        const typing = activeElement === this.dom.chatInput
          || activeElement === this.dom.playerNameInput
          || (activeElement && activeElement.tagName === 'SELECT');

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
          } else if (!this.dom.debugWindow.classList.contains('hidden')) {
            this.toggleDebugWindow(false);
          } else {
            this.toggleMenu();
          }
          return;
        }

        const lower = event.key.toLowerCase();
        this.keys.add(lower);

        if (lower === 'shift' && !event.repeat) {
          this.toggleShiftLock();
        }

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

        if (lower === 'f' && this.versus && !this.isUiBlockingInput()) {
          event.preventDefault();
          this.localZombieThrow();
        }

        if (/^[1-9]$/.test(event.key)) {
          event.preventDefault();
          const local = this.localCharacter;
          if (this.versus && local && local.vsRole === 'zombie') {
            // Zombies transform via the on-screen Transform panel, not the number row.
            return;
          }
          const weaponKey = this.availableWeaponKeys[Number(event.key) - 1];
          if (weaponKey) {
            this.equipWeapon(weaponKey, true);
          }
        }
      });

      window.addEventListener('keyup', (event) => {
        this.keys.delete(event.key.toLowerCase());
      });

      this.dom.canvas.addEventListener('mousedown', (event) => {
        if (event.button !== 0 || this.isUiBlockingInput()) {
          return;
        }

        if (this.camera.firstPerson || this.shiftLock.active) {
          event.preventDefault();
          this.dragState.active = false;
          this.dragState.moved = false;
          if (this.isPointerLocked()) {
            this.fireHeld = true;
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
        if (this.pointerLookActive()) {
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
        if (event.button !== 0) {
          return;
        }
        this.fireHeld = false;
        if (this.camera.firstPerson || this.isPointerLocked() || !this.dragState.active) {
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

    frame() {
      if (!this.running) {
        return;
      }
      // While visible, the rAF loop drives the sim + render. While hidden, rAF is throttled
      // to ~1fps by the browser, so the background worker ticker takes over (see stepOnce).
      if (!document.hidden) {
        this.stepOnce(true);
      }
      requestAnimationFrame(() => this.frame());
    }

    // One simulation step. dt is measured from a shared clock so rAF and the background
    // worker ticker never double-advance time.
    stepOnce(doRender) {
      if (!this.running) {
        return;
      }
      const now = performance.now();
      const dt = Math.min((now - this.lastFrame) / 1000, 1 / 20);
      if (dt <= 0) {
        return;
      }
      this.lastFrame = now;
      this.time += dt;
      this.update(dt);
      if (doRender) {
        this.render();
      }
    }

    // A Web Worker fires timer ticks that the browser does NOT throttle in a background
    // tab, so a host keeps simulating + broadcasting at full speed even when it's not the
    // focused tab. Falls back to setInterval if a worker can't be created (still helps).
    startBackgroundTicker() {
      const tick = () => {
        if (this.running && document.hidden) {
          this.stepOnce(false);
        }
      };
      try {
        const workerSource = 'let h=null;onmessage=function(e){if(e.data&&e.data.ms){if(h)clearInterval(h);h=setInterval(function(){postMessage(1);},e.data.ms);}};';
        const blob = new Blob([workerSource], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        this.bgWorker = new Worker(url);
        this.bgWorker.onmessage = tick;
        this.bgWorker.postMessage({ ms: 1000 / 30 });
      } catch (error) {
        // file:// or CSP blocked the worker — fall back to a plain interval (throttled to
        // ~1s in background by the browser, but better than a frozen host).
        this.bgInterval = window.setInterval(tick, 1000 / 30);
      }
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

      this.updateViewmodelAnim(local, dt);
      this.updateCrosshair();
      this.updateAudioLoops(local, dt);
      this.updateScriptTimers(dt);
    }

    updateScriptTimers(dt) {
      if (!this.studioScripts || this.round.phase === 'gameover') {
        return;
      }
      this.scriptSecondTimer += dt;
      if (this.scriptSecondTimer >= 1) {
        this.scriptSecondTimer -= 1;
        this.runStudioScripts('everySecond');
      }
      this.scriptFiveTimer += dt;
      if (this.scriptFiveTimer >= 5) {
        this.scriptFiveTimer -= 5;
        this.runStudioScripts('every5Seconds');
      }
    }

    updateAudioLoops(local, dt) {
      // Footstep loop follows the local player's movement.
      const moving = Boolean(local) && !local.dead && !this.isUiBlockingInput()
        && Math.hypot(local.vel.x, local.vel.z) > 2.5;
      this.audio.updateWalkSound(moving);

      // Random zombie groans while the undead are around.
      this.groanTimer = (this.groanTimer || 0) - dt;
      if (this.groanTimer <= 0) {
        // In Versus most zombies are green player-kind avatars, so count those too.
        let groanCount = this.livingZombies.length;
        if (this.versus) {
          for (const c of this.characters.values()) {
            if (c.vsRole === 'zombie' && (c.health === undefined || c.health > 0)) groanCount += 1;
          }
        }
        if (groanCount > 0 && (!this.versus || this.vs.phase === 'playing')) {
          this.audio.playZombieGroan();
          this.groanTimer = randRange(1.4, 3.8) / Math.min(4, Math.max(1, groanCount * 0.5));
        } else {
          this.groanTimer = 0.6;
        }
      }
    }

    updateViewmodelAnim(local, dt) {
      // Fire recoil: a rise in the local player's tool cooldown means a shot went off.
      const cooldown = local ? local.toolCooldown : 0;
      if (cooldown > this.prevLocalCooldown + 0.001) {
        this.viewKick = 1;
      }
      this.prevLocalCooldown = cooldown;
      // Melee swing kick.
      const swing = local ? local.swing.time : 0;
      if (swing > this.prevLocalSwing + 0.001) {
        this.viewSwingKick = 1;
      }
      this.prevLocalSwing = swing;
      this.viewKick = Math.max(0, this.viewKick - dt * 6.5);
      this.viewSwingKick = Math.max(0, this.viewSwingKick - dt * 4.5);
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
      if (this.versus) {
        this.updateVersusAI(dt);
      }
      const local = this.localCharacter;
      const liveInput = this.getLiveInput();

      if (local) {
        local.selectedTool = liveInput.selectedTool;
        // A local zombie has no gun; its click is a claw swipe handled in updateVersus.
        const consumeClick = this.pendingUse && !this.isUiBlockingInput() && !(this.versus && local.vsRole === 'zombie');
        this.updateControlledCharacter(local, liveInput, dt, consumeClick, true);
      }

      for (const character of this.characters.values()) {
        if (character.isLocal) {
          continue;
        }

        const input = character.remoteInput || makeNeutralInput();
        character.selectedTool = input.selectedTool;

        if (input.resetNonce !== character.lastConsumedResetNonce) {
          character.lastConsumedResetNonce = input.resetNonce;
          if (this.round.phase === 'playing') {
            this.killPlayer(character, null, 'gave up');
          } else {
            this.startNewRun();
          }
        }

        this.updateControlledCharacter(character, input, dt, false, true);
      }

      this.updateZombies(dt);
      this.updateSentries(dt);
      this.updateProjectiles(dt, true);
      this.updateHazards(dt, true);
      this.updateCorpses(dt);
      if (this.versus) {
        this.updateVersus(dt);
      } else {
        this.updateRoundState(dt);
      }
      this.pendingUse = false;

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

      if ((this.pendingUse || liveInput.fireHeld) && !this.isUiBlockingInput()) {
        this.clientToolUse(liveInput);
      }
      this.pendingUse = false;

      for (const character of this.characters.values()) {
        if (character.isLocal) {
          continue;
        }
        this.applyRemoteSmoothingToCharacter(character, dt);
      }

      for (const zombie of this.zombies.values()) {
        this.applyRemoteSmoothingToZombie(zombie, dt);
      }

      if (local) {
        this.applyLocalCorrection(local, dt);
      }

      this.updateClientEffects(dt);
      this.updateCorpses(dt);
    }

    updateControlledCharacter(character, input, dt, consumeClick, allowAuthoritativeCombat) {
      this.updateActorState(character, dt);
      if (character.dead) {
        return;
      }

      const inputX = Number(Boolean(input.right)) - Number(Boolean(input.left));
      const inputZ = Number(Boolean(input.forward)) - Number(Boolean(input.back));
      const jumpPressed = Boolean(input.jump);
      const inputVector = v3(inputX, 0, inputZ);
      const moveWorld = character.isLocal
        ? cameraRelativeFromForward(inputVector, this.camera.forwardXZ)
        : cameraRelativeWorld(inputVector, input.cameraYaw);
      const wantsJump = jumpPressed && !character.jumpHeld;
      character.jumpHeld = jumpPressed;
      this.updateCharacterMotion(character, moveWorld, wantsJump, inputZ, dt);

      if (!allowAuthoritativeCombat) {
        return;
      }

      const wantsUse = consumeClick || Boolean(input.fireHeld);
      if (wantsUse) {
        this.useCurrentWeapon(character, input);
      }
    }

    updateActorState(actor, dt) {
      actor.forcefield = Math.max(0, actor.forcefield - dt);
      actor.lastDamageAgo += dt;
      actor.tempSpeedMultiplier = 1;
      if (actor.cloakRevealUntil > 0 && actor.cloakRevealUntil <= this.time) {
        actor.cloakRevealUntil = 0;
      }

      if (actor.toolCooldown > 0) {
        actor.toolCooldown = Math.max(0, actor.toolCooldown - dt);
      }

      if (actor.swing.time > 0) {
        actor.swing.time -= dt;
        if (actor.swing.time < 0) {
          actor.swing.time = 0;
        }
        if (!actor.swing.didHit && actor.swing.time <= (actor.swing.duration || 0.24) * 0.5) {
          actor.swing.didHit = true;
          this.resolveMeleeHit(actor);
        }
      }

      if (actor.stunTimer > 0) {
        actor.stunTimer = Math.max(0, actor.stunTimer - dt);
      }
      if (actor.transformTime > 0) {
        actor.transformTime = Math.max(0, actor.transformTime - dt);
      }
      if (actor.clawCooldown > 0) {
        actor.clawCooldown = Math.max(0, actor.clawCooldown - dt);
      }
      if (actor.ashTime > 0) {
        actor.ashTime = Math.max(0, actor.ashTime - dt);
      }
      if (actor.slowTimer > 0) {
        actor.slowTimer = Math.max(0, actor.slowTimer - dt);
        if (actor.slowTimer <= 0) {
          actor.slowFactor = 1;
        }
      }
      if (actor.hasteTimer > 0) {
        actor.hasteTimer = Math.max(0, actor.hasteTimer - dt);
        if (actor.hasteTimer <= 0) {
          actor.hasteFactor = 1;
        }
      }
      if (actor.colaTimer > 0) {
        actor.colaTimer = Math.max(0, actor.colaTimer - dt);
      }
      if (actor.frozenTimer > 0) {
        actor.frozenTimer = Math.max(0, actor.frozenTimer - dt);
      }
      if (actor.freezeMeter > 0 && actor.frozenTimer <= 0) {
        actor.freezeMeter = Math.max(0, actor.freezeMeter - dt * 0.6);
      }
      if (actor.poisonTimer > 0) {
        actor.poisonTimer = Math.max(0, actor.poisonTimer - dt);
        const poisonDamage = actor.poisonDps * dt;
        if (poisonDamage > 0) {
          this.applyDamage(actor, { amount: poisonDamage, tags: ['poison'] }, null, null, true);
        }
        if (actor.poisonTimer <= 0) {
          actor.poisonDps = 0;
        }
      }

      const combatActive = this.round.phase === 'playing' || (this.versus && this.vs.phase === 'playing');
      if (actor.kind === 'player' && !actor.dead && combatActive && actor.lastDamageAgo > 6 && actor.health < actor.maxHealth && actor.poisonTimer <= 0) {
        // Survivors in Versus regenerate faster so claw scratches don't snowball instantly.
        const rate = this.versus && actor.vsRole !== 'zombie' ? 3.2 : 0.8;
        actor.health = Math.min(actor.maxHealth, actor.health + dt * rate);
      }
    }

    getMoveSpeedMultiplier(actor) {
      let multiplier = 1;
      if (actor.slowTimer > 0) {
        multiplier *= actor.slowFactor;
      }
      if (actor.hasteTimer > 0) {
        multiplier *= actor.hasteFactor;
      }
      if (actor.colaTimer > 0) {
        multiplier *= 1.25;
      }
      const minigunHeld = actor.kind === 'player' && actor.selectedTool === 'minigun'
        && (actor.isLocal ? this.fireHeld : Boolean(actor.remoteInput?.fireHeld));
      if (minigunHeld) {
        multiplier *= 0.55;
      }
      if (actor.kind === 'zombie' && actor.armorBroken) {
        multiplier *= 1.16;
      }
      multiplier *= actor.tempSpeedMultiplier || 1;
      if (actor.frozenTimer > 0 || actor.stunTimer > 0) {
        multiplier = 0;
      }
      return multiplier;
    }

    getFireRateMultiplier(actor) {
      return actor.colaTimer > 0 ? 1.25 : 1;
    }

    getLiveInput() {
      const local = this.localCharacter;
      const locked = this.isUiBlockingInput() || (this.mode === 'client' && !this.network.isGameplayReady());
      const selectedTool = local ? local.selectedTool : STARTER_WEAPON_KEY;
      return {
        left: !locked && (this.keys.has('a') || this.keys.has('arrowleft')),
        right: !locked && (this.keys.has('d') || this.keys.has('arrowright')),
        forward: !locked && (this.keys.has('w') || this.keys.has('arrowup')),
        back: !locked && (this.keys.has('s') || this.keys.has('arrowdown')),
        jump: !locked && this.keys.has(' '),
        fireHeld: !locked && this.fireHeld,
        cameraYaw: this.camera.yaw,
        cameraPitch: this.camera.pitch,
        firstPerson: this.camera.distance <= 1,
        selectedTool
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
        fireHeld: Boolean(input.fireHeld),
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
      if (!local || local.dead || !this.network.isGameplayReady()) {
        return;
      }
      // A joined zombie claws instead of firing: tell the host to resolve the swipe.
      if (this.versus && local.vsRole === 'zombie') {
        if ((local.clawCooldown || 0) > 0 || this.vs.phase !== 'playing' || this.time < (this.vs.releaseAt || 0)) {
          return;
        }
        const cls = VERSUS_ZOMBIE_CLASSES[local.vsClass] || VERSUS_ZOMBIE_CLASSES.normal;
        local.clawCooldown = cls.swingCooldown || 0.8;
        local.swing = local.swing || { time: 0, duration: 0.34, didHit: false, weaponKey: null };
        local.swing.time = 0.34;
        this.audio.playSwordSwing();
        this.network.sendToolUse({ claw: true });
        return;
      }
      if (!local.selectedTool) {
        return;
      }
      const weapon = getWeaponDef(local.selectedTool);
      if (!weapon || local.toolCooldown > 0) {
        return;
      }

      const viewState = {
        cameraYaw: roundNetworkFloat(input.cameraYaw),
        cameraPitch: roundNetworkFloat(input.cameraPitch),
        firstPerson: Boolean(input.firstPerson)
      };

      const didUse = this.predictClientWeaponUse(local, weapon, viewState);
      if (!didUse) {
        return;
      }
      this.network.sendToolUse({
        selectedTool: local.selectedTool,
        cameraYaw: viewState.cameraYaw,
        cameraPitch: viewState.cameraPitch,
        firstPerson: viewState.firstPerson
      });
    }

    predictClientWeaponUse(local, weapon, viewState) {
      if (weapon.kind === 'build-sentry') {
        if (!this.getSentryPlacement(local, viewState, true)) {
          return false;
        }
        local.toolCooldown = weapon.cooldown;
        this.audio.playDeploy();
        return true;
      }
      if (weapon.kind === 'heal') {
        if (local.health >= local.maxHealth) {
          return false;
        }
        local.toolCooldown = weapon.cooldown;
        this.audio.playHeal();
        return true;
      }
      if (weapon.kind === 'buff') {
        local.toolCooldown = weapon.cooldown;
        local.colaTimer = weapon.buffTime;
        this.audio.playBuff();
        return true;
      }
      if (weapon.kind === 'melee' || weapon.kind === 'melee-repair') {
        local.toolCooldown = weapon.cooldown / this.getFireRateMultiplier(local);
        local.swing.time = weapon.swingTime;
        local.swing.duration = weapon.swingTime;
        local.swing.didHit = true;
        local.swing.weaponKey = weapon.key;
        const look = getAimDirectionFromView(viewState.cameraYaw, viewState.cameraPitch, viewState.firstPerson);
        local.yaw = Math.atan2(look.x, look.z);
        playWeaponAudio(this.audio, weapon);
        return true;
      }
      local.toolCooldown = weapon.cooldown / this.getFireRateMultiplier(local);
      playWeaponAudio(this.audio, weapon);
      return true;
    }

    updateCharacterMotion(character, moveWorld, wantsJump, climbIntent, dt) {
      const moveMag = Math.hypot(moveWorld.x, moveWorld.z);
      const targetSpeed = moveMag > 0.01 ? character.walkSpeed * this.getMoveSpeedMultiplier(character) : 0;
      const desired = moveMag > 0.01 ? vScale(vNormalizeXZ(moveWorld), targetSpeed) : v3();
      const accel = character.grounded ? 80 : 50;

      const flying = character.isLocal && this.debug.available && this.debug.fly && !this.isUiBlockingInput();

      const ladder = flying ? null : this.findLadder(character);
      if (ladder && Math.abs(climbIntent) > 0.05) {
        character.climbing = true;
      }
      if (!ladder || Math.abs(climbIntent) <= 0.01) {
        character.climbing = false;
      }

      if (flying) {
        // Debug fly: free horizontal move, Space to rise, C to descend, no gravity.
        character.vel.x = approach(character.vel.x, desired.x, accel * dt);
        character.vel.z = approach(character.vel.z, desired.z, accel * dt);
        if (moveMag <= 0.01) {
          character.vel.x = approach(character.vel.x, 0, 9 * dt);
          character.vel.z = approach(character.vel.z, 0, 9 * dt);
        }
        const up = this.keys.has(' ') ? 1 : 0;
        const down = (this.keys.has('c') || this.keys.has('control')) ? 1 : 0;
        character.vel.y = (up - down) * 26;
        character.grounded = false;
      } else if (character.climbing && ladder) {
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

        if (wantsJump && character.grounded && character.kind === 'player') {
          character.vel.y = 23.5 * (character.isLocal ? this.scriptJumpPower : 1);
          character.grounded = false;
          if (character.isLocal) {
            this.audio.playJump();
          }
        }

        character.vel.y -= 52 * (character.isLocal ? this.scriptGravity : 1) * dt;
      }

      if (character.isLocal && this.shiftLock.active && !this.camera.firstPerson) {
        // Shift lock: body always faces the camera's forward direction.
        const fwd = cameraViewForwardXZ(this.camera.yaw);
        character.yaw = Math.atan2(fwd.x, fwd.z);
      } else if (moveMag > 0.05) {
        const targetYaw = Math.atan2(desired.x, desired.z);
        character.yaw = turnTowardsAngle(character.yaw, targetYaw, dt * 11);
      }

      character.walkCycle += dt * (0.9 + clamp(moveMag, 0, 1) * 5.6);

      this.moveCharacterAxis(character, 'x', character.vel.x * dt);
      this.moveCharacterAxis(character, 'z', character.vel.z * dt);
      character.grounded = false;
      this.moveCharacterAxis(character, 'y', character.vel.y * dt);

      if (character.pos.y < -18) {
        this.applyDamage(character, { amount: 999, tags: ['void'] }, null, null);
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

    useCurrentWeapon(character, controlState) {
      if (character.dead || !character.selectedTool || character.toolCooldown > 0) {
        return false;
      }

      const weapon = getWeaponDef(character.selectedTool);
      if (!weapon) {
        return false;
      }

      if (character.kind === 'player' && character.isLocal) {
        // Only the local player is bound by the unlocked/loadout list — bots carry their own gear.
        this.ensurePlayerWeapon(character);
        if (!this.availableWeaponKeys.includes(character.selectedTool)) {
          return false;
        }
      }

      const viewState = controlState || {
        cameraYaw: -character.yaw,
        cameraPitch: 0,
        firstPerson: false
      };

      if (weapon.kind === 'melee' || weapon.kind === 'melee-repair') {
        character.toolCooldown = weapon.cooldown / this.getFireRateMultiplier(character);
        character.swing.time = weapon.swingTime;
        character.swing.duration = weapon.swingTime;
        character.swing.didHit = false;
        character.swing.weaponKey = weapon.key;
        const look = getAimDirectionFromView(viewState.cameraYaw, viewState.cameraPitch, viewState.firstPerson);
        character.yaw = Math.atan2(look.x, look.z);
        playWeaponAudio(this.audio, weapon);
        return true;
      }

      if (weapon.kind === 'heal') {
        if (character.health >= character.maxHealth) {
          if (character.isLocal) {
            this.setHint('Save the Sandvich until you actually need healing.', 3.2);
          }
          return false;
        }
        character.health = Math.min(character.maxHealth, character.health + weapon.heal);
        character.toolCooldown = weapon.cooldown;
        character.poisonTimer = 0;
        character.poisonDps = 0;
        if (character.isLocal) {
          this.setHint(`Recovered ${weapon.heal} health.`, 3);
        }
        this.audio.playHeal();
        return true;
      }

      if (weapon.kind === 'buff') {
        character.colaTimer = weapon.buffTime;
        character.toolCooldown = weapon.cooldown;
        if (character.isLocal) {
          this.setHint('Cola active: move and fire faster for a short time.', 4.5);
        }
        this.audio.playBuff();
        return true;
      }

      if (weapon.kind === 'build-sentry') {
        const built = this.placeSentry(character, viewState);
        if (built) {
          character.toolCooldown = weapon.cooldown;
          this.audio.playDeploy();
        }
        return built;
      }

      const didFire = this.spawnWeaponProjectiles(character, weapon, viewState);
      if (didFire) {
        character.toolCooldown = weapon.cooldown / this.getFireRateMultiplier(character);
        playWeaponAudio(this.audio, weapon);
      }
      return didFire;
    }

    getSentryPlacement(character, viewState, showHint = false) {
      const aim = getAimDirectionFromView(viewState.cameraYaw, viewState.cameraPitch, viewState.firstPerson);
      const planarAim = v3(aim.x, 0, aim.z);
      const forward = Math.hypot(planarAim.x, planarAim.z) > 0.0001
        ? vNormalizeXZ(planarAim)
        : yawForward(character.yaw);
      const placePos = vAdd(character.pos, vAdd(vScale(forward, 3.1), v3(0, 0.76, 0)));
      const sentryAabb = {
        min: v3(placePos.x - 1.2, placePos.y - 0.8, placePos.z - 1.2),
        max: v3(placePos.x + 1.2, placePos.y + 2.2, placePos.z + 1.2)
      };
      for (const collider of this.world.colliders) {
        if (collider.solid && aabbOverlap(sentryAabb, collider)) {
          if (showHint && character.isLocal) {
            this.setHint('That spot is blocked. Try placing the sentry somewhere clearer.', 3.5);
          }
          return null;
        }
      }
      return { forward, placePos };
    }

    placeSentry(character, viewState) {
      const placement = this.getSentryPlacement(character, viewState, character.isLocal);
      if (!placement) {
        return false;
      }
      const { forward, placePos } = placement;

      this.sentries = this.sentries.filter((sentry) => sentry.ownerId !== character.id);
      this.sentries.push({
        id: `s-${makeId(8)}`,
        kind: 'sentry',
        ownerId: character.id,
        pos: v3(placePos.x, 0.76, placePos.z),
        yaw: Math.atan2(forward.x, forward.z),
        cooldown: 0.4,
        health: 120,
        maxHealth: 120,
        range: 26,
        life: 999,
        fireRate: 0.24
      });
      if (character.isLocal) {
        this.setHint('Sentry deployed.', 2.8);
      }
      return true;
    }

    tryRepairNearbySentry(character, amount) {
      let best = null;
      let bestDistance = 5.5;
      for (const sentry of this.sentries) {
        const distance = vLength(vSub(vAdd(sentry.pos, v3(0, 1.4, 0)), vAdd(character.pos, v3(0, 3, 0))));
        if (distance < bestDistance) {
          bestDistance = distance;
          best = sentry;
        }
      }
      if (!best) {
        return false;
      }
      best.health = Math.min(best.maxHealth, best.health + amount);
      return true;
    }

    spawnWeaponProjectiles(owner, weapon, viewState) {
      const aimBase = getAimDirectionFromView(viewState.cameraYaw, viewState.cameraPitch, viewState.firstPerson);
      const rightBase = vNormalizeXZ(v3(aimBase.z, 0, -aimBase.x));
      const spawnOrigin = vAdd(vAdd(owner.pos, v3(0, owner.kind === 'player' ? 4.25 : 4.1, 0)), vAdd(vScale(aimBase, 1.7), vScale(rightBase, 0.25)));
      const pelletCount = weapon.pellets || 1;

      for (let pellet = 0; pellet < pelletCount; pellet += 1) {
        const aim = spreadDirection(aimBase, weapon.spread || 0);
        const projectile = {
          id: `proj-${makeId(8)}`,
          projectileKind: weapon.kind,
          ownerId: owner.id,
          ownerKind: owner.kind,
          team: owner.team,
          weaponKey: weapon.key,
          pos: vCopy(spawnOrigin),
          vel: vScale(aim, weapon.speed || 42),
          radius: weapon.radius || 0.16,
          gravity: weapon.gravity || 0,
          bounce: 0,
          life: weapon.life || 2.4,
          damage: weapon.damage || 12,
          color: weapon.color || COLORS.pellet,
          knockback: weapon.knockback || 2,
          spread: weapon.spread || 0,
          splashRadius: weapon.splashRadius || 0,
          slowFactor: weapon.slowFactor || 0,
          slowTime: weapon.slowTime || 0,
          freeze: weapon.freeze || 0,
          poisonDps: weapon.poisonDps || 0,
          poisonTime: weapon.poisonTime || 0,
          hazard: weapon.hazard ? { ...weapon.hazard } : null,
          remainingPierce: weapon.pierce || 0,
          sticky: weapon.kind === 'sticky',
          stuck: false,
          fuse: weapon.fuse || 0,
          armTime: weapon.armDelay || 0,
          recentHits: new Map()
        };
        if (weapon.kind === 'lob' || weapon.kind === 'sticky') {
          projectile.vel.y += 6;
        }
        this.projectiles.push(projectile);
      }
      return true;
    }

    resolveMeleeHit(attacker) {
      const weapon = getWeaponDef(attacker.swing.weaponKey || attacker.selectedTool);
      if (!weapon) {
        return;
      }

      if (weapon.kind === 'melee-repair') {
        this.tryRepairNearbySentry(attacker, weapon.repair || 24);
      }

      const forward = yawForward(attacker.yaw);
      const origin = vAdd(attacker.pos, v3(0, 3.2 * (attacker.renderScale || 1), 0));
      const targets = attacker.team === 'human' ? this.livingZombies : this.getLivingPlayerAndSentryTargets();
      let didHit = false;

      for (const target of targets) {
        if (target.id === attacker.id || target.dead) {
          continue;
        }

        const targetPoint = target.kind === 'sentry'
          ? vAdd(target.pos, v3(0, 1.4, 0))
          : vAdd(target.pos, v3(0, 3, 0));
        const delta = vSub(targetPoint, origin);
        const distance = vLength(delta);
        if (distance > (weapon.range || 4.5)) {
          continue;
        }

        const dir = vNormalize(delta);
        if (vDot(dir, forward) < (weapon.arcCos || 0.15)) {
          continue;
        }

        const packet = {
          amount: weapon.damage,
          direction: forward,
          tags: ['melee'],
          knockback: weapon.knockback || 8,
          stun: weapon.stun || 0,
          bonusVsArmor: weapon.bonusVsArmor || 1
        };
        const impulse = target.kind === 'sentry' ? null : vAdd(vScale(forward, weapon.knockback || 8), v3(0, 4, 0));
        if (this.applyDamage(target, packet, attacker, impulse)) {
          didHit = true;
        }
      }

      if (didHit && attacker.isLocal) {
        this.audio.playHit();
      }
    }

    getLivingPlayerAndSentryTargets() {
      return [
        ...this.livingPlayers,
        ...this.sentries.filter((sentry) => sentry.health > 0)
      ];
    }

    updateZombies(dt) {
      const freezeAI = (this.debug.available && this.debug.freezeAI) || this.scriptFreezeAI
        || (this.versus && this.vs.phase === 'playing' && this.time < (this.vs.releaseAt || 0));
      for (const zombie of [...this.zombies.values()]) {
        this.updateActorState(zombie, dt);
        if (zombie.dead) {
          continue;
        }
        if (freezeAI) {
          // Debug: enemies stop moving and thinking.
          zombie.vel.x = 0;
          zombie.vel.z = 0;
          continue;
        }

        const definition = ZOMBIE_DEFS[zombie.zombieType];
        const target = this.findZombieTarget(zombie);
        if (!target) {
          continue;
        }

        const targetPoint = target.kind === 'sentry' ? vAdd(target.pos, v3(0, 1.4, 0)) : vAdd(target.pos, v3(0, 3, 0));
        const selfPoint = vAdd(zombie.pos, v3(0, 3, 0));
        const toTarget = vSub(targetPoint, selfPoint);
        const planar = vNormalizeXZ(toTarget);
        const distance = vLength(toTarget);
        const disabled = zombie.stunTimer > 0 || zombie.frozenTimer > 0;

        if (zombie.zombieType === 'fast-zombie' && distance > 5) {
          zombie.tempSpeedMultiplier = 1.2 + Math.sin(this.time * 6 + zombie.walkCycle) * 0.1;
        }

        if (!disabled && zombie.zombieType === 'police-zombie') {
          zombie.specialCooldown -= dt;
          if (zombie.specialCooldown <= 0) {
            zombie.specialCooldown = definition.auraCooldown;
            this.emitPoliceAura(zombie, definition);
          }
        }

        if (!disabled && zombie.zombieType === 'medic-zombie') {
          zombie.specialCooldown -= dt;
          if (zombie.specialCooldown <= 0 && this.tryMedicHeal(zombie, definition)) {
            zombie.specialCooldown = definition.specialCooldown;
          }
        }

        let shouldAdvance = true;
        if (!disabled && (zombie.zombieType === 'blaster-soldier-zombie' || zombie.zombieType === 'rival') && distance < definition.shootRange) {
          shouldAdvance = distance > 11;
          zombie.specialCooldown -= dt;
          if (zombie.specialCooldown <= 0) {
            zombie.specialCooldown = definition.specialCooldown;
            this.fireZombieBlaster(zombie, targetPoint);
          }
        } else if (!disabled && zombie.zombieType === 'poison-zombie' && distance < definition.spitRange) {
          shouldAdvance = distance > 9;
          zombie.specialCooldown -= dt;
          if (zombie.specialCooldown <= 0) {
            zombie.specialCooldown = definition.specialCooldown;
            this.firePoisonGlob(zombie, targetPoint);
          }
        }

        let movePlanar = planar;
        if (this.versus && distance > 12) {
          // Versus zombies weave side to side while closing so gunfire is harder to land.
          const s = Math.sin(this.time * 2.5 + zombie.walkCycle * 2);
          const perp = v3(-planar.z, 0, planar.x);
          movePlanar = vNormalizeXZ(vAdd(planar, vScale(perp, s * 0.6)));
        }
        if (shouldAdvance) {
          this.updateCharacterMotion(zombie, movePlanar, false, 0, dt);
          // Stuck against a gravestone or wall? Hop straight over it.
          const groundSpeed = Math.hypot(zombie.vel.x, zombie.vel.z);
          if (groundSpeed < 1.4 && distance > 4) {
            zombie.stuckT = (zombie.stuckT || 0) + dt;
          } else {
            zombie.stuckT = 0;
          }
          if (zombie.stuckT > 0.55 && zombie.grounded) {
            zombie.vel.y = 24;
            zombie.vel.x += planar.x * 6;
            zombie.vel.z += planar.z * 6;
            zombie.stuckT = 0;
          }
        } else {
          this.updateCharacterMotion(zombie, v3(), false, 0, dt);
        }

        if (Math.hypot(planar.x, planar.z) > 0.01) {
          zombie.yaw = Math.atan2(movePlanar.x, movePlanar.z);
        }

        zombie.attackCooldown = Math.max(0, zombie.attackCooldown - dt);
        if (distance <= (definition.meleeRange || 3.2) && zombie.attackCooldown <= 0 && zombie.stunTimer <= 0 && zombie.frozenTimer <= 0) {
          zombie.attackCooldown = definition.attackCooldown;
          this.resolveZombieMelee(zombie, target, definition, planar);
        }
      }
    }

    findZombieTarget(zombie) {
      let best = null;
      let bestScore = Infinity;
      for (const player of this.characters.values()) {
        if (player.dead || player.vsRole === 'zombie') {
          continue;
        }
        const distance = vLength(vSub(player.pos, zombie.pos));
        if (distance < bestScore) {
          bestScore = distance;
          best = player;
        }
      }
      for (const sentry of this.sentries) {
        if (sentry.health <= 0) {
          continue;
        }
        const distance = vLength(vSub(sentry.pos, zombie.pos));
        if (distance < bestScore) {
          bestScore = distance;
          best = sentry;
        }
      }
      return best;
    }

    emitPoliceAura(zombie, definition) {
      for (const ally of this.zombies.values()) {
        if (ally.id === zombie.id || ally.dead) {
          continue;
        }
        if (vLength(vSub(ally.pos, zombie.pos)) > definition.auraRange) {
          continue;
        }
        ally.hasteTimer = Math.max(ally.hasteTimer, definition.auraTime);
        ally.hasteFactor = Math.max(ally.hasteFactor, definition.auraFactor);
      }
      this.hazards.push({
        id: `h-${makeId(6)}`,
        type: 'police-aura',
        pos: vAdd(zombie.pos, v3(0, 0.2, 0)),
        radius: definition.auraRange,
        life: 0.7,
        dps: 0,
        affect: 'none',
        color: COLORS.badge,
        slowFactor: 1,
        slowTime: 0,
        poisonDps: 0,
        poisonTime: 0
      });
    }

    tryMedicHeal(zombie, definition) {
      let target = null;
      let mostMissing = 0;
      for (const ally of this.zombies.values()) {
        if (ally.dead || ally.id === zombie.id) {
          continue;
        }
        const distance = vLength(vSub(ally.pos, zombie.pos));
        if (distance > definition.healRange) {
          continue;
        }
        const missing = ally.maxHealth - ally.health;
        if (missing > mostMissing) {
          mostMissing = missing;
          target = ally;
        }
      }
      if (!target) {
        return false;
      }
      target.health = Math.min(target.maxHealth, target.health + definition.healAmount);
      this.hazards.push({
        id: `h-${makeId(6)}`,
        type: 'medic-heal',
        pos: vAdd(target.pos, v3(0, 2.6, 0)),
        radius: 2.6,
        life: 0.55,
        dps: 0,
        affect: 'none',
        color: COLORS.heal,
        slowFactor: 1,
        slowTime: 0,
        poisonDps: 0,
        poisonTime: 0
      });
      return true;
    }

    resolveZombieMelee(zombie, target, definition, planar) {
      if (target.kind === 'sentry') {
        this.applyDamage(target, { amount: definition.meleeDamage, tags: ['zombie-melee'] }, zombie, null);
        return;
      }

      // Zombie Versus: claws wound the human — infection happens when their health hits zero.
      if (this.versus && this.vs.phase === 'playing' && target.vsRole !== 'zombie') {
        if (target.forcefield > 0) {
          target.vel = vAdd(target.vel, vAdd(vScale(planar, 6), v3(0, 2, 0)));
          return;
        }
        const clawDamage = Math.max(22, definition.meleeDamage || 0);
        this.applyDamage(target, { amount: clawDamage, direction: planar, tags: ['zombie-claw'], knockback: 6 }, zombie, vAdd(vScale(planar, 5), v3(0, 1.8, 0)));
        return;
      }
      if (this.versus) {
        target.vel = vAdd(target.vel, vAdd(vScale(planar, 6), v3(0, 2, 0)));
        return;
      }

      const packet = {
        amount: definition.meleeDamage,
        direction: planar,
        tags: ['zombie-melee'],
        knockback: definition.key === 'tank-zombie' ? 12 : 6,
        poisonDps: definition.key === 'poison-zombie' ? definition.poisonDps : 0,
        poisonTime: definition.key === 'poison-zombie' ? definition.poisonTime : 0
      };
      const impulse = vAdd(vScale(planar, definition.key === 'tank-zombie' ? 10 : 6), v3(0, 2.6, 0));
      this.applyDamage(target, packet, zombie, impulse);

      if (definition.slamRadius) {
        for (const player of this.characters.values()) {
          if (player.id === target.id || player.dead) {
            continue;
          }
          if (vLength(vSub(player.pos, zombie.pos)) > definition.slamRadius) {
            continue;
          }
          this.applyDamage(player, { amount: definition.meleeDamage * 0.55, direction: planar, tags: ['zombie-slam'], knockback: 8 }, zombie, vAdd(vScale(planar, 7), v3(0, 2, 0)));
        }
      }
    }

    fireZombieBlaster(zombie, targetPoint) {
      const aim = vNormalize(vSub(targetPoint, vAdd(zombie.pos, v3(0, 4.1, 0))));
      this.projectiles.push({
        id: `proj-${makeId(8)}`,
        projectileKind: 'zombie-blaster',
        ownerId: zombie.id,
        ownerKind: 'zombie',
        team: 'zombie',
        weaponKey: 'zombie-blaster',
        pos: vAdd(zombie.pos, vAdd(v3(0, 4.1, 0), vScale(aim, 1.4))),
        vel: vScale(aim, 42),
        radius: 0.2,
        gravity: 0,
        bounce: 0,
        life: 3,
        damage: 13,
        color: COLORS.toxic,
        knockback: 5,
        spread: 0,
        splashRadius: 2.2,
        slowFactor: 0,
        slowTime: 0,
        freeze: 0,
        poisonDps: 0,
        poisonTime: 0,
        hazard: null,
        remainingPierce: 0,
        sticky: false,
        stuck: false,
        fuse: 0,
        armTime: 0,
        recentHits: new Map()
      });
    }

    firePoisonGlob(zombie, targetPoint) {
      const aim = vNormalize(vSub(targetPoint, vAdd(zombie.pos, v3(0, 4, 0))));
      this.projectiles.push({
        id: `proj-${makeId(8)}`,
        projectileKind: 'poison-glob',
        ownerId: zombie.id,
        ownerKind: 'zombie',
        team: 'zombie',
        weaponKey: 'poison-glob',
        pos: vAdd(zombie.pos, vAdd(v3(0, 4, 0), vScale(aim, 1.2))),
        vel: vAdd(vScale(aim, 24), v3(0, 4.5, 0)),
        radius: 0.26,
        gravity: 22,
        bounce: 0,
        life: 4.4,
        damage: 8,
        color: COLORS.toxicDark,
        knockback: 2.8,
        spread: 0,
        splashRadius: 2.8,
        slowFactor: 0.82,
        slowTime: 1.2,
        freeze: 0,
        poisonDps: 5,
        poisonTime: 4.8,
        hazard: {
          type: 'poison-puddle',
          radius: 3.2,
          life: 4.2,
          dps: 3.6,
          slowFactor: 0.84,
          slowTime: 0.3,
          affect: 'human',
          color: COLORS.poisonCloud,
          poisonDps: 5,
          poisonTime: 2.2
        },
        remainingPierce: 0,
        sticky: false,
        stuck: false,
        fuse: 0,
        armTime: 0,
        recentHits: new Map()
      });
    }

    updateSentries(dt) {
      const survivors = [];
      for (const sentry of this.sentries) {
        sentry.cooldown = Math.max(0, sentry.cooldown - dt);
        if (sentry.health <= 0) {
          continue;
        }
        // In Versus, player-kind green zombies count as targets too — not just zombie-kind.
        const sentryTargets = this.versus
          ? this.humanProjectileTargets().filter((t) => !t.dead)
          : this.livingZombies;
        const target = findNearestBy(sentryTargets, sentry.pos, sentry.range);
        if (target) {
          sentry.yaw = Math.atan2(target.pos.x - sentry.pos.x, target.pos.z - sentry.pos.z);
          if (sentry.cooldown <= 0) {
            sentry.cooldown = sentry.fireRate;
            const origin = vAdd(sentry.pos, v3(0, 1.7, 0));
            const aim = vNormalize(vSub(vAdd(target.pos, v3(0, 3, 0)), origin));
            this.projectiles.push({
              id: `proj-${makeId(8)}`,
              projectileKind: 'sentry-bullet',
              ownerId: sentry.id,
              ownerKind: 'sentry',
              team: 'human',
              weaponKey: 'sentry-builder',
              pos: vAdd(origin, vScale(aim, 0.9)),
              vel: vScale(aim, 64),
              radius: 0.12,
              gravity: 0,
              bounce: 0,
              life: 2.2,
              damage: 10,
              color: COLORS.sentry,
              knockback: 2,
              spread: 0,
              splashRadius: 0,
              slowFactor: 0,
              slowTime: 0,
              freeze: 0,
              poisonDps: 0,
              poisonTime: 0,
              hazard: null,
              remainingPierce: 0,
              sticky: false,
              stuck: false,
              fuse: 0,
              armTime: 0,
              recentHits: new Map()
            });
          }
        }
        survivors.push(sentry);
      }
      this.sentries = survivors;
    }

    updateProjectiles(dt, canDamage) {
      const survivors = [];
      for (const projectile of this.projectiles) {
        projectile.life -= dt;
        projectile.armTime = Math.max(0, (projectile.armTime || 0) - dt);
        if (projectile.life <= 0) {
          if (projectile.sticky) {
            this.explodeProjectile(projectile, projectile.pos, canDamage);
          }
          continue;
        }

        if (projectile.sticky && projectile.stuck) {
          projectile.fuse -= dt;
          if (projectile.fuse <= 0 || this.hasZombieNearSticky(projectile)) {
            this.explodeProjectile(projectile, projectile.pos, canDamage);
            continue;
          }
          survivors.push(projectile);
          continue;
        }

        const steps = clamp(Math.ceil(vLength(projectile.vel) * dt / 2), 1, 6);
        const stepDt = dt / steps;
        let alive = true;

        for (let step = 0; step < steps && alive; step += 1) {
          projectile.vel.y -= projectile.gravity * stepDt;
          projectile.pos = vAdd(projectile.pos, vScale(projectile.vel, stepDt));

          for (const collider of this.world.colliders) {
            if (!collider.solid || collider.transparentOnly) {
              continue;
            }
            const hit = sphereAabbCollision(projectile.pos, projectile.radius, collider);
            if (!hit) {
              continue;
            }

            if (projectile.sticky) {
              projectile.stuck = true;
              projectile.vel = v3();
              projectile.gravity = 0;
              projectile.pos = vAdd(projectile.pos, vScale(hit.normal, hit.penetration + 0.02));
              break;
            }

            if (projectile.hazard || projectile.splashRadius > 0 || projectile.projectileKind === 'poison-glob') {
              this.explodeProjectile(projectile, projectile.pos, canDamage);
            } else {
              if (projectile.hazard) {
                this.spawnHazard(projectile.pos, projectile.hazard);
              }
            }
            alive = false;
            break;
          }

          if (!alive || !canDamage) {
            continue;
          }

          const targets = projectile.team === 'human'
            ? this.humanProjectileTargets()
            : [...this.characters.values(), ...this.sentries.filter((sentry) => sentry.health > 0)];

          for (const target of targets) {
            if ((target.dead ?? false) || target.id === projectile.ownerId) {
              continue;
            }
            // Zombie throwables never splash fellow zombies.
            if (this.versus && projectile.team === 'zombie' && target.vsRole === 'zombie') {
              continue;
            }
            if (target.kind === 'sentry') {
              if (!sphereIntersectsAabb(projectile.pos, projectile.radius, getSentryAabb(target))) {
                continue;
              }
            } else if (!sphereIntersectsAabb(projectile.pos, projectile.radius, getCharacterAabb(target))) {
              continue;
            }

            const recent = projectile.recentHits.get(target.id) || -999;
            if (this.time - recent < 0.18) {
              continue;
            }
            projectile.recentHits.set(target.id, this.time);

            if (projectile.splashRadius > 0 && (projectile.projectileKind === 'sticky' || projectile.projectileKind === 'poison-glob' || projectile.projectileKind === 'zombie-blaster')) {
              this.explodeProjectile(projectile, projectile.pos, canDamage);
              alive = false;
              break;
            }

            const dir = vNormalize(vSub((target.kind === 'sentry' ? vAdd(target.pos, v3(0, 1.2, 0)) : vAdd(target.pos, v3(0, 2, 0))), projectile.pos));
            const packet = {
              amount: projectile.damage,
              direction: vNormalize(projectile.vel),
              tags: [projectile.weaponKey || projectile.projectileKind],
              knockback: projectile.knockback,
              slowFactor: projectile.slowFactor,
              slowTime: projectile.slowTime,
              freeze: projectile.freeze,
              poisonDps: projectile.poisonDps,
              poisonTime: projectile.poisonTime
            };
            const impulse = target.kind === 'sentry' ? null : vAdd(vScale(dir, projectile.knockback || 2), v3(0, 1.8, 0));
            this.applyDamage(target, packet, this.resolveSourceEntity(projectile), impulse);

            if (projectile.hazard) {
              this.spawnHazard(projectile.pos, projectile.hazard);
            }

            if (projectile.remainingPierce > 0) {
              projectile.remainingPierce -= 1;
              projectile.damage *= 0.72;
            } else {
              alive = false;
              break;
            }
          }
        }

        if (alive) {
          survivors.push(projectile);
        }
      }
      this.projectiles = survivors;
    }

    hasZombieNearSticky(projectile) {
      if (!projectile.sticky || projectile.armTime > 0) {
        return false;
      }
      for (const zombie of this.zombies.values()) {
        if (zombie.dead) {
          continue;
        }
        if (vLength(vSub(zombie.pos, projectile.pos)) <= 3.2) {
          return true;
        }
      }
      return false;
    }

    resolveSourceEntity(projectile) {
      if (projectile.ownerKind === 'sentry') {
        return { kind: 'sentry', id: projectile.ownerId };
      }
      if (projectile.ownerKind === 'zombie') {
        return this.zombies.get(projectile.ownerId) || null;
      }
      return this.characters.get(projectile.ownerId) || null;
    }

    explodeProjectile(projectile, position, canDamage) {
      if (projectile.hazard) {
        this.spawnHazard(position, projectile.hazard);
      }
      if (!canDamage || projectile.splashRadius <= 0) {
        return;
      }
      const targets = projectile.team === 'human'
        ? this.humanProjectileTargets()
        : [...this.characters.values(), ...this.sentries.filter((sentry) => sentry.health > 0)];
      for (const target of targets) {
        if ((target.dead ?? false) || target.id === projectile.ownerId) {
          continue;
        }
        if (this.versus && projectile.team === 'zombie' && target.vsRole === 'zombie') {
          continue;
        }
        const point = target.kind === 'sentry' ? vAdd(target.pos, v3(0, 1.2, 0)) : vAdd(target.pos, v3(0, 2.3, 0));
        const distance = vLength(vSub(point, position));
        if (distance > projectile.splashRadius) {
          continue;
        }
        const factor = 1 - distance / projectile.splashRadius;
        const packet = {
          amount: projectile.damage * (0.45 + factor * 0.55),
          direction: vNormalize(vSub(point, position)),
          tags: ['explosive', projectile.weaponKey || projectile.projectileKind],
          knockback: (projectile.knockback || 6) * (0.5 + factor * 0.5),
          slowFactor: projectile.slowFactor,
          slowTime: projectile.slowTime,
          freeze: projectile.freeze,
          poisonDps: projectile.poisonDps,
          poisonTime: projectile.poisonTime
        };
        const impulse = target.kind === 'sentry' ? null : vAdd(vScale(packet.direction, packet.knockback), v3(0, 2.2 + factor * 2.2, 0));
        this.applyDamage(target, packet, this.resolveSourceEntity(projectile), impulse);
      }
    }

    spawnHazard(position, hazardDef) {
      this.hazards.push({
        id: `h-${makeId(6)}`,
        type: hazardDef.type,
        pos: vCopy(position),
        radius: hazardDef.radius,
        life: hazardDef.life,
        dps: hazardDef.dps || 0,
        affect: hazardDef.affect,
        color: hazardDef.color,
        slowFactor: hazardDef.slowFactor || 1,
        slowTime: hazardDef.slowTime || 0,
        poisonDps: hazardDef.poisonDps || 0,
        poisonTime: hazardDef.poisonTime || 0
      });
    }

    updateHazards(dt, canDamage) {
      const survivors = [];
      for (const hazard of this.hazards) {
        hazard.life -= dt;
        if (hazard.life <= 0) {
          continue;
        }
        if (canDamage && hazard.affect !== 'none') {
          const targets = hazard.affect === 'zombie' ? this.zombies.values() : this.characters.values();
          for (const target of targets) {
            if (target.dead) {
              continue;
            }
            // Human-hurting hazards (acid pools etc.) never burn fellow zombies.
            if (this.versus && hazard.affect === 'human' && target.vsRole === 'zombie') {
              continue;
            }
            const point = vAdd(target.pos, v3(0, 1.2, 0));
            if (vLength(vSub(point, hazard.pos)) > hazard.radius) {
              continue;
            }
            if (hazard.dps > 0) {
              this.applyDamage(target, { amount: hazard.dps * dt, tags: [hazard.type] }, null, null, true);
            }
            if (hazard.slowFactor < 1) {
              target.slowTimer = Math.max(target.slowTimer, hazard.slowTime || 0.2);
              target.slowFactor = Math.min(target.slowFactor, hazard.slowFactor);
            }
            if (hazard.poisonDps > 0) {
              target.poisonTimer = Math.max(target.poisonTimer, hazard.poisonTime);
              target.poisonDps = Math.max(target.poisonDps, hazard.poisonDps);
            }
          }
        }
        survivors.push(hazard);
      }
      this.hazards = survivors;
    }

    updateClientEffects(dt) {
      const projectileSurvivors = [];
      for (const projectile of this.projectiles) {
        projectile.life -= dt;
        projectile.armTime = Math.max(0, (projectile.armTime || 0) - dt);
        if (projectile.life <= 0) {
          continue;
        }
        if (!(projectile.sticky && projectile.stuck)) {
          projectile.vel.y -= (projectile.gravity || 0) * dt;
          projectile.pos = vAdd(projectile.pos, vScale(projectile.vel, dt));
        } else {
          projectile.fuse = Math.max(0, projectile.fuse - dt);
        }
        projectileSurvivors.push(projectile);
      }
      this.projectiles = projectileSurvivors;

      const hazardSurvivors = [];
      for (const hazard of this.hazards) {
        hazard.life -= dt;
        if (hazard.life > 0) {
          hazardSurvivors.push(hazard);
        }
      }
      this.hazards = hazardSurvivors;
    }

    updateCorpses(dt) {
      const survivors = [];
      for (const corpse of this.corpses) {
        corpse.timer -= dt;
        if (corpse.timer <= 0) {
          continue;
        }

        for (const part of corpse.parts) {
          part.rot = vAdd(part.rot, vScale(part.spin, dt));
          part.vel.y -= 42 * dt;
          part.pos = vAdd(part.pos, vScale(part.vel, dt));

          const collisionRadius = Math.max(part.size.x, part.size.y, part.size.z) * 0.28;
          for (const collider of this.world.colliders) {
            if (!collider.solid || collider.transparentOnly) {
              continue;
            }
            const hit = sphereAabbCollision(part.pos, collisionRadius, collider);
            if (!hit) {
              continue;
            }
            part.pos = vAdd(part.pos, vScale(hit.normal, hit.penetration + 0.01));
            part.vel = reflect(part.vel, hit.normal, hit.normal.y > 0.45 ? 0.18 : 0.08);
            if (hit.normal.y > 0.45) {
              part.vel.x *= 0.9;
              part.vel.z *= 0.9;
              if (Math.abs(part.vel.y) < 1.1) {
                part.vel.y = 0;
              }
            }
          }

          const airDrag = Math.max(0, 1 - dt * 0.4);
          const spinDrag = Math.max(0, 1 - dt * 0.9);
          part.vel.x *= airDrag;
          part.vel.z *= airDrag;
          part.spin = vScale(part.spin, spinDrag);
        }

        survivors.push(corpse);
      }
      this.corpses = survivors;
    }

    applyDamage(target, damage, source, impulse, directOnly = false) {
      if (!target || (target.dead ?? false)) {
        return false;
      }
      const packet = typeof damage === 'number' ? { amount: damage, tags: [] } : { ...damage };
      let amount = packet.amount || 0;
      if (amount <= 0) {
        return false;
      }

      // Script "your damage ×" boosts damage dealt by shots/melee the local player owns.
      if (target.kind === 'zombie' && this.scriptDamageMul !== 1) {
        const owner = resolveHumanOwner(source, this.characters, this.sentries);
        if (owner && owner.isLocal) {
          amount *= this.scriptDamageMul;
          packet.amount = amount;
        }
      }

      if (target.isLocal && ((this.debug.available && this.debug.infiniteHp) || this.scriptInvincible)) {
        return false;
      }

      if (!directOnly && target.forcefield > 0) {
        return false;
      }

      if (target.kind === 'sentry') {
        target.health -= amount;
        if (target.health <= 0) {
          this.sentries = this.sentries.filter((sentry) => sentry.id !== target.id);
        }
        return true;
      }

      if (target.kind === 'zombie') {
        const def = ZOMBIE_DEFS[target.zombieType];
        if (target.zombieType === 'shield-zombie' && packet.direction) {
          const incoming = vNormalizeXZ(packet.direction);
          const forward = yawForward(target.yaw);
          if (vDot(incoming, forward) < -0.45) {
            amount *= 1 - def.frontReduction;
          }
        }
        if (target.armor > 0) {
          const armorMultiplier = packet.bonusVsArmor || 1;
          const damageToArmor = Math.min(target.armor, amount * armorMultiplier);
          target.armor = Math.max(0, target.armor - damageToArmor);
          amount = Math.max(0, amount - damageToArmor * 0.55);
          if (target.armor <= 0) {
            target.armorBroken = true;
          }
        }
        if (def.immunePoison && packet.poisonDps) {
          packet.poisonDps = 0;
          packet.poisonTime = 0;
        }
        if (def.immuneGoo && packet.tags?.includes('goo-blaster')) {
          packet.slowFactor = 1;
          packet.slowTime = 0;
        }
        if (def.immuneIceSlow && packet.freeze) {
          packet.freeze *= 0.25;
        }
      }

      target.health = Math.max(0, target.health - amount);
      target.lastDamageAgo = 0;
      // Remember poison/acid hits so a death within moments crumbles them to ash.
      if (packet.tags && packet.tags.some((tag) => /poison|acid/.test(tag))) {
        target.ashDeath = this.time;
      }
      if (target.isLocal && !directOnly) {
        this.runStudioScripts('onPlayerHurt');
      }
      if (impulse && target.kind !== 'sentry') {
        target.vel = vAdd(target.vel, impulse);
      }
      if (packet.slowFactor && packet.slowFactor < 1) {
        target.slowTimer = Math.max(target.slowTimer, packet.slowTime || 0.2);
        target.slowFactor = Math.min(target.slowFactor, packet.slowFactor);
      }
      if (packet.poisonDps && packet.poisonTime) {
        target.poisonTimer = Math.max(target.poisonTimer, packet.poisonTime);
        target.poisonDps = Math.max(target.poisonDps, packet.poisonDps);
      }
      if (packet.freeze) {
        target.freezeMeter += packet.freeze;
        if (target.freezeMeter >= 1.4) {
          target.freezeMeter = 0;
          target.frozenTimer = Math.max(target.frozenTimer, 1.1);
        }
      }
      if (packet.stun) {
        target.stunTimer = Math.max(target.stunTimer, packet.stun);
      }
      if (target.kind === 'player') {
        target.damageFlash = Math.min(0.8, target.damageFlash + 0.5);
      }
      if (target.kind === 'zombie' && target.zombieType === 'cloak-zombie') {
        target.cloakRevealUntil = this.time + 4;
      }

      if (target.health <= 0) {
        if (target.kind === 'player') {
          this.killPlayer(target, source);
        } else if (target.kind === 'zombie') {
          this.killZombie(target, source);
        }
      }
      return true;
    }

    // Recent poison/acid victims burst into ash instead of body parts.
    corpseFor(target) {
      if (target.ashDeath && this.time - target.ashDeath < 2.5) {
        return createAshCorpse(target);
      }
      return createCorpse(target);
    }

    killPlayer(target, source, reasonOverride = '') {
      if (target.dead) {
        return;
      }

      // Zombie Versus: a player-kind green zombie (local or infected bot) getting shot down
      // is only a temporary knockout — they claw their way back at the perimeter.
      if (this.versus && this.vs.phase === 'playing' && target.vsRole === 'zombie') {
        target.dead = true;
        target.health = 0;
        this.corpses.push(this.corpseFor(target));
        const killer = resolveHumanOwner(source, this.characters, this.sentries);
        if (killer) {
          killer.ko += 1;
          if (killer.isLocal) this.audio.playHit();
        }
        this.vs.playerRespawns = this.vs.playerRespawns || [];
        this.vs.playerRespawns.push({ id: target.id, at: this.time + 5, isLocal: Boolean(target.isLocal) });
        if (target.isLocal) {
          this.audio.playDeath();
          this.setHint('Knocked down! You will rise again at the graveyard edge in a few seconds...', 4);
        } else if (this.time - (this.vs.lastDownChatAt || -99) > 8) {
          // Throttled so a farmed zombie doesn't flood the chat.
          this.vs.lastDownChatAt = this.time;
          this.pushChat('System', `${target.name} was blasted back to the grave — reviving soon.`, true);
        }
        return;
      }

      // Zombie Versus: a human clawed down to zero doesn't die — they turn.
      if (this.versus && this.vs.phase === 'playing' && target.vsRole !== 'zombie') {
        if (source && source.ko !== undefined) {
          source.ko += 1;
        }
        // If they were knocked into the void, drag them back to solid ground first.
        if (target.pos.y < -4) {
          const a = Math.random() * TAU;
          target.pos = v3(Math.sin(a) * 50, 0.6, Math.cos(a) * 50);
          target.vel = v3();
        }
        // Acid/poison victims visibly crumble to ash as they turn.
        if (target.ashDeath && this.time - target.ashDeath < 2.5) {
          this.corpses.push(createAshCorpse(target));
          target.ashDeath = 0;
        }
        this.audio.playDeath();
if (target.isLocal) {
  this.infectLocal();
} else {
  // infectHumanBot works perfectly for remote human players too!
  this.infectHumanBot(target); 
}
        return;
      }

      target.dead = true;
      target.health = 0;
      target.wo += 1;
      this.corpses.push(this.corpseFor(target));

      const speaker = reasonOverride
        ? `${target.name} ${reasonOverride}.`
        : source && source.kind === 'zombie'
          ? `${target.name} was overrun by ${source.name}.`
          : source && source.kind === 'sentry'
            ? `${target.name} was destroyed in the chaos.`
            : `${target.name} was knocked out.`;
      this.pushChat('System', speaker, true);
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(speaker);
      }

      if (target.isLocal) {
        this.audio.playDeath();
        this.setHint('You went down! You will respawn automatically when the next wave begins.', 5);
      }

      if (!this.livingPlayers.length) {
        this.endRun('The team was wiped out.');
      }
    }

    killZombie(zombie, source) {
      if (zombie.dead) {
        return;
      }
      zombie.dead = true;
      zombie.health = 0;
      this.corpses.push(this.corpseFor(zombie));
      this.zombies.delete(zombie.id);

      if (this.versus && zombie.isBot && this.vs.phase === 'playing') {
        // Zombie is only knocked out — it claws its way back a few seconds later.
        const killer = resolveHumanOwner(source, this.characters, this.sentries);
        if (killer) {
          killer.ko += 1;
          if (killer.isLocal) this.audio.playHit();
        }
        this.vs.respawns = this.vs.respawns || [];
        this.vs.respawns.push(this.time + 6);
        return;
      }

      this.runStudioScripts('onZombieKilled');
      const killer = resolveHumanOwner(source, this.characters, this.sentries);
      if (killer) {
        killer.ko += 1;
        if (killer.isLocal) {
          this.audio.playHit();
        }
      }

      if (zombie.zombieType === 'hazmat-zombie') {
        this.spawnHazard(vAdd(zombie.pos, v3(0, 0.2, 0)), {
          type: 'hazmat-cloud',
          radius: 3.4,
          life: 4.8,
          dps: 4.1,
          slowFactor: 0.86,
          slowTime: 0.28,
          affect: 'human',
          color: COLORS.poisonCloud,
          poisonDps: 5,
          poisonTime: 2.8
        });
      }
    }

    endRun(reason) {
      if (this.round.phase === 'gameover') {
        return;
      }
      this.round.phase = 'gameover';
      this.round.spawnQueue = [];
      this.round.spawnBudgetRemaining = 0;
      this.round.gameOverReason = reason;
      const payout = calculateGoldPayout(this.round.lastClearedWave);
      this.round.payoutGold = payout;
      if (payout > 0) {
        this.sharedArmory.gold += payout;
      }
      this.zombies.clear();
      this.projectiles = [];
      this.hazards = [];
      this.audio.stopMusic();
      this.round.autoRestartAt = this.time + AUTO_RESTART_DELAY;
      this.setHint(`${reason} Survived ${this.round.lastClearedWave} wave${this.round.lastClearedWave === 1 ? '' : 's'}. Respawning the whole team in ${Math.round(AUTO_RESTART_DELAY)}s...`, AUTO_RESTART_DELAY);
      this.pushChat('System', reason, true);
      if (payout > 0) {
        const payoutMessage = `Team earned ${payout} gold for surviving ${this.round.lastClearedWave} waves.`;
        this.pushChat('System', payoutMessage, true);
        if (this.mode === 'host') {
          this.network.broadcastSystemChat(payoutMessage);
        }
      }
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(reason);
      }
      this.refreshAllUi(true);
    }

    // ===================== ZOMBIE VERSUS =====================
    setWorld(blocks, worldTag) {
      this.world = buildWorldFromBlocks(blocks);
      this.renderer.setStaticWorld(this.world);
      if (worldTag) {
        this.vsWorldTag = worldTag;
      }
    }

    // Client-side: rebuild the world to match the host's current versus stage.
    applyVersusWorldTag(tag) {
      if (!tag || tag === this.vsWorldTag) {
        return;
      }
      if (tag === 'lobby') {
        this.setWorld(makeVersusLobby(), 'lobby');
      } else if (tag.startsWith('map:')) {
        const idx = Number(tag.slice(4)) || 0;
        const map = VERSUS_MAPS[idx % VERSUS_MAPS.length] || VERSUS_MAPS[0];
        this.setWorld(map.build(), tag);
      }
    }

    ensureVersusLabel() {
      if (this.vsLabel) {
        return;
      }
      const el = document.createElement('div');
      el.className = 'versus-pad-label';
      el.textContent = 'All Alone? Summon A Bot To Play Against!';
      this.dom.labelLayer.appendChild(el);
      this.vsLabel = el;
    }

    enterLobby() {
      this.ensureVersusLabel();
      this.vs.phase = 'lobby';
      this.vs.countdown = 0;
      this.vs.result = '';
      this.vs.weaponSelectOpen = false;
      this.vs.showcase = null;
      if (this.dom.victoryBanner) this.dom.victoryBanner.classList.add('hidden');
      if (this.dom.weaponSelectWindow) this.dom.weaponSelectWindow.classList.add('hidden');
      if (this.dom.zombieClassPanel) this.dom.zombieClassPanel.classList.add('hidden');
      this.setWorld(makeVersusLobby(), 'lobby');
      this.audio.stopMusic();
      // Keep the same crew for the next round: rebuild however many bots were playing.
      const keepBots = Math.min(5, this.vs.bots.length + [...this.zombies.values()].filter((z) => z.isBot).length);
      this.removeAllBots();
      this.zombies.clear();
      this.projectiles = [];
      for (let i = 0; i < keepBots; i += 1) {
        const bot = this.makeVersusBot('human');
        bot.pos = v3(randRange(-10, 10), 0.6, randRange(2, 12));
      }
      if (keepBots > 0) {
        this.pushChat('System', `The crew is back in the lobby — next round starts soon!`, true);
      }
      const local = this.localCharacter;
      if (local) {
        this.restoreHumanForm(local);
        local.pos = v3(0, 0.6, -8);
        local.forcefield = 0;
        local.selectedTool = null;
      }
      this.refreshAllUi(true);
      this.setHint('Lobby — step the GREEN pad to summon a bot (up to 5), RED pad to clear them.', 8);
    }

    makeVersusBot(role) {
      const spawn = v3(randRange(-8, 8), 0.6, randRange(6, 12));
      const character = this.createPlayerCharacter({
        id: `bot-${makeId(6)}`,
        name: `Bot ${this.vs.bots.length + 1}`,
        spawn,
        avatarPreset: 'regular',
        isLocal: false
      });
      character.isBot = true;
      character.vsRole = role || 'human';
      character.remoteInput = makeNeutralInput();
      character.botTimer = 0;
      this.addCharacter(character);
      this.vs.bots.push(character);
      return character;
    }

    summonBot() {
      if (this.vs.bots.length >= 5) {
        this.setHint('Bot limit reached (5).', 2);
        return;
      }
      const bot = this.makeVersusBot('human');
      bot.pos = v3(-6, 0.6, 5);
      this.setHint(`Summoned a bot (${this.vs.bots.length}/5). Round starts when at least 1 bot is in.`, 3);
    }

    removeAllBots() {
      for (const bot of this.vs.bots) {
        this.removeCharacter(bot.id);
      }
      this.vs.bots = [];
      for (const zombie of [...this.zombies.values()]) {
        if (zombie.isBot) {
          this.zombies.delete(zombie.id);
        }
      }
    }

    versusParticipantCount() {
      return 1 + this.vs.bots.length + [...this.zombies.values()].filter((z) => z.isBot).length;
    }

    startVersusRound() {
      this.vs.round += 1;
      this.vs.respawns = [];
      this.vs.playerRespawns = [];
      this.vs.classCooldown = 0;
      this.vs.classCooldownMax = 8;
      this.vs.weaponSelectOpen = false;
      // Rotate the arena each round: graveyard → backyard → Christmas village.
      const mapIndex = (this.vs.round - 1) % VERSUS_MAPS.length;
      const map = VERSUS_MAPS[mapIndex];
      this.vs.mapIndex = mapIndex;
      this.setWorld(map.build(), `map:${mapIndex}`);
      this.pushChat('System', `Map: ${map.name}`, true);
      this.zombies.clear();
      this.projectiles = [];
      const local = this.localCharacter;
      // Everyone starts as a candidate; pick who is a zombie.
      const humans = [...this.characters.values()].filter(Boolean);
      const total = humans.length;
      const zombieCount = Math.max(1, Math.floor(total / 3));
      const shuffled = shuffleArray(humans.slice());
      const startingZombies = new Set(shuffled.slice(0, zombieCount));

      // Humans scatter around the inner arena; zombies spawn on the far perimeter.
      const humanSpawn = (i, n) => {
        const a = (i / Math.max(1, n)) * TAU + 0.4;
        const r = 12 + Math.random() * 14;
        return v3(Math.sin(a) * r, 0.6, Math.cos(a) * r);
      };
      const zombieSpawn = (i, n) => {
        const a = (i / Math.max(1, n)) * TAU;
        return v3(Math.sin(a) * 58, 0.6, Math.cos(a) * 58);
      };

      let hi = 0;
      let zi = 0;
      for (const person of humans) {
        if (startingZombies.has(person)) {
if (person.isLocal) {
  this.makeLocalZombie(person, zombieSpawn(zi, zombieCount));
} else if (person.isBot) {
  this.convertBotToZombie(person, zombieSpawn(zi, zombieCount));
} else {
  // Remote players just need their stats and role updated, not a bot replacement
  this.infectHumanBot(person); 
  person.pos = zombieSpawn(zi, zombieCount);
}
          zi += 1;
        } else {
          this.restoreHumanForm(person);
          person.pos = humanSpawn(hi, total - zombieCount);
          person.vel = v3();
          person.dead = false;
          person.health = person.maxHealth;
          person.forcefield = 5;
          if (person.isBot) {
            person.vsPrimary = this.pickBotWeapon();
            person.vsSidearm = Math.random() < 0.5 ? 'super-shotgun' : 'revolver';
            person.selectedTool = person.vsPrimary;
          } else {
            person.selectedTool = STARTER_WEAPON_KEY;
          }
          // Survivors get a bigger health pool so a single claw swipe never ends them.
          person.maxHealth = 140;
          person.health = 140;
          hi += 1;
        }
      }
      // Humans get the full non-VIP arsenal to switch between.
      this.round.unlockedBaseKeys = [STARTER_WEAPON_KEY, ...BASE_WEAPON_LANES.flat()];
      this.sharedArmory.ownedVipKeys.clear();

      this.vs.roundLimit = 90 + total * 15;
      this.vs.timer = this.vs.roundLimit;
      this.vs.lastHumanCount = total - zombieCount;
      this.vs.releaseAt = this.time + 6;
      this.vs.phase = 'playing';
      this.audio.playWaveMusic();
      this.refreshAllUi(true);
      // Survivors pick a loadout during the release window; zombies get the transform panel.
      if (local && local.vsRole !== 'zombie') {
        this.openWeaponSelect();
      }
      this.updateZombieClassPanel(true);
      this.pushChat('System', `Round ${this.vs.round}! Zombies release in 6s. Humans: pick a loadout and survive ${Math.round(this.vs.timer)}s!`, true);
    }

    pickBotWeapon() {
      const options = ['rifle', 'revolver', 'regular-blaster', 'super-shotgun', 'minigun'];
      return options[Math.floor(Math.random() * options.length)];
    }

    applyVersusClass(character, className) {
      const key = VERSUS_ZOMBIE_CLASSES[className] ? className : 'normal';
      const cls = VERSUS_ZOMBIE_CLASSES[key];
      character.vsClass = key;
      character.walkSpeed = cls.speed;
      character.maxHealth = cls.health;
      character.health = cls.health;
      character.renderScale = cls.scale;
    }

    randomVersusClass() {
      const pool = ['normal', 'crawler', 'chef', 'dumb', 'ghost', 'pumpkin', 'doctor'];
      return pool[Math.floor(Math.random() * pool.length)];
    }

    makeLocalZombie(character, spawn) {
      character.vsRole = 'zombie';
      character.infected = true;
      character.bodyColors = versusZombieColors(getAvatarPreset(character.avatarPreset).bodyColors);
      character.pos = vCopy(spawn);
      character.vel = v3();
      character.dead = false;
      character.forcefield = 1.5;
      character.selectedTool = null;
      character.swing = { time: 0, duration: 0.34, didHit: false, weaponKey: null };
      this.applyVersusClass(character, character.vsClass || 'normal');
      character.health = character.maxHealth;
      this.playTransformEffect(character);
      this.releasePointerLock();
      this.refreshAllUi(true);
      this.updateZombieClassPanel(true);
      this.setHint(`You are a ${VERSUS_ZOMBIE_CLASSES[character.vsClass].name}! Use the Transform panel to change class, click to claw & infect.`, 6);
    }

    convertBotToZombie(bot, spawn) {
      // From-start zombie bots use the zombie-kind AI so humans can shoot/knock them back.
      this.removeCharacter(bot.id);
      this.vs.bots = this.vs.bots.filter((b) => b !== bot);
      const zombie = this.createZombie('fast-zombie', spawn || bot.pos);
      zombie.isBot = true;
      zombie.vsInfectedFrom = 'assigned';
      this.applyVersusClass(zombie, this.randomVersusClass());
      zombie.maxHealth = Math.max(240, zombie.maxHealth * 2);
      zombie.health = zombie.maxHealth;
      this.addZombie(zombie);
      return zombie;
    }

    reviveVersusZombie(who) {
      const a = Math.random() * TAU;
      who.dead = false;
      who.pos = v3(Math.sin(a) * 58, 0.6, Math.cos(a) * 58);
      who.vel = v3();
      who.forcefield = 1.5;
      this.applyVersusClass(who, who.vsClass || 'normal');
      who.health = who.maxHealth;
      if (who.isLocal) {
        this.setHint('You clawed your way back! Go infect the survivors.', 3);
        this.dom.damageOverlay.style.opacity = '0';
      }
    }

    // ---- Fancy zombie class selector (replaces number-key switching) ----
    buildZombieClassPanel() {
      if (!this.dom.zombieClassGrid || this.dom.zombieClassGrid.childElementCount) {
        return;
      }
      for (const key of VERSUS_CLASS_ORDER) {
        const cls = VERSUS_ZOMBIE_CLASSES[key];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'zcp-card';
        btn.dataset.classKey = key;
        btn.innerHTML = `
          <span class="zcp-emoji">${cls.emoji || '🧟'}</span>
          <span class="zcp-name">${escapeHtml(cls.name)}</span>
          <span class="zcp-stats">❤ ${cls.health} · ⚡ ${cls.speed}</span>
          <span class="zcp-desc">${escapeHtml(cls.desc || '')}</span>
        `;
        btn.addEventListener('click', () => this.selectZombieClass(key));
        this.dom.zombieClassGrid.appendChild(btn);
      }
    }

    selectZombieClass(className) {
      const local = this.localCharacter;
      if (this.mode === 'client') {
        // Class is host-assigned when you join online; you can't reroll it mid-round.
        this.setHint('Your class is set by the host this round.', 2);
        return;
      }
      if (!local || local.vsRole !== 'zombie' || !VERSUS_ZOMBIE_CLASSES[className]) {
        return;
      }
      if (className === local.vsClass) {
        return;
      }
      if ((this.vs.classCooldown || 0) > 0) {
        this.setHint(`Transform is recharging (${Math.ceil(this.vs.classCooldown)}s)...`, 1.5);
        return;
      }
      this.applyVersusClass(local, className);
      local.health = local.maxHealth;
      this.vs.classCooldown = this.vs.classCooldownMax || 8;
      this.audio.playHit();
      this.setHint(`Transformed into a ${VERSUS_ZOMBIE_CLASSES[className].name}!`, 2.5);
      this.refreshEquipmentUi(true);
      this.updateZombieClassPanel(true);
    }

    updateZombieClassPanel(force = false) {
      const panel = this.dom.zombieClassPanel;
      if (!panel) {
        return;
      }
      const local = this.localCharacter;
      const show = Boolean(this.versus && local && local.vsRole === 'zombie' && this.vs.phase === 'playing');
      panel.classList.toggle('hidden', !show);
      if (!show) {
        return;
      }
      const cd = this.vs.classCooldown || 0;
      const onCd = cd > 0;
      for (const btn of this.dom.zombieClassGrid.children) {
        const key = btn.dataset.classKey;
        btn.classList.toggle('active', key === local.vsClass);
        btn.classList.toggle('locked', onCd && key !== local.vsClass);
      }
      if (this.dom.zombieClassCooldown) {
        this.dom.zombieClassCooldown.textContent = onCd
          ? `Recharging transform… ${Math.ceil(cd)}s`
          : 'Ready — click a class to transform';
        this.dom.zombieClassCooldown.classList.toggle('cooling', onCd);
      }
    }

    // ---- Survivor loadout / weapon select ----
    get versusWeaponChoices() {
      return BASE_WEAPON_LANES.flat();
    }

    openWeaponSelect() {
      if (!this.dom.weaponSelectWindow) {
        return;
      }
      this.vs.loadout = [];
      this.vs.weaponSelectOpen = true;
      this.dom.weaponSelectGrid.textContent = '';
      for (const key of this.versusWeaponChoices) {
        const weapon = getWeaponDef(key);
        if (!weapon) continue;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'wsw-card';
        card.dataset.weaponKey = key;
        card.innerHTML = `
          <span class="wsw-tag">${escapeHtml(weapon.uiTag || '')}</span>
          <span class="wsw-name">${escapeHtml(weapon.name)}</span>
        `;
        card.addEventListener('click', () => this.toggleLoadoutWeapon(key));
        this.dom.weaponSelectGrid.appendChild(card);
      }
      this.updateWeaponSelectUi();
      this.dom.weaponSelectWindow.classList.remove('hidden');
      this.releasePointerLock();
    }

    toggleLoadoutWeapon(key) {
      if (!this.vs.weaponSelectOpen) {
        return;
      }
      const idx = this.vs.loadout.indexOf(key);
      if (idx >= 0) {
        this.vs.loadout.splice(idx, 1);
      } else {
        if (this.vs.loadout.length >= 3) {
          this.setHint('You can only carry 3 weapons.', 1.5);
          return;
        }
        this.vs.loadout.push(key);
        this.audio.playHit();
      }
      this.updateWeaponSelectUi();
    }

    updateWeaponSelectUi() {
      if (!this.dom.weaponSelectGrid) {
        return;
      }
      for (const card of this.dom.weaponSelectGrid.children) {
        card.classList.toggle('chosen', this.vs.loadout.includes(card.dataset.weaponKey));
      }
      if (this.dom.weaponSelectCount) {
        this.dom.weaponSelectCount.textContent = `${this.vs.loadout.length} / 3 chosen`;
      }
    }

    confirmWeaponSelect() {
      if (!this.vs.weaponSelectOpen) {
        return;
      }
      const local = this.localCharacter;
      const picks = this.vs.loadout.length ? this.vs.loadout.slice(0, 3) : ['rifle', 'super-shotgun', 'sword'];
      this.round.unlockedBaseKeys = [...new Set([STARTER_WEAPON_KEY, ...picks])];
      this.vs.weaponSelectOpen = false;
      if (this.dom.weaponSelectWindow) {
        this.dom.weaponSelectWindow.classList.add('hidden');
      }
      if (local) {
        local.selectedTool = picks[0] || STARTER_WEAPON_KEY;
      }
      this.refreshEquipmentUi(true);
      this.setHint('Loadout deployed! Survive the round.', 3);
    }

    infectHumanBot(bot) {
      if (!bot || bot.vsRole === 'zombie') {
        return;
      }
      // Infected humans keep their avatar but turn green + gain claws (they don't become the model).
      bot.vsRole = 'zombie';
      bot.infected = true;
      bot.bodyColors = versusZombieColors(getAvatarPreset(bot.avatarPreset).bodyColors);
      bot.selectedTool = null;
      bot.forcefield = 0.8;
      bot.clawCooldown = 0.6;
      bot.swing = { time: 0, duration: 0.34, didHit: false, weaponKey: null };
      this.applyVersusClass(bot, this.randomVersusClass());
      bot.health = bot.maxHealth;
      this.playTransformEffect(bot);
      this.pushChat('System', `${bot.name} was infected and rose as a ${VERSUS_ZOMBIE_CLASSES[bot.vsClass].name}!`, true);
      this.audio.playHit();
    }

    // Convulsing flail + a sickly green burst when the infection takes hold.
    playTransformEffect(character) {
      character.transformTime = 1.3;
      character.stunTimer = Math.max(character.stunTimer || 0, 1.0);
      this.hazards.push({
        id: `h-${makeId(6)}`,
        type: 'transform-burst',
        pos: vAdd(character.pos, v3(0, 1.6, 0)),
        radius: 3.4,
        life: 1.1,
        dps: 0,
        affect: 'none',
        color: COLORS.zombieSkin,
        slowFactor: 1,
        slowTime: 0,
        poisonDps: 0,
        poisonTime: 0
      });
      this.audio.playZombieGroan();
    }

    infectLocal() {
      const local = this.localCharacter;
      if (!local || local.vsRole === 'zombie') {
        return;
      }
      this.makeLocalZombie(local, vCopy(local.pos));
      this.setHint('You were infected! Now hunt the survivors — click to swipe your claws.', 6);
      this.dom.damageOverlay.style.opacity = '0.7';
    }

    // Human bullets should hit zombie-kind enemies AND player-kind green zombies (local + infected bots).
    humanProjectileTargets() {
      const list = [...this.zombies.values()];
      if (this.versus) {
        for (const c of this.characters.values()) {
          if (c.vsRole === 'zombie' && !c.dead) list.push(c);
        }
      }
      return list;
    }

    // Fully undo any zombie class/state — fixes the crawler keeping no legs (and class
    // speed/scale) after going back to being a human.
    restoreHumanForm(person) {
      person.vsRole = 'human';
      person.infected = false;
      person.vsClass = null;
      person.transformTime = 0;
      person.renderScale = 1;
      person.walkSpeed = 16;
      person.maxHealth = 140;
      person.health = 140;
      person.bodyColors = cloneBodyColors(getAvatarPreset(person.avatarPreset).bodyColors);
      person.noFace = person.isLocal ? false : person.noFace;
      person.vel = v3();
      person.dead = false;
    }

countVersusHumans() {
  let count = 0;
  for (const character of this.characters.values()) {
    if (character.vsRole !== 'zombie' && !character.dead) count += 1;
  }
  return count;
}

    endVersusRound(result, winner) {
      if (this.vs.phase === 'roundend') {
        return;
      }
      this.vs.phase = 'roundend';
      this.vs.result = result;
      this.vs.countdown = 7;
      this.vs.weaponSelectOpen = false;
      if (this.dom.weaponSelectWindow) this.dom.weaponSelectWindow.classList.add('hidden');
      if (this.dom.zombieClassPanel) this.dom.zombieClassPanel.classList.add('hidden');
      this.audio.stopMusic();
      this.setHint(result, 5);
      this.pushChat('System', result, true);
      this.startVictoryShowcase(winner || 'zombies');
    }

    // 3D victory scene on a floating podium: zombies win → a zombie dances;
    // humans win → a survivor blasts a convulsing zombie.
    startVictoryShowcase(winner) {
      const stage = v3(0, 42, 0);
      const makeActor = (offset, opts) => ({
        id: `show-${makeId(4)}`,
        kind: 'player',
        name: '',
        isLocal: false,
        avatarPreset: 'regular',
        pos: vAdd(stage, offset),
        vel: v3(),
        yaw: opts.yaw || 0,
        walkSpeed: 16,
        walkCycle: 0,
        grounded: true,
        climbing: false,
        dead: false,
        noFace: false,
        forcefield: 0,
        renderScale: opts.scale || 1.15,
        selectedTool: opts.tool || null,
        vsRole: opts.zombie ? 'zombie' : undefined,
        vsClass: opts.vsClass,
        infected: Boolean(opts.zombie),
        transformTime: 0,
        swing: { time: 0, duration: 0.34, didHit: false, weaponKey: null },
        bodyColors: opts.zombie
          ? versusZombieColors(getAvatarPreset('regular').bodyColors)
          : cloneBodyColors(getAvatarPreset(this.localCharacter ? this.localCharacter.avatarPreset : 'regular').bodyColors)
      });
      const actors = [];
      if (winner === 'zombies') {
        const dancer = makeActor(v3(0, 0, 0), { zombie: true, vsClass: 'normal', yaw: 0, scale: 1.3 });
        dancer.danceTime = 0;
        dancer.baseY = dancer.pos.y;
        actors.push(dancer);
      } else {
        const shooter = makeActor(v3(-5, 0, 0), { tool: 'rifle', yaw: Math.PI / 2, scale: 1.15 });
        const victim = makeActor(v3(5, 0, 0), { zombie: true, vsClass: 'normal', yaw: -Math.PI / 2, scale: 1.15 });
        actors.push(shooter, victim);
      }
      this.vs.showcase = {
        winner,
        stage,
        actors,
        startedAt: this.time,
        baseAngle: 0.6,
        shotTimer: 0
      };
      if (this.dom.victoryBanner) {
        this.dom.victoryBanner.textContent = winner === 'zombies' ? '🧟 ZOMBIES WIN! 🧟' : '🏆 SURVIVORS WIN! 🏆';
        this.dom.victoryBanner.classList.remove('hidden');
        this.dom.victoryBanner.classList.toggle('zombies', winner === 'zombies');
      }
    }

    updateShowcase(dt) {
      const s = this.vs.showcase;
      if (!s) {
        return;
      }
      if (s.winner === 'zombies') {
        const dancer = s.actors[0];
        dancer.danceTime = (dancer.danceTime || 0) + dt;
        // Bounce and slowly spin while pumping arms.
        dancer.pos.y = s.stage.y + Math.abs(Math.sin(dancer.danceTime * 7)) * 1.1;
        dancer.yaw += dt * 2.2;
        dancer.walkCycle += dt * 6;
      } else {
        const shooter = s.actors[0];
        const victim = s.actors[1];
        s.shotTimer -= dt;
        if (s.shotTimer <= 0) {
          s.shotTimer = 0.5;
          // Cosmetic tracer from the shooter's muzzle into the zombie.
          const muzzle = vAdd(shooter.pos, v3(1.4, 4.2, 0));
          const to = vNormalize(vSub(vAdd(victim.pos, v3(0, 3.4, 0)), muzzle));
          this.projectiles.push({
            id: `proj-${makeId(8)}`,
            projectileKind: 'showcase-tracer',
            ownerId: 'showcase',
            ownerKind: 'sentry',
            team: 'showcase',
            weaponKey: null,
            pos: muzzle,
            vel: vScale(to, 55),
            radius: 0.16,
            gravity: 0,
            bounce: 0,
            life: 0.2,
            damage: 0,
            color: COLORS.muzzle,
            knockback: 0,
            spread: 0,
            splashRadius: 0,
            slowFactor: 0,
            slowTime: 0,
            freeze: 0,
            poisonDps: 0,
            poisonTime: 0,
            hazard: null,
            remainingPierce: 0,
            sticky: false,
            stuck: false,
            fuse: 0,
            armTime: 0,
            recentHits: new Map()
          });
          victim.transformTime = 0.45;
          this.audio.playHit();
        }
        victim.walkCycle += dt * 4;
      }
    }

    updateVersus(dt) {
      if (this.vs.buttonCooldown > 0) {
        this.vs.buttonCooldown -= dt;
      }
      const local = this.localCharacter;

      if (this.vs.phase === 'lobby') {
        if (local) {
          const onSummon = Math.hypot(local.pos.x - (-6), local.pos.z - 8) < 2.6;
          const onRemove = Math.hypot(local.pos.x - 2, local.pos.z - 8) < 2.6;
          if (onSummon && this.vs.buttonCooldown <= 0) {
            this.summonBot();
            this.vs.buttonCooldown = 0.8;
          } else if (onRemove && this.vs.buttonCooldown <= 0 && this.vs.bots.length) {
            this.removeAllBots();
            this.setHint('Bots cleared.', 2);
            this.vs.buttonCooldown = 0.8;
          }
        }
        // Auto-start once at least one opponent is present — a bot OR a joined online player.
        const remotePlayers = [...this.characters.values()].filter((c) => !c.isLocal && !c.isBot).length;
        if (this.vs.bots.length + remotePlayers >= 1) {
          if (this.vs.countdown <= 0) {
            this.vs.countdown = 8;
            this.vs.lastCountTick = 99;
          }
          this.vs.countdown -= dt;
          const tick = Math.ceil(this.vs.countdown);
          if (tick <= 3 && tick > 0 && tick !== this.vs.lastCountTick) {
            this.vs.lastCountTick = tick;
            this.setHint(`Round starting in ${tick}...`, 1);
            this.audio.playHit();
          }
          if (this.vs.countdown <= 0) {
            this.startVersusRound();
          }
        } else {
          this.vs.countdown = 0;
        }
        return;
      }

      if (this.vs.phase === 'playing') {
        this.vs.timer -= dt;
        this.vs.classCooldown = Math.max(0, (this.vs.classCooldown || 0) - dt);
        this.updateZombieClassPanel();

        // Weapon select stays open during the release window, then auto-deploys.
        if (this.vs.weaponSelectOpen) {
          const left = Math.max(0, (this.vs.releaseAt || 0) - this.time);
          if (this.dom.weaponSelectTimer) {
            this.dom.weaponSelectTimer.textContent = `Zombies release in ${Math.ceil(left)}s`;
          }
          if (left <= 0) {
            this.confirmWeaponSelect();
          }
        }
        // Bring knocked-out zombies back.
        if (this.vs.respawns && this.vs.respawns.length) {
          const still = [];
          for (const at of this.vs.respawns) {
            if (this.time >= at) {
              const a = Math.random() * TAU;
              const z = this.createZombie('fast-zombie', v3(Math.sin(a) * 42, 0.6, Math.cos(a) * 42));
              z.isBot = true;
              this.applyVersusClass(z, this.randomVersusClass());
              z.maxHealth = Math.max(240, z.maxHealth * 2);
              z.health = z.maxHealth;
              this.addZombie(z);
            } else {
              still.push(at);
            }
          }
          this.vs.respawns = still;
        }
        // Bring knocked-down player-kind zombies (local + infected bots) back at the perimeter.
        if (this.vs.playerRespawns && this.vs.playerRespawns.length) {
          const keep = [];
          for (const entry of this.vs.playerRespawns) {
            if (this.time >= entry.at) {
              const who = this.characters.get(entry.id);
              if (who) this.reviveVersusZombie(who);
            } else {
              keep.push(entry);
            }
          }
          this.vs.playerRespawns = keep;
        }
        const humans = this.countVersusHumans();
        if (humans !== this.vs.lastHumanCount) {
          if (humans > 0 && humans < this.vs.lastHumanCount) {
            this.pushChat('System', humans === 1 ? 'ONE survivor remains — hold out!' : `${humans} survivors remain!`, true);
          }
          this.vs.lastHumanCount = humans;
        }
        if (humans <= 0) {
          this.endVersusRound('The zombies infected everyone! Zombies win.', 'zombies');
        } else if (this.vs.timer <= 0) {
          this.endVersusRound(`Survivors made it! ${humans} human${humans === 1 ? '' : 's'} win.`, 'humans');
        }
        // Local zombie claw attack (after the release window), paced by the class swing speed.
        if (local) {
          local.clawCooldown = Math.max(0, (local.clawCooldown || 0) - dt);
          local.specialCooldown = Math.max(0, (local.specialCooldown || 0) - dt);
          if (local.vsRole === 'zombie') {
            // Cheap when unchanged (signature-guarded) — keeps the F-slot cooldown ticking.
            this.refreshEquipmentUi();
          }
        }
        if (local && local.vsRole === 'zombie' && this.time >= (this.vs.releaseAt || 0) && (this.pendingUse || this.fireHeld) && local.swing.time <= 0 && (local.clawCooldown || 0) <= 0 && !this.isUiBlockingInput()) {
          const cls = VERSUS_ZOMBIE_CLASSES[local.vsClass] || VERSUS_ZOMBIE_CLASSES.normal;
          local.swing.time = 0.34;
          local.swing.duration = 0.34;
          local.swing.didHit = false;
          local.clawCooldown = cls.swingCooldown || 0.8;
          this.audio.playSwordSwing();
        }
        if (local && local.vsRole === 'zombie' && local.swing.time > 0 && !local.swing.didHit && local.swing.time <= 0.34 * 0.5) {
          local.swing.didHit = true;
          this.localZombieClawHit();
        }
        return;
      }

      if (this.vs.phase === 'roundend') {
        this.updateShowcase(dt);
        this.vs.countdown -= dt;
        if (this.vs.countdown <= 0) {
          this.enterLobby();
        }
      }
    }

    localZombieClawHit() {
      const local = this.localCharacter;
      if (!local) {
        return;
      }
      const cls = VERSUS_ZOMBIE_CLASSES[local.vsClass] || VERSUS_ZOMBIE_CLASSES.normal;
      const forward = yawForward(local.yaw);
      let landed = false;
for (const bot of this.characters.values()) {
  if (bot.id === local.id || bot.vsRole === 'zombie' || bot.dead) {
    continue;
  }
  const to = vSub(bot.pos, local.pos);
        if (vLength(to) < 4.6 && vDot(vNormalizeXZ(to), forward) > 0.2) {
          if (bot.forcefield > 0) {
            continue;
          }
          const planar = vNormalizeXZ(to);
          this.applyDamage(bot, { amount: cls.damage || 30, direction: planar, tags: ['zombie-claw'], knockback: 6 }, local, vAdd(vScale(planar, 6), v3(0, 2, 0)));
          landed = true;
        }
      }
      if (landed) {
        this.audio.playHit();
      }
    }

    // Host-authoritative claw for a remote (online) zombie player — range-based so it
    // works without perfectly synced facing. Returns true if it hit a survivor.
    remoteZombieClawSwipe(attacker) {
      if (!attacker || (attacker.clawCooldown || 0) > 0 || this.time < (this.vs.releaseAt || 0)) {
        return false;
      }
      const cls = VERSUS_ZOMBIE_CLASSES[attacker.vsClass] || VERSUS_ZOMBIE_CLASSES.normal;
      attacker.clawCooldown = cls.swingCooldown || 0.8;
      attacker.swing = attacker.swing || { time: 0, duration: 0.34, didHit: false, weaponKey: null };
      attacker.swing.time = 0.34;
      let landed = false;
      for (const target of this.characters.values()) {
        if (target.id === attacker.id || target.vsRole === 'zombie' || target.dead || target.forcefield > 0) {
          continue;
        }
        if (vLength(vSub(target.pos, attacker.pos)) < 4.6) {
          const planar = vNormalizeXZ(vSub(target.pos, attacker.pos));
          this.applyDamage(target, { amount: cls.damage || 30, direction: planar, tags: ['zombie-claw'], knockback: 6 }, attacker, vAdd(vScale(planar, 6), v3(0, 2, 0)));
          landed = true;
        }
      }
      return landed;
    }

    // Class throwable (doctor acid bucket, pumpkin chunk, TP roll). Shared by the local
    // zombie (F key, aims where the camera looks) and zombie bots (aim at their target).
    throwZombieSpecial(thrower, targetPoint) {
      const cls = VERSUS_ZOMBIE_CLASSES[thrower.vsClass];
      const spec = cls && cls.special;
      if (!spec) {
        return false;
      }
      const origin = vAdd(thrower.pos, v3(0, 4.4 * (thrower.renderScale || 1), 0));
      const flat = vSub(targetPoint, origin);
      const dist = Math.max(2, vLength(flat));
      // Lob upward proportionally to distance so the arc lands near the target.
      const aim = vNormalize(vAdd(flat, v3(0, dist * (spec.gravity > 28 ? 0.3 : 0.2), 0)));
      const specColor = spec.color === 'toxic' ? COLORS.toxic : spec.color === 'orange' ? COLORS.orange : COLORS.white;
      this.projectiles.push({
        id: `proj-${makeId(8)}`,
        projectileKind: spec.kind,
        ownerId: thrower.id,
        ownerKind: 'player',
        team: 'zombie',
        weaponKey: spec.kind,
        pos: vAdd(origin, vScale(aim, 1.4)),
        vel: vScale(aim, spec.speed),
        radius: spec.radius,
        gravity: spec.gravity,
        bounce: 0,
        life: 4,
        damage: spec.damage,
        color: specColor,
        knockback: spec.knockback || 3,
        spread: 0,
        splashRadius: spec.splashRadius || 0,
        slowFactor: spec.slowFactor || 0,
        slowTime: spec.slowTime || 0,
        freeze: 0,
        poisonDps: spec.hazard ? spec.hazard.poisonDps : 0,
        poisonTime: spec.hazard ? spec.hazard.poisonTime : 0,
        hazard: spec.hazard ? { ...spec.hazard, color: COLORS.poisonCloud } : null,
        remainingPierce: 0,
        sticky: false,
        stuck: false,
        fuse: 0,
        armTime: 0,
        recentHits: new Map()
      });
      this.audio.playSwordSwing();
      return true;
    }

    localZombieThrow() {
      const local = this.localCharacter;
      if (this.mode === 'client') {
        // Throwables are host-simulated; a joiner sticks to claws to stay in sync.
        this.setHint('Throwables are available when hosting — claw them down instead!', 2.5);
        return;
      }
      if (!local || local.vsRole !== 'zombie' || this.vs.phase !== 'playing' || this.time < (this.vs.releaseAt || 0)) {
        return;
      }
      const cls = VERSUS_ZOMBIE_CLASSES[local.vsClass];
      if (!cls || !cls.special) {
        this.setHint('This class has no throwable — claws only!', 2);
        return;
      }
      if ((local.specialCooldown || 0) > 0) {
        this.setHint(`${cls.special.name} recharging (${Math.ceil(local.specialCooldown)}s)...`, 1.2);
        return;
      }
      const aim = getAimDirectionFromView(this.camera.yaw, this.camera.pitch, this.camera.firstPerson);
      const target = vAdd(vAdd(local.pos, v3(0, 4.4, 0)), vScale(aim, 26));
      if (this.throwZombieSpecial(local, target)) {
        local.specialCooldown = cls.special.cooldown;
        this.refreshEquipmentUi(true);
      }
    }

    updateVersusAI(dt) {
      if (this.vs.phase !== 'playing') {
        for (const bot of this.vs.bots) {
          bot.remoteInput = makeNeutralInput();
        }
        return;
      }
      const local = this.localCharacter;
      const allZombies = [...this.zombies.values()].filter((z) => !z.dead);
      const localZombie = local && local.vsRole === 'zombie' ? local : null;
      // All zombie threats a human should flee/shoot: model zombies + infected-avatar bots + local zombie.
      const zombieThreats = [...allZombies, ...this.vs.bots.filter((b) => b.vsRole === 'zombie' && !b.dead)];
      if (localZombie) zombieThreats.push(localZombie);
const humanTargets = [...this.characters.values()].filter(c => c.vsRole !== 'zombie' && !c.dead);

      for (const bot of this.vs.bots) {
        if (bot.dead) {
          bot.remoteInput = makeNeutralInput();
          continue;
        }
        bot.botTimer = (bot.botTimer || 0) + dt;
        if (bot.vsRole === 'zombie') {
          bot.remoteInput = this.versusZombieBotInput(bot, humanTargets, dt);
        } else {
          bot.remoteInput = this.versusHumanBotInput(bot, zombieThreats, dt);
        }
      }
    }

    // Aim precisely at a point and move in an arbitrary world direction (they're decoupled).
    setBotAimMove(input, bot, aimPos, moveDir) {
      const dx = aimPos.x - bot.pos.x;
      const dz = aimPos.z - bot.pos.z;
      const horiz = Math.hypot(dx, dz) || 0.001;
      const camYaw = Math.atan2(-dx, dz);
      input.cameraYaw = camYaw;
      bot.yaw = Math.atan2(dx, dz);
      if (moveDir) {
        const mlen = Math.hypot(moveDir.x, moveDir.z);
        if (mlen > 0.01) {
          const mx = moveDir.x / mlen;
          const mz = moveDir.z / mlen;
          const fX = -Math.sin(camYaw);
          const fZ = Math.cos(camYaw);
          const rX = Math.cos(camYaw);
          const rZ = Math.sin(camYaw);
          const f = mx * fX + mz * fZ;
          const r = mx * rX + mz * rZ;
          input.forward = f > 0.35;
          input.back = f < -0.35;
          input.right = r > 0.35;
          input.left = r < -0.35;
        }
      }
      return horiz;
    }

    versusHumanBotInput(bot, threats, dt) {
      const input = makeNeutralInput();
      if (bot.aimSeed === undefined) bot.aimSeed = Math.random() * 20;
      let nearest = null;
      let bestDist = Infinity;
      const flee = v3();
      for (const z of threats) {
        const dx = bot.pos.x - z.pos.x;
        const dz = bot.pos.z - z.pos.z;
        const d = Math.max(0.6, Math.hypot(dx, dz));
        if (d < 34) {
          const w = 1 / (d * d);
          flee.x += (dx / d) * w;
          flee.z += (dz / d) * w;
        }
        if (d < bestDist) { bestDist = d; nearest = z; }
      }
      // Swap to the close-range sidearm when a zombie is on top of them.
      const primary = bot.vsPrimary || bot.selectedTool || 'rifle';
      const sidearm = bot.vsSidearm || 'super-shotgun';
      input.selectedTool = bestDist < 13 ? sidearm : primary;
      bot.selectedTool = input.selectedTool;
      if (!nearest) {
        // No threats visible — regroup toward the arena center rather than idling in a corner.
        if (Math.hypot(bot.pos.x, bot.pos.z) > 30) {
          this.setBotAimMove(input, bot, v3(0, 3, 0), vScale(bot.pos, -1));
        }
        return input;
      }
      const flen = Math.hypot(flee.x, flee.z) || 1;
      // Weave a little so they're not a straight retreat.
      const side = (Math.floor(bot.botTimer * 0.7) % 2 === 0) ? 1 : -1;
      const move = v3(flee.x + (-flee.z / flen) * 0.7 * side, 0, flee.z + (flee.x / flen) * 0.7 * side);
      // Stay off the walls.
      const bound = 88;
      if (bot.pos.x > bound) move.x -= 2; else if (bot.pos.x < -bound) move.x += 2;
      if (bot.pos.z > bound) move.z -= 2; else if (bot.pos.z < -bound) move.z += 2;
      // Kite: retreat when close, hold-and-shoot mid, close in when far.
      let moveDir = null;
      if (bestDist < 24) moveDir = move;
      else if (bestDist > 38) moveDir = vSub(nearest.pos, bot.pos);
      // Human-feeling aim: lead the target but wobble a little, more at range.
      const lead = vAdd(nearest.pos, vScale(nearest.vel || v3(), 0.18));
      const wobble = Math.sin(this.time * 1.9 + bot.aimSeed) * bestDist * 0.035;
      const aimPos = v3(lead.x + wobble, lead.y + 3, lead.z - wobble * 0.6);
      const dist = this.setBotAimMove(input, bot, aimPos, moveDir);
      this.applyBotUnstuck(bot, input, dt);
      const dy = (nearest.pos.y + 3) - (bot.pos.y + 4.25);
      input.cameraPitch = clamp(-Math.atan2(dy, Math.max(1, dist)), -0.7, 0.7);
      // Fire discipline: shoot in bursts at range, hold the trigger up close.
      input.fireHeld = bestDist < 14 || (bestDist < 58 && ((this.time + bot.aimSeed) % 2.2) < 1.5);
      if (bestDist < 18 && bot.botTimer % 2.4 < 0.05) input.jump = true;
      return input;
    }

    versusZombieBotInput(bot, humans, dt) {
      const input = makeNeutralInput();
      bot.clawCooldown = Math.max(0, (bot.clawCooldown || 0) - dt);
      if (bot.swing.time > 0) bot.swing.time = Math.max(0, bot.swing.time - dt);
      if (this.time < (this.vs.releaseAt || 0)) {
        return input;
      }
      let target = null;
      let best = Infinity;
      for (const h of humans) {
        const d = vLength(vSub(h.pos, bot.pos));
        // Bias toward the human this zombie was already chasing so the pack spreads out.
        const score = d + (h.id === bot.vsFocusId ? -8 : 0);
        if (score < best) { best = score; target = h; }
      }
      if (target) {
        bot.vsFocusId = target.id;
        const cls = VERSUS_ZOMBIE_CLASSES[bot.vsClass] || VERSUS_ZOMBIE_CLASSES.normal;
        // Lead the target's movement so they cut it off.
        const lead = vAdd(target.pos, vScale(target.vel || v3(), 0.32));
        const realDist = vLength(vSub(target.pos, bot.pos));
        // Serpentine while closing so gunfire is harder to land; beeline once close.
        let moveTarget = vSub(target.pos, bot.pos);
        if (realDist > 11) {
          const s = Math.sin(bot.botTimer * 2.7 + (bot.aimSeed || 0));
          const pl = Math.hypot(moveTarget.x, moveTarget.z) || 1;
          const perp = v3(-moveTarget.z / pl, 0, moveTarget.x / pl);
          moveTarget = vAdd(moveTarget, vScale(perp, s * Math.min(realDist * 0.4, 14)));
        }
        this.setBotAimMove(input, bot, lead, moveTarget);
        // Stuck on a gravestone/wall? Hop and cut sideways.
        this.applyBotUnstuck(bot, input, dt);
        // Use the class throwable from mid range.
        bot.specialCooldown = Math.max(0, (bot.specialCooldown || 0) - dt);
        if (cls.special && bot.specialCooldown <= 0 && realDist > 9 && realDist < 30) {
          this.throwZombieSpecial(bot, vAdd(target.pos, v3(0, 2.5, 0)));
          bot.specialCooldown = cls.special.cooldown + 1.2;
        }
        if (realDist < 7 && bot.botTimer % 1.4 < 0.05) input.jump = true;
        if (realDist < 4.3 && bot.clawCooldown <= 0) {
          bot.clawCooldown = (cls.swingCooldown || 0.8) + 0.25;
          bot.swing.time = 0.34;
          if (target.forcefield <= 0) {
            const planar = vNormalizeXZ(vSub(target.pos, bot.pos));
            this.applyDamage(target, { amount: cls.damage || 24, direction: planar, tags: ['zombie-claw'], knockback: 6 }, bot, vAdd(vScale(planar, 5), v3(0, 1.8, 0)));
          }
        }
      }
      return input;
    }

    // Shared stuck detection: if a bot wants to move but isn't, jump and cut perpendicular.
    applyBotUnstuck(bot, input, dt) {
      const wantsMove = input.forward || input.back || input.left || input.right;
      const speed = Math.hypot(bot.vel.x, bot.vel.z);
      if (wantsMove && speed < 1.6) {
        bot.stuckT = (bot.stuckT || 0) + dt;
      } else {
        bot.stuckT = 0;
      }
      if (bot.stuckT > 0.65) {
        input.jump = true;
        bot.unstuckUntil = bot.botTimer + 0.9;
        bot.unstuckFlip = !bot.unstuckFlip;
        bot.stuckT = 0;
      }
      if (bot.unstuckUntil && bot.botTimer < bot.unstuckUntil) {
        // Rotate the intent 90° so they slide off whatever they're pressed against.
        const f = input.forward ? 1 : input.back ? -1 : 0;
        const r = input.right ? 1 : input.left ? -1 : 0;
        input.forward = bot.unstuckFlip ? r > 0 : r < 0;
        input.back = bot.unstuckFlip ? r < 0 : r > 0;
        input.right = bot.unstuckFlip ? f < 0 : f > 0;
        input.left = bot.unstuckFlip ? f > 0 : f < 0;
      }
    }

    updateRoundState(dt) {
      if (this.round.phase === 'gameover') {
        if (this.round.autoRestartAt && this.time >= this.round.autoRestartAt) {
          this.round.autoRestartAt = 0;
          this.startNewRun(true);
        }
        return;
      }

      if ((this.debug.available && this.debug.noWaves) || this.summonMode) {
        // No automatic waves — enemies come from Debug spawns or your own scripts.
        return;
      }

      if (this.round.phase === 'intermission') {
        if (this.time >= this.round.intermissionUntil) {
          this.startWave();
        }
        return;
      }

      this.round.spawnCooldown = Math.max(0, this.round.spawnCooldown - dt);
      while (this.round.spawnCooldown <= 0 && this.round.spawnQueue.length > 0 && this.livingZombies.length < this.round.maxAlive) {
        const zombieType = this.round.spawnQueue.shift();
        this.spawnZombie(zombieType);
        // Slower trickle so zombies arrive in a steady stream instead of all at once.
        this.round.spawnCooldown = Math.max(0.65, 1.5 - this.round.wave * 0.03);
      }

      if (!this.round.spawnQueue.length && !this.livingZombies.length) {
        this.completeWave();
      }
    }

    startWave() {
      this.round.phase = 'playing';
      this.reviveDownedPlayers();
      this.round.wave += 1;
      this.round.spawnBudgetRemaining = calculateWaveBudget(this.round.wave, this.livingPlayers.length || 1);
      this.round.maxAlive = calculateWaveMaxAlive(this.round.wave, this.livingPlayers.length || 1);
      this.round.spawnQueue = buildWaveSpawnQueue(this.round.wave, this.round.spawnBudgetRemaining);
      if (this.crossroads) {
        // Crossroads: waves of rival shooters instead of the mixed horde.
        const rivals = 3 + Math.floor(this.round.wave * 0.8);
        this.round.spawnQueue = new Array(rivals).fill('rival');
      } else if (this.studioRules && this.studioRules.waveEnemy && this.studioRules.waveEnemy !== 'mix' && ZOMBIE_DEFS[this.studioRules.waveEnemy]) {
        // Rules: this game only spawns one chosen enemy type.
        this.round.spawnQueue = new Array(this.round.spawnQueue.length || 4).fill(this.studioRules.waveEnemy);
      }
      // Rules: scale how many enemies each wave sends.
      if (this.studioRules && this.studioRules.waveSize && this.studioRules.waveSize !== 1) {
        const scaled = Math.max(1, Math.round(this.round.spawnQueue.length * this.studioRules.waveSize));
        const template = this.round.spawnQueue.slice();
        this.round.spawnQueue = [];
        for (let i = 0; i < scaled; i += 1) {
          this.round.spawnQueue.push(template[i % template.length]);
        }
        this.round.maxAlive = Math.round(this.round.maxAlive * Math.min(2.5, this.studioRules.waveSize));
      }
      this.round.spawnCooldown = 0.4;
      const enemyWord = this.crossroads ? 'rivals' : 'zombies';
      const startMessage = `Wave ${this.round.wave} begins. ${this.round.spawnQueue.length} ${enemyWord} are moving in.`;
      this.pushChat('System', startMessage, true);
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(startMessage);
      }
      this.setHint(startMessage, 4.5);
      this.runStudioScripts('onWaveStart');
      if (!this.crossroads) {
        // Each zombie wave picks one of the MIDI tracks at random.
        this.audio.playWaveMusic();
      }
    }

    spawnZombie(zombieType) {
      const spawn = this.pickZombieSpawn();
      const zombie = this.createZombie(zombieType, spawn);
      this.addZombie(zombie);
    }

    debugSpawnEnemy(zombieType) {
      if (!this.debug.available || !ZOMBIE_DEFS[zombieType]) {
        return;
      }
      const local = this.localCharacter;
      const forward = local ? yawForward(local.yaw) : v3(0, 0, 1);
      const base = local ? local.pos : this.world.spawnPoint;
      const spawn = vAdd(base, vAdd(vScale(forward, 9), v3(randRange(-2, 2), 0.01, randRange(-2, 2))));
      spawn.y = 0.01;
      const zombie = this.createZombie(zombieType, spawn);
      this.addZombie(zombie);
      this.setHint(`Debug: spawned ${ZOMBIE_DEFS[zombieType].name}.`, 2);
    }

    debugGiveAllWeapons() {
      if (!this.debug.available) {
        return;
      }
      const allBase = [STARTER_WEAPON_KEY, ...BASE_WEAPON_LANES.flat()];
      this.round.unlockedBaseKeys = [...new Set(allBase)];
      for (const key of VIP_WEAPON_KEYS) {
        this.sharedArmory.ownedVipKeys.add(key);
      }
      for (const character of this.characters.values()) {
        this.ensurePlayerWeapon(character);
      }
      this.refreshAllUi(true);
      this.setHint('Debug: all weapons unlocked. Press 1-9 or open the Armory.', 3.5);
    }

    applyStudioRules(project) {
      const rules = project.rules || {};
      if (rules.startGold) {
        this.sharedArmory.gold = rules.startGold;
      }
      // The default avatar class can grant a starting weapon.
      const av = project.avatars && (project.avatars[project.defaultAvatar] || Object.values(project.avatars)[0]);
      const startWeapon = av && av.startWeapon;
      if (startWeapon && getWeaponDef(startWeapon)) {
        if (VIP_WEAPON_KEYS.includes(startWeapon)) {
          this.sharedArmory.ownedVipKeys.add(startWeapon);
        } else if (!this.round.unlockedBaseKeys.includes(startWeapon)) {
          this.round.unlockedBaseKeys.push(startWeapon);
        }
        this.studioStartWeapon = startWeapon;
      }
    }

    runStudioScripts(eventName) {
      if (!this.studioScripts) {
        return;
      }
      for (const script of this.studioScripts) {
        if (script.event !== eventName) {
          continue;
        }
        for (const action of script.actions) {
          try {
            this.runStudioAction(action);
          } catch (error) {
            /* ignore a single bad action */
          }
        }
      }
    }

    runStudioAction(action) {
      const local = this.localCharacter;
      const num = action.num || 0;
      switch (action.type) {
        case 'message':
          this.setHint(String(action.value || ''), 4);
          this.pushChat('Script', String(action.value || ''), true);
          break;
        case 'setObjective':
          this.scriptObjective = String(action.value || '');
          this.setHint(this.scriptObjective, 9999);
          break;
        case 'giveWeapon': {
          const key = action.value;
          if (getWeaponDef(key)) {
            if (VIP_WEAPON_KEYS.includes(key)) {
              this.sharedArmory.ownedVipKeys.add(key);
            } else if (!this.round.unlockedBaseKeys.includes(key)) {
              this.round.unlockedBaseKeys.push(key);
            }
            if (local) {
              local.selectedTool = key;
            }
            this.refreshAllUi(true);
          }
          break;
        }
        case 'giveAllWeapons': {
          const allBase = [STARTER_WEAPON_KEY, ...BASE_WEAPON_LANES.flat()];
          this.round.unlockedBaseKeys = [...new Set(allBase)];
          for (const key of VIP_WEAPON_KEYS) {
            this.sharedArmory.ownedVipKeys.add(key);
          }
          for (const character of this.characters.values()) {
            this.ensurePlayerWeapon(character);
          }
          this.refreshAllUi(true);
          break;
        }
        case 'setPlayerSpeed':
          if (local) {
            if (local.baseWalkSpeed === undefined) {
              local.baseWalkSpeed = local.walkSpeed;
            }
            local.walkSpeed = local.baseWalkSpeed * (action.num || 1);
          }
          break;
        case 'setJumpPower':
          this.scriptJumpPower = action.num || 1;
          break;
        case 'setGravity':
          this.scriptGravity = action.num || 1;
          break;
        case 'setDamage':
          this.scriptDamageMul = action.num || 1;
          break;
        case 'setHealth':
          if (local) {
            local.maxHealth = Math.max(1, action.num || 100);
            local.health = local.maxHealth;
            this.refreshAllUi(true);
          }
          break;
        case 'healToFull':
          if (local) {
            local.health = local.maxHealth;
            this.refreshAllUi(true);
          }
          break;
        case 'invincible':
          this.scriptInvincible = num > 0;
          break;
        case 'teleportToSpawn':
          if (local && local.spawn) {
            local.pos = vCopy(local.spawn);
            local.vel = v3();
          }
          break;
        case 'spawnZombie': {
          const count = Math.max(1, Math.round(action.num || 1));
          for (let i = 0; i < count; i += 1) {
            if (ZOMBIE_DEFS[action.value]) {
              this.spawnZombie(action.value);
            }
          }
          break;
        }
        case 'spawnAtPlayer': {
          const count = Math.max(1, Math.round(action.num || 1));
          const base = local ? local.pos : this.world.spawnPoint;
          for (let i = 0; i < count; i += 1) {
            if (ZOMBIE_DEFS[action.value]) {
              const spawn = vAdd(base, v3(randRange(-6, 6), 0.01, randRange(-6, 6)));
              spawn.y = 0.01;
              this.addZombie(this.createZombie(action.value, spawn));
            }
          }
          break;
        }
        case 'clearEnemies':
          this.zombies.clear();
          break;
        case 'freezeEnemies':
          this.scriptFreezeAI = num > 0;
          break;
        case 'knockbackEnemies':
          for (const zombie of this.zombies.values()) {
            const away = local ? vNormalizeXZ(vSub(zombie.pos, local.pos)) : v3(0, 0, 1);
            zombie.vel = vAdd(vScale(away, 30), v3(0, 12, 0));
            zombie.stunTimer = Math.max(zombie.stunTimer || 0, 0.6);
          }
          break;
        case 'addGold':
          this.sharedArmory.gold += num;
          this.refreshAllUi(true);
          break;
        case 'addScore':
          this.scriptScore = (this.scriptScore || 0) + num;
          this.setHint(`Score: ${this.scriptScore}`, 2);
          break;
        case 'win':
          this.endRun('You win!');
          break;
        default:
          break;
      }
    }

    debugClearEnemies() {
      if (!this.debug.available) {
        return;
      }
      this.zombies.clear();
      this.setHint('Debug: cleared all enemies.', 2);
    }

pickZombieSpawn() {
      const livingPlayers = this.livingPlayers;
      
      // Fallback for custom/crossroads maps without defined zombie spawns
      if (!this.world.zombieSpawns || !this.world.zombieSpawns.length) {
        return v3(randRange(-30, 30), 60, randRange(-30, 30));
      }
      
      if (!livingPlayers.length) {
        return vCopy(this.world.zombieSpawns[0]);
      }
      
      let bestSpawn = this.world.zombieSpawns[0];
      let bestDistance = -Infinity;
      for (const spawn of this.world.zombieSpawns) {
        let nearest = Infinity;
        for (const player of livingPlayers) {
          nearest = Math.min(nearest, vLength(vSub(player.pos, spawn)));
        }
        if (nearest > bestDistance) {
          bestDistance = nearest;
          bestSpawn = spawn;
        }
      }
      return vAdd(vCopy(bestSpawn), v3(randRange(-2.2, 2.2), 0, randRange(-2.2, 2.2)));
    }

    completeWave() {
      this.round.lastClearedWave = this.round.wave;
      this.round.phase = 'intermission';
      this.round.intermissionUntil = this.time + 7.5;
      this.round.spawnQueue = [];
      this.runStudioScripts('onWaveCleared');
      const clearedMessage = `Wave ${this.round.wave} cleared.`;
      this.pushChat('System', clearedMessage, true);
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(clearedMessage);
      }

      let unlockMessage = '';
      if (this.round.wave % 2 === 0) {
        const weapon = this.unlockNextWeapon();
        if (weapon) {
          unlockMessage = `${weapon.name} unlocked.`;
        }
      }
      this.refreshAllUi(true);
      this.setHint(unlockMessage ? `${clearedMessage} ${unlockMessage}` : `${clearedMessage} Prepare for the next wave.`, 5);
    }

    updateCamera() {
      // Round-end: park the camera on a slow orbit around the victory podium.
      if (this.versus && this.vs.showcase) {
        const s = this.vs.showcase;
        const ang = s.baseAngle + (this.time - s.startedAt) * 0.35;
        this.camera.eye = vAdd(s.stage, v3(Math.sin(ang) * 15, 6.5, Math.cos(ang) * 15));
        this.camera.target = vAdd(s.stage, v3(0, 3.6, 0));
        this.camera.lookDir = vNormalize(vSub(this.camera.target, this.camera.eye));
        this.camera.forwardXZ = vNormalizeXZ(this.camera.lookDir);
        const aspectS = this.camera.width / this.camera.height;
        const projectionS = mat4Perspective(degToRad(64), aspectS, 0.1, 240);
        const viewS = mat4LookAt(this.camera.eye, this.camera.target, v3(0, 1, 0));
        this.camera.matrix = mat4Multiply(projectionS, viewS);
        return;
      }
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
      if (this.camera.firstPerson && this.shiftLock.active) {
        this.shiftLock.active = false;
        this.updateCrosshair();
      }

      if (this.camera.firstPerson) {
        const eye = vAdd(focusCharacter.pos, v3(0, 4.55, 0));
        const aim = getAimDirectionFromView(this.camera.yaw, this.camera.pitch, true);
        this.camera.eye = eye;
        this.camera.target = vAdd(eye, aim);
      } else {
        // Over-the-shoulder offset gives the Roblox-style shift lock framing.
        if (this.shiftLock.active) {
          const fwd = cameraViewForwardXZ(this.camera.yaw);
          const shoulder = 2.2;
          focus.x += fwd.z * shoulder;
          focus.z += -fwd.x * shoulder;
          focus.y += 0.6;
        }
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
      const projection = mat4Perspective(degToRad(64), aspect, 0.1, 240);
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
        renderCharacter(dynamicSolid, dynamicLines, character, this.camera.firstPerson && character.isLocal, this.time);
      }

      // Don't let a zombie pressed right against the camera fill the whole screen with green.
      const nearCull = this.camera.firstPerson ? 3.4 : 2.8;
      for (const zombie of this.zombies.values()) {
        if (zombie.dead) {
          continue;
        }
        const toEye = vSub(vAdd(zombie.pos, v3(0, 4, 0)), this.camera.eye);
        if (Math.hypot(toEye.x, toEye.y, toEye.z) < nearCull) {
          continue;
        }
        renderCharacter(dynamicSolid, dynamicLines, zombie, false, this.time);
      }

      // Round-end victory showcase: podium platform + actors (dancing zombie / firing squad).
      if (this.vs && this.vs.showcase) {
        const stage = this.vs.showcase.stage;
        appendOrientedBox(dynamicSolid, dynamicLines, vAdd(stage, v3(0, -1.1, 0)), v3(22, 2.2, 22), v3(0, 0, 0), COLORS.concreteDark, OUTLINE, false);
        appendOrientedBox(dynamicSolid, dynamicLines, vAdd(stage, v3(0, -0.05, 0)), v3(18, 0.3, 18), v3(0, 0, 0), this.vs.showcase.winner === 'zombies' ? COLORS.zombieSkinDark : COLORS.navy, OUTLINE, false);
        for (const actor of this.vs.showcase.actors) {
          renderCharacter(dynamicSolid, dynamicLines, actor, false, this.time);
        }
      }

      for (const sentry of this.sentries) {
        renderSentry(dynamicSolid, dynamicLines, sentry);
      }

      for (const corpse of this.corpses) {
        renderCorpse(dynamicSolid, dynamicLines, corpse);
      }

      for (const projectile of this.projectiles) {
        renderProjectile(dynamicSolid, dynamicLines, projectile);
      }

      for (const hazard of this.hazards) {
        renderHazard(dynamicSolid, dynamicLines, hazard);
      }

      if (this.camera.firstPerson) {
        this.renderViewmodel(dynamicSolid, dynamicLines);
      } else {
        this.renderAimIndicator(dynamicSolid, dynamicLines);
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

    renderViewmodel(triBuilder, lineBuilder) {
      const local = this.localCharacter;
      if (!local || local.dead || !local.selectedTool) {
        return;
      }
      const forward = vNormalize(this.camera.lookDir);
      const right = vNormalize(vCross(v3(0, 1, 0), forward));
      const up = vNormalize(vCross(forward, right));
      const origin = this.camera.eye;
      const armColor = (local.bodyColors && local.bodyColors.arms) ? local.bodyColors.arms : COLORS.yellow;
      const style = getWeaponHoldStyle(local.selectedTool) || 'gun';

      // Shared animation offsets — every weapon bobs, sways and kicks the same way.
      const moveStrength = clamp(Math.hypot(local.vel.x, local.vel.z) / Math.max(1, local.walkSpeed), 0, 1);
      const wc = local.walkCycle;
      const bobX = Math.cos(wc) * 0.016 * moveStrength;
      const bobY = Math.sin(wc * 2) * 0.013 * moveStrength;
      const swayX = Math.sin(this.time * 1.3) * 0.006;
      const swayY = Math.sin(this.time * 1.7) * 0.005;
      const kick = this.viewKick;
      const swingKick = this.viewSwingKick;

      // Brighten viewmodel colors so the weapon stays readable against the night scene.
      const box = (cx, cy, cz, hx, hy, hz, color) =>
        appendViewBox(triBuilder, lineBuilder, origin, right, up, forward, v3(cx, cy, cz), v3(hx, hy, hz), shade(color, 1.4));

      if (style === 'melee') {
        const s = Math.sin(swingKick * Math.PI);
        const ax = 0.22 + bobX + swayX - s * 0.26;
        const ay = -0.26 + bobY + swayY + s * 0.15;
        const az = 0.7 - s * 0.06;
        box(ax + 0.03, ay - 0.14, az - 0.16, 0.06, 0.07, 0.18, armColor); // forearm
        box(ax, ay - 0.03, az + 0.02, 0.06, 0.07, 0.085, armColor); // hand
        box(ax + 0.02, ay - 0.02, az + 0.1, 0.038, 0.06, 0.038, COLORS.swordHilt); // grip
        box(ax + 0.02, ay + 0.18, az + 0.12, 0.032, 0.2, 0.045, COLORS.swordSteel); // blade
        return;
      }

      if (style === 'item') {
        const ax = 0.2 + bobX + swayX;
        const ay = -0.24 + bobY + swayY;
        const az = 0.68;
        box(ax + 0.02, ay - 0.14, az - 0.14, 0.06, 0.07, 0.17, armColor); // forearm
        box(ax, ay - 0.05, az + 0.02, 0.06, 0.07, 0.085, armColor); // hand
        box(ax, ay + 0.07, az + 0.05, 0.09, 0.06, 0.09, COLORS.sandvichBread); // item
        return;
      }

      // gun / launcher / builder
      const recoilBack = kick * 0.14;
      const recoilUp = kick * 0.05;
      const ax = 0.24 + bobX + swayX;
      const ay = -0.27 + bobY + swayY + recoilUp;
      const az = 0.72 - recoilBack;
      const wcol = viewGunColor(local.selectedTool);
      box(ax + 0.04, ay - 0.13, az - 0.16, 0.06, 0.07, 0.19, armColor); // right forearm
      box(ax, ay - 0.03, az + 0.02, 0.06, 0.07, 0.085, armColor); // right hand
      box(ax, ay + 0.035, az + 0.21, 0.05, 0.07, 0.24, wcol); // gun body
      box(ax, ay + 0.06, az + 0.47, 0.028, 0.028, 0.17, shade(wcol, 0.8)); // barrel
      box(ax - 0.15, ay - 0.02, az + 0.31, 0.058, 0.062, 0.075, armColor); // left support hand
      if (kick > 0.5) {
        box(ax, ay + 0.06, az + 0.68, 0.1, 0.1, 0.07, COLORS.lampGlow); // muzzle flash
      }
    }

    renderAimIndicator(triBuilder, lineBuilder) {
      const local = this.localCharacter;
      if (!local || local.dead || getWeaponHoldStyle(local.selectedTool) !== 'gun') {
        return;
      }
      // Match the exact projectile origin and direction so the marker shows where shots go.
      const aim = getAimDirectionFromView(this.camera.yaw, this.camera.pitch);
      const rightBase = vNormalizeXZ(v3(aim.z, 0, -aim.x));
      const origin = vAdd(vAdd(local.pos, v3(0, 4.25, 0)), vAdd(vScale(aim, 1.7), vScale(rightBase, 0.25)));
      const maxRange = 90;
      const far = vAdd(origin, vScale(aim, maxRange));
      let hitDist = maxRange;
      for (const collider of this.world.colliders) {
        if (!collider.solid || collider.transparentOnly) {
          continue;
        }
        const hit = segmentIntersectsAabb(origin, far, collider);
        if (hit !== null) {
          hitDist = Math.min(hitDist, Math.max(0, hit) * maxRange);
        }
      }
      const end = vAdd(origin, vScale(aim, hitDist));
      // Glowing tracer dots along the shot path so the aim reads clearly at night.
      const spacing = 2.4;
      const dots = Math.min(16, Math.floor(hitDist / spacing));
      for (let i = 1; i <= dots; i += 1) {
        const pos = vAdd(origin, vScale(aim, i * spacing));
        appendSphere(triBuilder, pos, 0.11, COLORS.aimLine, 4, 6);
      }
      addLine(lineBuilder, origin, end, COLORS.aimLine);
      // Impact reticle where the shot lands.
      appendRingLines(lineBuilder, end, 0.65, 'xz', COLORS.aimDot, 16);
      appendRingLines(lineBuilder, end, 0.65, 'xy', COLORS.aimDot, 16);
      appendSphere(triBuilder, end, 0.24, COLORS.aimDot, 5, 8);
    }

    updateHud() {
      const local = this.localCharacter;
      if (!local) {
        return;
      }
      const healthPct = clamp(local.health / local.maxHealth, 0, 1);
      this.dom.healthFill.style.width = `${healthPct * 100}%`;
      const statusTail = this.round.phase === 'playing'
        ? ` • Wave ${this.round.wave} • ${this.livingZombies.length} alive`
        : this.round.phase === 'gameover'
          ? ` • Defeat • ${this.sharedArmory.gold} gold`
          : ` • Intermission • ${this.sharedArmory.gold} gold`;
      this.dom.healthText.textContent = `${Math.round(local.health)} / ${local.maxHealth}${statusTail}`;
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
        if (character.dead) {
          row.style.opacity = '0.68';
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

        const headPoint = vAdd(character.pos, v3(0, 6.2 * (character.renderScale || 1), 0));
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

      if (this.versus) {
        this.updateVersusHud(width, height);
      }
    }

    updateVersusHud(width, height) {
      // Floating "summon a bot" text over the green pad — solo lobby only.
      if (this.vsLabel) {
        const showLabel = this.vs.phase === 'lobby';
        if (showLabel) {
          const clip = projectPoint(this.camera.matrix, v3(-6, 4.4, 8));
          if (clip && clip.w > 0) {
            this.vsLabel.style.left = `${(clip.x * 0.5 + 0.5) * width}px`;
            this.vsLabel.style.top = `${(-clip.y * 0.5 + 0.5) * height}px`;
            this.vsLabel.style.display = 'block';
          } else {
            this.vsLabel.style.display = 'none';
          }
        } else {
          this.vsLabel.style.display = 'none';
        }
      }
      // Status line: role + timer.
      const local = this.localCharacter;
      let text = '';
      if (this.vs.phase === 'lobby') {
        text = this.vs.bots.length ? `Round starting in ${Math.max(0, Math.ceil(this.vs.countdown))}s…` : 'Waiting — summon a bot from the green pad.';
      } else if (this.vs.phase === 'playing') {
        const role = local && local.vsRole === 'zombie' ? '🧟 ZOMBIE — infect everyone' : '🧍 HUMAN — survive & don\'t get caught';
        const held = this.time < (this.vs.releaseAt || 0);
        const clock = held ? `Zombies release in ${Math.max(0, Math.ceil((this.vs.releaseAt || 0) - this.time))}s` : `⏱ ${Math.max(0, Math.ceil(this.vs.timer))}s`;
        text = `${role}  •  ${clock}  •  Survivors: ${this.countVersusHumans()}`;
      } else if (this.vs.phase === 'roundend') {
        text = `${this.vs.result}  •  Back to lobby in ${Math.max(0, Math.ceil(this.vs.countdown))}s`;
      }
      this.dom.hintBar.textContent = text;
      this.dom.hintBar.style.opacity = '1';
      this.hintTimer = 1;
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

    updateToolDescription(force = false) {
      const local = this.localCharacter;
      const weapon = local ? getWeaponDef(local.selectedTool) : null;
      const roundText = this.round.phase === 'playing'
        ? `Wave ${this.round.wave} • ${this.livingZombies.length} zombies alive`
        : this.round.phase === 'gameover'
          ? `Run over • Team gold ${this.sharedArmory.gold}`
          : `Intermission • Team gold ${this.sharedArmory.gold}`;
      const descriptionText = weapon
        ? `${weapon.name}: ${weapon.description} ${roundText}`
        : `No weapon equipped. ${roundText}`;
      if (!force && descriptionText === this.lastToolDescriptionSignature) {
        return;
      }
      this.lastToolDescriptionSignature = descriptionText;
      this.dom.toolDescription.textContent = descriptionText;
    }

    toggleMenu(force) {
      const show = typeof force === 'boolean' ? force : this.dom.menuWindow.classList.contains('hidden');
      if (show) {
        this.releasePointerLock();
        if (this.dom.debugMenuButton) {
          this.dom.debugMenuButton.classList.toggle('hidden', !this.debug.available);
        }
      }
      this.dom.menuWindow.classList.toggle('hidden', !show);
    }

    setupDebugPanel() {
      if (!this.dom.debugMenuButton) {
        return;
      }
      // Populate the enemy dropdown with every zombie type.
      if (this.dom.debugEnemySelect) {
        this.dom.debugEnemySelect.textContent = '';
        for (const key of Object.keys(ZOMBIE_DEFS)) {
          const option = document.createElement('option');
          option.value = key;
          option.textContent = ZOMBIE_DEFS[key].name;
          this.dom.debugEnemySelect.appendChild(option);
        }
      }
      this.dom.debugMenuButton.addEventListener('click', () => {
        this.toggleMenu(false);
        this.toggleDebugWindow(true);
      });
      this.dom.closeDebugButton.addEventListener('click', () => this.toggleDebugWindow(false));
      this.dom.debugSpawnButton.addEventListener('click', () => {
        this.debugSpawnEnemy(this.dom.debugEnemySelect.value);
      });
      this.dom.debugAllWeaponsButton.addEventListener('click', () => this.debugGiveAllWeapons());
      this.dom.debugClearEnemiesButton.addEventListener('click', () => this.debugClearEnemies());
      this.dom.debugNoWavesToggle.addEventListener('change', () => {
        this.debug.noWaves = this.dom.debugNoWavesToggle.checked;
        if (this.debug.noWaves) {
          // Stop any pending wave spawns so only your own debug enemies appear.
          this.round.spawnQueue = [];
          this.setHint('Debug: wave spawning disabled. Spawn enemies from the Debug panel.', 3);
        } else {
          this.setHint('Debug: wave spawning re-enabled.', 2.5);
        }
      });
      this.dom.debugFreezeToggle.addEventListener('change', () => {
        this.debug.freezeAI = this.dom.debugFreezeToggle.checked;
      });
      this.dom.debugInfiniteHpToggle.addEventListener('change', () => {
        this.debug.infiniteHp = this.dom.debugInfiniteHpToggle.checked;
        const local = this.localCharacter;
        if (this.debug.infiniteHp && local) {
          local.health = local.maxHealth;
        }
      });
      this.dom.debugFlyToggle.addEventListener('change', () => {
        this.debug.fly = this.dom.debugFlyToggle.checked;
      });
    }

    toggleDebugWindow(force) {
      if (!this.debug.available) {
        return;
      }
      const show = typeof force === 'boolean' ? force : this.dom.debugWindow.classList.contains('hidden');
      if (show) {
        this.releasePointerLock();
      }
      this.dom.debugWindow.classList.toggle('hidden', !show);
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
        this.refreshEquipmentUi();
        this.updateToolDescription();
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
        this.setNetworkStatus('Solo session only. Restart with Host Online or Join Online from the launch screen if you want co-op survival.');
      }
    }

    setNetworkStatus(text) {
      this.dom.networkStatus.textContent = text;
    }

    updateSessionHeader() {
      this.dom.placeName.textContent = 'Zombie Survival';
      const phaseText = this.round.phase === 'playing'
        ? `Wave ${this.round.wave} • ${this.livingZombies.length} zombie${this.livingZombies.length === 1 ? '' : 's'}`
        : this.round.phase === 'gameover'
          ? `Defeat • ${this.sharedArmory.gold} gold`
          : this.round.wave === 0
            ? 'Prepare for Wave 1'
            : `Intermission • Next after Wave ${this.round.lastClearedWave}`;
      if (this.mode === 'solo') {
        this.dom.serverName.textContent = `${phaseText} • Solo`;
      } else if (this.mode === 'host') {
        this.dom.serverName.textContent = `${phaseText} • Host ${this.characters.size}p`;
      } else if (this.network.isGameplayReady()) {
        this.dom.serverName.textContent = `${phaseText} • Connected`;
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
      if (this.round.phase !== 'playing') {
        if (this.mode === 'client') {
          this.network.sendReset();
          this.setHint('Restart request sent to the host.', 2.5);
        } else {
          this.startNewRun(true);
        }
        return;
      }

      if (this.mode === 'client') {
        this.network.sendReset();
        this.setHint('Give-up request sent to the host.', 2.5);
        return;
      }
      const local = this.localCharacter;
      if (local && !local.dead) {
        this.killPlayer(local, null, 'gave up');
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
        || (this.dom.weaponSelectWindow && !this.dom.weaponSelectWindow.classList.contains('hidden'))
        || !this.dom.menuWindow.classList.contains('hidden')
        || !this.dom.backpackWindow.classList.contains('hidden')
        || !this.dom.networkWindow.classList.contains('hidden')
        || !this.dom.debugWindow.classList.contains('hidden')
        || document.activeElement === this.dom.chatInput
        || document.activeElement === this.dom.playerNameInput;
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
        selectedTool: action.selectedTool || character.selectedTool
      };
      const combatLive = this.round.phase === 'playing' || (this.versus && this.vs.phase === 'playing');
      if (!combatLive) {
        return;
      }
      if (this.versus && character.vsRole === 'zombie') {
        // A joined zombie's click is a claw swipe, not a gunshot.
        this.remoteZombieClawSwipe(character);
      } else {
        this.useCurrentWeapon(character, action);
      }
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
      character.avatarPreset = normalizeAvatarPresetKey(playerData.avatarPreset);
      character.bodyColors = cloneBodyColors(getAvatarPreset(character.avatarPreset).bodyColors);
      this.resetCharacterForNewRun(character, this.allocatePlayerSpawn(this.characters.size - 1));
      character.initializedFromNetwork = true;
      if (this.versus) {
        // Joiners start as survivors; drop them into the lobby so they count for the round.
        character.vsRole = 'human';
        character.infected = false;
        character.vsClass = null;
        character.renderScale = 1;
        if (this.vs.phase === 'lobby') {
          character.pos = v3(randRange(-8, 8), 0.6, randRange(2, 12));
          character.vel = v3();
        }
      }
      this.refreshAllUi(true);
      this.refreshConnectedPlayers();
      const message = this.versus
        ? `${character.name} joined the lobby!`
        : `${character.name} joined the zombie survival session.`;
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
      const message = `${character.name} left the game.`;
      this.removeCharacter(playerId);
      this.pushChat('System', message, true);
      this.refreshConnectedPlayers();
      if (this.mode === 'host') {
        this.network.broadcastSystemChat(message);
        if (!this.livingPlayers.length && this.round.phase === 'playing') {
          this.endRun('The team was wiped out.');
        }
        this.network.broadcastSnapshot();
      }
    }

    onConnectedToHost() {
      this.setNetworkStatus('Connected to host. Waiting for survival snapshots...');
      this.updateSessionHeader();
    }

    onWelcomeFromHost(playerId) {
      this.localPlayerId = playerId;
      this.setNetworkStatus('Connected to host. Zombie survival is now active.');
      this.updateSessionHeader();
      this.toggleNetworkWindow(false);
      this.setHint('Connected! The host owns the wave state. Zoom all the way in, then click the game for first-person mouse lock.', 8);
    }

    buildSnapshot() {
      return {
        serverTime: roundNetworkFloat(this.time),
        round: serializeRoundState(this.round, this.sharedArmory, this.livingZombies.length),
        vs: this.versus ? {
          phase: this.vs.phase,
          worldTag: this.vsWorldTag || 'lobby',
          timer: roundNetworkFloat(this.vs.timer),
          releaseAt: roundNetworkFloat(this.vs.releaseAt),
          countdown: roundNetworkFloat(this.vs.countdown),
          round: this.vs.round,
          result: this.vs.result || ''
        } : null,
        players: [...this.characters.values()].map((character) => serializeCharacter(character)),
        zombies: [...this.zombies.values()].map((zombie) => serializeZombie(zombie, this.time)),
        sentries: this.sentries.map((sentry) => serializeSentry(sentry)),
        projectiles: this.projectiles.map((projectile) => serializeProjectile(projectile)),
        corpses: this.corpses.map((corpse) => serializeCorpse(corpse)),
        hazards: this.hazards.map((hazard) => serializeHazard(hazard))
      };
    }

    applySnapshot(snapshot) {
      if (!snapshot || !Array.isArray(snapshot.players)) {
        return;
      }

      // Becoming "ready" the moment the host's snapshot includes us is bulletproof:
      // it proves the host spawned us even if the one-shot welcome packet was dropped
      // (the welcome can race the client's subscription and never arrive).
      if (this.mode === 'client' && this.network && !this.network.isGameplayReady()
          && snapshot.players.some((p) => p.id === this.localPlayerId)) {
        this.network.gameplayReady = true;
        this.onWelcomeFromHost(this.localPlayerId);
      }

      if (snapshot.round) {
        this.round.phase = snapshot.round.phase;
        this.round.wave = snapshot.round.wave;
        this.round.lastClearedWave = snapshot.round.lastClearedWave;
        this.round.unlockedBaseKeys = [...snapshot.round.unlockedBaseKeys];
        this.round.nextUnlockIndex = snapshot.round.nextUnlockIndex;
        this.sharedArmory.gold = snapshot.round.gold;
        this.sharedArmory.ownedVipKeys = new Set(snapshot.round.ownedVipKeys || []);
      }

      // Mirror the host's Zombie Versus stage: phase, timer, and which map to render.
      if (this.versus && snapshot.vs) {
        this.vs.phase = snapshot.vs.phase;
        this.vs.timer = snapshot.vs.timer;
        this.vs.releaseAt = snapshot.vs.releaseAt;
        this.vs.countdown = snapshot.vs.countdown;
        this.vs.round = snapshot.vs.round;
        this.vs.result = snapshot.vs.result;
        this.applyVersusWorldTag(snapshot.vs.worldTag);
        if (snapshot.vs.result && snapshot.vs.result !== this.appliedVersusResult) {
          this.appliedVersusResult = snapshot.vs.result;
          this.pushChat('System', snapshot.vs.result, true);
        }
        if (snapshot.vs.phase !== 'roundend') {
          this.appliedVersusResult = '';
        }
      }

      const seenPlayerIds = new Set();
      for (const playerData of snapshot.players) {
        seenPlayerIds.add(playerData.id);
        if (playerData.id === this.localPlayerId) {
          this.localAuthorityState = playerData;
          const local = this.localCharacter;
          if (local) {
            local.name = playerData.name;
            local.avatarPreset = normalizeAvatarPresetKey(playerData.avatarPreset);
            local.bodyColors = cloneBodyColors(playerData.bodyColors);
            local.maxHealth = playerData.maxHealth;
            local.forcefield = playerData.forcefield;
            local.selectedTool = playerData.selectedTool;
            local.toolCooldown = playerData.toolCooldown || 0;
            local.slowTimer = playerData.slowTimer || 0;
            local.slowFactor = playerData.slowFactor || 1;
            local.hasteTimer = playerData.hasteTimer || 0;
            local.hasteFactor = playerData.hasteFactor || 1;
            local.colaTimer = playerData.colaTimer || 0;
            local.freezeMeter = playerData.freezeMeter || 0;
            local.frozenTimer = playerData.frozenTimer || 0;
            local.stunTimer = playerData.stunTimer || 0;
            local.poisonTimer = playerData.poisonTimer || 0;
            local.poisonDps = playerData.poisonDps || 0;
            local.ko = playerData.ko;
            local.wo = playerData.wo;
            local.spawn = vCopy(playerData.spawn || local.spawn);
            if (this.versus) {
              const wasZombie = local.vsRole === 'zombie';
              local.vsRole = playerData.vsRole || 'human';
              local.vsClass = playerData.vsClass || null;
              local.infected = Boolean(playerData.infected);
              local.renderScale = playerData.renderScale || 1;
              // First moment we learn we've been infected: flip UI to claws + class panel.
              if (!wasZombie && local.vsRole === 'zombie') {
                this.playTransformEffect(local);
                this.setHint('You were infected! Hunt the survivors — click to claw.', 5);
              }
              if (wasZombie && local.vsRole !== 'zombie') {
                this.setHint('New round — you are a survivor. Grab a weapon and stay alive!', 5);
              }
              this.refreshEquipmentUi();
              this.updateZombieClassPanel();
            }
          }
          continue;
        }

        let character = this.characters.get(playerData.id);
        if (!character) {
          character = this.createRemoteCharacter(playerData, null);
        }
        character.name = playerData.name;
        character.avatarPreset = normalizeAvatarPresetKey(playerData.avatarPreset);
        character.bodyColors = cloneBodyColors(playerData.bodyColors);
        character.maxHealth = playerData.maxHealth;
        character.forcefield = playerData.forcefield;
        character.selectedTool = playerData.selectedTool;
        character.toolCooldown = playerData.toolCooldown || 0;
        character.slowTimer = playerData.slowTimer || 0;
        character.slowFactor = playerData.slowFactor || 1;
        character.hasteTimer = playerData.hasteTimer || 0;
        character.hasteFactor = playerData.hasteFactor || 1;
        character.colaTimer = playerData.colaTimer || 0;
        character.freezeMeter = playerData.freezeMeter || 0;
        character.frozenTimer = playerData.frozenTimer || 0;
        character.stunTimer = playerData.stunTimer || 0;
        character.poisonTimer = playerData.poisonTimer || 0;
        character.poisonDps = playerData.poisonDps || 0;
        character.ko = playerData.ko;
        character.wo = playerData.wo;
        if (this.versus) {
          character.vsRole = playerData.vsRole || 'human';
          character.vsClass = playerData.vsClass || null;
          character.infected = Boolean(playerData.infected);
          character.renderScale = playerData.renderScale || 1;
        }
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
        if (!seenPlayerIds.has(character.id)) {
          this.removeCharacter(character.id);
        }
      }

      const seenZombieIds = new Set();
      if (Array.isArray(snapshot.zombies)) {
        for (const zombieData of snapshot.zombies) {
          seenZombieIds.add(zombieData.id);
          let zombie = this.zombies.get(zombieData.id);
          if (!zombie) {
            zombie = this.createZombieFromSnapshot(zombieData);
            this.zombies.set(zombie.id, zombie);
          }
          zombie.zombieType = zombieData.zombieType;
          zombie.name = zombieData.name;
          zombie.bodyColors = cloneBodyColors(zombieData.bodyColors);
          zombie.renderScale = zombieData.renderScale || 1;
          zombie.walkSpeed = zombieData.walkSpeed;
          zombie.armor = zombieData.armor || 0;
          zombie.selectedTool = zombieData.selectedTool || null;
          zombie.bounds = { ...zombie.bounds, ...zombieData.bounds };
          zombie.cloakRevealUntil = this.time + (zombieData.cloakRevealTimer || 0);
          zombie.netTarget = zombieData;
          zombie.netReceivedAt = this.time;
          if (!zombie.netInitialized) {
            zombie.pos = vCopy(zombieData.pos);
            zombie.vel = vCopy(zombieData.vel);
            zombie.yaw = zombieData.yaw;
            zombie.walkCycle = zombieData.walkCycle;
            zombie.health = zombieData.health;
            zombie.dead = zombieData.dead;
            zombie.netInitialized = true;
          }
        }
      }
      for (const zombie of [...this.zombies.values()]) {
        if (!seenZombieIds.has(zombie.id)) {
          this.zombies.delete(zombie.id);
        }
      }

      this.sentries = Array.isArray(snapshot.sentries) ? snapshot.sentries.map((data) => deserializeSentry(data)) : [];
      this.projectiles = Array.isArray(snapshot.projectiles) ? snapshot.projectiles.map((data) => deserializeProjectile(data)) : [];
      this.corpses = Array.isArray(snapshot.corpses) ? snapshot.corpses.map((data) => deserializeCorpse(data)) : [];
      this.hazards = Array.isArray(snapshot.hazards) ? snapshot.hazards.map((data) => deserializeHazard(data)) : [];

      this.refreshAllUi(true);
    }

    applyRemoteSmoothingToCharacter(character, dt) {
      if (!character.netTarget) {
        return;
      }
      const target = character.netTarget;
      character.dead = Boolean(target.dead);
      character.health = lerp(character.health, target.health, clamp(dt * 12, 0, 1));
      character.forcefield = target.forcefield;
      character.selectedTool = target.selectedTool;
      character.toolCooldown = target.toolCooldown || 0;
      character.slowTimer = target.slowTimer || 0;
      character.slowFactor = target.slowFactor || 1;
      character.hasteTimer = target.hasteTimer || 0;
      character.hasteFactor = target.hasteFactor || 1;
      character.colaTimer = target.colaTimer || 0;
      character.freezeMeter = target.freezeMeter || 0;
      character.frozenTimer = target.frozenTimer || 0;
      character.stunTimer = target.stunTimer || 0;
      character.poisonTimer = target.poisonTimer || 0;
      character.poisonDps = target.poisonDps || 0;
      character.ko = target.ko;
      character.wo = target.wo;
      character.pos = vLerp(character.pos, target.pos, clamp(dt * 12, 0, 1));
      character.vel = vLerp(character.vel, target.vel, clamp(dt * 10, 0, 1));
      character.yaw = turnTowardsAngle(character.yaw, target.yaw, dt * 12);
      character.walkCycle += dt * (0.9 + clamp(Math.hypot(character.vel.x, character.vel.z) / character.walkSpeed, 0, 1) * 5.6);
    }

    applyRemoteSmoothingToZombie(zombie, dt) {
      if (!zombie.netTarget) {
        return;
      }
      const target = zombie.netTarget;
      zombie.dead = Boolean(target.dead);
      zombie.health = lerp(zombie.health, target.health, clamp(dt * 10, 0, 1));
      zombie.armor = target.armor || 0;
      zombie.pos = vLerp(zombie.pos, target.pos, clamp(dt * 10, 0, 1));
      zombie.vel = vLerp(zombie.vel, target.vel, clamp(dt * 8, 0, 1));
      zombie.yaw = turnTowardsAngle(zombie.yaw, target.yaw, dt * 10);
      zombie.walkCycle += dt * (0.8 + clamp(Math.hypot(zombie.vel.x, zombie.vel.z) / Math.max(1, zombie.walkSpeed), 0, 1) * 5);
    }

    applyLocalCorrection(local, dt) {
      if (!this.localAuthorityState) {
        return;
      }
      const auth = this.localAuthorityState;
      const wasDead = local.dead;
      local.dead = Boolean(auth.dead);
      local.avatarPreset = normalizeAvatarPresetKey(auth.avatarPreset);
      local.bodyColors = cloneBodyColors(auth.bodyColors);
      local.maxHealth = auth.maxHealth;
      local.forcefield = auth.forcefield;
      local.health = auth.health;
      local.toolCooldown = auth.toolCooldown || 0;
      local.slowTimer = auth.slowTimer || 0;
      local.slowFactor = auth.slowFactor || 1;
      local.hasteTimer = auth.hasteTimer || 0;
      local.hasteFactor = auth.hasteFactor || 1;
      local.colaTimer = auth.colaTimer || 0;
      local.freezeMeter = auth.freezeMeter || 0;
      local.frozenTimer = auth.frozenTimer || 0;
      local.stunTimer = auth.stunTimer || 0;
      local.poisonTimer = auth.poisonTimer || 0;
      local.poisonDps = auth.poisonDps || 0;
      local.ko = auth.ko;
      local.wo = auth.wo;
      local.selectedTool = auth.selectedTool;
      local.spawn = vCopy(auth.spawn || local.spawn);

      if (local.dead) {
        local.pos = vCopy(auth.pos);
        local.vel = vCopy(auth.vel);
      } else {
        // Reconcile horizontally toward the host; snap only on a big desync.
        const horizErr = Math.hypot(local.pos.x - auth.pos.x, local.pos.z - auth.pos.z);
        if (horizErr > 5) {
          local.pos.x = auth.pos.x;
          local.pos.z = auth.pos.z;
        } else {
          const k = clamp(dt * 6, 0, 1) * 0.5;
          local.pos.x = lerp(local.pos.x, auth.pos.x, k);
          local.pos.z = lerp(local.pos.z, auth.pos.z, k);
        }
        // Vertical: trust local prediction while airborne so relay latency doesn't squash
        // jumps; reconcile only when grounded or the gap is large.
        const yErr = Math.abs(local.pos.y - auth.pos.y);
        if (yErr > 4 || (local.grounded && yErr > 0.35)) {
          local.pos.y = lerp(local.pos.y, auth.pos.y, clamp(dt * 6, 0, 1) * 0.5);
        }
        // Only pull horizontal velocity toward the host; keep our own vertical velocity.
        local.vel.x = lerp(local.vel.x, auth.vel.x, 0.25);
        local.vel.z = lerp(local.vel.z, auth.vel.z, 0.25);
        local.yaw = turnTowardsAngle(local.yaw, auth.yaw, dt * 12);
      }

      if (wasDead && !local.dead) {
        this.audio.playRespawn();
      }
      this.refreshEquipmentUi();
      this.updateToolDescription();
    }
  }

  // ============================================================
  //  PUBLIC-SERVER NETWORKING
  //  A tiny hand-rolled MQTT 3.1.1 client over secure WebSocket +
  //  a relay network layer. Free public brokers act as the game
  //  server: hosts advertise games into a shared lobby, clients
  //  browse a live server list and join — no codes, no NAT/TURN.
  // ============================================================

  const PUBLIC_BROKERS = [
    { name: 'EMQX (public)', url: 'wss://broker.emqx.io:8084/mqtt' },
    { name: 'HiveMQ (public)', url: 'wss://broker.hivemq.com:8884/mqtt' },
    { name: 'Mosquitto (public)', url: 'wss://test.mosquitto.org:8081/mqtt' }
  ];
  // Bump the realm string if the wire protocol ever changes so old clients don't mix in.
  const NET_REALM = 'bnlzv1';

  function loadPreferredBroker() {
    try {
      const saved = localStorage.getItem('build-and-learn-broker');
      if (saved && PUBLIC_BROKERS.some((b) => b.url === saved)) {
        return saved;
      }
    } catch (error) { /* ignore */ }
    return PUBLIC_BROKERS[0].url;
  }

  class MiniMqtt {
    constructor(url, options = {}) {
      this.url = url;
      this.clientId = options.clientId || `bnl-${Math.random().toString(16).slice(2, 10)}`;
      this.keepalive = options.keepalive || 30;
      this.will = options.will || null;
      this.onConnect = options.onConnect || (() => {});
      this.onMessage = options.onMessage || (() => {});
      this.onClose = options.onClose || (() => {});
      this.onError = options.onError || (() => {});
      this.ws = null;
      this.connected = false;
      this.rxBuffer = new Uint8Array(0);
      this.pingTimer = null;
      this.encoder = new TextEncoder();
      this.decoder = new TextDecoder();
    }

    connect() {
      try {
        this.ws = new WebSocket(this.url, 'mqtt');
      } catch (error) {
        this.onError(error);
        return;
      }
      this.ws.binaryType = 'arraybuffer';
      this.ws.addEventListener('open', () => this.sendConnect());
      this.ws.addEventListener('message', (event) => this.handleBytes(new Uint8Array(event.data)));
      this.ws.addEventListener('close', () => {
        this.connected = false;
        if (this.pingTimer) { clearInterval(this.pingTimer); this.pingTimer = null; }
        this.onClose();
      });
      this.ws.addEventListener('error', (error) => this.onError(error));
    }

    encString(str) {
      const bytes = this.encoder.encode(str);
      const out = new Uint8Array(bytes.length + 2);
      out[0] = (bytes.length >> 8) & 0xff;
      out[1] = bytes.length & 0xff;
      out.set(bytes, 2);
      return out;
    }

    encRemainingLength(len) {
      const bytes = [];
      do {
        let b = len % 128;
        len = Math.floor(len / 128);
        if (len > 0) b |= 0x80;
        bytes.push(b);
      } while (len > 0);
      return Uint8Array.from(bytes);
    }

    frame(byte1, variableAndPayload) {
      const rem = this.encRemainingLength(variableAndPayload.length);
      const out = new Uint8Array(1 + rem.length + variableAndPayload.length);
      out[0] = byte1;
      out.set(rem, 1);
      out.set(variableAndPayload, 1 + rem.length);
      return out;
    }

    concat(arrays) {
      let total = 0;
      for (const a of arrays) total += a.length;
      const out = new Uint8Array(total);
      let off = 0;
      for (const a of arrays) { out.set(a, off); off += a.length; }
      return out;
    }

    raw(bytes) {
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(bytes);
      }
    }

    sendConnect() {
      let flags = 0x02; // clean session
      const payloadParts = [this.encString(this.clientId)];
      if (this.will) {
        flags |= 0x04; // will flag
        if (this.will.retain) flags |= 0x20;
        payloadParts.push(this.encString(this.will.topic));
        payloadParts.push(this.encString(this.will.payload || ''));
      }
      const variableHeader = this.concat([
        this.encString('MQTT'),
        Uint8Array.from([0x04, flags, (this.keepalive >> 8) & 0xff, this.keepalive & 0xff])
      ]);
      const body = this.concat([variableHeader, this.concat(payloadParts)]);
      this.raw(this.frame(0x10, body));
    }

    subscribe(topicFilter) {
      const packetId = Uint8Array.from([0x00, 0x01]);
      const body = this.concat([packetId, this.encString(topicFilter), Uint8Array.from([0x00])]);
      this.raw(this.frame(0x82, body));
    }

    publish(topic, payloadStr, retain = false) {
      const payload = this.encoder.encode(payloadStr);
      const body = this.concat([this.encString(topic), payload]);
      this.raw(this.frame(0x30 | (retain ? 0x01 : 0x00), body));
    }

    ping() {
      this.raw(Uint8Array.from([0xc0, 0x00]));
    }

    end() {
      try {
        this.raw(Uint8Array.from([0xe0, 0x00]));
        if (this.ws) this.ws.close();
      } catch (error) { /* ignore */ }
    }

    handleBytes(chunk) {
      // Append to the running buffer, then pull out every complete packet.
      const merged = new Uint8Array(this.rxBuffer.length + chunk.length);
      merged.set(this.rxBuffer, 0);
      merged.set(chunk, this.rxBuffer.length);
      this.rxBuffer = merged;

      let offset = 0;
      while (offset + 2 <= this.rxBuffer.length) {
        const byte1 = this.rxBuffer[offset];
        // Decode remaining length (up to 4 bytes).
        let multiplier = 1;
        let remLen = 0;
        let i = offset + 1;
        let done = false;
        let lenBytes = 0;
        while (i < this.rxBuffer.length) {
          const b = this.rxBuffer[i];
          remLen += (b & 0x7f) * multiplier;
          multiplier *= 128;
          lenBytes += 1;
          i += 1;
          if ((b & 0x80) === 0) { done = true; break; }
          if (lenBytes >= 4) { done = true; break; }
        }
        if (!done) break; // need more bytes for the length field
        const headerLen = 1 + lenBytes;
        if (offset + headerLen + remLen > this.rxBuffer.length) break; // packet not fully arrived
        const packetType = byte1 >> 4;
        const payloadStart = offset + headerLen;
        this.handlePacket(packetType, byte1, this.rxBuffer.subarray(payloadStart, payloadStart + remLen));
        offset = payloadStart + remLen;
      }
      this.rxBuffer = this.rxBuffer.subarray(offset);
    }

    handlePacket(type, byte1, body) {
      if (type === 2) {
        // CONNACK
        this.connected = true;
        if (this.pingTimer) clearInterval(this.pingTimer);
        this.pingTimer = setInterval(() => this.ping(), this.keepalive * 1000 * 0.75);
        this.onConnect();
      } else if (type === 3) {
        // PUBLISH (assume QoS 0 — no packet id)
        const topicLen = (body[0] << 8) | body[1];
        const topic = this.decoder.decode(body.subarray(2, 2 + topicLen));
        const payload = this.decoder.decode(body.subarray(2 + topicLen));
        this.onMessage(topic, payload);
      }
      // SUBACK / PINGRESP ignored.
    }
  }

  class PublicServerNetwork {
    constructor(gameInstance, options) {
      this.game = gameInstance;
      this.role = options.role;
      this.gameplayReady = this.role !== 'client';
      this.brokerUrl = loadPreferredBroker();
      this.mqtt = null;
      this.brokerConnected = false;
      this.serverId = null;         // host: our id; client: the joined id
      this.joined = false;          // client: has picked + joined a server
      this.peers = new Map();       // host: playerId -> { lastSeen }
      this.serverList = new Map();  // client: serverId -> meta
      this.hostMeta = null;
      this.heartbeatTimer = null;
      this.pruneTimer = null;
      this.listChangeCb = null;

      if (this.role === 'solo') {
        this.game.setNetworkStatus('Offline solo session.');
      }
    }

    topics() {
      const base = `${NET_REALM}`;
      return {
        lobbyWild: `${base}/lobby/+`,
        lobby: (id) => `${base}/lobby/${id}`,
        down: (id) => `${base}/room/${id}/d`,
        up: (id) => `${base}/room/${id}/u`
      };
    }

    isGameplayReady() {
      return this.gameplayReady;
    }

    isChannelOpen() {
      return this.brokerConnected && (this.role === 'host' ? Boolean(this.serverId) : this.joined);
    }

    setBrokerUrl(url) {
      this.brokerUrl = url;
      try { localStorage.setItem('build-and-learn-broker', url); } catch (error) { /* ignore */ }
    }

    // ---- shared connect ----
    connectBroker(onReady) {
      const t = this.topics();
      const will = this.role === 'host' && this.serverId
        ? { topic: t.lobby(this.serverId), payload: '', retain: true }
        : null;
      this.mqtt = new MiniMqtt(this.brokerUrl, {
        clientId: `bnl-${this.role}-${Math.random().toString(16).slice(2, 8)}`,
        keepalive: 30,
        will,
        onConnect: () => {
          this.brokerConnected = true;
          this.game.setNetworkStatus(`Connected to public server (${brokerLabel(this.brokerUrl)}).`);
          this.game.updateSessionHeader();
          if (onReady) onReady();
        },
        onMessage: (topic, payload) => this.onBrokerMessage(topic, payload),
        onClose: () => {
          this.brokerConnected = false;
          this.game.setNetworkStatus('Lost the connection to the public server. Retrying…');
          window.setTimeout(() => { if (!this.brokerConnected) this.connectBroker(onReady); }, 2500);
        },
        onError: () => {
          this.game.setNetworkStatus(`Could not reach ${brokerLabel(this.brokerUrl)}. Try another server from the list.`);
        }
      });
      this.game.setNetworkStatus(`Connecting to public server (${brokerLabel(this.brokerUrl)})…`);
      this.mqtt.connect();
    }

    onBrokerMessage(topic, payload) {
      const t = this.topics();
      // Lobby announcements (client browser).
      if (topic.startsWith(`${NET_REALM}/lobby/`)) {
        const id = topic.slice(`${NET_REALM}/lobby/`.length);
        if (!payload) {
          this.serverList.delete(id);
        } else {
          try {
            const meta = JSON.parse(payload);
            meta.serverId = id;
            meta.seenAt = Date.now();
            this.serverList.set(id, meta);
          } catch (error) { /* ignore malformed */ }
        }
        if (this.listChangeCb) this.listChangeCb(this.getServerList());
        return;
      }
      let msg;
      try { msg = JSON.parse(payload); } catch (error) { return; }
      if (this.role === 'host' && this.serverId && topic === t.up(this.serverId)) {
        this.handleClientMessage(msg);
      } else if (this.role === 'client' && this.serverId && topic === t.down(this.serverId)) {
        this.handleHostMessage(msg);
      }
    }

    // ================= HOST =================
    startHosting(meta) {
      this.serverId = `s${Math.random().toString(16).slice(2, 8)}`;
      this.hostMeta = meta || {};
      this.connectBroker(() => {
        const t = this.topics();
        this.mqtt.subscribe(t.up(this.serverId));
        this.publishLobby();
        this.heartbeatTimer = window.setInterval(() => this.publishLobby(), 4000);
        this.pruneTimer = window.setInterval(() => this.prunePeers(), 3000);
        this.game.setNetworkStatus(`Hosting "${this.hostMeta.name}" — friends can pick it from the server list.`);
      });
    }

    publishLobby() {
      if (!this.brokerConnected || !this.serverId) return;
      const meta = {
        name: this.hostMeta.name || 'Zombie Versus game',
        host: this.hostMeta.host || 'Host',
        players: this.game.characters ? this.game.characters.size : 1,
        maxPlayers: 6,
        phase: this.game.vs ? this.game.vs.phase : 'lobby',
        map: this.hostMeta.map || 'Zombie Versus',
        ts: Date.now()
      };
      this.mqtt.publish(this.topics().lobby(this.serverId), JSON.stringify(meta), true);
    }

    prunePeers() {
      const now = Date.now();
      for (const [id, info] of [...this.peers.entries()]) {
        if (now - info.lastSeen > 9000) {
          this.peers.delete(id);
          this.game.onPeerLeft(id);
          this.publishLobby();
        }
      }
    }

    handleClientMessage(msg) {
      const from = msg.from;
      if (!from) return;
      const peer = this.peers.get(from) || { lastSeen: 0 };
      peer.lastSeen = Date.now();
      this.peers.set(from, peer);
      if (msg.type === 'hello') {
        this.game.onPeerHello(from, msg.player);
        this.publishLobby();
      } else if (msg.type === 'input') {
        this.game.applyRemoteInput(from, msg.input);
      } else if (msg.type === 'tool') {
        this.game.applyRemoteToolUse(from, msg.action);
      } else if (msg.type === 'reset') {
        this.game.applyRemoteReset(from);
      } else if (msg.type === 'buy-vip') {
        this.game.buyVipWeapon(msg.weaponKey, true);
      } else if (msg.type === 'chat') {
        const character = this.game.characters.get(from);
        const speaker = character ? character.name : 'Player';
        this.game.receiveRemoteSpeech(from, speaker, msg.message);
        this.downPublish({ type: 'chat', playerId: from, speaker, message: msg.message });
      } else if (msg.type === 'bye') {
        this.peers.delete(from);
        this.game.onPeerLeft(from);
        this.publishLobby();
      }
    }

    downPublish(obj) {
      if (this.brokerConnected && this.serverId) {
        this.mqtt.publish(this.topics().down(this.serverId), JSON.stringify(obj));
      }
    }

    // ================= CLIENT =================
    startBrowsing(onListChange) {
      this.listChangeCb = onListChange;
      this.connectBroker(() => {
        this.mqtt.subscribe(this.topics().lobbyWild);
        this.game.setNetworkStatus('Browsing the public server list — pick a game to join.');
      });
    }

    getServerList() {
      const now = Date.now();
      return [...this.serverList.values()]
        .filter((m) => now - (m.seenAt || 0) < 13000)
        .sort((a, b) => (b.ts || 0) - (a.ts || 0));
    }

    joinServer(serverId) {
      if (!serverId) return;
      this.serverId = serverId;
      const t = this.topics();
      this.mqtt.subscribe(t.down(serverId));
      this.joined = true;
      this.game.onConnectedToHost();
      // Keep re-announcing until the host confirms us (guards against the hello or the
      // one-shot welcome being dropped while subscriptions settle on the broker).
      if (this.helloTimer) clearInterval(this.helloTimer);
      let tries = 0;
      const sayHello = () => {
        this.upPublish({
          type: 'hello',
          player: {
            id: this.game.localPlayerId,
            name: this.game.localCharacter.name,
            avatarPreset: this.game.localCharacter.avatarPreset
          }
        });
        tries += 1;
        if (this.gameplayReady || tries > 12) {
          clearInterval(this.helloTimer);
          this.helloTimer = null;
        }
      };
      sayHello();
      this.helloTimer = window.setInterval(sayHello, 1000);
      this.game.setNetworkStatus('Joining the game… waiting for the host to spawn you in.');
    }

    upPublish(obj) {
      if (!this.brokerConnected || !this.serverId) return;
      obj.from = this.game.localPlayerId;
      this.mqtt.publish(this.topics().up(this.serverId), JSON.stringify(obj));
    }

    handleHostMessage(msg) {
      if (msg.type === 'welcome') {
        if (msg.to && msg.to !== this.game.localPlayerId) return;
        this.gameplayReady = true;
        this.game.onWelcomeFromHost(msg.playerId || this.game.localPlayerId);
      } else if (msg.type === 'snapshot') {
        this.game.applySnapshot(msg.snapshot);
      } else if (msg.type === 'system-chat') {
        this.game.receiveSystemChat(msg.message);
      } else if (msg.type === 'chat') {
        if (msg.except && msg.except === this.game.localPlayerId) return;
        this.game.receiveRemoteSpeech(msg.playerId, msg.speaker, msg.message);
      }
    }

    // ================= game-facing API (same names as before) =================
    isHostReady() { return this.role === 'host' && this.brokerConnected; }

    sendWelcome(connectionKey, playerId) {
      this.downPublish({ type: 'welcome', to: connectionKey, playerId });
    }

    sendInput(input) {
      if (this.role !== 'client') return;
      this.upPublish({ type: 'input', input });
    }

    sendToolUse(action) {
      if (this.role !== 'client') return;
      this.upPublish({ type: 'tool', action });
    }

    sendReset() {
      if (this.role !== 'client') return;
      this.upPublish({ type: 'reset' });
    }

    sendVipPurchase(weaponKey) {
      if (this.role !== 'client') return;
      this.upPublish({ type: 'buy-vip', weaponKey });
    }

    sendChat(message) {
      if (this.role !== 'client') return;
      this.upPublish({ type: 'chat', message });
    }

    broadcastChat(playerId, speaker, message, exceptConnectionKey = null) {
      if (this.role !== 'host') return;
      this.downPublish({ type: 'chat', playerId, speaker, message, except: exceptConnectionKey });
    }

    broadcastSystemChat(message) {
      if (this.role !== 'host') return;
      this.downPublish({ type: 'system-chat', message });
    }

    broadcastSnapshot() {
      if (this.role !== 'host' || !this.brokerConnected) return;
      this.downPublish({ type: 'snapshot', snapshot: this.game.buildSnapshot() });
    }

    leave() {
      try {
        if (this.role === 'client' && this.serverId) {
          this.upPublish({ type: 'bye' });
        }
        if (this.role === 'host' && this.serverId && this.brokerConnected) {
          // Clear our retained lobby entry so it vanishes from the list.
          this.mqtt.publish(this.topics().lobby(this.serverId), '', true);
        }
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
        if (this.pruneTimer) clearInterval(this.pruneTimer);
        if (this.mqtt) this.mqtt.end();
      } catch (error) { /* ignore */ }
    }
  }

  function brokerLabel(url) {
    const found = PUBLIC_BROKERS.find((b) => b.url === url);
    return found ? found.name : url;
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
      // Night lighting by default; the Studio preview overrides this for a bright, clear look.
      this.lighting = {
        clear: [0.04, 0.05, 0.11],
        fog: [0.04, 0.05, 0.11],
        fogNear: 55,
        fogFar: 190,
        lightDir: [-0.4, 0.85, -0.5],
        ambient: 0.34,
        diffuse: 0.44,
        tint: [0.6, 0.7, 1.0]
      };
      gl.clearColor(this.lighting.clear[0], this.lighting.clear[1], this.lighting.clear[2], 1);
    }

    setLighting(partial) {
      Object.assign(this.lighting, partial);
      const c = this.lighting.clear;
      this.gl.clearColor(c[0], c[1], c[2], 1);
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
      const L = this.lighting;
      gl.uniformMatrix4fv(program.uniforms.viewProj, false, cameraMatrix);
      gl.uniform3f(program.uniforms.cameraPos, cameraPos.x, cameraPos.y, cameraPos.z);
      gl.uniform3f(program.uniforms.lightDir, L.lightDir[0], L.lightDir[1], L.lightDir[2]);
      gl.uniform3f(program.uniforms.fogColor, L.fog[0], L.fog[1], L.fog[2]);
      gl.uniform1f(program.uniforms.fogNear, L.fogNear);
      gl.uniform1f(program.uniforms.fogFar, L.fogFar);
      gl.uniform1f(program.uniforms.ambient, L.ambient);
      gl.uniform1f(program.uniforms.diffuse, L.diffuse);
      gl.uniform3f(program.uniforms.tint, L.tint[0], L.tint[1], L.tint[2]);

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
      const L = this.lighting;
      gl.useProgram(program.program);
      gl.uniformMatrix4fv(program.uniforms.viewProj, false, cameraMatrix);
      gl.uniform3f(program.uniforms.cameraPos, cameraPos.x, cameraPos.y, cameraPos.z);
      gl.uniform3f(program.uniforms.fogColor, L.fog[0], L.fog[1], L.fog[2]);
      gl.uniform1f(program.uniforms.fogNear, L.fogNear);
      gl.uniform1f(program.uniforms.fogFar, L.fogFar);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
      gl.enableVertexAttribArray(program.attributes.position);
      gl.vertexAttribPointer(program.attributes.position, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.color);
      gl.enableVertexAttribArray(program.attributes.color);
      gl.vertexAttribPointer(program.attributes.color, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.LINES, 0, mesh.count);
    }
  }

  function base64ToBytes(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
  }

  // Minimal Standard MIDI File parser → flat list of notes with times in seconds.
  function parseMidi(data) {
    let p = 0;
    const u32 = () => { const v = (data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]; p += 4; return v >>> 0; };
    const u16 = () => { const v = (data[p] << 8) | data[p + 1]; p += 2; return v; };
    const str4 = () => { const s = String.fromCharCode(data[p], data[p + 1], data[p + 2], data[p + 3]); p += 4; return s; };
    if (str4() !== 'MThd') {
      throw new Error('not a midi file');
    }
    u32();
    u16(); // format
    const ntracks = u16();
    const division = u16();
    const ppq = (division & 0x8000) ? 480 : division || 480;
    const tempos = [{ tick: 0, tempo: 500000 }];
    const rawNotes = [];
    for (let t = 0; t < ntracks; t += 1) {
      if (p + 8 > data.length || str4() !== 'MTrk') {
        break;
      }
      const len = u32();
      const end = Math.min(p + len, data.length);
      let tick = 0;
      let running = 0;
      const on = {};
      while (p < end) {
        let delta = 0;
        let b;
        do { b = data[p++]; delta = (delta << 7) | (b & 0x7f); } while (b & 0x80 && p < end);
        tick += delta;
        let status = data[p];
        if (status & 0x80) { p += 1; running = status; } else { status = running; }
        const type = status & 0xf0;
        const channel = status & 0x0f;
        if (status === 0xFF) {
          const metaType = data[p++];
          let mlen = 0; let mb;
          do { mb = data[p++]; mlen = (mlen << 7) | (mb & 0x7f); } while (mb & 0x80);
          if (metaType === 0x51 && mlen === 3) {
            tempos.push({ tick, tempo: (data[p] << 16) | (data[p + 1] << 8) | data[p + 2] });
          }
          p += mlen;
        } else if (status === 0xF0 || status === 0xF7) {
          let slen = 0; let sb;
          do { sb = data[p++]; slen = (slen << 7) | (sb & 0x7f); } while (sb & 0x80);
          p += slen;
        } else if (type === 0x90) {
          const note = data[p++]; const vel = data[p++];
          const key = channel + '_' + note;
          if (vel > 0) { on[key] = { startTick: tick, velocity: vel }; }
          else if (on[key]) { rawNotes.push({ startTick: on[key].startTick, endTick: tick, note, velocity: on[key].velocity, channel }); delete on[key]; }
        } else if (type === 0x80) {
          const note = data[p++]; p += 1;
          const key = channel + '_' + note;
          if (on[key]) { rawNotes.push({ startTick: on[key].startTick, endTick: tick, note, velocity: on[key].velocity, channel }); delete on[key]; }
        } else if (type === 0xC0 || type === 0xD0) {
          p += 1;
        } else {
          p += 2;
        }
      }
      p = end;
    }
    tempos.sort((a, b) => a.tick - b.tick);
    const tickToSec = (targetTick) => {
      let sec = 0; let lastTick = 0; let tempo = 500000;
      for (let i = 0; i < tempos.length; i += 1) {
        if (tempos[i].tick > targetTick) break;
        sec += (tempos[i].tick - lastTick) * (tempo / 1e6 / ppq);
        lastTick = tempos[i].tick;
        tempo = tempos[i].tempo;
      }
      sec += (targetTick - lastTick) * (tempo / 1e6 / ppq);
      return sec;
    };
    const notes = [];
    let duration = 0;
    for (const rn of rawNotes) {
      if (rn.channel === 9) continue; // skip drum channel
      const time = tickToSec(rn.startTick);
      const endT = tickToSec(rn.endTick);
      notes.push({ time, duration: Math.max(0.06, endT - time), note: rn.note, velocity: rn.velocity, channel: rn.channel });
      duration = Math.max(duration, endT);
    }
    notes.sort((a, b) => a.time - b.time);
    return { notes, duration };
  }

  class MidiPlayer {
    constructor(context, destination) {
      this.context = context;
      this.out = destination;
      this.songs = {};
      this.playing = false;
      this.active = [];
      this.timer = null;
      this.volume = 0.07;
    }

    load(map) {
      for (const key of Object.keys(map || {})) {
        try {
          this.songs[key] = parseMidi(base64ToBytes(map[key]));
        } catch (error) {
          /* skip bad file */
        }
      }
    }

    playRandom(volume) {
      const keys = Object.keys(this.songs);
      if (!keys.length) {
        return;
      }
      this.play(keys[Math.floor(Math.random() * keys.length)], volume);
    }

    play(key, volume = 0.07) {
      const song = this.songs[key];
      if (!this.context || !song || !song.notes.length) {
        return;
      }
      this.stop();
      this.volume = volume;
      this.notes = song.notes;
      this.duration = song.duration;
      this.playing = true;
      this.startTime = this.context.currentTime + 0.08;
      this.index = 0;
      this.schedule();
      this.timer = setInterval(() => this.schedule(), 130);
    }

    schedule() {
      if (!this.playing) {
        return;
      }
      const elapsed = this.context.currentTime - this.startTime;
      const lookahead = elapsed + 0.45;
      while (this.index < this.notes.length && this.notes[this.index].time < lookahead) {
        this.scheduleNote(this.notes[this.index]);
        this.index += 1;
      }
      if (this.index >= this.notes.length && elapsed > this.duration + 0.4) {
        this.startTime = this.context.currentTime + 0.08;
        this.index = 0;
      }
    }

    scheduleNote(n) {
      const t0 = this.startTime + n.time;
      const t1 = t0 + Math.min(n.duration, 2.4);
      const osc = this.context.createOscillator();
      osc.type = ['triangle', 'square', 'sawtooth', 'sine'][n.channel % 4];
      osc.frequency.value = 440 * Math.pow(2, (n.note - 69) / 12);
      const gain = this.context.createGain();
      const vol = this.volume * (n.velocity / 127) * 0.6;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(vol, t0 + 0.015);
      gain.gain.setValueAtTime(vol, Math.max(t0 + 0.03, t1 - 0.06));
      gain.gain.exponentialRampToValueAtTime(0.0001, t1);
      osc.connect(gain);
      gain.connect(this.out);
      osc.start(t0);
      osc.stop(t1 + 0.03);
      this.active.push(osc);
      osc.onended = () => {
        const i = this.active.indexOf(osc);
        if (i >= 0) this.active.splice(i, 1);
      };
    }

    stop() {
      this.playing = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      for (const osc of this.active) {
        try { osc.stop(); } catch (error) { /* ignore */ }
      }
      this.active = [];
    }
  }

  class AudioEngine {
    constructor() {
      this.context = null;
      this.master = null;
      // HTML5 <audio> elements — these work from file:// (fetch/Web-Audio decode does not).
      this.els = null;
      this.zombieEls = [];
    }

    init() {
      if (this.context) {
        return;
      }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.context = new AudioCtx();
        this.master = this.context.createGain();
        this.master.gain.value = 0.55;
        this.master.connect(this.context.destination);
        this.musicGain = this.context.createGain();
        this.musicGain.gain.value = 1;
        this.musicGain.connect(this.master);
        this.midi = new MidiPlayer(this.context, this.musicGain);
        if (window.MIDI_FILES) {
          this.midi.load(window.MIDI_FILES);
        }
      }
      this.loadSamples();
    }

    playWaveMusic() {
      if (this.midi) {
        this.midi.playRandom(0.08);
      }
    }

    stopMusic() {
      if (this.midi) {
        this.midi.stop();
      }
    }

    loadSamples() {
      if (this.els) {
        return;
      }
      const make = (file, volume) => {
        const el = new Audio(encodeURI(file));
        el.preload = 'auto';
        el.volume = volume;
        return el;
      };
      this.els = {
        jump: make('jump.mp3', 0.7),
        walk: make('walk loop.mp3', 0.5),
        shoot: make('shootsfxold.mp3', 0.85),
        zombie1: make('zombie1.mp3', 0.8),
        zombie2: make('zombie2.mp3', 0.8),
        zombie3: make('zombie3.mp3', 0.8),
        zombie4: make('zombie4.mp3', 0.8)
      };
      this.els.walk.loop = true;
      this.zombieEls = [this.els.zombie1, this.els.zombie2, this.els.zombie3, this.els.zombie4];
    }

    // Clone-and-play so rapid or overlapping sounds don't cut each other off.
    playEl(el, volume, rate = 1) {
      if (!el) {
        return;
      }
      try {
        const node = el.cloneNode();
        node.volume = volume !== undefined ? volume : el.volume;
        node.playbackRate = rate;
        const promise = node.play();
        if (promise && promise.catch) {
          promise.catch(() => {});
        }
      } catch (error) {
        /* ignore */
      }
    }

    playGunShot() {
      if (this.els && this.els.shoot) {
        this.playEl(this.els.shoot, 0.85, 0.94 + Math.random() * 0.12);
      } else {
        this.tone('square', 220, 0.05, 0.08, 0.002, 0.06, 0);
      }
    }

    playZombieGroan() {
      if (this.zombieEls.length) {
        const el = this.zombieEls[Math.floor(Math.random() * this.zombieEls.length)];
        this.playEl(el, 0.8, 0.9 + Math.random() * 0.2);
      }
    }

    updateWalkSound(moving) {
      const el = this.els && this.els.walk;
      if (!el) {
        return;
      }
      if (moving && el.paused) {
        try {
          el.currentTime = 0;
        } catch (error) {
          /* ignore */
        }
        const promise = el.play();
        if (promise && promise.catch) {
          promise.catch(() => {});
        }
      } else if (!moving && !el.paused) {
        el.pause();
      }
    }

    stopWalk() {
      const el = this.els && this.els.walk;
      if (el && !el.paused) {
        el.pause();
      }
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
      if (this.els && this.els.jump) {
        this.playEl(this.els.jump, 0.7);
        return;
      }
      this.tone('square', 320, 0.06, 0.12, 0.004, 0.08, -80);
      this.tone('triangle', 520, 0.04, 0.08, 0.002, 0.06, -40);
    }

    playSwordSwing() {
      this.noise(0.08, 0.06);
      this.tone('sawtooth', 210, 0.07, 0.08, 0.002, 0.09, 250);
    }

    playPistol() {
      this.tone('square', 220, 0.05, 0.08, 0.002, 0.06, 0);
    }

    playRevolver() {
      this.noise(0.03, 0.05);
      this.tone('square', 160, 0.07, 0.1, 0.002, 0.07, -30);
    }

    playRifle() {
      this.noise(0.025, 0.04);
      this.tone('sawtooth', 260, 0.045, 0.075, 0.001, 0.05, -80);
    }

    playBlaster() {
      this.tone('square', 460, 0.05, 0.065, 0.001, 0.05, 30);
    }

    playIce() {
      this.tone('triangle', 680, 0.05, 0.06, 0.001, 0.06, 50);
    }

    playGoo() {
      this.tone('sine', 180, 0.08, 0.065, 0.003, 0.08, -30);
    }

    playSticky() {
      this.tone('square', 240, 0.06, 0.07, 0.002, 0.07, -40);
    }

    playMinigun() {
      this.tone('square', 420, 0.03, 0.05, 0.001, 0.03, 0);
    }

    playShotgun() {
      this.noise(0.06, 0.08);
      this.tone('triangle', 120, 0.07, 0.075, 0.001, 0.08, -100);
    }

    playDeploy() {
      this.tone('square', 300, 0.06, 0.07, 0.001, 0.06, 0);
      this.tone('triangle', 420, 0.06, 0.04, 0.001, 0.05, 0);
    }

    playHeal() {
      this.tone('sine', 540, 0.08, 0.07, 0.001, 0.12, 0);
      this.tone('sine', 720, 0.08, 0.05, 0.001, 0.12, 0);
    }

    playBuff() {
      this.tone('square', 520, 0.05, 0.06, 0.001, 0.06, 0);
      this.tone('square', 680, 0.05, 0.04, 0.001, 0.05, 0);
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

  function playWeaponAudio(audio, weapon) {
    if (!audio) {
      return;
    }
    // Every gun uses the shared gunshot sample.
    if (['pistol', 'revolver', 'rifle', 'blaster', 'ice', 'goo', 'sticky', 'minigun', 'shotgun'].includes(weapon.sound)) {
      audio.playGunShot();
      return;
    }
    if (weapon.sound === 'swing') {
      audio.playSwordSwing();
    } else if (weapon.sound === 'deploy') {
      audio.playDeploy();
    } else if (weapon.sound === 'shotgun') {
      audio.playShotgun();
    } else if (weapon.sound === 'heal') {
      audio.playHeal();
    } else if (weapon.sound === 'buff') {
      audio.playBuff();
    } else if (weapon.sound === 'wrench' || weapon.sound === 'stun') {
      audio.playSwordSwing();
    }
  }

  function createCharacter(options) {
    const avatarPreset = normalizeAvatarPresetKey(options.avatarPreset);
    const preset = getAvatarPreset(avatarPreset);
    const bounds = options.bounds || { halfX: 1.05, halfZ: 1.05, bottom: 0, top: 5.85 };
    return {
      id: options.id,
      name: options.name,
      kind: options.kind || 'player',
      team: options.team || 'human',
      isLocal: Boolean(options.isLocal),
      avatarPreset,
      noFace: Boolean(options.noFace),
      hiddenLabel: Boolean(options.hiddenLabel),
      renderScale: options.renderScale || 1,
      spawn: vCopy(options.spawn),
      pos: vCopy(options.spawn),
      vel: v3(),
      yaw: 0.78,
      health: options.maxHealth || 100,
      maxHealth: options.maxHealth || 100,
      walkSpeed: options.walkSpeed || 16,
      ko: 0,
      wo: 0,
      grounded: false,
      climbing: false,
      jumpHeld: false,
      forcefield: 0,
      lastDamageAgo: 99,
      damageFlash: 0,
      dead: false,
      selectedTool: options.selectedTool ?? STARTER_WEAPON_KEY,
      toolCooldown: 0,
      walkCycle: randRange(0, TAU),
      bodyColors: cloneBodyColors(options.bodyColors || preset.bodyColors),
      swing: {
        time: 0,
        duration: 0.3,
        didHit: false,
        weaponKey: null
      },
      bubble: null,
      bubbleUntil: 0,
      label: null,
      bounds: {
        halfX: bounds.halfX,
        halfZ: bounds.halfZ,
        bottom: bounds.bottom,
        top: bounds.top
      },
      poisonTimer: 0,
      poisonDps: 0,
      slowTimer: 0,
      slowFactor: 1,
      hasteTimer: 0,
      hasteFactor: 1,
      colaTimer: 0,
      freezeMeter: 0,
      frozenTimer: 0,
      stunTimer: 0,
      armor: options.armor || 0,
      armorBroken: false,
      specialCooldown: 0,
      tempSpeedMultiplier: 1,
      cloakRevealUntil: 0
    };
  }

  function createCorpse(character) {
    const parts = [];
    const base = character.pos;
    const colors = character.bodyColors;
    const pose = getCharacterPose(character);
    const scale = character.renderScale || 1;
    const definitions = [
      { name: 'head', center: vAdd(base, rotateAroundY(v3(0, 5.2 * scale, 0), character.yaw)), size: v3(1.8 * scale, 1.55 * scale, 1.55 * scale), color: colors.head },
      { name: 'torso', center: vAdd(base, rotateAroundY(v3(0, 3.1 * scale, 0), character.yaw)), size: v3(2 * scale, 2 * scale, 1 * scale), color: colors.torso },
      { name: 'left-arm', center: pose.leftArmCenter, size: v3(1 * scale, 2 * scale, 1 * scale), color: colors.arms },
      { name: 'right-arm', center: pose.rightArmCenter, size: v3(1 * scale, 2 * scale, 1 * scale), color: colors.arms },
      { name: 'left-leg', center: pose.leftLegCenter, size: v3(1 * scale, 2 * scale, 1 * scale), color: colors.legs },
      { name: 'right-leg', center: pose.rightLegCenter, size: v3(1 * scale, 2 * scale, 1 * scale), color: colors.legs }
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

  // Poison/acid victims crumble into a burst of grey ash cubes instead of body parts.
  function createAshCorpse(character) {
    const parts = [];
    const base = character.pos;
    const scale = character.renderScale || 1;
    for (let i = 0; i < 16; i += 1) {
      const s = randRange(0.18, 0.5) * scale;
      parts.push({
        name: 'ash',
        pos: vAdd(base, v3(randRange(-0.9, 0.9) * scale, randRange(0.4, 5.6) * scale, randRange(-0.6, 0.6) * scale)),
        size: v3(s, s, s),
        color: shade(rgba(122, 118, 110, 1), randRange(0.5, 1.2)),
        vel: v3(randRange(-3.2, 3.2), randRange(1.5, 6.5), randRange(-3.2, 3.2)),
        rot: v3(randRange(0, TAU), randRange(0, TAU), randRange(0, TAU)),
        spin: v3(randRange(-6, 6), randRange(-6, 6), randRange(-6, 6))
      });
    }
    return {
      owner: character.name,
      timer: 2.6,
      parts
    };
  }

  function buildZombieWorld() {
    const solid = createTriBuilder();
    const transparent = createTriBuilder();
    const lines = createLineBuilder();
    const colliders = [];

    const blocks = [];
    const addBrick = ({ target = solid, center, size, color, studs = false, lineColor = OUTLINE, solidCollider = true, kill = false, climbable = false, transparentOnly = false }) => {
      appendAxisAlignedBox(target, lines, center, size, color, { studs, lineColor });
      blocks.push({
        type: 'box',
        x: center.x, y: center.y, z: center.z,
        w: size.x, h: size.y, d: size.z,
        rx: 0, ry: 0, rz: 0,
        color: colorToHex(color),
        solid: solidCollider
      });
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

    // Larger ground and a darker grass border.
    addBrick({ center: v3(0, -1, 0), size: v3(240, 2, 240), color: COLORS.grass, studs: true });
    addBrick({ center: v3(0, -2.1, 0), size: v3(248, 0.3, 248), color: COLORS.grassDark, solidCollider: false });
    // Central plaza and cracked cross roads.
    addBrick({ center: v3(0, 0.12, 0), size: v3(30, 0.24, 30), color: COLORS.concrete, solidCollider: false });
    addBrick({ center: v3(0, 0.05, 0), size: v3(160, 0.1, 12), color: COLORS.asphalt, solidCollider: false });
    addBrick({ center: v3(0, 0.05, 0), size: v3(12, 0.1, 160), color: COLORS.asphalt, solidCollider: false });

    // Perimeter boundary wall — tall enough that you cannot jump out or fall off.
    addPerimeterWall(addBrick, 96, 13);

    // Inner cover blocks around the spawn plaza.
    const walls = [
      { center: v3(0, 2, -15.4), size: v3(22, 4, 1) },
      { center: v3(0, 2, 15.4), size: v3(22, 4, 1) },
      { center: v3(-15.4, 2, 0), size: v3(1, 4, 22) },
      { center: v3(15.4, 2, 0), size: v3(1, 4, 22) }
    ];
    for (const wall of walls) {
      addBrick({ center: wall.center, size: wall.size, color: COLORS.concrete });
    }

    addBrick({ center: v3(-7.4, 1.1, -7.4), size: v3(3, 2.2, 3), color: COLORS.dirtDark });
    addBrick({ center: v3(7.4, 1.1, -7.4), size: v3(3, 2.2, 3), color: COLORS.dirtDark });
    addBrick({ center: v3(-7.4, 1.1, 7.4), size: v3(3, 2.2, 3), color: COLORS.dirtDark });
    addBrick({ center: v3(7.4, 1.1, 7.4), size: v3(3, 2.2, 3), color: COLORS.dirtDark });

    // Outlying structures spread across the bigger yard.
    addShelter(addBrick, transparent, -54, -32);
    addShelter(addBrick, transparent, 54, -32);
    addShelter(addBrick, transparent, -54, 46);
    addShelter(addBrick, transparent, 54, 46);
    addWatchPlatform(addBrick, 0, 50);
    addWatchPlatform(addBrick, -70, 6);
    addWatchPlatform(addBrick, 70, 6);
    addBarricadeLine(addBrick, -34, 26);
    addBarricadeLine(addBrick, 34, 26);
    addBarricadeLine(addBrick, -34, -22);
    addBarricadeLine(addBrick, 34, -22);
    addBarricadeLine(addBrick, -24, 0);
    addBarricadeLine(addBrick, 24, 0);
    addBarricadeLine(addBrick, 0, 68);
    addBarricadeLine(addBrick, 0, -68);

    // Loading-dock wall to the north.
    addBrick({ center: v3(0, 0.45, 66), size: v3(34, 0.9, 10), color: COLORS.concrete, studs: true });
    addBrick({ center: v3(0, 2.6, 66), size: v3(30, 4, 1), color: COLORS.concreteDark });
    addBrick({ center: v3(-14.5, 2.6, 66), size: v3(1, 4, 8), color: COLORS.concreteDark });
    addBrick({ center: v3(14.5, 2.6, 66), size: v3(1, 4, 8), color: COLORS.concreteDark });

    // Street lamps for the night mood.
    addLampPost(addBrick, -28, -28);
    addLampPost(addBrick, 28, -28);
    addLampPost(addBrick, -28, 28);
    addLampPost(addBrick, 28, 28);
    addLampPost(addBrick, -62, 0);
    addLampPost(addBrick, 62, 0);
    addLampPost(addBrick, 0, -54);

    // Moon hanging in the night sky.
    addMoon(solid, lines);

    const playerSpawns = [
      v3(0, 0.01, 0),
      v3(4, 0.01, 0),
      v3(-4, 0.01, 0),
      v3(0, 0.01, 4),
      v3(0, 0.01, -4),
      v3(6, 0.01, 3),
      v3(-6, 0.01, -3),
      v3(3, 0.01, -6)
    ];

    const zombieSpawns = [
      v3(0, 0.01, -68),
      v3(0, 0.01, 68),
      v3(-68, 0.01, 0),
      v3(68, 0.01, 0),
      v3(54, 0.01, 46),
      v3(-54, 0.01, 46),
      v3(54, 0.01, -46),
      v3(-54, 0.01, -46),
      v3(22, 0.01, -64),
      v3(-22, 0.01, 64)
    ];

    return {
      solid,
      transparent,
      lines,
      colliders,
      blocks,
      spawnPoint: v3(0, 0.01, 0),
      playerSpawns,
      zombieSpawns
    };
  }

  function addShelter(addBrick, transparentBuilder, x, z) {
    addBrick({ center: v3(x, 0.5, z), size: v3(18, 1, 14), color: COLORS.concrete, studs: true });
    addBrick({ center: v3(x, 4, z - 6.5), size: v3(18, 7, 1), color: COLORS.concreteDark });
    addBrick({ center: v3(x - 8.5, 4, z), size: v3(1, 7, 14), color: COLORS.concreteDark });
    addBrick({ center: v3(x + 8.5, 4, z), size: v3(1, 7, 14), color: COLORS.concreteDark });
    addBrick({ center: v3(x, 7.5, z), size: v3(20, 1, 16), color: COLORS.asphaltDark });
    addBrick({ center: v3(x - 4.5, 2.6, z - 6.4), size: v3(4, 3, 0.2), color: COLORS.glass, solidCollider: false, transparentOnly: true, target: transparentBuilder });
    addBrick({ center: v3(x + 4.5, 2.6, z - 6.4), size: v3(4, 3, 0.2), color: COLORS.glass, solidCollider: false, transparentOnly: true, target: transparentBuilder });
    addBrick({ center: v3(x, 1.4, z + 5.7), size: v3(3.5, 2.8, 0.6), color: COLORS.brown });
  }

  function addWatchPlatform(addBrick, x, z) {
    addBrick({ center: v3(x, 0.5, z), size: v3(14, 1, 14), color: COLORS.concrete, studs: true });
    addBrick({ center: v3(x - 5.5, 5, z - 5.5), size: v3(1, 10, 1), color: COLORS.concreteDark });
    addBrick({ center: v3(x + 5.5, 5, z - 5.5), size: v3(1, 10, 1), color: COLORS.concreteDark });
    addBrick({ center: v3(x - 5.5, 5, z + 5.5), size: v3(1, 10, 1), color: COLORS.concreteDark });
    addBrick({ center: v3(x + 5.5, 5, z + 5.5), size: v3(1, 10, 1), color: COLORS.concreteDark });
    addBrick({ center: v3(x, 10.5, z), size: v3(14, 1, 14), color: COLORS.asphalt, studs: true });
    addBrick({ center: v3(x, 12.1, z - 6), size: v3(12, 2, 1), color: COLORS.concreteDark });
    addBrick({ center: v3(x, 12.1, z + 6), size: v3(12, 2, 1), color: COLORS.concreteDark });
    addBrick({ center: v3(x - 6, 12.1, z), size: v3(1, 2, 12), color: COLORS.concreteDark });
    addBrick({ center: v3(x + 6, 12.1, z), size: v3(1, 2, 12), color: COLORS.concreteDark });
  }

  function addBarricadeLine(addBrick, x, z) {
    for (let i = -1; i <= 1; i += 1) {
      addBrick({ center: v3(x + i * 3.2, 0.8, z), size: v3(2.4, 1.6, 2.4), color: i === 0 ? COLORS.brown : COLORS.concreteDark, studs: true });
    }
  }

  function addPerimeterWall(addBrick, half, height) {
    const thickness = 4;
    const midY = height / 2;
    const span = half * 2 + thickness;
    const sides = [
      { center: v3(0, midY, -half), size: v3(span, height, thickness) },
      { center: v3(0, midY, half), size: v3(span, height, thickness) },
      { center: v3(-half, midY, 0), size: v3(thickness, height, span) },
      { center: v3(half, midY, 0), size: v3(thickness, height, span) }
    ];
    for (const side of sides) {
      addBrick({ center: side.center, size: side.size, color: COLORS.wallStone });
      // Boarded plank cap along the top for an old survival-yard look.
      addBrick({
        center: v3(side.center.x, height + 0.4, side.center.z),
        size: v3(side.size.x * 0.99, 0.8, side.size.z * 0.99),
        color: COLORS.woodPlankDark,
        solidCollider: false
      });
    }
  }

  function addLampPost(addBrick, x, z) {
    addBrick({ center: v3(x, 3.2, z), size: v3(0.6, 6.4, 0.6), color: COLORS.lampPost });
    addBrick({ center: v3(x, 6.3, z + 0.9), size: v3(0.5, 0.4, 2), color: COLORS.lampPost, solidCollider: false });
    addBrick({ center: v3(x, 5.85, z + 1.75), size: v3(1.2, 0.8, 1.2), color: COLORS.lampGlow, solidCollider: false });
  }

  function addMoon(solidBuilder, lineBuilder) {
    const center = v3(-46, 82, -78);
    appendOrientedBox(solidBuilder, lineBuilder, center, v3(30, 30, 1.5), v3(0, 0, 0), COLORS.moonGlow, COLORS.moonGlow, false);
    appendOrientedBox(solidBuilder, lineBuilder, vAdd(center, v3(0, 0, 0.6)), v3(18, 18, 1.5), v3(0, 0, 0), COLORS.moon, COLORS.moon, false);
  }

  function renderCharacter(triBuilder, lineBuilder, character, hideBody, currentTime = 0) {
    const colors = character.bodyColors;
    const pose = getCharacterPose(character);
    const root = character.pos;
    const yaw = character.yaw;
    const scale = character.renderScale || 1;

    // Ghost class flickers invisible (to others) on a cycle.
    if (character.vsClass === 'ghost' && !character.isLocal && ((currentTime + (character.pos.x % 5)) % 5) < 1.5) {
      return;
    }

    // Studio playtest: draw custom block models for zombies / your avatar.
    if (!hideBody && activeStudioProject) {
      let shapes = null;
      if (character.kind === 'zombie') {
        const z = activeStudioProject.zombies[character.zombieType];
        if (z) shapes = z.model;
      } else if (character.kind === 'player' && activeStudioProject.avatars) {
        const av = activeStudioProject.avatars[activeStudioProject.defaultAvatar] || Object.values(activeStudioProject.avatars)[0];
        if (av) shapes = av.model;
      }
      if (shapes) {
        renderStudioModelPosed(triBuilder, lineBuilder, shapes, character, scale);
        if (character.forcefield > 0 && character.kind === 'player') {
          addForcefieldRings(lineBuilder, vAdd(root, v3(0, 2.9 * scale, 0)), 3.6 * scale, COLORS.forcefield);
        }
        if (character.selectedTool) {
          renderHeldWeapon(triBuilder, lineBuilder, character, pose, yaw, hideBody);
        }
        return;
      }
    }

    if (!hideBody) {
      const infected = character.vsRole === 'zombie';
      const noLegs = character.vsClass === 'crawler';
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1, y: 2.1, z: -0.5 }, scale), scaleBox({ x: 1, y: 4.1, z: 0.5 }, scale), colors.torso, true);
      const hideMouth = character.kind === 'player' && getAvatarPreset(character.avatarPreset).accessories.doctorMask;
      addHead(triBuilder, lineBuilder, root, yaw, colors.head, { hideFace: character.noFace || infected, hideMouth, scale });
      addLimb(triBuilder, lineBuilder, pose.leftArmJoint, pose.leftArmRot, yaw, colors.arms, scale);
      addLimb(triBuilder, lineBuilder, pose.rightArmJoint, pose.rightArmRot, yaw, colors.arms, scale);
      if (!noLegs) {
        addLimb(triBuilder, lineBuilder, pose.leftLegJoint, pose.leftLegRot, yaw, colors.legs, scale);
        addLimb(triBuilder, lineBuilder, pose.rightLegJoint, pose.rightLegRot, yaw, colors.legs, scale);
      }
      if (infected) {
        // Infected keep their hats/masks/gloves etc. but gain a zombie face + claws.
        renderAvatarAccessories(triBuilder, lineBuilder, character, pose);
        renderInfectedFace(triBuilder, lineBuilder, root, yaw, scale);
        renderZombieClaws(triBuilder, lineBuilder, pose, yaw, scale);
        renderZombieClassBits(triBuilder, lineBuilder, character, pose, yaw, scale);
      } else if (character.kind === 'player') {
        renderAvatarAccessories(triBuilder, lineBuilder, character, pose);
      } else {
        renderZombieDetails(triBuilder, lineBuilder, character, pose, currentTime);
        renderZombieClassBits(triBuilder, lineBuilder, character, pose, yaw, scale);
      }
      if (character.forcefield > 0 && character.kind === 'player') {
        addForcefieldRings(lineBuilder, vAdd(root, v3(0, 2.9 * scale, 0)), 3.6 * scale, COLORS.forcefield);
      }
    }

    if (character.selectedTool) {
      renderHeldWeapon(triBuilder, lineBuilder, character, pose, yaw, hideBody);
    }
  }

  function renderHeldWeapon(triBuilder, lineBuilder, character, pose, yaw, hideBody) {
    const weapon = getWeaponDef(character.selectedTool);
    if (!weapon || hideBody) {
      return;
    }
    if (weapon.key === 'sword') {
      addHeldSword(triBuilder, lineBuilder, pose, yaw, character.swing.time, character.renderScale || 1);
      return;
    }
    if (weapon.key === 'bat' || weapon.key === 'stun-stick' || weapon.key === 'wrench') {
      addHeldClub(triBuilder, lineBuilder, pose, yaw, character.renderScale || 1, weapon.key);
      return;
    }
    if (weapon.key === 'stickybomb-launcher') {
      addHeldLauncher(triBuilder, lineBuilder, pose, yaw, character.renderScale || 1, COLORS.toxic);
      return;
    }
    if (weapon.key === 'sentry-builder') {
      addHeldBuilderTool(triBuilder, lineBuilder, pose, yaw, character.renderScale || 1);
      return;
    }
    if (weapon.key === 'sandvich') {
      addHeldSandvich(triBuilder, lineBuilder, pose, yaw, character.renderScale || 1);
      return;
    }
    if (weapon.key === 'cola') {
      addHeldCola(triBuilder, lineBuilder, pose, yaw, character.renderScale || 1);
      return;
    }
    addHeldGun(triBuilder, lineBuilder, pose, yaw, character.renderScale || 1, weapon.key);
  }

  function renderZombieDetails(triBuilder, lineBuilder, character, pose, currentTime = 0) {
    const root = character.pos;
    const yaw = character.yaw;
    const scale = character.renderScale || 1;

    if (character.zombieType === 'rival') {
      // Rivals are rival players — give them a gun; the humanoid face is already drawn.
      addHeldGun(triBuilder, lineBuilder, pose, yaw, scale, 'regular-blaster', COLORS.orange);
    } else {
      // Full undead face: brow, uneven glowing eyes, jagged tooth gash, scar and rot.
      renderInfectedFace(triBuilder, lineBuilder, root, yaw, scale);
      // Torn, hunched collar of dark cloth across the chest.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.7, y: 4.5, z: 0.5 }, scale), scaleBox({ x: 0.7, y: 4.86, z: 0.62 }, scale), shade(character.bodyColors.torso, 0.7), false);
      // Ripped shirt hem and a chest wound so the body reads rotten too.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.75, y: 2.05, z: 0.5 }, scale), scaleBox({ x: -0.25, y: 2.5, z: 0.6 }, scale), shade(character.bodyColors.torso, 0.65), false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.2, y: 2.05, z: 0.5 }, scale), scaleBox({ x: 0.6, y: 2.35, z: 0.6 }, scale), shade(character.bodyColors.torso, 0.65), false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.3, y: 3.1, z: 0.52 }, scale), scaleBox({ x: 0.34, y: 3.34, z: 0.6 }, scale), COLORS.blood, false);
    }

    if (character.zombieType === 'shield-zombie') {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1.15, y: 1.95, z: 0.55 }, scale), scaleBox({ x: 1.15, y: 4.4, z: 1.12 }, scale), COLORS.concrete, false);
    } else if (character.zombieType === 'box-armor-zombie') {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1.22, y: 1.95, z: -0.72 }, scale), scaleBox({ x: 1.22, y: 4.5, z: 0.72 }, scale), shade(COLORS.brown, 0.95), false);
      if (character.armor > 0) {
        addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1.1, y: 4.55, z: -0.92 }, scale), scaleBox({ x: 1.1, y: 6.15, z: 0.92 }, scale), shade(COLORS.dirt, 1.05), false);
      }
    } else if (character.zombieType === 'blaster-soldier-zombie') {
      addHeldGun(triBuilder, lineBuilder, pose, yaw, scale, 'regular-blaster', COLORS.toxic);
    } else if (character.zombieType === 'medic-zombie') {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.5, y: 2.6, z: -0.95 }, scale), scaleBox({ x: 0.5, y: 4.2, z: -0.42 }, scale), COLORS.white, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.12, y: 3.05, z: -1.02 }, scale), scaleBox({ x: 0.12, y: 3.75, z: -0.35 }, scale), COLORS.medicRed, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.45, y: 3.34, z: -0.84 }, scale), scaleBox({ x: 0.45, y: 3.46, z: -0.52 }, scale), COLORS.medicRed, false);
    } else if (character.zombieType === 'poison-zombie') {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.86, y: 2.55, z: -1.02 }, scale), scaleBox({ x: -0.22, y: 4.2, z: -0.48 }, scale), COLORS.toxicDark, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.22, y: 2.55, z: -1.02 }, scale), scaleBox({ x: 0.86, y: 4.2, z: -0.48 }, scale), COLORS.toxicDark, false);
    } else if (character.zombieType === 'police-zombie') {
      renderPoliceHat(triBuilder, lineBuilder, root, yaw, scale);
    } else if (character.zombieType === 'hazmat-zombie') {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.74, y: 4.54, z: -0.82 }, scale), scaleBox({ x: 0.74, y: 5.94, z: 0.82 }, scale), COLORS.zombieHazmat, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.2, y: 4.9, z: 0.82 }, scale), scaleBox({ x: 0.2, y: 5.28, z: 1.05 }, scale), COLORS.black, false);
    } else if (character.zombieType === 'cloak-zombie') {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1.1, y: 1.92, z: -0.86 }, scale), scaleBox({ x: 1.1, y: 4.6, z: -0.1 }, scale), shade(COLORS.black, character.cloakRevealUntil > currentTime ? 0.55 : 0.85), false);
    } else if (character.zombieType === 'tank-zombie') {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1.5, y: 3.8, z: -0.7 }, scale), scaleBox({ x: -0.42, y: 5.1, z: 0.7 }, scale), COLORS.concreteDark, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.42, y: 3.8, z: -0.7 }, scale), scaleBox({ x: 1.5, y: 5.1, z: 0.7 }, scale), COLORS.concreteDark, false);
    }
  }

  function renderCorpse(triBuilder, lineBuilder, corpse) {
    for (const part of corpse.parts) {
      appendOrientedBox(triBuilder, lineBuilder, part.pos, part.size, part.rot, part.color, OUTLINE, false);
    }
  }

  function renderProjectile(triBuilder, lineBuilder, projectile) {
    if (projectile.projectileKind === 'sticky' || projectile.projectileKind === 'poison-glob') {
      appendSphere(triBuilder, projectile.pos, projectile.radius, projectile.color, 5, 7);
      return;
    }
    appendSphere(triBuilder, projectile.pos, projectile.radius, projectile.color, 4, 6);
    if (projectile.splashRadius > 0) {
      addForcefieldRings(lineBuilder, projectile.pos, projectile.radius + 0.08, shade(projectile.color, 1.12, 0.65), 7);
    }
  }

  function renderHazard(triBuilder, lineBuilder, hazard) {
    appendRingLines(lineBuilder, vAdd(hazard.pos, v3(0, 0.08, 0)), hazard.radius, 'xz', hazard.color, 20);
    appendRingLines(lineBuilder, vAdd(hazard.pos, v3(0, 0.36, 0)), hazard.radius * 0.7, 'xz', shade(hazard.color, 1.08, 0.85), 16);
    if (hazard.type === 'medic-heal' || hazard.type === 'police-aura') {
      appendSphere(triBuilder, vAdd(hazard.pos, v3(0, 0.55, 0)), 0.42, hazard.color, 4, 6);
    }
  }

  function renderSentry(triBuilder, lineBuilder, sentry) {
    // Tripod legs splayed under the base.
    for (const a of [0.5, 2.6, 4.7]) {
      const lx = Math.sin(a) * 0.85;
      const lz = Math.cos(a) * 0.85;
      appendOrientedBox(triBuilder, lineBuilder, vAdd(sentry.pos, v3(lx, 0.22, lz)), v3(0.22, 0.44, 0.22), v3(0, a, 0.4), COLORS.steel, OUTLINE, false);
    }
    appendOrientedBox(triBuilder, lineBuilder, vAdd(sentry.pos, v3(0, 0.62, 0)), v3(1.5, 0.9, 1.5), v3(0, 0, 0), COLORS.sentry, OUTLINE, false);
    // Rotating head with twin barrels and a muzzle brake.
    appendOrientedBox(triBuilder, lineBuilder, vAdd(sentry.pos, v3(0, 1.55, 0)), v3(0.8, 0.85, 0.9), v3(0, sentry.yaw, 0), COLORS.sentryDark, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformPoint(vAdd(sentry.pos, v3(0, 1.65, 0)), v3(-0.18, 0, 0.7), v3(0, sentry.yaw, 0)), v3(0.18, 0.18, 1.2), v3(0, sentry.yaw, 0), COLORS.steel, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformPoint(vAdd(sentry.pos, v3(0, 1.65, 0)), v3(0.18, 0, 0.7), v3(0, sentry.yaw, 0)), v3(0.18, 0.18, 1.2), v3(0, sentry.yaw, 0), COLORS.steel, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformPoint(vAdd(sentry.pos, v3(0, 1.65, 0)), v3(0, 0, 1.28), v3(0, sentry.yaw, 0)), v3(0.5, 0.26, 0.16), v3(0, sentry.yaw, 0), COLORS.black, OUTLINE, false);
    // Antenna + blinking-style warning lamp on top.
    appendOrientedBox(triBuilder, lineBuilder, vAdd(sentry.pos, v3(-0.28, 2.2, -0.2)), v3(0.06, 0.5, 0.06), v3(0, 0, 0), COLORS.steel, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, vAdd(sentry.pos, v3(0.22, 2.05, 0)), v3(0.18, 0.18, 0.18), v3(0, 0, 0), COLORS.canRed, COLORS.canRed, false);
  }

  function viewGunColor(key) {
    return key === 'ice-blaster' ? COLORS.iceDark
      : key === 'goo-blaster' ? COLORS.gooDark
        : key === 'revolver' ? COLORS.orange
          : key === 'rifle' ? COLORS.concreteDark
            : key === 'super-shotgun' ? COLORS.brown
              : key === 'minigun' ? COLORS.sentryDark
                : key === 'stickybomb-launcher' ? COLORS.toxic
                  : key === 'sentry-builder' ? COLORS.sentry
                    : COLORS.blue;
  }

  function getWeaponHoldStyle(weaponKey) {
    if (!weaponKey) {
      return null;
    }
    const weapon = getWeaponDef(weaponKey);
    if (!weapon) {
      return null;
    }
    switch (weapon.kind) {
      case 'melee':
      case 'melee-repair':
        return 'melee';
      case 'heal':
      case 'buff':
        return 'item';
      default:
        return 'gun';
    }
  }

  function getCharacterPose(character) {
    const scale = character.renderScale || 1;
    const moveStrength = clamp(Math.hypot(character.vel.x, character.vel.z) / Math.max(1, character.walkSpeed), 0, 1);
    let leftArmRot;
    let rightArmRot;
    let leftLegRot;
    let rightLegRot;
    let weaponPitch;

    if (character.kind === 'zombie' || character.vsRole === 'zombie') {
      // Shambling undead: arms reaching straight out, stiff limping legs, constant sway.
      const t = character.walkCycle;
      const reach = -1.5;
      rightArmRot = reach + Math.sin(t * 1.15) * 0.16;
      leftArmRot = reach + Math.sin(t * 1.15 + 0.9) * 0.16;
      if (character.transformTime > 0) {
        // Turning: violent convulsion — arms flail wildly as the infection takes hold.
        const shake = Math.sin(character.transformTime * 34);
        rightArmRot = -1.6 + shake * 1.1;
        leftArmRot = -1.6 - shake * 1.1;
      }
      if (character.danceTime !== undefined) {
        // Victory dance: alternating arm pumps overhead with a bounce.
        const d = character.danceTime * 7;
        rightArmRot = -2.4 + Math.sin(d) * 0.7;
        leftArmRot = -2.4 - Math.sin(d) * 0.7;
      }
      const legAmp = 0.6 * (0.4 + moveStrength * 0.6);
      // One leg drags stiffly behind for a lurching limp.
      leftLegRot = -Math.sin(t) * legAmp;
      rightLegRot = Math.sin(t) * legAmp * 0.55 - 0.16;
      if (character.swing.time > 0) {
        const t2 = 1 - character.swing.time / Math.max(0.01, character.swing.duration || 0.34);
        const lunge = Math.sin(t2 * Math.PI) * 0.6;
        rightArmRot -= lunge;
        leftArmRot -= lunge;
      }
      weaponPitch = rightArmRot;
    } else {
      const walk = Math.sin(character.walkCycle) * 0.95 * moveStrength;
      const armBase = character.climbing ? -0.9 : 0;
      rightArmRot = armBase + walk;
      leftArmRot = armBase - walk;
      const holdStyle = character.climbing ? null : getWeaponHoldStyle(character.selectedTool);
      const airborne = !character.grounded && !character.climbing && Math.abs(character.vel.y) > 2;
      if (character.swing.time > 0) {
        const t = 1 - character.swing.time / Math.max(0.01, character.swing.duration || 0.34);
        rightArmRot = -1.2 + Math.sin(t * Math.PI) * 2.45;
        leftArmRot *= 0.45;
      } else if (airborne) {
        // Jumping: both arms thrown up overhead, legs tucked slightly.
        rightArmRot = -2.75;
        leftArmRot = -2.75;
      } else if (holdStyle === 'gun') {
        // Both arms up, gripping the weapon out in front.
        rightArmRot = -1.35 + walk * 0.2;
        leftArmRot = -1.12 - walk * 0.2;
      } else if (holdStyle === 'melee') {
        // Weapon carried at the ready, raised toward the shoulder.
        rightArmRot = -0.6 + walk * 0.5;
        leftArmRot = -0.12 - walk * 0.5;
      } else if (holdStyle === 'item') {
        // Held item brought up toward the face.
        rightArmRot = -1.2 + walk * 0.2;
      }
      // Guns stay levelled forward even though the arm is raised; melee/items follow the arm.
      weaponPitch = holdStyle === 'gun' ? -0.1 : rightArmRot;
      if (airborne && character.swing.time <= 0) {
        // Legs tuck back a touch mid-air.
        leftLegRot = 0.28;
        rightLegRot = 0.28;
      } else {
        leftLegRot = -walk;
        rightLegRot = walk;
      }
    }

    const leftArmJoint = vAdd(character.pos, rotateAroundY(v3(-1.5 * scale, 4.1 * scale, 0), character.yaw));
    const rightArmJoint = vAdd(character.pos, rotateAroundY(v3(1.5 * scale, 4.1 * scale, 0), character.yaw));
    const leftLegJoint = vAdd(character.pos, rotateAroundY(v3(-0.5 * scale, 2.05 * scale, 0), character.yaw));
    const rightLegJoint = vAdd(character.pos, rotateAroundY(v3(0.5 * scale, 2.05 * scale, 0), character.yaw));
    return {
      leftArmJoint,
      rightArmJoint,
      leftLegJoint,
      rightLegJoint,
      leftArmRot,
      rightArmRot,
      leftLegRot,
      rightLegRot,
      weaponPitch,
      leftArmCenter: limbCenter(leftArmJoint, leftArmRot, character.yaw, scale),
      rightArmCenter: limbCenter(rightArmJoint, rightArmRot, character.yaw, scale),
      leftLegCenter: limbCenter(leftLegJoint, leftLegRot, character.yaw, scale),
      rightLegCenter: limbCenter(rightLegJoint, rightLegRot, character.yaw, scale)
    };
  }

  function limbCenter(joint, rotX, yaw, scale = 1) {
    return transformJointLocal(joint, yaw, rotX, v3(0, -1 * scale, 0));
  }

  function addHead(triBuilder, lineBuilder, root, yaw, color, options = {}) {
    const scale = options.scale || 1;
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.9, y: 4.45, z: -0.78 }, scale), scaleBox({ x: 0.9, y: 5.95, z: 0.78 }, scale), color, false);
    appendStudCaps(triBuilder, root, yaw, [v3(0, 5.95 * scale, 0)], color);
    if (options.hideFace) {
      return;
    }
    const eyeOffset = 0.26 * scale;
    const faceY = 5.2 * scale;
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(-eyeOffset, faceY + 0.18 * scale, 0.82 * scale), v3(0.12 * scale, 0.22 * scale, 0.05 * scale));
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(eyeOffset, faceY + 0.18 * scale, 0.82 * scale), v3(0.12 * scale, 0.22 * scale, 0.05 * scale));
    if (options.hideMouth) {
      // Doctor keeps the mask on — no mouth/smile peeking out underneath.
      return;
    }
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(0, faceY - 0.15 * scale, 0.82 * scale), v3(0.4 * scale, 0.12 * scale, 0.05 * scale));
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(-0.26 * scale, faceY - 0.05 * scale, 0.82 * scale), v3(0.12 * scale, 0.12 * scale, 0.05 * scale));
    addFaceFeature(triBuilder, lineBuilder, root, yaw, v3(0.26 * scale, faceY - 0.05 * scale, 0.82 * scale), v3(0.12 * scale, 0.12 * scale, 0.05 * scale));
  }

  function addFaceFeature(triBuilder, lineBuilder, root, yaw, localCenter, size) {
    const center = vAdd(root, rotateAroundY(localCenter, yaw));
    appendOrientedBox(triBuilder, lineBuilder, center, size, v3(0, yaw, 0), COLORS.black, OUTLINE, false);
  }

  function addLimb(triBuilder, lineBuilder, jointWorld, rotX, yaw, color, scale = 1) {
    const center = transformJointLocal(jointWorld, yaw, rotX, v3(0, -1 * scale, 0));
    appendOrientedBox(triBuilder, lineBuilder, center, v3(1 * scale, 2 * scale, 1 * scale), v3(rotX, yaw, 0), color, OUTLINE, false);
  }

  function addBodyBox(triBuilder, lineBuilder, root, yaw, min, max, color, studsTop) {
    const center = vAdd(root, rotateAroundY(v3((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2), yaw));
    const size = v3(max.x - min.x, max.y - min.y, max.z - min.z);
    appendOrientedBox(triBuilder, lineBuilder, center, size, v3(0, yaw, 0), color, OUTLINE, studsTop);
  }

  function addHeldSword(triBuilder, lineBuilder, pose, yaw, swingTime, scale = 1) {
    const grip = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.12 * scale, -1.9 * scale, 0.48 * scale));
    const rotX = pose.rightArmRot + (swingTime > 0 ? 0.45 : 0.1);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, rotX, v3(0.08 * scale, -2.65 * scale, 0.66 * scale)), v3(0.18 * scale, 2.2 * scale, 0.18 * scale), v3(rotX, yaw, 0), COLORS.swordSteel, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, grip, v3(0.9 * scale, 0.18 * scale, 0.18 * scale), v3(rotX, yaw, 0), COLORS.swordHilt, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, rotX, v3(0.08 * scale, -1.9 * scale, 0.48 * scale)), v3(0.18 * scale, 0.9 * scale, 0.18 * scale), v3(rotX, yaw, 0), COLORS.swordHilt, OUTLINE, false);
  }

  function addHeldClub(triBuilder, lineBuilder, pose, yaw, scale, key) {
    const hand = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.05 * scale, -1.85 * scale, 0.35 * scale));
    const clubColor = key === 'stun-stick' ? COLORS.iceDark : key === 'wrench' ? COLORS.steel : COLORS.brown;
    appendOrientedBox(triBuilder, lineBuilder, hand, v3(0.16 * scale, 1.12 * scale, 0.16 * scale), v3(pose.rightArmRot, yaw, 0), key === 'wrench' ? COLORS.darkBrown : COLORS.brown, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.05 * scale, -0.98 * scale, 0.38 * scale)), v3(key === 'wrench' ? 0.7 * scale : 0.34 * scale, key === 'wrench' ? 0.2 * scale : 1.0 * scale, 0.24 * scale), v3(key === 'wrench' ? pose.rightArmRot + 0.8 : pose.rightArmRot, yaw, 0), clubColor, OUTLINE, false);
  }

  function addHeldBuilderTool(triBuilder, lineBuilder, pose, yaw, scale) {
    const pitch = pose.weaponPitch !== undefined ? pose.weaponPitch : pose.rightArmRot;
    const hand = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.12 * scale, -1.7 * scale, 0.4 * scale));
    appendOrientedBox(triBuilder, lineBuilder, hand, v3(0.9 * scale, 0.7 * scale, 0.7 * scale), v3(pitch, yaw, 0), COLORS.sentry, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.05 * scale, -0.88 * scale, 0.4 * scale)), v3(0.42 * scale, 0.14 * scale, 0.14 * scale), v3(pitch, yaw, 0), COLORS.steel, OUTLINE, false);
  }

  function addHeldLauncher(triBuilder, lineBuilder, pose, yaw, scale, color) {
    const pitch = pose.weaponPitch !== undefined ? pose.weaponPitch : pose.rightArmRot;
    const hand = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.05 * scale, -1.5 * scale, 0.28 * scale));
    appendOrientedBox(triBuilder, lineBuilder, hand, v3(0.42 * scale, 0.42 * scale, 1.6 * scale), v3(pitch, yaw, 0), color, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.05 * scale, -1.5 * scale, 1.02 * scale)), v3(0.22 * scale, 0.22 * scale, 0.38 * scale), v3(pitch, yaw, 0), COLORS.black, OUTLINE, false);
  }

  function addHeldGun(triBuilder, lineBuilder, pose, yaw, scale, key, overrideColor = null) {
    const color = overrideColor || (key === 'ice-blaster' ? COLORS.iceDark : key === 'goo-blaster' ? COLORS.gooDark : key === 'revolver' ? COLORS.orange : key === 'rifle' ? COLORS.concreteDark : key === 'super-shotgun' ? COLORS.brown : key === 'minigun' ? COLORS.sentryDark : COLORS.blue);
    const pitch = pose.weaponPitch !== undefined ? pose.weaponPitch : pose.rightArmRot;
    const part = (offset, size, boxColor, lineColor) => {
      const c = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, offset);
      appendOrientedBox(triBuilder, lineBuilder, c, size, v3(pitch, yaw, 0), boxColor, lineColor || OUTLINE, false);
    };
    const hand = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.12 * scale, -1.5 * scale, 0.35 * scale));
    const size = key === 'rifle' || key === 'regular-blaster' || key === 'ice-blaster' || key === 'goo-blaster'
      ? v3(0.42 * scale, 0.42 * scale, 1.55 * scale)
      : key === 'super-shotgun'
        ? v3(0.48 * scale, 0.48 * scale, 1.28 * scale)
        : key === 'minigun'
          ? v3(0.62 * scale, 0.62 * scale, 1.42 * scale)
          : v3(0.34 * scale, 0.34 * scale, 1.05 * scale);
    appendOrientedBox(triBuilder, lineBuilder, hand, size, v3(pitch, yaw, 0), color, OUTLINE, false);
    // Wooden grip angled below the receiver.
    appendOrientedBox(triBuilder, lineBuilder, transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.12 * scale, -1.18 * scale, 0.02 * scale)), v3(0.22 * scale, 0.55 * scale, 0.22 * scale), v3(pitch + 0.5, yaw, 0), COLORS.darkBrown, OUTLINE, false);
    if (key === 'minigun') {
      appendCylinder(triBuilder, transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.0, -1.52 * scale, 1.08 * scale)), 0.18 * scale, 0.74 * scale, COLORS.steel, v3(1.57, yaw, 0), 6);
      // Barrel cluster tips + ammo drum below.
      part(v3(0.12 * scale, -1.5 * scale, 1.5 * scale), v3(0.4 * scale, 0.4 * scale, 0.18 * scale), COLORS.black);
      part(v3(0.12 * scale, -1.85 * scale, 0.35 * scale), v3(0.5 * scale, 0.3 * scale, 0.5 * scale), COLORS.steel);
    } else if (key === 'revolver') {
      // Cylinder drum and a narrow barrel with a front sight.
      part(v3(0.12 * scale, -1.44 * scale, 0.34 * scale), v3(0.42 * scale, 0.42 * scale, 0.34 * scale), COLORS.steel);
      part(v3(0.12 * scale, -1.46 * scale, 0.94 * scale), v3(0.18 * scale, 0.18 * scale, 0.5 * scale), COLORS.steel);
      part(v3(0.12 * scale, -1.34 * scale, 1.14 * scale), v3(0.08 * scale, 0.12 * scale, 0.08 * scale), COLORS.black);
    } else if (key === 'super-shotgun') {
      // Side-by-side double barrels over the wooden stock.
      part(v3(0.02 * scale, -1.4 * scale, 1.2 * scale), v3(0.18 * scale, 0.18 * scale, 0.7 * scale), COLORS.black);
      part(v3(0.24 * scale, -1.4 * scale, 1.2 * scale), v3(0.18 * scale, 0.18 * scale, 0.7 * scale), COLORS.black);
      part(v3(0.12 * scale, -1.62 * scale, -0.34 * scale), v3(0.34 * scale, 0.4 * scale, 0.5 * scale), COLORS.darkBrown);
    } else if (key === 'rifle' || key === 'regular-blaster' || key === 'ice-blaster' || key === 'goo-blaster') {
      // Barrel tip, top sight rail, and a boxy magazine.
      part(v3(0.12 * scale, -1.44 * scale, 1.3 * scale), v3(0.2 * scale, 0.2 * scale, 0.42 * scale), COLORS.black);
      part(v3(0.12 * scale, -1.22 * scale, 0.55 * scale), v3(0.12 * scale, 0.12 * scale, 0.6 * scale), COLORS.black);
      part(v3(0.12 * scale, -1.78 * scale, 0.5 * scale), v3(0.2 * scale, 0.4 * scale, 0.26 * scale), shade(color, 0.7));
      if (key === 'ice-blaster') {
        part(v3(0.12 * scale, -1.3 * scale, 1.0 * scale), v3(0.5 * scale, 0.14 * scale, 0.3 * scale), COLORS.ice);
      } else if (key === 'goo-blaster') {
        part(v3(0.12 * scale, -1.3 * scale, 1.0 * scale), v3(0.5 * scale, 0.14 * scale, 0.3 * scale), COLORS.goo);
      }
    }
  }

  function addHeldSandvich(triBuilder, lineBuilder, pose, yaw, scale) {
    const hand = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.08 * scale, -1.7 * scale, 0.35 * scale));
    appendOrientedBox(triBuilder, lineBuilder, hand, v3(0.8 * scale, 0.28 * scale, 0.8 * scale), v3(pose.rightArmRot, yaw, 0), COLORS.sandvichBread, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformPoint(hand, v3(0, 0.14 * scale, 0), v3(0, yaw, 0)), v3(0.62 * scale, 0.12 * scale, 0.62 * scale), v3(pose.rightArmRot, yaw, 0), COLORS.sandvichMeat, OUTLINE, false);
    appendOrientedBox(triBuilder, lineBuilder, transformPoint(hand, v3(0, 0.28 * scale, 0), v3(0, yaw, 0)), v3(0.8 * scale, 0.24 * scale, 0.8 * scale), v3(pose.rightArmRot, yaw, 0), COLORS.sandvichBread, OUTLINE, false);
  }

  function addHeldCola(triBuilder, lineBuilder, pose, yaw, scale) {
    const hand = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, v3(0.06 * scale, -1.62 * scale, 0.34 * scale));
    appendCylinder(triBuilder, hand, 0.2 * scale, 0.72 * scale, COLORS.canRed, v3(pose.rightArmRot, yaw, 0), 8);
  }

  function renderAvatarAccessories(triBuilder, lineBuilder, character, pose) {
    const preset = getAvatarPreset(character.avatarPreset);
    if (preset.accessories.doctorMask) {
      renderDoctorMask(triBuilder, lineBuilder, character.pos, character.yaw, character.renderScale || 1);
    }
    if (preset.accessories.doctorGloves) {
      renderDoctorGloves(triBuilder, lineBuilder, pose, character.yaw, character.renderScale || 1);
    }
    if (preset.accessories.policeHat) {
      renderPoliceHat(triBuilder, lineBuilder, character.pos, character.yaw, character.renderScale || 1);
    }
    if (preset.accessories.partyHat) {
      renderPartyHat(triBuilder, lineBuilder, character.pos, character.yaw, character.renderScale || 1);
    }
    if (preset.accessories.glasses) {
      renderGlasses(triBuilder, lineBuilder, character.pos, character.yaw, character.renderScale || 1);
    }
    if (preset.accessories.suit) {
      renderSuit(triBuilder, lineBuilder, character.pos, character.yaw, character.renderScale || 1);
    }
  }

  function renderDoctorMask(triBuilder, lineBuilder, root, yaw, scale) {
    // Surgical teal cup — widest at the middle, tucking in at chin and nose so it reads rounded.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.78, y: 4.62, z: 0.74 }, scale), scaleBox({ x: 0.78, y: 5.1, z: 1.04 }, scale), COLORS.mask, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.66, y: 4.4, z: 0.74 }, scale), scaleBox({ x: 0.66, y: 4.62, z: 0.98 }, scale), shade(COLORS.mask, 0.92), false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.6, y: 5.1, z: 0.74 }, scale), scaleBox({ x: 0.6, y: 5.26, z: 0.96 }, scale), COLORS.maskLight, false);
    // Chin wrap so it hugs the jaw from below.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.5, y: 4.3, z: 0.6 }, scale), scaleBox({ x: 0.5, y: 4.42, z: 0.88 }, scale), shade(COLORS.mask, 0.85), false);
    // Cheek panels wrapping around each side toward the ears.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.95, y: 4.55, z: 0.1 }, scale), scaleBox({ x: -0.74, y: 5.08, z: 0.88 }, scale), shade(COLORS.mask, 0.9), false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.74, y: 4.55, z: 0.1 }, scale), scaleBox({ x: 0.95, y: 5.08, z: 0.88 }, scale), shade(COLORS.mask, 0.9), false);
    // Three crisp pleat folds across the front.
    for (const py of [4.68, 4.84, 5.0]) {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.74, y: py, z: 1.03 }, scale), scaleBox({ x: 0.74, y: py + 0.05, z: 1.08 }, scale), shade(COLORS.mask, 0.78), false);
    }
    // Metal nose bar pinched over the bridge.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.34, y: 5.16, z: 0.9 }, scale), scaleBox({ x: 0.34, y: 5.26, z: 1.04 }, scale), COLORS.maskClip, false);
    // Twin head straps wrapping the whole way around — upper and lower.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.96, y: 5.02, z: -0.84 }, scale), scaleBox({ x: 0.96, y: 5.14, z: -0.72 }, scale), COLORS.maskStrap, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.96, y: 4.56, z: -0.84 }, scale), scaleBox({ x: 0.96, y: 4.68, z: -0.72 }, scale), COLORS.maskStrap, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.96, y: 4.56, z: -0.8 }, scale), scaleBox({ x: -0.86, y: 5.14, z: 0.4 }, scale), COLORS.maskStrap, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.86, y: 4.56, z: -0.8 }, scale), scaleBox({ x: 0.96, y: 5.14, z: 0.4 }, scale), COLORS.maskStrap, false);
  }

  function renderDoctorGloves(triBuilder, lineBuilder, pose, yaw, scale) {
    renderDoctorGlove(triBuilder, lineBuilder, pose.leftArmJoint, pose.leftArmRot, yaw, scale);
    renderDoctorGlove(triBuilder, lineBuilder, pose.rightArmJoint, pose.rightArmRot, yaw, scale);
  }

  function renderDoctorGlove(triBuilder, lineBuilder, armJoint, armRot, yaw, scale) {
    // Nitrile blue glove hand.
    const gloveCenter = transformJointLocal(armJoint, yaw, armRot, v3(0, -1.66 * scale, 0));
    appendOrientedBox(triBuilder, lineBuilder, gloveCenter, v3(1.08 * scale, 0.8 * scale, 1.08 * scale), v3(armRot, yaw, 0), COLORS.gloveMed, OUTLINE, false);
    // Sheen highlight strip along the back of the hand.
    const sheen = transformJointLocal(armJoint, yaw, armRot, v3(0.18 * scale, -1.62 * scale, -0.48 * scale));
    appendOrientedBox(triBuilder, lineBuilder, sheen, v3(0.4 * scale, 0.5 * scale, 0.14 * scale), v3(armRot, yaw, 0), COLORS.gloveShine, COLORS.gloveShine, false);
    // Four finger grooves across the fingertip block.
    for (let i = 0; i < 4; i += 1) {
      const fx = (-0.36 + i * 0.24) * scale;
      const finger = transformJointLocal(armJoint, yaw, armRot, v3(fx, -2.06 * scale, 0.12 * scale));
      appendOrientedBox(triBuilder, lineBuilder, finger, v3(0.18 * scale, 0.42 * scale, 0.6 * scale), v3(armRot, yaw, 0), shade(COLORS.gloveMed, 0.96), OUTLINE, false);
    }
    // Thumb nub on the inner side.
    const thumb = transformJointLocal(armJoint, yaw, armRot, v3(-0.56 * scale, -1.72 * scale, 0.3 * scale));
    appendOrientedBox(triBuilder, lineBuilder, thumb, v3(0.3 * scale, 0.44 * scale, 0.34 * scale), v3(armRot, yaw, 0), shade(COLORS.gloveMed, 0.92), OUTLINE, false);
    // Rolled cuff — two-tone band where the glove meets the sleeve.
    const cuff = transformJointLocal(armJoint, yaw, armRot, v3(0, -1.14 * scale, 0));
    appendOrientedBox(triBuilder, lineBuilder, cuff, v3(1.22 * scale, 0.3 * scale, 1.22 * scale), v3(armRot, yaw, 0), COLORS.gloveCuff, OUTLINE, false);
    const cuffRoll = transformJointLocal(armJoint, yaw, armRot, v3(0, -1.3 * scale, 0));
    appendOrientedBox(triBuilder, lineBuilder, cuffRoll, v3(1.14 * scale, 0.12 * scale, 1.14 * scale), v3(armRot, yaw, 0), shade(COLORS.gloveCuff, 1.25), OUTLINE, false);
  }

  function renderPoliceHat(triBuilder, lineBuilder, root, yaw, scale) {
    // Black band gripping the head, just above the brow.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.98, y: 5.82, z: -0.86 }, scale), scaleBox({ x: 0.98, y: 6.06, z: 0.86 }, scale), COLORS.black, false);
    // Gold trim line along the front of the band.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.98, y: 5.98, z: 0.8 }, scale), scaleBox({ x: 0.98, y: 6.05, z: 0.9 }, scale), COLORS.brass, false);
    // Navy crown of the cap.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.92, y: 6.06, z: -0.82 }, scale), scaleBox({ x: 0.92, y: 6.66, z: 0.74 }, scale), COLORS.navy, false);
    // Slightly lighter domed top so the crown catches the light.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.84, y: 6.66, z: -0.74 }, scale), scaleBox({ x: 0.84, y: 6.82, z: 0.66 }, scale), shade(COLORS.navy, 1.16), false);
    // Front peak / visor sticking forward at brow level.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.84, y: 5.68, z: 0.82 }, scale), scaleBox({ x: 0.84, y: 5.84, z: 1.5 }, scale), COLORS.black, false);
    // Peak underside highlight.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.8, y: 5.66, z: 0.86 }, scale), scaleBox({ x: 0.8, y: 5.72, z: 1.44 }, scale), shade(COLORS.black, 1.6), false);
    // Gold cap badge on the front of the crown.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.2, y: 6.14, z: 0.7 }, scale), scaleBox({ x: 0.2, y: 6.56, z: 0.86 }, scale), COLORS.badge, false);
    // Navy center detail on the badge.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.08, y: 6.24, z: 0.84 }, scale), scaleBox({ x: 0.08, y: 6.46, z: 0.92 }, scale), COLORS.navy, false);
  }

  function renderPartyHat(triBuilder, lineBuilder, root, yaw, scale) {
    // A tapering cone of stacked bands, striped, with a pom-pom on top.
    const bands = [
      { w: 1.0, y0: 5.95, y1: 6.35, c: COLORS.partyHat },
      { w: 0.78, y0: 6.35, y1: 6.75, c: COLORS.partyStripe },
      { w: 0.56, y0: 6.75, y1: 7.15, c: COLORS.partyHat },
      { w: 0.34, y0: 7.15, y1: 7.5, c: COLORS.partyStripe }
    ];
    for (const b of bands) {
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -b.w / 2, y: b.y0, z: -b.w / 2 }, scale), scaleBox({ x: b.w / 2, y: b.y1, z: b.w / 2 }, scale), b.c, false);
    }
    appendSphere(triBuilder, vAdd(root, rotateAroundY(v3(0, 7.62 * scale, 0), yaw)), 0.24 * scale, COLORS.white, 6, 8);
  }

  function renderGlasses(triBuilder, lineBuilder, root, yaw, scale) {
    const lens = COLORS.glasses;
    // Two lenses over the eyes, a bridge, and temple arms.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.5, y: 5.24, z: 0.8 }, scale), scaleBox({ x: -0.1, y: 5.56, z: 0.92 }, scale), lens, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.1, y: 5.24, z: 0.8 }, scale), scaleBox({ x: 0.5, y: 5.56, z: 0.92 }, scale), lens, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.12, y: 5.36, z: 0.82 }, scale), scaleBox({ x: 0.12, y: 5.46, z: 0.9 }, scale), lens, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.62, y: 5.38, z: -0.2 }, scale), scaleBox({ x: -0.5, y: 5.48, z: 0.86 }, scale), lens, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.5, y: 5.38, z: -0.2 }, scale), scaleBox({ x: 0.62, y: 5.48, z: 0.86 }, scale), lens, false);
  }

  function renderSuit(triBuilder, lineBuilder, root, yaw, scale) {
    // White shirt panel + collar + red tie on the front of the torso.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.36, y: 2.5, z: 0.46 }, scale), scaleBox({ x: 0.36, y: 4.05, z: 0.56 }, scale), COLORS.suitShirt, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.42, y: 3.86, z: 0.44 }, scale), scaleBox({ x: 0.42, y: 4.08, z: 0.58 }, scale), COLORS.suitShirt, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.12, y: 2.7, z: 0.56 }, scale), scaleBox({ x: 0.12, y: 3.9, z: 0.62 }, scale), COLORS.suitTie, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.18, y: 3.72, z: 0.56 }, scale), scaleBox({ x: 0.18, y: 3.94, z: 0.62 }, scale), COLORS.suitTie, false);
  }

  function renderInfectedFace(triBuilder, lineBuilder, root, yaw, scale) {
    // Heavy scowling brow.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.52, y: 5.46, z: 0.68 }, scale), scaleBox({ x: 0.52, y: 5.64, z: 0.88 }, scale), COLORS.zombieSkinDark, false);
    // Asymmetric glowing eyes: one wide and blazing, one squinting.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.48, y: 5.18, z: 0.78 }, scale), scaleBox({ x: -0.1, y: 5.48, z: 0.94 }, scale), COLORS.zombieEye, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.16, y: 5.28, z: 0.78 }, scale), scaleBox({ x: 0.44, y: 5.44, z: 0.94 }, scale), COLORS.zombieEye, false);
    // Jagged snarling mouth: dark gash with uneven teeth.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.4, y: 4.74, z: 0.8 }, scale), scaleBox({ x: 0.4, y: 4.94, z: 0.9 }, scale), COLORS.black, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.36, y: 4.9, z: 0.82 }, scale), scaleBox({ x: -0.22, y: 5.04, z: 0.92 }, scale), COLORS.bone, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.06, y: 4.9, z: 0.82 }, scale), scaleBox({ x: 0.08, y: 5.02, z: 0.92 }, scale), COLORS.bone, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.24, y: 4.9, z: 0.82 }, scale), scaleBox({ x: 0.38, y: 5.06, z: 0.92 }, scale), COLORS.bone, false);
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.28, y: 4.66, z: 0.82 }, scale), scaleBox({ x: -0.14, y: 4.76, z: 0.92 }, scale), COLORS.bone, false);
    // Claw scar raking down the right side of the face.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.5, y: 4.7, z: 0.8 }, scale), scaleBox({ x: 0.62, y: 5.7, z: 0.88 }, scale), COLORS.blood, false);
    // Rotting patch eating into the top-left of the skull.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.92, y: 5.6, z: -0.5 }, scale), scaleBox({ x: -0.5, y: 5.98, z: 0.3 }, scale), shade(COLORS.zombieSkinDark, 0.62), false);
    // Blood drip below the mouth corner.
    addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.16, y: 4.5, z: 0.82 }, scale), scaleBox({ x: 0.26, y: 4.74, z: 0.9 }, scale), COLORS.bloodBright, false);
  }

  function renderZombieClaws(triBuilder, lineBuilder, pose, yaw, scale) {
    renderClawSet(triBuilder, lineBuilder, pose.leftArmJoint, pose.leftArmRot, yaw, scale);
    renderClawSet(triBuilder, lineBuilder, pose.rightArmJoint, pose.rightArmRot, yaw, scale);
  }

  function renderClawSet(triBuilder, lineBuilder, armJoint, armRot, yaw, scale) {
    for (let i = -1; i <= 1; i += 1) {
      // Bone talons, splayed slightly, longest in the middle.
      const len = (i === 0 ? 0.62 : 0.5) * scale;
      const tip = transformJointLocal(armJoint, yaw, armRot, v3(i * 0.3 * scale, -2.38 * scale, 0.15 * scale));
      appendOrientedBox(triBuilder, lineBuilder, tip, v3(0.13 * scale, len, 0.13 * scale), v3(armRot + 0.25, yaw, i * 0.18), COLORS.bone, OUTLINE, false);
      // Blood-stained point at the very end.
      const point = transformJointLocal(armJoint, yaw, armRot, v3(i * 0.32 * scale, (-2.38 - 0.34) * scale, 0.21 * scale));
      appendOrientedBox(triBuilder, lineBuilder, point, v3(0.09 * scale, 0.18 * scale, 0.09 * scale), v3(armRot + 0.25, yaw, i * 0.18), COLORS.bloodBright, COLORS.bloodBright, false);
    }
  }

  // Distinctive per-class accessories/weapons for Zombie Versus classes.
  function renderZombieClassBits(triBuilder, lineBuilder, character, pose, yaw, scale) {
    const root = character.pos;
    const cls = character.vsClass;
    const handItem = (offset, size, rot, color, lineColor) => {
      const hand = transformJointLocal(pose.rightArmJoint, yaw, pose.rightArmRot, offset);
      appendOrientedBox(triBuilder, lineBuilder, hand, size, v3(pose.rightArmRot + (rot || 0), yaw, 0), color, lineColor || OUTLINE, false);
    };
    if (cls === 'chef') {
      // Tall pleated toque with a band, a grease-stained apron, and a proper frying pan.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.72, y: 5.95, z: -0.72 }, scale), scaleBox({ x: 0.72, y: 6.25, z: 0.72 }, scale), shade(COLORS.white, 0.88), false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.86, y: 6.25, z: -0.86 }, scale), scaleBox({ x: 0.86, y: 7.05, z: 0.86 }, scale), COLORS.white, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.72, y: 7.05, z: -0.72 }, scale), scaleBox({ x: 0.72, y: 7.25, z: 0.72 }, scale), shade(COLORS.white, 0.94), false);
      // Puffy top pleats.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.5, y: 6.5, z: 0.84 }, scale), scaleBox({ x: -0.3, y: 7.02, z: 0.9 }, scale), shade(COLORS.white, 0.9), false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.3, y: 6.5, z: 0.84 }, scale), scaleBox({ x: 0.5, y: 7.02, z: 0.9 }, scale), shade(COLORS.white, 0.9), false);
      // Apron with neck strap and a splatter stain.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.72, y: 1.6, z: 0.5 }, scale), scaleBox({ x: 0.72, y: 3.9, z: 0.62 }, scale), COLORS.white, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.16, y: 3.9, z: 0.5 }, scale), scaleBox({ x: 0.16, y: 4.3, z: 0.6 }, scale), COLORS.white, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.3, y: 2.4, z: 0.6 }, scale), scaleBox({ x: 0.14, y: 2.9, z: 0.66 }, scale), COLORS.bloodBright, false);
      // Frying pan: dish + rim + long handle with a hang hole.
      handItem(v3(0.1 * scale, -1.7 * scale, 0.5 * scale), v3(1.45 * scale, 0.2 * scale, 1.45 * scale), 0, COLORS.black);
      handItem(v3(0.1 * scale, -1.58 * scale, 0.5 * scale), v3(1.15 * scale, 0.1 * scale, 1.15 * scale), 0, shade(COLORS.black, 2.6));
      handItem(v3(0.1 * scale, -1.68 * scale, 1.6 * scale), v3(0.22 * scale, 0.22 * scale, 1.0 * scale), 0, COLORS.darkBrown);
      handItem(v3(0.1 * scale, -1.68 * scale, 2.12 * scale), v3(0.3 * scale, 0.26 * scale, 0.14 * scale), 0, COLORS.steel);
    } else if (cls === 'pumpkin') {
      // Big ribbed jack-o'-lantern head with a crooked stem and a carved grin.
      const headC = vAdd(root, rotateAroundY(v3(0, 5.3 * scale, 0), yaw));
      appendSphere(triBuilder, headC, 1.2 * scale, COLORS.orange, 7, 9);
      // Vertical rib grooves.
      for (const rx of [-0.72, 0, 0.72]) {
        addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: rx - 0.06, y: 4.5, z: -1.0 }, scale), scaleBox({ x: rx + 0.06, y: 6.1, z: -0.9 }, scale), COLORS.pumpkinDark, false);
      }
      // Crooked green stem with a leaf.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.12, y: 6.34, z: -0.02 }, scale), scaleBox({ x: 0.14, y: 6.95, z: 0.24 }, scale), COLORS.green, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.14, y: 6.7, z: 0.02 }, scale), scaleBox({ x: 0.52, y: 6.82, z: 0.3 }, scale), shade(COLORS.green, 1.2), false);
      // Carved triangle-ish eyes + nose, glowing.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.52, y: 5.34, z: 0.94 }, scale), scaleBox({ x: -0.16, y: 5.66, z: 1.2 }, scale), COLORS.zombieEye, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.16, y: 5.34, z: 0.94 }, scale), scaleBox({ x: 0.52, y: 5.66, z: 1.2 }, scale), COLORS.zombieEye, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.1, y: 5.1, z: 0.98 }, scale), scaleBox({ x: 0.1, y: 5.28, z: 1.2 }, scale), COLORS.zombieEye, false);
      // Jagged glowing grin with two gap teeth.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.56, y: 4.68, z: 0.94 }, scale), scaleBox({ x: 0.56, y: 4.92, z: 1.16 }, scale), COLORS.zombieEye, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.3, y: 4.84, z: 0.96 }, scale), scaleBox({ x: -0.12, y: 4.94, z: 1.18 }, scale), COLORS.orange, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.12, y: 4.66, z: 0.96 }, scale), scaleBox({ x: 0.3, y: 4.78, z: 1.18 }, scale), COLORS.orange, false);
    } else if (cls === 'dumb') {
      // Propeller beanie, googly eyes, and a lolling tongue — plus a TP roll in hand.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.72, y: 5.95, z: -0.72 }, scale), scaleBox({ x: 0.72, y: 6.42, z: 0.72 }, scale), COLORS.canRed, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.72, y: 6.1, z: 0.66 }, scale), scaleBox({ x: 0.72, y: 6.28, z: 0.76 }, scale), COLORS.yellow, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.08, y: 6.42, z: -0.08 }, scale), scaleBox({ x: 0.08, y: 6.72, z: 0.08 }, scale), COLORS.steel, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1.0, y: 6.7, z: -0.1 }, scale), scaleBox({ x: 1.0, y: 6.8, z: 0.1 }, scale), COLORS.blue, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.1, y: 6.7, z: -1.0 }, scale), scaleBox({ x: 0.1, y: 6.8, z: 1.0 }, scale), COLORS.yellow, false);
      // Googly eyes: white discs with off-center pupils.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.5, y: 5.2, z: 0.8 }, scale), scaleBox({ x: -0.1, y: 5.6, z: 0.92 }, scale), COLORS.white, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.1, y: 5.2, z: 0.8 }, scale), scaleBox({ x: 0.5, y: 5.6, z: 0.92 }, scale), COLORS.white, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.38, y: 5.26, z: 0.9 }, scale), scaleBox({ x: -0.22, y: 5.42, z: 0.98 }, scale), COLORS.black, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.2, y: 5.38, z: 0.9 }, scale), scaleBox({ x: 0.36, y: 5.54, z: 0.98 }, scale), COLORS.black, false);
      // Tongue hanging out of the corner of the mouth.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.1, y: 4.62, z: 0.82 }, scale), scaleBox({ x: 0.36, y: 4.92, z: 0.98 }, scale), COLORS.tongue, false);
      // Toilet paper roll clutched in hand.
      handItem(v3(0.08 * scale, -1.7 * scale, 0.42 * scale), v3(0.72 * scale, 0.62 * scale, 0.72 * scale), 0, COLORS.white);
      handItem(v3(0.08 * scale, -1.7 * scale, 0.42 * scale), v3(0.26 * scale, 0.66 * scale, 0.26 * scale), 0, shade(COLORS.white, 0.7));
    } else if (cls === 'doctor') {
      // Blood-flecked surgical mask, head mirror, and a serrated bone-saw.
      renderDoctorMask(triBuilder, lineBuilder, root, yaw, scale);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.3, y: 4.66, z: 1.02 }, scale), scaleBox({ x: -0.14, y: 4.82, z: 1.1 }, scale), COLORS.bloodBright, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.2, y: 4.9, z: 1.02 }, scale), scaleBox({ x: 0.32, y: 5.0, z: 1.1 }, scale), COLORS.bloodBright, false);
      // Head mirror on a band.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.95, y: 5.7, z: -0.85 }, scale), scaleBox({ x: 0.95, y: 5.88, z: 0.85 }, scale), COLORS.white, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.24, y: 5.56, z: 0.84 }, scale), scaleBox({ x: 0.24, y: 6.04, z: 0.98 }, scale), COLORS.steel, false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.12, y: 5.68, z: 0.98 }, scale), scaleBox({ x: 0.12, y: 5.92, z: 1.04 }, scale), COLORS.maskClip, false);
      // Bone-saw: blade, serrated teeth, grip.
      handItem(v3(0.1 * scale, -1.9 * scale, 0.7 * scale), v3(0.16 * scale, 0.5 * scale, 1.5 * scale), 0, COLORS.steel);
      for (let i = 0; i < 4; i += 1) {
        handItem(v3(0.1 * scale, (-2.2) * scale, (0.25 + i * 0.36) * scale), v3(0.14 * scale, 0.16 * scale, 0.16 * scale), 0, COLORS.swordSteel);
      }
      handItem(v3(0.1 * scale, -1.72 * scale, 0.14 * scale), v3(0.42 * scale, 0.6 * scale, 0.3 * scale), 0, COLORS.darkBrown);
      // Blood along the blade edge.
      handItem(v3(0.1 * scale, -2.08 * scale, 0.9 * scale), v3(0.17 * scale, 0.1 * scale, 0.9 * scale), 0, COLORS.bloodBright, COLORS.bloodBright);
    } else if (cls === 'ghost') {
      // Tattered spectral shroud: layered pale drape with ragged hem strips.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1.18, y: 4.3, z: -0.75 }, scale), scaleBox({ x: 1.18, y: 6.05, z: 0.95 }, scale), rgba(226, 234, 245, 0.85), false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -1.05, y: 3.4, z: -0.62 }, scale), scaleBox({ x: 1.05, y: 4.3, z: 0.82 }, scale), rgba(208, 220, 238, 0.7), false);
      for (const hx of [-0.85, -0.3, 0.3, 0.85]) {
        addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: hx - 0.14, y: 2.7, z: 0.5 }, scale), scaleBox({ x: hx + 0.14, y: 3.44, z: 0.74 }, scale), rgba(214, 226, 240, 0.6), false);
      }
      // Hollow dark eye pits glowing faint blue.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.46, y: 5.2, z: 0.8 }, scale), scaleBox({ x: -0.12, y: 5.5, z: 0.94 }, scale), rgba(120, 190, 255, 0.95), false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.12, y: 5.2, z: 0.8 }, scale), scaleBox({ x: 0.46, y: 5.5, z: 0.94 }, scale), rgba(120, 190, 255, 0.95), false);
    } else if (cls === 'crawler') {
      // Ragged leg stumps under the torso and dirt-caked forearms from dragging.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.85, y: 1.7, z: -0.4 }, scale), scaleBox({ x: -0.2, y: 2.15, z: 0.4 }, scale), shade(COLORS.zombieSkinDark, 0.7), false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.2, y: 1.7, z: -0.4 }, scale), scaleBox({ x: 0.85, y: 2.15, z: 0.4 }, scale), shade(COLORS.zombieSkinDark, 0.7), false);
      // Exposed bone poking from one stump.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: 0.4, y: 1.4, z: -0.12 }, scale), scaleBox({ x: 0.62, y: 1.74, z: 0.12 }, scale), COLORS.bone, false);
    } else if (cls === 'normal') {
      // Torn shirt gash with a raking wound across the chest.
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.62, y: 2.9, z: 0.5 }, scale), scaleBox({ x: 0.2, y: 3.5, z: 0.58 }, scale), shade(COLORS.zombieSkinDark, 0.8), false);
      addBodyBox(triBuilder, lineBuilder, root, yaw, scaleBox({ x: -0.5, y: 3.02, z: 0.56 }, scale), scaleBox({ x: 0.06, y: 3.2, z: 0.62 }, scale), COLORS.blood, false);
    }
  }

  function scaleBox(vector, scale) {
    return v3(vector.x * scale, vector.y * scale, vector.z * scale);
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

  // Build a box in camera space: center/size are given along the (right, up, forward) basis
  // originating at the camera eye, so the geometry stays glued to the screen.
  function appendViewBox(triBuilder, lineBuilder, origin, right, up, forward, center, half, color) {
    const corner = (i, j, k) => vAdd(
      origin,
      vAdd(
        vAdd(vScale(right, center.x + i * half.x), vScale(up, center.y + j * half.y)),
        vScale(forward, center.z + k * half.z)
      )
    );
    const c = [
      corner(-1, -1, -1), corner(1, -1, -1), corner(1, 1, -1), corner(-1, 1, -1),
      corner(-1, -1, 1), corner(1, -1, 1), corner(1, 1, 1), corner(-1, 1, 1)
    ];
    const nF = forward;
    const nB = vScale(forward, -1);
    const nL = vScale(right, -1);
    const nR = right;
    const nU = up;
    const nD = vScale(up, -1);
    addQuad(triBuilder, c[4], c[5], c[6], c[7], nF, color);
    addQuad(triBuilder, c[1], c[0], c[3], c[2], nB, shade(color, 0.93));
    addQuad(triBuilder, c[0], c[4], c[7], c[3], nL, shade(color, 0.88));
    addQuad(triBuilder, c[5], c[1], c[2], c[6], nR, shade(color, 0.88));
    addQuad(triBuilder, c[3], c[7], c[6], c[2], nU, shade(color, 1.05));
    addQuad(triBuilder, c[0], c[1], c[5], c[4], nD, shade(color, 0.82));
    if (lineBuilder) {
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];
      for (const [a, b] of edges) {
        addLine(lineBuilder, c[a], c[b], OUTLINE);
      }
    }
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
      uniform float uAmbient;
      uniform float uDiffuse;
      uniform vec3 uTint;
      void main() {
        float diffuse = max(dot(normalize(vNormal), normalize(uLightDir)), 0.0);
        float shade = uAmbient + diffuse * uDiffuse;
        vec3 lit = vColor.rgb * shade * uTint;
        // Very bright surfaces (lamps, the moon) keep glowing at night.
        float brightness = max(vColor.r, max(vColor.g, vColor.b));
        float emissive = smoothstep(0.86, 1.0, brightness) * 0.75;
        vec3 outColor = mix(lit, vColor.rgb, emissive);
        float fog = clamp((vDistance - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
        gl_FragColor = vec4(mix(outColor, uFogColor, fog), vColor.a);
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
          fogFar: gl.getUniformLocation(triProgram, 'uFogFar'),
          ambient: gl.getUniformLocation(triProgram, 'uAmbient'),
          diffuse: gl.getUniformLocation(triProgram, 'uDiffuse'),
          tint: gl.getUniformLocation(triProgram, 'uTint')
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

  function getSentryAabb(sentry) {
    return {
      min: v3(sentry.pos.x - 0.8, sentry.pos.y - 0.2, sentry.pos.z - 0.8),
      max: v3(sentry.pos.x + 0.8, sentry.pos.y + 2, sentry.pos.z + 0.8)
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

  function getAimDirectionFromView(yaw, pitch) {
    return vNormalize(v3(
      -Math.sin(yaw) * Math.cos(pitch),
      -Math.sin(pitch),
      Math.cos(yaw) * Math.cos(pitch)
    ));
  }

  function spreadDirection(direction, spread) {
    if (!spread) {
      return direction;
    }
    const yaw = Math.atan2(-direction.x, direction.z);
    const pitch = -Math.asin(direction.y);
    const jitterYaw = yaw + randRange(-spread, spread);
    const jitterPitch = clamp(pitch + randRange(-spread, spread), -1.1, 1.1);
    return getAimDirectionFromView(jitterYaw, jitterPitch);
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

  function colorToHex(color) {
    const to = (v) => Math.max(0, Math.min(255, Math.round((v || 0) * 255))).toString(16).padStart(2, '0');
    return `#${to(color.r)}${to(color.g)}${to(color.b)}`;
  }

  function hexToColor(hex, alpha = 1) {
    const clean = String(hex || '#888888').replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16) || 0;
    const g = parseInt(clean.slice(2, 4), 16) || 0;
    const b = parseInt(clean.slice(4, 6), 16) || 0;
    return { r: r / 255, g: g / 255, b: b / 255, a: alpha };
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
      fireHeld: false,
      cameraYaw: 0,
      cameraPitch: 0,
      firstPerson: false,
      selectedTool: STARTER_WEAPON_KEY,
      resetNonce: 0
    };
  }

  function normalizeAvatarPresetKey(value) {
    return Object.prototype.hasOwnProperty.call(AVATAR_PRESETS, value) ? value : DEFAULT_AVATAR_PRESET;
  }

  function getAvatarPreset(value) {
    if (value === 'custom') {
      return buildCustomAvatarPreset();
    }
    return AVATAR_PRESETS[normalizeAvatarPresetKey(value)];
  }

  function cloneBodyColors(colors) {
    return {
      head: { ...colors.head },
      torso: { ...colors.torso },
      arms: { ...colors.arms },
      legs: { ...colors.legs }
    };
  }

  // Infected human: keep the avatar shape but tint everything sickly green.
  function versusZombieColors(base) {
    const greenify = (c) => ({
      r: c.r * 0.28 + 0.12,
      g: c.g * 0.35 + 0.42,
      b: c.b * 0.28 + 0.12,
      a: 1
    });
    return {
      head: COLORS.zombieSkin,
      torso: greenify(base.torso),
      arms: COLORS.zombieSkin,
      legs: greenify(base.legs)
    };
  }

  function getZombieBodyColors(type) {
    const def = ZOMBIE_DEFS[type];
    const skin = type === 'rival' ? COLORS.rivalSkin : COLORS.zombieSkin;
    return {
      head: skin,
      torso: def?.clothing?.torso || COLORS.zombieRag,
      arms: skin,
      legs: def?.clothing?.legs || COLORS.black
    };
  }

  function getWeaponDef(key) {
    return key ? WEAPON_DEFS[key] || null : null;
  }

  function serializeCharacter(character) {
    return {
      id: character.id,
      name: character.name,
      avatarPreset: normalizeAvatarPresetKey(character.avatarPreset),
      bodyColors: cloneBodyColors(character.bodyColors),
      spawn: vCopy(character.spawn),
      pos: vCopy(character.pos),
      vel: vCopy(character.vel),
      yaw: roundNetworkFloat(character.yaw),
      health: Math.round(character.health * 100) / 100,
      maxHealth: character.maxHealth,
      dead: Boolean(character.dead),
      forcefield: Math.round(character.forcefield * 100) / 100,
      toolCooldown: roundNetworkFloat(character.toolCooldown),
      slowTimer: roundNetworkFloat(character.slowTimer),
      slowFactor: roundNetworkFloat(character.slowFactor),
      hasteTimer: roundNetworkFloat(character.hasteTimer),
      hasteFactor: roundNetworkFloat(character.hasteFactor),
      colaTimer: roundNetworkFloat(character.colaTimer),
      freezeMeter: roundNetworkFloat(character.freezeMeter),
      frozenTimer: roundNetworkFloat(character.frozenTimer),
      stunTimer: roundNetworkFloat(character.stunTimer),
      poisonTimer: roundNetworkFloat(character.poisonTimer),
      poisonDps: roundNetworkFloat(character.poisonDps),
      ko: character.ko,
      wo: character.wo,
      selectedTool: character.selectedTool,
      walkCycle: roundNetworkFloat(character.walkCycle),
      // Zombie Versus role/appearance so joiners render + behave correctly.
      vsRole: character.vsRole || null,
      vsClass: character.vsClass || null,
      infected: Boolean(character.infected),
      renderScale: character.renderScale || 1,
      grounded: Boolean(character.grounded)
    };
  }

  function serializeZombie(zombie, currentTime = 0) {
    return {
      id: zombie.id,
      zombieType: zombie.zombieType,
      name: zombie.name,
      bodyColors: cloneBodyColors(zombie.bodyColors),
      pos: vCopy(zombie.pos),
      vel: vCopy(zombie.vel),
      yaw: roundNetworkFloat(zombie.yaw),
      health: Math.round(zombie.health * 100) / 100,
      maxHealth: zombie.maxHealth,
      dead: Boolean(zombie.dead),
      armor: zombie.armor,
      walkSpeed: zombie.walkSpeed,
      selectedTool: zombie.selectedTool,
      walkCycle: roundNetworkFloat(zombie.walkCycle),
      renderScale: zombie.renderScale,
      cloakRevealTimer: Math.max(0, roundNetworkFloat(zombie.cloakRevealUntil - currentTime)),
      bounds: { ...zombie.bounds }
    };
  }

  function serializeRoundState(round, armory, livingZombies) {
    return {
      phase: round.phase,
      wave: round.wave,
      lastClearedWave: round.lastClearedWave,
      unlockedBaseKeys: [...round.unlockedBaseKeys],
      nextUnlockIndex: round.nextUnlockIndex,
      gold: armory.gold,
      ownedVipKeys: [...armory.ownedVipKeys],
      payoutGold: round.payoutGold,
      livingZombies
    };
  }

  function serializeProjectile(projectile) {
    return {
      id: projectile.id,
      projectileKind: projectile.projectileKind,
      ownerId: projectile.ownerId,
      ownerKind: projectile.ownerKind,
      team: projectile.team,
      weaponKey: projectile.weaponKey,
      pos: vCopy(projectile.pos),
      vel: vCopy(projectile.vel),
      radius: projectile.radius,
      gravity: projectile.gravity,
      bounce: projectile.bounce,
      life: projectile.life,
      damage: projectile.damage,
      color: { ...projectile.color },
      knockback: projectile.knockback,
      splashRadius: projectile.splashRadius,
      slowFactor: projectile.slowFactor,
      slowTime: projectile.slowTime,
      freeze: projectile.freeze,
      poisonDps: projectile.poisonDps,
      poisonTime: projectile.poisonTime,
      remainingPierce: projectile.remainingPierce,
      sticky: projectile.sticky,
      stuck: projectile.stuck,
      fuse: projectile.fuse,
      armTime: projectile.armTime,
      hazard: projectile.hazard ? { ...projectile.hazard } : null
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

  function serializeSentry(sentry) {
    return {
      id: sentry.id,
      ownerId: sentry.ownerId,
      pos: vCopy(sentry.pos),
      yaw: sentry.yaw,
      cooldown: sentry.cooldown,
      health: sentry.health,
      maxHealth: sentry.maxHealth,
      range: sentry.range,
      life: sentry.life,
      fireRate: sentry.fireRate
    };
  }

  function serializeHazard(hazard) {
    return {
      id: hazard.id,
      type: hazard.type,
      pos: vCopy(hazard.pos),
      radius: hazard.radius,
      life: hazard.life,
      dps: hazard.dps,
      affect: hazard.affect,
      color: { ...hazard.color },
      slowFactor: hazard.slowFactor,
      slowTime: hazard.slowTime,
      poisonDps: hazard.poisonDps,
      poisonTime: hazard.poisonTime
    };
  }

  function deserializeProjectile(data) {
    return {
      ...data,
      pos: vCopy(data.pos),
      vel: vCopy(data.vel),
      color: { ...data.color },
      hazard: data.hazard ? { ...data.hazard } : null,
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

  function deserializeSentry(data) {
    return {
      ...data,
      kind: 'sentry',
      pos: vCopy(data.pos)
    };
  }

  function deserializeHazard(data) {
    return {
      ...data,
      pos: vCopy(data.pos),
      color: { ...data.color }
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

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function calculateWaveBudget(wave, players) {
    // Gentler ramp so early waves stay manageable and later ones grow steadily, not explosively.
    return Math.round((6 + 2.2 * wave + (wave * wave) / 10) * (1 + 0.4 * Math.max(0, players - 1)));
  }

  function calculateWaveMaxAlive(wave, players) {
    // Keep far fewer zombies on-screen at once so you never get walled in.
    return 4 + Math.floor(wave * 0.8) + 3 * Math.max(0, players - 1);
  }

  function buildWaveSpawnQueue(wave, budget) {
    const queue = [];
    let remaining = budget;
    while (remaining > 0) {
      const options = Object.values(ZOMBIE_DEFS).filter((definition) => definition.intro <= wave && definition.cost <= remaining);
      if (!options.length) {
        break;
      }
      const totalWeight = options.reduce((sum, definition) => sum + definition.weight * clamp((wave - definition.intro + 1) / 4, 0, 1), 0);
      let roll = Math.random() * totalWeight;
      let picked = options[0];
      for (const definition of options) {
        roll -= definition.weight * clamp((wave - definition.intro + 1) / 4, 0, 1);
        if (roll <= 0) {
          picked = definition;
          break;
        }
      }
      queue.push(picked.key);
      remaining -= picked.cost;
    }
    return queue;
  }

  function calculateGoldPayout(clearedWaves) {
    if (clearedWaves <= 10) {
      return 0;
    }
    return 8 + (clearedWaves - 10) * 4;
  }

  function findNearestBy(collection, position, range) {
    let best = null;
    let bestDistance = range;
    for (const item of collection) {
      if (item.dead) {
        continue;
      }
      const distance = vLength(vSub(item.pos, position));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = item;
      }
    }
    return best;
  }

  function resolveHumanOwner(source, characterMap, sentries) {
    if (!source) {
      return null;
    }
    if (source.kind === 'player') {
      return characterMap.get(source.id) || null;
    }
    if (source.kind === 'sentry') {
      const sentry = sentries.find((item) => item.id === source.id);
      return sentry ? characterMap.get(sentry.ownerId) || null : null;
    }
    return null;
  }


  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // ============================================================
  //  STUDIO — a simple, no-code editor for the zombie game.
  //  Edits a throwaway copy (never overwrites the real game).
  // ============================================================

  const STUDIO_STORAGE_KEY = 'build-and-learn-studio-projects';

  function buildMeshFromShapes(shapes, tri, line, drawEdges = true) {
    for (const s of shapes || []) {
      const color = hexToColor(s.color, s.alpha !== undefined ? s.alpha : 1);
      const center = v3(s.x || 0, s.y || 0, s.z || 0);
      const rot = v3(s.rx || 0, s.ry || 0, s.rz || 0);
      if (s.type === 'sphere') {
        appendSphere(tri, center, s.r || 1, color, 8, 10);
      } else if (s.type === 'cylinder') {
        appendCylinder(tri, center, s.r || 0.5, s.h || 1, color, rot, 12);
      } else {
        appendOrientedBox(tri, drawEdges ? line : null, center, v3(s.w || 1, s.h || 1, s.d || 1), rot, color, OUTLINE, false);
      }
    }
  }

  function buildWorldFromBlocks(blocks) {
    const solid = createTriBuilder();
    const transparent = createTriBuilder();
    const lines = createLineBuilder();
    const colliders = [];
    for (const b of blocks || []) {
      const center = v3(b.x || 0, b.y || 0, b.z || 0);
      const color = hexToColor(b.color);
      const rot = v3(b.rx || 0, b.ry || 0, b.rz || 0);
      // Thin flat decals (roads, floor markings) render but don't collide, so you don't
      // spawn embedded in them and get shoved through the floor.
      const collides = b.solid !== false;
      if (b.type === 'sphere') {
        appendSphere(solid, center, b.r || 1, color, 8, 10);
        if (collides) colliders.push(aabbFor(center, v3((b.r || 1) * 2, (b.r || 1) * 2, (b.r || 1) * 2)));
      } else if (b.type === 'cylinder') {
        appendCylinder(solid, center, b.r || 0.5, b.h || 1, color, rot, 12);
        if (collides) colliders.push(aabbFor(center, v3((b.r || 0.5) * 2, b.h || 1, (b.r || 0.5) * 2)));
      } else {
        const size = v3(b.w || 1, b.h || 1, b.d || 1);
        appendOrientedBox(solid, lines, center, size, rot, color, OUTLINE, false);
        if (collides) colliders.push(aabbFor(center, size));
      }
    }
    return {
      solid,
      transparent,
      lines,
      colliders,
      blocks,
      spawnPoint: v3(0, 0.01, 0),
      playerSpawns: [v3(0, 0.01, 0), v3(4, 0.01, 0), v3(-4, 0.01, 0), v3(0, 0.01, 4), v3(0, 0.01, -4), v3(6, 0.01, 3), v3(-6, 0.01, -3), v3(3, 0.01, -6)],
      zombieSpawns: [v3(0, 0.01, -44), v3(0, 0.01, 44), v3(-44, 0.01, 0), v3(44, 0.01, 0), v3(30, 0.01, 30), v3(-30, 0.01, 30), v3(30, 0.01, -30), v3(-30, 0.01, -30)]
    };
  }

  function aabbFor(center, size) {
    return {
      min: v3(center.x - size.x / 2, center.y - size.y / 2, center.z - size.z / 2),
      max: v3(center.x + size.x / 2, center.y + size.y / 2, center.z + size.z / 2),
      center: vCopy(center),
      solid: true,
      kill: false,
      climbable: false,
      transparentOnly: false
    };
  }

  function renderStudioModelPosed(triBuilder, lineBuilder, shapes, character, scale) {
    const pos = character.pos;
    const yaw = character.yaw;
    const moveStrength = clamp(Math.hypot(character.vel.x, character.vel.z) / Math.max(1, character.walkSpeed), 0, 1);
    const bob = Math.sin(character.walkCycle * 2) * 0.14 * moveStrength * scale;
    for (const s of shapes) {
      const local = v3((s.x || 0) * scale, (s.y || 0) * scale + bob, (s.z || 0) * scale);
      const center = vAdd(rotateAroundY(local, yaw), pos);
      const color = hexToColor(s.color);
      const rot = v3(s.rx || 0, (s.ry || 0) + yaw, s.rz || 0);
      if (s.type === 'sphere') {
        appendSphere(triBuilder, center, (s.r || 1) * scale, color, 8, 10);
      } else if (s.type === 'cylinder') {
        appendCylinder(triBuilder, center, (s.r || 0.5) * scale, (s.h || 1) * scale, color, rot, 12);
      } else {
        appendOrientedBox(triBuilder, lineBuilder, center, v3((s.w || 1) * scale, (s.h || 1) * scale, (s.d || 1) * scale), rot, color, OUTLINE, false);
      }
    }
  }

  function addWireBox(lineBuilder, center, size, rot, color) {
    const half = vScale(size, 0.5);
    const c = [
      transformBoxCorner(center, half, rot, -1, -1, -1),
      transformBoxCorner(center, half, rot, 1, -1, -1),
      transformBoxCorner(center, half, rot, 1, 1, -1),
      transformBoxCorner(center, half, rot, -1, 1, -1),
      transformBoxCorner(center, half, rot, -1, -1, 1),
      transformBoxCorner(center, half, rot, 1, -1, 1),
      transformBoxCorner(center, half, rot, 1, 1, 1),
      transformBoxCorner(center, half, rot, -1, 1, 1)
    ];
    const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    for (const [a, b] of edges) {
      addLine(lineBuilder, c[a], c[b], color);
    }
  }

  function shapeHighlightSize(shape) {
    if (shape.type === 'sphere') {
      const r = (shape.r || 1) * 2 + 0.3;
      return v3(r, r, r);
    }
    if (shape.type === 'cylinder') {
      const r = (shape.r || 0.5) * 2 + 0.3;
      return v3(r, (shape.h || 1) + 0.3, r);
    }
    return v3((shape.w || 1) + 0.3, (shape.h || 1) + 0.3, (shape.d || 1) + 0.3);
  }

  function makeHumanoidModel(colors) {
    const hex = (c) => colorToHex(c);
    return [
      { type: 'box', name: 'Torso', x: 0, y: 3.1, z: 0, w: 2, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: hex(colors.torso) },
      { type: 'box', name: 'Head', x: 0, y: 5.2, z: 0, w: 1.8, h: 1.5, d: 1.55, rx: 0, ry: 0, rz: 0, color: hex(colors.head) },
      { type: 'box', name: 'Left Arm', x: -1.5, y: 3.1, z: 0, w: 1, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: hex(colors.arms) },
      { type: 'box', name: 'Right Arm', x: 1.5, y: 3.1, z: 0, w: 1, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: hex(colors.arms) },
      { type: 'box', name: 'Left Leg', x: -0.5, y: 1.05, z: 0, w: 1, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: hex(colors.legs) },
      { type: 'box', name: 'Right Leg', x: 0.5, y: 1.05, z: 0, w: 1, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: hex(colors.legs) }
    ];
  }

  function makeWeaponModel(color) {
    const hex = colorToHex(color || COLORS.steel);
    return [
      { type: 'box', name: 'Body', x: 0, y: 0, z: 0.2, w: 0.5, h: 0.6, d: 1.8, rx: 0, ry: 0, rz: 0, color: hex },
      { type: 'box', name: 'Barrel', x: 0, y: 0.1, z: 1.3, w: 0.28, h: 0.28, d: 1, rx: 0, ry: 0, rz: 0, color: colorToHex(COLORS.black) },
      { type: 'box', name: 'Grip', x: 0, y: -0.5, z: -0.4, w: 0.32, h: 0.7, d: 0.35, rx: 0.5, ry: 0, rz: 0, color: colorToHex(COLORS.darkBrown) }
    ];
  }

  function makeAvatarModel() {
    // Classic noob template with a face — a friendly starting point to customise.
    const y = colorToHex(COLORS.yellow);
    const blue = colorToHex(COLORS.blue);
    const green = colorToHex(COLORS.green);
    const black = colorToHex(COLORS.black);
    return [
      { type: 'box', name: 'Torso', x: 0, y: 3.1, z: 0, w: 2, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: blue },
      { type: 'box', name: 'Head', x: 0, y: 5.2, z: 0, w: 1.8, h: 1.5, d: 1.55, rx: 0, ry: 0, rz: 0, color: y },
      { type: 'box', name: 'Left Arm', x: -1.5, y: 3.1, z: 0, w: 1, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: y },
      { type: 'box', name: 'Right Arm', x: 1.5, y: 3.1, z: 0, w: 1, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: y },
      { type: 'box', name: 'Left Leg', x: -0.5, y: 1.05, z: 0, w: 1, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: green },
      { type: 'box', name: 'Right Leg', x: 0.5, y: 1.05, z: 0, w: 1, h: 2, d: 1, rx: 0, ry: 0, rz: 0, color: green },
      { type: 'box', name: 'Left Eye', x: -0.28, y: 5.38, z: 0.8, w: 0.16, h: 0.24, d: 0.08, rx: 0, ry: 0, rz: 0, color: black },
      { type: 'box', name: 'Right Eye', x: 0.28, y: 5.38, z: 0.8, w: 0.16, h: 0.24, d: 0.08, rx: 0, ry: 0, rz: 0, color: black },
      { type: 'box', name: 'Smile', x: 0, y: 4.98, z: 0.8, w: 0.5, h: 0.12, d: 0.08, rx: 0, ry: 0, rz: 0, color: black }
    ];
  }

  function makeBaseplateMap() {
    return [
      { type: 'box', name: 'Baseplate', x: 0, y: -1, z: 0, w: 120, h: 2, d: 120, rx: 0, ry: 0, rz: 0, color: '#7f9a86' }
    ];
  }

  function makeCrossroadsMap() {
    const b = [];
    b.push({ type: 'box', name: 'Ground', x: 0, y: -1, z: 0, w: 170, h: 2, d: 170, color: '#3c5a44' });
    b.push({ type: 'box', name: 'Road NS', x: 0, y: 0.06, z: 0, w: 22, h: 0.2, d: 170, color: '#464e58', solid: false });
    b.push({ type: 'box', name: 'Road EW', x: 0, y: 0.06, z: 0, w: 170, h: 0.2, d: 22, color: '#464e58', solid: false });
    b.push({ type: 'box', name: 'Plaza', x: 0, y: 0.13, z: 0, w: 30, h: 0.24, d: 30, color: '#8a8a90', solid: false });
    for (const [cx, cz] of [[26, 26], [-26, 26], [26, -26], [-26, -26], [44, 0], [-44, 0], [0, 44], [0, -44]]) {
      b.push({ type: 'box', name: 'Cover', x: cx, y: 1.3, z: cz, w: 4.5, h: 2.6, d: 4.5, color: '#6e4a2a' });
    }
    for (const [cx, cz] of [[14, 14], [-14, -14], [14, -14], [-14, 14]]) {
      b.push({ type: 'box', name: 'Barrier', x: cx, y: 0.9, z: cz, w: 3, h: 1.8, d: 3, color: '#7a828e' });
    }
    const H = 13;
    const T = 4;
    const half = 82;
    const span = half * 2 + T;
    b.push({ type: 'box', name: 'Wall N', x: 0, y: H / 2, z: -half, w: span, h: H, d: T, color: '#5f626c' });
    b.push({ type: 'box', name: 'Wall S', x: 0, y: H / 2, z: half, w: span, h: H, d: T, color: '#5f626c' });
    b.push({ type: 'box', name: 'Wall W', x: -half, y: H / 2, z: 0, w: T, h: H, d: span, color: '#5f626c' });
    b.push({ type: 'box', name: 'Wall E', x: half, y: H / 2, z: 0, w: T, h: H, d: span, color: '#5f626c' });
    return b;
  }

  // Playable zombie classes for Zombie Versus.
  const VERSUS_ZOMBIE_CLASSES = {
    normal: { name: 'Normal Zombie', speed: 15, health: 130, scale: 1.0, damage: 30, swingCooldown: 0.8, emoji: '🧟', tool: 'Rotten Claws', toolTag: 'CLW', desc: 'All-rounder. Solid health and speed.' },
    crawler: { name: 'Crawler', speed: 22, health: 60, scale: 0.72, noLegs: true, damage: 16, swingCooldown: 0.45, emoji: '🦎', tool: 'Gnashing Claws', toolTag: 'CLW', desc: 'No legs, tiny & FAST. Low health.' },
    chef: { name: 'Chef Zombie', speed: 10, health: 190, scale: 1.06, damage: 60, swingCooldown: 1.5, emoji: '👨‍🍳', tool: 'Frying Pan', toolTag: 'PAN', desc: 'Slow tank. Huge pan damage, slow swing.' },
    dumb: { name: 'Dumb Zombie', speed: 21, health: 55, scale: 1.0, damage: 12, swingCooldown: 0.4, emoji: '🧻', tool: 'Toilet Paper', toolTag: 'TP', desc: 'Fast but flimsy. Throws TP that slows.', special: { kind: 'tp-roll', name: 'TP Toss', cooldown: 3.5, speed: 42, gravity: 26, radius: 0.5, damage: 8, knockback: 3, slowFactor: 0.55, slowTime: 1.6, color: 'white' } },
    ghost: { name: 'Ghost Zombie', speed: 19, health: 70, scale: 1.0, ghost: true, damage: 20, swingCooldown: 0.6, emoji: '👻', tool: 'Spectral Claws', toolTag: 'CLW', desc: 'Flickers invisible. Sneak up on humans.' },
    pumpkin: { name: 'Pumpkin Head', speed: 14, health: 140, scale: 1.02, damage: 34, swingCooldown: 0.9, emoji: '🎃', tool: 'Pumpkin Smash', toolTag: 'PMP', desc: 'Bruiser. Hurls chunks of pumpkin.', special: { kind: 'pumpkin-piece', name: 'Pumpkin Hurl', cooldown: 5, speed: 38, gravity: 30, radius: 0.62, damage: 30, knockback: 7, color: 'orange' } },
    doctor: { name: 'Doctor Zombie', speed: 13, health: 160, scale: 1.0, damage: 42, swingCooldown: 1.1, emoji: '🩺', tool: 'Bone Saw', toolTag: 'SAW', desc: 'Surgeon. Lobs buckets of acid.', special: { kind: 'acid-bucket', name: 'Acid Bucket', cooldown: 7, speed: 32, gravity: 32, radius: 0.66, damage: 18, knockback: 4, splashRadius: 4.2, color: 'toxic', hazard: { type: 'acid-pool', radius: 3.6, life: 4.2, dps: 8, slowFactor: 0.8, slowTime: 0.3, affect: 'human', poisonDps: 6, poisonTime: 2.4 } } }
  };
  const VERSUS_CLASS_ORDER = ['normal', 'crawler', 'chef', 'dumb', 'ghost', 'pumpkin', 'doctor'];

  // Big fun lobby clubhouse — no weapons, lots of props to mess about on while you wait.
  function makeVersusLobby() {
    const b = [];
    const half = 46;
    b.push({ type: 'box', name: 'Floor', x: 0, y: -0.5, z: 0, w: half * 2, h: 1, d: half * 2, color: '#8a6a44' });
    b.push({ type: 'box', name: 'Rug', x: 0, y: 0.06, z: -4, w: 22, h: 0.12, d: 16, color: '#7a3b46', solid: false });
    b.push({ type: 'box', name: 'Checker', x: 20, y: 0.06, z: 20, w: 24, h: 0.12, d: 24, color: '#4a5a6a', solid: false });
    const H = 14;
    const T = 1.5;
    for (const s of [
      { x: 0, z: -half, w: half * 2, d: T }, { x: 0, z: half, w: half * 2, d: T },
      { x: -half, z: 0, w: T, d: half * 2 }, { x: half, z: 0, w: T, d: half * 2 }
    ]) {
      b.push({ type: 'box', name: 'Wall', x: s.x, y: H / 2, z: s.z, w: s.w, h: H, d: s.d, color: '#b7a488' });
    }
    b.push({ type: 'box', name: 'Ceiling', x: 0, y: H + 0.5, z: 0, w: half * 2 + 2, h: 1, d: half * 2 + 2, color: '#6c5a44' });
    // Lounge corner
    b.push({ type: 'box', name: 'Table', x: -20, y: 1.3, z: -18, w: 6, h: 0.4, d: 4, color: '#5a3d22' });
    b.push({ type: 'box', name: 'Table Leg', x: -20, y: 0.6, z: -18, w: 0.7, h: 1.2, d: 0.7, color: '#3f2a17' });
    b.push({ type: 'box', name: 'Couch', x: -30, y: 1, z: -30, w: 10, h: 1.8, d: 3.4, color: '#3a5f8a' });
    b.push({ type: 'box', name: 'Couch Back', x: -30, y: 2.4, z: -31.6, w: 10, h: 1.8, d: 0.8, color: '#2f4e73' });
    b.push({ type: 'box', name: 'Tv', x: -30, y: 4, z: -20, w: 8, h: 4.5, d: 0.5, color: '#14161c' });
    b.push({ type: 'box', name: 'Tv Screen', x: -30, y: 4, z: -19.7, w: 7, h: 3.6, d: 0.2, color: '#3a6ea8' });
    // Obstacle course — jump platforms of rising height
    for (let i = 0; i < 5; i += 1) {
      b.push({ type: 'box', name: 'Platform', x: 8 + i * 6, y: 0.8 + i * 1.4, z: 20, w: 4, h: 1.6 + i * 2.8, d: 4, color: i % 2 ? '#c8a24a' : '#d8b25a' });
    }
    b.push({ type: 'box', name: 'Bridge', x: 34, y: 6.6, z: 12, w: 3, h: 0.5, d: 20, color: '#8a6a44' });
    // Big bouncy blocks / pillars to climb
    b.push({ type: 'box', name: 'Pillar', x: 22, y: 5, z: -20, w: 3, h: 10, d: 3, color: '#9a8a70' });
    b.push({ type: 'box', name: 'Pillar', x: 32, y: 5, z: -28, w: 3, h: 10, d: 3, color: '#9a8a70' });
    b.push({ type: 'box', name: 'Crate', x: 14, y: 1, z: -6, w: 2.4, h: 2, d: 2.4, color: '#7a5a34' });
    b.push({ type: 'box', name: 'Crate', x: 16.5, y: 1, z: -6, w: 2.4, h: 2, d: 2.4, color: '#7a5a34' });
    b.push({ type: 'box', name: 'Crate', x: 15.2, y: 3, z: -6, w: 2.4, h: 2, d: 2.4, color: '#8a6a3c' });
    // A little pool
    b.push({ type: 'box', name: 'Pool', x: -22, y: 0.2, z: 24, w: 16, h: 0.4, d: 12, color: '#3f8fd0', solid: false });
    b.push({ type: 'box', name: 'Pool Rim', x: -22, y: 0.5, z: 18, w: 17, h: 1, d: 1.2, color: '#c9c0b0' });
    // Pads: green = summon bot, red = remove bots (kept near the spawn)
    b.push({ type: 'box', name: 'Summon Pad', x: -6, y: 0.12, z: 8, w: 4.5, h: 0.24, d: 4.5, color: '#49c265', solid: false });
    b.push({ type: 'box', name: 'Remove Pad', x: 2, y: 0.12, z: 8, w: 4.5, h: 0.24, d: 4.5, color: '#c24949', solid: false });
    return b;
  }

  // Big spooky graveyard round arena — cover, crypts, fences, verticality.
  function makeVersusArena() {
    const b = [];
    b.push({ type: 'box', name: 'Ground', x: 0, y: -1, z: 0, w: 200, h: 2, d: 200, color: '#33443a' });
    b.push({ type: 'box', name: 'Path NS', x: 0, y: 0.05, z: 0, w: 16, h: 0.14, d: 200, color: '#5a5148', solid: false });
    b.push({ type: 'box', name: 'Path EW', x: 0, y: 0.05, z: 0, w: 200, h: 0.14, d: 16, color: '#5a5148', solid: false });
    // Gravestones scattered as cover (rows)
    const graves = [];
    for (let gx = -80; gx <= 80; gx += 20) {
      for (let gz = -80; gz <= 80; gz += 20) {
        if (Math.abs(gx) < 12 && Math.abs(gz) < 12) continue;
        if (Math.abs(gx) < 10 || Math.abs(gz) < 10) continue;
        graves.push([gx + (Math.random() * 6 - 3), gz + (Math.random() * 6 - 3)]);
      }
    }
    for (const [x, z] of graves) {
      b.push({ type: 'box', name: 'Grave', x, y: 1.5, z, w: 3, h: 3, d: 1, color: '#7c8088' });
      b.push({ type: 'box', name: 'Grave Top', x, y: 3.1, z, w: 3.4, h: 0.7, d: 1.2, color: '#6a6e76' });
    }
    // Central crypt you can stand on
    b.push({ type: 'box', name: 'Crypt', x: 0, y: 2.5, z: 0, w: 16, h: 5, d: 16, color: '#5b5f66' });
    b.push({ type: 'box', name: 'Crypt Roof', x: 0, y: 5.3, z: 0, w: 18, h: 1, d: 18, color: '#484c53' });
    b.push({ type: 'box', name: 'Crypt Ramp', x: 0, y: 1.2, z: 12, w: 6, h: 0.6, d: 8, color: '#565a62' });
    // Corner mausoleums
    for (const [mx, mz] of [[54, 54], [-54, 54], [54, -54], [-54, -54]]) {
      b.push({ type: 'box', name: 'Tomb', x: mx, y: 3, z: mz, w: 12, h: 6, d: 12, color: '#4c5158' });
      b.push({ type: 'box', name: 'Tomb Roof', x: mx, y: 6.3, z: mz, w: 13.5, h: 0.8, d: 13.5, color: '#3d4148' });
    }
    // Dead trees (cover)
    for (const [tx, tz] of [[30, -60], [-30, 60], [70, 10], [-70, -10]]) {
      b.push({ type: 'box', name: 'Trunk', x: tx, y: 4, z: tz, w: 2, h: 8, d: 2, color: '#3a2e22' });
      b.push({ type: 'box', name: 'Branch', x: tx, y: 7.5, z: tz, w: 7, h: 1.4, d: 7, color: '#2e2418' });
    }
    // Low broken fences for partial cover
    for (const [fx, fz, fw, fd] of [[0, -40, 40, 1], [0, 40, 40, 1], [-40, 0, 1, 40], [40, 0, 1, 40]]) {
      b.push({ type: 'box', name: 'Fence', x: fx, y: 1, z: fz, w: fw, h: 2, d: fd, color: '#5a4a38' });
    }
    // Perimeter walls
    const H = 15;
    const T = 5;
    const half = 98;
    const span = half * 2 + T;
    b.push({ type: 'box', name: 'Wall N', x: 0, y: H / 2, z: -half, w: span, h: H, d: T, color: '#3a3f47' });
    b.push({ type: 'box', name: 'Wall S', x: 0, y: H / 2, z: half, w: span, h: H, d: T, color: '#3a3f47' });
    b.push({ type: 'box', name: 'Wall W', x: -half, y: H / 2, z: 0, w: T, h: H, d: span, color: '#3a3f47' });
    b.push({ type: 'box', name: 'Wall E', x: half, y: H / 2, z: 0, w: T, h: H, d: span, color: '#3a3f47' });
    return b;
  }

  // PvZ-style sunny backyard: lawn stripes, plant rows, a wooden shed and a pool.
  function makeVersusArenaGarden() {
    const b = [];
    b.push({ type: 'box', name: 'Lawn', x: 0, y: -1, z: 0, w: 200, h: 2, d: 200, color: '#3f7d33' });
    // Alternating mowed lawn stripes.
    for (let lz = -80; lz <= 80; lz += 32) {
      b.push({ type: 'box', name: 'Stripe', x: 0, y: 0.04, z: lz, w: 196, h: 0.1, d: 16, color: '#4c9040', solid: false });
    }
    // Rows of leafy plants as cover (peashooter-style stalks with heads).
    for (let px = -70; px <= 70; px += 28) {
      for (let pz = -60; pz <= 60; pz += 30) {
        if (Math.abs(px) < 12 && Math.abs(pz) < 12) continue;
        b.push({ type: 'box', name: 'Stalk', x: px, y: 1.6, z: pz, w: 1.2, h: 3.2, d: 1.2, color: '#2f6b2a' });
        b.push({ type: 'box', name: 'Head', x: px, y: 3.6, z: pz, w: 2.6, h: 2, d: 2.6, color: '#57b04a' });
      }
    }
    // Giant sunflowers.
    for (const [sx, sz] of [[-40, 40], [40, -40], [64, 52]]) {
      b.push({ type: 'box', name: 'SunStalk', x: sx, y: 3, z: sz, w: 1.4, h: 6, d: 1.4, color: '#2f6b2a' });
      b.push({ type: 'box', name: 'SunHead', x: sx, y: 6.6, z: sz, w: 4, h: 3, d: 1.4, color: '#f2c530' });
      b.push({ type: 'box', name: 'SunFace', x: sx, y: 6.6, z: sz + 0.75, w: 2.2, h: 1.6, d: 0.2, color: '#8a5a20', solid: false });
    }
    // Wooden garden shed you can fight around, with a climbable ramp.
    b.push({ type: 'box', name: 'Shed', x: -50, y: 4, z: -50, w: 18, h: 8, d: 14, color: '#8a5a34' });
    b.push({ type: 'box', name: 'Shed Roof', x: -50, y: 8.6, z: -50, w: 20, h: 1.2, d: 16, color: '#6e4426' });
    b.push({ type: 'box', name: 'Shed Ramp', x: -38, y: 1.6, z: -50, w: 8, h: 0.6, d: 6, color: '#7a4e2c' });
    // Backyard pool (visual water, low walls you can hop).
    b.push({ type: 'box', name: 'Pool Wall N', x: 45, y: 0.9, z: 37, w: 26, h: 1.8, d: 1.6, color: '#8fd4e8' });
    b.push({ type: 'box', name: 'Pool Wall S', x: 45, y: 0.9, z: 63, w: 26, h: 1.8, d: 1.6, color: '#8fd4e8' });
    b.push({ type: 'box', name: 'Pool Wall W', x: 33, y: 0.9, z: 50, w: 1.6, h: 1.8, d: 26, color: '#8fd4e8' });
    b.push({ type: 'box', name: 'Pool Wall E', x: 57, y: 0.9, z: 50, w: 1.6, h: 1.8, d: 26, color: '#8fd4e8' });
    b.push({ type: 'box', name: 'Pool Water', x: 45, y: 0.35, z: 50, w: 23, h: 0.7, d: 23, color: '#3f9fd4', solid: false });
    // Picket fence perimeter.
    const H = 14;
    const T = 5;
    const half = 98;
    const span = half * 2 + T;
    b.push({ type: 'box', name: 'Fence N', x: 0, y: H / 2, z: -half, w: span, h: H, d: T, color: '#d8d2c2' });
    b.push({ type: 'box', name: 'Fence S', x: 0, y: H / 2, z: half, w: span, h: H, d: T, color: '#d8d2c2' });
    b.push({ type: 'box', name: 'Fence W', x: -half, y: H / 2, z: 0, w: T, h: H, d: span, color: '#d8d2c2' });
    b.push({ type: 'box', name: 'Fence E', x: half, y: H / 2, z: 0, w: T, h: H, d: span, color: '#d8d2c2' });
    return b;
  }

  // Christmas village: snow ground, pine trees, gift boxes, a frozen pond and candy canes.
  function makeVersusArenaChristmas() {
    const b = [];
    b.push({ type: 'box', name: 'Snow', x: 0, y: -1, z: 0, w: 200, h: 2, d: 200, color: '#e8edf4' });
    // Snowy pine trees: stacked green tiers on a trunk.
    for (let tx = -75; tx <= 75; tx += 30) {
      for (let tz = -75; tz <= 75; tz += 30) {
        if (Math.abs(tx) < 14 && Math.abs(tz) < 14) continue;
        if ((tx + tz) % 60 !== 0) continue;
        b.push({ type: 'box', name: 'Trunk', x: tx, y: 1.5, z: tz, w: 1.6, h: 3, d: 1.6, color: '#5a4028' });
        b.push({ type: 'box', name: 'Tier1', x: tx, y: 4, z: tz, w: 7, h: 2.4, d: 7, color: '#2c6b3f' });
        b.push({ type: 'box', name: 'Tier2', x: tx, y: 6.2, z: tz, w: 5, h: 2.2, d: 5, color: '#347a49' });
        b.push({ type: 'box', name: 'Tier3', x: tx, y: 8.2, z: tz, w: 3, h: 2, d: 3, color: '#3d8953' });
        b.push({ type: 'box', name: 'SnowCap', x: tx, y: 9.4, z: tz, w: 2, h: 0.6, d: 2, color: '#f4f8ff', solid: false });
      }
    }
    // Giant wrapped presents as cover.
    for (const [gx, gz, gw, gc, rb] of [[-35, 25, 8, '#c23636', '#f2c530'], [30, -30, 10, '#2f6bb0', '#e8edf4'], [55, 40, 7, '#3d8953', '#c23636'], [-55, -45, 9, '#b04a9e', '#e8edf4']]) {
      b.push({ type: 'box', name: 'Gift', x: gx, y: gw / 2, z: gz, w: gw, h: gw, d: gw, color: gc });
      b.push({ type: 'box', name: 'Ribbon V', x: gx, y: gw / 2, z: gz, w: gw + 0.4, h: gw + 0.4, d: 1.4, color: rb, solid: false });
      b.push({ type: 'box', name: 'Ribbon H', x: gx, y: gw / 2, z: gz, w: 1.4, h: gw + 0.4, d: gw + 0.4, color: rb, solid: false });
    }
    // Frozen pond (slippery-looking decal) at center-east.
    b.push({ type: 'box', name: 'Ice Pond', x: 40, y: 0.05, z: 0, w: 30, h: 0.12, d: 24, color: '#bfe4f4', solid: false });
    // Candy canes arching by the plaza.
    for (const [cx, cz] of [[-20, 0], [20, 0], [0, -20], [0, 20]]) {
      b.push({ type: 'box', name: 'Cane', x: cx, y: 3, z: cz, w: 1.2, h: 6, d: 1.2, color: '#e8edf4' });
      b.push({ type: 'box', name: 'Cane Stripe', x: cx, y: 3, z: cz, w: 1.3, h: 1.2, d: 1.3, color: '#c23636', solid: false });
      b.push({ type: 'box', name: 'Cane Top', x: cx, y: 6.2, z: cz, w: 3, h: 1.2, d: 1.2, color: '#c23636' });
    }
    // Santa's big sled centerpiece you can climb on.
    b.push({ type: 'box', name: 'Sled', x: 0, y: 1.6, z: 0, w: 14, h: 3.2, d: 7, color: '#a02c2c' });
    b.push({ type: 'box', name: 'Sled Rail', x: 0, y: 0.4, z: 4, w: 16, h: 0.8, d: 1, color: '#d9a944' });
    b.push({ type: 'box', name: 'Sled Rail 2', x: 0, y: 0.4, z: -4, w: 16, h: 0.8, d: 1, color: '#d9a944' });
    // Ice-block perimeter walls.
    const H = 14;
    const T = 5;
    const half = 98;
    const span = half * 2 + T;
    b.push({ type: 'box', name: 'Ice Wall N', x: 0, y: H / 2, z: -half, w: span, h: H, d: T, color: '#9fc4dd' });
    b.push({ type: 'box', name: 'Ice Wall S', x: 0, y: H / 2, z: half, w: span, h: H, d: T, color: '#9fc4dd' });
    b.push({ type: 'box', name: 'Ice Wall W', x: -half, y: H / 2, z: 0, w: T, h: H, d: span, color: '#9fc4dd' });
    b.push({ type: 'box', name: 'Ice Wall E', x: half, y: H / 2, z: 0, w: T, h: H, d: span, color: '#9fc4dd' });
    return b;
  }

  const VERSUS_MAPS = [
    { name: 'Graveyard', build: makeVersusArena },
    { name: 'Sunny Backyard', build: makeVersusArenaGarden },
    { name: 'Christmas Village', build: makeVersusArenaChristmas }
  ];

  function applyStudioStats(project) {
    // Copy edited numeric stats onto the live definitions for this throwaway playtest.
    for (const key of Object.keys(project.zombies || {})) {
      if (ZOMBIE_DEFS[key]) {
        Object.assign(ZOMBIE_DEFS[key], project.zombies[key].stats);
      }
    }
    for (const key of Object.keys(project.weapons || {})) {
      if (WEAPON_DEFS[key]) {
        Object.assign(WEAPON_DEFS[key], project.weapons[key].stats);
      }
    }
  }

  const ZOMBIE_STAT_FIELDS = ['health', 'walkSpeed', 'meleeDamage', 'meleeRange', 'attackCooldown', 'renderScale', 'cost', 'intro', 'weight', 'armor'];
  const WEAPON_STAT_FIELDS = ['damage', 'cooldown', 'speed', 'spread', 'pellets', 'knockback', 'range', 'swingTime', 'gravity', 'life', 'radius'];

  const STUDIO_EVENTS = {
    onStart: 'the game starts',
    onWaveStart: 'a wave starts',
    onWaveCleared: 'a wave is cleared',
    onZombieKilled: 'an enemy dies',
    onPlayerSpawn: 'you spawn',
    onPlayerHurt: 'you take damage',
    everySecond: 'every second',
    every5Seconds: 'every 5 seconds'
  };
  const STUDIO_ACTIONS = {
    message: { label: 'Show message', param: 'text', default: 'Hello!', group: 'UI' },
    setObjective: { label: 'Set objective', param: 'text', default: 'Survive!', group: 'UI' },
    giveWeapon: { label: 'Give weapon', param: 'weapon', group: 'Player' },
    giveAllWeapons: { label: 'Give all weapons', param: 'none', group: 'Player' },
    setPlayerSpeed: { label: 'Set your speed ×', param: 'number', defaultNum: 1.5, group: 'Player' },
    setJumpPower: { label: 'Set your jump ×', param: 'number', defaultNum: 1.6, group: 'Player' },
    setGravity: { label: 'Set gravity ×', param: 'number', defaultNum: 1, group: 'Player' },
    setDamage: { label: 'Set your damage ×', param: 'number', defaultNum: 2, group: 'Player' },
    setHealth: { label: 'Set your max HP', param: 'number', defaultNum: 150, group: 'Player' },
    healToFull: { label: 'Heal to full', param: 'none', group: 'Player' },
    invincible: { label: 'Invincible', param: 'toggle', defaultNum: 1, group: 'Player' },
    teleportToSpawn: { label: 'Teleport me to spawn', param: 'none', group: 'Player' },
    spawnZombie: { label: 'Spawn enemy', param: 'zombie', defaultNum: 1, group: 'Enemies' },
    spawnAtPlayer: { label: 'Spawn enemy on me', param: 'zombie', defaultNum: 1, group: 'Enemies' },
    clearEnemies: { label: 'Clear all enemies', param: 'none', group: 'Enemies' },
    freezeEnemies: { label: 'Freeze enemies', param: 'toggle', defaultNum: 1, group: 'Enemies' },
    knockbackEnemies: { label: 'Knock back enemies', param: 'none', group: 'Enemies' },
    addGold: { label: 'Add gold', param: 'number', defaultNum: 25, group: 'Game' },
    addScore: { label: 'Add score', param: 'number', defaultNum: 1, group: 'Game' },
    win: { label: 'Win the game', param: 'none', group: 'Game' }
  };

  function seedStudioProject() {
    const zombies = {};
    for (const key of Object.keys(ZOMBIE_DEFS)) {
      const def = ZOMBIE_DEFS[key];
      const stats = {};
      for (const field of ZOMBIE_STAT_FIELDS) {
        if (def[field] !== undefined) {
          stats[field] = def[field];
        }
      }
      zombies[key] = {
        key,
        name: def.name,
        stats,
        model: makeHumanoidModel(getZombieBodyColors(key))
      };
    }
    const weapons = {};
    for (const key of Object.keys(WEAPON_DEFS)) {
      const def = WEAPON_DEFS[key];
      const stats = {};
      for (const field of WEAPON_STAT_FIELDS) {
        if (def[field] !== undefined) {
          stats[field] = def[field];
        }
      }
      weapons[key] = {
        key,
        name: def.name,
        kind: def.kind,
        stats,
        model: makeWeaponModel(def.color)
      };
    }
    const world = buildZombieWorld();
    const map = (world.blocks || []).map((b) => ({ ...b, name: 'Block' }));
    return {
      name: 'Zombie Survival (Copy)',
      zombies,
      weapons,
      map,
      avatars: {
        noob: { key: 'noob', name: 'Noob', model: makeAvatarModel(), startWeapon: '' }
      },
      defaultAvatar: 'noob',
      scripts: [],
      rules: { mode: 'waves', waveEnemy: 'mix', waveSize: 1, playerMaxHp: 100, startGold: 0 }
    };
  }

  function migrateStudioProject(project) {
    if (!project.avatars) {
      const model = project.avatar ? project.avatar.model : makeAvatarModel();
      const name = project.avatar ? project.avatar.name : 'Noob';
      project.avatars = { noob: { key: 'noob', name, model, startWeapon: '' } };
      project.defaultAvatar = 'noob';
    }
    if (!project.defaultAvatar || !project.avatars[project.defaultAvatar]) {
      project.defaultAvatar = Object.keys(project.avatars)[0];
    }
    if (!project.scripts) project.scripts = [];
    if (!project.rules) project.rules = { mode: 'waves', waveEnemy: 'mix', waveSize: 1, playerMaxHp: 100, startGold: 0 };
    return project;
  }

  class OrbitCamera {
    constructor() {
      this.yaw = 0.7;
      this.pitch = 0.35;
      this.distance = 12;
      this.target = v3(0, 3, 0);
    }

    matrix(width, height) {
      const cp = Math.cos(this.pitch);
      const eye = v3(
        this.target.x + Math.sin(this.yaw) * cp * this.distance,
        this.target.y + Math.sin(this.pitch) * this.distance,
        this.target.z + Math.cos(this.yaw) * cp * this.distance
      );
      this.eye = eye;
      const projection = mat4Perspective(degToRad(55), width / height, 0.1, 600);
      const view = mat4LookAt(eye, this.target, v3(0, 1, 0));
      return mat4Multiply(projection, view);
    }
  }

  class Studio {
    constructor(elements) {
      this.dom = elements;
      this.root = elements.studioScreen;
      this.project = seedStudioProject();
      this.tab = 'zombies';
      this.selectedZombie = Object.keys(this.project.zombies)[0];
      this.selectedWeapon = Object.keys(this.project.weapons)[0];
      this.selectedAvatar = Object.keys(this.project.avatars)[0];
      this.selectedShapeIndex = 0;
      this.selectedScript = 0;
      this.snap = false;
      this.running = false;
      this.autoRotate = true;
      this.camera = new OrbitCamera();
      this.drag = { active: false, x: 0, y: 0, mode: 'orbit' };
      this.test = null;
      this.built = false;
      this.keys = new Set();
    }

    open() {
      if (!this.built) {
        this.buildUi();
        this.built = true;
      }
      this.root.classList.remove('hidden');
      if (!this.renderer) {
        try {
          this.renderer = new Renderer(this.canvas);
          this.renderer.setLighting({
            clear: [0.62, 0.66, 0.72],
            fog: [0.62, 0.66, 0.72],
            fogNear: 200,
            fogFar: 600,
            lightDir: [0.5, 1.0, 0.6],
            ambient: 0.62,
            diffuse: 0.5,
            tint: [1.0, 1.0, 1.0]
          });
          this.renderer.setStaticWorld({ solid: createTriBuilder(), transparent: createTriBuilder(), lines: createLineBuilder() });
        } catch (error) {
          this.canvas.replaceWith(Object.assign(document.createElement('div'), { textContent: 'WebGL preview unavailable.', className: 'studio-noweb' }));
        }
      }
      this.resize();
      this.selectTab('zombies');
      this.running = true;
      requestAnimationFrame(() => this.frame());
    }

    close() {
      this.running = false;
      this.test = null;
      this.root.classList.add('hidden');
      this.dom.bootActions.classList.remove('hidden');
      this.dom.loadingScreen.classList.remove('hidden');
    }

    setGame(gameKind) {
      this.gameKind = gameKind || 'zombie';
      if (this.project.gameKind === this.gameKind) {
        return;
      }
      this.project.gameKind = this.gameKind;
      if (this.gameKind === 'crossroads') {
        this.project.map = makeCrossroadsMap().map((b) => ({ ...b, name: b.name || 'Block' }));
        this.project.name = 'Crossroads (Copy)';
      } else {
        const world = buildZombieWorld();
        this.project.map = (world.blocks || []).map((b) => ({ ...b, name: 'Block' }));
        this.project.name = 'Zombie Survival (Copy)';
      }
      this.selectedShapeIndex = 0;
      if (this.projectLabel) {
        this.projectLabel.textContent = this.project.name;
      }
    }

    enterGame() {
      if (game) {
        return;
      }
      applyStudioStats(this.project);
      activeStudioProject = this.project;
      this.running = false;
      this.test = null;
      this.root.classList.add('hidden');
      launchSession('solo', {
        worldBlocks: this.project.map,
        studioProject: this.project,
        crossroads: this.gameKind === 'crossroads'
      });
    }

    buildUi() {
      const el = (tag, cls, text) => {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined) node.textContent = text;
        return node;
      };
      this.root.textContent = '';

      // Top bar
      const top = el('div', 'studio-topbar');
      top.appendChild(el('div', 'studio-logo', 'STUDIO'));
      this.projectLabel = el('div', 'studio-project', this.project.name);
      top.appendChild(this.projectLabel);
      const tabs = el('div', 'studio-tabs');
      this.tabButtons = {};
      for (const [key, label] of [['zombies', 'Zombies'], ['weapons', 'Weapons'], ['avatar', 'Avatar'], ['map', 'Map'], ['rules', 'Rules'], ['code', 'Code'], ['test', 'Test']]) {
        const b = el('button', 'studio-tab chrome-button', label);
        b.addEventListener('click', () => this.selectTab(key));
        tabs.appendChild(b);
        this.tabButtons[key] = b;
      }
      top.appendChild(tabs);
      const actions = el('div', 'studio-actions');
      const saveBtn = el('button', 'chrome-button', 'Save');
      saveBtn.addEventListener('click', () => this.saveProject());
      const loadBtn = el('button', 'chrome-button', 'Load');
      loadBtn.addEventListener('click', () => this.openLoadDialog());
      const exitBtn = el('button', 'chrome-button', 'Exit');
      exitBtn.addEventListener('click', () => this.close());
      actions.append(saveBtn, loadBtn, exitBtn);
      top.appendChild(actions);
      this.root.appendChild(top);

      // Body
      const body = el('div', 'studio-body');
      this.leftPanel = el('div', 'studio-left');
      const center = el('div', 'studio-center');
      this.canvas = el('canvas', 'studio-canvas');
      center.appendChild(this.canvas);
      this.centerHint = el('div', 'studio-hint', 'Drag to orbit • scroll to zoom');
      center.appendChild(this.centerHint);
      this.codeOverlay = el('div', 'studio-code-overlay hidden');
      center.appendChild(this.codeOverlay);
      this.rightPanel = el('div', 'studio-right');
      body.append(this.leftPanel, center, this.rightPanel);
      this.root.appendChild(body);

      this.loadDialog = el('div', 'studio-dialog hidden');
      this.root.appendChild(this.loadDialog);

      this.bindCanvas();
      window.addEventListener('resize', () => { if (this.running) this.resize(); });
      window.addEventListener('keydown', (e) => {
        if (!this.running) return;
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
          return;
        }
        // Arrow keys nudge the selected shape in the model/map/avatar editors.
        if (this.tab !== 'test' && this.tab !== 'code') {
          const model = this.activeModel();
          const shape = model && model[this.selectedShapeIndex];
          if (shape && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(e.key)) {
            e.preventDefault();
            const amt = this.snap ? 0.5 : 0.25;
            if (e.key === 'ArrowLeft') shape.x -= amt;
            else if (e.key === 'ArrowRight') shape.x += amt;
            else if (e.key === 'ArrowUp') shape.z -= amt;
            else if (e.key === 'ArrowDown') shape.z += amt;
            else if (e.key === 'PageUp') shape.y += amt;
            else if (e.key === 'PageDown') shape.y -= amt;
            this.renderRightPanel();
            return;
          }
        }
        this.keys.add(e.key.toLowerCase());
        if (e.key === ' ') e.preventDefault();
      });
      window.addEventListener('keyup', (e) => { this.keys.delete(e.key.toLowerCase()); });
    }

    bindCanvas() {
      this.canvas.addEventListener('mousedown', (e) => {
        this.drag.active = true;
        this.drag.x = e.clientX;
        this.drag.y = e.clientY;
        this.autoRotate = false;
        if (this.tab === 'test') this.onTestClick();
      });
      window.addEventListener('mouseup', () => { this.drag.active = false; });
      window.addEventListener('mousemove', (e) => {
        if (!this.drag.active) return;
        const dx = e.clientX - this.drag.x;
        const dy = e.clientY - this.drag.y;
        this.drag.x = e.clientX;
        this.drag.y = e.clientY;
        if (this.tab === 'test' && this.test) {
          this.test.yaw -= dx * 0.006;
          this.test.pitch = clamp(this.test.pitch + dy * 0.006, -1.2, 1.2);
        } else {
          this.camera.yaw -= dx * 0.01;
          this.camera.pitch = clamp(this.camera.pitch + dy * 0.01, -1.3, 1.3);
        }
      });
      this.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.camera.distance = clamp(this.camera.distance + Math.sign(e.deltaY) * 1.5, 2, 320);
      }, { passive: false });
    }

    resize() {
      if (!this.canvas || !this.renderer) return;
      const rect = this.canvas.getBoundingClientRect();
      const w = Math.max(2, Math.floor(rect.width));
      const h = Math.max(2, Math.floor(rect.height));
      this.renderer.resize(w, h);
    }

    selectTab(tab) {
      this.tab = tab;
      for (const key of Object.keys(this.tabButtons)) {
        this.tabButtons[key].classList.toggle('active', key === tab);
      }
      if (this.codeOverlay) {
        this.codeOverlay.classList.toggle('hidden', tab !== 'code');
      }
      this.selectedShapeIndex = 0;
      if (tab === 'test') {
        this.startTest();
      } else {
        this.test = null;
        this.autoRotate = tab !== 'code';
        if (tab === 'zombies' || tab === 'avatar') this.camera.target = v3(0, 3, 0);
        else if (tab === 'weapons') this.camera.target = v3(0, 0, 0.4);
        else if (tab === 'map') this.camera.target = v3(0, 8, 0);
        this.camera.distance = tab === 'map' ? 160 : tab === 'weapons' ? 6 : 12;
      }
      this.renderPanels();
    }

    activeModel() {
      if (this.tab === 'zombies') return this.project.zombies[this.selectedZombie].model;
      if (this.tab === 'weapons') return this.project.weapons[this.selectedWeapon].model;
      if (this.tab === 'avatar') return this.project.avatars[this.selectedAvatar].model;
      if (this.tab === 'map') return this.project.map;
      return null;
    }

    activeItem() {
      if (this.tab === 'zombies') return this.project.zombies[this.selectedZombie];
      if (this.tab === 'weapons') return this.project.weapons[this.selectedWeapon];
      return null;
    }

    el(tag, cls, text) {
      const node = document.createElement(tag);
      if (cls) node.className = cls;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    renderPanels() {
      this.leftPanel.textContent = '';
      this.rightPanel.textContent = '';
      if (this.tab === 'test') {
        this.renderTestPanel();
        return;
      }
      if (this.tab === 'code') {
        this.renderCodePanel();
        return;
      }
      if (this.tab === 'rules') {
        this.renderRulesPanel();
        return;
      }
      if (this.tab === 'zombies' || this.tab === 'weapons') {
        this.renderItemPicker();
      }
      if (this.tab === 'avatar') {
        this.renderAvatarHeader();
      }
      if (this.tab === 'map') {
        this.renderMapHeader();
      }
      this.renderShapeList();
      this.renderRightPanel();
    }

    renderAvatarHeader() {
      const avatars = this.project.avatars;
      if (!avatars[this.selectedAvatar]) {
        this.selectedAvatar = Object.keys(avatars)[0];
      }
      const current = avatars[this.selectedAvatar];
      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', 'Avatar Classes'));
      wrap.appendChild(this.el('div', 'studio-sub', 'Make as many player classes as you like. The default class is your player in Enter Game / Test.'));

      const select = this.el('select', 'studio-select');
      for (const key of Object.keys(avatars)) {
        const opt = this.el('option', null, avatars[key].name + (key === this.project.defaultAvatar ? ' ★' : ''));
        opt.value = key;
        select.appendChild(opt);
      }
      select.value = this.selectedAvatar;
      select.addEventListener('change', () => { this.selectedAvatar = select.value; this.selectedShapeIndex = 0; this.renderPanels(); });
      wrap.appendChild(select);

      wrap.appendChild(this.el('label', 'studio-label', 'Class name'));
      const nameInput = this.el('input', 'studio-input');
      nameInput.value = current.name || 'Class';
      nameInput.addEventListener('input', () => { current.name = nameInput.value; select.options[select.selectedIndex].textContent = nameInput.value; });
      wrap.appendChild(nameInput);

      wrap.appendChild(this.el('label', 'studio-label', 'Start weapon'));
      const wSel = this.el('select', 'studio-select');
      wSel.appendChild(Object.assign(document.createElement('option'), { value: '', textContent: '(default pistol)' }));
      for (const key of Object.keys(this.project.weapons)) {
        const opt = this.el('option', null, this.project.weapons[key].name);
        opt.value = key;
        wSel.appendChild(opt);
      }
      wSel.value = current.startWeapon || '';
      wSel.addEventListener('change', () => { current.startWeapon = wSel.value; });
      wrap.appendChild(wSel);

      const setDefault = this.el('button', 'chrome-button studio-wide', current.key === this.project.defaultAvatar ? '★ Default player class' : 'Set as default player class');
      setDefault.addEventListener('click', () => { this.project.defaultAvatar = this.selectedAvatar; this.renderPanels(); });
      wrap.appendChild(setDefault);

      const newBtn = this.el('button', 'chrome-button studio-wide', '+ New Class (copy of this)');
      newBtn.addEventListener('click', () => {
        const key = 'class-' + makeId(5);
        avatars[key] = JSON.parse(JSON.stringify(current));
        avatars[key].key = key;
        avatars[key].name = current.name + ' Copy';
        this.selectedAvatar = key;
        this.selectedShapeIndex = 0;
        this.renderPanels();
      });
      wrap.appendChild(newBtn);

      if (Object.keys(avatars).length > 1) {
        const del = this.el('button', 'chrome-button studio-wide', 'Delete this class');
        del.addEventListener('click', () => {
          delete avatars[this.selectedAvatar];
          if (this.project.defaultAvatar === this.selectedAvatar) this.project.defaultAvatar = Object.keys(avatars)[0];
          this.selectedAvatar = Object.keys(avatars)[0];
          this.selectedShapeIndex = 0;
          this.renderPanels();
        });
        wrap.appendChild(del);
      }
      this.leftPanel.appendChild(wrap);
    }

    renderMapHeader() {
      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', 'Map Preset'));
      const row = this.el('div', 'studio-btn-row');
      const base = this.el('button', 'chrome-button', 'Baseplate');
      base.addEventListener('click', () => {
        this.project.map = makeBaseplateMap();
        this.selectedShapeIndex = 0;
        this.renderPanels();
        this.setHint('Map reset to an empty baseplate.');
      });
      const full = this.el('button', 'chrome-button', 'Zombie Map');
      full.addEventListener('click', () => {
        const world = buildZombieWorld();
        this.project.map = (world.blocks || []).map((b) => ({ ...b, name: 'Block' }));
        this.selectedShapeIndex = 0;
        this.renderPanels();
        this.setHint('Restored the full zombie map.');
      });
      row.append(base, full);
      wrap.appendChild(row);
      this.leftPanel.appendChild(wrap);
    }

    renderRulesPanel() {
      if (!this.project.rules) {
        this.project.rules = { mode: 'waves', waveEnemy: 'mix', waveSize: 1, playerMaxHp: 100, startGold: 0 };
      }
      const rules = this.project.rules;
      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', 'Game Rules'));
      wrap.appendChild(this.el('div', 'studio-sub', 'Change how the game plays — from endless waves to a pure bot-summoning sandbox you drive with Code.'));

      wrap.appendChild(this.el('label', 'studio-label', 'Mode'));
      const mode = this.el('select', 'studio-select');
      for (const [v, t] of [['waves', 'Waves — auto enemy waves'], ['summon', 'Summon — no auto waves (use Code)']]) {
        const o = this.el('option', null, t);
        o.value = v;
        mode.appendChild(o);
      }
      mode.value = rules.mode || 'waves';
      mode.addEventListener('change', () => { rules.mode = mode.value; });
      wrap.appendChild(mode);

      wrap.appendChild(this.el('label', 'studio-label', 'Wave enemy'));
      const enemy = this.el('select', 'studio-select');
      enemy.appendChild(Object.assign(document.createElement('option'), { value: 'mix', textContent: 'Mixed horde (default)' }));
      for (const key of Object.keys(this.project.zombies)) {
        const o = this.el('option', null, 'Only ' + this.project.zombies[key].name);
        o.value = key;
        enemy.appendChild(o);
      }
      enemy.value = rules.waveEnemy || 'mix';
      enemy.addEventListener('change', () => { rules.waveEnemy = enemy.value; });
      wrap.appendChild(enemy);

      wrap.appendChild(this.numberField('Wave size ×', rules, 'waveSize', 0.1));
      wrap.appendChild(this.numberField('Player max HP', rules, 'playerMaxHp', 5));
      wrap.appendChild(this.numberField('Starting gold', rules, 'startGold', 5));
      this.leftPanel.appendChild(wrap);
    }

    renderCodePanel() {
      if (!this.project.scripts) this.project.scripts = [];
      const scripts = this.project.scripts;
      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', 'Scripts'));
      wrap.appendChild(this.el('div', 'studio-sub', 'Drag-free blocks: pick an event, then stack actions. Runs in Test and Enter Game.'));
      const addBtn = this.el('button', 'chrome-button studio-wide', '+ New Script');
      addBtn.addEventListener('click', () => {
        scripts.push({ event: 'onStart', actions: [] });
        this.selectedScript = scripts.length - 1;
        this.renderCodePanel();
      });
      wrap.appendChild(addBtn);
      const list = this.el('div', 'studio-list');
      scripts.forEach((script, i) => {
        const row = this.el('div', `studio-list-row${i === this.selectedScript ? ' active' : ''}`);
        const name = this.el('span', 'studio-list-name', STUDIO_EVENTS[script.event] || script.event);
        name.addEventListener('click', () => { this.selectedScript = i; this.renderCodePanel(); });
        const del = this.el('button', 'studio-mini', '✕');
        del.addEventListener('click', () => { scripts.splice(i, 1); this.selectedScript = 0; this.renderCodePanel(); });
        row.append(name, del);
        list.appendChild(row);
      });
      wrap.appendChild(list);
      this.leftPanel.textContent = '';
      this.leftPanel.appendChild(wrap);

      // Center overlay: block stack for the selected script.
      this.codeOverlay.textContent = '';
      const script = scripts[this.selectedScript || 0];
      if (!script) {
        this.codeOverlay.appendChild(this.el('div', 'studio-code-empty', 'Add a script to start building with blocks.'));
        return;
      }
      const stack = this.el('div', 'studio-block-stack');
      // Event (hat) block
      const hat = this.el('div', 'studio-block block-event');
      hat.appendChild(this.el('span', null, 'When '));
      const evSelect = this.el('select', 'block-select');
      for (const key of Object.keys(STUDIO_EVENTS)) {
        const opt = this.el('option', null, STUDIO_EVENTS[key]);
        opt.value = key;
        evSelect.appendChild(opt);
      }
      evSelect.value = script.event;
      evSelect.addEventListener('change', () => { script.event = evSelect.value; this.renderCodePanel(); });
      hat.appendChild(evSelect);
      stack.appendChild(hat);

      script.actions.forEach((action, ai) => {
        stack.appendChild(this.buildActionBlock(script, action, ai));
      });

      const addAction = this.el('div', 'studio-block block-add');
      const addSelect = this.el('select', 'block-select');
      addSelect.appendChild(Object.assign(document.createElement('option'), { value: '', textContent: '+ add action…' }));
      const groups = {};
      for (const key of Object.keys(STUDIO_ACTIONS)) {
        const g = STUDIO_ACTIONS[key].group || 'Other';
        (groups[g] = groups[g] || []).push(key);
      }
      for (const g of Object.keys(groups)) {
        const og = document.createElement('optgroup');
        og.label = g;
        for (const key of groups[g]) {
          const opt = this.el('option', null, STUDIO_ACTIONS[key].label);
          opt.value = key;
          og.appendChild(opt);
        }
        addSelect.appendChild(og);
      }
      addSelect.addEventListener('change', () => {
        if (!addSelect.value) return;
        script.actions.push({ type: addSelect.value, value: STUDIO_ACTIONS[addSelect.value].default || '', num: STUDIO_ACTIONS[addSelect.value].defaultNum || 1 });
        this.renderCodePanel();
      });
      addAction.appendChild(addSelect);
      stack.appendChild(addAction);
      this.codeOverlay.appendChild(stack);
    }

    buildActionBlock(script, action, index) {
      const def = STUDIO_ACTIONS[action.type] || { label: action.type, param: 'none' };
      const block = this.el('div', 'studio-block block-action');
      block.appendChild(this.el('span', null, def.label));
      if (def.param === 'text') {
        const input = this.el('input', 'block-input');
        input.value = action.value || '';
        input.addEventListener('input', () => { action.value = input.value; });
        block.appendChild(input);
      } else if (def.param === 'number') {
        const input = this.el('input', 'block-input block-num');
        input.type = 'number';
        input.value = action.num !== undefined ? action.num : 1;
        input.addEventListener('input', () => { action.num = parseFloat(input.value) || 0; });
        block.appendChild(input);
      } else if (def.param === 'toggle') {
        const wrap = this.el('label', 'block-toggle');
        const cb = this.el('input');
        cb.type = 'checkbox';
        cb.checked = (action.num || 0) > 0;
        cb.addEventListener('change', () => { action.num = cb.checked ? 1 : 0; });
        wrap.append(cb, this.el('span', null, ' on'));
        block.appendChild(wrap);
      } else if (def.param === 'weapon') {
        const sel = this.el('select', 'block-select');
        for (const key of Object.keys(this.project.weapons)) {
          const opt = this.el('option', null, this.project.weapons[key].name);
          opt.value = key;
          sel.appendChild(opt);
        }
        sel.value = action.value || Object.keys(this.project.weapons)[0];
        action.value = sel.value;
        sel.addEventListener('change', () => { action.value = sel.value; });
        block.appendChild(sel);
      } else if (def.param === 'zombie') {
        const sel = this.el('select', 'block-select');
        for (const key of Object.keys(this.project.zombies)) {
          const opt = this.el('option', null, this.project.zombies[key].name);
          opt.value = key;
          sel.appendChild(opt);
        }
        sel.value = action.value || Object.keys(this.project.zombies)[0];
        action.value = sel.value;
        sel.addEventListener('change', () => { action.value = sel.value; });
        block.appendChild(sel);
        const count = this.el('input', 'block-input block-num');
        count.type = 'number';
        count.value = action.num || 1;
        count.addEventListener('input', () => { action.num = parseFloat(count.value) || 1; });
        block.append(this.el('span', null, '×'), count);
      }
      const del = this.el('button', 'block-del', '✕');
      del.addEventListener('click', () => { script.actions.splice(index, 1); this.renderCodePanel(); });
      block.appendChild(del);
      return block;
    }

    renderItemPicker() {
      const isZombie = this.tab === 'zombies';
      const items = isZombie ? this.project.zombies : this.project.weapons;
      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', isZombie ? 'Zombie' : 'Weapon'));
      const select = this.el('select', 'studio-select');
      for (const key of Object.keys(items)) {
        const opt = this.el('option', null, items[key].name);
        opt.value = key;
        select.appendChild(opt);
      }
      select.value = isZombie ? this.selectedZombie : this.selectedWeapon;
      select.addEventListener('change', () => {
        if (isZombie) this.selectedZombie = select.value;
        else this.selectedWeapon = select.value;
        this.selectedShapeIndex = 0;
        this.renderPanels();
      });
      wrap.appendChild(select);

      const row = this.el('div', 'studio-btn-row');
      const nameInput = this.el('input', 'studio-input');
      nameInput.value = this.activeItem().name;
      nameInput.addEventListener('input', () => {
        this.activeItem().name = nameInput.value;
        select.options[select.selectedIndex].textContent = nameInput.value;
      });
      wrap.appendChild(this.el('label', 'studio-label', 'Name'));
      wrap.appendChild(nameInput);

      const newBtn = this.el('button', 'chrome-button studio-wide', '+ New (copy of this)');
      newBtn.addEventListener('click', () => this.createNewItem());
      wrap.appendChild(newBtn);
      this.leftPanel.appendChild(wrap);
    }

    createNewItem() {
      const isZombie = this.tab === 'zombies';
      const src = this.activeItem();
      const newKey = `custom-${makeId(5)}`;
      const copy = JSON.parse(JSON.stringify(src));
      copy.key = newKey;
      copy.name = `${src.name} Copy`;
      if (isZombie) {
        this.project.zombies[newKey] = copy;
        this.selectedZombie = newKey;
      } else {
        this.project.weapons[newKey] = copy;
        this.selectedWeapon = newKey;
      }
      this.selectedShapeIndex = 0;
      this.renderPanels();
    }

    renderShapeList() {
      const model = this.activeModel();
      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', this.tab === 'map' ? 'Map Blocks' : 'Model Shapes'));

      const addRow = this.el('div', 'studio-btn-row');
      for (const [type, label] of [['box', '+ Box'], ['sphere', '+ Sphere'], ['cylinder', '+ Cylinder']]) {
        const b = this.el('button', 'chrome-button', label);
        b.addEventListener('click', () => this.addShape(type));
        addRow.appendChild(b);
      }
      wrap.appendChild(addRow);

      const list = this.el('div', 'studio-list');
      model.forEach((shape, index) => {
        const row = this.el('div', `studio-list-row${index === this.selectedShapeIndex ? ' active' : ''}`);
        const label = this.el('span', 'studio-list-name', `${shape.name || shape.type} (${shape.type})`);
        label.addEventListener('click', () => { this.selectedShapeIndex = index; this.renderPanels(); });
        row.appendChild(label);
        const dup = this.el('button', 'studio-mini', '⧉');
        dup.title = 'Duplicate';
        dup.addEventListener('click', () => this.duplicateShape(index));
        const del = this.el('button', 'studio-mini', '✕');
        del.title = 'Delete';
        del.addEventListener('click', () => this.deleteShape(index));
        row.append(dup, del);
        list.appendChild(row);
      });
      wrap.appendChild(list);
      this.leftPanel.appendChild(wrap);
    }

    addShape(type) {
      const model = this.activeModel();
      const t = this.camera.target;
      const shape = { type, name: type.charAt(0).toUpperCase() + type.slice(1), x: Math.round(t.x), y: Math.round(t.y), z: Math.round(t.z), rx: 0, ry: 0, rz: 0, color: '#cf5555' };
      if (type === 'box') { shape.w = 1; shape.h = 1; shape.d = 1; }
      else if (type === 'sphere') { shape.r = 0.8; }
      else if (type === 'cylinder') { shape.r = 0.6; shape.h = 1.4; }
      model.push(shape);
      this.selectedShapeIndex = model.length - 1;
      this.renderPanels();
    }

    duplicateShape(index) {
      const model = this.activeModel();
      const copy = JSON.parse(JSON.stringify(model[index]));
      copy.x += 1;
      model.splice(index + 1, 0, copy);
      this.selectedShapeIndex = index + 1;
      this.renderPanels();
    }

    deleteShape(index) {
      const model = this.activeModel();
      if (model.length <= 1 && this.tab !== 'map') {
        this.setHint('A model needs at least one shape.');
        return;
      }
      model.splice(index, 1);
      this.selectedShapeIndex = Math.max(0, Math.min(this.selectedShapeIndex, model.length - 1));
      this.renderPanels();
    }

    renderRightPanel() {
      this.rightPanel.textContent = '';
      const model = this.activeModel();
      const shape = model[this.selectedShapeIndex];
      if (shape) {
        this.rightPanel.appendChild(this.buildShapeEditor(shape));
      }
      const item = this.activeItem();
      if (item) {
        this.rightPanel.appendChild(this.buildStatsEditor(item));
      }
    }

    numberField(label, obj, key, step = 0.1, nudge = false) {
      const wrap = this.el('div', 'studio-field');
      wrap.appendChild(this.el('label', 'studio-label', label));
      const row = this.el('div', 'studio-num-row');
      const input = this.el('input', 'studio-input');
      input.type = 'number';
      input.step = String(step);
      input.value = obj[key] !== undefined ? obj[key] : 0;
      input.addEventListener('input', () => {
        const v = parseFloat(input.value);
        obj[key] = Number.isFinite(v) ? v : 0;
      });
      if (nudge) {
        const amount = this.snap ? 0.5 : step * 5;
        const minus = this.el('button', 'studio-mini', '–');
        const plus = this.el('button', 'studio-mini', '+');
        const bump = (dir) => {
          const cur = Number.isFinite(obj[key]) ? obj[key] : 0;
          obj[key] = Math.round((cur + dir * amount) * 1000) / 1000;
          input.value = obj[key];
        };
        minus.addEventListener('click', () => bump(-1));
        plus.addEventListener('click', () => bump(1));
        row.append(minus, input, plus);
      } else {
        row.appendChild(input);
      }
      wrap.appendChild(row);
      return wrap;
    }

    buildShapeEditor(shape) {
      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', 'Shape'));

      const nameField = this.el('div', 'studio-field');
      nameField.appendChild(this.el('label', 'studio-label', 'Part name'));
      const nameInput = this.el('input', 'studio-input');
      nameInput.value = shape.name || shape.type;
      nameInput.addEventListener('input', () => { shape.name = nameInput.value; });
      nameField.appendChild(nameInput);
      wrap.appendChild(nameField);

      // Snap toggle
      const snapRow = this.el('label', 'studio-snap');
      const snapCb = this.el('input');
      snapCb.type = 'checkbox';
      snapCb.checked = Boolean(this.snap);
      snapCb.addEventListener('change', () => { this.snap = snapCb.checked; this.renderPanels(); });
      snapRow.append(snapCb, this.el('span', null, ' Snap to grid (arrow keys nudge selected)'));
      wrap.appendChild(snapRow);

      const posGrid = this.el('div', 'studio-grid3');
      posGrid.append(this.numberField('X', shape, 'x', 0.1, true), this.numberField('Y', shape, 'y', 0.1, true), this.numberField('Z', shape, 'z', 0.1, true));
      wrap.appendChild(this.el('div', 'studio-sub', 'Position'));
      wrap.appendChild(posGrid);

      wrap.appendChild(this.el('div', 'studio-sub', 'Size'));
      const sizeGrid = this.el('div', 'studio-grid3');
      if (shape.type === 'box') {
        sizeGrid.append(this.numberField('W', shape, 'w', 0.1, true), this.numberField('H', shape, 'h', 0.1, true), this.numberField('D', shape, 'd', 0.1, true));
      } else if (shape.type === 'sphere') {
        sizeGrid.append(this.numberField('Radius', shape, 'r', 0.1, true));
      } else {
        sizeGrid.append(this.numberField('Radius', shape, 'r', 0.1, true), this.numberField('Height', shape, 'h', 0.1, true));
      }
      wrap.appendChild(sizeGrid);

      wrap.appendChild(this.el('div', 'studio-sub', 'Rotation (radians)'));
      const rotGrid = this.el('div', 'studio-grid3');
      rotGrid.append(this.numberField('RX', shape, 'rx', 0.05, true), this.numberField('RY', shape, 'ry', 0.05, true), this.numberField('RZ', shape, 'rz', 0.05, true));
      wrap.appendChild(rotGrid);

      const colorField = this.el('div', 'studio-field');
      colorField.appendChild(this.el('label', 'studio-label', 'Color'));
      const colorInput = this.el('input', 'studio-color');
      colorInput.type = 'color';
      colorInput.value = shape.color || '#cccccc';
      colorInput.addEventListener('input', () => { shape.color = colorInput.value; });
      colorField.appendChild(colorInput);
      const swatches = this.el('div', 'studio-swatches');
      for (const hex of ['#e6e6e6', '#111111', '#d24b4b', '#e0a53f', '#f5cd30', '#4b974b', '#2f5fb0', '#7a4fd0', '#6e4a2a', '#58b654']) {
        const sw = this.el('button', 'studio-swatch');
        sw.style.background = hex;
        sw.addEventListener('click', () => { shape.color = hex; colorInput.value = hex; });
        swatches.appendChild(sw);
      }
      colorField.appendChild(swatches);
      wrap.appendChild(colorField);
      return wrap;
    }

    buildStatsEditor(item) {
      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', 'Stats (numbers only)'));
      for (const key of Object.keys(item.stats)) {
        wrap.appendChild(this.numberField(key, item.stats, key, 0.1));
      }
      return wrap;
    }

    renderTestPanel() {
      const play = this.el('div', 'studio-section');
      play.appendChild(this.el('div', 'studio-section-title', 'Play'));
      const enter = this.el('button', 'chrome-button studio-wide studio-enter', '▶ Enter Game (real play)');
      enter.addEventListener('click', () => this.enterGame());
      play.appendChild(enter);
      play.appendChild(this.el('div', 'studio-sub', 'Launches the full game using your edited map, stats, avatar, zombie models and scripts.'));
      this.leftPanel.appendChild(play);

      const wrap = this.el('div', 'studio-section');
      wrap.appendChild(this.el('div', 'studio-section-title', 'Quick Test'));
      wrap.appendChild(this.el('div', 'studio-sub', 'WASD move • Space up • C down • drag to look • click to shoot'));

      wrap.appendChild(this.el('label', 'studio-label', 'Spawn zombie'));
      const zSelect = this.el('select', 'studio-select');
      for (const key of Object.keys(this.project.zombies)) {
        const opt = this.el('option', null, this.project.zombies[key].name);
        opt.value = key;
        zSelect.appendChild(opt);
      }
      this.testZombieKey = this.testZombieKey || zSelect.value;
      zSelect.value = this.testZombieKey;
      zSelect.addEventListener('change', () => { this.testZombieKey = zSelect.value; });
      wrap.appendChild(zSelect);
      const spawnBtn = this.el('button', 'chrome-button studio-wide', 'Spawn 1');
      spawnBtn.addEventListener('click', () => this.spawnTestZombie(zSelect.value));
      wrap.appendChild(spawnBtn);
      const clearBtn = this.el('button', 'chrome-button studio-wide', 'Clear Zombies');
      clearBtn.addEventListener('click', () => { if (this.test) this.test.zombies = []; });
      wrap.appendChild(clearBtn);

      wrap.appendChild(this.el('label', 'studio-label', 'Test weapon'));
      const wSelect = this.el('select', 'studio-select');
      for (const key of Object.keys(this.project.weapons)) {
        const opt = this.el('option', null, this.project.weapons[key].name);
        opt.value = key;
        wSelect.appendChild(opt);
      }
      this.testWeaponKey = this.testWeaponKey || wSelect.value;
      wSelect.value = this.testWeaponKey;
      wSelect.addEventListener('change', () => { this.testWeaponKey = wSelect.value; });
      wrap.appendChild(wSelect);
      this.leftPanel.appendChild(wrap);
    }

    startTest() {
      this.test = { pos: v3(0, 4.5, -24), yaw: 0, pitch: 0, zombies: [], eye: v3() };
      this.testZombieKey = this.testZombieKey || Object.keys(this.project.zombies)[0];
      this.testWeaponKey = this.testWeaponKey || Object.keys(this.project.weapons)[0];
    }

    spawnTestZombie(key) {
      if (!this.test) return;
      const def = this.project.zombies[key];
      const angle = Math.random() * TAU;
      const pos = v3(this.test.pos.x + Math.sin(angle) * 26, 0, this.test.pos.z + Math.cos(angle) * 26);
      this.test.zombies.push({
        key,
        model: def.model,
        pos,
        yaw: 0,
        health: def.stats.health || 40,
        maxHealth: def.stats.health || 40,
        speed: def.stats.walkSpeed || 8
      });
    }

    updateTest() {
      const t = this.test;
      const dt = 1 / 60;
      const fwd = v3(-Math.sin(t.yaw), 0, Math.cos(t.yaw));
      const right = v3(Math.cos(t.yaw), 0, Math.sin(t.yaw));
      let mx = 0;
      let mz = 0;
      if (this.keys.has('w')) mz += 1;
      if (this.keys.has('s')) mz -= 1;
      if (this.keys.has('d')) mx += 1;
      if (this.keys.has('a')) mx -= 1;
      const move = vAdd(vScale(fwd, mz), vScale(right, mx));
      const len = Math.hypot(move.x, move.z);
      const speed = 22;
      if (len > 0.01) {
        t.pos.x += (move.x / len) * speed * dt;
        t.pos.z += (move.z / len) * speed * dt;
      }
      if (this.keys.has(' ')) t.pos.y += speed * dt;
      if (this.keys.has('c') || this.keys.has('shift')) t.pos.y -= speed * dt;
      t.pos.y = Math.max(1.5, t.pos.y);
      // Zombies shuffle toward the camera.
      for (const z of t.zombies) {
        const to = vSub(t.pos, z.pos);
        to.y = 0;
        const d = Math.hypot(to.x, to.z);
        if (d > 2.5) {
          z.pos.x += (to.x / d) * z.speed * 0.25 * dt;
          z.pos.z += (to.z / d) * z.speed * 0.25 * dt;
          z.yaw = Math.atan2(to.x, to.z);
        }
      }
    }

    onTestClick() {
      const t = this.test;
      if (!t) return;
      const weapon = this.project.weapons[this.testWeaponKey];
      const damage = (weapon && weapon.stats.damage) || (weapon && weapon.stats.knockback) || 20;
      const aim = getAimDirectionFromView(t.yaw, t.pitch);
      let bestZ = null;
      let bestDot = 0.985;
      for (const z of t.zombies) {
        const to = vSub(vAdd(z.pos, v3(0, 3, 0)), t.pos);
        const dist = Math.hypot(to.x, to.y, to.z);
        if (dist > 120) continue;
        const dot = vDot(vNormalize(to), aim);
        if (dot > bestDot) {
          bestDot = dot;
          bestZ = z;
        }
      }
      if (bestZ) {
        bestZ.health -= damage;
        if (bestZ.health <= 0) {
          t.zombies = t.zombies.filter((z) => z !== bestZ);
        }
      }
    }

    testCameraMatrix(w, h) {
      const t = this.test;
      const aim = getAimDirectionFromView(t.yaw, t.pitch);
      t.eye = vCopy(t.pos);
      const target = vAdd(t.pos, aim);
      const projection = mat4Perspective(degToRad(70), w / h, 0.1, 600);
      const view = mat4LookAt(t.eye, target, v3(0, 1, 0));
      return mat4Multiply(projection, view);
    }

    buildModelAt(shapes, tri, line, pos, yaw) {
      for (const s of shapes) {
        const local = v3(s.x || 0, s.y || 0, s.z || 0);
        const center = vAdd(rotateAroundY(local, yaw), pos);
        const color = hexToColor(s.color);
        const rot = v3(s.rx || 0, (s.ry || 0) + yaw, s.rz || 0);
        if (s.type === 'sphere') appendSphere(tri, center, s.r || 1, color, 8, 10);
        else if (s.type === 'cylinder') appendCylinder(tri, center, s.r || 0.5, s.h || 1, color, rot, 12);
        else appendOrientedBox(tri, null, center, v3(s.w || 1, s.h || 1, s.d || 1), rot, color, OUTLINE, false);
      }
    }

    renderTest(tri, line) {
      buildMeshFromShapes(this.project.map, tri, line, false);
      for (const z of this.test.zombies) {
        this.buildModelAt(z.model, tri, line, z.pos, z.yaw);
      }
    }

    addGround(tri, line) {
      if (this.tab === 'map') return;
      appendOrientedBox(tri, null, v3(0, -0.15, 0), v3(34, 0.3, 34), v3(0, 0, 0), hexToColor('#59626f'), OUTLINE, false);
      const grid = hexToColor('#3d4552');
      for (let i = -16; i <= 16; i += 2) {
        addLine(line, v3(i, 0.03, -16), v3(i, 0.03, 16), grid);
        addLine(line, v3(-16, 0.03, i), v3(16, 0.03, i), grid);
      }
    }

    frame() {
      if (!this.running) return;
      requestAnimationFrame(() => this.frame());
      if (!this.renderer) return;
      const w = this.renderer.canvas.width;
      const h = this.renderer.canvas.height;
      const tri = createTriBuilder();
      const line = createLineBuilder();
      if (this.tab === 'test' && this.test) {
        this.updateTest();
        this.renderTest(tri, line);
        const cam = this.testCameraMatrix(w, h);
        this.renderer.render({ cameraMatrix: cam, cameraPos: this.test.eye, dynamicSolid: tri, dynamicLines: line });
        return;
      }
      this.addGround(tri, line);
      const model = this.activeModel();
      buildMeshFromShapes(model, tri, line, true);
      const sel = model && model[this.selectedShapeIndex];
      if (sel) {
        addWireBox(line, v3(sel.x || 0, sel.y || 0, sel.z || 0), shapeHighlightSize(sel), v3(sel.rx || 0, sel.ry || 0, sel.rz || 0), COLORS.badge);
      }
      if (this.autoRotate) this.camera.yaw += 0.004;
      const cam = this.camera.matrix(w, h);
      this.renderer.render({ cameraMatrix: cam, cameraPos: this.camera.eye, dynamicSolid: tri, dynamicLines: line });
    }

    setHint(text) {
      if (this.centerHint) {
        this.centerHint.textContent = text;
        clearTimeout(this._hintTimer);
        this._hintTimer = setTimeout(() => {
          if (this.centerHint) this.centerHint.textContent = this.tab === 'test' ? 'Click to shoot • drag to look' : 'Drag to orbit • scroll to zoom';
        }, 2500);
      }
    }

    readStore() {
      try {
        return JSON.parse(localStorage.getItem(STUDIO_STORAGE_KEY) || '{}');
      } catch (error) {
        return {};
      }
    }

    saveProject() {
      const name = (this.project.name || 'Untitled').trim() || 'Untitled';
      this.project.name = name;
      const store = this.readStore();
      store[name] = this.project;
      try {
        localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(store));
        this.setHint(`Saved "${name}" (studio only)`);
      } catch (error) {
        this.setHint('Save failed (storage full?)');
      }
    }

    openLoadDialog() {
      const store = this.readStore();
      this.loadDialog.textContent = '';
      const panel = this.el('div', 'studio-dialog-panel');
      panel.appendChild(this.el('div', 'studio-section-title', 'Load Studio Project'));
      const names = Object.keys(store);
      if (!names.length) {
        panel.appendChild(this.el('div', 'studio-sub', 'No saved projects yet. Use Save first.'));
      }
      for (const name of names) {
        const row = this.el('div', 'studio-list-row');
        row.appendChild(this.el('span', 'studio-list-name', name));
        const loadBtn = this.el('button', 'studio-mini', 'Load');
        loadBtn.addEventListener('click', () => {
          this.project = JSON.parse(JSON.stringify(store[name]));
          migrateStudioProject(this.project);
          this.selectedZombie = Object.keys(this.project.zombies)[0];
          this.selectedWeapon = Object.keys(this.project.weapons)[0];
          this.selectedAvatar = Object.keys(this.project.avatars)[0];
          this.selectedShapeIndex = 0;
          this.projectLabel.textContent = this.project.name;
          this.loadDialog.classList.add('hidden');
          this.selectTab(this.tab);
        });
        const delBtn = this.el('button', 'studio-mini', '✕');
        delBtn.addEventListener('click', () => {
          delete store[name];
          localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(store));
          this.openLoadDialog();
        });
        row.append(loadBtn, delBtn);
        panel.appendChild(row);
      }
      const close = this.el('button', 'chrome-button studio-wide', 'Cancel');
      close.addEventListener('click', () => this.loadDialog.classList.add('hidden'));
      panel.appendChild(close);
      this.loadDialog.appendChild(panel);
      this.loadDialog.classList.remove('hidden');
    }
  }
})();
