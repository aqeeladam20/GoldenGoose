import React, { useState, useEffect  } from 'react';
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
  IonInput,
  IonTextarea,
  IonButton,
  IonCheckbox,
  IonModal,
  IonText,
  IonImg,
  IonRow,
  IonCol, IonIcon, IonAvatar, IonBackButton
} from '@ionic/react';
import './Register.css'; // Import the styles
import { chevronForward,  personOutline,cameraOutline, settingsOutline, helpCircleOutline, homeOutline, libraryOutline, logOutOutline, newspaperOutline, personCircle, personCircleOutline, personCircleSharp, searchCircleOutline } from 'ionicons/icons'; // Import the Ionicons icon you want to use
import { useUser } from './UserContext'; // Import useUser hook
import { auth, firestore, storage} from '../firebase/firebaseConfig'; // Adjust the path to your firebaseConfig file
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { InputChangeEventDetail } from '@ionic/core';
import { IonToast } from '@ionic/react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getBase64Image, resizeImage } from './imageUtils'; // create utils/imageUtils.ts file
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";




function GetStarted() {
  const [showToast, setShowToast] = useState(false);

  // Function to handle input changes for first name
  const handleFirstNameChange = (event: any) => {
    setFirstName(event.detail.value!);
  };

  // Function to handle input changes for surname
  const handleSurnameChange = (event: any) => {
    setSurname(event.detail.value!);
  };
  
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  
  // State for the modal
  const [showModal, setShowModal] = useState(false);
  // State to manage form data
  const [authorData, setAuthorData] = useState({
    biography: '',
    agreeToTerms: false,
  });
  // State for the profile picture
  const [profilePic, setProfilePic] = useState('');
  const { firstName: initialFirstName, surname: initialSurname } = useUser();
  useEffect(() => {
    // Fetch user data from Firebase here
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);

      // Use getDoc instead of setDoc to fetch the document
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFirstName(userData.firstName || initialFirstName);
            setSurname(userData.surname || initialSurname);
            setAuthorData({
              biography: userData.biography || '',
              agreeToTerms: userData.agreeToTerms || false,
            });
            setProfilePic(userData.profilePic || '');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [initialFirstName, initialSurname]);
  const validateForm = () => {
    if (!firstName || !surname) {
      alert('First Name and Surname are required fields.');
      return false;
    }

    // Additional validation for first name and surname, e.g., no numbers
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(surname)) {
      alert('First Name and Surname should only contain letters.');
      return false;
    }

    if (authorData.agreeToTerms === false) {
      alert('Please agree to the Terms and Conditions.');
      return false;
    }

    // Additional validation for other fields can be added here

    return true;
  };
  // Function to handle profile picture upload
const handleProfilePicUpload = async (event: any) => {
  const file = event.target.files[0];

  if (file) {
    try {
      const resizedImage = await resizeImage(file, 500); // adjust the desired size
      const base64Image = await getBase64Image(resizedImage);

      // Convert the base64 string back to a Blob
      const blob = base64ToBlob(base64Image);

      // Create a storage reference
      const storageRef = ref(storage, `profile_pics/${auth.currentUser?.uid}`);

      // Upload the resized and compressed file to Firebase Storage and get a download URL
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Set the profilePic state with the download URL
      setProfilePic(downloadURL);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  }
};
// Utility function to convert base64 to Blob
const base64ToBlob = (base64: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};
  // Function to handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);

        // Save the download URL of the profile picture
        await saveDataToFirestore(profilePic);
      }
    } catch (error) {
      console.error('Error saving author data:', error);
    }
  };

  // Function to store data to firebase
  const saveDataToFirestore = async (profilePicURL: string) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        firstName,
        surname,
        biography: authorData.biography,
        agreeToTerms: authorData.agreeToTerms,
        profilePic: profilePicURL, // Save the download URL, not the actual data
      });

      console.log('Author Data Saved:', authorData);
      // Show the toast
      setShowToast(true);
    }
  };

 // Function to update state on input change
