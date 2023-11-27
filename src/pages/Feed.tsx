import React, { useEffect, useState } from 'react';
import { IonRouterLink, IonGrid, IonRow, IonCol, IonImg, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage,IonButton, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { chevronForward, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline } from 'ionicons/icons';
import { firestore } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Book } from './types';
import './Feed.css';

function Feed() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);

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
            <IonTitle class="custom-title">Ebook App</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {/* Add a banner or any additional content */}
          <div className="banner-container">
            <img src="https://img.freepik.com/free-vector/realistic-book-lovers-day-horizontal-background-with-composition-text-books-with-lamp-cup-vector-illustration_1284-77302.jpg?w=2000" alt="Banner" className="banner-image" />
          </div>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonTitle>Recently Added</IonTitle>
              </IonCol>
            </IonRow>
            <IonRow>
              {allBooks.map((book) => (
               <IonCol size="2" key={book.id} className="book-col">
               <IonRouterLink routerLink={`/buybook/${book.id}`}>
                 <div className="book-container">
                   <IonImg src={book.coverUrl} alt={book.title} className="book-cover" />
                   <IonLabel className="book-title">{book.title}</IonLabel>
                   <IonButton className="view-button">View</IonButton>
                 </div>
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

export default Feed;