import { createSlice } from "@reduxjs/toolkit";

const initialValues = { username: "" };

const userSlice = createSlice({
  name: "user",
  initialState: { value: { initialValues } },
  reducers: {
    userChange: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { userChange } = userSlice.actions;
export default userSlice.reducer;
