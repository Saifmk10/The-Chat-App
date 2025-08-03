import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';





const UserLoginLogic = ( Email: string, Password: string , success : (username : string) => void , Error : (errorMessage : string) => void) => {
    signInWithEmailAndPassword(getAuth(), Email, Password)
      .then((userCredentials) => {
        const UID = userCredentials.user.uid;
        firestore().collection('Users').doc(UID).get().then(doc => {

          const username = doc.data()?.Username; // this const is used to fetch the username when the user logs into the app
          success(username);      
        

        });

      }) 
      .catch(error => {
        const errorCode = error.code;
        Error(errorCode);
        console.log("ERROR IN LOGIN UserLoginLogic.ts : " , errorCode);
      });
  };

  export default UserLoginLogic;