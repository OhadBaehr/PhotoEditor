import React from 'react'
import ColorPicker from './ColorPicker/ColorPicker'
import './Swatches.less'
import { VscChromeClose } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
const Swatches = ()=>{
    const store = useSelector(store => store)
    const theme=store.settings.theme
    return(
        <div className={`swatches-container ${theme}`}>
            <div className={`swatches-nav-dummy-scale`}>
            <nav className={`swatches-nav`}>
                <div className={`nav-container`}>
                    <VscChromeClose className={`mini-icon`} />
                </div>
            </nav>
            </div>
            <ColorPicker child={true}/>
        </div>
    )
}


export default Swatches