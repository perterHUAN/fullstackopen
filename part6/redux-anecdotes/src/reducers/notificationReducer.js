import { createSlice } from "@reduxjs/toolkit";

const initialState = "Hello World";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    changeNofication(state, action) {
      state = action.payload;
    },
  },
});

export const { changeNofication } = notificationSlice.actions;
export default notificationSlice.reducer;
