import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  ActivityIndicator,
  Menu,
} from 'react-native-paper';
import { useDatabase } from '../context/DatabaseContext';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function HomeScreen({ navigation }) {
  const { getAllCities } = useDatabase();
  const [cities, setCities] = useState([]);
  const [nereden, setNereden] = useState('');
  const [nereye, setNereye] = useState('');
  const [baslangicTarihi, setBaslangicTarihi] = useState(new Date());
  const [bitisTarihi, setBitisTarihi] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNeredenMenu, setShowNeredenMenu] = useState(false);
  const [showNereyeMenu, setShowNereyeMenu] = useState(false);

  useEffect(() => {
    // İlk başta direkt 81 ili yükle
    const turkiyeIlleri = [
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
    setCities(turkiyeIlleri);
    // Sonra veritabanından yüklemeyi dene
    loadCities();
  }, []);

  const loadCities = async () => {
    setLoading(true);
    try {
      const cityList = await getAllCities();
      console.log('Yüklenen şehirler:', cityList);
      if (cityList && cityList.length > 0) {
        setCities(cityList);
      } else {
        // Fallback: Eğer liste boşsa sabit veri kullan
        setCities([
          { id: 1, il_adi: 'İSTANBUL' },
          { id: 2, il_adi: 'ANKARA' },
          { id: 3, il_adi: 'İZMİR' },
          { id: 4, il_adi: 'ANTALYA' },
        ]);
      }
    } catch (error) {
      console.error('Şehir yükleme hatası:', error);
      // Hata durumunda fallback
      setCities([
        { id: 1, il_adi: 'İSTANBUL' },
        { id: 2, il_adi: 'ANKARA' },
        { id: 3, il_adi: 'İZMİR' },
        { id: 4, il_adi: 'ANTALYA' },
      ]);
    }
    setLoading(false);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSearch = () => {
    if (!nereden || !nereye) {
      alert('Lütfen nereden ve nereye seçimlerini yapın!');
      return;
    }

    if (baslangicTarihi > bitisTarihi) {
      alert('Başlangıç tarihi bitiş tarihinden sonra olamaz!');
      return;
    }

    navigation.navigate('FlightList', {
      nereden,
      nereye,
      baslangicTarihi: formatDate(baslangicTarihi),
      bitisTarihi: formatDate(bitisTarihi),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.headerContainer}>
          <Text variant="displaySmall" style={styles.title}>
            Uçak Biletinizi Bulun
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            En uygun fiyatlı uçuşları keşfedin
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(1000).delay(200)}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Uçuş Bilgileri
              </Text>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Nereden</Text>
                <Menu
                  visible={showNeredenMenu}
                  onDismiss={() => setShowNeredenMenu(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setShowNeredenMenu(true)}
                      style={styles.menuButton}
                      contentStyle={styles.menuButtonContent}
                      labelStyle={styles.menuButtonLabel}
                      icon="chevron-down"
                    >
                      {nereden || 'Şehir Seçiniz'}
                    </Button>
                  }
                >
                  {cities.map((city) => (
                    <Menu.Item
                      key={city.id}
                      onPress={() => {
                        setNereden(city.il_adi);
                        setShowNeredenMenu(false);
                      }}
                      title={city.il_adi}
                    />
                  ))}
                </Menu>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Nereye</Text>
                <Menu
                  visible={showNereyeMenu}
                  onDismiss={() => setShowNereyeMenu(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setShowNereyeMenu(true)}
                      style={styles.menuButton}
                      contentStyle={styles.menuButtonContent}
                      labelStyle={styles.menuButtonLabel}
                      icon="chevron-down"
                    >
                      {nereye || 'Şehir Seçiniz'}
                    </Button>
                  }
                >
                  {cities.map((city) => (
                    <Menu.Item
                      key={city.id}
                      onPress={() => {
                        setNereye(city.il_adi);
                        setShowNereyeMenu(false);
                      }}
                      title={city.il_adi}
                    />
                  ))}
                </Menu>
              </View>

              <View style={styles.dateContainer}>
                <View style={styles.dateInput}>
                  <Text style={styles.label}>Başlangıç Tarihi</Text>
                  <Button
                    mode="outlined"
                    onPress={() => setShowStartDate(true)}
                    style={styles.dateButton}
                    labelStyle={styles.dateButtonLabel}
                  >
                    {formatDate(baslangicTarihi)}
                  </Button>
                  {showStartDate && (
                    <DateTimePicker
                      value={baslangicTarihi}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === 'android') {
                          setShowStartDate(false);
                        }
                        if (selectedDate) {
                          setBaslangicTarihi(selectedDate);
                        }
                      }}
                      minimumDate={new Date()}
                    />
                  )}
                </View>

                <View style={styles.dateInput}>
                  <Text style={styles.label}>Bitiş Tarihi</Text>
                  <Button
                    mode="outlined"
                    onPress={() => setShowEndDate(true)}
                    style={styles.dateButton}
                    labelStyle={styles.dateButtonLabel}
                  >
                    {formatDate(bitisTarihi)}
                  </Button>
                  {showEndDate && (
                    <DateTimePicker
                      value={bitisTarihi}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === 'android') {
                          setShowEndDate(false);
                        }
                        if (selectedDate) {
                          setBitisTarihi(selectedDate);
                        }
                      }}
                      minimumDate={baslangicTarihi}
                    />
                  )}
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleSearch}
                style={styles.searchButton}
                labelStyle={styles.searchButtonLabel}
                disabled={loading}
              >
                {loading ? 'Aranıyor...' : 'Uçuş Ara'}
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
    paddingTop: 40,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    color: '#DC143C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    color: '#DC143C',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#DC143C',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#1A1A1A',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateButton: {
    borderColor: '#DC143C',
    borderWidth: 1,
  },
  dateButtonLabel: {
    color: '#DC143C',
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: '#DC143C',
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingText: {
    color: '#666',
    padding: 10,
    textAlign: 'center',
  },
  menuButton: {
    borderColor: '#DC143C',
    borderWidth: 1,
    marginTop: 8,
  },
  menuButtonContent: {
    justifyContent: 'space-between',
  },
  menuButtonLabel: {
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'left',
  },
});

