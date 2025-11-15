import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  randomlyChosenCard: string;
  userId: string | null;
  displayName: string | null;
  username: string | null;
  userLoading: boolean;
  userError: string | null;
  lastSynced: number | null;
  lastTransactionId: string | null;
}

const initialState: AppState = {
  randomlyChosenCard: "",
  userId: null,
  displayName: null,
  username: null,
  userLoading: false,
  userError: null,
  lastSynced: null,
  lastTransactionId: null,
};

/**
 * Async thunk to initialize safe user data
 * Only stores non-sensitive data: userId, displayName, username
 * DOES NOT store: balances, account numbers, cards, email, contact, address
 */

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setRandomlyChosenCard: (state, action: PayloadAction<"visa" | "mastercard">) => {
      state.randomlyChosenCard = action.payload;
    },

    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    clearUserData: (state) => {
      state.userId = null;
      state.displayName = null;
      state.username = null;
      state.userError = null;
      state.lastSynced = null;
      state.lastTransactionId = null;
    },

    clearUserError: (state) => {
      state.userError = null;
    },
  },
});

export const { setRandomlyChosenCard, setUserId, setDisplayName, setUsername, clearUserData, clearUserError } =
  AppSlice.actions;

export default AppSlice.reducer;
