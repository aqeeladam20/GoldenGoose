import React from 'react';
import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { chevronForward, bookOutline, peopleOutline, downloadOutline, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline, cloudCircleOutline } from 'ionicons/icons'; // Import the Ionicons icon you want to use

import './Library.css';

function Library() {
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
            <IonTitle>My Library</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <button className="content-btn">
  <IonIcon icon={downloadOutline} slot="start" /> {/* Add an icon at the start of the button */}
  Downloads
</button>

<button className="content-btn">
<IonIcon icon={libraryOutline} slot="start" /> {/* Add an image at the start of the button */}
  Books and Courses
</button>

<button className="content-btn">
<IonIcon icon={peopleOutline} slot="start" /> {/* Add an image at the start of the button */}
  Authors
</button>  
          Tap the button in the toolbar to open the menu. User's bought books will be here</IonContent>
      </IonPage>
    </>
  );
}

export default Library;