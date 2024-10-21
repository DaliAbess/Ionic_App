import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { getAuth } from 'firebase/auth';

const Profile: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;  // Get current authenticated user

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol>
              <h2>User Profile</h2>
              {user ? (
                <div>
                  <p>Email: {user.email}</p>
                  <p>Display Name: {user.email}</p>
                </div>
              ) : (
                <p>No user information available.</p>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
