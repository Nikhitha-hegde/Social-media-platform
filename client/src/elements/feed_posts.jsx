import { MessageCircle, Heart } from 'lucide-react';
const Post = ({ post, onLike, onComment }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center mb-4">
        <img
          src={post.profilePic || '/default-avatar.png'} 
          alt={post.username}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <h4 className="text-md font-semibold">{post.username}</h4>
      </div>

      <div className="mb-4">
        <img
          src={post.postUrl}
          alt="Post content"
          className="w-full h-auto rounded-md object-cover"
        />
      </div>

      <p className="mb-4 text-gray-800">{post.caption}</p>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <button
          onClick={onLike}
          className="flex items-center space-x-1"
        >
          <span><Heart></Heart></span>
          <span>{post.likesCount}</span>
        </button>
        <button
          onClick={() => onComment(prompt("Enter your comment:"))}
          className="text-500"
        ><MessageCircle/>
        </button>
      </div>

      {post.comments?.length > 0 && (
        <div className="mt-4 space-y-2">
          {post.comments.map((comment, index) => (
            <div key={index} className="flex items-start space-x-2">
              <img
                src={comment.profilePic}
                alt={comment.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{comment.username}</p>
                <p className="text-sm text-gray-700">{comment.commentText}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
