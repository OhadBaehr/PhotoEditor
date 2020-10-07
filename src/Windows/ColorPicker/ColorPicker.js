import React from 'react'
import './ColorPicker.less'
import globalStore from '../../Store/StoreFuncs'
import { TinyColor } from '@ctrl/tinycolor';
import { ImEyedropper } from 'react-icons/im';
import { useAbuse } from 'use-abuse'
import validator from 'validator'


function input_range(value, min, max, prev = null) {
    if (value === '')
        return 0
    if (validator.isInt(value, { min: min, max: max }))
        return parseInt(value, 10)
    else if (validator.isInt(value) && value > max) return prev + 1 < max ? prev + 1 : max
    return prev
}

var Picker = function (options) {
    /* convert to RGBA */
    this.prevTimeout = null
    this.mouse_move = function (e, element, slider, transition, callback) {
        let rect = element.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        if (this.sliders[element.id].down) {
            let slider_info = this.sliders[element.id];
            if (transition) slider.style.transition = "0.22s";
            else slider.style.transition = "none";
            if (!slider_info.vertical) {
                x = Math.min(Math.max(x - slider.offsetWidth / 2, -(slider.offsetWidth / 2)), element.offsetWidth - slider.offsetWidth / 2 - 2);
                let left = 3 + Math.min(x,element.offsetWidth - (slider.offsetWidth - 2) / 2 - 6);
                slider.style.left = left + 'px';
            }
            if (!slider_info.horizontal) {
                y = Math.min(Math.max(y - slider.offsetHeight / 2, -(slider.offsetHeight / 2)), element.offsetHeight - slider.offsetHeight / 2 - 2);
                let top = 3 + Math.min(y,element.offsetHeight - (slider.offsetHeight - 2) / 2 - 6);
                slider.style.top = top + 'px';
            }
            callback(element, x + slider.offsetWidth / 2, y + slider.offsetHeight / 2)
            if (transition) {
                clearTimeout(this.prevTimeout);
                this.prevTimeout = setTimeout(function () {
                    slider.style.transition = "none";
                }, 220);
            }
        }
    },
        this.sliders = {
            'picker_value': {
                down: false
            },
            'picker_hue': {
                down: false,
                vertical: true
            },
            'picker_opacity': {
                down: false,
                vertical: true
            },
        };
    this.colour = this.color = {
        hue: 0,
        saturation: 1,
        value: 1,
        alpha: 1,
        /* convert to HSL */
        hsl: function () {
            return new TinyColor(`hsv(${this.hue},${this.saturation},${this.value})`)
        },

        /* convert to HSLA */

        hsla: function () {
            return new TinyColor(`hsva(${this.hue},${this.saturation},${this.value},${this.alpha})`)
        },

        /* convert to RGB */
        rgb: function () {
            return new TinyColor(`hsv(${this.hue},${this.saturation},${this.value})`)
        },

        rgba: function () {
            return new TinyColor(`hsva(${this.hue},${this.saturation},${this.value},${this.alpha})`)
        },

        /* convert to hex */
        hex: function () {
            return new TinyColor(`hsva(${this.hue},${this.saturation},${this.value},${this.alpha})`)
        }
    };
};


