import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux'; 
import { store } from './shared/rdx-store'; 
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// স্টাইল এবং আইকন ইমপোর্ট
// @ts-ignore
import SearchIcon from "./assets/icons/search.svg";
import { WView } from './shared/themed';
import fonts from './shared/fonts';
import useAppColor from './shared/useColor';

// স্ক্রিন কম্পোনেন্ট ইমপোর্ট
import TabComponent from './components/TabComponent';
import SettingsComponent from './components/Settings';
import ChatSettings from './components/ChatSettings';
import ChatRoute from './components/chats-comps/ChatRoute';
import PhoneLogin from './screens/auth/PhoneLogin';

const Stack = createNativeStackNavigator();

// এই পার্টটি Provider এর ভেতরে থাকবে যাতে Redux ডাটা পায়
function MainApp() {
  const isDarkMode = useColorScheme() === 'dark';
  const appColor = useAppColor(); 
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);

  // ইউজার লগইন স্টেট হ্যান্ডেলার
  function onAuthStateChanged(userState: any) {
    setUser(userState);
    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    // ফায়ারবেস লিসেনার
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // আনমাউন্ট হলে লিসেনার বন্ধ হবে
  }, []);

  // ফায়ারবেস চেকিং চলাকালীন সাদা স্ক্রিন এড়াতে লোডিং স্টেট
  if (initializing) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColor.dark_blue_10 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={appColor.dark_blue_10}
      />
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            // যদি ইউজার লগইন না থাকে
            <Stack.Screen 
              name="Login" 
              options={{ headerShown: false }} 
              component={PhoneLogin} 
            />
          ) : (
            // যদি ইউজার লগইন থাকে
            <>
              <Stack.Screen 
                name="Home" 
                options={{ headerShown: false }} 
                component={TabComponent} 
              />
              
              <Stack.Screen 
                name="Settings" 
                options={{
                  headerRight: () => (
                    <WView style={{ width: 28, height: 28 }}><SearchIcon /></WView>
                  ),
                  headerTitleStyle: {
                    fontFamily: fonts.medium,
                    fontSize: 25,
                    color: appColor.text_color_1
                  },
                  headerStyle: {
                    backgroundColor: appColor.dark_blue_10
                  }
                }} 
                component={SettingsComponent} 
              />

              <Stack.Screen 
                name='chat-settings' 
                options={{
                  headerTitleStyle: {
                    fontFamily: fonts.roman,
                    fontSize: 28,
                    color: appColor.text_color_1
                  },
                  headerTitle: "Chats",
                  headerStyle: {
                    backgroundColor: appColor.dark_blue_10
                  }
                }} 
                component={ChatSettings} 
              />

              <Stack.Screen 
                name='chatDefault'
                options={{
                  headerTitle: '',
                  headerStyle: {
                    backgroundColor: appColor.dark_blue_10
                  }
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

// এক্সপোর্ট করা মেইন অ্যাপ যা Provider দিয়ে র‍্যাপ করা
export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}