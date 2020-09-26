import React,{useEffect} from 'react'
import Nav from './App/Nav'
import Canvas from './App/Canvas'
import ToolProperties from './App/ToolProperties'
import './App.less'
import globalStore from '../Store/StoreFuncs'
import { useSelector } from 'react-redux'
import { v1 } from 'uuid'
const electron = window.require("electron")

function initStorePostRender(){
    let store=globalStore.getState().canvas
    store.layers[0].id=v1()
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.rect(0, 0, store.width, store.height)
    ctx.fillStyle = "white";
    ctx.fill();
    store.layers[0].src=canvas.toDataURL()
    canvas.remove()
    globalStore.setStore({dpi:window.devicePixelRatio,layers:store.layers})
}
function App(){
    const store = useSelector(store => store)
    const theme=store.settings.theme
    useEffect(()=>{
        console.log("refresh in app")
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