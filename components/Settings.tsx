import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth'; // Firebase Auth ইমপোর্ট
import useAppColor from '../shared/useColor';
import fonts from '../shared/fonts';

const SettingsComponent = ({ navigation }: any) => {
  const appColor = useAppColor();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: () => {
            auth().signOut()
              .then(() => {
                // লগআউট হওয়ার পর App.tsx অটোমেটিক রি-রেন্ডার হবে 
                // এবং তোমাকে লগইন স্ক্রিনে পাঠিয়ে দেবে।
              })
              .catch(error => Alert.alert("Error", error.message));
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: appColor.dark_blue_10 }]}>
      <View style={styles.section}>
        {/* তোমার আগের সেটিংসের অপশনগুলো এখানে থাকবে */}
        <Text style={[styles.itemText, { color: appColor.text_color_1, fontFamily: fonts.medium }]}>
          Account Settings
        </Text>
      </View>

      {/* লগআউট বাটন */}
      <TouchableOpacity 
        style={[styles.logoutButton, { borderTopColor: appColor.dark_blue_20 }]} 
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { fontFamily: fonts.medium }]}>
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  itemText: {
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 20,
    padding: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF4B4B', // লাল রঙের টেক্সট যাতে সহজে চোখে পড়ে
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default SettingsComponent;