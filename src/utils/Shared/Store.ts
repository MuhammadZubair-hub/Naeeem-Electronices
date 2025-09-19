import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './UserSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

const rootreducer = combineReducers({
        user : userReducer,

})
 
const persistConfig = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootreducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);