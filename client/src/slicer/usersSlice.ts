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
      let arrayList = [...state.visitors];
      arrayList.unshift(action.payload);
      state.visitors = [...arrayList];
    },
    updateVisitor: (state: { visitors: any[] }, action) => {},
  },
});

export const { initStoreWithListOfVisitors, addNewVisitor, updateVisitor } =
  userSlice.actions;

export const visitorsList = (state: any) => state.userStore.visitors;
export const visitorsIsLoad = (state: any) => state.userStore.isLoad;

export default userSlice.reducer;
