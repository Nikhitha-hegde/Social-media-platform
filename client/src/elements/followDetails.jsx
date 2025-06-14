import React, { useState, useEffect } from "react";
import { get_followers, get_following, followUser, unfollowUser } from "../services/api";

const FollowDetails = () => {
  const [activeTab, setActiveTab] = useState("followers");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userFollowingIds, setUserFollowingIds] = useState(new Set());

  useEffect(() => {
    const fetchFollowDetails = async () => {
      try {
        const followersResponse = await get_followers();
        const followingResponse = await get_following();
        setFollowers(followersResponse.followers);
        setFollowing(followingResponse.following);

        const followingIds = new Set(
          followingResponse.following.map((user) => user._id)
        );
        setUserFollowingIds(followingIds);
      } catch (error) {
        console.error("Error fetching follow details:", error);
      }
    };

    fetchFollowDetails();
  }, []);

  const handleFollowToggle = async (userId) => {
    try {
      if (userFollowingIds.has(userId)) {
        await unfollowUser(userId);
        setUserFollowingIds((prev) => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      } else {
        await followUser(userId);
        setUserFollowingIds((prev) => new Set(prev.add(userId)));
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const renderList = (list) => (
    <ul>
      {list.map((user) => (
        <li
          key={user._id}
          className="flex items-center justify-between p-4 border-b border-gray-200"
        >
          <div className="flex items-center">
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-4"
            />
            <span>{user.username}</span>
          </div>
          <button
            onClick={() => handleFollowToggle(user._id)}
            className={`px-4 py-1 text-sm rounded-lg ${
              userFollowingIds.has(user._id)
                ? "bg-white text-gray-800 border border-gray-300"
                : "bg-blue-500 text-white"
            }`}
          >
            {userFollowingIds.has(user._id) ? "Following" : "Follow"}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex space-x-4 border-b border-gray-200 pb-2 mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "followers"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "following"
              ? "border-b-2 border-blue-500 font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>

      {activeTab === "followers" ? renderList(followers) : renderList(following)}
    </div>
  );
};

export default FollowDetails;