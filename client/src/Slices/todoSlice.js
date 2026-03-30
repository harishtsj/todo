import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
    name: 'todo',
    initialState: {
        todoList: []
    },
    reducers: {
        setTodoList: (state, action) => {
            state.todoList = action.payload
        }
    }
})

export const { setTodoList } = todoSlice.actions;
export default todoSlice.reducer;