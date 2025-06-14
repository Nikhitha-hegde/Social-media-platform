import React, { useState } from 'react';
import { update_user } from "../services/api";

const EditProfile = ({ userData, onCancel, onSave }) => {
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newBio, setNewBio] = useState(userData.bio || "");

  const handleSave = async () => {
    const formData = new FormData();
    if (newProfilePic) formData.append('profilePic', newProfilePic);
    if (newBio) formData.append('bio', newBio);

    try {
      const updatedUser = await update_user(formData);
      alert('Profile updated successfully!');
      onSave(updatedUser.user);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label htmlFor="profilePic-upload" className="block">
        <img
          src={newProfilePic ? URL.createObjectURL(newProfilePic) : userData.profilePic || "https://photosnow.org/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"}
          alt={userData.username}
          className="w-32 h-32 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
        />
      </label>
      <input
        id="profilePic-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setNewProfilePic(e.target.files[0])}
      />

      <textarea
        value={newBio}
        onChange={(e) => setNewBio(e.target.value)}
        className="w-full mt-4 p-2 border rounded-lg"
        rows="4"
      />

      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
