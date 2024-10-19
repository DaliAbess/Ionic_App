import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonImg } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      {/* Header with Buttons */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          <IonButton slot="end" onClick={() => window.location.href = '/login'}>Login</IonButton>
          <IonButton slot="end" onClick={() => window.location.href = '/login'}>Register</IonButton>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        <IonGrid className="ion-text-center ion-padding">
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="6">
              {/* Image in the center */}
              <IonImg src="src/assets/img/ionic.png" alt=" Image" />
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center ion-padding">
            <IonCol size="12" sizeMd="6">
              {/* Text below the image */}
              <h2>Welcome to our Application</h2>
              <p>Manage your tasks, track progress, and much more!</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
