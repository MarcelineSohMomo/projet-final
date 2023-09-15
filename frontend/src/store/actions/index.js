import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const signin = createAsyncThunk('auth/signin', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.signin(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    userData: null,
    error: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.userData = null;
        state.error = action.payload;
      })
      // Ajouter des cas pour l'action updateUser
      .addCase(updateUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateUserImg.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUserImg.fulfilled, (state, action) => {
        console.log("action ", action.payload);
        state.userData = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(updateUserImg.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const updateUser = createAsyncThunk('auth/updateUser', async ({ formData, headers }, { rejectWithValue }) => {
  try {
    const response = await api.updateUser(formData, headers);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const updateUserImg = createAsyncThunk('auth/updateUserImg', async ({ formData, headers }, { rejectWithValue }) => {
  try {
    const response = await api.updateUserImg(formData, headers);

    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});




export const { logout } = authSlice.actions;

export default authSlice.reducer;
