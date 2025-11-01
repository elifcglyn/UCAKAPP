import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Divider,
  IconButton,
} from 'react-native-paper';
import Animated, { FadeIn, SlideInLeft } from 'react-native-reanimated';

export default function CartScreen({ route, navigation }) {
  const initialCart = route.params?.cart || [];
  const [cart, setCart] = useState(initialCart);

  const removeFromCart = (index) => {
    Alert.alert(
      'Emin misiniz?',
      'Bu uçuşu sepetten çıkarmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet',
          onPress: () => {
            const newCart = cart.filter((_, i) => i !== index);
            setCart(newCart);
            if (newCart.length === 0) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, flight) => total + flight.fiyat, 0);
  };

  const proceedToBooking = () => {
    if (cart.length === 0) {
      Alert.alert('Uyarı', 'Sepetiniz boş!');
      return;
    }
    navigation.navigate('Booking', { cart });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cart.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.emptyText}>
                Sepetiniz Boş
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Home')}
                style={styles.backButton}
              >
                Uçuş Ara
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <>
            {cart.map((flight, index) => (
              <Animated.View
                key={`${flight.id}-${index}`}
                entering={SlideInLeft.duration(400).delay(index * 100)}
              >
                <Card style={styles.cartCard}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <Text variant="titleMedium" style={styles.airlineName}>
                        {flight.havayolu_adi}
                      </Text>
                      <IconButton
                        icon="delete"
                        iconColor="#DC143C"
                        size={24}
                        onPress={() => removeFromCart(index)}
                      />
                    </View>

                    <View style={styles.routeInfo}>
                      <View style={styles.routeItem}>
                        <Text variant="bodySmall" style={styles.routeLabel}>
                          Kalkış
                        </Text>
                        <Text variant="bodyLarge" style={styles.routeText}>
                          {flight.nereden} - {flight.kalkis_saati}
                        </Text>
                        <Text variant="bodySmall" style={styles.airport}>
                          {flight.havalimani}
                        </Text>
                      </View>

                      <View style={styles.routeItem}>
                        <Text variant="bodySmall" style={styles.routeLabel}>
                          Varış
                        </Text>
                        <Text variant="bodyLarge" style={styles.routeText}>
                          {flight.varis_havalimani.split(' ')[0]} - {flight.varis_saati}
                        </Text>
                        <Text variant="bodySmall" style={styles.airport}>
                          {flight.varis_havalimani}
                        </Text>
                      </View>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.priceRow}>
                      <Text variant="bodyMedium" style={styles.dateText}>
                        {flight.tarih}
                      </Text>
                      <Text variant="titleMedium" style={styles.price}>
                        {flight.fiyat} ₺
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </Animated.View>
            ))}

            <Animated.View entering={FadeIn.duration(500)}>
              <Card style={styles.totalCard}>
                <Card.Content>
                  <View style={styles.totalRow}>
                    <Text variant="titleLarge" style={styles.totalLabel}>
                      Toplam:
                    </Text>
                    <Text variant="headlineSmall" style={styles.totalPrice}>
                      {calculateTotal()} ₺
                    </Text>
                  </View>
                  <Button
                    mode="contained"
                    onPress={proceedToBooking}
                    style={styles.bookButton}
                    icon="arrow-forward"
                    contentStyle={styles.bookButtonContent}
                  >
                    Rezervasyona Devam Et
                  </Button>
                </Card.Content>
              </Card>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
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
  cartCard: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  airlineName: {
    color: '#DC143C',
    fontWeight: 'bold',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  routeItem: {
    flex: 1,
  },
  routeLabel: {
    color: '#999',
    marginBottom: 5,
  },
  routeText: {
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 3,
  },
  airport: {
    color: '#666',
    fontSize: 12,
  },
  divider: {
    marginVertical: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#666',
  },
  price: {
    color: '#DC143C',
    fontWeight: 'bold',
  },
  totalCard: {
    marginTop: 20,
    backgroundColor: '#DC143C',
    borderRadius: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalPrice: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#FFFFFF',
  },
  bookButtonContent: {
    paddingVertical: 5,
  },
});

