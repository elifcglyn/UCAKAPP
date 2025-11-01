import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import { useDatabase } from '../context/DatabaseContext';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function BookingScreen({ route, navigation }) {
  const { cart } = route.params;
  const { saveReservation } = useDatabase();
  
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [telNo, setTelNo] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!ad.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı giriniz!');
      return false;
    }
    if (!soyad.trim()) {
      Alert.alert('Hata', 'Lütfen soyadınızı giriniz!');
      return false;
    }
    if (!tcNo.trim() || tcNo.length !== 11 || !/^\d+$/.test(tcNo)) {
      Alert.alert('Hata', 'Lütfen geçerli bir TC Kimlik No giriniz! (11 haneli)');
      return false;
    }
    if (!telNo.trim() || telNo.length < 10) {
      Alert.alert('Hata', 'Lütfen geçerli bir telefon numarası giriniz!');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi giriniz!');
      return false;
    }
    return true;
  };

  const generatePDFHTML = (reservationData) => {
    const flight = reservationData.flight;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #1A1A1A;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #DC143C;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #DC143C;
              margin: 0;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              color: #DC143C;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              border-bottom: 2px solid #DC143C;
              padding-bottom: 5px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #666;
            }
            .info-value {
              color: #1A1A1A;
            }
            .flight-details {
              background-color: #F5F5F5;
              padding: 15px;
              border-radius: 8px;
              margin-top: 10px;
            }
            .total {
              text-align: right;
              margin-top: 20px;
              font-size: 20px;
              font-weight: bold;
              color: #DC143C;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #E0E0E0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>UÇAK REZERVASYON BELGESİ</h1>
          </div>
          
          <div class="section">
            <div class="section-title">Yolcu Bilgileri</div>
            <div class="info-row">
              <span class="info-label">Ad:</span>
              <span class="info-value">${reservationData.ad} ${reservationData.soyad}</span>
            </div>
            <div class="info-row">
              <span class="info-label">TC Kimlik No:</span>
              <span class="info-value">${reservationData.tcNo}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Telefon:</span>
              <span class="info-value">${reservationData.telNo}</span>
            </div>
            <div class="info-row">
              <span class="info-label">E-posta:</span>
              <span class="info-value">${reservationData.email}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Uçuş Detayları</div>
            <div class="flight-details">
              <div class="info-row">
                <span class="info-label">Havayolu:</span>
                <span class="info-value">${flight.havayolu_adi}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Kalkış:</span>
                <span class="info-value">${flight.nereden} - ${flight.havalimani}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Varış:</span>
                <span class="info-value">${flight.varis_havalimani}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Kalkış Saati:</span>
                <span class="info-value">${flight.kalkis_saati}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Varış Saati:</span>
                <span class="info-value">${flight.varis_saati}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tarih:</span>
                <span class="info-value">${flight.tarih}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fiyat:</span>
                <span class="info-value">${flight.fiyat} ₺</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="total">Toplam: ${flight.fiyat} ₺</div>
          </div>

          <div class="footer">
            <p>Rezervasyon Tarihi: ${new Date(reservationData.rezervasyonTarihi).toLocaleString('tr-TR')}</p>
            <p>Bu belge otomatik olarak oluşturulmuştur.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // İlk uçuşu rezerve et (örnek olarak)
      const flight = cart[0];
      const rezervasyonId = await saveReservation(
        flight.id,
        ad,
        soyad,
        tcNo,
        telNo,
        email
      );

      const reservationData = {
        ad,
        soyad,
        tcNo,
        telNo,
        email,
        flight,
        rezervasyonTarihi: new Date().toISOString(),
        rezervasyonId,
      };

      // PDF oluştur
      const html = generatePDFHTML(reservationData);
      const { uri } = await Print.printToFileAsync({ html });
      
      // PDF'i kaydet
      const fileName = `Rezervasyon_${rezervasyonId}_${Date.now()}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      Alert.alert(
        'Başarılı!',
        `Rezervasyonunuz kaydedildi!\n\nPDF oluşturuldu: ${fileName}\n\nRezervasyon ID: ${rezervasyonId}`,
        [
          {
            text: 'PDF\'i Paylaş',
            onPress: async () => {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
              } else {
                Alert.alert('Hata', 'Paylaşım bu cihazda kullanılamıyor.');
              }
            },
          },
          {
            text: 'Yazdır',
            onPress: async () => {
              await Print.printAsync({ uri });
            },
          },
          {
            text: 'Tamam',
            onPress: () => {
              navigation.navigate('Home');
            },
          },
        ]
      );

      // Formu temizle
      setAd('');
      setSoyad('');
      setTcNo('');
      setTelNo('');
      setEmail('');
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      Alert.alert('Hata', 'Rezervasyon kaydedilirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((sum, flight) => sum + flight.fiyat, 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(500)}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.summaryTitle}>
                Rezervasyon Özeti
              </Text>
              <Text variant="bodyMedium" style={styles.summaryText}>
                {cart.length} uçuş seçtiniz
              </Text>
              <Text variant="headlineSmall" style={styles.summaryPrice}>
                Toplam: {totalPrice} ₺
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.formCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.formTitle}>
                Yolcu Bilgileri
              </Text>

              <TextInput
                label="Ad"
                value={ad}
                onChangeText={setAd}
                mode="outlined"
                style={styles.input}
                outlineColor="#DC143C"
                activeOutlineColor="#DC143C"
              />

              <TextInput
                label="Soyad"
                value={soyad}
                onChangeText={setSoyad}
                mode="outlined"
                style={styles.input}
                outlineColor="#DC143C"
                activeOutlineColor="#DC143C"
              />

              <TextInput
                label="TC Kimlik No"
                value={tcNo}
                onChangeText={setTcNo}
                mode="outlined"
                keyboardType="numeric"
                maxLength={11}
                style={styles.input}
                outlineColor="#DC143C"
                activeOutlineColor="#DC143C"
              />

              <TextInput
                label="Telefon No"
                value={telNo}
                onChangeText={setTelNo}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                outlineColor="#DC143C"
                activeOutlineColor="#DC143C"
              />

              <TextInput
                label="E-posta"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineColor="#DC143C"
                activeOutlineColor="#DC143C"
              />

              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                loading={loading}
                disabled={loading}
                icon="content-save"
                contentStyle={styles.saveButtonContent}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet ve PDF Oluştur'}
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    marginBottom: 20,
    backgroundColor: '#DC143C',
    borderRadius: 12,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryText: {
    color: '#FFFFFF',
    marginBottom: 10,
  },
  summaryPrice: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
  },
  formTitle: {
    color: '#DC143C',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#DC143C',
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonContent: {
    paddingVertical: 5,
  },
});

