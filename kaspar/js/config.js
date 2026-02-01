/**
 * Kaspar Satranç Akademisi - Configuration
 * PowerPool Architecture Setup
 * 
 * [ai-comment] GÜVENLİK NOTU: Bu dosya frontend'de çalıştığı için hassas bilgiler 
 * içermemelidir. API anahtarları ve şifreler backend'de saklanmalıdır.
 */

const CONFIG = {
    // [ai-comment] API Simülasyon Modu - Production'da false yapılmalı
    isSimulationMode: true,

    // [ai-comment] PowerPool API bilgileri - Anahtarlar backend'den alınacak
    // Frontend sadece model isimlerini ve kota durumunu görebilir
    powerPool: {
        primary: {
            name: "Gemini Pro X (Main)",
            // [ai-comment] API anahtarı kaldırıldı - Backend üzerinden yönetilmeli
            limit: 10000,
            remaining: 7400
        },
        secondary: {
            name: "GPT-4o Mini (Backup)",
            // [ai-comment] API anahtarı kaldırıldı - Backend üzerinden yönetilmeli
            limit: 5000,
            remaining: 1250
        }
    },

    // [ai-comment] Erişim ayarları - Şifreler ve PIN'ler backend'de doğrulanmalı
    access: {
        student: {
            requiresPin: true
            // [ai-comment] defaultPin kaldırıldı - Güvenlik açığı oluşturuyordu
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
    },

    // [ai-comment] API endpoint'leri - Production'da HTTPS kullanılmalı
    api: {
        baseUrl: "/api",
        authEndpoint: "/auth/login"
    }
};

export default CONFIG;
