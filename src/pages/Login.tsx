import React, { useState } from 'react';

import {
  IonContent,
  IonPage,
  IonButton,
  useIonRouter,
  IonHeader,
} from '@ionic/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // Make sure the path to your firebaseConfig is correct
import './Login.css';
import AdminLogin from './AdminLogin';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useIonRouter();

  const doSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      // If successful, navigate to the Feed or Dashboard page
      navigation.push('/Feed', 'forward');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message); // Show error message to the user
      }
    }
  };

  const doSignUp = () => {
    navigation.push('/Register', 'forward');
  };

  const adminLogin = () => {
    navigation.push('/AdminLogin', 'forward');
  };
  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent className="ion-padding">
        <div className="upper-frame">
          <img src="/logo.png" alt="Logo" className="logo" style={{ width: '120px', height: 'auto' }} />
          <div className="pen-tip"></div>
        </div>
        <div className="welcome-container">
          <h1>Welcome back</h1>
          <p>Please sign in to continue!</p>

          <div className="form-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>
            <IonButton expand="block" onClick={doSignIn} className="register-btn"> Sign in</IonButton>
            <div className="signup-text">
              Don't have an account? <a onClick={doSignUp}>Sign up</a>
            </div>
            <div className="signup-text">
              Are you an admin?<a onClick={adminLogin}> Login as an Admin</a>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
