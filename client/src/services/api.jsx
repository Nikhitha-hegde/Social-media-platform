import axios from "axios"
const API_URL = "http://localhost:5000/api/v1"

export const login = async(data)=>{
    try {
        const response = await axios.post(`${API_URL}/login`,data, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          return response.data;
    } catch (error) {
        throw error;
    }
}

export const verify_email = async(data)=>{
    try {
        const response = await axios.post(`${API_URL}/verifyEmail`,data, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          return response.data;
    } catch (error) {
        throw error;
    }
}

export const user_signup = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.log('Error during company registration:', error.response.data.msg);
    return error.response.data;
  }
};
 
export const userinfo = async()=>{
    try {
        const token = localStorage.getItem("Token");
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${API_URL}/getuser`, config);
        return response.data;
      } catch (error) {
        throw error;
      }
}

export const update_user = async(formData)=>{
    try {
        const token = localStorage.getItem("Token");
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        };
        const response = await axios.put(`${API_URL}/updateuser`, formData, config);
        return response.data;
      } catch (error) {
        throw error;
      }
}

export const get_posts = async() => {
    try {
      const token = localStorage.getItem("Token");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/getpost`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const get_feed = async() => {
    try {
      const token = localStorage.getItem("Token");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/getfeed`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const create_post = async (formData) => {
  try {
        const token = localStorage.getItem("Token");
        const response = await axios.post(`${API_URL}/post`, formData, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error in create_post:", error);
      throw error;
      }
}

export const get_followers = async() => {
    try {
      const token = localStorage.getItem("Token");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/getFollowers`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const get_following = async() => {
    try {
      const token = localStorage.getItem("Token");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/getFollowing`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const followUser = async (userId) => {
  try {
    const token = localStorage.getItem("Token");
    const response = await axios.post(`${API_URL}/follow/${userId}`, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}

export const unfollowUser = async (userId) => {
  try {
    const token = localStorage.getItem("Token");
    const response = await axios.post(`${API_URL}/unfollow/${userId}`, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    throw error;
  }
}

export const get_all_users = async()=>{
  try {
    const token = localStorage.getItem("Token");
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/getallusers`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const delete_post = async (postId) => {
  try {
    console.log(postId)
    const token = localStorage.getItem("Token");
    const response = await axios.post(`${API_URL}/deletepost/${postId}`, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}