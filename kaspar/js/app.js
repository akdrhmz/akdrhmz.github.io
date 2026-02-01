import CONFIG from './config.js';

class KasparApp {
    constructor() {
        this.currentRole = null;
        this.board = null;
        this.game = new Chess();
        this.init();
    }

    init() {
        console.log("Kaspar Academy Initialized. Simulation Mode:", CONFIG.isSimulationMode);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Role selection cards
        document.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', () => {
                const role = card.getAttribute('data-role');
                this.selectRole(role);
            });
        });

        // Login button
        document.getElementById('login-btn').addEventListener('click', () => this.login());

        // Password input (Enter key)
        document.getElementById('auth-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Main app buttons
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('ai-move-btn').addEventListener('click', () => this.simulateAiMove());
    }

    selectRole(role) {
        this.currentRole = role;
        const panel = document.getElementById('auth-panel');
        const title = document.getElementById('auth-title');
        const input = document.getElementById('auth-input');
        
        panel.classList.remove('hidden');
        input.value = '';
        input.focus();
        
        // Visual feedback for selected card
        document.querySelectorAll('.role-card').forEach(c => c.style.borderColor = '#eee');
        document.querySelector(`[data-role="${role}"]`).style.borderColor = 'var(--primary-color)';

        if (role === 'student') {
            title.innerText = "Öğrenci Girişi (4 Haneli PIN)";
            input.placeholder = "____";
            input.type = "password";
        } else if (role === 'parent') {
            title.innerText = "Ebeveyn Girişi";
            input.placeholder = "Şifre";
            input.type = "password";
        } else {
            title.innerText = "Mühendislik Paneli";
            input.placeholder = "Master Key";
            input.type = "password";
        }
    }

    login() {
        const input = document.getElementById('auth-input').value;
        let success = false;

        if (this.currentRole === 'student' && input === CONFIG.access.student.defaultPin) success = true;
        else if (this.currentRole === 'parent' && input === 'ebeveyn') success = true;
        else if (this.currentRole === 'engineer' && input === 'jarvis') success = true;

        if (success) {
            this.showMainApp();
        } else {
            alert("Hatalı giriş! (Öğrenci: 1234, Ebeveyn: ebeveyn, Mühendis: jarvis)");
        }
    }

    showMainApp() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.body.className = `role-${this.currentRole} fade-in`;
        
        const welcomeMsg = document.getElementById('welcome-msg');
        if (this.currentRole === 'student') welcomeMsg.innerText = "🦁 Kaspar Arena";
        else if (this.currentRole === 'parent') welcomeMsg.innerText = "🏠 Gelişim Analiz Paneli";
        else welcomeMsg.innerText = "🛠️ Overlord & PowerPool Paneli";

        this.initBoard();
        this.setupRoleUI();
    }

    setupRoleUI() {
        if (this.currentRole === 'parent') {
            // Logic to init charts etc if app.js was used
        }
    }

    initBoard() {
        const config = {
            draggable: true,
            position: 'start',
            onDrop: this.onDrop.bind(this)
        };
        this.board = Chessboard('board', config);
    }

    onDrop(source, target) {
        const move = this.game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) return 'snapback';
        this.updateStatus();
    }

    updateStatus() {
        const statusEl = document.getElementById('status');
        let status = '';

        let moveColor = 'Beyaz';
        if (this.game.turn() === 'b') moveColor = 'Siyah';

        if (this.game.in_checkmate()) {
            status = 'Oyun bitti, ' + moveColor + ' mat oldu.';
        } else if (this.game.in_draw()) {
            status = 'Oyun bitti, berabere.';
        } else {
            status = 'Sıra ' + moveColor + 'da';
            if (this.game.in_check()) status += ' (Şah!)';
        }

        statusEl.innerHTML = status;
    }

    resetGame() {
        this.game.reset();
        this.board.start();
        this.updateStatus();
    }

    async simulateAiMove() {
        const thoughtEl = document.getElementById('ai-thought');
        thoughtEl.innerText = "Kaspar düşünüyor... (PowerPool API Simülasyonu)";
        
        await new Promise(r => setTimeout(r, 1500));

        if (CONFIG.isSimulationMode) {
            const possibleMoves = this.game.moves();
            if (possibleMoves.length === 0) return;

            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            this.game.move(possibleMoves[randomIdx]);
            this.board.position(this.game.fen());
            this.updateStatus();

            thoughtEl.innerText = "Kaspar: 'Güzel bir hamle yaptın! Ben de bunu oynuyorum.'";
            
            console.log(`[PowerPool] Using: ${CONFIG.powerPool.primary.name}. Remaining: ${--CONFIG.powerPool.primary.remaining}`);
        }
    }
}

const app = new KasparApp();
export default app;
