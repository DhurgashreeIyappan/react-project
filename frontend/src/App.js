import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import OwnerDashboard from './components/pages/OwnerDashboard';
import RenterDashboard from './components/pages/RenterDashboard';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import PropertyList from './components/properties/PropertyList';
import PropertyDetail from './components/properties/PropertyDetail';
import AddProperty from './components/properties/AddProperty';
import EditProperty from './components/properties/EditProperty';
import MyProperties from './components/properties/MyProperties';
import MyBookings from './components/bookings/MyBookings';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import ConditionalRoute from './components/auth/ConditionalRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={
                <ConditionalRoute>
                  <Home />
                </ConditionalRoute>
              } />
              <Route path="/owner-dashboard" element={
                <PrivateRoute>
                  <OwnerDashboard />
                </PrivateRoute>
              } />
              <Route path="/renter-dashboard" element={
                <PrivateRoute>
                  <RenterDashboard />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties" element={<PropertyList />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/add-property" element={
                <PrivateRoute>
                  <AddProperty />
                </PrivateRoute>
              } />
              <Route path="/edit-property/:id" element={
                <PrivateRoute>
                  <EditProperty />
                </PrivateRoute>
              } />
              <Route path="/my-properties" element={
                <PrivateRoute>
                  <MyProperties />
                </PrivateRoute>
              } />
              <Route path="/my-bookings" element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ECDC4',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#FF6B35',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
