# 🔧 "too many open files" (EMFILE) Hatası Çözümü

## 🔍 Sorun
macOS'ta Metro Bundler çok fazla dosya açmaya çalışıyor ve sistem limitine ulaşıyor.

## ✅ Hızlı Çözüm

### 1. Watchman Kurulumu (ÖNERİLEN)
```bash
# Homebrew ile Watchman kur
brew install watchman

# Kurulum sonrası
cd "/Users/elifcaglayan/Downloads/uçakapp"
npm start
```

Watchman, dosya izlemeyi çok daha verimli yapar ve EMFILE hatasını önler.

### 2. Sistem Limitini Artırma (Geçici)
```bash
# Mevcut limiti kontrol et
ulimit -n

# Limit'i artır (terminal session için)
ulimit -n 4096

# Veya kalıcı olarak:
echo "ulimit -n 4096" >> ~/.zshrc
source ~/.zshrc

# Sonra tekrar dene
npm start
```

### 3. .watchmanconfig Dosyası Ekle
```bash
cd "/Users/elifcaglayan/Downloads/uçakapp"
echo '{}' > .watchmanconfig
npm start
```

### 4. Metro Cache Temizle
```bash
cd "/Users/elifcaglayan/Downloads/uçakapp"
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear
```

## 🎯 En İyi Çözüm
**Watchman kurulumu yapın** - Bu sorunu tamamen çözer ve Expo projeleri için önerilir.

```bash
brew install watchman
```

---

**Not:** Watchman kurulumu sonrası uygulama sorunsuz çalışacaktır!

