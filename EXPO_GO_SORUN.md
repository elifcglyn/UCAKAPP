# ⚠️ Expo Go ve expo-sqlite Sorunu

## 🔍 Sorun
**Expo Go, `expo-sqlite` native modülünü desteklemiyor!**

Hata mesajı:
```
TypeError: SQLite.openDatabaseAsync is not a function (it is undefined)
```

## ✅ Çözümler

### Çözüm 1: Development Build Kullanın (ÖNERİLEN)

Expo Go yerine Development Build kullanarak uygulamayı çalıştırın:

```bash
# 1. EAS CLI kur (ilk kez)
npm install -g eas-cli

# 2. EAS hesabı oluştur (ücretsiz)
eas login

# 3. Development build oluştur
eas build --profile development --platform ios
# veya Android için:
eas build --profile development --platform android

# 4. Build tamamlandıktan sonra cihazınıza indirin ve kurun
# 5. npm start ile bağlanın
```

### Çözüm 2: iOS Simülatör / Android Emülatör Kullanın

Native modüller simülatör/emülatörde çalışır:

```bash
# iOS Simülatör (macOS'ta)
npm run ios

# Android Emülatör
npm run android
```

### Çözüm 3: Web Versiyonu (Kısıtlı)

Web'de SQLite çalışmaz ama uygulamanın UI'sını test edebilirsiniz:

```bash
npm start --web
```

## 📱 Neden Expo Go Çalışmıyor?

Expo Go sadece Expo SDK ile önceden derlenmiş native modülleri içerir. `expo-sqlite` gibi bazı modüller için **native kod derleme** gerekir, bu yüzden:

- ❌ Expo Go'da çalışmaz
- ✅ Development Build'de çalışır
- ✅ Simülatör/Emülatör'de çalışır
- ✅ Production build'de çalışır

## 🎯 Hızlı Test İçin

1. **iOS Simülatör kullanın** (macOS'ta):
   ```bash
   npm run ios
   ```

2. **Veya Android Emülatör**:
   ```bash
   npm run android
   ```

Bu şekilde SQLite tam çalışır ve tüm özellikleri test edebilirsiniz!

## ✅ Şu An Yapılacak

1. Terminal'de `npm run ios` veya `npm run android` çalıştırın
2. Simülatör/Emülatör açılacak
3. Uygulama otomatik yüklenecek
4. SQLite tam çalışır!

---

**Not:** Expo Go ile test edemezsiniz, Development Build veya Simülatör/Emülatör kullanın.

