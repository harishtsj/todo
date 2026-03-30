import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import axios from '../utils/AxiosInstance'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [todoList, setTodoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

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
            toast.error(err.message)
        } finally {
            setLoading(false);
        }
    }

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get('/todo/tasks');
            if (data.success) {
                setTodoList(data.tasks)
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
            setTodoList([]);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [])

    useEffect(() => {
        if (user) {
            navigate('/')
            fetchTasks();
        } else {
            setTodoList([]);
        }
    }, [user])

    const value = { user, setUser, todoList, setTodoList, logout, loading }

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