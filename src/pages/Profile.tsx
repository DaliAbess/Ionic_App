
import React from 'react';
import {
  IonButton,
  IonIcon,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle
} from '@ionic/react';

import { homeOutline, personOutline, mailOutline, keyOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';


interface ProfileProps {
  isAdmin: boolean;
}

const Profile: React.FC<ProfileProps> = ({ isAdmin }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const history = useHistory();
const displayName = user?.email ? user.email.split('@')[0] :user.email;
  // Define inline styles here
  const styles = {
    profileCard: {
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      background: '#f9f9f9',
      padding: '16px',
    },
    profileInfoText: {
      fontSize: '16px',
      margin: '4px 0',
    },
    iconStyle: {
      marginRight: '8px',
    },
  };
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
 window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" onClick={() => history.push('/home')}>
            <IonIcon icon={homeOutline} />
          </IonButton>
          <IonTitle>Profile</IonTitle>
          {user ?  (  // If the user is logged in, show the Logout button
          <>
            <IonButton fill="outline" slot="end" style={{ marginLeft: '1rem' }} color="danger" onClick={handleLogout}>
              Logout
            </IonButton>
            <IonButton fill="outline" slot="end" onClick={() => history.push('/profile')}>
            Profile
          </IonButton>
          <IonButton fill="outline" slot="end" onClick={() => history.push('/books')}>
            Books
          </IonButton>


          </>
          ) : (  // If the user is not logged in, show Login and Register buttons
            <>
       
              <IonButton fill="outline" slot="end" onClick={() => window.location.href = '/login'}>Login</IonButton>
          <IonButton fill="outline" slot="end" onClick={() => window.location.href = '/register'}>Register</IonButton>
           
            </>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className="ion-padding">
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="8" size-lg="6">
              <IonCard style={styles.profileCard}>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={personOutline} style={styles.iconStyle} />
                    User Profile
                  </IonCardTitle>
                  <IonCardSubtitle>
                    <IonIcon icon={keyOutline} style={styles.iconStyle} />
                    {isAdmin ? 'Admin' : 'User'}
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  {user ? (
                    <div>
                      <IonRow className="ion-align-items-center">
                        <IonIcon icon={mailOutline} style={styles.iconStyle} />
                        <p style={styles.profileInfoText}>Email: {user.email}</p>
                      </IonRow>
                      <IonRow className="ion-align-items-center">
                        <IonIcon icon={personOutline} style={styles.iconStyle} />
                        <p style={styles.profileInfoText}>
                          Display Name: {displayName || 'No display name available'}
                        </p>
                      </IonRow>
                    </div>
                  ) : (
                    <p>No user information available. Please log in.</p>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

