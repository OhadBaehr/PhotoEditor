import React, { useEffect,useContext } from 'react'
import './Layers.less'
import {VscChromeClose} from 'react-icons/vsc'
import {AiFillFolderAdd,AiFillFolderOpen,AiFillFolder} from 'react-icons/ai'
import {BiNote} from 'react-icons/bi'
import {ImBin2} from 'react-icons/im'
import {MdVisibility,MdVisibilityOff} from 'react-icons/md'
import {useAbuse} from 'use-abuse'
const electron = window.require("electron")
const Layers = () => {
    const [state,setState]= useAbuse({Layers:0})
    useEffect(()=>{
        electron.ipcRenderer.on("BLA", (_,response)=>{
            setState({Layers:response.message})
            console.log(response)
        })
    },[state.Layers])
    return(
        <>
        <div className={`layers-container`}>
            <nav className="layers-nav">
                <div className={`nav-container`}>
                    <VscChromeClose className={`mini-icon`}/>
                </div>
            </nav>

             <div className={`layers-options-top`}></div>
            <div className={`layers-list`}>
                <ul>
                    <li>
                        <MdVisibility/>
                        <div className={`transparent-background`} style={{ width: 20, height: 20 }}>
                        <img className={`canvas-preview`} src={state.Layers[0]}/>
                        </div>
                    </li>
                </ul>
            </div>
            <div className={`layers-options-bottom`}>
                <div className={`layers-control`}>
                    <AiFillFolderAdd className={`layers-icon`}/>
                    <BiNote className={`layers-icon`}/>
                    <ImBin2 className={`layers-icon`}/>
                </div>
            </div>

            <div className={`dummy-scale`}>
                <footer className={`layers-footer`}></footer>
            </div>
        </div>
        </>
    )
}

export default Layers