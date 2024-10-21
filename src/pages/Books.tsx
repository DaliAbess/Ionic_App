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
  IonImg 
} from '@ionic/react';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
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

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]); // Explicitly defining the type of books
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // For editing book details
  const [showUpdateModal, setShowUpdateModal] = useState(false); // Modal for updating book
  const [showModal, setShowModal] = useState(false); // Modal for updating book
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); // Alert for deleting a book
  const [bookToDelete, setBookToDelete] = useState<string | null>(null); // ID of the book to delete
  const [reload, setReload] = useState(false);
  const history = useHistory();
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser; // Get the current user

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'books'));
      const booksArray: Book[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Book, 'id'> // Cast the data to match the Book interface
      }));

      setBooks(booksArray);
    };

    fetchBooks();
  }, [firestore,reload]);

  const handleReserve = async (id: string) => {
    if (!user) {
      alert('You must be logged in to reserve a book.');
      return;
    }

    const book = books.find(b => b.id === id);
    if (book) {
      if (book.status === 'disponible') {
        // Reserve the book
        await updateDoc(doc(firestore, 'books', id), {
          status: 'reservé',
          reservedBy: user.email // Set the reservedBy field to the user's email
        });
        alert('Book reserved successfully');
        setReload(!reload);
      } else if (book.status === 'reservé' && book.reservedBy === user.email) {
        // Cancel the reservation
        await updateDoc(doc(firestore, 'books', id), {
          status: 'disponible',
          reservedBy: null // Clear the reservedBy field
        });
        alert('Reservation cancelled successfully');
        setReload(!reload);
      }
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
        <IonButton slot="start" fill="clear" onClick={() =>  window.location.href ='/home'}>
    {/* Home icon */}
    <IonIcon icon={homeOutline} />
  </IonButton>
          <IonTitle>   
             <IonIcon icon={bookOutline} style={{ marginRight: '8px' }} /> Books
 </IonTitle>
          {user ?  (  // If the user is logged in, show the Logout button
          <>
            <IonButton fill="outline" slot="end" color="danger" onClick={handleLogout}>
              Logout
            </IonButton>
            <IonButton fill="outline" slot="end" onClick={() => history.push('/profile')}>
            Profile
          </IonButton>
          <IonButton fill="outline" slot="end" onClick={() => history.push('/books')}>
            Books
          </IonButton>
          <IonButton fill="outline" slot="end" onClick={() => history.push('/admin')}>
            Admin
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
        <IonList>
          {books.map((book: Book) => (
            <IonItem key={book.id}>
              <IonLabel>{book.title}</IonLabel>
              <IonImg
              style={{ width: '200px', height: '300px' }}
      src={book?.picture}
      alt={book?.title} ></IonImg>
              {book.status === 'disponible' && (
                <IonButton onClick={() => handleReserve(book.id)}>Reserve</IonButton>
              )}
              {book.status === 'reservé' && book.reservedBy === user?.email && (
                <IonButton color="danger" onClick={() => handleReserve(book.id)}>Cancel</IonButton>
              )}
              {book.status === 'reservé' && book.reservedBy !== user?.email && (
                <IonLabel>Reserved</IonLabel>
              )}
              <IonButton color="success" onClick={() => { setSelectedBook(book); setShowModal(true); }}>Show</IonButton>
              <IonButton onClick={() => { setSelectedBook(book); setShowUpdateModal(true); }}>Update</IonButton>
              <IonButton color="danger" onClick={() => { setBookToDelete(book.id); setShowDeleteAlert(true); }}>Delete</IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* Modal for updating book */}
        <IonModal isOpen={showUpdateModal} onDidDismiss={() => setShowUpdateModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Update Book</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel position="floating">Title</IonLabel>
              <IonInput
                value={selectedBook?.title}
                onIonChange={(e) => setSelectedBook({ ...selectedBook!, title: e.detail.value! })}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Description</IonLabel>
              <IonInput
                value={selectedBook?.description}
                onIonChange={(e) => setSelectedBook({ ...selectedBook!, description: e.detail.value! })}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Picture URL</IonLabel>
              <IonInput
                value={selectedBook?.picture}
                onIonChange={(e) => setSelectedBook({ ...selectedBook!, picture: e.detail.value! })}
              />
            </IonItem>
            <IonButton expand="full" onClick={handleUpdate}>Update Book</IonButton>
            <IonButton expand="full" color="medium" onClick={() => setShowUpdateModal(false)}>Cancel</IonButton>
          </IonContent>
        </IonModal>
{/* Modal for showing book */}
<IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
  <IonHeader>
    <IonToolbar>
      <IonTitle>Show Book</IonTitle>
    </IonToolbar>
  </IonHeader>
  <IonContent>
    <IonItem>
      <IonLabel>Title</IonLabel>
      <IonText>{selectedBook?.title}</IonText>
    </IonItem>
    <IonItem>
      <IonLabel>Description</IonLabel>
      <IonText>{selectedBook?.description}</IonText>
    </IonItem>

    <IonImg
    style={{ width: '100%', height: '100%' }}
      src={selectedBook?.picture}
      alt={selectedBook?.title} ></IonImg>
    <IonButton expand="full" color="medium" onClick={() => setShowModal(false)}>Back</IonButton>
  </IonContent>
</IonModal>

        {/* Alert for deleting a book */}
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
              handler: () => {
                if (bookToDelete) handleDelete(bookToDelete);
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Books;
