/**
 * NGOScreen - Real-time Food Listings & Claim
 * ---------------------------------------------
 * Displays all available food donations in real-time.
 * NGOs can:
 *  1. See live food listings with countdown timers
 *  2. Claim donations (updates status in Firebase)
 *  3. See urgent items highlighted
 * 
 * Uses Firestore onSnapshot for real-time updates.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { subscribeToDonations, claimDonation } from '../services/firebase';
import FoodCard from '../components/FoodCard';

const NGOScreen = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ngoName, setNgoName] = useState('');

  useEffect(() => {
    // Subscribe to real-time donation updates (only 'available' ones)
    const unsubscribe = subscribeToDonations((data) => {
      setDonations(data);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Handle claiming a donation
   * Prompts NGO for their name, then marks donation as claimed
   */
  const handleClaim = (donationId) => {
    if (!ngoName.trim()) {
      Alert.alert('⚠️ Enter NGO Name', 'Please enter your NGO name at the top before claiming.');
      return;
    }

    Alert.alert(
      '🤝 Confirm Claim',
      `Claim this food donation as "${ngoName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim It!',
          onPress: async () => {
            try {
              await claimDonation(donationId, ngoName.trim());
              Alert.alert('✅ Claimed!', 'You have claimed this donation. A volunteer will be assigned shortly.');
            } catch (error) {
              console.error('Claim error:', error);
              Alert.alert('❌ Error', 'Failed to claim donation.');
            }
          },
        },
      ]
    );
  };

  // Render each food card
  const renderItem = ({ item }) => (
    <FoodCard
      donation={item}
      onAction={handleClaim}
      actionLabel="🤝 Claim This Food"
      actionColor="#3B82F6"
    />
  );

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Available Donations</Text>
      <Text style={styles.emptySubtitle}>
        New donations will appear here in real-time.{'\n'}
        Ask a donor to post some food!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🏥</Text>
        <Text style={styles.headerTitle}>NGO Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Claim available food donations in real-time
        </Text>
      </View>

      {/* NGO Name Input */}
      <View style={styles.ngoInputContainer}>
        <TextInput
          style={styles.ngoInput}
          placeholder="Enter your NGO name..."
          placeholderTextColor="#6B7280"
          value={ngoName}
          onChangeText={setNgoName}
        />
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          🟢 {donations.length} donation{donations.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      {/* Donations list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading donations...</Text>
        </View>
      ) : (
        <FlatList
          data={donations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    alignItems: 'center',
    padding: 18,
    paddingBottom: 8,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  ngoInputContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  ngoInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#374151',
    textAlign: 'center',
  },
  statsBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  statsText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NGOScreen;
