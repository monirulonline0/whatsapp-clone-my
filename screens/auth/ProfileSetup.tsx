import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // নেভিগেশন ইমপোর্ট
import useAppColor from '../../shared/useColor';
import fonts from '../../shared/fonts';

const ProfileSetup = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const appColor = useAppColor();
  const navigation = useNavigation<any>(); // নেভিগেশন হুক

  const handleSaveProfile = async () => {
    // নাম ভ্যালিডেশন
    if (name.trim().length < 3) {
      Alert.alert("নাম ছোট", "দয়া করে কমপক্ষে ৩ অক্ষরের একটি নাম দিন।");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const db = getFirestore();
        
        // Firestore-এ ইউজার প্রোফাইল তৈরি
        await setDoc(doc(db, 'Users', currentUser.uid), {
          uid: currentUser.uid,
          name: name.trim(),
          phoneNumber: currentUser.phoneNumber,
          status: "Hey there! I am using WhatsApp",
          profilePic: "", // আপাতত খালি
          createdAt: serverTimestamp(),
        });

        // সফলভাবে সেভ হলে হোম স্ক্রিনে পাঠিয়ে দেওয়া
        // .reset ব্যবহার করা হয়েছে যাতে ইউজার ব্যাক বাটন টিপলে আবার এখানে না আসে
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });

      } else {
        Alert.alert("Error", "No user found. Please login again.");
      }
    } catch (error: any) {
      console.error("Firestore Error:", error);
      Alert.alert("সমস্যা হয়েছে", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: appColor.dark_blue_10 }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: appColor.text_color_1, fontFamily: fonts.medium }]}>
          প্রোফাইল তথ্য
        </Text>
        <Text style={{ color: 'gray', textAlign: 'center', marginTop: 10 }}>
          আপনার নাম দিন এবং একটি প্রোফাইল ছবি সেট করুন (ঐচ্ছিক)
        </Text>
      </View>

      <View style={styles.profileImageContainer}>
        {/* প্রোফাইল পিকচার প্লেসহোল্ডার */}
        <View style={[styles.imagePlaceholder, { backgroundColor: appColor.dark_blue_20, borderWidth: 1, borderColor: appColor.green_100 }]}>
          <Text style={{ color: 'gray' }}>Photo</Text>
        </View>
      </View>

      <TextInput
        style={[styles.input, { color: appColor.text_color_1, borderBottomColor: appColor.green_100 }]}
        placeholder="আপনার নাম লিখুন..."
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: appColor.green_100 }]} 
        onPress={handleSaveProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>পরবর্তী (NEXT)</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    alignItems: 'center' 
  },
  header: { 
    marginTop: 50, 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 24 
  },
  profileImageContainer: { 
    marginVertical: 40 
  },
  imagePlaceholder: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  input: { 
    width: '90%', 
    borderBottomWidth: 2, 
    paddingVertical: 10, 
    fontSize: 18, 
    marginBottom: 40, 
    textAlign: 'center' 
  },
  button: { 
    width: '60%', 
    paddingVertical: 15, 
    borderRadius: 30, 
    alignItems: 'center', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});

export default ProfileSetup;