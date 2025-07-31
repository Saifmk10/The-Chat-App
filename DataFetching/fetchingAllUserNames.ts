import firestore, { doc, onSnapshot } from '@react-native-firebase/firestore';


    const FetchingAllUserNames = () => {
        const Users = firestore()
            .collection('Users').get()
                .then( snapshot => { return snapshot.docs.map(doc => doc.data());})
           
        console.log({Users});
    }

    const finalArrayOfUsers  =  FetchingAllUserNames();
    console.log({finalArrayOfUsers});

    export default FetchingAllUserNames;
