import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiInstance from '../../api/apinstance';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Register user
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Check if user with email already exists
      const existingUser = await apiInstance.get(`/users?email=${userData.email}`);
      if (existingUser.data.length > 0) {
        return rejectWithValue('Email already registered');
      }

      // Create new user with unique id
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      const response = await apiInstance.post('/users', newUser);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/users?email=${email}`);
      const user = response.data[0];

      if (!user) {
        return rejectWithValue('User not found');
      }

      if (user.password !== password) {
        return rejectWithValue('Invalid password');
      }

      // Set auth token and user id in localStorage
      const token = `token_${user.id}_${Date.now()}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.fullName);

      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Fetch current user
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return rejectWithValue('No user logged in');
      }

      const response = await apiInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
