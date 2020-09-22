import React,{useEffect} from 'react'
import Nav from './App/Nav'
import Canvas from './App/Canvas'
import ToolProperties from './App/ToolProperties'
import './App.less'
import globalStore from '../Store/StoreFuncs'
import { useSelector } from 'react-redux'
const electron = window.require("electron")

function initStorePostRender(){
    globalStore.setStore({dpi:window.devicePixelRatio})
}
function App(){
    const store = useSelector(store => store)
    const theme=store.settings.theme
    useEffect(()=>{
        electron.ipcRenderer.on('debug', (event, arg) => {
            console.log(arg)
        });
        initStorePostRender()
    },[])
    return(
        <div className={`app-container ${theme}`}>
            <Nav/>
            <div className={`inner-app-container`}>
                <ToolProperties />
                <Canvas/>
            </div>
        </div>
    )
}

export default App