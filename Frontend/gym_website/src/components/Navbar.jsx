import React, { useState } from "react";
import { Dumbbell, Menu, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-md">
      
<div className="relative flex items-center px-6 py-4">

  {/* LEFT - Logo */}
  <div className="flex items-center gap-2 text-xl font-bold">
    <Dumbbell /> A1 Fitness Series
  </div>

  {/* CENTER - Menu (perfect center) */}
<div className="hidden md:flex gap-6 absolute left-1/2 transform -translate-x-1/2">
  
  {/* Home (only when NOT logged in) */}
  {!isLoggedIn && (
    <Link to="/home" className="hover:text-green-400">Home</Link>
  )}

  {/* Always visible */}
  <Link to="/services" className="hover:text-green-400">Services</Link>
  <Link to="/membership" className="hover:text-green-400">Membership</Link>

  {/* Contact (only when NOT logged in, placed at END) */}
  {!isLoggedIn && (
    <Link to="/contact" className="hover:text-green-400">Contact</Link>
  )}

  {/* Dashboard (only when logged in) */}
  {isLoggedIn && (
    <Link to="/owner" className="hover:text-green-400">Dashboard</Link>
  )}

</div>

  {/* RIGHT - Buttons */}
  <div className="ml-auto flex items-center gap-3">
    {isLoggedIn ? (
      <button
        onClick={handleLogout}
        className="hidden md:block bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600"
      >
        Log Out
      </button>
    ) : (
      <button
        onClick={() => navigate("/")}
        className="hidden md:block bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600"
      >
        Log In
      </button>
    )}

    <button
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden"
    >
      {isOpen ? <X /> : <Menu />}
    </button>
  </div>

</div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-gray-900 border-t border-gray-800">
          
          <Link to="/home" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/services" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/membership" onClick={() => setIsOpen(false)}>Membership</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

          {isLoggedIn ? (
            <>
              <Link to="/owner" onClick={() => setIsOpen(false)}>Dashboard</Link>

              <button
                onClick={handleLogout}
                className="bg-green-500 py-2 rounded-xl mt-2"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/");
              }}
              className="bg-green-500 py-2 rounded-xl mt-2"
            >
              Log In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}