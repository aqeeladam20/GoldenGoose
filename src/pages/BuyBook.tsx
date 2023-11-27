import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonSpinner,
  IonBackButton,
  IonButton
} from '@ionic/react';
import { Book } from './types';
import { firestore } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useIonRouter } from '@ionic/react';
import './BuyBook.css';
import { useHistory } from 'react-router';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


interface BookDetailsProps {
  match: {
    params: {
      id: string;
    };
  };
}

const BuyBook: React.FC<BookDetailsProps> = ({ match }) => {
  const history = useHistory();
  const [book, setBook] = useState<Book | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDoc = await getDoc(doc(firestore, 'books', match.params.id));
        if (bookDoc.exists()) {
          setBook({ id: bookDoc.id, ...bookDoc.data() } as Book);

          // Fetch author's name from the 'users' collection
          const userId = bookDoc.data().userId;
          const userDoc = await getDoc(doc(firestore, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAuthorName(`${userData.firstName} ${userData.surname}`);
          } else {
            console.error(`Author with ID ${userId} not found.`);
          }
        } else {
          console.error(`Book with ID ${match.params.id} not found.`);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [match.params.id]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AQrx69_ODmMsq51t79xKPPRVwXhRcN09pTTtScrpJQY5_bWoz5gUKt-5i2Y628exGvO7MsCX-4LNSiOF';
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.setAttribute('data-namespace', 'paypal_sdk');
    document.body.appendChild(script);

    script.onload = () => {
      if (window.paypal && typeof window.paypal.Buttons === 'function') {
        window.paypal.Buttons({
          style: {
            layout: 'horizontal',
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: book?.price.toString() || '0.00',
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return Promise.resolve(setPaymentCompleted(true));
          },
        }).render('#paypal-button-container');
      }
    };
  }, [book]);

  const handleViewBook = () => {
    if (book) {
      history.push(`/view-book/${book.id}`);
    }
  };

  const downloadAudioBook = async () => {
    if (book && book.audioUrl) {
      const storageRef = ref(getStorage(), book.audioUrl);
      try {
        const url = await getDownloadURL(storageRef);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'audiobook.mp3'); // or the file name you want
        document.body.appendChild(link);
        link.click();
        
        // Check if the parentNode is not null before removing the child
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      } catch (error) {
        console.error('Error downloading the audio book:', error);
        alert('Error downloading the audio book. Please try again later.');
      }
    }
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            <IonBackButton defaultHref="/feed" />
          </IonButtons>
          <IonTitle>{book?.title} Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {book ? (
          <div className="book-details-container">
            <img src={book.coverUrl} alt={book.title} className="book-cover" />
            <div>
              <strong>Title:</strong> {book.title}
            </div>
            <div>
              <strong>Type:</strong> {book.type}
            </div>
            <div>
              <strong>Description:</strong> {book.description}
            </div>
            <div>
              <strong>Language:</strong> {book.language}
            </div>
            <div>
              <strong>Category:</strong> {book.category}
            </div>
            <div>
              <strong>Price:</strong> {book.price}
            </div>
            <div>
              <strong>Selected Currency:</strong> {book.currency}
            </div>
            <div>
              <strong>Year:</strong> {book.year}
            </div>
            <div>
              <strong>Author:</strong> {authorName}
            </div>
            <div id="paypal-button-container"></div>
          {/* The "View Book" button is always visible */}
          <IonButton onClick={handleViewBook}>View Book</IonButton>
          <button className="content-btn" onClick={downloadAudioBook}>Download Audio Book</button>
        </div>
        ) : (
          <div>Loading book details...</div>
        )}
        {!book && <IonSpinner name="bubbles" />}
      </IonContent>
    </IonPage>
  );
};

export default BuyBook;
