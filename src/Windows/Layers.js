import React, { useEffect, useContext } from 'react'
import './Layers.less'
import { VscChromeClose } from 'react-icons/vsc'
import { AiFillFolderAdd, AiFillFolderOpen, AiFillFolder, AiTwotoneEye } from 'react-icons/ai'
import { BiNote } from 'react-icons/bi'
import { ImBin2, ImEye } from 'react-icons/im'
import { MdVisibility, MdVisibilityOff, MdLock } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { RiEye2Fill } from 'react-icons/ri'
import globalStore, { addLayer } from '../Store'
const Layers = () => {
    const store = useSelector(store => store.canvasStore)
    const layersMap = React.useMemo(() => {
        return store.layers.map((_, index) => {
            return <li className={`layer-item`} key={`layer-item-${index}`} >
                <RiEye2Fill className={`eye-icon`} />
                <div className={`preview-name-lock-container ${index === store.activeLayer ? 'active-layer' : ''}`}
                    onClick={()=>globalStore.dispatch({type:'SET_ACTIVE_LAYER',payload:index})}>
                    <div className={`canvas-preview ${index === store.activeLayer ? 'active-preview' : ''}`}>
                        <div className={`transparent-background-mini`}>
                            <img className={`canvas-preview-img`} src={store.layers[index].src} />
                        </div>
                    </div>
                    <input type="text" defaultValue={store.layers[index].name} className={`layer-name`}></input>
                    <MdLock className={`lock-icon`} />
                </div>
            </li>
        }).reverse()
    }, [store.activeLayer, store.layersCount, store.layers[store.activeLayer].src])
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
                    {layersMap}

                </ul>
                <div className={`layers-options-bottom`}>
                    <div className={`layers-control`}>
                        <AiFillFolderAdd className={`layers-icon`} />
                        <BiNote className={`layers-icon`} onClick={() => addLayer({ src: null, name: `layer ${store.layersCount}`, visible: true })} />
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
