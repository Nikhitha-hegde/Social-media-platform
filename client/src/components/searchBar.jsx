import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { get_all_users, get_followers, get_following, followUser, unfollowUser } from '../services/api';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchFollowDetails();
      fetchUsers();
    }
  }, [isOpen]);

  const fetchFollowDetails = async () => {
    try {
      const followersResponse = await get_followers();
      const followingResponse = await get_following();
      setFollowers(followersResponse.followers);
      setFollowing(followingResponse.following);

      const followedIds = new Set(
        followingResponse.following.map((user) => user._id)
      );
      setFollowedUsers(followedIds);
    } catch (err) {
      setError('Failed to load follow details.');
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await get_all_users();
      console.log("Fetched users:", data); 
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err) {
      setError('Failed to load users.');
      console.error(err);
    }
  };

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleFollowToggle = async (userId) => {
    console.log("User ID:", userId);
    try {
      if (followedUsers.has(userId)) {
        await unfollowUser(userId);
        setFollowedUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      } else {
        await followUser(userId);
        setFollowedUsers((prev) => new Set(prev.add(userId)));
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Search</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none focus:bg-white focus:ring-2 focus:ring-pink-500 transition-all duration-200"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="overflow-y-auto max-h-64">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user._id || `user-${index}`}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profilePic || 'https://photosnow.org/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg'}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.username}</span>
                </div>
                <button
                  onClick={() => handleFollowToggle(user._id)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    followedUsers.has(user._id)
                      ? 'bg-white text-gray-800 border border-gray-300'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {followedUsers.has(user._id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;