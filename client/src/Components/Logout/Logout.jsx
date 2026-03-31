import React from 'react'

const Logout = ({ handleLogout, closePopup, isModalOpen }) => {
    return (
        <div className={`fixed top-0 left-0 flex w-full h-full z-100 bg-black/30 backdrop-blur-lg justify-center items-center transition-all duration-300 ease-in-out ${isModalOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className="flex flex-col w-100 p-4 m-3 h-auto bg-white rounded-xl shadow-lg max-w-sm">
                <div className="flex justify-between text-lg">
                    <h3>Confirm Logout ?</h3>
                    <span className='hover:cursor-pointer' onClick={() => closePopup()}>X</span>
                </div>
                <div className="flex w-full h-full gap-3 justify-end mt-3 px-2 py-1">
                    <button
                        className="w-15 p-2 py-1 text-white rounded bg-blue-400 border border-blue-800"
                        onClick={() => handleLogout()}
                    >Yes</button>
                    <button className="w-15 p-2 py-1 rounded border" onClick={() => closePopup()}>No</button>
                </div>
            </div>
        </div>
    )
}

export default Logout