import { createSlice } from "@reduxjs/toolkit";

export const dummyCartSlice = createSlice({
  name: "dummyCart",
  initialState: {
    dummyCart: [],
  },
  reducers: {
    setDummyCart(state, action) {
      let index = state.dummyCart.findIndex(
        (item) => item[`${action.payload[0]}`]
      );
      if (!state.dummyCart[index]) {
        state.dummyCart.push({ [action.payload[0]]: action.payload[1] });
      } else {
        state.dummyCart[index][`${action.payload[0]}`] = action.payload[1];
      }
    },
    cleanDummyCart(state) {
      state.dummyCart = [];
    }
  },
});

const { actions, reducer } = dummyCartSlice;
export const { setDummyCart, cleanDummyCart } = actions;
export default reducer;
