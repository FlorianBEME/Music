import { configureStore } from "@reduxjs/toolkit";
import musicSlice from "./slicer/musicSlice";
import photoSlice from "./slicer/photoSlice";
import appSlice from "./slicer/appSlice";
import eventSlice from "./slicer/eventSlice";
import userSlice from "./slicer/usersSlice";

export default configureStore({
  reducer: {
    musicStore: musicSlice,
    photoStore: photoSlice,
    appStore: appSlice,
    eventStore: eventSlice,
    userStore:userSlice
  },
});
