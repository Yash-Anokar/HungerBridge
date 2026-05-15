/**
 * DonorScreen - Food Donation Form
 * ---------------------------------
 * Allows donors to submit surplus food details.
 * On submit:
 *  1. Validates inputs
 *  2. Stores donation in Firebase Firestore
 *  3. Auto-sets expiry to 2 hours from now
 *  4. Shows success feedback
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { addDonation } from '../services/firebase';

const DonorScreen = ({ navigation }) => {
  // Form state
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission
   * Validates all fields, then pushes to Firebase
   */
  const handleSubmit = async () => {
    // Input validation
    if (!foodName.trim() || !quantity.trim() || !location.trim()) {
      Alert.alert('⚠️ Missing Fields', 'Please fill in all the details before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Push to Firestore
      const docId = await addDonation({
        foodName: foodName.trim(),
        quantity: quantity.trim(),
        location: location.trim(),
      });

      // Success feedback
      Alert.alert(
        '✅ Donation Posted!',
        `Your food donation "${foodName}" has been listed.\nNGOs can now see and claim it.\n\n⏰ Expires in 2 hours.`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              // Reset form
              setFoodName('');
              setQuantity('');
              setLocation('');
            },
          },
          {
            text: 'Go Home',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding donation:', error);
      Alert.alert('❌ Error', 'Failed to post donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🍽️</Text>
            <Text style={styles.headerTitle}>Donate Food</Text>
            <Text style={styles.headerSubtitle}>
              Share your surplus food with those in need
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Food Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🍱 Food Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Biryani, Sandwiches, Rice"
                placeholderTextColor="#6B7280"
                value={foodName}
                onChangeText={setFoodName}
                maxLength={100}
              />
            </View>

            {/* Quantity Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📦 Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 50 plates, 10 kg, 20 packets"
                placeholderTextColor="#6B7280"
                value={quantity}
                onChangeText={setQuantity}
                maxLength={50}
              />
            </View>

            {/* Location Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📍 Pickup Location</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., 123 Main Street, Near City Mall"
                placeholderTextColor="#6B7280"
                value={location}
                onChangeText={setLocation}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* Expiry notice */}
            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                ⏰ Donation will auto-expire in 2 hours from posting
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>🚀 Post Donation</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#374151',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  notice: {
    backgroundColor: '#F59E0B10',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F59E0B30',
  },
  noticeText: {
    color: '#F59E0B',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default DonorScreen;
