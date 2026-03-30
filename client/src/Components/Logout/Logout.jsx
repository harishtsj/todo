import React from 'react'

const Logout = ({ handleLogout, closePopup }) => {
    return (
        <div className="flex flex-col absolute inset-0 w-screen h-screen bg-black/30 backdrop-blur-lg justify-center items-center">
            <div className="flex flex-col w-100 p-3 m-3 h-auto bg-white rounded">
                <div className="flex justify-between text-lg">
                    <h3>Confirm Logout ?</h3>
                    <span>X</span>
                </div>
                ----------------------------------------------------------
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