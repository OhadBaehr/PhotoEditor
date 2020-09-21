import React,{useEffect} from 'react'
import Nav from './App/Nav'
import Canvas from './App/Canvas'
import ToolProperties from './App/ToolProperties'
import './App.less'
import globalStore from '../Store'

const electron = window.require("electron")

function initStorePostRender(){
    globalStore.setStore({dpi:window.devicePixelRatio})
}
function App(){
    useEffect(()=>{
        electron.ipcRenderer.on('debug', (event, arg) => {
            console.log(arg)
        });
        initStorePostRender()
    },[])
    return(
        <div className={`app-container`}>
            <Nav/>
            <div className={`inner-app-container`}>
                <ToolProperties />
                <Canvas/>
            </div>
        </div>
    )
}

export default App