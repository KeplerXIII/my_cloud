import { Route, Routes } from 'react-router-dom'

import { HomePage } from './components/HomePage'
import { MyFiles } from './components/MyFiles'
import { Registration } from './components/Registrarion'
import { Menu } from './components/Menu'

import './App.css'
import AuthBlock from './components/AuthBlock'

function App() {
  return (
    <div>
      <AuthBlock />
      <Menu />
      <div className='page'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/my_files' element={<MyFiles />} />
          <Route path='/registration' element={<Registration />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
