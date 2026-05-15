/**
 * FoodCard Component
 * -------------------
 * Reusable card for displaying food donation details.
 * Used in NGO screen and Volunteer screen.
 * Shows food name, quantity, location, countdown, and action button.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CountdownTimer from './CountdownTimer';
import { formatTimestamp } from '../utils/helpers';

const FoodCard = ({ donation, onAction, actionLabel, actionColor, showVolunteerInfo }) => {
  const isExpired = donation.expiresAt &&
    (donation.expiresAt.toDate ? donation.expiresAt.toDate() : new Date(donation.expiresAt)).getTime() <= Date.now();

  return (
    <View style={styles.card}>
      {/* Header: Food name + status indicator */}
      <View style={styles.header}>
        <Text style={styles.foodName}>🍱 {donation.foodName}</Text>
        <View style={[styles.statusDot, {
          backgroundColor:
            donation.status === 'available' ? '#10B981' :
              donation.status === 'claimed' ? '#F59E0B' :
                donation.status === 'assigned' ? '#3B82F6' : '#6B7280'
        }]} />
      </View>

      {/* Food details */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Quantity</Text>
          <Text style={styles.detailValue}>{donation.quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue} numberOfLines={1}>{donation.location}</Text>
        </View>
      </View>

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        📅 Donated: {formatTimestamp(donation.createdAt)}
      </Text>

      {/* Claimed by info (if applicable) */}
      {donation.claimedBy && (
        <Text style={styles.claimedBy}>
          ✅ Claimed by: {donation.claimedBy}
        </Text>
      )}

      {/* Volunteer info (if applicable) */}
      {showVolunteerInfo && donation.assignedVolunteer && (
        <Text style={styles.volunteerInfo}>
          🚴 Volunteer: {donation.assignedVolunteer}
        </Text>
      )}

      {/* Countdown timer */}
      <View style={styles.timerContainer}>
        <CountdownTimer expiresAt={donation.expiresAt} />
      </View>

      {/* Action button (Claim / Assign / etc.) */}
      {!isExpired && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: actionColor || '#10B981' }]}
          onPress={() => onAction(donation.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>{actionLabel || 'Action'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#374151',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  claimedBy: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 4,
  },
  volunteerInfo: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 4,
  },
  timerContainer: {
    marginVertical: 10,
  },
  actionButton: {
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default FoodCard;
