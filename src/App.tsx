import { useState } from 'react'
import NongpanyaVending from "./pages/form-page"
import './App.css'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <NongpanyaVending />
    </>
  )
}

export default App
