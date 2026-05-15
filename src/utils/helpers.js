/**
 * Utility / Helper Functions
 * --------------------------
 * Shared utility functions used across the app.
 * Keeps logic DRY and consistent.
 */

/**
 * Format a Firestore Timestamp to a readable string
 * @param {Object} timestamp - Firestore Timestamp object
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  });
};

/**
 * Calculate time remaining in milliseconds from now until expiry
 * @param {Object} expiresAt - Firestore Timestamp
 * @returns {number} Milliseconds remaining (negative if expired)
 */
export const getTimeRemaining = (expiresAt) => {
  if (!expiresAt) return 0;
  const expiryDate = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
  return expiryDate.getTime() - Date.now();
};

/**
 * Format milliseconds into MM:SS display
 * @param {number} ms - Milliseconds remaining
 * @returns {string} Formatted time string "HH:MM:SS"
 */
export const formatCountdown = (ms) => {
  if (ms <= 0) return '00:00:00';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Determine urgency level based on time remaining
 * @param {number} ms - Milliseconds remaining
 * @returns {'expired' | 'urgent' | 'warning' | 'normal'}
 */
export const getUrgencyLevel = (ms) => {
  if (ms <= 0) return 'expired';
  if (ms <= 30 * 60 * 1000) return 'urgent';     // Less than 30 min
  if (ms <= 60 * 60 * 1000) return 'warning';     // Less than 1 hour
  return 'normal';
};

/**
 * Get a color based on urgency level
 * @param {'expired' | 'urgent' | 'warning' | 'normal'} level
 * @returns {string} Hex color code
 */
export const getUrgencyColor = (level) => {
  const colors = {
    expired: '#6B7280',   // Gray
    urgent: '#EF4444',    // Red
    warning: '#F59E0B',   // Amber
    normal: '#10B981',    // Green
  };
  return colors[level] || colors.normal;
};

/**
 * Generate a simple unique ID (for local use before Firebase assigns one)
 * @returns {string}
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

/**
 * Truncate text to a maximum length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
