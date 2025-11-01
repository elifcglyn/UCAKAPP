# 🎯 Node.js 18'e Geçiş (ÖNERİLEN ÇÖZÜM)

## ⚠️ Mevcut Durum
Node.js 20.19.4 kullanıyorsunuz ve Expo SDK 49 ile uyumsuzluk var. `expo-sqlite` paketi Node.js 20'de syntax hataları veriyor.

## ✅ Çözüm: Node.js 18 LTS Kullanın

### Yöntem 1: nvm ile (En Kolay)
```bash
# nvm kuruluysa:
nvm install 18
nvm use 18
nvm alias default 18  # Varsayılan yap

# Kontrol:
node --version  # v18.x.x görmelisiniz

# Projeyi temizle ve kur:
cd "/Users/elifcaglayan/Downloads/uçakapp"
rm -rf node_modules package-lock.json .expo
npm install
npm start
```

### Yöntem 2: Node.js 18 Manuel Kurulum
1. **Node.js 18 LTS indirin:**
   - https://nodejs.org/en/download/ adresine gidin
   - "LTS" (Long Term Support) 18.x.x versiyonunu seçin
   - macOS için .pkg dosyasını indirin ve kurun

2. **Kurulum sonrası:**
   ```bash
   # Versiyon kontrolü
   node --version  # v18.x.x olmalı
   
   # Projeyi temizle
   cd "/Users/elifcaglayan/Downloads/uçakapp"
   rm -rf node_modules package-lock.json .expo
   
   # Yeniden kur
   npm install
   npm start
   ```

### Yöntem 3: Homebrew ile (macOS)
```bash
# Node.js 18 kur
brew install node@18

# PATH'e ekle
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Kontrol
node --version  # v18.x.x

# Projeyi temizle ve kur
cd "/Users/elifcaglayan/Downloads/uçakapp"
rm -rf node_modules package-lock.json .expo
npm install
npm start
```

## 🎉 Node.js 18'de Çalışma
Node.js 18 ile:
- ✅ Expo SDK 49 tam uyumlu
- ✅ expo-sqlite sorunsuz çalışır
- ✅ Tüm import'lar doğru çözümlenir
- ✅ Syntax hataları yok

## ⏱️ Tahmini Süre
- nvm ile: 2-3 dakika
- Manuel kurulum: 5-10 dakika

## ❓ Sorular
- **Node.js 18 güvenli mi?** Evet, LTS (Long Term Support) versiyon, en stabil sürüm.
- **Diğer projelerim etkilenir mi?** nvm kullanırsanız hayır, projeler arası geçiş yapabilirsiniz.
- **Node.js 20'ye geri dönebilir miyim?** Evet, `nvm use 20` ile.

---

**Not:** Node.js 18, Expo SDK 49 için resmi olarak önerilen versiyondur. Bu sorunları yaşamazsınız.

