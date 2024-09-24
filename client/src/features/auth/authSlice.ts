import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type RootState } from "../../store/store";
import api from "../../api/AxiosConfig";

interface InitialState {
  status: "idle" | "loading" | "failed";
  error: string | null;
}
const initialState: InitialState = {
  status: "idle",
  error: "",
};

export const signup = createAsyncThunk("auth/signup", async (user: any) => {
  const response = await api.post("/auth/signup", user);
  return response.data;
});
export const testStore = createAsyncThunk("auth/test", async () => {
  const response = await api.get("/");
  console.log("response response response", response.data);
  return response.data;
});
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signup.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(signup.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.status = "failed";

      state.error = action.error.message ?? "Somethin went wrong";
    });
  },
});

export const selectUsers = (state: RootState) => state.auth;

export default authSlice.reducer;
