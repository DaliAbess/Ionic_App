import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // State to store admin status
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;
  const firestore = getFirestore();

  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (user) {
        const userRef = doc(firestore, 'roles', user.uid); // Assuming 'users' collection
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          setIsAdmin(userData.isAdmin || false); // Set isAdmin based on Firestore data
        }
      }
      setLoading(false); // Stop loading after fetching data
    };

    fetchAdminStatus();
  }, [user, firestore]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking admin status
  }

  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} isAdmin={isAdmin} />  // Pass isAdmin prop to the component
        ) : (
          <Redirect to="/home" />  // If not authenticated, redirect to home
        )
      }
    />
  );
};

export default PrivateRoute;
