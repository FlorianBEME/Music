import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  appData: {},
};

export const appSlice = createSlice({
  name: "appStore",
  initialState,

  reducers: {
    initAppState: (state, action) => {
      state.appData = { ...state.appData, ...action.payload };
    },
    updateAppTitleStyle: (state, action) => {
      state.appData = { ...state.appData, titleEventappStyle: action.payload };
    },
    updateAppTextBanner: (state, action) => {
      state.appData = {
        ...state.appData,
        app: { ...state.appData.app, textbanner: action.payload },
      };
    },
    deleteAppTextBanner: (state) => {
      state.appData = {
        ...state.appData,
        app: { ...state.appData.app, textbanner: null },
      };
    },
  },
});

export const {
  initAppState,
  updateAppTitleStyle,
  updateAppTextBanner,
  deleteAppTextBanner,
} = appSlice.actions;

export const appParam = (state: any) => state.appStore.appData;

export default appSlice.reducer;
