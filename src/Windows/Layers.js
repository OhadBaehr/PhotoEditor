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
import { DragDropContext, Droppable,Draggable } from 'react-beautiful-dnd'
import {useAbuse} from 'use-abuse'
import { v1 } from 'uuid';
const Layers = () => {
    const store = useSelector(store => store.canvasStore)
    const layersMap = React.useMemo(() => {
        return store.layers.map((_, index) => {
            let backwardsIndex=store.layers.length-1-index
            return <Draggable draggableId={`draggable-${index}`} index={index} key={`draggable-${index}`}> 
            {(provided)=>
            <li className={`layer-item`} key={`layer-${store.layers[backwardsIndex].id}-key`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                <RiEye2Fill className={`eye-icon`} />
                <div className={`preview-name-lock-container ${backwardsIndex === store.activeLayer ? 'active-layer' : ''}`}>
                    <div className={`canvas-preview ${backwardsIndex === store.activeLayer ? 'active-preview' : ''}`} key={`preview-${store.layers[backwardsIndex].id}-key`}
                        onClick={() => globalStore.setStore({ activeLayer: backwardsIndex })}>
                        <div className={`transparent-background-mini`}>
                            <img className={`canvas-preview-img`} src={store.layers[backwardsIndex].src} />
                        </div>
                    </div>
                    <input type="text" defaultValue={store.layers[backwardsIndex].name} className={`layer-name`}></input>
                    <MdLock className={`lock-icon`} />
                </div>
            </li>}
            </Draggable>
        })
    }, [store.activeLayer, store.layersCount, store.layers[store.activeLayer].src, store.layers])

    function onDragEnd(res) {
        if (!res.destination || res.destination.index === res.source.index) {
            return;
        }
        globalStore.setStore(prev => {
            let len=prev.layers.length
            let indexA=len-1 - res.source.index
            let indexB=len-1 - res.destination.index
            let list=[...prev.layers]
            list.splice(indexB, 0, list.splice(indexA, 1)[0]);//reorder
            return {layers:list,activeLayer:indexA==prev.activeLayer?indexB:prev.activeLayer}
        })
    }

    return (
        <>
        <div className={`layers-container`}>
            <nav className="layers-nav">
                <div className={`nav-container`}>
                    <VscChromeClose className={`mini-icon`} />
                </div>
            </nav>

            <div className={`layers-options-top`}></div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`droppable-area`}>
                    {(provided) => 
                    <ul className={`layers-list`} ref={provided.innerRef} {...provided.droppableProps}>
                        {layersMap}
                        {/* {provided.placeholder} */}
                    </ul>}
                </Droppable>
            </DragDropContext>
            <div className={`layers-options-bottom`}>
                <div className={`layers-control`}>
                    <AiFillFolderAdd className={`layers-icon`} />
                    <BiNote className={`layers-icon`} onClick={() => addLayer({ src: null, name: `layer ${store.layersCount}`, visible: true ,id:v1()})} />
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
