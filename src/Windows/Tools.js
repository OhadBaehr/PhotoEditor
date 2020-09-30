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
import { useSelector } from 'react-redux'
const Tools = () => {
    const store = useSelector(store => store)
    const theme=store.settings.theme
    return(
        <div className={`tools-container ${theme}`}>
        <div className="tools-nav drag-scale-fix">
            <div className={`nav-container`}>
                <VscChromeClose className={`mini-icon`}/>
            </div>
        </div>
        <div className={'tools-icons-container'}>
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
                {console.log(store.tools.colors.primary)}
                <div className={`primary-color`} style={{background:store.tools.colors.primary}}></div>
                <div className={`secondary-color`} style={{background:store.tools.colors.secondary}}></div>
            </div>
        </div>
        </div>
    )
}

export default Tools