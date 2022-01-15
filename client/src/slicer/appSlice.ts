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
      state.appData.app.textbanner = action.payload;
    },
    deleteAppTextBanner: (state) => {
      state.appData = {
        ...state.appData,
        app: { ...state.appData.app, textbanner: null },
      };
    },
    updateItemFooter: (state, action) => {
      const index = state.appData.itemFooter.findIndex(
        (el: { id: number }) => el.id === action.payload.id
      );
      if (index !== -1) {
        state.appData.itemFooter[index].isActivate = action.payload.isActivate;
      }
    },
    addNewItemFooterInStore: (state, action) => {
      console.log(action.payload);
      let arrayList = [...state.appData.itemFooter];
      arrayList.unshift(action.payload);
      state.appData.itemFooter = [...arrayList];
    },
    deleteItemFooterInStore: (state, action) => {
      console.log(action.payload);
      let newList = state.appData.itemFooter.filter(
        (el: { id: any }) => el.id !== action.payload
      );
      state.appData.itemFooter = [...newList];
    },
    updateCopyrightTextInStore: (state, action) => {
      state.appData.footerCopyright = action.payload;
    },
  },
});

export const {
  initAppState,
  updateAppTitleStyle,
  updateAppTextBanner,
  deleteAppTextBanner,
  updateItemFooter,
  addNewItemFooterInStore,
  deleteItemFooterInStore,
  updateCopyrightTextInStore,
} = appSlice.actions;

export const appParam = (state: any) => state.appStore.appData;

export default appSlice.reducer;
