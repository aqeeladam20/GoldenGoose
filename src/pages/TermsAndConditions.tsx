// TermsAndConditions.tsx
import React from 'react';
import { IonContent, IonPage, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton } from '@ionic/react';

const TermsAndConditions: React.FC = () => {
  const termsText = `
    The Golden Goose Institute Terms and Conditions:

    1. The Golden Goose Institute will charge 20% for each sale of an author's book.
    2. Authors will receive 80% of the sale.
    3. The payment gateway will be PayPal.
    4. Authors must submit their own original book/article; any form of piracy will result in the deletion of the book.
  `;

  return (
    <IonPage>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/author-profile" />
        </IonButtons>
        <IonTitle>Terms and Conditions</IonTitle>
      </IonToolbar>
      <IonContent className="ion-padding">
        <div dangerouslySetInnerHTML={{ __html: termsText }} />
      </IonContent>
    </IonPage>
  );
};

export default TermsAndConditions;