import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    // Change background to a dark color (e.g., bg-gray-800) and text to light
    <header className="bg-gray-800 shadow-md py-4 text-gray-300"> {/* Dark background, shadow, padding, light text */}
      <div className="container mx-auto flex justify-between items-center"> {/* Container, spacing, alignment */}
        <Link to="/" className="text-xl font-bold text-gray-100 hover:text-white"> {/* Brand link - lighter color */}
          MemeX Vote
        </Link>
        <nav>
          <ul className="flex space-x-4"> {/* Horizontal list with spacing */}
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-200"> {/* Nav links - lighter color on hover */}
                Home
              </Link>
            </li>
            <li>
              <Link to="/polls" className="hover:text-white transition-colors duration-200">
                Polls
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-white transition-colors duration-200">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-white transition-colors duration-200">
                Admin
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors duration-200">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors duration-200">
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
