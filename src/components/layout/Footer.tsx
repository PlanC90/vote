import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8"> {/* Dark background, white text, padding, margin-top */}
      <div className="container mx-auto text-center"> {/* Container, center text */}
        <p>&copy; {new Date().getFullYear()} Polling App. All rights reserved.</p> {/* Footer text */}
      </div>
    </footer>
  );
};

export default Footer;
