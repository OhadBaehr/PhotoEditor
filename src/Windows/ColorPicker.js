import React from 'react'
import './ColorPicker.less'
import globalStore from '../Store/StoreFuncs'
import { TinyColor } from '@ctrl/tinycolor';
var Picker = function (options) {
    /* convert to RGBA */
    this.prevTimeout = null
    this.mouse_move = function (e, element, slider, transition, callback) {
        var rect = element.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        if (this.sliders[element.id].down) {
            var slider_info = this.sliders[element.id];
            if (transition) slider.style.transition = "0.22s";
            else slider.style.transition = "none";
            if (!slider_info.vertical) {
                x = Math.min(Math.max(x - slider.offsetWidth / 2, -(slider.offsetWidth / 2)), element.offsetWidth - slider.offsetWidth / 2 - 2);
                slider.style.left = x + 'px';
            }
            if (!slider_info.horizontal) {
                y = Math.min(Math.max(y - slider.offsetHeight / 2, -(slider.offsetHeight / 2)), element.offsetHeight - slider.offsetHeight / 2 - 2);
                slider.style.top = y + 'px';
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
            return new TinyColor(`hsv(${this.hue},${this.saturation},${this.value})`).toHslString()
        },

        /* convert to HSLA */

        hsla: function () {
            return new TinyColor(`hsva(${this.hue},${this.saturation},${this.value},${this.alpha})`).toHslString()
        },

        /* convert to RGB */
        rgb: function () {
            return new TinyColor(`hsv(${this.hue},${this.saturation},${this.value})`).toRgbString()
        },

        rgba: function () {
            return new TinyColor(`hsva(${this.hue},${this.saturation},${this.value},${this.alpha})`).toRgbString()
        },

        /* convert to hex */
        hex: function () {
            return new TinyColor(`hsva(${this.hue},${this.saturation},${this.value},${this.alpha})`).toHexString()
        }
    };
};


const ColorPicker = () => {
    const picker_value_ref =React.useRef(null)
    const picker_hue_ref =React.useRef(null)
    const picker_opacity_ref = React.useRef(null)

    const picker_value_indicator_ref = React.useRef(null)
    const picker_hue_indicator_ref =React.useRef(null)
    const picker_opacity_indicator_ref = React.useRef(null)


    let picker_value = null
    let picker_hue =null
    let picker_opacity = null

    let picker_value_indicator = null
    let picker_hue_indicator =null
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
        picker.color.hue = (1 - y / (element.offsetHeight - 2))*360;
        update_selector_hue();
        update_sample();
        update_hue_slider();
    };

    function update_picker_opacity(element, x, y) {
        picker.color.alpha = 1 - y / (element.offsetHeight - 2);
        update_sample();
        update_opacity_slider();
    };

    function update_sample() {
        update_opacity_hue();
        if (picker.on_change) {
            picker.on_change(picker.color);
        }
        let colors=globalStore.getState().tools.colors
        colors[colors.activeColor]=picker.color.rgba()
        globalStore.setStore({colors})
    };

    function update_selector_hue() {
        picker_value.style.background = 'hsl(' + picker.color.hue + ', 100%, 50%)';
        update_color_slider();
        update_opacity_slider();
    };

    function update_opacity_hue() {
        picker_opacity.style.background = picker.color.rgb()
    };

    function update_color_slider() {
        picker_value_indicator.style.background = picker.color.rgba()
    };

    function update_hue_slider() {
        picker_hue_indicator.style.background = 'hsl(' + picker.color.hue + ', 100%, 50%)';
    };

    function update_opacity_slider() {
        picker_opacity_indicator.style.background = picker.color.rgba()
    };


    React.useEffect(() => {
        picker_value = picker_value_ref.current
        picker_hue = picker_hue_ref.current
        picker_opacity = picker_opacity_ref.current

        picker_value_indicator = picker_value_indicator_ref.current
        picker_hue_indicator =picker_hue_indicator_ref.current
        picker_opacity_indicator = picker_opacity_indicator_ref.current



        var preTimeOut = null
        var wait = false
        window.onmousemove = function (e) {
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


        picker_value.onmousedown = function (e) {
            e.preventDefault();
            picker.sliders['picker_value'].down = true;
            picker.mouse_move(e, picker_value, picker_value_indicator, true, update_picker_value);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 50);
        };



        picker_hue.onmousedown = function (e) {
            e.preventDefault();
            picker.sliders['picker_hue'].down = true;
            picker.mouse_move(e, picker_hue, picker_hue_indicator, true, update_picker_hue);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 50);
        };


        picker_opacity.onmousedown = function (e) {
            e.preventDefault();
            picker.sliders['picker_opacity'].down = true;
            picker.mouse_move(e, picker_opacity, picker_opacity_indicator, true, update_picker_opacity);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 50);
        };


        window.onmouseup = function () {
            for (var name in picker.sliders) {
                picker.sliders[name].down = false;
            }
        };
    },[])
    return (
        <div className="picker_container">
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
        </div>
    )
}


export default ColorPicker