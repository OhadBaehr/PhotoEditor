import React from 'react'
import './Tools.less'
import {BsArrowsMove} from 'react-icons/bs';
import { BiScreenshot,BiSelection,BiCrop,BiEraser,BiRotateLeft,BiRotateRight} from 'react-icons/bi';
import {ImEyedropper} from 'react-icons/im';
import {IoIosBrush,IoMdColorWand} from 'react-icons/io'
import {FaStamp} from 'react-icons/fa'
import {CgColorBucket,CgBandAid} from 'react-icons/cg'
const Tools = () => {
    return(
        <>
        <div className="tools-nav drag-scale-fix">
            <div className={`nav-container`}>
                
            </div>
        </div>
        <div className={'tools-container'}>
            <div className={`icons-container`}>
                <BsArrowsMove className={`tools-icon`}/>
                <BiScreenshot className={`tools-icon`}/>
                <CgBandAid className={`tools-icon`}/>
                <IoMdColorWand className={`tools-icon`}/>
                <ImEyedropper className={`tools-icon`}/>
                <BiEraser className={`tools-icon`}/>
                <IoIosBrush className={`tools-icon`}/>
                <FaStamp className={`tools-icon`}/>
                <BsArrowsMove className={`tools-icon`}/>
                <CgColorBucket className={`tools-icon`}/>
            </div>
        </div>
        </>
    )
}

export default Tools