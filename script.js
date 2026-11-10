/**
 * SIVARAMAKRISHNAN — IMMERSIVE 3D FASHION-EDITORIAL PORTFOLIO
 * Three.js 3D Character Engine, Scroll Choreography & Editorial Interactions
 */

(function () {
  'use strict';

  // --- Global State & Configuration ---
  const state = {
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    rotationVelocity: 0,
    characterRotationY: 0.15,
    targetRotationY: 0.15,
    scrollProgress: 0,
    currentSection: 'hero',
    clockInterval: null,
  };

  // --- DOM Elements ---
  const container = document.getElementById('canvas-container');
  const loaderEl = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const clockEl = document.getElementById('navClock');
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  // --- Clock Updater ---
  function initClock() {
    function updateClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' });
      if (clockEl) {
        clockEl.textContent = `${timeStr} IST`;
      }
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // --- Custom Editorial Cursor ---
  function initCursor() {
    if (!cursorDot || !cursorFollower || window.innerWidth < 768) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateCursor() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hover effect on interactives
    const interactives = document.querySelectorAll('a, button, .work-item, .skill-category-card, .contact-box');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

  // --- 3D Scene Variables ---
  let scene, camera, renderer, clock, mixer;
  let characterModel = null;
  let headBone = null;
  let neckBone = null;
  let spineBone = null;
  let floorShadow = null;
  let isUsingFallback = false;

  // Camera & Model Pose Configurations per Section
  const sectionTransforms = {
    hero: {
      modelPos: { x: 0.35, y: -1.75, z: 0 },
      modelRot: { x: 0, y: -0.25, z: 0 },
      camPos: { x: 0, y: 0.1, z: 3.5 },
      camLookAt: { x: 0.3, y: 0, z: 0 },
    },
    about: {
      modelPos: { x: 0.6, y: -1.45, z: 0.2 },
      modelRot: { x: 0, y: -0.5, z: 0 },
      camPos: { x: 0.2, y: 0.2, z: 2.8 },
      camLookAt: { x: 0.5, y: 0.15, z: 0 },
    },
    skills: {
      modelPos: { x: 0.45, y: -1.7, z: -0.1 },
      modelRot: { x: 0, y: 0.35, z: 0 },
      camPos: { x: 0, y: 0.05, z: 3.4 },
      camLookAt: { x: 0.4, y: -0.1, z: 0 },
    },
    works: {
      modelPos: { x: 0.7, y: -1.75, z: 0 },
      modelRot: { x: 0, y: -0.3, z: 0 },
      camPos: { x: 0.2, y: 0.0, z: 3.6 },
      camLookAt: { x: 0.6, y: -0.1, z: 0 },
    },
    contact: {
      modelPos: { x: 0.15, y: -1.7, z: 0.2 },
      modelRot: { x: 0, y: 0.05, z: 0 },
      camPos: { x: 0, y: 0.1, z: 3.2 },
      camLookAt: { x: 0.15, y: 0.05, z: 0 },
    },
  };

  // Interpolated current transform values
  const currentTransform = {
    modelPos: { ...sectionTransforms.hero.modelPos },
    modelRot: { ...sectionTransforms.hero.modelRot },
    camPos: { ...sectionTransforms.hero.camPos },
    camLookAt: { ...sectionTransforms.hero.camLookAt },
  };

  // --- Initialize Three.js WebGL Scene ---
  function initThree() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Retrying in 100ms...');
      setTimeout(initThree, 100);
      return;
    }

    if (!container) return;

    // 1. Scene Setup
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    // 2. Camera Setup
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(currentTransform.camPos.x, currentTransform.camPos.y, currentTransform.camPos.z);
    camera.lookAt(currentTransform.camLookAt.x, currentTransform.camLookAt.y, currentTransform.camLookAt.z);

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // 4. Studio Editorial Lighting
    // Ambient light - warm ivory bounce
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.25);
    scene.add(ambientLight);

    // Key Light - Fashion studio directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Rim / Back light for crisp silhouette definition
    const rimLight = new THREE.DirectionalLight(0xe8f0ff, 1.1);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Front soft fill light
    const fillLight = new THREE.DirectionalLight(0xffe9dd, 0.75);
    fillLight.position.set(0, 0, 4);
    scene.add(fillLight);

    // 5. Ground Contact Shadow Mesh
    createContactShadow();

    // 6. Load GLB Character Model
    loadCharacterModel();

    // 7. Event Listeners for Interaction
    initInteractions();

    // 8. Start Animation Loop
    animate();
  }

  // --- Ground Contact Shadow ---
  function createContactShadow() {
    // Canvas-generated radial gradient shadow texture
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(30, 20, 15, 0.28)');
    gradient.addColorStop(0.35, 'rgba(40, 25, 20, 0.16)');
    gradient.addColorStop(0.7, 'rgba(50, 30, 25, 0.04)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });

    floorShadow = new THREE.Mesh(shadowGeo, shadowMat);
    floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.position.set(currentTransform.modelPos.x, -1.74, currentTransform.modelPos.z);
    scene.add(floorShadow);
  }

  // --- Load Character Model ---
  function loadCharacterModel() {
    if (typeof THREE.GLTFLoader === 'undefined') {
      console.warn('GLTFLoader not ready, waiting...');
      setTimeout(loadCharacterModel, 100);
      return;
    }

    const loader = new THREE.GLTFLoader();

    loader.load(
      './assets/models/character.glb',
      (gltf) => {
        characterModel = gltf.scene;

        // Traverse & Optimize Materials
        characterModel.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              node.material.roughness = Math.max(node.material.roughness, 0.35);
              node.material.metalness = Math.min(node.material.metalness, 0.15);
              node.material.needsUpdate = true;
            }
          }

          // Locate Bones for head/torso tracking
          const name = (node.name || '').toLowerCase();
          if (name.includes('head') && !name.includes('end')) {
            headBone = node;
          } else if (name.includes('neck')) {
            neckBone = node;
          } else if (name.includes('spine') && !spineBone) {
            spineBone = node;
          }
        });

        // Initial Transform & Positioning
        characterModel.position.set(
          currentTransform.modelPos.x,
          currentTransform.modelPos.y,
          currentTransform.modelPos.z
        );
        characterModel.rotation.set(
          currentTransform.modelRot.x,
          currentTransform.modelRot.y,
          currentTransform.modelRot.z
        );
        characterModel.scale.set(1.7, 1.7, 1.7);

        scene.add(characterModel);

        // Animation Mixer for Natural Idle Animation
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(characterModel);
          const idleClip = gltf.animations.find((a) => a.name.toLowerCase().includes('idle')) || gltf.animations[0];
          const action = mixer.clipAction(idleClip);
          action.setEffectiveTimeScale(0.85); // elegant, relaxed breathing cadence
          action.play();
        }

        dismissLoader();
      },
      (xhr) => {
        if (xhr.lengthComputable && loaderBar) {
          const percent = (xhr.loaded / xhr.total) * 100;
          loaderBar.style.width = `${Math.min(percent, 90)}%`;
        }
      },
      (error) => {
        console.warn('Error loading GLB character, creating procedural editorial mannequin:', error);
        createProceduralMannequin();
        dismissLoader();
      }
    );
  }

  // --- Procedural Fallback Mannequin ---
  function createProceduralMannequin() {
    isUsingFallback = true;
    const group = new THREE.Group();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.4,
      metalness: 0.2,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xE5232E,
      roughness: 0.3,
      metalness: 0.1,
    });

    // Torso / Suit Jacket
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.26, 0.85, 16);
    const torso = new THREE.Mesh(torsoGeo, mat);
    torso.position.y = 0.65;
    group.add(torso);

    // Collar accent
    const collarGeo = new THREE.TorusGeometry(0.18, 0.03, 12, 24);
    const collar = new THREE.Mesh(collarGeo, accentMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.08;
    group.add(collar);

    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.y = 1.35;
    group.add(head);
    headBone = head;

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 1.1, 12);
    const leftLeg = new THREE.Mesh(legGeo, mat);
    leftLeg.position.set(-0.16, -0.28, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, mat);
    rightLeg.position.set(0.16, -0.28, 0);
    group.add(rightLeg);

    group.position.set(currentTransform.modelPos.x, currentTransform.modelPos.y + 0.6, currentTransform.modelPos.z);
    group.scale.set(1.4, 1.4, 1.4);
    scene.add(group);
    characterModel = group;

    const badge = document.querySelector('.fallback-badge');
    if (badge) badge.style.display = 'block';
  }

  function dismissLoader() {
    if (loaderBar) loaderBar.style.width = '100%';
    setTimeout(() => {
      if (loaderEl) loaderEl.classList.add('loaded');
    }, 350);
  }

  // --- Interaction Listeners ---
  function initInteractions() {
    // Mouse Tracking for Head/Body Orienting
    window.addEventListener('mousemove', (e) => {
      state.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Drag to Rotate Character
    container.addEventListener('mousedown', (e) => {
      state.isDragging = true;
      state.dragStart.x = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      state.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.isDragging) return;
      const deltaX = e.clientX - state.dragStart.x;
      state.dragStart.x = e.clientX;
      state.rotationVelocity = deltaX * 0.0075;
    });

    // Touch Support for Mobile
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        state.isDragging = true;
        state.dragStart.x = e.touches[0].clientX;
      }
    });

    window.addEventListener('touchend', () => {
      state.isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!state.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - state.dragStart.x;
      state.dragStart.x = e.touches[0].clientX;
      state.rotationVelocity = deltaX * 0.008;
    });

    // Scroll Observer for Section Transformations
    setupScrollTrigger();

    // Window Resize
    window.addEventListener('resize', onWindowResize);
  }

  // --- Scroll Observer & Section Detection ---
  function setupScrollTrigger() {
    const sections = ['hero', 'about', 'skills', 'works', 'contact'];

    function handleScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      state.scrollProgress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

      // Determine active section by scroll position
      let activeSec = 'hero';
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
            activeSec = id;
          }
        }
      });

      if (activeSec !== state.currentSection) {
        state.currentSection = activeSec;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // --- Main Animation Render Loop ---
  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // 1. Advance Character Animation Mixer
    if (mixer) {
      mixer.update(delta);
    }

    // 2. Smooth Mouse Interpolation (Lerp)
    state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.08;
    state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.08;

    // 3. Section Pose Lerp
    const target = sectionTransforms[state.currentSection] || sectionTransforms.hero;
    const lerpSpeed = 0.04;

    currentTransform.modelPos.x += (target.modelPos.x - currentTransform.modelPos.x) * lerpSpeed;
    currentTransform.modelPos.y += (target.modelPos.y - currentTransform.modelPos.y) * lerpSpeed;
    currentTransform.modelPos.z += (target.modelPos.z - currentTransform.modelPos.z) * lerpSpeed;

    currentTransform.camPos.x += (target.camPos.x - currentTransform.camPos.x) * lerpSpeed;
    currentTransform.camPos.y += (target.camPos.y - currentTransform.camPos.y) * lerpSpeed;
    currentTransform.camPos.z += (target.camPos.z - currentTransform.camPos.z) * lerpSpeed;

    currentTransform.camLookAt.x += (target.camLookAt.x - currentTransform.camLookAt.x) * lerpSpeed;
    currentTransform.camLookAt.y += (target.camLookAt.y - currentTransform.camLookAt.y) * lerpSpeed;
    currentTransform.camLookAt.z += (target.camLookAt.z - currentTransform.camLookAt.z) * lerpSpeed;

    // Apply Camera Transform
    camera.position.set(currentTransform.camPos.x, currentTransform.camPos.y, currentTransform.camPos.z);
    camera.lookAt(currentTransform.camLookAt.x, currentTransform.camLookAt.y, currentTransform.camLookAt.z);

    // 4. Update Character & Shadow Positioning
    if (characterModel) {
      // Rotation damping from user drag
      state.targetRotationY += state.rotationVelocity;
      state.rotationVelocity *= 0.92; // friction

      // Lerp towards section base rotation + user drag rotation
      const baseRotY = target.modelRot.y;
      state.characterRotationY += (baseRotY + state.targetRotationY - state.characterRotationY) * 0.06;

      characterModel.position.set(
        currentTransform.modelPos.x,
        currentTransform.modelPos.y,
        currentTransform.modelPos.z
      );
      characterModel.rotation.y = state.characterRotationY;

      // Subtle breathing idle if no animation mixer
      if (!mixer) {
        const elapsed = clock.getElapsedTime();
        characterModel.position.y += Math.sin(elapsed * 1.5) * 0.008;
      }

      // Dynamic Bone Mouse Tracking (Looking subtly at cursor)
      if (headBone) {
        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, state.mouse.x * 0.45, 0.1);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -state.mouse.y * 0.3, 0.1);
      }
      if (neckBone) {
        neckBone.rotation.y = THREE.MathUtils.lerp(neckBone.rotation.y, state.mouse.x * 0.2, 0.1);
        neckBone.rotation.x = THREE.MathUtils.lerp(neckBone.rotation.x, -state.mouse.y * 0.15, 0.1);
      }
      if (spineBone) {
        spineBone.rotation.y = THREE.MathUtils.lerp(spineBone.rotation.y, state.mouse.x * 0.1, 0.05);
      }
    }

    if (floorShadow) {
      floorShadow.position.x = currentTransform.modelPos.x;
      floorShadow.position.z = currentTransform.modelPos.z;
    }

    // 5. Render Scene
    renderer.render(scene, camera);
  }

  // --- Mobile Menu Toggle ---
  function initMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;

    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    const links = mobileMenu.querySelectorAll('a');
    links.forEach((l) => {
      l.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --- Initialize Everything ---
  window.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCursor();
    initSmoothNav();
    initMobileMenu();
    initThree();
  });
})();
