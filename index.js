/**
 * @format
 */

import { AppRegistry } from 'react-native';
import firebase from '@react-native-firebase/app'; // Firebase app ইমপোর্ট
import auth from '@react-native-firebase/auth';     // Firebase auth ইমপোর্ট
import App from './App';
import { name as appName } from './app.json';

// ফায়ারবেস অ্যাপ যদি আগে থেকে ইনিশিয়াল না থাকে তবে তা করা
if (!firebase.apps.length) {
    try {
        firebase.initializeApp({});
    } catch (err) {
        console.log("Firebase initialization error:", err);
    }
}

AppRegistry.registerComponent(appName, () => App);