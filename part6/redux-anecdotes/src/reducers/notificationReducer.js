import { createSlice } from "@reduxjs/toolkit";

const initialState = "Hello World";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    _setNotification(state, action) {
      return action.payload;
    },
    _clearNotification(state, action) {
      return "";
    },
  },
});

const { _setNotification, _clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

export const setNotification = (message, delay) => {
  return async (dispatch) => {
    dispatch(_setNotification(message));
    setTimeout(() => dispatch(_clearNotification()), delay * 1000);
  };
};
