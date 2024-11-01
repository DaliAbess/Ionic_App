import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonImg } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const Home: React.FC = (isAdmin) => {
  const history = useHistory();
  const auth = getAuth();
  const [user, setUser] = useState<any>(null);
  const admin= isAdmin ;
  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user state if logged in, null otherwise
      
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

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
      {/* Header with Buttons */}
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ gap: '0.9rem' }}>Home</IonTitle>

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

      {/* Content */}
      <IonContent fullscreen>
        <IonGrid className="ion-text-center ion-padding">
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="6">
              {/* Image in the center */}
              <IonImg src="src/assets/img/1.png" alt="Image" />
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center ion-padding">
            <IonCol size="12" sizeMd="6">
              {/* Text below the image */}
              <h2>Welcome to E-Library  </h2>
              <p>Manage your Reservation , Search books, and much more!</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
