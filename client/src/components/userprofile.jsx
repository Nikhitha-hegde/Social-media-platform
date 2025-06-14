import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userinfo } from "../services/api";
import { Grid, Bookmark, Settings, LogOut } from 'lucide-react';
import EditProfile from '../elements/editprofile';
import PostDetailModal from '../elements/post_detail';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLogin] = useState(!!localStorage.getItem('Token'));
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await userinfo();
        setUserData(data.user);
        setIsLogin(true);
      } catch (error) {
        console.error('Failed to fetch user information:', error);
        navigate('/');
      }
    };
    fetchUserInfo();
  }, [navigate]);

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem("Token");
      setIsLogin(false);
      navigate('/');
    }
  };

  const handleSave = (updatedUser) => {
    setUserData(updatedUser);
    setEditing(false);
  };

  const openModal = (index) => setCurrentIndex(index);
  const closeModal = () => setCurrentIndex(null);

  const handlePostDeleted = (deletedPostId) => {
    setUserData(prevData => ({
      ...prevData,
      posts: prevData.posts.filter(post => (post._id || post.id) !== deletedPostId)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {userData ? (
        <>
          {!editing ? (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
                <img
                  src={userData.profilePic || "https://photosnow.org/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"}
                  alt={userData.username}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-semibold">{userData.username}</h1>
                  <p className="text-gray-700 mb-4">{userData.bio || 'No bio available'}</p>
                  <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center">
                  <span className="font-semibold text-lg">{userData.posts.length}</span>
                  <p className="text-gray-600 text-sm">posts</p>
                </div>
                <div className="text-center cursor-pointer" onClick={() => navigate('/followers')}>
                  <span className="font-semibold text-lg">{userData.followersCount || 0}</span>
                  <p className="text-gray-600 text-sm">followers</p>
                </div>
                <div className="text-center cursor-pointer" onClick={() => navigate('/followers')}>
                  <span className="font-semibold text-lg">{userData.followingCount || 0}</span>
                  <p className="text-gray-600 text-sm">following</p>
                </div>
              </div>

              <div className="border-t border-gray-200">
                <div className="flex justify-center space-x-8">
                  <button className="flex items-center space-x-2 py-4 border-t-2 border-gray-900 text-gray-900">
                    <Grid className="w-4 h-4" />
                    <span className="text-sm font-medium">POSTS</span>
                  </button>
                  <button className="flex items-center space-x-2 py-4 text-gray-500 hover:text-gray-700">
                    <Bookmark className="w-4 h-4" />
                    <span className="text-sm font-medium">SAVED</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 md:gap-4 mt-4">
                {userData.posts.length === 0 ? (
                  <div className="col-span-3 text-center py-12">
                    <Grid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No posts yet</p>
                    <p className="text-gray-400">When you share photos, they'll appear here</p>
                  </div>
                ) : (
                  userData.posts.map((post, index) => (
                    <div key={post._id || post.id || index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer" 
                    onClick={() => openModal(index)}>
                      <img
                        src={post.postUrl}
                        alt="Post"
                        className="w-full h-full object-cover hover:opacity-75 transition-opacity cursor-pointer"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                  ))
                )}
              </div>

              {currentIndex !== null && (
                <PostDetailModal
                  posts={userData.posts.map(post => ({
                    ...post,
                    profilePic: userData.profilePic,
                    username: userData.username
                  }))}
                  currentIndex={currentIndex}
                  onClose={closeModal}
                  onPostDeleted={handlePostDeleted}
                />
              )}
            </>
          ) : (
            <EditProfile
              userData={userData}
              onCancel={() => setEditing(false)}
              onSave={handleSave}
            />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;