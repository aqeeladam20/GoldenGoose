import React from 'react';
import { useIonRouter, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { chevronForward, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline } from 'ionicons/icons'; // Import the Ionicons icon you want to use

import './HelpPage.css';

function AdminDashboard() {
    const navigation = useIonRouter();

  const manageUsers = () => {
    navigation.push('/ManageUsers', 'forward');
  };
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
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle class="custom-title">Admin Portal</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <div className="welcome-container">
        <h1>Welcome fellow admin</h1>
        <p>This is where you oversee accounts, handle complaints and attend to users.</p>
        </div>
        <button className="content-btn" onClick={manageUsers}>
          Manage Users
        </button>
        </IonContent>
      </IonPage>
    </>
  );
}

export default AdminDashboard;