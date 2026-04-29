import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, useColorScheme, Text, View } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux'; 
import { PaperProvider } from 'react-native-paper';
import { store } from './shared/rdx-store'; 
import auth from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// স্টাইল এবং আইকন ইমপোর্ট
// @ts-ignore
import SearchIcon from "./assets/icons/search.svg";
import fonts from './shared/fonts';
import useAppColor from './shared/useColor';

// স্ক্রিন কম্পোনেন্ট ইমপোর্ট
import TabComponent from './components/TabComponent';
import SettingsComponent from './components/Settings';
import ChatSettings from './components/ChatSettings';
import ChatRoute from './components/chats-comps/ChatRoute';
import PhoneLogin from './screens/auth/LoginScreen';
import ProfileSetup from './screens/auth/ProfileSetup';

const Stack = createNativeStackNavigator();

function MainApp() {
  const isDarkMode = useColorScheme() === 'dark';
  const appColor = useAppColor(); 
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [needsProfile, setNeedsProfile] = useState(false);

  // ইউজার প্রোফাইল চেক করার ফাংশন
  const checkUserProfile = async (currentUser: any) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, 'Users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        setNeedsProfile(true);
      } else {
        setNeedsProfile(false);
      }
    } catch (error) {
      console.log("Firestore Check Error:", error);
    } finally {
      setInitializing(false);
    }
  };

  function onAuthStateChanged(userState: any) {
    setUser(userState);
    if (userState) {
      checkUserProfile(userState);
    } else {
      setInitializing(false);
      setNeedsProfile(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  if (initializing) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={{ fontSize: 16, color: '#000', fontFamily: fonts.medium }}>Loading WhatsApp...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColor.dark_blue_10 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={appColor.dark_blue_10}
      />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={!user ? "Login" : (needsProfile ? "ProfileSetup" : "Home")}
        >
          {!user ? (
            <Stack.Screen 
              name="Login" 
              options={{ headerShown: false }} 
              component={PhoneLogin} 
            />
          ) : (
            <>
              {/* মেইন স্ক্রিনগুলো সবসময় রেজিস্টার্ড থাকবে যাতে REPLACE এরর না দেয় */}
              <Stack.Screen 
                name="Home" 
                options={{ headerShown: false }} 
                component={TabComponent} 
              />
              
              <Stack.Screen 
                name="ProfileSetup" 
                options={{ headerShown: false }} 
                component={ProfileSetup} 
              />

              <Stack.Screen 
                name="Settings" 
                options={{
                  headerRight: () => (
                    <View style={{ marginRight: 15 }}>
                        <SearchIcon width={24} height={24} fill={appColor.text_color_1} />
                    </View>
                  ),
                  headerTitleStyle: {
                    fontFamily: fonts.medium, fontSize: 22, color: appColor.text_color_1
                  },
                  headerStyle: { backgroundColor: appColor.dark_blue_10 }
                }} 
                component={SettingsComponent} 
              />

              <Stack.Screen 
                name='chat-settings' 
                options={{
                    headerTitle: "Chats",
                    headerStyle: { backgroundColor: appColor.dark_blue_10 },
                    headerTitleStyle: { color: appColor.text_color_1, fontFamily: fonts.roman }
                }}
                component={ChatSettings} 
              />
              
              <Stack.Screen 
                name='chatDefault' 
                options={{
                    headerTitle: '',
                    headerStyle: { backgroundColor: appColor.dark_blue_10 }
                }}
                component={ChatRoute} 
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <MainApp />
      </PaperProvider>
    </ReduxProvider>
  );
}