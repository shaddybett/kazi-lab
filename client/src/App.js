import React from 'react'
import Landing from './components/Landing'
import Login from './components/Login'
import Signup from './components/Signup'
import { Routes,Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
  )
}

export default App