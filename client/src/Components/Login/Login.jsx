import axios from '../../utils/AxiosInstance'
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { setUser } = useAppContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = state === 'login' ? '/user/login' : '/user/register'

        if (state === 'login') {
            try {
                const { data } = await axios.post(url, { email, password })
                if (data.success) {
                    setUser(data.user);
                    navigate('/');
                } else {
                    toast.error(data.message)
                }
            } catch (err) {
                toast.error(err.message || 'Something went wrong');
            }
        }
        else {
            try {
                const { data } = await axios.post(url, { email, password, name })
                if (data.success) {
                    toast.success(data.message || 'User registered successfully')
                    setTimeout(() => {
                        setState('login')
                    }, 2000)
                } else {
                    toast.error(data.message)
                }
            } catch (err) {
                toast.error(err.message || 'Something went wrong')
            }
        }

    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-center p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">click here</span>
                </p>
            )}
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    );
};

export default Login