import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
    firstName: string;
    lastName: string;
    emailId: string;
    imageUrl: string;
    _id: string;
}

interface LayoutState {
    users: User[];
    selectedMenu: string;
}

const initialState: LayoutState = {
    selectedMenu: "Users",
    users: [],
};

const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter((u) => u.emailId !== action.payload);
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const idx = state.users.findIndex((u) => u.emailId === action.payload.emailId);
            if (idx !== -1) state.users[idx] = action.payload;
        },
        setMenu: (state, action: PayloadAction<string>) => {
            state.selectedMenu = action.payload;
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
    },
});

export const { addUser, deleteUser, updateUser, setMenu, setUsers } = layoutSlice.actions;
export default layoutSlice.reducer;
