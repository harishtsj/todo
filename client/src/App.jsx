import React from "react";
import { Toaster } from 'react-hot-toast'
import { Routes, Route } from "react-router-dom";

import Login from "./Components/Login/Login";
import Header from "./Components/Header/Header";
import ProtectedRoutes from "./Components/ProtectedRoutes/ProtectedRoutes";
import TodoList from "./Components/Todo/TodoList";

function App() {

  return (
    <div className="min-h-screen w-full min-w-95 flex justify-center dark:bg-black">
      <div className="w-full max-w-2xl px-4">
        <Toaster />
        <Routes>
          <Route path="/login" element={
            <div className="flex items-center justify-center min-h-screen">
              <Login />
            </div>
          } />
          <Route path="/" element={
            <ProtectedRoutes>
              <Header />
              <TodoList />
            </ProtectedRoutes>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App
