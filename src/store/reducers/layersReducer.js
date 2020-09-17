const actionTypes = require('../actionTypes')
const {produce} = require('immer')
const initialState = {
    layers: [],
    ActiveLayer:0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LAYERS:
            return setLayers(state,action.payload);
        default:
            return state

    }
}



const setLayers =(state,payload)=>{
    //console.log(payload.Layers)
    const nextState = produce(state,draftState=>{
        draftState.layers[0] = payload.Layers
    })
    return{
        ...state,
        layers: nextState.layers
    }
}
module.exports = {reducer}
