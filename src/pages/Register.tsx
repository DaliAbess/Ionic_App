import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons'; // Import icons
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase'; // Firebase setup
import { useHistory } from 'react-router-dom';
import './Register.css'; // Import custom CSS

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful!');
      history.push('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <IonContent className="register-content">
      <IonGrid className="ion-text-center">
        <IonRow className="ion-justify-content-center">
          <IonCol size="12" sizeMd="6" sizeLg="4">
            {/* Form Title */}
            <h2 className="form-title">Create an Account</h2>
            <p className="form-subtitle">Sign up to get started</p>

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

            {/* Register Button */}
            <IonButton expand="block" className="custom-button" onClick={handleRegister}>
              Register
            </IonButton>

            {/* Login Link */}
            <p className="login-text">
              Already have an account? <span onClick={() => history.push('/login')} className="login-link">Login</span>
            </p>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Register;
