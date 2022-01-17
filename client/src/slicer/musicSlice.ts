import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  list: [],
  isLoading: false,
};

const musicSlice = createSlice({
  name: "musicStore",
  initialState,
  reducers: {
    initMusicStore: (state, action) => {
      state.list = [...action.payload];
      state.isLoading = true;
    },
    addNewSong: (state, action) => {
      let arrayList = [...state.list];
      arrayList.unshift(action.payload);
      state.list = [...arrayList];
    },
    updateSong: (state, action) => {
      const list = [...state.list];
      const index = list.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        list[index] = action.payload;
        state.list = list;
      }
    },
    incrementVote: (state, action) => {
      const list = [...state.list];
      const index = list.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        list[index] = action.payload;
        state.list = list;
      }
    },
  },
});

export const { initMusicStore, addNewSong, incrementVote, updateSong } =
  musicSlice.actions;

export const musicList = (state: any) => state.musicStore.list;
export const musicIsLoading = (state: any) => state.musicStore.isLoading;

export default musicSlice.reducer;