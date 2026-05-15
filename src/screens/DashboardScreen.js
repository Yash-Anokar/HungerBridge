/**
 * DashboardScreen - Impact & Analytics
 * --------------------------------------
 * Shows overall statistics and impact of HungerBridge:
 * - Total meals saved
 * - Active donations
 * - Claimed donations
 * - Assigned volunteers
 * - Recent activity feed
 * 
 * Uses real-time Firestore listener for live stats.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { subscribeToAllDonations } from '../services/firebase';
import { formatTimestamp } from '../utils/helpers';

const DashboardScreen = () => {
  const [allDonations, setAllDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to ALL donations for analytics
    const unsubscribe = subscribeToAllDonations((data) => {
      setAllDonations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate statistics from donations data
  const stats = {
    total: allDonations.length,
    available: allDonations.filter((d) => d.status === 'available').length,
    claimed: allDonations.filter((d) => d.status === 'claimed').length,
    assigned: allDonations.filter((d) => d.status === 'assigned').length,
    // Estimate meals saved (claimed + assigned = saved meals)
    mealsSaved: allDonations.filter(
      (d) => d.status === 'claimed' || d.status === 'assigned'
    ).length,
  };

  // Stats cards configuration
  const statCards = [
    { label: 'Total Donations', value: stats.total, icon: '📦', color: '#6366F1' },
    { label: 'Meals Saved', value: stats.mealsSaved, icon: '🍽️', color: '#10B981' },
    { label: 'Active (Available)', value: stats.available, icon: '🟢', color: '#3B82F6' },
    { label: 'Claimed by NGOs', value: stats.claimed, icon: '🤝', color: '#F59E0B' },
    { label: 'Volunteer Assigned', value: stats.assigned, icon: '🚴', color: '#8B5CF6' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📊</Text>
          <Text style={styles.headerTitle}>Impact Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Real-time analytics & impact metrics
          </Text>
        </View>

        {/* Hero stat - Meals Saved */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🌟</Text>
          <Text style={styles.heroValue}>{stats.mealsSaved}</Text>
          <Text style={styles.heroLabel}>Meals Saved So Far</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroSubtext}>
            Every meal counts. Keep donating! 💪
          </Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { borderColor: stat.color + '30' }]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>📋 Recent Activity</Text>

          {allDonations.length === 0 ? (
            <View style={styles.emptyActivity}>
              <Text style={styles.emptyText}>No donations yet. Be the first!</Text>
            </View>
          ) : (
            allDonations.slice(0, 10).map((donation, index) => (
              <View key={donation.id || index} style={styles.activityItem}>
                {/* Status indicator */}
                <View
                  style={[
                    styles.activityDot,
                    {
                      backgroundColor:
                        donation.status === 'available'
                          ? '#10B981'
                          : donation.status === 'claimed'
                            ? '#F59E0B'
                            : donation.status === 'assigned'
                              ? '#3B82F6'
                              : '#6B7280',
                    },
                  ]}
                />

                {/* Activity details */}
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>
                    {donation.foodName}
                    <Text style={styles.activityQty}> — {donation.quantity}</Text>
                  </Text>
                  <Text style={styles.activityMeta}>
                    {donation.status.toUpperCase()} • {formatTimestamp(donation.createdAt)}
                    {donation.claimedBy ? ` • By ${donation.claimedBy}` : ''}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
  },
  // Hero card — Meals Saved highlight
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10B98130',
  },
  heroIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 52,
    fontWeight: '900',
    color: '#10B981',
  },
  heroLabel: {
    fontSize: 16,
    color: '#D1D5DB',
    fontWeight: '600',
    marginTop: 4,
  },
  heroDivider: {
    height: 1,
    backgroundColor: '#334155',
    width: '60%',
    marginVertical: 14,
  },
  heroSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Recent Activity
  activitySection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 14,
  },
  emptyActivity: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '600',
  },
  activityQty: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  activityMeta: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 3,
  },
});

export default DashboardScreen;
