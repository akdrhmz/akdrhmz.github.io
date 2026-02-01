import CONFIG from './config.js';

/**
 * Kaspar Satranç Akademisi - Ana Uygulama
 */
class KasparApp {
    constructor() {
        this.game = new Chess();
        this.board = null;
        this.moveHistory = [];
        this.currentRole = null;
        this.currentUser = null;
        this.selectedStudent = null;
        this.eloChart = null;
        
        // Bind methods to this for global access
        this.bindGlobalMethods();
        
        this.init();
    }

    bindGlobalMethods() {
        window.openLogin = (role) => this.openLogin(role);
        window.showRegister = () => this.showRegister();
        window.hideRegister = () => this.hideRegister();
        window.handleLogin = () => this.handleLogin();
        window.handleRegister = () => this.handleRegister();
        window.logout = () => this.logout();
        window.resetBoard = () => this.resetBoard();
        window.undoMove = () => this.undoMove();
        window.makeBestMove = () => this.makeBestMove();
        window.askKaspar = () => this.askKaspar();
        window.selectStudent = (id) => this.selectStudent(id);
        window.showLoginScreen = () => this.showLoginScreen();
        window.selectParentStudent = (id) => this.selectParentStudent(id);
        window.updatePowerPoolStatus = () => this.updatePowerPoolStatus();
        window.testAPI = () => this.testAPI();
        window.showAdminPanel = () => this.showAdminPanel();
        window.closeModal = (id) => this.closeModal(id);
    }

    init() {
        console.log("Kaspar Academy Initialized");
        this.checkConnection();
        // Start with student select screen if no role, or login screen?
        // Existing HTML defaults to showing nothing until JS runs.
        // Let's show Login Screen by default, but if user wants "Profile Selection" as entry:
        // The user instruction "index.html: Profil Seçimi ekranını EKLE" suggests it might be a new entry point.
        // Let's make Student Selection (Profile Selection) accessible.
        
        // Logic: Show Login Screen initially.
        this.showLoginScreen();
    }

    checkConnection() {
        // Simple mock connection check
        const statusEl = document.getElementById('connection-status');
        if (statusEl) {
            statusEl.className = 'connection-status status-online';
            statusEl.innerHTML = '🟢 Brain Online (KasparJS)';
        }
    }

    // ========== NAVIGATION & AUTH ==========

    showLoginScreen() {
        this.hideAllScreens();
        document.getElementById('login-screen').classList.remove('hidden');
    }

    openLogin(role) {
        this.currentRole = role;
        if (role === 'student') {
            // Students go directly to Profile Selection (simulated "Login" via profile pick)
            this.showStudentSelect();
        } else {
            document.getElementById('auth-panel').classList.remove('hidden');
            document.getElementById('register-panel').classList.add('hidden');
            document.getElementById('auth-title').innerText = 
                role === 'parent' ? 'Ebeveyn Girişi' : 'Mühendis Paneli';
        }
    }

    showStudentSelect() {
        this.hideAllScreens();
        document.getElementById('student-select-screen').classList.remove('hidden');
        
        // Mock levels
        document.getElementById('yegen-level').textContent = 'Seviye 3';
        document.getElementById('omer-level').textContent = 'Seviye 2';
    }

    selectStudent(studentId) {
        this.selectedStudent = studentId;
        this.currentUser = { username: studentId === 'yegen' ? 'Yeğen' : 'Ömer Faruk', role: 'student' };
        this.showMainApp();
    }

    handleLogin() {
        const username = document.getElementById('auth-username').value;
        // Simple mock login
        this.currentUser = { username: username || 'User', role: this.currentRole };
        this.showMainApp();
    }

    showMainApp() {
        this.hideAllScreens();
        document.getElementById('main-layout').classList.remove('hidden');
        document.body.className = 'role-' + this.currentRole + ' fade-in';
        
        this.updateUserBadge();
        this.setupPanelFeatures();
        
        if (this.currentRole === 'student') {
            setTimeout(() => this.initChess(), 100);
        } else if (this.currentRole === 'parent') {
            this.initParentView();
        } else if (this.currentRole === 'engineer') {
            this.updatePowerPoolStatus();
        }
    }

