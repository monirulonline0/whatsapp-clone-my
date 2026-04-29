import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import useAppColor from '../../shared/useColor';
import fonts from '../../shared/fonts';

// Google Sign-In কনফিগারেশন
GoogleSignin.configure({
  webClientId: '184951121113-4hfkf9kaltvd3ojn79s4tkqa0e09cff1.apps.googleusercontent.com', // Firebase console > Google Provider > Web Client ID এখানে বসাও
});

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const appColor = useAppColor();

  // ইমেইল লগইন ও সাইন-আপ লজিক
  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "ইমেইল এবং পাসওয়ার্ড দুটোই দিন।");
      return;
    }

    Keyboard.dismiss(); // কিবোর্ড নামিয়ে ফেলা
    setLoading(true);

    try {
      // লগইন করার চেষ্টা
      await auth().signInWithEmailAndPassword(email.trim(), password);
    } catch (error: any) {
      // যদি ইউজার আগে থেকে না থাকে, তবে অটোমেটিক অ্যাকাউন্ট তৈরি করে দিবে
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await auth().createUserWithEmailAndPassword(email.trim(), password);
        } catch (signUpError: any) {
          if (signUpError.code === 'auth/email-already-in-use') {
             Alert.alert("Error", "এই ইমেইলটি অন্য একটি অ্যাকাউন্টে ব্যবহার করা হচ্ছে।");
          } else {
             Alert.alert("Sign Up Error", "অ্যাকাউন্ট তৈরি করা যায়নি। পাসওয়ার্ড অন্তত ৬ ডিজিটের দিন।");
          }
        }
      } else {
        Alert.alert("Login Error", "ইমেইল বা পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  // গুগল লগইন লজিক
  const onGoogleButtonPress = async () => {
  setLoading(true);
  try {
    // ১. চেক করুন প্লে-সার্ভিস আছে কি না
    await GoogleSignin.hasPlayServices();

    // ২. সাইন ইন কল করুন
    const response = await GoogleSignin.signIn();

    // ৩. নতুন ভার্সনে idToken থাকে response.data এর ভেতরে
    const idToken = response.data?.idToken;

    if (!idToken) {
      throw new Error("ID Token খুঁজে পাওয়া যায়নি");
    }

    // ৪. ফায়ারবেস ক্রেডেনশিয়াল তৈরি করুন
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // ৫. ফায়ারবেসে সাইন ইন করুন
    await auth().signInWithCredential(googleCredential);
    
  } catch (error: any) {
    console.log("Google Sign-In Error: ", error);
    Alert.alert("Google Error", "গুগল সাইন-ইন ব্যর্থ হয়েছে।");
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: appColor.dark_blue_10 }]}
    >
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: appColor.green_100, fontFamily: fonts.bold }]}>
            WhatsApp
          </Text>
          <Text style={[styles.subtitle, { color: appColor.text_color_1 }]}>
            নতুনভাবে শুরু করুন
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { color: appColor.text_color_1, borderBottomColor: appColor.green_100 }]}
            placeholder="ইমেইল এড্রেস"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { color: appColor.text_color_1, borderBottomColor: appColor.green_100 }]}
            placeholder="পাসওয়ার্ড"
            placeholderTextColor="gray"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity 
            style={[styles.mainButton, { backgroundColor: appColor.green_100 }]} 
            onPress={handleEmailAuth}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>লগইন / সাইন-আপ</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={{ color: 'gray', marginHorizontal: 10 }}>অথবা</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={onGoogleButtonPress}
          disabled={loading}
        >
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  logo: { fontSize: 40 },
  subtitle: { fontSize: 16, marginTop: 5 },
  form: { width: '100%' },
  input: { borderBottomWidth: 1.5, paddingVertical: 12, fontSize: 16, marginBottom: 25 },
  mainButton: { paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  googleButton: { 
    backgroundColor: '#fff', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  googleText: { color: '#000', fontWeight: '600', fontSize: 16 }
});

export default LoginScreen;