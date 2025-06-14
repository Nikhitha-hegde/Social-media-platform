import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get_feed } from '../services/api'; 
import Post from '../elements/feed_posts';
import SearchModal from './searchBar';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const data = await get_feed();
        setIsLoggedIn(true); 
        setPosts(data.posts || []); 
      } catch (err) {
        console.error("Error fetching feed:", err);
        if (err.response?.status === 401) {
          setIsLoggedIn(false); 
        } else {
          setError(err.message || "Failed to fetch feed.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const handleLike = (postId) => {
    console.log(`Liked post with ID: ${postId}`);
  };

  const handleComment = (postId, commentText) => {
    console.log(`Commented on post with ID: ${postId}, Comment: ${commentText}`);
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your feed...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-light mb-3 text-gray-800">Welcome to PhotoGram!</h3>
        <p className="text-gray-500 mb-6">Sign in to start exploring and connecting with others.</p>
        <button
          onClick={handleLoginRedirect}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-light text-red-500 mb-2">Error</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
              onComment={(commentText) => handleComment(post.id, commentText)}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-light mb-3 text-gray-800">Welcome to PhotoGram!</h3>
            <p className="text-gray-500 mb-6">Your feed is empty. Start connecting with others to see their posts here.</p>
            <button
              onClick={handleOpenSearch}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Find People to Follow
            </button>
          </div>
        )}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Feed;