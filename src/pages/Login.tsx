import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons'; // Import icons
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase'; // Firebase setup
import { useHistory } from 'react-router-dom'; 
import './Login.css'; // Import custom CSS

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

  return (
    <IonContent className="login-content">
      <IonGrid className="ion-text-center">
        <IonRow className="ion-justify-content-center">
          <IonCol size="12" sizeMd="6" sizeLg="4">
            {/* Form Title */}
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Please login to continue</p>

            {/* Email Input */}
            <IonItem className="input-item">
              <IonIcon icon={mailOutline} slot="start" />
              <IonLabel position="floating">Email</IonLabel>
              <IonInput value={email} onIonChange={e => setEmail(e.detail.value!)} />
            </IonItem>

            {/* Password Input */}
            <IonItem className="input-item">
              <IonIcon icon={lockClosedOutline} slot="start" />
              <IonLabel position="floating">Password</IonLabel>
              <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
            </IonItem>

            {/* Login Button */}
            <IonButton expand="block" className="custom-button" onClick={handleLogin}>
              Login
            </IonButton>

            {/* Register Link */}
            <p className="register-text">
              Don't have an account? <span onClick={() => history.push('/register')} className="register-link">Register</span>
            </p>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Login;
