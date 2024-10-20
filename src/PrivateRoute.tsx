import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />  // If user is authenticated, render the component
        ) : (
          <Redirect to="/login" />  // If not authenticated, redirect to login
        )
      }
    />
  );
};

export default PrivateRoute;
