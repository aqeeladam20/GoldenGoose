import React, { useRef, useState } from 'react';
import { IonText, IonButtons, IonMenuButton, IonBackButton, IonModal, IonPage, IonItem, IonLabel, IonCheckbox, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import './SubmitBook.css';
import ePub from 'epubjs';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '../firebase/firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';


const SubmitBook: React.FC = () => {
  const history = useHistory();

  const allowedImageTypes = ['image/jpeg', 'image/png'];
  const allowedBookTypes = ['application/pdf', 'application/epub+zip'];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'ZAR']; // Add more currencies as needed
  const [selectedCurrency, setSelectedCurrency] = useState('ZAR'); // Default currency

  const genres = [
    'Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Romance',
    'Horror',
    'Adventure',
    'Historical Fiction',
    'Non-fiction',
    'Biography',
    'Autobiography',
    'Self-help',
    'Business',
    'Health',
    'Cooking',
    'Travel',
    'Science',
    'History',
    'Philosophy',
    'Religion',
    'Poetry',
    'Children',
    'Young Adult',
    'Comics',
    'Graphic Novel',
    'Manga',
    'Classic',
    'Other'
  ];
  const languages = [
    'English',
    'Afrikaans',
    'Zulu',
    'Xhosa',
    'Sotho',
    'Tswana',
    'Northern Sotho',
    'Swazi',
    'Tsonga',
    'Venda',
    'Ndebele',
    'Southern Ndebele',
    'Tsonga',
    'Swazi',
    'Tswana',
    'Venda',
    'Other African Languages',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Russian',
    'Hindi',
    'Portuguese',
    'Italian',
    'Dutch',
    'Other'
  ];
  
  const [bookUrl, setBookUrl] = useState<string | null>(null);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookFileType, setBookFileType] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState(false); // Initialize agreeToTerms to false
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const bookRef = useRef<HTMLIFrameElement>(null);
  const [user] = useAuthState(auth);

  const handleBookUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && allowedBookTypes.includes(file.type)) {
      const objectUrl = URL.createObjectURL(file);
      setBookUrl(objectUrl);
      setBookFile(file);
      if (file.name.endsWith('.epub')) {
        setBookFileType('epub');
        const book = ePub(objectUrl);
        book.renderTo(bookRef.current!);
      } else if (file.name.endsWith('.pdf')) {
        setBookFileType('pdf');
        // Additional handling for PDF if required
      }
    } else {
      alert('Invalid book file type. Please upload a PDF or EPUB file.');
    }
  };

  const handleCheckboxChange = (e: any) => {
    setAgreeToTerms(e.detail.checked);
  };
  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      // Check if the selected file type is allowed
      if (!file.type.includes('jpeg') && !file.type.includes('png')) {
        alert('Please upload a valid JPEG or PNG image.');
        // Clear the input field
        event.target.value = '';
        return;
      }
  
      setCover(file);
    }
  };
  
  const isValidForm = () => {
    return (
      type !== '' &&
      title !== '' &&
      description !== '' &&
      language !== '' &&
      category !== '' &&
      price !== '' &&
      cover !== null &&
      bookFile !== null &&
      agreeToTerms
    );
  };
  const handleSubmit = async () => {
    console.log('Submit button clicked');
    if (!user) {
      alert('You must be logged in to submit a book.');
      return;
    }

    if (!isValidForm()) {
      alert('Please fill in all fields and agree to the Terms and Conditions.');
      return;
    }
    const newBookData = {
      userId: user.uid,
      type,
      title,
      description,
      language,
      category,
      price,
      currency: selectedCurrency, // Add currency property
      coverUrl: '',
      bookUrl: '',
      year, // Include the year field
    };

    try {
      if (cover) {
        const coverSnapshot = await uploadBytes(storageRef(storage, `covers/${cover.name}`), cover);
        newBookData.coverUrl = await getDownloadURL(coverSnapshot.ref);
      }

      if (bookFile) {
        const bookFilePath = bookFileType === 'epub' ? `epubs/${bookFile.name}` : `pdfs/${bookFile.name}`;
        const bookFileSnapshot = await uploadBytes(storageRef(storage, bookFilePath), bookFile);
        newBookData.bookUrl = await getDownloadURL(bookFileSnapshot.ref);
      }

      await addDoc(collection(firestore, 'books'), newBookData);
      alert("Book submitted successfully!");
      
      // Navigate to the congratulatory page
      history.push(`/congratulations/${encodeURIComponent(title)}`);
    } catch (error) {
      console.error("Error during submission: ", error);
      alert("An error occurred during submission. Please check the console for more details.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            
            <IonBackButton defaultHref="/authordashboard" />
          </IonButtons>
          <IonTitle>Submit New Book/Course</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="submit-book-container">
          <div className="submitBook-form-container">
            <div className="inputGroup">
              <span className="label">Type:</span>
              <IonSelect value={type} placeholder="Select One" onIonChange={e => setType(e.detail.value)}>
                <IonSelectOption value="book">Book</IonSelectOption>
                <IonSelectOption value="course">Course</IonSelectOption>
              </IonSelect>
            </div>

            <div className="inputGroup">
              <span className="label">Title:</span>
              <IonInput value={title} placeholder="Enter title" onIonChange={e => setTitle(e.detail.value ?? '')} />
            </div>
            <div className="inputGroup">
    <span className="label">Year:</span>
    <IonInput
        type="number"
        value={year}
        placeholder="Enter year"
        onIonChange={(e) => {
            const inputValue = e.detail.value ? parseInt(e.detail.value, 10) : '';
            if (inputValue && inputValue <= new Date().getFullYear()) {
                setYear(inputValue);
            }
        }}
        onIonInput={(e) => {
            // Prevent future years
            const inputElement = e.target as unknown as HTMLInputElement;
            const inputValue = inputElement.value ? parseInt(inputElement.value, 10) : 0;
            if (inputValue > new Date().getFullYear()) {
                inputElement.value = new Date().getFullYear().toString();
                setYear(new Date().getFullYear());
            }
        }}
    />
</div>

            <div className="inputGroup">
              <span className="label">Description:</span>
              <IonInput value={description} placeholder="Describe your book/course here..." onIonChange={e => setDescription(e.detail.value ?? '')} />
            </div>

            <div className="inputGroup">
            <span className="label">Language:</span>
          <IonSelect value={language} placeholder="Select language" onIonChange={e => setLanguage(e.detail.value)}>
               {languages.map(lang => (
           <IonSelectOption key={lang} value={lang}>
             {lang}
           </IonSelectOption>
  ))}
</IonSelect></div>

            <div className="inputGroup">
            <span className="label">Category:</span>
          <IonSelect value={category} placeholder="Select category" onIonChange={e => setCategory(e.detail.value)}>
           {genres.map(genre => (
          <IonSelectOption key={genre} value={genre}>
           {genre}
           </IonSelectOption>
  ))}
</IonSelect></div>

           <span className="label">Price:</span>
           <IonInput
              type="number"
              value={price}
              placeholder="Enter price"
              onIonChange={(e) => {
               const inputValue = e.detail.value ?? '';
              // Check if the input is a valid positive number
             if (/^\d*\.?\d+$/.test(inputValue) || inputValue === '') {
             setPrice(inputValue);
               }
               }}
              onIonInput={(e) => {
           // Prevent negative input from the slider
             const inputElement = e.target as unknown as HTMLInputElement;
           if (parseFloat(inputElement.value) < 0) {
             inputElement.value = '0';
            setPrice('0');
            }
            }}
            />





<IonSelect
    value={selectedCurrency}
    placeholder="Select currency"
    onIonChange={(e) => setSelectedCurrency(e.detail.value)}
>
    {currencies.map((currency) => (
        <IonSelectOption key={currency} value={currency}>
            {currency}
        </IonSelectOption>
    ))}
</IonSelect>

      <div className="inputGroup">
        <span className="label">Cover:</span>
      <input 
          type="file" 
          placeholder="Upload image" 
          onChange={handleCoverUpload} 
          accept="image/jpeg, image/png"
          />
      </div>


            <div className="inputGroup">
              <span className="label">EPub/PDF Book:</span>
              <input 
                type="file" 
                placeholder="Choose file" 
                accept=".epub,.pdf" 
                onChange={handleBookUpload} 
              />
            </div>

            
            {/* Link to Terms and Conditions */}
            <IonItem onClick={() => setShowModal(true)}>
              <IonLabel>Read our Terms and Conditions</IonLabel>
            </IonItem>

            <IonItem>
               
              <IonLabel>
                Do you agree with the Terms and Conditions?
                <span className="required">*</span>
              </IonLabel>
              <IonCheckbox
                slot="end"
                name="agreeToTerms"
                checked={agreeToTerms}
                onIonChange={handleCheckboxChange}
              />
            </IonItem>
            <div className="submit-button-container">
        <IonButton
          className={`custom-yellow-button submit-button ${isValidForm() ? '' : 'ion-activated'}`}
          onClick={handleSubmit}
          disabled={!isValidForm()} // Disable the button if the form is not valid
        >
          SUBMIT
        </IonButton>
      </div>
          </div>
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
  );
};

export default SubmitBook;
