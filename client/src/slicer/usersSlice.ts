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
    updateCountVoteVisitor: (state: any, action) => {
      const index: number = state.visitors.findIndex(
        (el: any) => el.id === action.payload.id
      );
      if (index !== -1) {
        state.visitors[index].countVoting = action.payload.countVoting;
      }
    },
    updateSubmitVisitor: (state: any, action) => {
      const index: number = state.visitors.findIndex(
        (el: any) => el.id === action.payload
      );
      if (index !== -1) {
        const newCount = state.visitors[index].countsubmit + 1;
        state.visitors[index].countsubmit = newCount;
      }
    },
    updatePermissionVisitor: (state: any, action) => {
      const index: number = state.visitors.findIndex(
        (el: any) => el.id === action.payload.id
      );
      if (index !== -1) {
        state.visitors[index].isNotAllowed = action.payload.isNotAllowed;
      }
    },
  },
});

export const {
  initStoreWithListOfVisitors,
  addNewVisitor,
  updateCountVoteVisitor,
  updateSubmitVisitor,
  updatePermissionVisitor,
} = userSlice.actions;

export const visitorsList = (state: any) => state.userStore.visitors;
export const visitorsIsLoad = (state: any) => state.userStore.isLoad;

export default userSlice.reducer;
