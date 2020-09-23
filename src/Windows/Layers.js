import React, { useEffect, useContext } from 'react'
import './Layers.less'
import { VscChromeClose } from 'react-icons/vsc'
import { AiFillFolderAdd, AiFillFolderOpen, AiFillFolder, AiTwotoneEye } from 'react-icons/ai'
import { BiNote } from 'react-icons/bi'
import { ImBin2, ImEye } from 'react-icons/im'
import { MdVisibility, MdVisibilityOff, MdLock } from 'react-icons/md'
import { RiEye2Fill } from 'react-icons/ri'
import globalStore, { addLayer } from '../Store/StoreFuncs'
import { DragDropContext, Droppable,Draggable } from 'react-beautiful-dnd'
import {useAbuse} from 'use-abuse'
import { v1 } from 'uuid';
import { useSelector } from 'react-redux'

const Layers = () => {
    const store = useSelector(store => store)
    const theme=store.settings.theme
    const layersMap = React.useMemo(() => {
        return store.canvas.layers.map((_, index) => {
            let backwardsIndex=store.canvas.layers.length-1-index
            return <Draggable draggableId={`draggable-${index}`} index={index} key={`draggable-${index}`}> 
            {(provided, snapshot) => (
            <li className={`layer-item`} key={`layer-${store.canvas.layers[backwardsIndex].id}-key`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                <div className={`eye-icon`} onClick={() => {
                    store.canvas.layers[backwardsIndex].visible=!store.canvas.layers[backwardsIndex].visible
                    globalStore.setStore({ layers: store.canvas.layers },'global')
                    }}>
                    {store.canvas.layers[backwardsIndex].visible && <RiEye2Fill/>}
                </div>
                <div className={`preview-name-lock-container ${backwardsIndex === store.canvas.activeLayer ? 'active-layer' : ''}`}>
                    <div className={`canvas-preview ${backwardsIndex === store.canvas.activeLayer ? 'active-preview' : ''}`} key={`preview-${store.canvas.layers[backwardsIndex].id}-key`}
                        onClick={() => globalStore.setStore({ activeLayer: backwardsIndex })}>
                        <div className={`transparent-background-mini`}>
                            <img className={`canvas-preview-img`} src={store.canvas.layers[backwardsIndex].src} />
                        </div>
                    </div>
                    <input type="text" defaultValue={store.canvas.layers[backwardsIndex].name} className={`layer-name`}></input>
                    <div className={`lock-icon`} onClick={() => {
                        store.canvas.layers[backwardsIndex].locked=!store.canvas.layers[backwardsIndex].locked
                        globalStore.setStore({ layers: store.canvas.layers },'global')
                        }}>
                        {store.canvas.layers[backwardsIndex].locked && <MdLock />}
                    </div>
                </div>
            </li>)}
            </Draggable>
        })
    }, [store.canvas.activeLayer, store.canvas.layersCount, store.canvas.layers[store.canvas.activeLayer].src, store.canvas.layers])

    function onDragEnd(res) {
        if (!res.destination || res.destination.index === res.source.index) {
            return;
        }
        let len=store.canvas.layers.length
        let origin=len-1 - res.source.index
        let dest=len-1 - res.destination.index
        let list=[...store.canvas.layers]
        list.splice(dest, 0, list.splice(origin, 1)[0]);//reorder
        let activeLayer=store.canvas.activeLayer
        if( activeLayer==origin)  activeLayer=dest
        else if(origin> activeLayer && dest<activeLayer  || (dest==activeLayer && origin>activeLayer))  activeLayer+=1
        else if(dest>activeLayer && origin< activeLayer || (dest==activeLayer && origin<activeLayer))  activeLayer-=1
        
        globalStore.setStore({layers:list,activeLayer: activeLayer})
    }

    return (
        <>
        <div className={`layers-container ${theme}`}>
            <div className={`layers-nav-dummy-scale`}>
            <nav className={`layers-nav `}>
                <div className={`nav-container`}>
                    <VscChromeClose className={`mini-icon`} />
                </div>
            </nav>
            </div>
            <div className={"layers-options-top-dummy-scale"}>
                <div className={`layers-options-top`}></div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`droppable-area`}>
                    {(provided) => (
                        <ul className={`layers-list`} ref={provided.innerRef} {...provided.droppableProps} style={null}>
                            {layersMap}
                            {provided.placeholder}
                        </ul>)}
                </Droppable>
            </DragDropContext>
            <div className={"layers-options-bottom-dummy-scale"}>
                <div className={`layers-options-bottom`}>
                    <div className={`layers-control`}>
                        <AiFillFolderAdd className={`layers-icon`} />
                        <BiNote className={`layers-icon`} onClick={() => addLayer({ src: null, name: `layer ${store.canvas.layersCount}`, visible: true, locked:false ,id:v1()})} />
                        <ImBin2 className={`layers-icon`} />
                    </div>
                </div>
            </div>
            <div className={`layers-footer-dummy-scale`}>
                <footer className={`layers-footer`}></footer>
            </div>
        </div>
    </>
    )
}

export default Layers
