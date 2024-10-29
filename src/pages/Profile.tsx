import React from 'react';
import { IonButton,IonIcon,IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { bookOutline, homeOutline , personOutline, settingsOutline} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Profile: React.FC = (props) => {
  const auth = getAuth();
  const user = auth.currentUser;  // Get current authenticated user
  const {isAdmin} = props ; 
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButton slot="start" fill="clear" onClick={() =>  history.push ('/home')}>
    {/* Home icon */}
    <IonIcon icon={homeOutline} />
  </IonButton>
  <IonIcon icon={personOutline} style={{ marginRight: '8px' }} /> Profile
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
                  <p>Role: {isAdmin==true ? "admin" : "user"}</p>

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
