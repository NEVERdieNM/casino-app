import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with one uppercase letter, one lowercase letter, and one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.birthDate = 'You must be at least 18 years old';
      } else if (age > 100) {
        newErrors.birthDate = 'Invalid birth date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const { confirmPassword, ...registrationData } = formData;
    
    try {
      await dispatch(register(registrationData)).unwrap();
      navigate('/games');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-casino-primary rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Sign up to start playing</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-900 bg-opacity-50 text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-400">
              Username*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'border-red-500' : ''}`}
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-400">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Your email address"
            />
            {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
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
                                placeholder="First name"
                              />
                            </div>
                            
                            <div className="mb-4">
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
                                placeholder="Last name"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-400">
                              Date of Birth*
                            </label>
                            <input
                              type="date"
                              id="birthDate"
                              name="birthDate"
                              value={formData.birthDate}
                              onChange={handleChange}
                              className={`form-input ${errors.birthDate ? 'border-red-500' : ''}`}
                              max={new Date().toISOString().split('T')[0]}
                            />
                            {errors.birthDate && (
                              <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                              You must be at least 18 years old to register.
                            </p>
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-400">
                              Password*
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                placeholder="Create a password"
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                            {errors.password && (
                              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                          </div>
                          
                          <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-400">
                              Confirm Password*
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                placeholder="Confirm your password"
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? (
                                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex items-center">
                              <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-casino-secondary focus:ring-casino-secondary"
                              />
                              <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                                I agree to the{' '}
                                <a href="#" className="text-casino-secondary hover:text-casino-accent">
                                  Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-casino-secondary hover:text-casino-accent">
                                  Privacy Policy
                                </a>
                              </label>
                            </div>
                          </div>
                          
                          <button
                            type="submit"
                            className="btn btn-primary w-full py-3"
                          >
                            Create Account
                          </button>
                          
                          <p className="mt-6 text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-casino-secondary hover:text-casino-accent">
                              Sign in
                            </Link>
                          </p>
                        </form>
                      </div>
                    </div>
                  );
                };
                
                export default RegisterPage;