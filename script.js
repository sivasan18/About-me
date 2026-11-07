/**
 * SIVARAMAKRISHNAN // CYBERNETIC HOLOGRAPHIC TERMINAL
 * Visual FX & Interactivity Engine:
 * 1. Three.js Volumetric Holographic Emitter (Wireframe Cyber Avatar / Polygonal Node Matrix)
 * 2. Dynamic Laser Coordinate Ray Projection & Spring-Damped Mouse Tracking
 * 3. Snappy Multi-Axis Rigid HUD Tile Tilt with Laser Highlights
 * 4. Procedural Cybernetic Audio Synthesizer (Web Audio API)
 * 5. 6 Transmission Data Packet Dossier Modal System
 * 6. Encrypted Signal Terminal Console & Direct Channel Actions
 */

(function () {
    'use strict';

    // Security Sanitizer: Prevent DOM-based Cross-Site Scripting (XSS)
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>'"]/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[char] || char));
    }

    // =========================================================================
    // 01. AUDIO TELEMETRY SYNTHESIZER (Web Audio API)
    // =========================================================================
    class CyberAudioEngine {
        constructor() {
            this.ctx = null;
            this.enabled = true;
            this.init();
        }

        init() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            } catch (e) {}
        }

        resume() {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playLaserPing() {
            if (!this.enabled || !this.ctx) return;
            this.resume();
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(880, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.035);

                gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.04);
            } catch (e) {}
        }

        playClickPulse() {
            if (!this.enabled || !this.ctx) return;
            this.resume();
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
                osc.frequency.setValueAtTime(1800, this.ctx.currentTime + 0.025);

                gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.06);
            } catch (e) {}
        }

        toggle() {
            this.enabled = !this.enabled;
            return this.enabled;
        }
    }

    const cyberAudio = new CyberAudioEngine();

    const audioToggleBtn = document.getElementById('audioToggleBtn');
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            const isEnabled = cyberAudio.toggle();
            const icon = audioToggleBtn.querySelector('i');
            if (icon) {
                icon.className = isEnabled ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
            }
            if (isEnabled) cyberAudio.playLaserPing();
        });
    }

    window.addEventListener('keydown', (e) => {
        if ((e.key === 'm' || e.key === 'M') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            if (audioToggleBtn) audioToggleBtn.click();
        }
    });

    document.querySelectorAll('a, button, .bento-hud-card').forEach(el => {
        el.addEventListener('mouseenter', () => cyberAudio.playLaserPing(), { passive: true });
        el.addEventListener('click', () => cyberAudio.playClickPulse(), { passive: true });
    });


    // =========================================================================
    // 02. LASER CURSOR TRACKER & COORDINATE RAY
    // =========================================================================
    const hudCursor = document.getElementById('hudCursor');
    const reticleCoords = document.getElementById('reticleCoords');
    const vectorCoords = document.getElementById('vectorCoords');
    const laserProgress = document.getElementById('laserProgress');

    let mouseNormX = 0;
    let mouseNormY = 0;
    let rawMouseX = window.innerWidth / 2;
    let rawMouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        rawMouseX = e.clientX;
        rawMouseY = e.clientY;

        if (hudCursor) {
            hudCursor.style.transform = `translate3d(${rawMouseX}px, ${rawMouseY}px, 0)`;
        }

        mouseNormX = ((rawMouseX / window.innerWidth) * 2 - 1).toFixed(2);
        mouseNormY = (-((rawMouseY / window.innerHeight) * 2 - 1)).toFixed(2);

        const coordStr = `X:${mouseNormX >= 0 ? '+' : ''}${mouseNormX} Y:${mouseNormY >= 0 ? '+' : ''}${mouseNormY}`;

        if (reticleCoords) reticleCoords.textContent = `${coordStr} Z:+01.00`;
        if (vectorCoords) vectorCoords.textContent = `${coordStr} Z:+01.00`;
    }, { passive: true });

    // Scroll reading progress laser
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const p = (window.scrollY / total) * 100;
        if (laserProgress) {
            laserProgress.style.width = `${p}%`;
        }
    }, { passive: true });


    // =========================================================================
    // 03. 3D VOLUMETRIC HOLOGRAPHIC EMITTER (THREE.JS / WEBGL)
    // =========================================================================
    const holoCanvas = document.getElementById('hologram3DCanvas');
    if (holoCanvas) {
        initVolumetricEmitter(holoCanvas);
    }

    function initVolumetricEmitter(targetCanvas) {
        if (typeof THREE === 'undefined') {
            let attempts = 0;
            const checkTimer = setInterval(() => {
                attempts++;
                if (typeof THREE !== 'undefined') {
                    clearInterval(checkTimer);
                    startThreeEmitter(targetCanvas);
                } else if (attempts > 30) {
                    clearInterval(checkTimer);
                    run2DCanvasFallback(targetCanvas);
                }
            }, 50);
            return;
        }
        startThreeEmitter(targetCanvas);
    }

    function startThreeEmitter(targetCanvas) {

        try {
            const container = targetCanvas.parentElement;
            let width = container.clientWidth || window.innerWidth;
            let height = container.clientHeight || window.innerHeight;

            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera.position.set(0, 3, 24);

            const renderer = new THREE.WebGLRenderer({
                canvas: targetCanvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Central Holographic Emitter Group
            const emitterGroup = new THREE.Group();
            scene.add(emitterGroup);

            // 1. Holographic Polygonal Node Matrix (Icosahedron Wireframe)
            const nodeMatrixGeo = new THREE.IcosahedronGeometry(5.4, 2);
            const nodeMatrixMat = new THREE.MeshBasicMaterial({
                color: 0x00E5FF,
                wireframe: true,
                transparent: true,
                opacity: 0.38
            });
            const nodeMatrixMesh = new THREE.Mesh(nodeMatrixGeo, nodeMatrixMat);
            emitterGroup.add(nodeMatrixMesh);

            // 2. Concentric Octahedral Core Matrix
            const innerOctaGeo = new THREE.OctahedronGeometry(3.2, 1);
            const innerOctaMat = new THREE.MeshBasicMaterial({
                color: 0x00FFC2,
                wireframe: true,
                transparent: true,
                opacity: 0.65
            });
            const innerOctaMesh = new THREE.Mesh(innerOctaGeo, innerOctaMat);
            emitterGroup.add(innerOctaMesh);

            // 3. Central Hologram Energy Node
            const energyNodeGeo = new THREE.DodecahedronGeometry(1.6, 0);
            const energyNodeMat = new THREE.MeshBasicMaterial({
                color: 0x8A2BE2,
                wireframe: true,
                transparent: true,
                opacity: 0.9
            });
            const energyNodeMesh = new THREE.Mesh(energyNodeGeo, energyNodeMat);
            emitterGroup.add(energyNodeMesh);

            // 4. Horizontal Holographic Laser Scanning Disk
            const diskGeo = new THREE.RingGeometry(5.6, 5.65, 64);
            const diskMat = new THREE.MeshBasicMaterial({
                color: 0x00E5FF,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.55
            });
            const scanDisk = new THREE.Mesh(diskGeo, diskMat);
            scanDisk.rotation.x = Math.PI / 2;
            emitterGroup.add(scanDisk);

            // 5. Projected Laser Coordinate Ray Lines towards Cursor Target
            const laserRayGeo = new THREE.BufferGeometry();
            const laserPositions = new Float32Array(6); // 2 vertices: center (0,0,0) to target
            laserRayGeo.setAttribute('position', new THREE.BufferAttribute(laserPositions, 3));

            const laserRayMat = new THREE.LineBasicMaterial({
                color: 0x00E5FF,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending
            });
            const laserRayLine = new THREE.Line(laserRayGeo, laserRayMat);
            emitterGroup.add(laserRayLine);

            // 6. Ambient Holographic Particulate Dust
            const particleCount = 220;
            const particleGeo = new THREE.BufferGeometry();
            const pPositions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount * 3; i += 3) {
                pPositions[i] = (Math.random() - 0.5) * 22;
                pPositions[i + 1] = (Math.random() - 0.5) * 18;
                pPositions[i + 2] = (Math.random() - 0.5) * 18;
            }

            particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
            const particleMat = new THREE.PointsMaterial({
                color: 0x00E5FF,
                size: 0.12,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending
            });
            const particleCluster = new THREE.Points(particleGeo, particleMat);
            scene.add(particleCluster);

            // Mouse Interaction with Spring Damping
            let targetTiltX = 0;
            let targetTiltY = 0;
            let currentTiltX = 0;
            let currentTiltY = 0;

            window.addEventListener('mousemove', (e) => {
                const normX = (e.clientX / window.innerWidth) * 2 - 1;
                const normY = -(e.clientY / window.innerHeight) * 2 + 1;
                targetTiltY = normX * 0.75;
                targetTiltX = -normY * 0.55;
            }, { passive: true });

            // Animation Loop
            let clock = new THREE.Clock();

            function renderHoloLoop() {
                requestAnimationFrame(renderHoloLoop);
                const elapsed = clock.getElapsedTime();

                // Vertical holographic float
                emitterGroup.position.y = Math.sin(elapsed * 1.4) * 0.35;

                // Mesh Rotations
                nodeMatrixMesh.rotation.y += 0.003;
                nodeMatrixMesh.rotation.x += 0.002;

                innerOctaMesh.rotation.y -= 0.006;
                innerOctaMesh.rotation.z += 0.004;

                energyNodeMesh.rotation.x += 0.008;

                scanDisk.rotation.z += 0.006;
                scanDisk.position.y = Math.sin(elapsed * 2.2) * 2.8;

                // Particle slow rotation
                particleCluster.rotation.y = elapsed * 0.025;

                // Smooth Spring Damping towards Mouse
                currentTiltX += (targetTiltX - currentTiltX) * 0.06;
                currentTiltY += (targetTiltY - currentTiltY) * 0.06;
                emitterGroup.rotation.x = currentTiltX;
                emitterGroup.rotation.y = currentTiltY;

                // Update projected laser coordinate ray
                const posAttr = laserRayGeo.attributes.position;
                posAttr.setXYZ(0, 0, 0, 0);
                posAttr.setXYZ(1, currentTiltY * 8, -currentTiltX * 8, 4);
                posAttr.needsUpdate = true;

                renderer.render(scene, camera);
            }
            renderHoloLoop();

            window.addEventListener('resize', () => {
                width = container.clientWidth || window.innerWidth;
                height = container.clientHeight || window.innerHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            });

        } catch (err) {
            run2DCanvasFallback(targetCanvas);
        }
    }

    // 2D Canvas Fallback
    function run2DCanvasFallback(cvs) {
        const ctx = cvs.getContext('2d');
        let width = cvs.width = cvs.parentElement.clientWidth || window.innerWidth;
        let height = cvs.height = cvs.parentElement.clientHeight || window.innerHeight;

        const nodes = [];
        for (let i = 0; i < 32; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6
            });
        }

        function drawFallback() {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
            ctx.fillStyle = '#00E5FF';

            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;
                ctx.fillRect(n.x - 2, n.y - 2, 4, 4);
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawFallback);
        }
        drawFallback();
    }


    // =========================================================================
    // 04. CRISP MULTI-AXIS RIGID HUD TILE TILT
    // =========================================================================
    const hudCards = document.querySelectorAll('.bento-hud-card, .transmission-card');

    hudCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5.5;
            const rotateY = ((x - centerX) / centerX) * 5.5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });


    // =========================================================================
    // 05. 6 TRANSMISSION DATA PACKET DOSSIER MODAL
    // =========================================================================
    const filterButtons = document.querySelectorAll('.holo-filter-btn');
    const transCards = document.querySelectorAll('.transmission-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-filter');

            transCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (cat === 'all' || cardCat === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const transmissionData = {
        '1': {
            transId: 'TRANSMISSION 01',
            title: 'Smart Cashback POS',
            classification: 'Intelligent POS & automated billing platform with cashback incentives.',
            tags: ['FinTech', 'Billing Engine', 'Dashboard'],
            specs: [
                'Sub-10ms invoice execution with progressive volume discounts',
                'Dual-ledger balance synchronization guaranteeing zero merchant drift',
                'Optimized high-contrast touch terminal engineered for rapid order entries'
            ],
            repo: 'https://github.com/sivasan18/smart-cashback'
        },
        '2': {
            transId: 'TRANSMISSION 02',
            title: 'UPI Fraud Detection',
            classification: 'Real-time transactional fraud detection and automated security risk analysis engine.',
            tags: ['AI/ML', 'FinTech Security', 'Fraud Detection'],
            specs: [
                'Sub-12ms inference evaluating risk velocity before switch routing',
                'Geographic velocity telemetry detecting impossible travel anomalies',
                'Automated step-up challenge interception on compromised mule VPAs'
            ],
            repo: 'https://github.com/sivasan18/UPI-Fraud-Detection'
        },
        '3': {
            transId: 'TRANSMISSION 03',
            title: 'Integrated Disconnection Portal',
            classification: 'Automated service disconnection and enterprise workflow management portal.',
            tags: ['Enterprise Portal', 'Workflow Automation', 'Service Management'],
            specs: [
                'Deterministic state machine coordinating cross-department approvals',
                '99.98% SLA compliance with real-time escalation timer cascades',
                'Automated digital NOC clearance certificate upon dues settlement'
            ],
            repo: 'https://github.com/sivasan18/Integrated-Disconnection-Portal'
        },
        '4': {
            transId: 'TRANSMISSION 04',
            title: 'Ledger Account Book',
            classification: 'Real-time digital ledger, personal/business expense tracker, and financial audit system.',
            tags: ['Finance', 'Accounting', 'Data Visualizations'],
            specs: [
                'Zero balance drift equation eliminating floating-point reconciliation errors',
                'Procedural SVG area charts rendering income curves and velocity',
                'Offline-first IndexedDB persistence with encryption for corporate records'
            ],
            repo: 'https://github.com/sivasan18/Ledger-account-book'
        },
        '5': {
            transId: 'TRANSMISSION 05',
            title: 'PDF Converter',
            classification: 'High-speed browser document processing, file conversion, and transformation utility.',
            tags: ['Web App', 'Document Processing', 'Utility'],
            specs: [
                '100% client-side privacy via WebAssembly execution in browser sandbox',
                'Multi-threaded Web Workers keeping 60fps UI responsive during batch tasks',
                'Layout-preserving parsing extracting tables, fonts, and vector elements'
            ],
            repo: 'https://github.com/sivasan18/pdf-converter'
        },
        '6': {
            transId: 'TRANSMISSION 06',
            title: 'Bank Account Closure Portal',
            classification: 'High-security banking portal streamlining customer account liquidation and compliance workflows.',
            tags: ['FinTech', 'Security', 'Portal'],
            specs: [
                '256-bit statutory verification gate verifying liability settlements',
                'Digital affidavit canvas signature pad with cryptographic timestamp hash',
                'Statutory compliance audit logs conforming to national banking standards'
            ],
            repo: 'https://github.com/sivasan18/Bank-Account-Closure-Portal'
        }
    };

    const packetModal = document.getElementById('packetDossierModal');
    const packetModalBody = document.getElementById('packetModalBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    function openPacketDossier(packetId) {
        const item = transmissionData[packetId];
        if (!item || !packetModal || !packetModalBody) return;

        const safeRepo = (item.repo && item.repo.startsWith('https://')) ? escapeHTML(item.repo) : '#';

        packetModalBody.innerHTML = `
            <div style="font-family: var(--font-mono); color: var(--laser-cyan); font-size: 0.74rem; margin-bottom: 8px;">
                [CLASSIFIED // ${escapeHTML(item.transId)}]
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; margin-bottom: 12px;">
                ${escapeHTML(item.title)}
            </h3>
            <p style="color: var(--text-data); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px;">
                ${escapeHTML(item.classification)}
            </p>
            <div style="background: rgba(0, 229, 255, 0.04); border: 1px solid var(--circuit-border); padding: 18px; margin-bottom: 24px;">
                <span style="font-family: var(--font-mono); color: var(--electric-teal); font-size: 0.75rem; display: block; margin-bottom: 10px;">
                    [TECHNICAL_SPECIFICATIONS]
                </span>
                <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.86rem; color: var(--text-data);">
                    ${item.specs.map(s => `<li style="display: flex; gap: 8px;"><span style="color: var(--laser-cyan);">&gt;</span> ${escapeHTML(s)}</li>`).join('')}
                </ul>
            </div>
            <div style="display: flex; justify-content: flex-end;">
                <a href="${safeRepo}" target="_blank" rel="noopener noreferrer" class="cyber-btn cyber-btn-primary" style="padding: 10px 22px;">
                    <i class="fab fa-github"></i> ACCESS SOURCE REPOSITORY
                </a>
            </div>
        `;

        if (typeof packetModal.showModal === 'function') {
            packetModal.showModal();
        } else {
            packetModal.setAttribute('open', '');
        }
        document.body.style.overflow = 'hidden';
    }

    function closePacketDossier() {
        if (!packetModal) return;
        if (typeof packetModal.close === 'function') {
            packetModal.close();
        } else {
            packetModal.removeAttribute('open');
        }
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.btn-inspect-packet, .btn-trans-inspect').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tid = btn.getAttribute('data-transmission');
            if (tid) openPacketDossier(tid);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePacketDossier);

    if (packetModal) {
        packetModal.addEventListener('click', (e) => {
            const rect = packetModal.getBoundingClientRect();
            const inside = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!inside) closePacketDossier();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && packetModal && packetModal.hasAttribute('open')) {
            closePacketDossier();
        }
    });


    // =========================================================================
    // 06. ENCRYPTED SIGNAL TERMINAL CONSOLE & ACTIONS
    // =========================================================================
    const signalForm = document.getElementById('signalConsoleForm');
    const signalConsoleLog = document.getElementById('signalConsoleLog');
    const btnDispatch = document.getElementById('btnDispatchSignal');
    const btnCopyEmail = document.getElementById('btnCopyEmail');

    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', () => {
            navigator.clipboard.writeText('sivar75@gmail.com').then(() => {
                const orig = btnCopyEmail.innerHTML;
                btnCopyEmail.innerHTML = '<i class="fas fa-check" style="color: var(--electric-teal)"></i>';
                if (signalConsoleLog) {
                    signalConsoleLog.innerHTML = '<span class="log-prompt">&gt;</span> Channel frequency [sivar75@gmail.com] copied to operator buffer.';
                }
                setTimeout(() => { btnCopyEmail.innerHTML = orig; }, 2000);
            });
        });
    }

    if (signalForm && signalConsoleLog) {
        signalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('opEmail');
            const email = emailInput ? emailInput.value.trim() : '';
            const safeEmail = escapeHTML(email);

            if (btnDispatch) {
                btnDispatch.disabled = true;
                btnDispatch.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>ENCRYPTING_PAYLOAD...</span>';
            }

            signalConsoleLog.innerHTML = '<span class="log-prompt">&gt;</span> [SYS] Encrypting signal payload via AES-256...';

            setTimeout(() => {
                signalConsoleLog.innerHTML = '<span class="log-prompt">&gt;</span> [SYS] Routing through India transmission gateway [103.21.244.0/22]...';
            }, 550);

            setTimeout(() => {
                signalConsoleLog.innerHTML = `<span class="log-prompt" style="color: var(--electric-teal)">&gt;</span> [SUCCESS] Transmission confirmed. Sivaramakrishnan will respond to ${safeEmail} within 24 hours.`;
                if (btnDispatch) {
                    btnDispatch.innerHTML = '<i class="fas fa-check"></i> <span>SIGNAL_DISPATCHED</span>';
                    btnDispatch.style.background = 'var(--electric-teal)';
                    btnDispatch.style.color = '#03060C';
                }
                signalForm.reset();

                setTimeout(() => {
                    if (btnDispatch) {
                        btnDispatch.disabled = false;
                        btnDispatch.innerHTML = '<i class="fas fa-satellite-dish"></i> <span>TRANSMIT SIGNAL PAYLOAD</span>';
                        btnDispatch.style.background = '';
                        btnDispatch.style.color = '';
                    }
                }, 4000);
            }, 1300);
        });
    }

    // Mobile nav toggle
    const mobileToggle = document.getElementById('hudMobileToggle');
    const hudNavMenu = document.getElementById('hudNavMenu');

    if (mobileToggle && hudNavMenu) {
        mobileToggle.addEventListener('click', () => {
            hudNavMenu.classList.toggle('active');
        });

        hudNavMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => hudNavMenu.classList.remove('active'));
        });
    }

    console.log('%c SIVARAMAKRISHNAN // HOLOGRAPHIC TERMINAL %c [HOLO.EMITTER: ONLINE] ',
        'background: #00E5FF; color: #03060C; font-weight: bold; padding: 4px 8px;',
        'background: #00FFC2; color: #03060C; font-weight: bold; padding: 4px 8px;');

})();
