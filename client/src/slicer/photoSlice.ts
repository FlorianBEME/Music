import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  picturesAvailable: [],
};

const photoSlice = createSlice({
  name: "photoStore",
  initialState,
  reducers: {
    initPictureStoreAvailable: (state, action) => {
      state.picturesAvailable = [...action.payload];
    },
    removePicture: (state) => {
      state.picturesAvailable = [];
    },
  },
});

export const { initPictureStoreAvailable, removePicture } = photoSlice.actions;

export const picturesAvailables = (state: any) =>
  state.photoStore.picturesAvailable.filter(
    (el: { is_accept: any }) => el.is_accept === 1
  );
export const picturesNotAllowed = (state: any) =>
  state.photoStore.picturesAvailable.filter(
    (el: { is_accept: any }) => el.is_accept === 0
  );
export const picturesAll = (state: any) => state.photoStore.picturesAvailable;

export default photoSlice.reducer;
