import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, restoreAuth, selectAuthToken } from './features/auth/authSlice';
import { fetchBeds } from './features/beds/bedsSlice';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);

  // Restore authentication on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken && !token) {
      // Optionally validate token with backend before restoring
      // For now, we'll restore it directly
      // You may want to add user data to localStorage as well
      dispatch(restoreAuth({ 
        token: storedToken, 
        user: null // Or retrieve from localStorage if stored
      }));
    }
  }, [dispatch, token]);

  // Fetch beds when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBeds());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="App">
      <h1>BedManager MVP</h1>
      {isAuthenticated ? (
        <div>
          <p>User is authenticated!</p>
          {/* Add your main app components here */}
        </div>
      ) : (
        <div>
          <p>Please log in</p>
          {/* Add your login component here */}
        </div>
      )}
    </div>
  );
}

export default App;
