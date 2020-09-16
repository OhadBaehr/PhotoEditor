import React,{useState,useCallback} from 'react';
import {useAbuse} from 'use-abuse'
const StoreContext = React.createContext();//save all the current layers

const StoreWrapper = (props) =>{
    var canvas=document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.rect(0, 0, 400, 400);
    ctx.fill();
    const [state, setState] = useState({
        Layers:[canvas.toDataURL()],
        ActiveLayer:0
    })
    canvas.remove()
    // const [ActiveLayer,setActiveLayerAlpha]= useState(0)

    // const setLayers = (value)=>{
    //     console.log(Layers,value)
    //     setLayersAlpha(value)
    //     console.log(Layers,value)
    // }
    const setContext = useCallback(
        updates => {
          setState({ ...state, ...updates })
        },
        [state, setState],
        console.log(state)
      )
    const getContextValue = useCallback(
        () => ({
          ...state,
          setContext,
        }),
        [state, setContext],
    )
    return(
        <StoreContext.Provider value={getContextValue()}>
            {props.children}
        </StoreContext.Provider>
    )
}

export {StoreContext}
export default StoreWrapper;