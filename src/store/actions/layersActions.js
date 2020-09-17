const actionTypes = require('../actionTypes')

const setLayers = (layers) =>{
    return{
        type:actionTypes.SET_LAYERS,
        payload:layers
    }
}

module.exports = {setLayers}
