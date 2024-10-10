import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to NoteKeeper</h1>
      <BookOpen className="mx-auto mb-6" size={64} />
      <p className="text-xl mb-8">Your personal space for organizing thoughts and ideas.</p>
      {user ? (
        <Link to="/notes" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
          Go to My Notes
        </Link>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
            Login
          </Link>
          <Link to="/register" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;