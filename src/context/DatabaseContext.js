import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const DatabaseContext = createContext(null);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};

export default function DatabaseProvider({ children }) {
  const [db, setDb] = useState(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      // Expo Go'da expo-sqlite çalışmayabilir, kontrol et
      if (!SQLite || !SQLite.openDatabaseAsync) {
        console.warn('expo-sqlite not available in Expo Go. Using in-memory fallback.');
        // Fallback: AsyncStorage kullan (geçici çözüm)
        return;
      }
      const database = await SQLite.openDatabaseAsync('ucakapp.db');
      
      // İller tablosu
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS iller (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          il_adi TEXT NOT NULL UNIQUE
        );
      `);

      // Havayolu firmaları tablosu
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS havayolu_firmalari (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firma_adi TEXT NOT NULL UNIQUE
        );
      `);

      // Uçak seferleri tablosu
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS ucak_seferleri (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          havayolu_adi TEXT NOT NULL,
          kalkis_saati TEXT NOT NULL,
          nereden TEXT NOT NULL,
          havalimani TEXT NOT NULL,
          varis_saati TEXT NOT NULL,
          varis_havalimani TEXT NOT NULL,
          tarih TEXT NOT NULL,
          fiyat REAL NOT NULL,
          FOREIGN KEY (havayolu_adi) REFERENCES havayolu_firmalari(firma_adi),
          FOREIGN KEY (nereden) REFERENCES iller(il_adi)
        );
      `);

      // Rezervasyonlar tablosu
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS rezervasyonlar (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ucus_id INTEGER NOT NULL,
          ad TEXT NOT NULL,
          soyad TEXT NOT NULL,
          tc_no TEXT NOT NULL,
          tel_no TEXT NOT NULL,
          email TEXT NOT NULL,
          rezervasyon_tarihi TEXT NOT NULL,
          FOREIGN KEY (ucus_id) REFERENCES ucak_seferleri(id)
        );
      `);

      // İlleri ekle - Türkiye'nin 81 ili
      const iller = [
        'ADANA', 'ADIYAMAN', 'AFYONKARAHİSAR', 'AĞRI', 'AKSARAY', 'AMASYA',
        'ANKARA', 'ANTALYA', 'ARDAHAN', 'ARTVİN', 'AYDIN', 'BALIKESİR',
        'BARTIN', 'BATMAN', 'BAYBURT', 'BİLECİK', 'BİNGÖL', 'BİTLİS',
        'BOLU', 'BURDUR', 'BURSA', 'ÇANAKKALE', 'ÇANKIRI', 'ÇORUM',
        'DENİZLİ', 'DİYARBAKIR', 'DÜZCE', 'EDİRNE', 'ELAZIĞ', 'ERZİNCAN',
        'ERZURUM', 'ESKİŞEHİR', 'GAZİANTEP', 'GİRESUN', 'GÜMÜŞHANE', 'HAKKARİ',
        'HATAY', 'IĞDIR', 'ISPARTA', 'İSTANBUL', 'İZMİR', 'KAHRAMANMARAŞ',
        'KARABÜK', 'KARAMAN', 'KARS', 'KASTAMONU', 'KAYSERİ', 'KİLİS',
        'KIRIKKALE', 'KIRKLARELİ', 'KIRŞEHİR', 'KOCAELİ', 'KONYA', 'KÜTAHYA',
        'MALATYA', 'MANİSA', 'MARDİN', 'MERSİN', 'MUĞLA', 'MUŞ',
        'NEVŞEHİR', 'NİĞDE', 'ORDU', 'OSMANİYE', 'RİZE', 'SAKARYA',
        'SAMSUN', 'SİİRT', 'SİNOP', 'SİVAS', 'ŞANLIURFA', 'ŞIRNAK',
        'TEKİRDAĞ', 'TOKAT', 'TRABZON', 'TUNCELİ', 'UŞAK', 'VAN',
        'YALOVA', 'YOZGAT', 'ZONGULDAK'
      ];
      for (const il of iller) {
        try {
          await database.runAsync(
            'INSERT OR IGNORE INTO iller (il_adi) VALUES (?)',
            [il]
          );
        } catch (error) {
          console.log(`Il ${il} zaten var veya hata:`, error);
        }
      }

      // Havayolu firmalarını ekle
      const firmalar = ['THY', 'PEGASUS', 'ANADOLUJET'];
      for (const firma of firmalar) {
        try {
          await database.runAsync(
            'INSERT OR IGNORE INTO havayolu_firmalari (firma_adi) VALUES (?)',
            [firma]
          );
        } catch (error) {
          console.log(`Firma ${firma} zaten var veya hata:`, error);
        }
      }

      // Örnek uçuş seferleri ekle - Dinamik tarihler (bugünden itibaren 30 gün)
      const bugun = new Date();
      const formatDate = (daysFromToday) => {
        const tarih = new Date(bugun);
        tarih.setDate(tarih.getDate() + daysFromToday);
        return tarih.toISOString().split('T')[0]; // YYYY-MM-DD formatı
      };

      const seferler = [
        // İSTANBUL'dan
        { havayolu: 'THY', kalkis: '08:00', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis: '09:30', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(1), fiyat: 1200 },
        { havayolu: 'THY', kalkis: '14:00', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis: '15:30', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(1), fiyat: 1300 },
        { havayolu: 'PEGASUS', kalkis: '10:00', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis: '11:45', varis_havalimani: 'İzmir Adnan Menderes Havalimanı', tarih: formatDate(2), fiyat: 950 },
        { havayolu: 'ANADOLUJET', kalkis: '07:30', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis: '08:45', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(3), fiyat: 750 },
        { havayolu: 'THY', kalkis: '06:30', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis: '08:15', varis_havalimani: 'Antalya Havalimanı', tarih: formatDate(1), fiyat: 1150 },
        { havayolu: 'PEGASUS', kalkis: '18:00', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis: '19:30', varis_havalimani: 'İzmir Adnan Menderes Havalimanı', tarih: formatDate(2), fiyat: 980 },
        { havayolu: 'THY', kalkis: '11:00', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis: '13:20', varis_havalimani: 'Trabzon Havalimanı', tarih: formatDate(4), fiyat: 1400 },
        { havayolu: 'ANADOLUJET', kalkis: '09:15', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis: '11:00', varis_havalimani: 'Bodrum Milas Havalimanı', tarih: formatDate(5), fiyat: 850 },
        { havayolu: 'THY', kalkis: '16:00', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis: '18:30', varis_havalimani: 'Trabzon Havalimanı', tarih: formatDate(6), fiyat: 1420 },
        // ANKARA'dan
        { havayolu: 'ANADOLUJET', kalkis: '16:00', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis: '17:30', varis_havalimani: 'Antalya Havalimanı', tarih: formatDate(4), fiyat: 800 },
        { havayolu: 'THY', kalkis: '07:45', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis: '09:15', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(1), fiyat: 1180 },
        { havayolu: 'THY', kalkis: '13:30', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis: '15:00', varis_havalimani: 'İzmir Adnan Menderes Havalimanı', tarih: formatDate(2), fiyat: 1100 },
        { havayolu: 'PEGASUS', kalkis: '10:20', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis: '12:10', varis_havalimani: 'Trabzon Havalimanı', tarih: formatDate(4), fiyat: 1050 },
        { havayolu: 'THY', kalkis: '17:00', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis: '18:30', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1190 },
        // İZMİR'den
        { havayolu: 'THY', kalkis: '09:00', nereden: 'İZMİR', havalimani: 'İzmir Adnan Menderes Havalimanı', varis: '10:30', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1100 },
        { havayolu: 'PEGASUS', kalkis: '15:30', nereden: 'İZMİR', havalimani: 'İzmir Adnan Menderes Havalimanı', varis: '16:45', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1020 },
        { havayolu: 'THY', kalkis: '08:15', nereden: 'İZMİR', havalimani: 'İzmir Adnan Menderes Havalimanı', varis: '09:45', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(2), fiyat: 1080 },
        // ANTALYA'dan
        { havayolu: 'PEGASUS', kalkis: '12:00', nereden: 'ANTALYA', havalimani: 'Antalya Havalimanı', varis: '13:15', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(6), fiyat: 1050 },
        { havayolu: 'THY', kalkis: '17:00', nereden: 'ANTALYA', havalimani: 'Antalya Havalimanı', varis: '18:15', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(6), fiyat: 1120 },
        { havayolu: 'ANADOLUJET', kalkis: '14:30', nereden: 'ANTALYA', havalimani: 'Antalya Havalimanı', varis: '16:00', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(4), fiyat: 890 },
        // Diğer şehirlerden
        { havayolu: 'THY', kalkis: '09:30', nereden: 'BURSA', havalimani: 'Yenişehir Havalimanı', varis: '10:45', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(7), fiyat: 950 },
        { havayolu: 'PEGASUS', kalkis: '11:15', nereden: 'TRABZON', havalimani: 'Trabzon Havalimanı', varis: '13:00', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1250 },
        { havayolu: 'THY', kalkis: '10:45', nereden: 'ADANA', havalimani: 'Şakirpaşa Havalimanı', varis: '12:30', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(6), fiyat: 1350 },
        { havayolu: 'ANADOLUJET', kalkis: '08:30', nereden: 'KAYSERİ', havalimani: 'Kayseri Havalimanı', varis: '10:15', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(7), fiyat: 920 },
        { havayolu: 'PEGASUS', kalkis: '16:45', nereden: 'GAZİANTEP', havalimani: 'Gaziantep Havalimanı', varis: '18:20', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1280 },
        { havayolu: 'THY', kalkis: '13:00', nereden: 'DİYARBAKIR', havalimani: 'Diyarbakır Havalimanı', varis: '14:45', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(4), fiyat: 1450 },
        { havayolu: 'THY', kalkis: '12:30', nereden: 'ESKİŞEHİR', havalimani: 'Hasan Polatkan Havalimanı', varis: '13:45', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(6), fiyat: 880 },
        { havayolu: 'PEGASUS', kalkis: '07:00', nereden: 'SAMSUN', havalimani: 'Çarşamba Havalimanı', varis: '08:30', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(7), fiyat: 980 },
      ];

      for (const sefer of seferler) {
        try {
          await database.runAsync(
            `INSERT OR IGNORE INTO ucak_seferleri 
            (havayolu_adi, kalkis_saati, nereden, havalimani, varis_saati, varis_havalimani, tarih, fiyat) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              sefer.havayolu,
              sefer.kalkis,
              sefer.nereden,
              sefer.havalimani,
              sefer.varis,
              sefer.varis_havalimani,
              sefer.tarih,
              sefer.fiyat
            ]
          );
        } catch (error) {
          console.log('Sefer ekleme hatası:', error);
        }
      }

      setDb(database);
      console.log('Veritabanı başarıyla hazırlandı');
    } catch (error) {
      console.error('Veritabanı hatası:', error);
    }
  };

  const searchFlights = async (nereden, nereye, baslangicTarihi, bitisTarihi) => {
    // Expo Go'da SQLite çalışmıyorsa örnek veri dön
    if (!db) {
      // Örnek uçuş verileri (Expo Go için fallback) - Dinamik tarihler
      // Bugünden itibaren 30 gün boyunca uçuşlar
      const bugun = new Date();
      const formatDate = (daysFromToday) => {
        const tarih = new Date(bugun);
        tarih.setDate(tarih.getDate() + daysFromToday);
        return tarih.toISOString().split('T')[0]; // YYYY-MM-DD formatı
      };

      const ornekUcuslar = [
        // İSTANBUL'dan (bugünden itibaren 30 güne yayılmış)
        { id: 1, havayolu_adi: 'THY', kalkis_saati: '08:00', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis_saati: '09:30', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(1), fiyat: 1200 },
        { id: 2, havayolu_adi: 'THY', kalkis_saati: '14:00', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis_saati: '15:30', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(1), fiyat: 1300 },
        { id: 3, havayolu_adi: 'PEGASUS', kalkis_saati: '10:00', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis_saati: '11:45', varis_havalimani: 'İzmir Adnan Menderes Havalimanı', tarih: formatDate(2), fiyat: 950 },
        { id: 4, havayolu_adi: 'ANADOLUJET', kalkis_saati: '07:30', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis_saati: '08:45', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(3), fiyat: 750 },
        { id: 5, havayolu_adi: 'THY', kalkis_saati: '06:30', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis_saati: '08:15', varis_havalimani: 'Antalya Havalimanı', tarih: formatDate(1), fiyat: 1150 },
        { id: 6, havayolu_adi: 'PEGASUS', kalkis_saati: '18:00', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis_saati: '19:30', varis_havalimani: 'İzmir Adnan Menderes Havalimanı', tarih: formatDate(2), fiyat: 980 },
        { id: 7, havayolu_adi: 'THY', kalkis_saati: '11:00', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis_saati: '13:20', varis_havalimani: 'Trabzon Havalimanı', tarih: formatDate(4), fiyat: 1400 },
        { id: 8, havayolu_adi: 'ANADOLUJET', kalkis_saati: '09:15', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis_saati: '11:00', varis_havalimani: 'Bodrum Milas Havalimanı', tarih: formatDate(5), fiyat: 850 },
        { id: 25, havayolu_adi: 'THY', kalkis_saati: '16:00', nereden: 'İSTANBUL', havalimani: 'İstanbul Havalimanı', varis_saati: '18:30', varis_havalimani: 'Trabzon Havalimanı', tarih: formatDate(6), fiyat: 1420 },
        { id: 26, havayolu_adi: 'PEGASUS', kalkis_saati: '12:30', nereden: 'İSTANBUL', havalimani: 'Sabiha Gökçen Havalimanı', varis_saati: '14:00', varis_havalimani: 'Adana Şakirpaşa Havalimanı', tarih: formatDate(7), fiyat: 1100 },
        // ANKARA'dan
        { id: 9, havayolu_adi: 'ANADOLUJET', kalkis_saati: '16:00', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis_saati: '17:30', varis_havalimani: 'Antalya Havalimanı', tarih: formatDate(4), fiyat: 800 },
        { id: 10, havayolu_adi: 'THY', kalkis_saati: '07:45', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis_saati: '09:15', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(1), fiyat: 1180 },
        { id: 11, havayolu_adi: 'THY', kalkis_saati: '13:30', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis_saati: '15:00', varis_havalimani: 'İzmir Adnan Menderes Havalimanı', tarih: formatDate(2), fiyat: 1100 },
        { id: 12, havayolu_adi: 'PEGASUS', kalkis_saati: '10:20', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis_saati: '12:10', varis_havalimani: 'Trabzon Havalimanı', tarih: formatDate(4), fiyat: 1050 },
        { id: 27, havayolu_adi: 'THY', kalkis_saati: '17:00', nereden: 'ANKARA', havalimani: 'Ankara Esenboğa Havalimanı', varis_saati: '18:30', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1190 },
        // İZMİR'den
        { id: 13, havayolu_adi: 'THY', kalkis_saati: '09:00', nereden: 'İZMİR', havalimani: 'İzmir Adnan Menderes Havalimanı', varis_saati: '10:30', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1100 },
        { id: 14, havayolu_adi: 'PEGASUS', kalkis_saati: '15:30', nereden: 'İZMİR', havalimani: 'İzmir Adnan Menderes Havalimanı', varis_saati: '16:45', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1020 },
        { id: 15, havayolu_adi: 'THY', kalkis_saati: '08:15', nereden: 'İZMİR', havalimani: 'İzmir Adnan Menderes Havalimanı', varis_saati: '09:45', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(2), fiyat: 1080 },
        // ANTALYA'dan
        { id: 16, havayolu_adi: 'PEGASUS', kalkis_saati: '12:00', nereden: 'ANTALYA', havalimani: 'Antalya Havalimanı', varis_saati: '13:15', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(6), fiyat: 1050 },
        { id: 17, havayolu_adi: 'THY', kalkis_saati: '17:00', nereden: 'ANTALYA', havalimani: 'Antalya Havalimanı', varis_saati: '18:15', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(6), fiyat: 1120 },
        { id: 18, havayolu_adi: 'ANADOLUJET', kalkis_saati: '14:30', nereden: 'ANTALYA', havalimani: 'Antalya Havalimanı', varis_saati: '16:00', varis_havalimani: 'Ankara Esenboğa Havalimanı', tarih: formatDate(4), fiyat: 890 },
        // Diğer şehirlerden
        { id: 19, havayolu_adi: 'THY', kalkis_saati: '09:30', nereden: 'BURSA', havalimani: 'Yenişehir Havalimanı', varis_saati: '10:45', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(7), fiyat: 950 },
        { id: 20, havayolu_adi: 'PEGASUS', kalkis_saati: '11:15', nereden: 'TRABZON', havalimani: 'Trabzon Havalimanı', varis_saati: '13:00', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1250 },
        { id: 21, havayolu_adi: 'THY', kalkis_saati: '10:45', nereden: 'ADANA', havalimani: 'Şakirpaşa Havalimanı', varis_saati: '12:30', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(6), fiyat: 1350 },
        { id: 22, havayolu_adi: 'ANADOLUJET', kalkis_saati: '08:30', nereden: 'KAYSERİ', havalimani: 'Kayseri Havalimanı', varis_saati: '10:15', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(7), fiyat: 920 },
        { id: 23, havayolu_adi: 'PEGASUS', kalkis_saati: '16:45', nereden: 'GAZİANTEP', havalimani: 'Gaziantep Havalimanı', varis_saati: '18:20', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(5), fiyat: 1280 },
        { id: 24, havayolu_adi: 'THY', kalkis_saati: '13:00', nereden: 'DİYARBAKIR', havalimani: 'Diyarbakır Havalimanı', varis_saati: '14:45', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(4), fiyat: 1450 },
        { id: 28, havayolu_adi: 'THY', kalkis_saati: '12:30', nereden: 'ESKİŞEHİR', havalimani: 'Hasan Polatkan Havalimanı', varis_saati: '13:45', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(6), fiyat: 880 },
        { id: 29, havayolu_adi: 'PEGASUS', kalkis_saati: '07:00', nereden: 'SAMSUN', havalimani: 'Çarşamba Havalimanı', varis_saati: '08:30', varis_havalimani: 'İstanbul Havalimanı', tarih: formatDate(7), fiyat: 980 },
      ];
      
      // Filtreleme yap
      let sonuc = ornekUcuslar.filter(ucus => {
        // Tarih karşılaştırması (string format: YYYY-MM-DD)
        const ucusTarihi = ucus.tarih;
        const basTarih = typeof baslangicTarihi === 'string' ? baslangicTarihi : baslangicTarihi.split('T')[0];
        const bitTarih = typeof bitisTarihi === 'string' ? bitisTarihi : bitisTarihi.split('T')[0];
        const tarihUygun = ucusTarihi >= basTarih && ucusTarihi <= bitTarih;
        
        const neredenUygun = ucus.nereden === nereden;
        
        // Nereye filtresi - şehir adını havalimanı isminde ara
        let nereyeUygun = true;
        if (nereye) {
          const nereyeLower = nereye.toLowerCase();
          const varisHavalimaniLower = ucus.varis_havalimani.toLowerCase();
          
          // Şehir adı direkt havalimanı isminde geçiyor mu kontrol et
          nereyeUygun = varisHavalimaniLower.includes(nereyeLower) ||
            // Özel eşleşmeler
            (nereyeLower === 'ankara' && (varisHavalimaniLower.includes('esenboğa') || varisHavalimaniLower.includes('ankara'))) ||
            (nereyeLower === 'izmir' && (varisHavalimaniLower.includes('adnan menderes') || varisHavalimaniLower.includes('izmir'))) ||
            (nereyeLower === 'istanbul' && (varisHavalimaniLower.includes('istanbul') || varisHavalimaniLower.includes('sabiha') || varisHavalimaniLower.includes('havalimanı'))) ||
            (nereyeLower === 'antalya' && varisHavalimaniLower.includes('antalya')) ||
            (nereyeLower === 'trabzon' && varisHavalimaniLower.includes('trabzon')) ||
            (nereyeLower === 'adana' && varisHavalimaniLower.includes('adana')) ||
            (nereyeLower === 'bursa' && varisHavalimaniLower.includes('bursa')) ||
            (nereyeLower === 'kayseri' && varisHavalimaniLower.includes('kayseri')) ||
            (nereyeLower === 'gaziantep' && varisHavalimaniLower.includes('gaziantep')) ||
            (nereyeLower === 'diyarbakır' && varisHavalimaniLower.includes('diyarbakır')) ||
            (nereyeLower === 'muğla' && (varisHavalimaniLower.includes('bodrum') || varisHavalimaniLower.includes('milas')));
        }
        
        return tarihUygun && neredenUygun && nereyeUygun;
      });
      
      return sonuc;
    }

    try {
      let query = `SELECT * FROM ucak_seferleri 
                   WHERE nereden = ? 
                   AND tarih >= ? 
                   AND tarih <= ?`;
      
      const params = [nereden, baslangicTarihi, bitisTarihi];

      // Eğer nereye belirtilmişse, varis_havalimani'nde arama yap
      if (nereye) {
        // Şehir adını havalimanı ismine göre eşleştir
        const cityPatterns = {
          'ANKARA': ['ankara', 'esenboğa'],
          'İZMİR': ['izmir', 'adnan menderes'],
          'ANTALYA': ['antalya'],
          'İSTANBUL': ['istanbul', 'sabiha gökçen', 'havalimanı']
        };
        
        const patterns = cityPatterns[nereye] || [nereye.toLowerCase()];
        const whereConditions = patterns.map(() => 'varis_havalimani LIKE ?').join(' OR ');
        query += ` AND (${whereConditions})`;
        patterns.forEach(pattern => params.push(`%${pattern}%`));
      }

      query += ' ORDER BY tarih, kalkis_saati';

      const result = await db.getAllAsync(query, params);
      return result;
    } catch (error) {
      console.error('Uçuş arama hatası:', error);
      return [];
    }
  };

  const getAllCities = async () => {
    // Expo Go'da SQLite çalışmıyorsa Türkiye'nin 81 ilini dön
    if (!db) {
      return [
        { id: 1, il_adi: 'ADANA' }, { id: 2, il_adi: 'ADIYAMAN' }, { id: 3, il_adi: 'AFYONKARAHİSAR' },
        { id: 4, il_adi: 'AĞRI' }, { id: 5, il_adi: 'AKSARAY' }, { id: 6, il_adi: 'AMASYA' },
        { id: 7, il_adi: 'ANKARA' }, { id: 8, il_adi: 'ANTALYA' }, { id: 9, il_adi: 'ARDAHAN' },
        { id: 10, il_adi: 'ARTVİN' }, { id: 11, il_adi: 'AYDIN' }, { id: 12, il_adi: 'BALIKESİR' },
        { id: 13, il_adi: 'BARTIN' }, { id: 14, il_adi: 'BATMAN' }, { id: 15, il_adi: 'BAYBURT' },
        { id: 16, il_adi: 'BİLECİK' }, { id: 17, il_adi: 'BİNGÖL' }, { id: 18, il_adi: 'BİTLİS' },
        { id: 19, il_adi: 'BOLU' }, { id: 20, il_adi: 'BURDUR' }, { id: 21, il_adi: 'BURSA' },
        { id: 22, il_adi: 'ÇANAKKALE' }, { id: 23, il_adi: 'ÇANKIRI' }, { id: 24, il_adi: 'ÇORUM' },
        { id: 25, il_adi: 'DENİZLİ' }, { id: 26, il_adi: 'DİYARBAKIR' }, { id: 27, il_adi: 'DÜZCE' },
        { id: 28, il_adi: 'EDİRNE' }, { id: 29, il_adi: 'ELAZIĞ' }, { id: 30, il_adi: 'ERZİNCAN' },
        { id: 31, il_adi: 'ERZURUM' }, { id: 32, il_adi: 'ESKİŞEHİR' }, { id: 33, il_adi: 'GAZİANTEP' },
        { id: 34, il_adi: 'GİRESUN' }, { id: 35, il_adi: 'GÜMÜŞHANE' }, { id: 36, il_adi: 'HAKKARİ' },
        { id: 37, il_adi: 'HATAY' }, { id: 38, il_adi: 'IĞDIR' }, { id: 39, il_adi: 'ISPARTA' },
        { id: 40, il_adi: 'İSTANBUL' }, { id: 41, il_adi: 'İZMİR' }, { id: 42, il_adi: 'KAHRAMANMARAŞ' },
        { id: 43, il_adi: 'KARABÜK' }, { id: 44, il_adi: 'KARAMAN' }, { id: 45, il_adi: 'KARS' },
        { id: 46, il_adi: 'KASTAMONU' }, { id: 47, il_adi: 'KAYSERİ' }, { id: 48, il_adi: 'KİLİS' },
        { id: 49, il_adi: 'KIRIKKALE' }, { id: 50, il_adi: 'KIRKLARELİ' }, { id: 51, il_adi: 'KIRŞEHİR' },
        { id: 52, il_adi: 'KOCAELİ' }, { id: 53, il_adi: 'KONYA' }, { id: 54, il_adi: 'KÜTAHYA' },
        { id: 55, il_adi: 'MALATYA' }, { id: 56, il_adi: 'MANİSA' }, { id: 57, il_adi: 'MARDİN' },
        { id: 58, il_adi: 'MERSİN' }, { id: 59, il_adi: 'MUĞLA' }, { id: 60, il_adi: 'MUŞ' },
        { id: 61, il_adi: 'NEVŞEHİR' }, { id: 62, il_adi: 'NİĞDE' }, { id: 63, il_adi: 'ORDU' },
        { id: 64, il_adi: 'OSMANİYE' }, { id: 65, il_adi: 'RİZE' }, { id: 66, il_adi: 'SAKARYA' },
        { id: 67, il_adi: 'SAMSUN' }, { id: 68, il_adi: 'SİİRT' }, { id: 69, il_adi: 'SİNOP' },
        { id: 70, il_adi: 'SİVAS' }, { id: 71, il_adi: 'ŞANLIURFA' }, { id: 72, il_adi: 'ŞIRNAK' },
        { id: 73, il_adi: 'TEKİRDAĞ' }, { id: 74, il_adi: 'TOKAT' }, { id: 75, il_adi: 'TRABZON' },
        { id: 76, il_adi: 'TUNCELİ' }, { id: 77, il_adi: 'UŞAK' }, { id: 78, il_adi: 'VAN' },
        { id: 79, il_adi: 'YALOVA' }, { id: 80, il_adi: 'YOZGAT' }, { id: 81, il_adi: 'ZONGULDAK' },
      ];
    }
    try {
      return await db.getAllAsync('SELECT * FROM iller ORDER BY il_adi');
    } catch (error) {
      console.error('Şehir listesi hatası:', error);
      // Hata durumunda da 81 il fallback veri dön
      return [
        { id: 1, il_adi: 'ADANA' }, { id: 2, il_adi: 'ADIYAMAN' }, { id: 3, il_adi: 'AFYONKARAHİSAR' },
        { id: 4, il_adi: 'AĞRI' }, { id: 5, il_adi: 'AKSARAY' }, { id: 6, il_adi: 'AMASYA' },
        { id: 7, il_adi: 'ANKARA' }, { id: 8, il_adi: 'ANTALYA' }, { id: 9, il_adi: 'ARDAHAN' },
        { id: 10, il_adi: 'ARTVİN' }, { id: 11, il_adi: 'AYDIN' }, { id: 12, il_adi: 'BALIKESİR' },
        { id: 13, il_adi: 'BARTIN' }, { id: 14, il_adi: 'BATMAN' }, { id: 15, il_adi: 'BAYBURT' },
        { id: 16, il_adi: 'BİLECİK' }, { id: 17, il_adi: 'BİNGÖL' }, { id: 18, il_adi: 'BİTLİS' },
        { id: 19, il_adi: 'BOLU' }, { id: 20, il_adi: 'BURDUR' }, { id: 21, il_adi: 'BURSA' },
        { id: 22, il_adi: 'ÇANAKKALE' }, { id: 23, il_adi: 'ÇANKIRI' }, { id: 24, il_adi: 'ÇORUM' },
        { id: 25, il_adi: 'DENİZLİ' }, { id: 26, il_adi: 'DİYARBAKIR' }, { id: 27, il_adi: 'DÜZCE' },
        { id: 28, il_adi: 'EDİRNE' }, { id: 29, il_adi: 'ELAZIĞ' }, { id: 30, il_adi: 'ERZİNCAN' },
        { id: 31, il_adi: 'ERZURUM' }, { id: 32, il_adi: 'ESKİŞEHİR' }, { id: 33, il_adi: 'GAZİANTEP' },
        { id: 34, il_adi: 'GİRESUN' }, { id: 35, il_adi: 'GÜMÜŞHANE' }, { id: 36, il_adi: 'HAKKARİ' },
        { id: 37, il_adi: 'HATAY' }, { id: 38, il_adi: 'IĞDIR' }, { id: 39, il_adi: 'ISPARTA' },
        { id: 40, il_adi: 'İSTANBUL' }, { id: 41, il_adi: 'İZMİR' }, { id: 42, il_adi: 'KAHRAMANMARAŞ' },
        { id: 43, il_adi: 'KARABÜK' }, { id: 44, il_adi: 'KARAMAN' }, { id: 45, il_adi: 'KARS' },
        { id: 46, il_adi: 'KASTAMONU' }, { id: 47, il_adi: 'KAYSERİ' }, { id: 48, il_adi: 'KİLİS' },
        { id: 49, il_adi: 'KIRIKKALE' }, { id: 50, il_adi: 'KIRKLARELİ' }, { id: 51, il_adi: 'KIRŞEHİR' },
        { id: 52, il_adi: 'KOCAELİ' }, { id: 53, il_adi: 'KONYA' }, { id: 54, il_adi: 'KÜTAHYA' },
        { id: 55, il_adi: 'MALATYA' }, { id: 56, il_adi: 'MANİSA' }, { id: 57, il_adi: 'MARDİN' },
        { id: 58, il_adi: 'MERSİN' }, { id: 59, il_adi: 'MUĞLA' }, { id: 60, il_adi: 'MUŞ' },
        { id: 61, il_adi: 'NEVŞEHİR' }, { id: 62, il_adi: 'NİĞDE' }, { id: 63, il_adi: 'ORDU' },
        { id: 64, il_adi: 'OSMANİYE' }, { id: 65, il_adi: 'RİZE' }, { id: 66, il_adi: 'SAKARYA' },
        { id: 67, il_adi: 'SAMSUN' }, { id: 68, il_adi: 'SİİRT' }, { id: 69, il_adi: 'SİNOP' },
        { id: 70, il_adi: 'SİVAS' }, { id: 71, il_adi: 'ŞANLIURFA' }, { id: 72, il_adi: 'ŞIRNAK' },
        { id: 73, il_adi: 'TEKİRDAĞ' }, { id: 74, il_adi: 'TOKAT' }, { id: 75, il_adi: 'TRABZON' },
        { id: 76, il_adi: 'TUNCELİ' }, { id: 77, il_adi: 'UŞAK' }, { id: 78, il_adi: 'VAN' },
        { id: 79, il_adi: 'YALOVA' }, { id: 80, il_adi: 'YOZGAT' }, { id: 81, il_adi: 'ZONGULDAK' },
      ];
    }
  };

  const saveReservation = async (ucusId, ad, soyad, tcNo, telNo, email) => {
    // Expo Go'da SQLite çalışmıyorsa sadece başarılı mesajı dön
    if (!db) {
      console.log('Rezervasyon (Expo Go - test modu):', { ucusId, ad, soyad });
      // Test için rastgele bir ID dön
      return Math.floor(Math.random() * 1000);
    }
    try {
      const rezervasyonTarihi = new Date().toISOString();
      const result = await db.runAsync(
        `INSERT INTO rezervasyonlar 
        (ucus_id, ad, soyad, tc_no, tel_no, email, rezervasyon_tarihi) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ucusId, ad, soyad, tcNo, telNo, email, rezervasyonTarihi]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Rezervasyon kaydetme hatası:', error);
      throw error;
    }
  };

  const getReservationDetails = async (rezervasyonId) => {
    if (!db) return null;
    try {
      const result = await db.getFirstAsync(
        `SELECT r.*, u.* 
         FROM rezervasyonlar r 
         JOIN ucak_seferleri u ON r.ucus_id = u.id 
         WHERE r.id = ?`,
        [rezervasyonId]
      );
      return result;
    } catch (error) {
      console.error('Rezervasyon detay hatası:', error);
      return null;
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        db,
        searchFlights,
        getAllCities,
        saveReservation,
        getReservationDetails,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

