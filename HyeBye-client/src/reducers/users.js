import { createSlice } from "@reduxjs/toolkit";

const UserListSlice = new createSlice({
  name: "users",
  initialState: { value: { count: 0, list: [] } },
  reducers: {
    setUsers: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUsers } = UserListSlice.actions;
export default UserListSlice.reducer;
