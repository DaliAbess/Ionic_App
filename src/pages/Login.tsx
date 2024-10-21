import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      history.push('/home');
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
      borderRadius: '10px',
       // Rounded corners for inputs
    },
    inputIcon: {
      color: '#1a73e8', // Blue color for icons
    },
    button: {
      backgroundColor: '#fff', // Blue color for button
      color: '#fff',
      borderRadius: '100px', // Full rounded button
      padding: '1rem',
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
    registerText: {
      marginTop: '1.5rem',
      fontSize: '1rem',
      color: '#555',
    },
    registerLink: {
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
              <h2 style={styles.formTitle}>Welcome Back</h2>
              <p style={styles.formSubtitle}>Please login to continue</p>

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

              {/* Login Button */}
              <IonButton expand="block" onClick={handleLogin}>
                Login
              </IonButton>

              {/* Register Link */}
              <p style={styles.registerText}>
                Don't have an account?{' '}
                <span style={styles.registerLink} onClick={() => history.push('/register')}>
                  Register
                </span>
              </p>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Login;
