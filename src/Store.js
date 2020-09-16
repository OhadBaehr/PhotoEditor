import React,{useState} from 'react';
import {useAbuse} from 'use-abuse'
const StoreContext = React.createContext();//save all the current layers

const StoreWrapper = (props) =>{
    var canvas=document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.rect(0, 0, 400, 400);
    ctx.fill();
    var img = new Image();
    img.src = canvas.toDataURL()
    canvas.remove()
    const [Layers, setLayers] = useState([img])
    const [ActiveLayer,setActiveLayer]=useState(0)

    const store = {
        Layers, setLayers,
        ActiveLayer,setActiveLayer,
    }
    return(
        <StoreContext.Provider value={store}>
            {props.children}
        </StoreContext.Provider>
    )
}

export {StoreContext}
export default StoreWrapper;