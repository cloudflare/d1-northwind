import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// https://redux-toolkit.js.org/api/createAsyncThunk
export const updateStats = createAsyncThunk("stats/updateStats", async (props) => {
    if (props) {
        return {
            result: props,
        };
    } else {
        return {
            result: {},
        };
    }
});

export const slice = createSlice({
    name: "stats",
    initialState: {
        queries: 0,
        results: 0,
        select: 0,
        select_where: 0,
        select_leftjoin: 0,
        select_fts: 0,
        update: 0,
        delete: 0,
        insert: 0,
        log: [],
    },
    reducers: {},
    extraReducers: {
        [updateStats.fulfilled]: (state, action) => {
            const { result } = action.payload;
            if (result.queries) state.queries += result.queries;
            if (result.results) state.results += result.results;
            if (result.select) state.select += result.select;
            if (result.select_where) state.select_where += result.select_where;
            if (result.select_leftjoin) state.select_leftjoin += result.select_leftjoin;
            if (result.select_fts) state.select_fts += result.select_fts;
            if (result.update) state.update += result.update;
            if (result.delete) state.delete += result.delete;
            if (result.insert) state.insert += result.insert;
            if (result.log) state.log.unshift(...result.log);
        },
    },
});

export const selectStats = (state) => state.stats;

export const statsReducer = slice.reducer;
