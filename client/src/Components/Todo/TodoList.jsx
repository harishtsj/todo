import React, { useState } from 'react';
import './Todo.css'
import toast from 'react-hot-toast'
import axios from '../../utils/AxiosInstance'
import { useDispatch, useSelector } from 'react-redux';
import { setTodoList } from '../../Slices/todoSlice';
import StatusTabs from '../StatusBar/StatusBar';
import TodoItems from './TodoItems';
import Pagination from '../Pagination/Pagination';

// axios.defaults.baseURL = import.meta.env.TODO_SERVER_URL;

const Todo = () => {
    // const { todoList, setTodoList } = useAppContext()
    const { todoList } = useSelector((state) => state.todo);
    const dispatch = useDispatch();

    const [value, setValue] = useState('');

    // filtering logic
    const [filter, setFilter] = useState('all')

    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage, setPostPerPage] = useState(5)

    // const statusTab = [
    //     { name: 'pending' },
    //     { name: 'completed' },
    //     // { name: 'rejected' },
    //     { name: 'flagged' },
    //     { name: 'all' }
    // ]

    // const statusTab = [{
    //     name: 'pending',
    //     color:"text-yellow-700",
    //     className: 'bg-yellow-400/70',
    //     ring: 'ring-yellow-700/70'
    // }, {
    //     name: 'completed',
    //     color:"text-green-700",
    //     className: 'bg-green-400/70',
    //     ring: 'ring-green-700/70'
    // }, {
    //     name: 'rejected',
    //     color:"text-red-700",
    //     className: 'bg-red-400/70',
    //     ring: 'ring-red-700/70'
    // }, {
    //     name: 'flagged',
    //     color:"text-orange-700",
    //     className: 'bg-orange-400/70',
    //     ring: 'ring-orange-700/70'
    // }, {
    //     name: 'all',
    //     color:"text-blue-700",
    //     className: 'bg-blue-400/70',
    //     ring: 'ring-blue-700/70'
    // }]

    // Adding new items to the todolist
    const addItems = async (value) => {
        if (value.trim() === '') return;

        try {
            const { data } = await axios.post('/todo/tasks', { title: value })
            if (data.success) {
                const newTodoList = [...todoList, data.newTask];
                dispatch(setTodoList(newTodoList));
                // dispatch(setTodoList(prev => [...prev, data.newTask]))
                setValue('')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const filteredList = todoList.filter(todo => {
        if (filter === 'completed') return todo.status === 'completed';
        if (filter === 'rejected') return todo.status === 'rejected';
        if (filter === 'pending') return todo.status === 'pending';
        if (filter === 'flagged') return todo.flagged
        return true;
    });

    const lastPostIndex = currentPage * postPerPage
    // page1 -> 1 * 5 = 5
    // page2 -> 2 * 5 = 10 
    // page3 -> 3 * 5 = 15
    const firstPostIndex = lastPostIndex - postPerPage
    // page1 -> 5 - 5 = 0
    // page2 -> 10 - 5 = 5
    // page3 -> 15 - 5 = 10
    const filteredListPage = filteredList.slice(firstPostIndex, lastPostIndex)

    const changeFilterTab = (tabName) => {
        // if (tabName !== filter) {
        //     setFilter(tabName)
        // } else {
        //     setFilter('')
        // }
        setFilter(tabName);
    }

    return (
        <div className='flex flex-col p-3 gap-3 items-center'>
            <h3 className="font-semibold text-center dark:text-white">My Todo List</h3>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className='relative flex-1'>
                    <input
                        className="w-full px-2 py-3 border border-gray-300 rounded dark:text-white outline-none focus:ring-2 focus:ring-blue-500
                        dark:border-gray-700 dark:placeholder:text-gray-500 caret-blue-500 transition-all duration-200 placeholder:text-xs peer"
                        type="text"
                        placeholder=''
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') addItems(value) }}
                    />
                    <label className='absolute left-2 text-sm text-gray-500 pointer-events-none origin-left
                        -top-2.5 scale-75 bg-white px-1 dark:bg-black 
                    
                    peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1
                    
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                    peer-placeholder-shown:text-gray-500
                    transition-[top,scale,translate,color,padding] duration-200 dark:peer-focus:bg-black'>
                        Add Something...
                    </label>
                </div>

                <button
                    className="mt-2 bg-blue-500 min-w-29 text-white px-4 py-2 rounded hover:scale-[1.01] transition-all duration-300 w-full text-wrap sm:w-auto active:scale-90"
                    onClick={() => addItems(value)}
                >
                    Add
                </button>

            </div>

            {/* All, completed, Rejected, Flagged*/}

            <div className='w-full flex flex-col gap-3 py-2'>

                <StatusTabs active={filter} onChange={changeFilterTab} />

                {/* <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 w-full'>
                    {statusTab.map((status) => {
                        const isActive = filter === status.name;

                        return (
                            <button
                                key={status.name}
                                onClick={() => changeFilterTab(status.name)}
                                className={`p-2 border rounded capitalize text-sm text-white sm:text-base transition-all duration-200 hover:scale-[1.03]
                                    ${status.className} ${status.color}
                                    ${isActive
                                        ? `ring-2 ring-gray-500/40 shadow-md scale-[1.03] font-semibold active:scale-90`
                                        : "opacity-70 hover:opacity-100"}`}>
                                {status.name}
                            </button>
                        );
                    })}
                </div> */}

                <TodoItems filteredListPage={filteredListPage} />
                <Pagination postPerPage={postPerPage} filteredList={filteredList} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            </div>

        </div>
    )
}

export default Todo