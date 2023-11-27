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
  IonAvatar,
  IonText,
  IonAlert,
  IonButton
} from '@ionic/react';
import { Book } from './types';
import { firestore } from '../firebase/firebaseConfig';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import './BookDetails.css';
import { useIonRouter } from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface BookDetailsProps {
  match: {
    params: {
      id: string;
    };
  };
}

const UserBookDetailsAdmin: React.FC<BookDetailsProps> = ({ match }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const history = useHistory();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDoc = await getDoc(doc(firestore, 'books', match.params.id));
        if (bookDoc.exists()) {
          setBook({ id: bookDoc.id, ...bookDoc.data() } as Book);

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

  const handleViewBook = () => {
    if (book) {
      history.push(`/view-book/${book.id}`);
    }
  };

  const handleDeleteBook = async () => {
    try {
      await deleteDoc(doc(firestore, 'books', match.params.id));
      history.push('/manageusers');
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setShowDeleteAlert(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            <IonBackButton defaultHref="/manageusercontent" />
          </IonButtons>
          <IonTitle>{book?.title} Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {book ? (
          <div className="book-details-container">
            <div>
              <img src={book.coverUrl} alt={book.title} className="book-cover" />
            </div>
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
            {/* Other book details... */}
            <button className="content-btn" onClick={() => setShowDeleteAlert(true)}>
              Delete Book
            </button>
            <IonButton onClick={handleViewBook}>View Book</IonButton>
          </div>
        ) : (
          <div>Loading book details...</div>
        )}
        {!book && <IonSpinner name="bubbles" />}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Confirm Deletion'}
          message={`Are you sure you want to delete this book? It cannot be reversed.`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setShowDeleteAlert(false),
            },
            {
              text: 'OK',
              handler: handleDeleteBook,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default UserBookDetailsAdmin;
