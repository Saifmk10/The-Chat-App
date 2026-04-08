import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export const onGoogleButtonPress = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;
    if (!idToken) throw new Error('No ID token found');
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    console.log('User signed in with Google [EMAIL]:', userCredential.user.email);
    console.log('User signed in with Google [UID]:', userCredential.user.uid);
    console.log('User signed in with Google [DISPLAY NAME]:', userCredential.user.displayName);

    const userName = userCredential.user.displayName ?? 'Unknown User';
    const Email = userCredential.user.email ?? 'No Email';
    const UID = userCredential.user.uid;
    const createdDate = userCredential.user.metadata.creationTime;

    

    // This stores additional user information that is not available in
            // // Firebase Authentication such as username and account creation time.
            await firestore()
                .collection('Users')
                .doc(UID)
                .set({
                    Username: userName,
                    Email: Email,
                    AccountCreated: createdDate,
                    UserId: UID,
                });

            // This document acts as a marker to indicate that the Finance agent
            // is enabled and initialized for the user.
            await firestore()
                .collection('Users')
                .doc(UID)
                .collection('Agents')
                .doc('Finance')
                .set({
                    enabled: true,
                    initializedAt: firestore.FieldValue.serverTimestamp(),
                });



    return userCredential.user;
  } catch (error: any) {
    console.log('Error', error.message ?? 'Unknown error');
  }
};

export default onGoogleButtonPress;



 