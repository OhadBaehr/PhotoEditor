const initialState = {
    theme: 'dark'
}

const settings = (state = initialState, action) => {
    const {payload} = action
    return {
        ...state,
        ...(typeof payload === "function" ? payload(state) : payload)
    }
}


module.exports = { settings }
