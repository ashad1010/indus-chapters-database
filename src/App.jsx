// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddChapter from './pages/AddChapter';
import ViewChapters from './pages/ViewChapters';
import Login from './pages/Login';
import PrivateRoute from './PrivateRoute';
import AppLayout from './AppLayout'; // ✅ Import layout
import Signup from './pages/Signup';
import UsersPanel from './pages/UsersPanel'; 

function App() {
  return (
    <Router>
      <AppLayout> {/* ✅ Wrap routes in layout */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute adminOnly={true}>
                <AddChapter />
              </PrivateRoute>
            }
          />
          <Route
            path="/view"
            element={
              <PrivateRoute>
                <ViewChapters />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
