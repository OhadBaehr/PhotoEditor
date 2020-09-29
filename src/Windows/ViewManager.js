import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'
import App from './App';
import Layers from './Layers';
import Tools from './Tools';
import ColorPicker from './ColorPicker'
class ViewManager extends Component {


    static Views = () => {
        return {
            App: <App/>,
            Layers: <Layers/>,
            Tools: <Tools/>,
            ColorPicker: <ColorPicker/>
        }
    }

    static View(props) {
        let name = props.location.search.substr(1);
        let view = ViewManager.Views()[name];
        if (view == null)
            throw new Error("View '" + name + "' is undefined");
        return view;
    }

    render() {
        return (
            <Router>
                <div>
                    <Route path='/' component={ViewManager.View}/>
                </div>
            </Router>
        );
    }
}

export default ViewManager
