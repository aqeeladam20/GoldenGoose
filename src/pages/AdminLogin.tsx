import React, { useState } from 'react';
import {  IonMenuButton, 
    IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonImg, IonMenu, IonContent, IonPage, IonButton, useIonRouter, IonHeader } from '@ionic/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import './Login.css';
import { chevronForward, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline } from 'ionicons/icons'; // Import the Ionicons icon you want to use


const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useIonRouter();

  const doSignIn = async () => {
    try {
      // Convert entered email to lowercase for case-insensitive matching
      const lowercaseEmail = email.toLowerCase();
  
      // Check if the provided credentials match the admin's credentials
      if (
        lowercaseEmail === 'goldengoose605@gmail.com' &&
        password === 'COMPLICATEDpassword#2023!'
      ) {
        // Manually sign in the admin without checking email verification
        await signInWithEmailAndPassword(auth, email, password);
  
        // Navigate to the Admin Dashboard
        navigation.push('/AdminDashboard', 'forward');
      } else {
        // If credentials do not match, show an error message
        alert('Invalid credentials for admin.');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };
  
  return (
    <>
    
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent className="ion-padding">
        <div className="upper-frame">
          <img src="/logo.png" alt="Logo" className="logo" style={{ width: '120px', height: 'auto' }} />
          <div className="pen-tip"></div>
        </div>
        <div className="welcome-container">
          <h1>Welcome back Admin,</h1>
          <p>Please sign in to continue!</p>

          <div className="form-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>
            <IonButton expand="block" onClick={doSignIn} className="register-btn">
              Sign in
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
    </>
  );
};

export default AdminLogin;
