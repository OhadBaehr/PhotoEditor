import React, { useEffect, useContext } from 'react'
import './Layers.less'
import { VscChromeClose } from 'react-icons/vsc'
import { AiFillFolderAdd, AiFillFolderOpen, AiFillFolder, AiTwotoneEye } from 'react-icons/ai'
import { BiNote } from 'react-icons/bi'
import { ImBin2, ImEye } from 'react-icons/im'
import { MdVisibility, MdVisibilityOff, MdLock } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { RiEye2Fill } from 'react-icons/ri'
import globalStore, { addLayer } from '../Store/StoreFuncs'
import { DragDropContext, Droppable,Draggable } from 'react-beautiful-dnd'
import {useAbuse} from 'use-abuse'
import { v1 } from 'uuid';



const Layers = () => {
    const store = useSelector(store => store.canvasStore)
    const layersMap = React.useMemo(() => {
        console.log("bla")
        return store.layers.map((_, index) => {
            let backwardsIndex=store.layers.length-1-index
            return <Draggable draggableId={`draggable-${index}`} index={index} key={`draggable-${index}`}> 
            {(provided, snapshot) => (
            <li className={`layer-item`} key={`layer-${store.layers[backwardsIndex].id}-key`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
            isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
            style={{...provided.draggableProps.style,height:30/*fix jitter*/}}>
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
            </li>)}
            </Draggable>
        })
    }, [store.activeLayer, store.layersCount, store.layers[store.activeLayer].src, store.layers])

    function onDragEnd(res) {
        if (!res.destination || res.destination.index === res.source.index) {
            return;
        }
        let len=store.layers.length
        let origin=len-1 - res.source.index
        let dest=len-1 - res.destination.index
        let list=[...store.layers]
        list.splice(dest, 0, list.splice(origin, 1)[0]);//reorder
        if( store.activeLayer==origin)  store.activeLayer=dest
        else if(origin> store.activeLayer && dest< store.activeLayer || (dest==store.activeLayer && origin>store.activeLayer))  store.activeLayer+=1
        else if(dest> store.activeLayer && origin< store.activeLayer || (dest==store.activeLayer && origin<store.activeLayer))  store.activeLayer-=1
        
        globalStore.setStore({layers:list,activeLayer: store.activeLayer})
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
                    {(provided, snapshot) => (
                        <ul className={`layers-list`} ref={provided.innerRef} {...provided.droppableProps} style={null}>
                            {layersMap}
                            {provided.placeholder}
                        </ul>)}
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
