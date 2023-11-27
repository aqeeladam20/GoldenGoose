import React from 'react';
import {
  IonContent,
  IonPage,
  IonText,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonCheckbox,
  IonModal,
  useIonRouter,
  IonImg,
  IonRow,
  IonCol, IonIcon, IonAvatar
} from '@ionic/react';
import { chevronForward,  personOutline,cameraOutline, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline } from 'ionicons/icons'; // Import the Ionicons icon you want to use
import './Feed.css';

const CongratulationsPage: React.FC<{ match: { params: { title: string } } }> = ({ match }) => {
  const { title } = match.params;

  const navigation = useIonRouter();

  const goToContent = () => {
    navigation.push('/ContentManagement', 'forward');
  };

  return (
    <>
      {/* Menu Content */}
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

      {/* Page Content */}
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
      <IonMenuButton></IonMenuButton>
    </IonButtons>
          <IonTitle class="custom-title">Success!</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding ion-text-center">
      <div className="welcome-container">
        <IonText>
            
          <h1>{title} added!</h1>
          <p>Dear author, your book/course has successfully been published.</p>
          <p>Your book will appear on the Discover page for all readers to read.</p>
          {/* Use the Giphy iframe embed code directly */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <iframe
            title="Typing GIF"
            src="https://giphy.com/embed/LRwc8GjSb1o9flZsCN"
            width="480"
            height="270"
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen
            style={{ pointerEvents: 'none' }}
          ></iframe>
        </div>
          <p>You can also edit the book details on the Content Management Page.</p>
          <p>Thank you for choosing The Golden Goose Institute.</p>
        </IonText>
        <button className="content-btn" onClick={goToContent}>
          Navigate to Content Management
        </button>
        </div>
      </IonContent>
    </IonPage>
    </>
  );
};

export default CongratulationsPage;

