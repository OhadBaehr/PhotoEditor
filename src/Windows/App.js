import React from 'react'
import Nav from './App/Nav'
import Canvas from './App/Canvas'
import './App.less'
function App(){
    return(
        <div className={`app-container`}>
            <Nav/>
            <Canvas/>
        </div>
    )
}

export default App