import React, { useState, useEffect } from "react"
import { Link, useNavigate} from "react-router-dom"
import { Bookmark, Home, MessageCircle, PlusSquare, Search, User } from 'lucide-react';
import {userinfo} from "../services/api";
import SearchModal from './searchBar';
import CreatePost from './createPost';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await userinfo();
        console.log(data);
        setUserData(data.user);
        setIsLogin(true);
      } catch (error) {}
    };
    fetchUserInfo();
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }

  const handleSavedClick = () => {
    if (isLoggedIn) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const handleCreateClick = () => {
    if (isLoggedIn) {
      setIsCreateOpen(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent hover:from-pink-600 hover:to-purple-700 transition-all duration-200">
                PhotoGram
              </h1>
            </Link>
            
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none focus:bg-white focus:ring-2 focus:ring-pink-500 transition-all duration-200 w-64"
                onClick={() => {
                  if (isLoggedIn) {
                    setIsSearchOpen(true);
                  } else {
                    navigate("/login");
                  }
                }}
                readOnly
              />
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <Link to="/">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Home className="w-6 h-6" />
            </button>
            </Link>
            
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-6 h-6" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <MessageCircle className="w-6 h-6" />
            </button>
            
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={handleCreateClick}
            >
              <PlusSquare className="w-6 h-6" />
            </button>
            
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={handleSavedClick}
            >
              <Bookmark className="w-6 h-6" />
            </button>
            
            <button 
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={handleProfileClick}
            >
              <img
              src={
                  isLoggedIn && userData?.profilePic
                    ? userData.profilePic
                    : "https://photosnow.org/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"
                }
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            </button>
          </nav>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <CreatePost isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

    </>
  );
};

export default Header;
