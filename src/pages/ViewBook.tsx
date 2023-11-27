import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonBackButton } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import EpubViewer from './EpubViewer';

const ViewBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any | null>(null); // Replace 'any' with your actual Book type

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDoc = await getDoc(doc(firestore, 'books', id));
        if (bookDoc.exists()) {
          setBook({ id: bookDoc.id, ...bookDoc.data() });
        } else {
          console.error(`Book with ID ${id} not found.`);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            {/* Add IonBackButton for the back functionality */}
            <IonBackButton defaultHref="/feed" />
          </IonButtons>
          <IonTitle>{book?.title} Book</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {book ? (
          <div>
            {/* Render other book details */}
            <div>
              <strong>Title:</strong> {book.title}
            </div>
            {/* ... (other book details) */}
            <div>
              {/* Use the updated EpubViewer */}
              {book.pdfUrl || book.bookUrl ? <EpubViewer url={book.pdfUrl || book.bookUrl} /> : null}
            </div>
          </div>
        ) : (
          <div>Loading book details...</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ViewBook;
