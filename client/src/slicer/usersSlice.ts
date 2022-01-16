import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isLoad: false,
  visitors: [],
};
export const userSlice = createSlice({
  name: "userStore",
  initialState,

  reducers: {
    initStoreWithListOfVisitors: (state: any, action) => {
      state.isLoad = true;
      state.visitors = [...action.payload];
    },
    addNewVisitor: (state: { visitors: any[] }, action) => {
      state.visitors = [...action.payload, ...state.visitors];
    },
  },
});

export const { initStoreWithListOfVisitors, addNewVisitor } = userSlice.actions;

export const visitorsList = (state: any) => state.userStore.visitors;
export const visitorsIsLoad = (state: any) => state.userStore.isLoad;

export default userSlice.reducer;
