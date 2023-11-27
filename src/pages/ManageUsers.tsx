import React, { useEffect, useState} from 'react';
import { IonButton, IonRouterLink, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { chevronForward, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline } from 'ionicons/icons'; // Import the Ionicons icon you want to use
import { doc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig'; // Adjust the path to your firebaseConfig file
import { Route, Switch, useHistory } from 'react-router-dom';
import './HelpPage.css';


interface User {
    email: string;
    firstName: string;
    surname: string;
    username: string;
    // Add more fields if necessary
  }
  // Update the User interface to include the 'id' property
interface UserWithId extends User {
    id: string;
  }
  

  function ManageUsers() {
    const [users, setUsers] = useState<UserWithId[]>([]);
    const history = useHistory();
  
    const deleteUser = async (userId: string) => {
        // Show confirmation toast
        const isConfirmed = window.confirm(
          "Are you sure you want to delete this user? It cannot be reversed."
        );
    
        if (!isConfirmed) {
          return;
        }
    
        // Prompt for admin password
        const adminPassword = prompt("Enter admin password:");
    
        if (adminPassword !== 'COMPLICATEDpassword#2023!') {
          alert("Invalid admin password. User not deleted.");
          return;
        }
    
        // Delete the user from Firestore
        try {
          const userRef = doc(firestore, 'users', userId);
          await deleteDoc(userRef);
    
          // Fetch updated user list
          const usersCollection = collection(firestore, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const usersData: UserWithId[] = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as UserWithId));
          setUsers(usersData);
    
          alert("User deleted successfully.");
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Error deleting user. Please try again later.");
        }
      };
    
  
    useEffect(() => {
      // Fetch user data from Firestore
      const fetchUsers = async () => {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData: UserWithId[] = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as UserWithId));
        setUsers(usersData);
      };
  
      fetchUsers();
    }, []);

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar color="tertiary">
            <IonTitle class="custom-title">Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            {/* Home... */}
            <IonItem routerLink="/admindashboard">
              <IonLabel>Home</IonLabel>
              
              <IonIcon icon={homeOutline} slot="start" />
            </IonItem>
            {/* Manage Users here... */}
            <IonItem routerLink="/manageusers">
              <IonLabel>Manage Users</IonLabel>
              
              <IonIcon icon={homeOutline} slot="start" />
            </IonItem>
            {/* Manage books here... */}
            <IonItem routerLink="/manageusercontent">
              <IonLabel>Manage User' Books</IonLabel>
              
              <IonIcon icon={searchCircleOutline} slot="start" />
              </IonItem>

            {/* FAQ Page */}
             <IonItem routerLink="/helpPage">
              <IonLabel>Help and Support</IonLabel>
              
              <IonIcon icon={helpCircleOutline} slot="start" />
            </IonItem>

            {/* Profile Page */}
            <IonItem routerLink="/profile">
              <IonLabel>My Profile</IonLabel>
              
              <IonIcon icon={personCircleOutline} slot="start" />
            </IonItem>

            {/* Setting Page */}
            <IonItem routerLink="/settings">
              <IonLabel>Settings</IonLabel>
              
              <IonIcon icon={settingsOutline} slot="start" />
            </IonItem>

           {/* Logout */}
           <IonItem routerLink="/home" routerDirection="root">
              <IonLabel>Logout</IonLabel>
              <IonIcon icon={logOutOutline} slot="start" />
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
          <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle class="custom-title">Manage Users</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {/* Display the list of users */}
          <IonList>
            {users.map((user) => (
              <IonItem key={user.id}>
                <IonLabel>{user.firstName} {user.surname} {user.email}</IonLabel>
                <IonButton
                  fill="outline"
                  color="danger"
                  slot="end"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </IonButton>
              </IonItem>
            ))}
          </IonList>
         
         </IonContent>
      </IonPage>
       
    </>
  );
}

export default ManageUsers;