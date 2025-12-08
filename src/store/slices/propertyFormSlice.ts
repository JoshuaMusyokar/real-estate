import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PropertyFormState {
  propertyTypeId: string;
  propertyTypeName: string;
  subTypeId: string | null;
  subTypeName: string | null;
  // You can add other form state here if needed
}

const initialState: PropertyFormState = {
  propertyTypeId: "",
  propertyTypeName: "",
  subTypeId: null,
  subTypeName: null,
};

const propertyFormSlice = createSlice({
  name: "propertyForm",
  initialState,
  reducers: {
    setPropertyType: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
      }>
    ) => {
      state.propertyTypeId = action.payload.id;
      state.propertyTypeName = action.payload.name;
      // Reset subtype when property type changes
      state.subTypeId = null;
      state.subTypeName = null;
    },
    setSubType: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
      } | null>
    ) => {
      if (action.payload) {
        state.subTypeId = action.payload.id;
        state.subTypeName = action.payload.name;
      } else {
        state.subTypeId = null;
        state.subTypeName = null;
      }
    },
    clearFormState: () => initialState,
  },
});

export const { setPropertyType, setSubType, clearFormState } =
  propertyFormSlice.actions;
export default propertyFormSlice.reducer;
