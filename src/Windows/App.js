import React,{useEffect} from 'react'
import Nav from './App/Nav'
import Canvas from './App/Canvas'
import ToolProperties from './App/ToolProperties'
import './App.less'
import globalStore from '../Store'

function initStorePostRender(){
    globalStore.dispatch({type:"SET_DPI",payload: window.devicePixelRatio})
}
function App(){
    useEffect(()=>{
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