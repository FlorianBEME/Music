import { configureStore } from "@reduxjs/toolkit";
import musicSlice from "./slicer/musicSlice";
import photoSlice from "./slicer/photoSlice";
import appSlice from "./slicer/appSlice";
import eventSlice from "./slicer/eventSlice";

export default configureStore({
  reducer: {
    musicStore: musicSlice,
    photoStore: photoSlice,
    appStore: appSlice,
    eventStore: eventSlice,
  },
});
