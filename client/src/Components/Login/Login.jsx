import axios from '../../utils/AxiosInstance'
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
// import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate();

    const { setUser } = useAppContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = state === 'login' ? '/user/login' : '/user/register'

        if (state === 'login') {
            try {
                const { data } = await axios.post(url, { email, password })
                if (data.success) {
                    setUser(data.user);
                    // navigate('/');
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
        <div className='flex max-sm:flex-col'>
            <div className="max-sm:w-full md:flex w-1/2 relative rounded-2xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white items-center justify-center p-12">

                {/* Glow effect */}
                <div className="absolute w-[400px] h-[400px] bg-white/10 blur-3xl rounded-full top-10 left-10"></div>

                <div className="relative z-10 text-center max-w-md animate-fadeIn">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">
                        TodoApp
                    </h1>

                    <p className="text-lg opacity-90 mb-8">
                        Organize your life, one task at a time.
                    </p>

                    <div className="space-y-3 text-sm opacity-80">
                        <p>✔ Track tasks easily</p>
                        <p>✔ Stay productive</p>
                        <p>✔ Never miss deadlines</p>
                    </div>
                </div>
            </div>
            <div className='flex w-full md:w-1/2 justify-center items-center bg-gray-100 dark:bg-gray-900'>
                <form onSubmit={handleSubmit} className="flex flex-col max-sm:w-full rounded-2xl gap-4 m-auto items-center p-8 py-12 w-80 text-gray-500 shadow-xl border border-gray-200 bg-white">
                    <p className="text-2xl font-medium m-auto">
                        <span className="text-blue-500">User</span> {state === "login" ? "Login" : "Sign Up"}
                    </p>
                    {state === "register" && (
                        <div className="w-full">
                            {/* <p>Name</p> */}
                            {/* <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500" type="text" required /> */}
                            <div className='relative flex-1'>
                                <input
                                    className="w-full p-2 mt-1 border border-gray-300 rounded outline-blue-500 dark:text-white
                            dark:border-gray-600/60 dark:placeholder:text-gray-500 caret-blue-500 transition-all duration-400 placeholder:text-xs peer"
                                    type="text" placeholder=" "
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label className='absolute left-2 text-sm text-gray-500 pointer-events-none origin-left -top-1.75 scale-75 px-1 bg-white
                            peer-focus:-top-1.75 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                            peer-placeholder-shown:text-gray-500
                            transition-[top,scale,translate,color,padding] duration-350 dark:peer-focus:bg-black'>
                                    Name
                                </label>
                            </div>
                        </div>
                    )}
                    <div className="w-full ">
                        {/* <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500" type="email" required /> */}
                        <div className='relative flex-1'>
                            <input
                                className="w-full p-2 mt-1 border border-gray-300 rounded outline-blue-500 dark:text-white
                    dark:border-gray-600/60 dark:placeholder:text-gray-500 caret-blue-500 transition-all duration-400 placeholder:text-xs peer"
                                type="text" placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label className='absolute left-2 text-sm text-gray-500 pointer-events-none origin-left -top-1.75 scale-75 px-1 bg-white
                    peer-focus:-top-1.75 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                    peer-placeholder-shown:text-gray-500
                    transition-[top,scale,translate,color,padding] duration-350 dark:peer-focus:bg-black'>
                                Email
                            </label>
                        </div>
                    </div>
                    <div className="w-full ">
                        {/* <p>Password</p> */}
                        {/* <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500" type="password" required /> */}
                        <div className='relative flex-1'>
                            <input
                                className="w-full p-2 mt-1 border border-gray-300 rounded outline-blue-500 dark:text-white
                    dark:border-gray-600/60 dark:placeholder:text-gray-500 caret-blue-500 transition-all duration-400 placeholder:text-xs peer"
                                type="text" placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label className='absolute left-2 text-sm text-gray-500 pointer-events-none origin-left -top-1.75 scale-75 px-1 bg-white
                    peer-focus:-top-1.75 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                    peer-placeholder-shown:text-gray-500
                    transition-[top,scale,translate,color,padding] duration-350 dark:peer-focus:bg-black'>
                                Password
                            </label>
                        </div>
                    </div>
                    {state === "register" ? (
                        <p>
                            Already have account? <span onClick={() => setState("login")} className="text-blue-500 font-semibold cursor-pointer">click here</span>
                        </p>
                    ) : (
                        <p>
                            Create an account? <span onClick={() => setState("register")} className="text-blue-500 font-semibold cursor-pointer">click here</span>
                        </p>
                    )}
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                        {state === "register" ? "Create Account" : "Login"}
                    </button>
                </form>
            </div>
        </div>

    );
};

export default Login