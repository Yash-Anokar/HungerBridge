/**
 * CountdownTimer Component
 * -------------------------
 * Displays a live countdown timer for food donations.
 * Updates every second and changes color based on urgency:
 * - Green: > 1 hour remaining
 * - Amber: < 1 hour remaining
 * - Red: < 30 minutes remaining (URGENT)
 * - Gray: Expired
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTimeRemaining, formatCountdown, getUrgencyLevel, getUrgencyColor } from '../utils/helpers';

const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(expiresAt));

  useEffect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(expiresAt);
      setTimeLeft(remaining);

      // Stop interval if expired
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [expiresAt]);

  const urgency = getUrgencyLevel(timeLeft);
  const color = getUrgencyColor(urgency);

  return (
    <View style={[styles.container, { borderColor: color }]}>
      {/* Urgency badge */}
      {urgency === 'urgent' && (
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>⚡ URGENT</Text>
        </View>
      )}
      {urgency === 'expired' && (
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>EXPIRED</Text>
        </View>
      )}

      {/* Timer display */}
      <Text style={[styles.timer, { color }]}>
        {urgency === 'expired' ? '⏰ Expired' : `⏳ ${formatCountdown(timeLeft)}`}
      </Text>

      {/* Label */}
      <Text style={styles.label}>
        {urgency === 'expired' ? 'No longer available' : 'Time remaining'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timer: {
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'], // Monospaced numbers for smooth countdown
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});

export default CountdownTimer;
