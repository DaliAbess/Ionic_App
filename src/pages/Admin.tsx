import React, { useState } from 'react';
import { IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonCard, IonCardContent } from '@ionic/react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { bookOutline, homeOutline, arrowBackOutline, settingsOutline } from 'ionicons/icons';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const Admin: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('disponible');
  const [picture, setPicture] = useState<File | null>(null);
  const history = useHistory();
  const auth = getAuth();
 
  const firestore = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;
  const handleUploadPicture = async (file: File) => {
    try {
      const storageRef = ref(storage, `books/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading picture: ', error);
      return null;
    }
  };

  const handleAddBook = async () => {
    try {
      let pictureURL = null;
      if (picture) {
        pictureURL = await handleUploadPicture(picture);
      }
      await addDoc(collection(firestore, 'books'), {
        title,
        description,
        status,
        picture: pictureURL,
      });
      alert('Book added successfully');
    } catch (error) {
      console.error('Error adding book: ', error);
    }
  };
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
          <IonButton slot="start" fill="clear" onClick={() => history.push('/books')}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Add Book</IonTitle>
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

      <IonContent fullscreen className="ion-padding" style={{ display: 'flex', justifyContent: 'center' }}>
        <IonCard style={{margin: '0 auto', width: '100%', maxWidth: '500px', padding: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <IonCardContent>
            <IonItem lines="none" style={{ marginBottom: '1rem' }}>
              <IonLabel position="floating" style={{ color: '#666', fontSize: '1rem' }}>Title</IonLabel>
              <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} />
            </IonItem>

            <IonItem lines="none" style={{ marginBottom: '1rem' }}>
              <IonLabel position="floating" style={{ color: '#666', fontSize: '1rem' }}>Description</IonLabel>
              <IonInput value={description} onIonChange={e => setDescription(e.detail.value!)} />
            </IonItem>

            <IonItem lines="none" style={{ marginBottom: '1rem' }}>
              <IonLabel>Picture</IonLabel>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPicture(e.target.files[0]);
                  }
                }}
              />
            </IonItem>

            <IonItem lines="none" style={{ marginBottom: '1rem' }}>
              <IonLabel>Status</IonLabel>
              <IonSelect value={status} onIonChange={e => setStatus(e.detail.value!)}>
                <IonSelectOption value="disponible">Disponible</IonSelectOption>
                <IonSelectOption value="reservé">Reservé</IonSelectOption>
              </IonSelect>
            </IonItem>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <IonButton onClick={handleAddBook} expand="block" style={{ flex: 1, borderRadius: '20px' }}>
                Add Book
              </IonButton>
              <IonButton color="medium" onClick={() => history.push('/books')} expand="block" style={{ flex: 1, borderRadius: '20px' }}>
                Cancel
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Admin;
