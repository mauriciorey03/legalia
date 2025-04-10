import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, UserCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Scale className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LegalAI</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/create-petition" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              Crear Petición
            </Link>
            <Link to="/login" className="flex items-center text-gray-700 hover:text-indigo-600">
              <UserCircle className="h-6 w-6" />
              <span className="ml-2">Ingresar</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;