import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { useDatabase } from '../context/DatabaseContext';
import Animated, { FadeInRight, SlideInDown } from 'react-native-reanimated';

export default function FlightListScreen({ route, navigation }) {
  const { nereden, nereye, baslangicTarihi, bitisTarihi } = route.params;
  const { searchFlights } = useDatabase();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    const results = await searchFlights(nereden, nereye, baslangicTarihi, bitisTarihi);
    setFlights(results);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFlights();
    setRefreshing(false);
  };

  const addToCart = (flight) => {
    const newCart = [...cart, flight];
    setCart(newCart);
    alert(`${flight.havayolu_adi} uçuşu sepete eklendi!`);
  };

  const goToCart = () => {
    if (cart.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }
    navigation.navigate('Cart', { cart });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DC143C" />
        <Text style={styles.loadingText}>Uçuşlar aranıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerText}>
          {flights.length} Uçuş Bulundu
        </Text>
        {cart.length > 0 && (
          <Chip
            icon="cart"
            onPress={goToCart}
            style={styles.cartChip}
            textStyle={styles.cartChipText}
          >
            Sepet ({cart.length})
          </Chip>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#DC143C']}
          />
        }
      >
        {flights.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.emptyText}>
                Aradığınız kriterlere uygun uçuş bulunamadı.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                Yeni Arama Yap
              </Button>
            </Card.Content>
          </Card>
        ) : (
          flights.map((flight, index) => (
            <Animated.View
              key={flight.id}
              entering={FadeInRight.duration(500).delay(index * 100)}
            >
              <Card style={styles.flightCard}>
                <Card.Content>
                  <View style={styles.flightHeader}>
                    <Text variant="titleLarge" style={styles.airlineName}>
                      {flight.havayolu_adi}
                    </Text>
                    <Text variant="headlineSmall" style={styles.price}>
                      {flight.fiyat} ₺
                    </Text>
                  </View>

                  <View style={styles.routeContainer}>
                    <View style={styles.routeItem}>
                      <Text variant="labelSmall" style={styles.routeLabel}>
                        Kalkış
                      </Text>
                      <Text variant="titleMedium" style={styles.time}>
                        {flight.kalkis_saati}
                      </Text>
                      <Text variant="bodySmall" style={styles.city}>
                        {flight.nereden}
                      </Text>
                      <Text variant="bodySmall" style={styles.airport}>
                        {flight.havalimani}
                      </Text>
                    </View>

                    <View style={styles.arrowContainer}>
                      <Text style={styles.arrow}>➜</Text>
                    </View>

                    <View style={styles.routeItem}>
                      <Text variant="labelSmall" style={styles.routeLabel}>
                        Varış
                      </Text>
                      <Text variant="titleMedium" style={styles.time}>
                        {flight.varis_saati}
                      </Text>
                      <Text variant="bodySmall" style={styles.city}>
                        {flight.varis_havalimani.split(' ')[0]}
                      </Text>
                      <Text variant="bodySmall" style={styles.airport}>
                        {flight.varis_havalimani}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dateContainer}>
                    <Text variant="bodySmall" style={styles.date}>
                      Tarih: {flight.tarih}
                    </Text>
                  </View>

                  <Button
                    mode="contained"
                    onPress={() => addToCart(flight)}
                    style={styles.addButton}
                    icon="cart-plus"
                  >
                    Sepete Ekle
                  </Button>
                </Card.Content>
              </Card>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {cart.length > 0 && (
        <Animated.View entering={SlideInDown.duration(300)} style={styles.fabContainer}>
          <Button
            mode="contained"
            onPress={goToCart}
            style={styles.fabButton}
            icon="cart"
            contentStyle={styles.fabContent}
          >
            Sepete Git ({cart.length})
          </Button>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    color: '#DC143C',
    fontWeight: 'bold',
  },
  cartChip: {
    backgroundColor: '#DC143C',
  },
  cartChipText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 15,
  },
  emptyCard: {
    marginTop: 50,
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#DC143C',
  },
  flightCard: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  airlineName: {
    color: '#DC143C',
    fontWeight: 'bold',
  },
  price: {
    color: '#DC143C',
    fontWeight: 'bold',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  routeItem: {
    flex: 1,
    alignItems: 'center',
  },
  routeLabel: {
    color: '#999',
    marginBottom: 5,
  },
  time: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  city: {
    color: '#DC143C',
    fontWeight: '600',
    marginBottom: 2,
  },
  airport: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
  },
  arrowContainer: {
    paddingHorizontal: 10,
  },
  arrow: {
    fontSize: 24,
    color: '#DC143C',
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  date: {
    color: '#666',
  },
  addButton: {
    backgroundColor: '#DC143C',
    marginTop: 5,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
  },
  fabButton: {
    backgroundColor: '#DC143C',
    borderRadius: 25,
  },
  fabContent: {
    paddingVertical: 8,
  },
});

