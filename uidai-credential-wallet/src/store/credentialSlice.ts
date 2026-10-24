import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCredentials } from "../services/credentialService";

export type CredentialStatus = "Active" | "Expired" | string;

export interface Credential {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: CredentialStatus;
  credentialNumber: string;
}

interface CredentialsState {
  credentials: Credential[];
  loading: boolean;
  error: string | null;
}

const initialState: CredentialsState = {
  credentials: [],
  loading: false,
  error: null,
};

export const loadCredentials = createAsyncThunk<
  Credential[],
  void,
  { rejectValue: string }
>("credentials/loadCredentials", async (_, { rejectWithValue }) => {
  try {
    return await fetchCredentials();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load credentials";
    return rejectWithValue(message);
  }
});

const credentialSlice = createSlice({
  name: "credentials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.credentials = action.payload;
        console.log("action.payload:", action.payload);
        state.error = null;
      })
      .addCase(loadCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to load credentials";
        // Keep previous credentials out of the UI while in error state
        // (dashboard only renders cards when !error)
      });
  },
});

export default credentialSlice.reducer;
