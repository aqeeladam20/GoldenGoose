import React, { useState } from 'react';
import { IonAlert, IonContent, IonPage, IonButton, useIonRouter, IonInput } from '@ionic/react';
import { auth, firestore } from '../firebase/firebaseConfig'; // Adjust the path to your firebaseConfig file
import './Register.css';
import { getAuth, UserCredential, createUserWithEmailAndPassword, sendEmailVerification, User as FirebaseAuthUser } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { sendVerificationEmail } from '../firebase/firebaseConfig';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false); // Add state for the alert
  const [alertMessage, setAlertMessage] = useState(''); // Add state for the alert

  const navigation = useIonRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      const auth = getAuth(); // Get the auth instance
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        // Send verification email
        await sendVerificationEmail(user);

        setAlertMessage('Please check your email for verification.');
        setShowAlert(true);

        // Redirect to the login page
        navigation.push('/login', 'forward');
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error.message);
        setShowAlert(true);
      }
    }
  };

  
  const sendEmailVerification = async (user: FirebaseAuthUser) => {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.error('Error sending verification email', error);
    }
  };
  

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="upper-frame">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo"
            style={{ width: '120px', height: 'auto' }}
          />
          <div className="pen-tip"></div>
        </div>
        <div className="welcome-container">
          <h1>Welcome.</h1>
          <p>We exist to make authorship as easy as possible.</p>
          <div className="form-container">
            <IonInput type="text" placeholder="First Name" onIonChange={e => setFirstName(e.detail.value!)} />
            <IonInput type="text" placeholder="Surname" onIonChange={e => setSurname(e.detail.value!)} />
            <IonInput type="text" placeholder="Username" onIonChange={e => setUsername(e.detail.value!)} />
            <IonInput type="email" placeholder="Email" onIonChange={e => setEmail(e.detail.value!)} />
            <IonInput type="password" placeholder="Password" onIonChange={e => setPassword(e.detail.value!)} />
            <IonInput type="password" placeholder="Confirm Password" onIonChange={e => setConfirmPassword(e.detail.value!)} />
            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>
            <IonButton expand="block" onClick={handleSignUp} className="register-btn">Sign Up</IonButton>
            <div className="signup-text">
              Already have an account? <a onClick={() => navigation.push('/login', 'forward')}>Sign in</a>
            </div>
          </div>
        </div>
      </IonContent>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Alert'}
        message={alertMessage}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default Register;
