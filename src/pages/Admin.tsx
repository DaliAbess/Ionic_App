import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Admin: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('disponible');
  const [picture, setPicture] = useState<File | null>(null);

  const firestore = getFirestore();
  const storage = getStorage(); // Firebase Storage instance

  // Function to upload the picture to Firebase Storage
  const handleUploadPicture = async (file: File) => {
    try {
      const storageRef = ref(storage, `books/${file.name}`); // Create a storage reference in Firebase
      await uploadBytes(storageRef, file); // Upload the file to Firebase Storage

      // Get the download URL after uploading
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading picture: ', error);
      return null;
    }
  };

  // Function to add the book to Firestore
  const handleAddBook = async () => {
    try {
      let pictureURL = null;
      if (picture) {
        // Upload picture to Firebase Storage and get the download URL
        pictureURL = await handleUploadPicture(picture);
      }

      // Add the book details to Firestore, including the picture URL
      await addDoc(collection(firestore, 'books'), {
        title,
        description,
        status,
        picture: pictureURL, // Save the download URL in Firestore
      });

      alert('Book added successfully');
    } catch (error) {
      console.error('Error adding book: ', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin - Add Book</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel>Title</IonLabel>
          <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel>Description</IonLabel>
          <IonInput value={description} onIonChange={e => setDescription(e.detail.value!)} />
        </IonItem>
        <IonItem>
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
        <IonItem>
          <IonLabel>Status</IonLabel>
          <IonSelect value={status} onIonChange={e => setStatus(e.detail.value!)} >
            <IonSelectOption value="disponible">Disponible</IonSelectOption>
            <IonSelectOption value="reservé">Reservé</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonButton onClick={handleAddBook}>Add Book</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Admin;
