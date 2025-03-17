import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
      <h1 className="text-9xl font-bold text-casino-secondary">404</h1>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
      <Link
        to="/"
        className="btn btn-primary text-lg px-6 py-3"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;