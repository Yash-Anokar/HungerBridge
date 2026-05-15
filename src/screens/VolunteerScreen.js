/**
 * VolunteerScreen - Pickup Assignments
 * --------------------------------------
 * Shows donations that have been claimed by NGOs.
 * Volunteers can:
 *  1. See claimed donations awaiting pickup
 *  2. Accept assignment to pick up and deliver food
 *  3. View pickup location and NGO details
 * 
 * Uses Firestore real-time listener for claimed donations.
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
import { subscribeToClaimedDonations, assignVolunteer } from '../services/firebase';
import FoodCard from '../components/FoodCard';

const VolunteerScreen = () => {
  const [claimedDonations, setClaimedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volunteerName, setVolunteerName] = useState('');

  useEffect(() => {
    // Subscribe to real-time updates of claimed donations
    const unsubscribe = subscribeToClaimedDonations((data) => {
      setClaimedDonations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Handle volunteer accepting an assignment
   * Updates donation with volunteer name in Firebase
   */
  const handleAccept = (donationId) => {
    if (!volunteerName.trim()) {
      Alert.alert('⚠️ Enter Your Name', 'Please enter your name at the top before accepting assignments.');
      return;
    }

    Alert.alert(
      '🚴 Accept Pickup?',
      `Accept this pickup assignment as "${volunteerName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept!',
          onPress: async () => {
            try {
              await assignVolunteer(donationId, volunteerName.trim());
              Alert.alert(
                '✅ Assignment Accepted!',
                'Please pick up the food from the listed location and deliver it to the NGO.'
              );
            } catch (error) {
              console.error('Assignment error:', error);
              Alert.alert('❌ Error', 'Failed to accept assignment.');
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
      onAction={handleAccept}
      actionLabel="🚴 Accept Pickup"
      actionColor="#F59E0B"
    />
  );

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🕐</Text>
      <Text style={styles.emptyTitle}>No Pending Pickups</Text>
      <Text style={styles.emptySubtitle}>
        When an NGO claims a donation, it will{'\n'}
        appear here for volunteer pickup.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🚴</Text>
        <Text style={styles.headerTitle}>Volunteer Hub</Text>
        <Text style={styles.headerSubtitle}>
          Accept pickup assignments and deliver food
        </Text>
      </View>

      {/* Volunteer Name Input */}
      <View style={styles.nameInputContainer}>
        <TextInput
          style={styles.nameInput}
          placeholder="Enter your name..."
          placeholderTextColor="#6B7280"
          value={volunteerName}
          onChangeText={setVolunteerName}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          📋 {claimedDonations.length} pickup{claimedDonations.length !== 1 ? 's' : ''} awaiting
        </Text>
      </View>

      {/* Donations list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Loading assignments...</Text>
        </View>
      ) : (
        <FlatList
          data={claimedDonations}
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
  nameInputContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  nameInput: {
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
    color: '#F59E0B',
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

export default VolunteerScreen;
