import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Discover from './pages/Discover';
import HelpPage from './pages/HelpPage';
import Profile from './pages/Profile';
import Library from './pages/Library';
import SubmitBook from './pages/SubmitBook';
import GetStarted from './pages/GetStarted';
import { UserProvider } from './pages/UserContext'; // Note the use of braces for named exports
import { resizeImage, getBase64Image } from './pages/imageUtils';
import TermsAndConditions from './pages/TermsAndConditions';
import CongratulationsPage from './pages/CongratulationsPage';
import ContentManagement from './pages/ContentManagement';
import BookDetails from './pages/BookDetails';
import BuyBook from './pages/BuyBook';
import ViewBook from './pages/ViewBook'; 
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ManageUsers from './pages/ManageUsers';
import ManageUserContent from './pages/ManageUserContent';
import UserBookDetailsAdmin from './pages/UserBookDetailsAdmin';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import AuthorDashboard from './pages/AuthorDashboard';
import Settings from './pages/Settings';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
            <PayPalScriptProvider options={{ 'clientId': 'AQrx69_ODmMsq51t79xKPPRVwXhRcN09pTTtScrpJQY5_bWoz5gUKt-5i2Y628exGvO7MsCX-4LNSiOF' }}>

    <IonReactRouter>
    <UserProvider>
      <IonRouterOutlet>
      <Route exact path ="/" component={Home} />
      <Route path="/home" component={Home} exact={true} />
      <Route path="/login" component={Login} exact={true} />
      <Route path="/register" component={Register} exact={true} />
      <Route path="/feed" component={Feed} exact={true} />
      <Route path="/discover" component={Discover} exact={true} />
      <Route path="/helpPage" component={HelpPage} exact={true} />
      <Route path="/library" component={Library} exact={true} />
      <Route path="/profile" component={Profile} exact={true} />
      <Route path="/authordashboard" component={AuthorDashboard} exact={true} />
      <Route path="/settings" component={Settings} exact={true} />
      <Route path="/submitBook" component={SubmitBook} exact={true} />
      <Route path="/getStarted" component={GetStarted} exact={true} />
      <Route path="/termsandconditions" component={TermsAndConditions} exact={true} />
      <Route path="/congratulations/:title" component={CongratulationsPage} exact={true} />
      <Route path="/contentmanagement" component={ContentManagement} exact={true} />
      <Route path="/bookdetails/:id" component={BookDetails} exact={true} />
      <Route path="/buybook/:id" component={BuyBook} exact={true} />
      <Route path="/view-book/:id" component={ViewBook} />
      <Route path="/admindashboard" component={AdminDashboard} exact={true} />
      <Route path="/adminlogin" component={AdminLogin} exact={true} />
      <Route path="/manageusers" component={ManageUsers} exact={true} />
      <Route path="/manageusercontent" component={ManageUserContent} exact={true} />
      <Route path="/userbookdetailsadmin/:id" component={UserBookDetailsAdmin} exact={true} />


      </IonRouterOutlet>
      </UserProvider>
    </IonReactRouter>
    </PayPalScriptProvider>

  </IonApp>
);

export default App;