    hideAllScreens() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('student-select-screen').classList.add('hidden');
        document.getElementById('main-layout').classList.add('hidden');
    }

    updateUserBadge() {
        const badge = document.getElementById('current-user-badge');
        if (badge) {
            let name = this.currentUser?.username || 'Misafir';
            if (this.currentRole === 'student' && this.selectedStudent) {
                name = this.selectedStudent === 'yegen' ? '👦 Yeğen' : '🧒 Ömer Faruk';
            }
            badge.textContent = name;
        }
    }

    setupPanelFeatures() {
        document.querySelectorAll('.role-specific-ui, .role-view').forEach(el => el.classList.add('hidden'));
        
        if (this.currentRole === 'student') {
            document.getElementById('student-stats').classList.remove('hidden');
            document.getElementById('student-view').classList.remove('hidden');
        } else if (this.currentRole === 'parent') {
            document.getElementById('parent-stats').classList.remove('hidden');
            document.getElementById('parent-view').classList.remove('hidden');
        } else if (this.currentRole === 'engineer') {
            document.getElementById('engineer-stats').classList.remove('hidden');
            document.getElementById('engineer-view').classList.remove('hidden');
        }
    }
    
    logout() {
        location.reload();
    }

    // ========== CHESS LOGIC ==========

    initChess() {
        this.game = new Chess();
        this.moveHistory = [];
        this.updateMoveHistoryDisplay();
        
        if (!this.board) {
            this.board = Chessboard('board', {
                draggable: true,
                position: 'start',
                pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
                onDragStart: (source, piece) => this.onDragStart(source, piece),
                onDrop: (source, target) => this.onDrop(source, target),
                onSnapEnd: () => this.board.position(this.game.fen())
            });
        } else {
            this.board.start();
        }
        
        window.addEventListener('resize', () => { if (this.board) this.board.resize(); });
        this.updateStatus();
    }

    onDragStart(source, piece) {
        if (this.game.game_over()) return false;
        if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    }

    onDrop(source, target) {
        const move = this.game.move({ from: source, to: target, promotion: 'q' });
        if (move === null) return 'snapback';
        
        this.moveHistory.push(move.san);
        this.updateMoveHistoryDisplay();
        this.updateStatus();
        
        if (this.game.game_over()) {
            this.handleGameOver();
        }
    }

    updateStatus() {
        let status = this.game.turn() === 'w' ? 'Sıra Beyazda' : 'Sıra Siyahda';
        if (this.game.in_checkmate()) status = "♚ MAT! Oyun bitti.";
        else if (this.game.in_draw()) status = "🤝 Berabere!";
        else if (this.game.in_check()) status = (this.game.turn() === 'w' ? 'Beyaz' : 'Siyah') + ' ŞAH! ♔';
        
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.innerText = status;
    }

    updateMoveHistoryDisplay() {
        const container = document.getElementById('move-history');
        if (!container) return;
        
        if (this.moveHistory.length === 0) {
            container.innerHTML = 'Henüz hamle yapılmadı.';
            return;
        }
        
        let html = '';
        for (let i = 0; i < this.moveHistory.length; i += 2) {
            const moveNum = Math.floor(i / 2) + 1;
            html += `<span style="color:#94a3b8">${moveNum}.</span> `;
            html += `<span style="color:white">${this.moveHistory[i]}</span> `;
            if (this.moveHistory[i + 1]) {
                html += `<span style="color:#a0a0a0">${this.moveHistory[i + 1]}</span> `;
            }
        }
        container.innerHTML = html;
        container.scrollTop = container.scrollHeight;
    }

    // ========== UNDO FEATURE ==========
    
    undoMove() {
        if (this.game.history().length === 0) {
            this.showThought("🦁 Geri alınacak hamle yok!");
            return;
        }
        
        this.game.undo();
        this.moveHistory.pop();
        this.board.position(this.game.fen());
        this.updateMoveHistoryDisplay();
        this.updateStatus();
        
        this.showThought("↩️ Son hamle geri alındı!");
    }

    // ========== AI FEATURES ==========

    makeBestMove() {
        if (this.game.game_over()) return;
        
        this.showThought('<span class="pulse">🦁 Kaspar düşünüyor...</span>');
        
        // Simulating AI delay
        setTimeout(() => {
            const moves = this.game.moves();
            if (moves.length > 0) {
                const randomMove = moves[Math.floor(Math.random() * moves.length)];
                this.game.move(randomMove);
                this.moveHistory.push(randomMove);
                this.board.position(this.game.fen());
                this.updateMoveHistoryDisplay();
                this.updateStatus();
                this.showThought("🦁 Kaspar: Hamlemi yaptım!");
                
                 if (this.game.game_over()) {
                    this.handleGameOver();
                }
            }
        }, 500);
    }

    askKaspar() {
        const hints = [
            "Merkez kareleri kontrol etmeye odaklan şampiyon!",
            "Taşlarını geliştirmeyi unutma!",
            "Şah'ının güvenliğini sağla!",
            "Açık hatları kontrol eden tarafta ol!"
        ];
        this.showThought("🦁 Kaspar: '" + hints[Math.floor(Math.random() * hints.length)] + "'");
    }

    showThought(html) {
        const el = document.getElementById('ai-thought');
        if (el) el.innerHTML = html;
    }

    handleGameOver() {
        // Simple game over handling
        if (this.game.in_checkmate()) {
            alert("Oyun bitti! " + (this.game.turn() === 'w' ? "Siyah kazandı!" : "Beyaz kazandı!"));
        }
    }
    
    resetBoard() {
        this.game.reset();
        this.moveHistory = [];
        this.board.start();
        this.updateMoveHistoryDisplay();
        this.updateStatus();
        this.showThought("🔄 Yeni oyun başladı! Hamle sırası sende şampiyon.");
    }

    // ========== PARENT & CHART.JS ==========

    initParentView() {
        this.selectParentStudent('yegen');
    }

    selectParentStudent(studentId) {
        document.querySelectorAll('.student-selector-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.student === studentId) btn.classList.add('active');
        });

        // Mock Data for Chart
        const eloData = this.generateEloData(studentId);
        this.updateEloChart(eloData, studentId === 'yegen' ? 'Yeğen' : 'Ömer Faruk');
        
        this.showThought(`📊 <b>${studentId === 'yegen' ? 'Yeğen' : 'Ömer Faruk'}</b> istatistikleri.`);
    }

    generateEloData(studentId) {
        // Generate random ELO data
        const data = [];
        let score = studentId === 'yegen' ? 1200 : 1000;
        for (let i = 0; i < 30; i++) {
            score += Math.floor(Math.random() * 40) - 20;
            data.push(score);
        }
        return data;
    }

    updateEloChart(data, label) {
        const ctx = document.getElementById('eloChart');
        if (!ctx) return;
        
        if (this.eloChart) {
            this.eloChart.destroy();
        }

        this.eloChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => i + 1),
                datasets: [{
                    label: `${label} ELO Gelişimi`,
                    data: data,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#f8fafc' } }
                },
                scales: {
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
                }
            }
        });
    }

    // ========== ENGINEER & OTHER ==========

    updatePowerPoolStatus() {
        const terminal = document.getElementById('terminal-output');
        if (terminal) {
            terminal.innerHTML = `
                <div class="terminal-line" style="color:#0ff;">⚡ POWERPOOL STATUS ⚡</div>
                <div class="terminal-line">System Normal.</div>
                <div class="terminal-line">Gemini-Pro: Active</div>
                <div class="terminal-line">Updated: ${new Date().toLocaleTimeString()}</div>
            `;
        }
    }
    
    showAdminPanel() {
        const panel = document.getElementById('admin-panel');
        if(panel) panel.classList.toggle('hidden');
    }
    
    testAPI() {
         const terminal = document.getElementById('terminal-output');
         if(terminal) terminal.innerHTML += `<div class="terminal-line" style="color:#ff0;">Simulated API Test Passed.</div>`;
    }

    closeModal(id) {
        document.getElementById(id).classList.add('hidden');
    }

    showRegister() {
        document.getElementById('auth-panel').classList.add('hidden');
        document.getElementById('register-panel').classList.remove('hidden');
    }
    
    hideRegister() {
        document.getElementById('register-panel').classList.add('hidden');
        document.getElementById('auth-panel').classList.remove('hidden');
    }
}

const app = new KasparApp();
export default app;
