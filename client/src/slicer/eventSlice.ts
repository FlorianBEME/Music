import { createSlice } from "@reduxjs/toolkit";
import { emitEvent } from "../components/common/SocketPublicComponent";

const initialState = {
  eventData: {},
};

export const eventSlice = createSlice({
  name: "eventStore",
  initialState,

  reducers: {
    initEventState: (state, action) => {
      state.eventData = { ...state.eventData, ...action.payload };
    },
    updateEventInStore: (state, action) => {
      state.eventData = { ...action.payload, isLoad: true };
    },
    deleteEvent: (state) => {
      state.eventData = { isLoad: false };
    },
    updateEventBgInStore: (state: { eventData: any }, action) => {
      state.eventData.bg_music = action.payload;
    },
  },
});

export const {
  initEventState,
  updateEventInStore,
  deleteEvent,
  updateEventBgInStore,
} = eventSlice.actions;

export const eventStore = (state: any) => state.eventStore.eventData;

export default eventSlice.reducer;
