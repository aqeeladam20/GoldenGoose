import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { IonButtons, IonBackButton, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import { chevronForward, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline } from 'ionicons/icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import SubmitBook from './SubmitBook';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig'; // Adjust the path based on your project structure


import { Book } from './types'; // Import the Book type
import './ContentManagement.css';



function ContentManagement() {
    const [userBooks, setUserBooks] = useState<Book[]>([]);
    const [user] = useAuthState(auth); // Make sure to import useAuthState from 'react-firebase-hooks/auth'
  
    useEffect(() => {
      const fetchUserBooks = async () => {
        if (!user) {
          // User is not logged in, handle accordingly
          return;
        }
  
        // Fetch the user's books from Firestore
        const booksQuery = query(collection(firestore, 'books'), where('userId', '==', user.uid));
        const booksSnapshot = await getDocs(booksQuery);
        const booksData = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Book[];
        setUserBooks(booksData);
      };
  
      fetchUserBooks();
    }, [user]); // Add user as a dependency to re-run the effect when user changes
  

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar color="tertiary">
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            {/* Home Feed */}
            <IonItem routerLink="/feed">
              <IonLabel>Home Feed</IonLabel>
              
              <IonIcon icon={homeOutline} slot="start" />
            </IonItem>
            {/* Author Dashboard */}
            <IonItem routerLink="/authordashboard">
              <IonLabel>Author Dashboard</IonLabel>
              
              <IonIcon icon={newspaperOutline} slot="start" />
            </IonItem>

            {/* Discover */}
            <IonItem routerLink="/discover">
              <IonLabel>Discover Books</IonLabel>
              
              <IonIcon icon={searchCircleOutline} slot="start" />
              </IonItem>

              {/* Library */}
            <IonItem routerLink="/library">
              <IonLabel>My Library</IonLabel>
              
              <IonIcon icon={libraryOutline} slot="start" />
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
            <IonBackButton defaultHref="/authordashboard" />
          </IonButtons>
            <IonTitle class="custom-title">Content Management</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
  <IonGrid>
    <IonRow>
      <IonCol>
        <IonTitle className="books-heading">Your Books</IonTitle>
      </IonCol>
    </IonRow>
    <IonRow>
      {userBooks.map(book => (
        <IonCol size="2" key={book.id}>
          <IonItem routerLink={`/bookdetails/${book.id}`} className="book-item">
            <img src={book.coverUrl} alt={book.title} className="book-cover" />
          </IonItem>
          <IonLabel className="book-title">{book.title}</IonLabel>
        </IonCol>
      ))}
    </IonRow>
  </IonGrid>
</IonContent>
      </IonPage>
    </>
  );
}

export default ContentManagement;

