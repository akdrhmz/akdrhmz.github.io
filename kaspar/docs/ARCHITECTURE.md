# 🦁 KASPAR CHESS ACADEMY 2.0 - ARCHITECTURE & DESIGN

**Version:** 2.0 (Draft)
**Date:** 2026-02-01
**Owner:** Kadir Hamza & Jarvis

---

## 1. 🎯 VİZYON VE AMAÇ
**"Çocuklar için Akıllı ve Adaptif Satranç Koçu"**

- **Hedef Kitle:**
  - **Yeğen (8 Yaş):** Turnuva oyuncusu. Zayıf yön analizi ve ileri seviye taktikler.
  - **Ömer Faruk:** Başlangıç/Orta seviye. Eğlenceli öğrenme ve temel stratejiler.
- **Ana Hedef:** Çocukların seviyesini otomatik tespit edip, onlara uygun zorlukta (ELO) maçlar yaptırmak ve her maçtan sonra "neden kazandın/kaybettin" analizi sunmak.

---

## 2. 🏗️ TEKNİK MİMARİ

### A. Bileşenler
1.  **FRONTEND (Yüz):**
    - **Teknoloji:** HTML5, CSS3, Vanilla JS (Modüler).
    - **Host:** GitHub Pages (`akdrhmz.github.io/kaspar`).
    - **Özellikler:** Profil Seçimi, Ebeveyn Paneli, Oyun Tahtası, Analiz Ekranı.
2.  **BACKEND (Beyin):**
    - **Yer:** `kadir-pc` (Ev Sunucusu).
    - **Teknoloji:** Python (Flask), SQLite.
    - **Görevi:** Veri saklama, Auth yönetimi, API sunumu.
3.  **ENGINE (Kas):**
    - **Araç:** Stockfish (On-Demand).
    - **Çalışma:** Sadece analiz/hamle anında çalışır, boşta kapanır (RAM tasarrufu).
4.  **AI COACH (Akıl):**
    - **Araç:** Google Gemini (Antigravity).
    - **Görevi:** Maç yorumlama, hata analizi, rapor yazma.

### B. Bağlantı (Tunnel)
- **Tailscale Funnel:** Dış dünyadan (GitHub Pages) evdeki sunucuya (`kadir-pc`) güvenli erişim sağlar.

---

## 3. 🔐 GÜVENLİK VE KİMLİK (AUTH)

### A. Kullanıcı Hiyerarşisi
1.  **👑 Admin (Jarvis/Kadir):** Tam yetki.
2.  **👨‍👩‍👧‍👦 Ebeveyn:** Çocuk ekler, şifre sıfırlar, rapor görür.
3.  **👶 Öğrenci:** Sadece oyun oynar. (Korumalı Profil: PIN/Resimli Şifre).

### B. "Kasa" (Vault) Sistemi
- **Veritabanı:** Şifreler `bcrypt` ile hashlenir. API anahtarları veritabanında tutulmaz.
- **Vault:** API anahtarları sunucuda (`brain/vault/`) şifreli dosyalar olarak saklanır.
- **Dinamik Enjeksiyon:** Analiz sırasında anahtar kasadan alınıp motora takılır, iş bitince silinir.

### C. Güç Havuzu (Smart Power Pool)
1.  **Önce Sen:** Ebeveyn kendi Google hesabını bağlamışsa, sistem onu kullanır.
2.  **Havuz:** Eğer ebeveynin kotası biterse, sistem otomatik olarak **Ortak Havuzdan** (diğer boşta olan anahtarlardan) güç çeker.
3.  **Acil Durum (SOS):** Tüm sistem çökerse, Jarvis'e "İmdat" sinyali gider. Master Key devreye girer.

---

## 4. 📊 VERİ VE ANALİTİK

### A. Veritabanı Şeması
- `Users`: Ebeveyn bilgileri.
- `Children`: Çocuk profilleri (ELO, Yaş, Avatar).
- `Games`: PGN (Hamleler), Sonuç, Tarih.
- `Stats`: Haftalık gelişim verileri.

### B. ELO Sistemi (Akıllı Zorluk)
- Çocuğun ELO puanına göre Stockfish seviyesi (0-20) otomatik ayarlanır.
- Kazanınca zorlaşır, kaybedince kolaylaşır (Adaptif).

### C. Yedekleme (Backup)
- **Google Drive:** Her gece 04:00'te veritabanı şifreli olarak 2TB Drive hesabına yedeklenir.
- Veriler asla silinmez, tarihçeli saklanır.

---

## 5. 🚀 YOL HARİTASI (TODO)
- [ ] Backend: Multi-tenant DB & ELO Engine (Ajan Kodluyor...)
- [ ] Frontend: Profil Ekranı & Ebeveyn Paneli (Ajan Kodluyor...)
- [ ] Auth: Google Login Entegrasyonu.
- [ ] Backup: Google Drive Scripti.

---
*Bu belge Jarvis tarafından 01.02.2026 tarihinde oluşturulmuştur.*
