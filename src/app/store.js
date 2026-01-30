import { configureStore } from '@reduxjs/toolkit';
import blogReducer from '../features/blog/blogslice';
import userReducer from '../features/user/userslice';

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    user: userReducer,
  },
});

export default store;
