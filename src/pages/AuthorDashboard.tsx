import React from 'react';
import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage,
   IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonImg, useIonRouter,
  IonText, IonButton } from '@ionic/react';
import { chevronForward, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline } from 'ionicons/icons'; // Import the Ionicons icon you want to use

import './Feed.css';
import SubmitBook from './SubmitBook';

function AuthorDashboard() {

  const handleButtonClick = () => {
    // Handle the click event for the image button
    console.log('Button clicked!');
    // Add your navigation logic or other actions here
  }
  const navigation = useIonRouter();

  const getStarted = () => {
    navigation.push('/GetStarted', 'forward');
  };

  const submitBook = () => {
    navigation.push('/submitBook', 'forward');
  };
  
  const goToContent = () => {
    navigation.push('/ContentManagement', 'forward');
  };
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
            <IonTitle class="custom-title">Author Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <div className="welcome-container">
        <h1>Your stories matter.</h1>
        <p>Share your creativity with the world. Publish your book today, become an author!</p>
        
        </div>

        
        <button className="content-btn" onClick={getStarted}>
          Get Started
        </button>
        <button className="content-btn" onClick={goToContent}>
          Content Management
        </button>
        <button className="content-btn" onClick={submitBook}>
          Submit Book
        </button>
       
          
        
        </IonContent>
      </IonPage>
    </>
  );
}

export default AuthorDashboard;