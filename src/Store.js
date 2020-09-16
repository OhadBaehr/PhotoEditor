import React,{useState} from 'react';
import {useAbuse} from 'use-abuse'
const StoreContext = React.createContext();//save all the current layers

const StoreWrapper = (props) =>{
    var canvas=document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.rect(0, 0, 400, 400);
    ctx.fill();
    const [Layers, setLayersAlpha] = useState([canvas.toDataURL()])
    canvas.remove()
    const [ActiveLayer,setActiveLayerAlpha]= useState(0)

    const setLayers = (value)=>{
        console.log(Layers,value)
        setLayersAlpha(value)
        console.log(Layers,value)
    }

    return(
        <StoreContext.Provider value={{Layers,setLayers,ActiveLayer,setActiveLayerAlpha}}>
            {props.children}
        </StoreContext.Provider>
    )
}

export {StoreContext}
export default StoreWrapper;