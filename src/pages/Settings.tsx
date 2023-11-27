// Settings.tsx
import React from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonRadioGroup,
  IonListHeader,
  IonRadio,
} from '@ionic/react';
import {
  chevronForward,
  helpCircleOutline,
  homeOutline,
  libraryOutline,
  logOutOutline,
  newspaperOutline,
  personCircleOutline,
  searchCircleOutline,
  settingsOutline,
} from 'ionicons/icons';

import './Settings.css';

function Settings() {
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
            {menuItems.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle className="custom-title">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonListHeader>Theme</IonListHeader>
            <IonItem>
              <IonLabel>Dark Mode</IonLabel>
              <IonToggle slot="end" />
            </IonItem>

            <IonListHeader>Font Settings</IonListHeader>
            <IonItem>
              <IonLabel>Font Size</IonLabel>
              <IonSelect placeholder="Select One">
                <IonSelectOption value="small">Small</IonSelectOption>
                <IonSelectOption value="medium">Medium</IonSelectOption>
                <IonSelectOption value="large">Large</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Font Family</IonLabel>
              <IonSelect placeholder="Select One">
                <IonSelectOption value="serif">Serif</IonSelectOption>
                <IonSelectOption value="sans-serif">Sans-serif</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonListHeader>Account</IonListHeader>
            <IonItem>
              <IonLabel>Notifications</IonLabel>
              <IonToggle slot="end" />
            </IonItem>

            <IonItem>
              <IonLabel>Email Preferences</IonLabel>
              <IonToggle slot="end" />
            </IonItem>

            <IonListHeader>Language</IonListHeader>
            <IonRadioGroup>
              <IonItem>

                <IonRadio slot="start" value="english" />
                <IonLabel>English</IonLabel>
              </IonItem>

              <IonItem>
                <IonRadio slot="start" value="afrikaans" />
                <IonLabel>Afrikaans</IonLabel>
              </IonItem>
            </IonRadioGroup>
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
}



interface MenuItemProps {
  id: string;
  label: string;
  icon: string;
  routerLink: string;
  routerDirection?: string; 

}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, routerLink }) => (
  <IonItem routerLink={routerLink}>
    <IonLabel>{label}</IonLabel>
    <IonIcon icon={icon} slot="start" />
    <IonIcon icon={chevronForward} slot="end" />
  </IonItem>
);

const menuItems: MenuItemProps[] = [
  { id: 'home', label: 'Home Feed', icon: homeOutline, routerLink: '/feed' },
  { id: 'dashboard', label: 'Author Dashboard', icon: newspaperOutline, routerLink: '/authordashboard' },
  { id: 'discover', label: 'Discover Books', icon: searchCircleOutline, routerLink: '/discover' },
  { id: 'library', label: 'My Library', icon: libraryOutline, routerLink: '/library' },
  { id: 'help', label: 'Help and Support', icon: helpCircleOutline, routerLink: '/helpPage' },
  { id: 'profile', label: 'My Profile', icon: personCircleOutline, routerLink: '/profile' },
  { id: 'settings', label: 'Settings', icon: settingsOutline, routerLink: '/settings' },
  { id: 'logout', label: 'Logout', icon: logOutOutline, routerLink: '/home', routerDirection: 'root' },
];

export default Settings;
