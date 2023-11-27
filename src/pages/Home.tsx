import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonButton,
  useIonRouter
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { logoFacebook, logoGoogle, logoApple } from 'ionicons/icons';


const Home: React.FC = () => {
    //the button navigation code starts here
    const navigation = useIonRouter()
    //this method opens the Login page
    const doLogin = () => {
        
        navigation.push('/Login', 'forward')
    }
    //this method opens the Registration page
    const doSignUp = () => {
      
      navigation.push('/Register', 'forward')
  }
    //button navigation ends here
  return (
    <IonPage>
    <IonHeader>
    </IonHeader>
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
        <h1>Discover the Writer Within</h1>
        <p>Unleash your storytelling potential with our author's app and find your next favorite book today.</p>
        <div className="typewriter-container">
        <img
            src={"/Pngtree-classic-antique-typewriter.jpg"}
            alt="Typewriter"
          className="typewriter-image"/>
        </div>

        
        <div className="button-container">
          <IonButton expand="block" fill="outline" onClick={() => doLogin()} >Login</IonButton> 
          <IonButton expand="block" fill="outline" onClick={() => doSignUp()} >Sign Up</IonButton>
        </div>
      </div>
      
      <div className="footer">
            <div className="centered-text">
              <a href="https://www.facebook.com/thegoldengooseinstitute" target="_blank" rel="noopener noreferrer">
                Connect with us on Facebook
              </a>
            </div>
            <div className="centered-text">
              <a href="https://thegoldengooseinstitute.com" target="_blank" rel="noopener noreferrer">
                Visit our website
              </a>
            </div>
            </div>
    </IonContent>
  </IonPage>
  );
};

export default Home;