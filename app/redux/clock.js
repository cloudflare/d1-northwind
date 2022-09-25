import { createSlice } from "@reduxjs/toolkit";

const now = () => {
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    return ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);
};

export const slice = createSlice({
    // generated action type constants will use name as a prefix
    name: "clock",
    initialState: {
        value: now(),
    },
    reducers: {
        updateClock: (state) => {
            state.value = now();
        },
    },
});

export const { updateClock } = slice.actions;
export const selectClock = (state) => state.clock.value;
export const clockReducer = slice.reducer;
