# 📱 Kurulum ve Çalıştırma Talimatları

## ✅ Backend Durumu
**Backend tamamen hazır!** Ayrı bir sunucu gerekmiyor. Tüm veritabanı işlemleri uygulama içinde SQLite ile yapılıyor.

## 🚀 Expo Go ile Çalıştırma

### Yöntem 1: Expo Go (En Kolay - Önerilen)
1. **Expo Go uygulamasını indirin:**
   - iOS: App Store'dan "Expo Go" 
   - Android: Play Store'dan "Expo Go"

2. **Projeyi başlatın:**
   ```bash
   cd "/Users/elifcaglayan/Downloads/uçakapp"
   npm install
   npm start
   ```

3. **QR kodu tarayın:**
   - Terminal'de görünen QR kodu Expo Go ile tarayın
   - Veya aynı WiFi ağında olduğunuzdan emin olun

### ⚠️ Not: Bazı Modüller İçin Development Build Gerekebilir
Eğer Expo Go'da sorun yaşarsanız (özellikle PDF veya SQLite için), şu adımları izleyin:

### Yöntem 2: Development Build (Daha Güçlü)
```bash
# EAS CLI kurulumu (ilk kez)
npm install -g eas-cli

# EAS hesabı oluştur (ücretsiz)
eas login

# Development build oluştur
eas build --profile development --platform android
# veya iOS için:
eas build --profile development --platform ios
```

### Yöntem 3: Yerel Geliştirme (Android Studio / Xcode)
```bash
# Android için
npm run android

# iOS için (sadece macOS)
npm run ios
```

## 📋 Gereksinimler

- **Node.js** (v16 veya üzeri)
- **npm** veya **yarn**
- **Expo CLI** (npm install -g expo-cli) - npm start ile otomatik kurulur
- Mobil cihazda **Expo Go** uygulaması

## 🔧 Sorun Giderme

### "Module not found" hatası
```bash
rm -rf node_modules
npm install
```

### SQLite çalışmıyor
- Expo Go'da bazen ilk açılışta yavaş olabilir
- Uygulamayı kapatıp tekrar açın
- Development Build kullanmayı deneyin

### PDF oluşturma çalışmıyor
- Expo Go'da sınırlı çalışabilir
- Development Build kullanın veya web versiyonunu deneyin:
  ```bash
  npm start --web
  ```

## ✅ Test Listesi

Uygulamanın çalıştığını test etmek için:

1. ✅ Ana ekran açılıyor mu?
2. ✅ Şehir seçimi yapılabiliyor mu?
3. ✅ Tarih seçimi çalışıyor mu?
4. ✅ Uçuş arama sonuç veriyor mu?
5. ✅ Sepete ekleme çalışıyor mu?
6. ✅ Rezervasyon formu açılıyor mu?
7. ✅ Veritabanına kayıt yapılıyor mu?
8. ✅ PDF oluşturuluyor mu?

## 🎯 Hızlı Başlangıç

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Uygulamayı başlat
npm start

# 3. QR kodu Expo Go ile tara
# VEYA

# 3b. Android emülatörde çalıştır
npm run android

# 3c. iOS simülatörde çalıştır (sadece macOS)
npm run ios
```

## 📝 Önemli Notlar

- **İlk çalıştırmada:** Veritabanı otomatik oluşturulur ve örnek veriler eklenir
- **Veritabanı:** SQLite dosyası cihazda saklanır (silinirse veriler gider)
- **PDF:** Rezervasyon sonrası cihaza kaydedilir ve paylaşılabilir

---

**Sorun mu yaşıyorsunuz?** Terminal çıktısını kontrol edin ve hata mesajlarını paylaşın!

