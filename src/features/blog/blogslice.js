import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiInstance from '../../api/apinstance';

const initialState = {
  blogs: [],
  loading: false,
  error: null,
  currentBlog: null,
};

// Fetch all blogs for a user
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/blogs?userId=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

// Fetch single blog
export const fetchBlogById = createAsyncThunk(
  'blog/fetchBlogById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
    }
  }
);

// Create new blog
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.patch(`/blogs/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await apiInstance.delete(`/blogs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
    }
  }
);

// Like/Unlike blog
export const toggleLikeBlog = createAsyncThunk(
  'blog/toggleLikeBlog',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/blogs/${id}`);
      const blog = response.data;
      
      // Check if user already liked the blog
      const likes = blog.likes || [];
      let updatedLikes;
      
      if (likes.includes(userId)) {
        // Unlike - remove userId from likes
        updatedLikes = likes.filter(likeId => likeId !== userId);
      } else {
        // Like - add userId to likes
        updatedLikes = [...likes, userId];
      }
      
      // Update the blog with new likes array
      const updateResponse = await apiInstance.patch(`/blogs/${id}`, {
        likes: updatedLikes
      });
      
      return updateResponse.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like blog');
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Blog By ID
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Blog
    builder
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Blog
    builder
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Blog
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle Like
    builder
      .addCase(toggleLikeBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      });
  },
});

export const { clearError } = blogSlice.actions;
export default blogSlice.reducer;