const handleInputChange = (event: CustomEvent<InputChangeEventDetail>, fieldName: string) => {
  const value = event.detail.value;
  setAuthorData((prevData) => ({ ...prevData, [fieldName]: value }));
};

  // Function to handle checkbox change
  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    setAuthorData((prevData) => ({ ...prevData, [name]: checked }));
  };

  return (
    <>
      <IonPage id="main-content">
      <IonHeader>
  <IonToolbar>
    <IonButtons slot="start">
    <IonBackButton defaultHref="/contentmanagement" />
    </IonButtons>

    {/* Display the user's profile picture in the toolbar */}
    <IonAvatar slot="end" className="profile-avatar">
  {profilePic ? (
    <IonImg src={profilePic} />
  ) : (
    /* You can replace the placeholder with a default avatar icon or text */
    <IonIcon icon={personOutline} />
  )}
</IonAvatar>


    <IonTitle class="custom-title">Author Profile</IonTitle>
  </IonToolbar>
</IonHeader>


        <IonContent className="ion-padding">

        <div className="form-container">
          {/* Introduction Text */}
          <div className="welcome-container">
          <IonText>
            <h1>Welcome {firstName} {surname}!</h1>
            <p>Please complete your author profile and accept the terms and conditions in order to publish your books.</p>
          </IonText>
          {/* Display the profile picture */}
          {profilePic && (
            <IonItem>
              <IonAvatar className="profile-avatar">
                <IonImg src={profilePic} />
              </IonAvatar>
            </IonItem>
          )}
           {/* Profile Picture Upload */}
           <IonLabel className="ion-text-center">Upload Profile Picture</IonLabel>
          <IonItem>
            
            <IonButton expand="full" fill="clear">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                
              />
            </IonButton>
          </IonItem>

          </div>
          {/* Author Profile Form */}
          <IonList>
          <IonItem>
          <IonLabel position="floating">First Name</IonLabel>
          <IonInput
            type="text"
            value={firstName}
            onIonChange={(e) => setFirstName(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Surname</IonLabel>
          <IonInput
            type="text"
            value={surname}
            onIonChange={(e) => setSurname(e.detail.value!)}
          />
        </IonItem>
        <IonItem>

        <IonTextarea
            placeholder="Biography"
            value={authorData.biography}
            onIonChange={(e) => handleInputChange(e, 'biography')}
          />

        </IonItem>
      
      
            {/* Link to Terms and Conditions */}
            <IonItem onClick={() => setShowModal(true)}>
              <IonLabel>Read our Terms and Conditions</IonLabel>
            </IonItem>

            {/* Terms and Conditions Checkbox */}
            <IonItem>
              <IonLabel>
                Do you agree with the Terms and Conditions?
                <span className="required">*</span>
              </IonLabel>
              <IonCheckbox
                slot="end"
                name="agreeToTerms"
                checked={authorData.agreeToTerms}
                onIonChange={handleCheckboxChange}
              />
            </IonItem>

            <IonButton expand="block" onClick={handleSubmit} className="register-btn">Save</IonButton>
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message="Form saved successfully"
              duration={2000} // Adjust the duration as needed
              />
          </IonList>
          </div>
        </IonContent>

        {/* Modal for Terms and Conditions */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent className="ion-padding">
            <IonText>
              <h2>The Golden Goose Institute Terms and Conditions:</h2>
              <ol>
                <li>The Golden Goose Institute will charge 20% for each sale of an author's book.</li>
                <li>Authors will receive 80% of the sale.</li>
                <li>The payment gateway will be PayPal.</li>
                <li>Authors must submit their own original book/article; any form of piracy will result in the deletion of the book.</li>
              </ol>
            </IonText>
            <IonButton expand="full" onClick={() => setShowModal(false)} className="register-btn">
              Close
            </IonButton>
            
            
          </IonContent>
        </IonModal>
        
      </IonPage>
    </>
  );
}

export default GetStarted;