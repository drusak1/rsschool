import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '../types/character';

interface SelectedState {
  items: Character[];
}

const initialState: SelectedState = { items: [] };

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    toggleItem(state, action: PayloadAction<Character>) {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(idx, 1);
      }
    },
    clearAll(state) {
      state.items = [];
    },
  },
});

export const { toggleItem, clearAll } = selectedSlice.actions;
export default selectedSlice.reducer;
