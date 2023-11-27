// BookDetails.
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonButton,
  IonAlert,
  IonSpinner,
  IonBackButton
  
} from '@ionic/react';
import { Book } from './types';
import { firestore } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import './BookDetails.css'; // Import the CSS file for styling

interface BookDetailsProps {
  match: {
    params: {
      id: string;
    };
  };
}

const BookDetails: React.FC<BookDetailsProps> = ({ match }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [editedFields, setEditedFields] = useState<Partial<Book>>({}); // Track edited fields
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleting, setDeleting] = useState(false); // Track book deletion state
  const history = useHistory(); // Use history for navigation

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDoc = await getDoc(doc(firestore, 'books', match.params.id));
        if (bookDoc.exists()) {
          setBook({ id: bookDoc.id, ...bookDoc.data() } as Book);
          setEditedFields({}); // Reset edited fields when loading new book details
        } else {
          // Handle case where book with the specified ID is not found
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
  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      // Update the Firestore document with the edited fields
      await updateDoc(doc(firestore, 'books', match.params.id), editedFields);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating book details:', error);
    }
  };

  const handleInputChange = (field: keyof Book, value: string) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };
  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true); // Set the deleting state to true to show the spinner
      // Delete the Firestore document
      await deleteDoc(doc(firestore, 'books', match.params.id));
      setDeleting(false); // Reset the deleting state
  
      // Use history to navigate back to the content management page
      history.replace('/contentmanagement');
  
      console.log('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };
  ;

  
  const handleDeleteCancel = () => {
    setShowDeleteAlert(false);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
          <IonBackButton defaultHref="/feed" />
          </IonButtons>
          <IonTitle>{book?.title} Details</IonTitle>
          {editMode ? (
            <IonButtons slot="end">
              <IonButton onClick={handleSaveClick}>Save</IonButton>
            </IonButtons>
          ) : (
            <IonButtons slot="end">
              <IonButton onClick={handleEditClick}>Edit Details</IonButton>
              <IonButton onClick={handleDeleteClick}>Delete</IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {book ? (
          <div className="book-details-container">
            <div>
              {/* Display book details including cover, book file, and year */}
              <img src={book.coverUrl} alt={book.title} className="book-cover" />
            </div>
            <div>
              <strong>Title:</strong>{' '}
              {editMode ? (
                <input
                  value={editedFields.title ?? book.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              ) : (
                book.title
              )}
            </div>
            <div>
              <strong>Type:</strong>{' '}
              {editMode ? (
                <input
                  value={editedFields.type ?? book.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                />
              ) : (
                book.type
              )}
            </div>
            <div>
              <strong>Description:</strong>{' '}
              {editMode ? (
                <input
                  value={editedFields.description ?? book.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              ) : (
                book.description
              )}
            </div>
            <div>
              <strong>Language:</strong>{' '}
              {editMode ? (
                <input
                  value={editedFields.language ?? book.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                />
              ) : (
                book.language
              )}
            </div>
            <div>
              <strong>Category:</strong>{' '}
              {editMode ? (
                <input
                  value={editedFields.category ?? book.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              ) : (
                book.category
              )}
            </div>
            <div>
              <strong>Price:</strong>{' '}
              {editMode ? (
                <input
                  value={editedFields.price ?? book.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              ) : (
                book.price
              )}
            </div>
            <div>
              <strong>Selected Currency:</strong>{' '}
              {editMode ? (
                <input
                  value={editedFields.currency ?? book.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                />
              ) : (
                book.currency
              )}
            </div>
            <div>
              <strong>Year:</strong>{' '}
              {editMode ? (
                <input
                  type="number"
                  value={editedFields.year ?? book.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                />
              ) : (
                book.year
              )}
            </div>
            <IonButton onClick={handleViewBook}>View Book</IonButton>

            {/* Add other book details here */}
          </div>
        ) : (
          <div>Loading book details...</div>
        )}
         {/* Delete confirmation alert */}
         <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={handleDeleteCancel}
          header="Delete Book"
          message="Are you sure you want to delete this book? It cannot be reversed."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: handleDeleteCancel,
            },
            {
              text: 'OK',
              handler: handleDeleteConfirm,
            },
          ]}
        />
        {/* Spinner for book deletion */}
        {deleting && <IonSpinner name="dots" />}
      </IonContent>
    </IonPage>
  );
};

export default BookDetails;
