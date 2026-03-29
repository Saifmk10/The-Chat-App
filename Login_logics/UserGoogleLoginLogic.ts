import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export const onGoogleButtonPress = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;
    if (!idToken) throw new Error('No ID token found');
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    return userCredential.user;
  } catch (error: any) {
    console.log('Error', error.message ?? 'Unknown error');
  }
};

export default onGoogleButtonPress;