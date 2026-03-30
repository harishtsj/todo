import React from "react";
import { useState } from "react";
import { AppContextProvider, useAppContext } from "../../context/AppContext";
import Logout from "../Logout/Logout";

const Header = () => {

    const { logout } = useAppContext()

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleLogout = async () => {
        setIsModalOpen(false);
        await logout()
    }

    const closePopup = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="flex w-full justify-between items-center px-4 py-2 z-999">
            <h1 className="text-lg font-semibold tracking-tight">TaskPilot</h1>
            <div className="w-5 h-5 rounded-full cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <img className="object-fit w-5 h-5 rounded-full" src="./profile.png" alt="profile" />
            </div>

            {
                isModalOpen && <Logout handleLogout={handleLogout} closePopup={closePopup} />
            }
        </div>
    )
}

export default Header;