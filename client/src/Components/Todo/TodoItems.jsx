import React, { useState } from 'react'
import axios from '../../utils/AxiosInstance'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'

import editblack from '../../assets/editblack.svg'
import editwhite from '../../assets/editwhite.svg'
import rejectblack from '../../assets/rejectblack.svg'
import rejectwhite from '../../assets/rejectwhite.svg'
import trashblack from '../../assets/trashblack.svg'
import trashwhite from '../../assets/trashwhite.svg'
import FlagIcon from './FlagIcon';
import { setTodoList } from '../../Slices/todoSlice'
import { useAppContext } from '../../context/AppContext'

const TodoItems = ({ filteredListPage }) => {

    const { todoList } = useSelector(state => state.todo);
    const dispatch = useDispatch()

    const { theme } = useAppContext()

    // renaming logic
    const [renameState, setRenameState] = useState({
        isRenameModalOpen: false,
        selectedId: null,
        value: ''
    });

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

    // const markRejected = async (id) => {
    //     updateTask(id, { status: 'rejected' })
    // }

    const toggleFlag = async (id, currentFlag) => {
        try {
            await updateTask(id, { flagged: !currentFlag })
        } catch (err) {
            toast.err(err.message)
        }
    }

    return (
        <div className="flex flex-col w-full gap-3 max-h-[50vh] overflow-y-auto no-scrollbar transition-all duration-300">
            {/* no-scrollbar is a custom css class, refer index.css for the definition */}
            {
                filteredListPage.length == 0 ? <p className='text-center text-gray-500'>No tasks here</p> :
                    filteredListPage.map((todo) => {
                        return (
                            <div key={todo._id}
                                className="flex sm:items-center justify-between gap-2 rounded-md bg-blue-300/50 px-3 py-3 min-h-14
                                            transition-all duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in] hover:bg-blue-400/50 group dark:bg-blue-500/50 dark:text-white">
                                <div className='px-2 flex gap-3'>
                                    <input type='checkbox' defaultChecked={todo.status === 'completed' ? true : false} onChange={(e) => updateStatus(e, todo._id)} />
                                    <p className='wrap-break-word text-sm flex items-center'>{todo.title}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                                    {todo.status !== 'pending' &&
                                        <span className={`px-2 py-1 border text-sm border-gray-500 rounded text-gray-800 capitalize 
                                                ${todo.status === 'completed' ? 'bg-green-500/50' : 'bg-red-500/50'}
                                                `} >{todo.status}</span>
                                    }
                                    <img src={theme === 'dark' ? editwhite : editblack } onClick={() => renameTodo(todo)} />
                                    <img src={theme === 'dark' ? trashwhite: trashblack } onClick={() => deleteTodo(todo._id)} />
                                    {/* {todo.status === 'pending' && (
                                        <>
                                            <img src={theme === 'dark' ? rejectblack : rejectwhite} onClick={() => markRejected(todo._id)} />
                                        </>
                                    )} */}

                                    <button className={`${todo.flagged ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={() => toggleFlag(todo._id, todo.flagged)}>
                                        <FlagIcon active={todo.flagged} />
                                    </button>
                                </div>
                            </div>
                        )
                    })
            }
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

export default TodoItems