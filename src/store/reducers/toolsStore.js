const initialState = {
    pencil: {
        size: 10,
    },
    colors:{
        primary:"black",
        secondary:"white",
        activeColor:'primary'
    }
}

const tools = (state = initialState, action) => {
    const {payload} = action
    return {
        ...state,
        ...(typeof payload === "function" ? payload(state) : payload)
    }
}


module.exports = { tools }
