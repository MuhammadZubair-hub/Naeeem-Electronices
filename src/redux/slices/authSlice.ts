// // import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// // import { User, Role, LoginForm } from '../../types';

// // interface AuthState {
// //   user: User | null;
// //   isAuthenticated: boolean;
// //   isLoading: boolean;
// //   error: string | null;
// // }

// // const initialState: AuthState = {
// //   user: null,
// //   isAuthenticated: false,
// //   isLoading: false,
// //   error: null,
// // };

// // // Mock login function - replace with actual API call
// // const mockLogin = async (credentials: LoginForm): Promise<User> => {
// //   // Simulate API delay
// //   await new Promise(resolve => setTimeout(resolve, 1000));

// //   // Mock user data based on email
// //   const mockUsers: Record<string, User> = {
// //     'ceo@ne.com': {
// //       id: '1',
// //       name: 'Ahmed Naeem',
// //       email: 'ceo@ne.com',
// //       role: Role.CEO,
// //       isActive: true,
// //       createdAt: '2024-01-01T00:00:00Z',
// //       lastLogin: new Date().toISOString(),
// //     },
// //     'gm@ne.com': {
// //       id: '2',
// //       name: 'Sarah Khan',
// //       email: 'gm@ne.com',
// //       role: Role.GM,
// //       isActive: true,
// //       createdAt: '2024-01-01T00:00:00Z',
// //       lastLogin: new Date().toISOString(),
// //     },
// //     'rm@ne.com': {
// //       id: '3',
// //       name: 'Ali Hassan',
// //       email: 'rm@ne.com',
// //       role: Role.RM,
// //       regionId: 'region-1',
// //       isActive: true,
// //       createdAt: '2024-01-01T00:00:00Z',
// //       lastLogin: new Date().toISOString(),
// //     },
// //     'zm@ne.com': {
// //       id: '4',
// //       name: 'Fatima Ahmed',
// //       email: 'zm@ne.com',
// //       role: Role.ZM,
// //       regionId: 'region-1',
// //       zoneId: 'zone-1',
// //       isActive: true,
// //       createdAt: '2024-01-01T00:00:00Z',
// //       lastLogin: new Date().toISOString(),
// //     },
// //     'br@ne.com': {
// //       id: '5',
// //       name: 'Omar Sheikh',
// //       email: 'br@ne.com',
// //       role: Role.BR,
// //       branchId: 'branch-1',
// //       regionId: 'region-1',
// //       zoneId: 'zone-1',
// //       isActive: true,
// //       createdAt: '2024-01-01T00:00:00Z',
// //       lastLogin: new Date().toISOString(),
// //     },
// //     'avo@ne.com': {
// //       id: '6',
// //       name: 'Aisha Malik',
// //       email: 'avo@ne.com',
// //       role: Role.AVO,
// //       branchId: 'branch-1',
// //       regionId: 'region-1',
// //       zoneId: 'zone-1',
// //       isActive: true,
// //       createdAt: '2024-01-01T00:00:00Z',
// //       lastLogin: new Date().toISOString(),
// //     },
// //   };

// //   const user = mockUsers[credentials.email.toLowerCase()];

// //   if (!user || credentials.password !== '123') {
// //     throw new Error('Invalid credentials');
// //   }

// //   return user;
// // };

// // export const login = createAsyncThunk(
// //   'auth/login',
// //   async (credentials: LoginForm, { rejectWithValue }) => {
// //     try {
// //       const user = await mockLogin(credentials);
// //       return user;
// //     } catch (error) {
// //       return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
// //     }
// //   }
// // );

// // export const logout = createAsyncThunk(
// //   'auth/logout',
// //   async () => {
// //     // Simulate API call
// //     await new Promise(resolve => setTimeout(resolve, 500));
// //     return null;
// //   }
// // );

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState,
// //   reducers: {
// //     clearError: (state) => {
// //       state.error = null;
// //     },
// //     updateUser: (state, action: PayloadAction<Partial<User>>) => {
// //       if (state.user) {
// //         state.user = { ...state.user, ...action.payload };
// //       }
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       // Login
// //       .addCase(login.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(login.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.user = action.payload;
// //         state.isAuthenticated = true;
// //         state.error = null;
// //       })
// //       .addCase(login.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload as string;
// //         state.isAuthenticated = false;
// //         state.user = null;
// //       })
// //       // Logout
// //       .addCase(logout.pending, (state) => {
// //         state.isLoading = true;
// //       })
// //       .addCase(logout.fulfilled, (state) => {
// //         state.isLoading = false;
// //         state.user = null;
// //         state.isAuthenticated = false;
// //         state.error = null;
// //       })
// //       .addCase(logout.rejected, (state) => {
// //         state.isLoading = false;
// //         state.user = null;
// //         state.isAuthenticated = false;
// //         state.error = null;
// //       });
// //   },
// // });

// // export const { clearError, updateUser } = authSlice.actions;
// // export default authSlice.reducer;

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface User {
//   empId: string;
//   designation: string;
//   loginDateTime: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginSuccess: (
//       state,
//       action: PayloadAction<{ user: User; token: string }>
//     ) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  firstName: string;
  empId: string;
  designation: string;
  loginDateTime: string;
  avatar?: string; // optional
  region? : string;
  zone? :string;
  branch? :string;
  assignedId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ data: { data: User }; token: string }>,
    ) => {
      // Unwrap nested API response
      state.user = action.payload.data.data;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
