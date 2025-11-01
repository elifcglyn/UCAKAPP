# ⚠️ ÖNEMLİ: Node.js 20 Sorunu ve Çözümü

## 🔴 Mevcut Durum
**Node.js 20.19.4 kullanıyorsunuz** ve Expo SDK 49 ile **uyumsuzluk** var!

Hata: `Unexpected token 'typeof'` ve `expo-sqlite plugin` hataları Node.js 20'den kaynaklanıyor.

## ✅ KESIN ÇÖZÜM: Node.js 18'e Geçin

### Hızlı Kurulum (nvm ile)

```bash
# 1. nvm kuruluysa:
nvm install 18
nvm use 18
nvm alias default 18

# 2. Versiyon kontrolü
node --version  # v18.x.x görmelisiniz

# 3. Projeyi temizle ve yeniden kur
cd "/Users/elifcaglayan/Downloads/uçakapp"
rm -rf node_modules package-lock.json .expo
npm install
npm start
```

### Manuel Kurulum

1. **Node.js 18 LTS indirin:**
   - https://nodejs.org/ adresine gidin
   - **"18.x.x LTS"** versiyonunu seçin
   - macOS için .pkg dosyasını indirin ve kurun

2. **Kurulum sonrası:**
   ```bash
   node --version  # v18.x.x olmalı
   cd "/Users/elifcaglayan/Downloads/uçakapp"
   rm -rf node_modules package-lock.json .expo
   npm install
   npm start
   ```

## 🎯 Node.js 18 ile Neler Değişecek?

✅ Tüm import hataları çözülecek
✅ expo-sqlite sorunsuz çalışacak  
✅ Plugin hataları olmayacak
✅ Syntax hataları olmayacak
✅ Uygulama sorunsuz başlayacak

## ❓ Neden Node.js 18?

- **Expo SDK 49** için resmi önerilen versiyon
- **Node.js 20** ESM modül sistemi değişiklikleri nedeniyle uyumsuz
- **LTS (Long Term Support)** - En stabil versiyon

## 🚀 Node.js 18'e Geçtikten Sonra

```bash
# iOS Simülatör
npm run ios

# VEYA Android Emülatör
npm run android

# VEYA Expo Go (expo-sqlite için Development Build gerekli)
npm start
```

---

**ÖZET:** Node.js 18'e geçmeden sorunları çözemezsiniz. Bu en kesin çözümdür!

