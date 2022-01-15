import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    { id: 1, name: "iPhone10" },
    { id: 2, name: "iPadPro" },
    { id: 3, name: "iWatch" },
  ],
};
let nextId = 4;
export const basketSlice = createSlice({
  name: "basket",
  initialState,

  reducers: {
    addItemToBasket: (state, action) => {
      console.log("in");
      state.items = [...state.items, { id: nextId, name: action.payload.name }];
      nextId += 1;
    },
    removeItemFromBasket: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { addItemToBasket, removeItemFromBasket } = basketSlice.actions;

export const selectItems = (state: { basket: { items: any; }; }) => state.basket.items;

export default basketSlice.reducer;
