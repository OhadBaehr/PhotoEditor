import React from 'react'
import './ToolProperties.less'
import { useSelector } from 'react-redux'

const ToolProperties = ()=>{
    const store = useSelector(store => store)
    const theme=store.settings.theme
    return(
        <div className={`tool-properties-container ${theme}`}>
            <div className={`options-bar`}></div>
        </div>
    )
}

export default ToolProperties