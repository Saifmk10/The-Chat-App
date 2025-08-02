import firestore, { doc, onSnapshot } from '@react-native-firebase/firestore';


// in the future updates the async needs to be changed to onSnapShot
const FetchingAllUserNames = async () => {
    try {

        var initialUser = 0

        const snapshot = await firestore().collection("Users").get();

        var fullSnapShot = snapshot.docs.map(doc => doc.data())
        console.log("FULL DOCUMENT : " , fullSnapShot);


        var numberOfUsers = snapshot.docs.length // this is fetching the length of the document , which means the total number of users present
        console.log("Number of Users : " , numberOfUsers)

        var UIDdetails = snapshot.docs[7]; // this is getting the details that are present within the user id thats in position 0 of the array
        console.log("Doc[last]"  , UIDdetails);

        var UIDdata = UIDdetails.data(); // this is gonna enter into and doc and then show all the details like username , email and more
        // console.log("UID DATA :"  , UIDdata);

        var userName = UIDdata.Username; // this is fetching the user details form the db
        console.log("USER NAME :" , userName) 

        // for (initialUser ; initialUser < numberOfUsers; initialUser++){
        //     const UIDdetails = snapshot.docs[initialUser]; // this is getting the details that are present within the user id thats in position 0 of the array

        //     const UIDdata = UIDdetails.data(); // this is gonna enter into and doc and then show all the details like username , email and more

        //     const userName = UIDdata.Username;
        //     console.log("USER NAME :" , userName) // this is fetching the user details form the db
        // }
        console.log("USERNAME OUTPUT FROM addFriends.tsx :", userName);
        return userName;



    }
    catch (error) {
        console.error("Error fetching users:", error);
    }

    // console.log( "FINAL OUTPUT :" , Users);
}



export default FetchingAllUserNames;
