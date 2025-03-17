import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { format } from 'date-fns';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch(updateProfile(formData))
      .then(() => {
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Update profile error:', error);
      });
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-secondary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400">Manage your personal information and account settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="bg-casino-primary rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 rounded-full p-2 mb-4">
                <UserCircleIcon className="h-20 w-20 text-casino-secondary" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
              
              <div className="w-full mt-6 pt-6 border-t border-gray-800">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Login</span>
                  <span className="text-white">
                    {format(new Date(user.lastLogin), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-casino-primary rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Personal Information</h2>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-400">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-400">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        email: user.email || ''
                      });
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">First Name</h3>
                    <p className="text-white">{user.firstName || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Last Name</h3>
                    <p className="text-white">{user.lastName || '-'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Email</h3>
                  <p className="text-white">{user.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Username</h3>
                  <p className="text-white">{user.username}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Birth Date</h3>
                  <p className="text-white">
                    {user.birthDate 
                      ? format(new Date(user.birthDate), 'MMMM dd, yyyy') 
                      : '-'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-casino-primary rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-6">Account Security</h2>
            
            <button
              className="btn btn-outline"
              onClick={() => window.location.href = '/change-password'}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;