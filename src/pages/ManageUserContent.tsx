import React, { useEffect, useState } from 'react';
import { IonRouterLink, IonGrid, IonRow, IonCol, IonImg, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonButton, IonAlert } from '@ionic/react';
import { searchCircleOutline, homeOutline, helpCircleOutline, personCircleOutline, settingsOutline, logOutOutline, trashOutline } from 'ionicons/icons';
import { firestore } from '../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Book } from './types';
import './Feed.css';

function ManageUserContent() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>('');

  useEffect(() => {
    const fetchAllBooks = async () => {
      const booksCollection = collection(firestore, 'books');
      const booksSnapshot = await getDocs(booksCollection);

      const booksData = booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Book[];
      setAllBooks(booksData);
    };

    fetchAllBooks();
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
              <IonMenuButton />
            </IonButtons>
            <IonTitle class="custom-title">All Books</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow>
              {allBooks.map((book) => (
                <IonCol size="2" key={book.id} className="book-col">
                  <IonRouterLink routerLink={`/userbookdetailsadmin/${book.id}`}>
                    <IonImg src={book.coverUrl} alt={book.title} className="book-cover" />
                    <IonLabel className="book-title">{book.title}</IonLabel>
                  </IonRouterLink>
                 
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          
        </IonContent>
      </IonPage>
    </>
  );
}

export default ManageUserContent;

