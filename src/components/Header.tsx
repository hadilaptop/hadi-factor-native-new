import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;                     // Ø¹Ù†ÙˆØ§Ù† ØµÙØ­Ù‡
  subtitle?: string;                 // âœ¨ Ø²ÛŒØ±Ø¹Ù†ÙˆØ§Ù† (Ø§Ø®ØªÛŒØ§Ø±ÛŒ) - Ø¬Ø¯ÛŒØ¯
  onBack?: () => void;               // ØªØ§Ø¨Ø¹ÛŒ Ú©Ù‡ Ø¨Ø§ Ú©Ù„ÛŒÚ© Ø±ÙˆÛŒ Ø¯Ú©Ù…Ù‡ Ø¨Ø±Ú¯Ø´Øª Ø§Ø¬Ø±Ø§ Ù…ÛŒâ€ŒØ´ÙˆØ¯
  iconName?: any;                    // نام آیکون (اختیاری - پیش‌فرض: arrow-forward)
}

export default function Header({ title, subtitle, onBack, iconName = 'arrow-forward' }: HeaderProps) {
  return (
    <LinearGradient
      colors={['#0d2b43', '#0f4c75']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>{title}</Text>
        {/* âœ¨ Ù†Ù…Ø§ÛŒØ´ Ø²ÛŒØ±Ø¹Ù†ÙˆØ§Ù† Ø¯Ø± ØµÙˆØ±Øª ÙˆØ¬ÙˆØ¯ */}
        {subtitle && (
           <Text style={styles.headerSubtitle}>{subtitle}</Text>
        )}
      </View>

      {onBack && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.backBtn}
        >
          <Ionicons name={iconName} size={22} color="#ffffff" />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // ... Ø§Ø³ØªØ§ÛŒÙ„â€ŒÙ‡Ø§ÛŒ Ù‚Ø¨Ù„ÛŒ ...
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 10,
  },
  headerInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontFamily: "Vazirmatn",
    fontSize: 16,
    color: "#ffffff",
    textAlign: "right",
  },
  // âœ¨ Ø§Ø³ØªØ§ÛŒÙ„ Ø¬Ø¯ÛŒØ¯ Ø¨Ø±Ø§ÛŒ Ø²ÛŒØ±Ø¹Ù†ÙˆØ§Ù†
  headerSubtitle: {
    fontFamily: "Vazirmatn",
    fontSize: 13,
    color: "#ffffff",
    opacity: 0.9,
    marginTop: 4,
    textAlign: "right",
  },
  backBtn: {
    width: 42,
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});