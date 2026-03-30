import React, { useState } from 'react';
import './Todo.css'
import toast from 'react-hot-toast'
import axios from '../../utils/AxiosInstance'
import { useAppContext } from '../../context/AppContext';
import editdark from '../../assets/EditDark.svg'
import trash from '../../assets/trash.svg'
import reject from '../../assets/reject.svg'

// axios.defaults.baseURL = import.meta.env.TODO_SERVER_URL;

const Todo = () => {
    const { todoList, setTodoList } = useAppContext()

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
        name: 'all',
        className: 'bg-blue-400/70'
    }, {
        name: 'completed',
        className: 'bg-green-400/70'
    }, {
        name: 'rejected',
        className: 'bg-red-400/70'
    }]

    const addItems = async (value) => {
        if (value.trim() === '') return;

        try {
            const { data } = await axios.post('/todo/tasks', { title: value })
            if (data.success) {
                setTodoList(prev => [...prev, data.newTask])
                setValue('')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const deleteTodo = async (idToDelete) => {
        try {
            const { data } = await axios.delete(`/todo/tasks/${idToDelete}`)
            if (data.success) {
                setTodoList(prev => prev.filter(item => item._id !== idToDelete))
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const updateTask = async (id, updates) => {
        try {
            const { data } = await axios.put(`/todo/tasks/${id}`, updates);
            const updatedId = data.updatedTask._id
            if (data.success) {
                setTodoList(prev => prev.map(item => item._id === updatedId ? { ...item, ...updates } : item))
                setRenameState({ isRenameModalOpen: false, selectedId: null, value: '' })
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleRenameInputChange = (e) => {
        const newValue = e.target.value;
        setRenameState(prev => ({ ...prev, value: newValue }))
    };

    const renameTodo = (todo) => {
        setRenameState({ isRenameModalOpen: true, selectedId: todo._id, value: todo.title })
    }

    const handleRename = () => {
        if (!renameState.value.trim()) return;
        updateTask(renameState.selectedId, { title: renameState.value })
    }

    const markCompleted = async (id) => {
        updateTask(id, { status: 'completed' })
    }

    const markRejected = async (id) => {
        updateTask(id, { status: 'rejected' })
    }

    const updateStatus = (e, id) => {
        if (e.target.checked) {
            markCompleted(id)
        } else {
            updateTask(id, { status: 'pending' })
        }
    }

    const filteredList = todoList.filter(todo => {
        if (filter === 'completed') return todo.status === 'completed';
        if (filter === 'rejected') return todo.status === 'rejected';
        return true;
    })


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

            {/* All, completed, Rejected*/}

            <div className='w-full flex flex-col gap-3 p-2'>

                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 w-full'>
                    {statusTab.map((status) => {
                        const isActive = filter === status.name;

                        return (
                            <button
                                key={status.name}
                                onClick={() => setFilter(status.name)}
                                className={`p-2 border rounded capitalize text-sm sm:text-base transition-all duration-200 hover:scale-[1.01]
                                    ${status.className}
                                    ${isActive
                                        ? "ring-2 ring-black scale-95 shadow-md font-semibold active:scale-90"
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
                                            transition-all duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in]">
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