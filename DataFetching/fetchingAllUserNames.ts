// this file is responsibe for the fetching of all the usernames present in the database and with the total number of users present in the database
// the usernames are returned in the form of a tuple and then accessed individually in the addFriends.tsx file
// we have used .get() as of now and is not realtime update . The app needs to be reloaded as of now to get the exact number of user. In future update implement .onSnapshot() for realtime changes if needed as of now its not needed


import firestore, { doc, onSnapshot } from '@react-native-firebase/firestore';


// in the future updates the async needs to be changed to onSnapShot
const FetchingAllUserNames = async () => {
    try {

        var initialUser = 0
        var allUserNames : string [] = []; // this tuple is gonna hold all the users names 

        const snapshot = await firestore().collection("Users").get();

        var fullSnapShot = snapshot.docs.map(doc => doc.data())
        console.log("FULL DOCUMENT : " , fullSnapShot);


        var numberOfUsers = snapshot.docs.length // this is fetching the length of the document , which means the total number of users present
        console.log("Number of Users : " , numberOfUsers)

        // USE THE BELLOW COMMENTED CODE FOR TESTIG PURPOSE IF ANY ERROR FOR INDIVIDUAL USERS

        // var UIDdetails = snapshot.docs[7]; // this is getting the details that are present within the user id thats in position 0 of the array
        // console.log("Doc[last]"  , UIDdetails);

        // var UIDdata = UIDdetails.data(); // this is gonna enter into and doc and then show all the details like username , email and more
        // // console.log("UID DATA :"  , UIDdata);

        // var userName = UIDdata.Username; // this is fetching the user details form the db
        // console.log("USER NAME :" , userName) 


        // fetching all the username from the database not just 1 name
        for (initialUser ; initialUser < numberOfUsers; initialUser++){
            const UIDdetails = snapshot.docs[initialUser]; // this is getting the details that are present within the user id thats in position 0 of the array

            const UIDdata = UIDdetails.data(); // this is gonna enter into and doc and then show all the details like username , email and more

            const userName = UIDdata.Username;
            

            allUserNames.push(userName)

        }
        // console.log("USERNAME OUTPUT FROM addFriends.tsx :", userName);
        console.log("USER NAME FROM ARRAY FROM addFriends.tsx:" , allUserNames) // this is fetching the user details form the db
        return [allUserNames , numberOfUsers];
        



    }
    catch (error) {
        console.error("Error fetching users:", error);
        return [[] , 0]
    }
}



export default FetchingAllUserNames;
