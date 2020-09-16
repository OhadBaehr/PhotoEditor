import React, { useEffect,useContext } from 'react'
import './Layers.less'
import {VscChromeClose} from 'react-icons/vsc'
import {AiFillFolderAdd,AiFillFolderOpen,AiFillFolder} from 'react-icons/ai'
import {BiNote} from 'react-icons/bi'
import {ImBin2} from 'react-icons/im'
import {MdVisibility,MdVisibilityOff} from 'react-icons/md'
import { StoreContext } from '../Store'
const Layers = () => {
    const store = useContext(StoreContext)
    useEffect(()=>{
    },[store.Layers[store.ActiveLayer].src])
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
                        
                        <img className={`canvas-preview`} src={store.Layers[0].src}/>
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