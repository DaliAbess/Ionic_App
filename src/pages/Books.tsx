import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonAlert,
  IonModal,
  IonInput,
  IonItemDivider,
  IonText,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle
} from '@ionic/react';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { IonIcon } from '@ionic/react';
import { bookOutline, homeOutline } from 'ionicons/icons';

// Define a type for the Book interface
interface Book {
  id: string; // Firestore document ID
  title: string;
  description?: string; // Optional, if you want to include descriptions
  picture?: string; // Optional, if you want to include a picture URL
  status: 'disponible' | 'reservé'; // Status can be either "disponible" or "reservé"
  reservedBy?: string; // Optional, to track who reserved the book
}

const Books: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const history = useHistory();
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'books'));
      const booksArray: Book[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Book, 'id'>
      }));

      setBooks(booksArray);
    };

    fetchBooks();
  }, [firestore, reload]);

  const handleReserve = async (id: string) => {
    if (!user) {
      alert('You must be logged in to reserve a book.');
      return;
    }

    const book = books.find(b => b.id === id);
    if (book) {
      if (book.status === 'disponible') {
        await updateDoc(doc(firestore, 'books', id), {
          status: 'reservé',
          reservedBy: user.email
        });
        alert('Book reserved successfully');
      } else if (book.status === 'reservé' && book.reservedBy === user.email) {
        await updateDoc(doc(firestore, 'books', id), {
          status: 'disponible',
          reservedBy: null
        });
        alert('Reservation cancelled successfully');
      }
      setReload(!reload);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(firestore, 'books', id));
    setBooks(books.filter(book => book.id !== id));
    alert('Book deleted successfully');
    setReload(!reload);
  };

  const handleUpdate = async () => {
    if (!selectedBook) return;

    await updateDoc(doc(firestore, 'books', selectedBook.id), {
      title: selectedBook.title,
      description: selectedBook.description,
      picture: selectedBook.picture,
      status: selectedBook.status
    });
    setShowUpdateModal(false);
    alert('Book updated successfully');
    setReload(!reload);
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
          <IonTitle>
            <IonIcon icon={bookOutline} style={{ marginRight: '8px' }} />
            Books
          </IonTitle>
          {user ? (
            <>
              <IonButton fill="outline" slot="end" color="danger" onClick={handleLogout}>
                Logout
              </IonButton>
              <IonButton fill="outline" slot="end" onClick={() => history.push('/profile')}>
                Profile
              </IonButton>
              {isAdmin && (
                <IonButton fill="outline" slot="end" onClick={() => history.push('/admin')}>
                  Admin
                </IonButton>
              )}
            </>
          ) : (
            <>
              <IonButton fill="outline" slot="end" onClick={() => window.location.href = '/login'}>Login</IonButton>
              <IonButton fill="outline" slot="end" onClick={() => window.location.href = '/register'}>Register</IonButton>
            </>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent >
        <IonList style={{display: 'flex', flexDirection: 'row' ,justifyContent: 'center', flexWrap: 'wrap'}}>
          {books.map((book: Book) => (
            <IonCard key={book.id} style={{ width: '40%', height: 'auto' ,margin: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
              <IonCardHeader>
                <IonCardTitle style={{ textAlign: 'center' }}>{book.title}</IonCardTitle>
                <IonCardSubtitle>{book.status === 'disponible' ? 'Available' : 'Reserved'}</IonCardSubtitle>
              </IonCardHeader>
              <IonImg
                style={{ width: '50%', height: 'auto', margin: '0 auto', display: 'block' }} // Adjusting image size to 80%
                src={book.picture}
                alt={book.title}
              />
              <IonCardContent  >
              <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2%',
    }}>
                {book.status === 'disponible' && (
                  <IonButton  size="small" onClick={() => handleReserve(book.id)}>Reserve</IonButton>
                )}
                {book.status === 'reservé' && book.reservedBy === user?.email && (
                  <IonButton  color="danger" size="small" onClick={() => handleReserve(book.id)}>Cancel </IonButton>
                )}
                {book.status === 'reservé' && book.reservedBy !== user?.email && (
                  <IonLabel>Reserved</IonLabel>
                )}
                <IonButton  color="primary" size="small" onClick={() => { setSelectedBook(book); setShowModal(true); }}>Details</IonButton>
                {isAdmin && (
                  <>
                    <IonButton  size="small" onClick={() => { setSelectedBook(book); setShowUpdateModal(true); }}>Update</IonButton>
                    <IonButton  color="danger" size="small" onClick={() => { setBookToDelete(book.id); setShowDeleteAlert(true); }}>Delete</IonButton>
                  </>
                )}
</div>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Modal for updating book */}
        <IonModal isOpen={showUpdateModal} onDidDismiss={() => setShowUpdateModal(false)}>
  <IonHeader>
    <IonToolbar>
      <IonTitle>Update Book</IonTitle>
    </IonToolbar>
  </IonHeader>
  
  <IonContent className="ion-padding" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <IonItem lines="none" style={{ margin: '0 auto' ,width: '40%', marginBottom: '1rem' }}>
    <IonLabel position="floating" style={{ color: '#666', fontSize: '1rem' }}>Title</IonLabel>
    <IonInput
      value={selectedBook?.title}
      onIonChange={(e) => setSelectedBook({ ...selectedBook!, title: e.detail.value! })}
      style={{ marginTop: '0.5rem' }}
    />
  </IonItem>
  
  <IonItem lines="none" style={{margin: '0 auto', width: '40%', marginBottom: '1rem' }}>
    <IonLabel position="floating" style={{ color: '#666', fontSize: '1rem' }}>Description</IonLabel>
    <IonInput
      value={selectedBook?.description}
      onIonChange={(e) => setSelectedBook({ ...selectedBook!, description: e.detail.value! })}
      style={{ marginTop: '0.5rem' }}
    />
  </IonItem>
  
  <div style={{ margin: '0 auto' ,display: 'flex', flexDirection: 'row' ,justifyContent: 'center', width: '30%', marginTop: '1.5rem' }}>
    <IonButton onClick={handleUpdate} style={{ flex: 1, marginRight: '0.5rem', borderRadius: '20px' }}>
      Update
    </IonButton>
    <IonButton color="medium" onClick={() => setShowUpdateModal(false)} style={{ flex: 1, borderRadius: '20px' }}>
      Cancel
    </IonButton>
  </div>
</IonContent>

</IonModal>


        {/* Modal for showing book */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
  <IonHeader>
    <IonToolbar>
      <IonTitle>Book Details</IonTitle>
      <IonButton slot="end" fill="clear" onClick={() => setShowModal(false)} style={{ color: '#f56' }}>
        Close
      </IonButton>
    </IonToolbar>
  </IonHeader>
  
  <IonContent className="ion-padding">
    {selectedBook && (
      <>
        <IonImg
          style={{
            width: '20%',
            height: 'auto',
            margin: '1.5rem auto',
            display: 'block',
            borderRadius: '15px', // Rounded corners
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' // Light shadow for depth
          }}
          src={selectedBook.picture}
          alt={selectedBook.title}
        />
        
        <IonText>
          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {selectedBook.title}
          </h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>
            {selectedBook.description}
          </p>
          <p style={{ textAlign: 'center', fontWeight: '500', color: selectedBook.status === 'disponible' ? 'green' : 'red' }}>
            Status: {selectedBook.status === 'disponible' ? 'Available' : 'Reserved'}
          </p>
        </IonText>
      </>
    )}
  </IonContent>
</IonModal>


        {/* Delete alert */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Delete Book'}
          message={'Are you sure you want to delete this book?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Delete',
              handler: () => bookToDelete && handleDelete(bookToDelete)
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Books;
