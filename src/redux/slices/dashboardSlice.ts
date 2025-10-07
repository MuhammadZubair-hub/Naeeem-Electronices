// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { DashboardData } from '../../types';
// import { mockApi } from '../../services/mock/mockApi';

// interface DashboardState {
//   data: DashboardData | null;
//   isLoading: boolean;
//   error: string | null;
//   lastUpdated: string | null;
// }

// const initialState: DashboardState = {
//   data: null,
//   isLoading: false,
//   error: null,
//   lastUpdated: null,
// };

// export const fetchDashboardData = createAsyncThunk(
//   'dashboard/fetchData',
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await mockApi.getDashboardData();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
//     }
//   }
// );

// const dashboardSlice = createSlice({
//   name: 'dashboard',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearData: (state) => {
//       state.data = null;
//       state.lastUpdated = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDashboardData.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboardData.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.data = action.payload;
//         state.lastUpdated = new Date().toISOString();
//         state.error = null;
//       })
//       .addCase(fetchDashboardData.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearError, clearData } = dashboardSlice.actions;
// export default dashboardSlice.reducer;
