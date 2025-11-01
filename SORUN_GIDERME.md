# 🔧 Sorun Giderme Rehberi

## ❌ expo-sqlite Modül Hatası

### Hata Mesajı:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'expo-sqlite/build/SQLite'
```

### ✅ Çözüm (Uygulandı):
1. `expo-sqlite` versiyonu güncellendi: `~11.3.0` → `~12.0.0`
2. Node modules temizlendi ve yeniden kuruldu:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Eğer Hala Çalışmıyorsa:

#### Seçenek 1: Expo Go Cache Temizleme
```bash
# Expo cache'i temizle
npx expo start --clear

# Veya
expo start -c
```

#### Seçenek 2: Node Modules Yeniden Kurulum
```bash
# Tüm cache'i temizle
rm -rf node_modules
rm -rf .expo
rm package-lock.json

# Yeniden kur
npm install
npx expo start --clear
```

#### Seçenek 3: Expo SDK Güncelleme
Eğer hala sorun varsa, Expo SDK versiyonunu kontrol edin:
```bash
npx expo install expo-sqlite@latest
```

#### Seçenek 4: Development Build Kullanma
Expo Go bazı native modülleri tam desteklemeyebilir. Development Build deneyin:
```bash
# EAS CLI kur
npm install -g eas-cli

# Development build oluştur
eas build --profile development --platform android
```

## 📱 Diğer Yaygın Sorunlar

### "Cannot find module" Hataları
```bash
# Çözüm:
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

### Metro Bundler Hatası
```bash
# Çözüm:
npx expo start --clear
# Veya
watchman watch-del-all
rm -rf node_modules
npm install
```

### SQLite Çalışmıyor
- İlk açılışta yavaş olabilir (normal)
- Uygulamayı kapatıp tekrar açın
- Development Build kullanın

### PDF Oluşturma Çalışmıyor
- Expo Go'da sınırlı destek var
- Development Build kullanın
- Web versiyonunu deneyin: `npm start --web`

### Tarih Seçici Çalışmıyor
- Android'de otomatik kapanır (normal davranış)
- iOS'ta spinner olarak kalır

## 🔍 Debug İpuçları

### Console Logları Kontrol
Uygulama içinde console.log'ları kontrol edin:
- Veritabanı bağlantısı
- Uçuş arama sonuçları
- Hata mesajları

### Expo DevTools
```bash
# Expo DevTools'u aç
npx expo start --dev-client
```

### React Native Debugger
1. Chrome'da `chrome://inspect` açın
2. "Remote debugging" aktif edin
3. Uygulamada shake gesture yapın (Android: Cmd+M / iOS: Cmd+D)

## 📞 Yardım

Eğer sorun devam ederse:
1. Terminal çıktısını paylaşın
2. Hata mesajının tamamını gönderin
3. Node.js ve npm versiyonlarını kontrol edin:
   ```bash
   node --version
   npm --version
   ```

---

**Son Güncelleme:** expo-sqlite versiyonu güncellendi ve node_modules yeniden kuruldu.

