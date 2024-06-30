import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './action/auth';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Alert from './components/layout/Alert';
import CreateProfile from './components/profile-form/CreateProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import EditProfile from './components/profile-form/EditProfile';
import Profiles from './components/profiles/Profiles';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <section className='container'>
            <Alert />
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/profiles' element={<Profiles />} />
              <Route path='/profile/:id' element={<Profile />} />
              <Route
                path='/dashboard'
                element={<PrivateRoute element={Dashboard} />}
              />
              <Route
                path='/create-profile'
                element={<PrivateRoute element={CreateProfile} />}
              />
              <Route
                path='/edit-profile'
                element={<PrivateRoute element={EditProfile} />}
              />
              <Route
                path='/add-experience'
                element={<PrivateRoute element={AddExperience} />}
              />
              <Route
                path='/add-education'
                element={<PrivateRoute element={AddEducation} />}
              />
              <Route path='/posts' element={<PrivateRoute element={Posts} />} />
              <Route
                path='/posts/:id'
                element={<PrivateRoute element={Post} />}
              />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
