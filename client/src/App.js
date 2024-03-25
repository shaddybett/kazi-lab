import React from 'react'
import Landing from './components/Landing'
import Login from './components/Login'
import Signup from './components/Signup'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Home from './components/Home'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/home' element={<Home/>}/>
    </Routes>
  )
}

export default App