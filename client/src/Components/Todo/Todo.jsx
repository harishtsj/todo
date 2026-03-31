import React, { useState } from 'react';
import './Todo.css'
import toast from 'react-hot-toast'
import axios from '../../utils/AxiosInstance'
import editdark from '../../assets/EditDark.svg'
import trash from '../../assets/trash.svg'
import reject from '../../assets/reject.svg'
import { useDispatch, useSelector } from 'react-redux';
import { setTodoList } from '../../Slices/todoSlice';
import FlagIcon from './FlagIcon';

// axios.defaults.baseURL = import.meta.env.TODO_SERVER_URL;

const Todo = () => {
    // const { todoList, setTodoList } = useAppContext()
    const { todoList } = useSelector((state) => state.todo);
    const dispatch = useDispatch();

    const [value, setValue] = useState('');

    // filtering logic
    const [filter, setFilter] = useState('all')

    // renaming logic
    const [renameState, setRenameState] = useState({
        isRenameModalOpen: false,
        selectedId: null,
        value: ''
    })

    const statusTab = [{
        name: 'pending',
        color:"text-yellow-700",
        className: 'bg-yellow-400/70',
        ring: 'ring-yellow-700/70'
    }, {
        name: 'completed',
        color:"text-green-700",
        className: 'bg-green-400/70',
        ring: 'ring-green-700/70'
    }, {
        name: 'rejected',
        color:"text-red-700",
        className: 'bg-red-400/70',
        ring: 'ring-red-700/70'
    }, {
        name: 'flagged',
        color:"text-orange-700",
        className: 'bg-orange-400/70',
        ring: 'ring-orange-700/70'
    }, {
        name: 'all',
        color:"text-blue-700",
        className: 'bg-blue-400/70',
        ring: 'ring-blue-700/70'
    }]
    // const statusTab = [{
    //     name: 'all',
    //     className: 'bg-blue-400/70'
    // }, {
    //     name: 'completed',
    //     className: 'bg-green-400/70'
    // }, {
    //     name: 'rejected',
    //     className: 'bg-red-400/70'
    // }, {
    //     name: 'flagged',
    //     className: 'bg-orange-400/70'
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

    // deleting the todo from the todolist
    const deleteTodo = async (idToDelete) => {
        try {
            const { data } = await axios.delete(`/todo/tasks/${idToDelete}`)
            if (data.success) {
                const newTodos = todoList.filter(todo => todo._id !== idToDelete)
                dispatch(setTodoList(newTodos))
                // dispatch(setTodoList(prev => prev.filter(item => item._id !== idToDelete)))
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    // updating the todolist
    const updateTask = async (id, updates) => {
        try {
            const { data } = await axios.put(`/todo/tasks/${id}`, updates);
            if (data.success) {
                const updatedId = data.updatedTask._id;
                const updatedTodo = todoList.map(todo => todo._id === updatedId ? { ...todo, ...updates } : todo)
                dispatch(setTodoList(updatedTodo))
                setRenameState({ isRenameModalOpen: false, selectedId: null, value: '' })
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    // setting modal to true for rename popup
    const renameTodo = (todo) => {
        setRenameState({ isRenameModalOpen: true, selectedId: todo._id, value: todo.title })
    }

    // handle rename onchange function, checks for empty spaces
    const handleRenameInputChange = (e) => {
        const newValue = e.target.value;
        setRenameState(prev => ({ ...prev, value: newValue }))
    };

    // rename todo task
    const handleRename = () => {
        if (!renameState.value.trim()) return;
        updateTask(renameState.selectedId, { title: renameState.value })
    }

    // todo status 'completed' status checkbox
    const updateStatus = (e, id) => {
        if (e.target.checked) {
            markCompleted(id)
        } else {
            updateTask(id, { status: 'pending' })
        }
    }

    const markCompleted = async (id) => {
        updateTask(id, { status: 'completed' })
    }

    const markRejected = async (id) => {
        updateTask(id, { status: 'rejected' })
    }

    const toggleFlag = async (id, currentFlag) => {
        try {
            await updateTask(id, { flagged: !currentFlag })
        } catch (err) {
            toast.err(err.message)
        }
    }

    const filteredList = todoList.filter(todo => {
        if (filter === 'completed') return todo.status === 'completed';
        if (filter === 'rejected') return todo.status === 'rejected';
        if (filter === 'pending') return todo.status === 'pending';
        if (filter === 'flagged') return todo.flagged
            return true;
    })

    const changeFilterTab = (tabName) => {
        if(tabName !== filter) {
            setFilter(tabName)
        } else {
            setFilter('')
        }
    }

    return (
        <div className='flex flex-col p-3 gap-3 items-center'>
            <h3 className="font-semibold text-center">My Todo List</h3>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                    className="flex-1 px-2 border rounded outline-none border-t-0 border-r-0 border-l-0 focus:border-blue-400 focus:outline-none
                    focus:placeholder:scale-95 focus:placeholder:translate-x-3 transition-all duration-300"
                    type="text" placeholder="What do you want to get done?"
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addItems(value) }}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-[1.01] transition-all duration-300 w-full text-wrap sm:w-auto active:scale-90"
                    onClick={() => addItems(value)}
                >
                    Add
                </button>

            </div>

            {/* All, completed, Rejected, Flagged*/}

            <div className='w-full flex flex-col gap-3 p-2'>

                <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 w-full'>
                    {statusTab.map((status) => {
                        const isActive = filter === status.name;

                        return (
                            <button
                                key={status.name}
                                onClick={() => changeFilterTab(status.name)}
                                className={`p-2 border rounded capitalize text-sm sm:text-base transition-all duration-200 hover:scale-[1.01]
                                    ${status.className} ${status.color}
                                    ${isActive
                                        ? `ring-2 ${status.ring} shadow-md font-semibold active:scale-90`
                                        : "opacity-70 hover:opacity-100"}`}>
                                {status.name}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col w-full gap-2 max-h-[60vh] overflow-y-auto transition-all duration-300">
                    {
                        filteredList.length == 0 ? <p className='text-center text-gray-500'>No tasks here</p> :
                            filteredList.map((todo) => {
                                return (
                                    <div
                                        key={todo._id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded px-3 py-3 
                                            transition-all duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in] hover:bg-slate-300/50 group">
                                        <div className='px-2 flex gap-3'>
                                            <input type='checkbox' defaultChecked={todo.status === 'completed' ? true : false} onChange={(e) => updateStatus(e, todo._id)} />
                                            <p className='wrap-break-word text-sm sm:text-base'>{todo.title}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                                            <img src={editdark} onClick={() => renameTodo(todo)} />
                                            <img src={trash} onClick={() => deleteTodo(todo._id)} />
                                            {todo.status === 'pending' ? (
                                                <>
                                                    <img src={reject} onClick={() => markRejected(todo._id)} />
                                                </>
                                            ) : (
                                                <span className={`px-2 py-1 border text-sm border-gray-500 rounded text-gray-800 capitalize 
                                                ${todo.status === 'completed' ? 'bg-green-500/50' : 'bg-red-500/50'}
                                                `} >{todo.status}</span>
                                            )}
                                            <button className={`${todo.flagged ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={() => toggleFlag(todo._id, todo.flagged)}>
                                                <FlagIcon active={todo.flagged} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
            {
                renameState.isRenameModalOpen && (
                    <div className="flex fixed inset-0 bg-black/30 backdrop-blur-lg justify-center items-center">
                        <div className="p-3 pb-0 flex flex-col w-100 h-auto border rounded bg-white">
                            <div className="flex justify-between">
                                <h3>Rename the title</h3>
                                <h2 className="cursor-pointer" onClick={() => setRenameState({ isRenameModalOpen: false, selectedId: null, value: '' })}>
                                    X
                                </h2>
                            </div>
                            <input type="text" placeholder="Rename the title" value={renameState.value}
                                className="border rounded border-blue-900/50 p-2 mt-4 focus:outline-none focus:border-blue-900"
                                onChange={(e) => handleRenameInputChange(e)} autoFocus
                                onKeyDown={(e) => { if (e.key === 'Enter') handleRename(renameState.selectedId) }}
                            />
                            <p className={`${renameState.value.trim() === '' ? 'text-red-500' : 'hidden'}`}>Title cannot be empty</p>
                            <div className="flex justify-end w-full gap-3 py-2 my-2">
                                <button
                                    className="p-2 py-1 text-white rounded w-auto bg-blue-400 border border-blue-800
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 transition-all duration-150 active:scale-90"
                                    onClick={handleRename}
                                    // below button will be disabled, if modal opens with empty value
                                    // its likely a pre-check
                                    disabled={renameState.value.trim() === ''}
                                >
                                    Rename
                                </button>
                                <button
                                    className="p-2 py-1 rounded w-auto border transition-all duration-150 active:scale-90"
                                    onClick={() => setRenameState({ isRenameModalOpen: false, selectedId: null, value: '' })}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Todo