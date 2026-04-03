import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Logout from "../Logout/Logout";
import logoutblack from '../../assets/logoutblack.svg'
import logoutwhite from '../../assets/logoutwhite.svg'

const Header = () => {

    const { logout, theme, setTheme } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const checkboxRef = useRef(null)

    const handleLogout = async () => {
        setIsModalOpen(false);
        await logout()
    }

    const closePopup = () => {
        setIsModalOpen(false)
    }

    const changeTheme = (e) => {
        if (e.target.checked) {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }

    useEffect(() => {
        let checkbox = checkboxRef.current;
        if (theme === 'dark') {
            checkbox.checked = true
        } else {
            checkbox.checked = false
        }
    }, [theme])

    const divChangeTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')   
    }

    return (
        <div className="flex w-full justify-between items-center px-4 py-2 z-999">
            <h1 className="text-lg font-semibold tracking-tight dark:text-white">TaskPilot</h1>
            <div className="flex items-center gap-3">
                <div className="flex gap-2 items-center ps-2">
                    <input ref={checkboxRef} type="checkbox" onChange={(e) => changeTheme(e)} />
                    <div className="hover:cursor-pointer dark:text-white" onClick={() => divChangeTheme()}>
                        Dark Theme
                    </div>
                </div>
                <div className="w-5 h-5 rounded-full cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <img className="object-fit w-5 h-5 rounded-full" src={theme === 'dark' ? logoutwhite : logoutblack} alt="profile" />
                </div>
            </div>

            {
                <Logout handleLogout={handleLogout} closePopup={closePopup} isModalOpen={isModalOpen} />
            }
        </div>
    )
}

export default Header;