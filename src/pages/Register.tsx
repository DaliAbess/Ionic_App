import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const firestore = getFirestore();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'roles', user.uid), {
        email: user.email,
        isAdmin: false, // Default role is 'user'
      });

      alert('Registration successful');
      history.push('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  const styles = {
    container: {
      padding: '3rem',
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    formTitle: {
      fontSize: '2.5rem',
      fontWeight: '600',
      color: '#1a73e8', // Blue color
      marginBottom: '0.5rem',
    },
    formSubtitle: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '2rem',
    },
    inputItem: {
      marginBottom: '1.5rem',
      borderRadius: '10px', // Rounded corners for inputs
    },
    inputIcon: {
      color: '#1a73e8', // Blue color for icons
    },
    button: {
      backgroundColor: '#fff', // Blue color for button
      color: '#fff',
      borderRadius: '600px', // Full rounded button
      padding: '1rem',
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },

    loginText: {
      marginTop: '1.5rem',
      fontSize: '1rem',
      color: '#555',
    },
    loginLink: {
      color: '#1a73e8',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
  };

  return (
    <IonContent className="ion-padding" style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <IonGrid className="ion-text-center">
        <IonRow className="ion-justify-content-center">
          <IonCol size="12" sizeMd="6" sizeLg="4">
            <div style={styles.container}>
              {/* Form Title */}
              <h2 style={styles.formTitle}>Sign Up</h2>
              <p style={styles.formSubtitle}>Create a new account to get started</p>

              {/* Email Input */}
              <IonItem style={styles.inputItem}>
                <IonIcon icon={mailOutline} slot="start" style={styles.inputIcon} />
                <IonLabel position="floating" style={{ marginBottom: '0.9rem' }}>Email</IonLabel>
                <IonInput value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
              </IonItem>

              {/* Password Input */}
              <IonItem style={styles.inputItem}>
                <IonIcon icon={lockClosedOutline} slot="start" style={styles.inputIcon} />
                <IonLabel position="floating" style={{ marginBottom: '0.9rem' }}>Password</IonLabel>

                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                />
              </IonItem>

              {/* Register Button */}
              <IonButton expand="block" style={styles.button} onClick={handleRegister}>
                Register
              </IonButton>

              {/* Login Link */}
              <p style={styles.loginText}>
                Already have an account?{' '}
                <span style={styles.loginLink} onClick={() => history.push('/login')}>
                  Login
                </span>
              </p>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Register;
