/**
 * Kaspar Satranç Akademisi - Configuration
 * PowerPool Architecture Setup
 */

const CONFIG = {
    // API Simulation Mode (True until OAuth is set up)
    isSimulationMode: true,

    // PowerPool API Keys (Placeholders)
    powerPool: {
        primary: {
            name: "Gemini Pro X (Main)",
            key: "AIzaSy_GEMINI_PRO_X",
            limit: 10000,
            remaining: 7400
        },
        secondary: {
            name: "GPT-4o Mini (Backup)",
            key: "sk-proj-backup",
            limit: 5000,
            remaining: 1250
        }
    },

    // User Access Settings
    access: {
        student: {
            requiresPin: true,
            defaultPin: "1234"
        },
        parent: {
            requiresAuth: true
        },
        engineer: {
            requiresAuth: true
        }
    },

    // UI Settings
    ui: {
        theme: "kaspar-junior",
        language: "tr",
        voiceEnabled: true
    }
};

export default CONFIG;
