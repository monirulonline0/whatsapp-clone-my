import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import useAppColor from '../../shared/useColor'; // আপনার কালার থিম ব্যবহারের জন্য

const PhoneLogin = ({ navigation }: any) => {
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const appColor = useAppColor();

  // ১. ফোন নাম্বারে OTP পাঠানো
  async function signInWithPhoneNumber() {
    if (!phoneNumber.startsWith('+')) {
      Alert.alert("Error", "Please enter phone number with country code (e.g. +8801...)");
      return;
    }
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      console.log('Error sending code: ', error);
      Alert.alert("Error", "Something went wrong. Check your internet or phone number.");
    }
  }

  // ২. OTP ভেরিফাই করে Home এ যাওয়া
  async function confirmCode() {
    try {
      await confirm.confirm(code);
      // লগইন সফল! এখন Home স্ক্রিনে পাঠিয়ে দিচ্ছি
      navigation.replace('Home');
    } catch (error) {
      Alert.alert("Error", "Invalid OTP code. Try again.");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: appColor.dark_blue_10 }]}>
      <Text style={[styles.title, { color: appColor.text_color_1 }]}>
        {confirm ? 'Enter OTP' : 'WhatsApp Login'}
      </Text>

      {!confirm ? (
        <>
          <TextInput
            placeholder="Phone Number (+880...)"
            placeholderTextColor="#888"
            style={[styles.input, { color: appColor.text_color_1, borderBottomColor: appColor.text_color_1 }]}
            keyboardType="phone-pad"
            onChangeText={text => setPhoneNumber(text)}
          />
          <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="6-digit code"
            placeholderTextColor="#888"
            style={[styles.input, { color: appColor.text_color_1, borderBottomColor: appColor.text_color_1 }]}
            keyboardType="number-pad"
            onChangeText={text => setCode(text)}
          />
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Verify & Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderBottomWidth: 1, padding: 10, fontSize: 18, marginBottom: 20 },
  button: { backgroundColor: '#25D366', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default PhoneLogin;