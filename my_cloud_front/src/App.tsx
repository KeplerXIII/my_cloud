import { Route, Routes } from 'react-router-dom'

import { HomePage } from './components/main/HomePage'
import { MyFiles } from './components/files/MyFiles'
import { Registration } from './components/user/Registrarion'
import { Menu } from './components/Menu'

import './App.css'

function App() {
  return (
    <div className='globe'>
      <Menu />
      <div className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/my_files" element={<MyFiles />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
