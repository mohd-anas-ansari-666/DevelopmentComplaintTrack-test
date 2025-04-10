import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import ComplaintDetail from './pages/ComplaintDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import CreateComplaint from './pages/CreateComplaint';
import CreateArticle from './pages/CreateArticle';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <main className="container mx-auto px-4 py-8">
              {!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
            </main>
          } />
          <Route path="/register" element={
            <main className="container mx-auto px-4 py-8">
              {!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
            </main>
          } />
          <Route path="/dashboard" element={
            <main className="container mx-auto px-4 py-8">
              <PrivateRoute><Dashboard /></PrivateRoute>
            </main>
          } />
          <Route path="/complaints" element={
            <main className="container mx-auto px-4 py-8">
              <PrivateRoute><Complaints /></PrivateRoute>
            </main>
          } />
          <Route path="/complaints/:id" element={
            <main className="container mx-auto px-4 py-8">
              <PrivateRoute><ComplaintDetail /></PrivateRoute>
            </main>
          } />
          <Route path="/complaints/create" element={
            <main className="container mx-auto px-4 py-8">
              <PrivateRoute><CreateComplaint /></PrivateRoute>
            </main>
          } />
          <Route path="/articles" element={
            <main className="container mx-auto px-4 py-8">
              <Articles />
            </main>
          } />
          <Route path="/articles/:id" element={
            <main className="container mx-auto px-4 py-8">
              <ArticleDetail />
            </main>
          } />
          <Route path="/articles/create" element={
            <main className="container mx-auto px-4 py-8">
              <AdminRoute><CreateArticle /></AdminRoute>
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;