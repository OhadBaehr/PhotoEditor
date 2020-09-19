import React, { useEffect, useContext } from 'react'
import './Layers.less'
import { VscChromeClose } from 'react-icons/vsc'
import { AiFillFolderAdd, AiFillFolderOpen, AiFillFolder, AiTwotoneEye } from 'react-icons/ai'
import { BiNote } from 'react-icons/bi'
import { ImBin2, ImEye } from 'react-icons/im'
import { MdVisibility, MdVisibilityOff,MdLock } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { RiEye2Fill } from 'react-icons/ri'
const Layers = () => {
    const store = useSelector(store => store.canvasStore)
    return (
        <>
            <div className={`layers-container`}>
                <nav className="layers-nav">
                    <div className={`nav-container`}>
                        <VscChromeClose className={`mini-icon`} />
                    </div>
                </nav>

                <div className={`layers-options-top`}></div>
                <ul className={`layers-list`}>
                    <li className={`layer-item`}>
                        <RiEye2Fill className={`eye-icon`} />
                        <div className={`transparent-background-mini`}>
                            <img className={`canvas-preview`} src={store.layers[0].src} />
                        </div>
                        <input type="text" value={store.layers[0].name} className={`layer-name`}></input>
                        <MdLock className={`lock-icon`}/>
                    </li>
                </ul>
                <div className={`layers-options-bottom`}>
                    <div className={`layers-control`}>
                        <AiFillFolderAdd className={`layers-icon`} />
                        <BiNote className={`layers-icon`} />
                        <ImBin2 className={`layers-icon`} />
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
