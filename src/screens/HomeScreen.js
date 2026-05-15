/**
 * HomeScreen - Role Selection
 * ----------------------------
 * Landing screen where users choose their role:
 * - 🍽️ Donor: Restaurants, caterers, households with surplus food
 * - 🏥 NGO: Organizations that collect and distribute food
 * - 🚴 Volunteer: People who pick up and deliver food
 * - 📊 Dashboard: Analytics and stats overview
 * 
 * This is the entry point of the app.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';

// Role configuration - makes it easy to add new roles
const ROLES = [
  {
    key: 'Donor',
    icon: '🍽️',
    title: 'Donor',
    subtitle: 'Share surplus food',
    color: '#10B981',
    screen: 'Donor',
  },
  {
    key: 'NGO',
    icon: '🏥',
    title: 'NGO',
    subtitle: 'Claim & distribute food',
    color: '#3B82F6',
    screen: 'NGO',
  },
  {
    key: 'Volunteer',
    icon: '🚴',
    title: 'Volunteer',
    subtitle: 'Pick up & deliver',
    color: '#F59E0B',
    screen: 'Volunteer',
  },
  {
    key: 'Dashboard',
    icon: '📊',
    title: 'Dashboard',
    subtitle: 'View impact & stats',
    color: '#8B5CF6',
    screen: 'Dashboard',
  },
];

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* App branding */}
      <View style={styles.brandSection}>
        <Text style={styles.logo}>🌉</Text>
        <Text style={styles.appName}>HungerBridge</Text>
        <Text style={styles.tagline}>
          Bridging surplus food to those in need
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Role selection prompt */}
      <Text style={styles.selectText}>Choose your role</Text>

      {/* Role buttons */}
      <View style={styles.rolesContainer}>
        {ROLES.map((role) => (
          <TouchableOpacity
            key={role.key}
            style={[styles.roleCard, { borderColor: role.color + '40' }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(role.screen)}
          >
            {/* Icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: role.color + '20' }]}>
              <Text style={styles.icon}>{role.icon}</Text>
            </View>

            {/* Role info */}
            <View style={styles.roleInfo}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
            </View>

            {/* Arrow */}
            <Text style={[styles.arrow, { color: role.color }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Built with ❤️ for reducing food waste
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    fontSize: 56,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F9FAFB',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 24,
  },
  selectText: {
    fontSize: 16,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '600',
  },
  rolesContainer: {
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  roleInfo: {
    flex: 1,
    marginLeft: 14,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  roleSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
  footer: {
    textAlign: 'center',
    color: '#4B5563',
    fontSize: 12,
    marginTop: 30,
  },
});

export default HomeScreen;
