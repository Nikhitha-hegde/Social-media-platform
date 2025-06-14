import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Feed from './components/feed'
import Login from './elements/login'
import Header from './components/Header'
import Profile from './components/userprofile'
import Followers from './elements/followDetails'
import './index.css'

function App() {

  return (
    <BrowserRouter> 
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<>
                                    <Header /> 
                                    <Feed /></>
                                  }/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/followers" element={<Followers />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App