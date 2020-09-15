import React from 'react'
import './Layers.less'
import {VscChromeClose} from 'react-icons/vsc'
import {AiFillFolderAdd,AiFillFolderOpen,AiFillFolder} from 'react-icons/ai'
import {BiNote} from 'react-icons/bi'
import {ImBin2} from 'react-icons/im'
const Layers = () => {
    return(
        <>
        <nav className="layers-nav">
            <div className={`nav-container`}>
                <VscChromeClose className={`mini-icon`}/>
            </div>
        </nav>
        <div className={`layers-container`}>
             <div className={`layers-options-top`}></div>
            <div className={`layers-list`}>
            </div>
            <div className={`layers-options-bottom`}>
                <div className={`layers-control`}>
                    <AiFillFolderAdd className={`layers-icon`}/>
                    <BiNote className={`layers-icon`}/>
                    <ImBin2 className={`layers-icon`}/>
                </div>
            </div>
        </div>
        </>
    )
}

export default Layers