# ⚠️ Node.js 20 Uyumluluk Sorunu

## 🔍 Sorun
Node.js 20, Expo SDK 49 ile birlikte kullanıldığında ESM modül çözümleme sorunları yaşanıyor. `expo-sqlite` ve bağımlı paketlerde extension'sız import'lar var.

## ✅ Geçici Çözümler

### Çözüm 1: Node.js 18 Kullanın (ÖNERİLEN)
```bash
# nvm kullanıyorsanız:
nvm install 18
nvm use 18

# Veya doğrudan Node.js 18 indirin:
# https://nodejs.org/
```

### Çözüm 2: Fix Script Kullanın
`fix-sqlite.js` script'i otomatik olarak bazı import'ları düzeltiyor:
```bash
node fix-sqlite.js
npm start
```

**Not:** Bu çözüm tüm import'ları düzeltemeyebilir.

### Çözüm 3: Development Build Kullanın
Expo Go yerine Development Build kullanarak native modülleri daha iyi destekleyin:
```bash
npm install -g eas-cli
eas build --profile development --platform android
```

## 🎯 En İyi Çözüm: Node.js 18

Node.js 18, Expo SDK 49 ile en uyumlu versiyondur. Node.js 20'de yaşanan ESM sorunları Node.js 18'de yoktur.

### Node.js 18 Kurulumu:
1. **nvm ile:**
   ```bash
   nvm install 18
   nvm use 18
   ```

2. **Doğrudan indirme:**
   - https://nodejs.org/en/download/ adresinden Node.js 18 LTS indirin
   - Kurulum sonrası: `node --version` (v18.x.x görmelisiniz)

3. **Kurulum sonrası:**
   ```bash
   cd "/Users/elifcaglayan/Downloads/uçakapp"
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

## 📝 Mevcut Durum

- ✅ `fix-sqlite.js` script'i oluşturuldu
- ✅ `postinstall` hook eklendi
- ⚠️ Bazı import'lar hala düzeltilmedi (derin bağımlılıklar)

## 🚀 Hızlı Başlangıç (Node.js 18 ile)

```bash
# 1. Node.js 18'e geçin
nvm use 18  # veya Node.js 18 kurun

# 2. Projeyi temizleyin
cd "/Users/elifcaglayan/Downloads/uçakapp"
rm -rf node_modules package-lock.json

# 3. Yeniden kurun
npm install

# 4. Başlatın
npm start
```

---

**Öneri:** Node.js 18 kullanmak en sorunsuz çözümdür! 🎯