const ColorPicker = (props) => {
    const [state, setState] = useAbuse({ R: 255, G: 0, B: 0, A: 100 })
    const picker_value_ref = React.useRef(null)
    const picker_hue_ref = React.useRef(null)
    const picker_opacity_ref = React.useRef(null)

    const picker_value_indicator_ref = React.useRef(null)
    const picker_hue_indicator_ref = React.useRef(null)
    const picker_opacity_indicator_ref = React.useRef(null)


    let picker_value = null
    let picker_hue = null
    let picker_opacity = null

    let picker_value_indicator = null
    let picker_hue_indicator = null
    let picker_opacity_indicator = null




    const picker = new Picker();
    function update_picker_value(element, x, y) {
        picker.color.saturation = x / (element.offsetWidth - 2);
        picker.color.value = 1 - y / (element.offsetHeight - 2);
        update_opacity_slider();
        update_sample();
        update_color_slider();
    };

    function update_picker_hue(element, x, y) {
        picker.color.hue = (1 - y / (element.offsetHeight - 2)) * 360;
        update_selector_hue();
        update_sample();
        update_hue_slider();
    };

    function update_picker_opacity(element, x, y) {
        picker.color.alpha = 1 - y / (element.offsetHeight - 2);
        setState({ A: picker.color.alpha*100 })
        let colors = globalStore.getState().tools.colors
        let newColor=new TinyColor(colors[colors.activeColor])
        colors[colors.activeColor] = newColor.setAlpha(picker.color.alpha).toRgbString()
        globalStore.setStore({ colors: colors })
        update_opacity_slider();
    };

    function update_sample() {
        update_opacity_hue();
        let sample = picker.color.rgba()
        let colors = globalStore.getState().tools.colors
        colors[colors.activeColor] = sample.toRgbString()
        globalStore.setStore({ colors: colors })
        setState({ R: Math.floor(sample.r), G: Math.floor(sample.g), B: Math.floor(sample.b) })
    };

    function update_picker_color_rgba(inputColor) {
        let newColor = new TinyColor({ r: inputColor.R, g: inputColor.G, b: inputColor.B, a: inputColor.A / 100 })
        let hsvaColor = newColor.toHsv();
        picker.color.hue = hsvaColor.h
        picker.color.saturation = hsvaColor.s
        picker.color.value = hsvaColor.v
        picker.color.alpha = hsvaColor.a
        let x = 0, y = 0,top=0,left=0
        let colors = globalStore.getState().tools.colors
        colors[colors.activeColor] = newColor.toRgbString()
        globalStore.setStore({ colors: colors })
        let picker_value = picker_value_ref.current, picker_opacity = picker_opacity_ref.current, picker_value_indicator = picker_value_indicator_ref.current,
            picker_hue_indicator = picker_hue_indicator_ref.current, picker_opacity_indicator = picker_opacity_indicator_ref.current, picker_hue = picker_hue_ref.current
        picker_value.style.background = 'hsl(' + picker.color.hue + ', 100%, 50%)';
        picker_opacity.style.background = picker.color.rgb().toRgbString()
        picker_value_indicator.style.background = picker.color.rgba().toRgbString()
        picker_hue_indicator.style.background = 'hsl(' + picker.color.hue + ', 100%, 50%)';
        picker_opacity_indicator.style.background = picker.color.rgba().toRgbString()
        picker_value_indicator.style.transition = "0.22s";
        y = (1 - picker.color.value) * (picker_value.offsetHeight - 2) - picker_value_indicator.offsetHeight / 2
        top=3 + Math.min(y,picker_value.offsetHeight - (picker_value_indicator.offsetHeight - 2) / 2 - 6);
        picker_value_indicator.style.top = top + 'px';
        x = picker.color.saturation * (picker_value.offsetWidth - 2) - picker_value_indicator.offsetWidth / 2
        left=3 + Math.min(x,picker_value.offsetWidth - (picker_value_indicator.offsetWidth - 2) / 2 - 6);
        picker_value_indicator.style.left = left + 'px';


        picker_hue_indicator.style.transition = "0.22s";
        y=(1 -picker.color.hue/360) * (picker_hue.offsetHeight - 2) -picker_hue_indicator.offsetHeight / 2
        top=3 + Math.min(y,picker_hue.offsetHeight - (picker_hue_indicator.offsetHeight - 2) / 2 - 6);
        picker_hue_indicator.style.top = top + 'px';

        picker_opacity_indicator.style.transition = "0.22s";
        y=(1 - picker.color.alpha)* (picker_opacity.offsetHeight - 2) -picker_opacity_indicator.offsetHeight / 2
        top=3 + Math.min(y,picker_opacity.offsetHeight - (picker_opacity_indicator.offsetHeight - 2) / 2 - 6);
        picker_opacity_indicator.style.top = top + 'px';
        // y = Math.min(Math.max(y - slider.offsetHeight / 2, -(slider.offsetHeight / 2)), element.offsetHeight - slider.offsetHeight / 2 - 2) + slider.offsetHeight / 2

    };

    function update_selector_hue() {
        picker_value.style.background = 'hsl(' + picker.color.hue + ', 100%, 50%)';
        update_color_slider();
        update_opacity_slider();
    };

    function update_opacity_hue() {
        picker_opacity.style.background = picker.color.rgb().toRgbString()
    };

    function update_color_slider() {
        picker_value_indicator.style.background = picker.color.rgba().toRgbString()
    };

    function update_hue_slider() {
        picker_hue_indicator.style.background = 'hsl(' + picker.color.hue + ', 100%, 50%)';
    };

    function update_opacity_slider() {
        picker_opacity_indicator.style.background = picker.color.rgba().toRgbString()
    };


    React.useEffect(() => {
        picker_value = picker_value_ref.current
        picker_hue = picker_hue_ref.current
        picker_opacity = picker_opacity_ref.current

        picker_value_indicator = picker_value_indicator_ref.current
        picker_hue_indicator = picker_hue_indicator_ref.current
        picker_opacity_indicator = picker_opacity_indicator_ref.current



        let preTimeOut = null
        let wait = false
        window.onmousemove = function onMouseMove_sample(e) {
            if (!wait) {
                e.preventDefault();
                if (picker.sliders['picker_value'].down) picker.mouse_move(e, picker_value, picker_value_indicator, false, update_picker_value);
                if (picker.sliders['picker_hue'].down) picker.mouse_move(e, picker_hue, picker_hue_indicator, false, update_picker_hue);
                if (picker.sliders['picker_opacity'].down) picker.mouse_move(e, picker_opacity, picker_opacity_indicator, false, update_picker_opacity);
                // stop any further events
                wait = true;
                clearTimeout(preTimeOut);
                // after a fraction of a second, allow events again
                preTimeOut = setTimeout(function () {
                    wait = false;
                }, 4);
            }
        };


        picker_value.onmousedown = function onMouseDown_value(e) {
            e.preventDefault();
            picker.sliders['picker_value'].down = true;
            picker.mouse_move(e, picker_value, picker_value_indicator, true, update_picker_value);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 50);
        };



        picker_hue.onmousedown = function onMouseDown_hue(e) {
            e.preventDefault();
            picker.sliders['picker_hue'].down = true;
            picker.mouse_move(e, picker_hue, picker_hue_indicator, true, update_picker_hue);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 50);
        };


        picker_opacity.onmousedown = function onMouseDown_opacity(e) {
            e.preventDefault();
            picker.sliders['picker_opacity'].down = true;
            picker.mouse_move(e, picker_opacity, picker_opacity_indicator, true, update_picker_opacity);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 50);
        };


        window.onmouseup = function disable_all_sliders() {
            for (let name in picker.sliders) {
                picker.sliders[name].down = false;
            }
        };

        return () => {
            window.removeEventListener('onmouseup', disable_all_sliders);
            picker_opacity.removeEventListener('onmousedown', onMouseDown_opacity)
            picker_hue.removeEventListener('onmousedown', onMouseDown_hue)
            picker_value.removeEventListener('onmousedown', onMouseDown_value)
            window.removeEventListener('onmousemove', onMouseMove_sample);
        }
    }, [])
    const PickerBox = React.useCallback(() => {
        return (
            <div className={`picker-hue-value-opacity`}>
                <div id="picker_opacity" ref={picker_opacity_ref}>
                    <div id="picker_opacity_fade"></div>
                    <div className="picker_opacity_indicator" ref={picker_opacity_indicator_ref}></div>
                </div>
                <div id="picker_value" ref={picker_value_ref}>
                    <div id="picker_saturation"></div>
                    <div id="picker_lightness"></div>
                    <div className="picker_value_indicator" ref={picker_value_indicator_ref}></div>
                </div>
                <div id="picker_hue" ref={picker_hue_ref}>
                    <div className="picker_hue_indicator" ref={picker_hue_indicator_ref}></div>
                </div>
            </div>
        )
    }, [])
    return (
        <div className={`picker_container ${props.child ? 'picker-no-upper-border-radius' : ''}`}>
            {PickerBox()}
            <div className="picker-color-inputs">
                <ImEyedropper className={`tools-icon`} />
                R<input value={state.R} onChange={(e) => { let value = input_range(e.target.value, 0, 255, state.R); setState({ R: value }); update_picker_color_rgba({R:value,G:state.G,B:state.B,A:state.A}) }} className={`picker-input-field`}></input>
                G<input value={state.G} onChange={(e) => { let value = input_range(e.target.value, 0, 255, state.G); setState({ G: value }); update_picker_color_rgba({R:state.R,G:value,B:state.B,A:state.A}) }} className={`picker-input-field`}></input>
                B<input value={state.B} onChange={(e) => { let value = input_range(e.target.value, 0, 255, state.B); setState({ B: value }); update_picker_color_rgba({R:state.R,G:state.G,B:value,A:state.A}) }} className={`picker-input-field`}></input>
                A<input value={state.A} onChange={(e) => { let value = input_range(e.target.value, 0, 100, state.A); setState({ A: value }); update_picker_color_rgba({R:state.R,G:state.G,B:state.B,A:value}) }} className={`picker-input-field`}></input>
            </div>
        </div>
    )
}


export default ColorPicker