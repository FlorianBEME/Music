import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  list: [{ id: 0, n: 1 }],
};

let nextId = 1;

const photoSlice = createSlice({
  name: "photoStore",
  initialState,
  reducers: {
    // addItemToBasket: (state, action) => {
    //   console.log("in");
    //   state.music = [...state.items, { id: nextId, name: action.payload.name }];
    //   nextId += 1;
    // },
  },
});

// export const { addItemToBasket } = musicSlice.actions;

export const selectItems = (state: any) => state.music;

export default photoSlice.reducer;
