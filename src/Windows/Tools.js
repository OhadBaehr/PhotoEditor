import React from 'react'
import './Tools.less'
import {BsArrowsMove,BsArrow90DegLeft} from 'react-icons/bs';
import { BiScreenshot,BiFontFamily,BiSelection,BiCrop,BiEraser,BiRotateLeft,BiRotateRight,BiCircle} from 'react-icons/bi';
import {ImEyedropper} from 'react-icons/im';
import {IoIosBrush,IoMdColorWand} from 'react-icons/io'
import {FaStamp} from 'react-icons/fa'
import {CgColorBucket,CgBandAid} from 'react-icons/cg'
import {VscChromeClose} from 'react-icons/vsc'
import {TiZoom} from 'react-icons/ti'
const Tools = () => {
    return(
        <>
        <div className="tools-nav drag-scale-fix">
            <div className={`nav-container`}>
                <VscChromeClose className={`mini-icon`}/>
            </div>
        </div>
        <div className={'tools-container'}>
            <div className={`icons-container`}>
                <IoMdColorWand className={`tools-icon`}/>
                <BiScreenshot className={`tools-icon`}/>
                <BiEraser className={`tools-icon`}/>
                <IoIosBrush className={`tools-icon`}/>
                
                <ImEyedropper className={`tools-icon`}/>
                <CgColorBucket className={`tools-icon`}/>
               
                <CgBandAid className={`tools-icon`}/>
                <FaStamp className={`tools-icon`}/>

                <BiFontFamily className={`tools-icon`}/>
                <BiCircle className={`tools-icon`}/>
                <BsArrowsMove className={`tools-icon`}/>
                <TiZoom  className={`tools-icon`}/>
            </div>
            <div className={`stroke-colors-container`}>
                <BsArrow90DegLeft className={`arrow90deg`}/>
                <div className={`primary-color`}></div>
                <div className={`secondary-color`}></div>
            </div>
        </div>
        </>
    )
}

export default Tools