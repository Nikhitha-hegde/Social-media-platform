import React, { useRef, useEffect, useState } from "react";
import { X, Heart, MessageCircle, MoreVertical, Trash2 } from "lucide-react";
import { delete_post } from "../services/api";

const PostDetailModal = ({ posts, currentIndex, onClose, onPostDeleted }) => {
  const scrollContainerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const postElement = scrollContainerRef.current.children[currentIndex];
      postElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentIndex]);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      setMenuOpen(null);
      
      try {
        await delete_post(postId);
        if (onPostDeleted) {
          onPostDeleted(postId);
        }
        onClose();
        alert("Post deleted successfully!");
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert(`Error deleting the post: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen !== null && !event.target.closest('.menu-container')) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex justify-center items-center">
      <button
        onClick={() => onClose()}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        disabled={isDeleting}
      >
        <X className="w-8 h-8" />
      </button>
      <div
        ref={scrollContainerRef}
        className="w-full max-w-3xl h-full overflow-y-auto bg-white shadow-lg scrollbar-hide"
      >
        {posts.map((post, index) => (
          <div
            key={post._id || post.id || index}
            className={`w-full mb-12 p-6 border rounded-lg transition-all ${
              index === currentIndex ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={post.profilePic || "https://photosnow.org/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"}
                  alt={post.username}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <h4 className="text-md font-semibold">{post.username}</h4>
              </div>
              <div className="relative menu-container">
                <button
                  onClick={() =>
                    setMenuOpen((prev) => (prev === index ? null : index))
                  }
                  className="text-gray-500 hover:text-gray-800"
                  disabled={isDeleting}
                >
                  <MoreVertical className="w-6 h-6" />
                </button>
                {menuOpen === index && (
                  <div className="absolute right-0 bg-white shadow-lg border rounded-md w-40 z-20">
                    <button
                      disabled
                      className="block w-full text-left px-4 py-2 text-gray-400 cursor-not-allowed border-b"
                    >
                      Edit Post
                    </button>
                    <button
                      onClick={() => handleDelete(post._id || post.id)}
                      disabled={isDeleting}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="inline w-5 h-5 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete Post"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <img
                src={post.postUrl}
                alt="Post content"
                className="w-full h-auto rounded-md object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                }}
              />
            </div>
            <p className="mb-4 text-gray-800">{post.caption}</p>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <button className="flex items-center space-x-1 hover:text-red-500">
                <Heart className="w-6 h-6" />
                <span>{post.likes?.length || 0}</span>
              </button>
              <button
                onClick={() => alert("Comment functionality coming soon!")}
                className="flex items-center space-x-1 hover:text-blue-500"
              >
                <MessageCircle className="w-6 h-6" />
                <span>{post.comments?.length || 0}</span>
              </button>
            </div>
            {post.comments?.length > 0 && (
              <div className="mt-4 space-y-2">
                <h5 className="font-semibold text-gray-800">Comments</h5>
                {post.comments.map((comment, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <img
                      src={comment.profilePic || "/default-avatar.png"}
                      alt={comment.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {comment.username}
                      </p>
                      <p className="text-sm text-gray-700">
                        {comment.commentText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {isDeleting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-800">Deleting post...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailModal;