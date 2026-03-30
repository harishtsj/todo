import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {

    const { user, loading } = useAppContext();

    if(loading) {
        return (
            <div className='flex fixed inset-0 items-center justify-center text-3xl w-screen h-screen bg-black/50 backdrop-blur-lg'>
                Loading...
            </div>
        )
    }

    if (!user) {
        return <Navigate to='/login' />
    }

    return children
}

export default ProtectedRoutes