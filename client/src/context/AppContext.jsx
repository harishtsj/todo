import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import axios from '../utils/AxiosInstance'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTodoList } from "../Slices/todoSlice";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light')
    // const [todoList, setTodoList] = useState([]);
    // const { todoList } = useSelector((state) => state.todo)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/user/fetchUser');
            if (data.success) {
                setUser(data.user)
            } else {
                setUser(null)
                return toast.error(data.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get('/todo/tasks');
            if (data.success) {
                dispatch(setTodoList(data.tasks))
            } else {
                return toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const logout = async () => {
        try {
            await axios.post("/user/logout");

            setUser(null);
            dispatch(setTodoList([]));

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if(location.pathname === '/login') return
        fetchUser()
    }, [location.pathname])

    useEffect(() => {
        if (user) {
            navigate('/')
            fetchTasks();
        } else {
            dispatch(setTodoList([]));
        }
    }, [user])

    useEffect(() => {
        if(theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    const value = { user, setUser, logout, loading, theme, setTheme, fetchUser }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppContextProvider, useAppContext }