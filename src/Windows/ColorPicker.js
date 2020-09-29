import React from 'react'
import './ColorPicker.less'


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
            y = Math.min(Math.max(y - slider.offsetHeight / 2, -(slider.offsetHeight / 2)), element.offsetHeight - slider.offsetHeight / 2 - 2);
            slider.style.top = y + 'px';
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
            'picker_color': {
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
            var h = this.hue;
            var l = (2 - this.saturation) * this.value;
            var s = this.saturation * this.value;
            if (l !== 0) s /= l <= 1 ? l : 2 - l;
            l /= 2;

            s *= 100;
            l *= 100;
            if (Number.isNaN(h)) h = 0
            if (Number.isNaN(s)) s = 0
            if (Number.isNaN(l)) l = 0
            return {
                h: h,
                s: s,
                l: l,
                toString: function () {
                    return 'hsl(' + this.h + ', ' + this.s + '%, ' + this.l + '%)';
                }
            };
        },

        /* convert to HSLA */

        hsla: function () {
            var hsl = this.hsl();
            hsl.a = this.alpha;
            hsl.toString = function () {
                return 'hsla(' + this.h + ', ' + this.s + '%, ' + this.l + '%, ' + this.a + ')';
            };
            return hsl;
        },

        /* convert to RGB */
        rgb: function () {
            var r, g, b;

            var h = this.hue;
            var s = this.saturation;
            var v = this.value;

            h /= 60;

            var i = Math.floor(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

            r = [v, q, p, p, t, v][i];
            g = [t, v, v, q, p, p][i];
            b = [p, p, t, v, v, q][i];

            return {
                r: Math.floor(r * 255),
                g: Math.floor(g * 255),
                b: Math.floor(b * 255),
                toString: function () {

                    return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
                }
            };
        },

        rgba: function () {
            var rgb = this.rgb()
            rgb.a = this.alpha;
            rgb.toString = function () {
                return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
            };
            return rgb;
        },

        /* convert to hex */
        hex: function () {
            var rgb = this.rgb();
            function to_hex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? '0' + hex : hex;
            }
            return {
                r: to_hex(rgb.r),
                g: to_hex(rgb.g),
                b: to_hex(rgb.b),
                toString: function () {
                    return '#' + this.r + this.g + this.b;
                }
            }
        }
    };
};


const ColorPicker = () => {
    const sample_ref = React.useRef(null)
    const picker_color_ref =React.useRef(null)
    const picker_hue_ref =React.useRef(null)
    const picker_opacity_ref = React.useRef(null)

    const picker_color_indicator_ref = React.useRef(null)
    const picker_hue_indicator_ref =React.useRef(null)
    const picker_opacity_indicator_ref = React.useRef(null)


    let sample =null
    let picker_color = null
    let picker_hue =null
    let picker_opacity = null

    let picker_color_indicator = null
    let picker_hue_indicator =null
    let picker_opacity_indicator = null




    const picker = new Picker();
    function update_picker_color(element, x, y) {
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
        update_sample();
        update_opacity_slider();
    };

    function update_sample() {
        sample.style.background = picker.color.rgba().toString();
        update_opacity_hue();
        if (picker.on_change) {
            picker.on_change(picker.color);
        }
    };

    function update_selector_hue() {
        picker_color.style.background = 'hsl(' + picker.color.hue + ', 100%, 50%)';
        update_color_slider();
        update_opacity_slider();
    };

    function update_opacity_hue() {
        picker_opacity.style.background = picker.color.rgba().toString();
    };

    function update_color_slider() {
        picker_color_indicator.style.background = picker.color.rgba().toString();
    };

    function update_hue_slider() {
        picker_hue_indicator.style.background = 'hsl(' + picker.color.hue + ', 100%, 50%)';
    };

    function update_opacity_slider() {
        var slider = document.querySelector('#picker_opacity .picker_opacity_indicator');
        slider.style.background = picker.color.rgba().toString();
    };


    React.useEffect(() => {
        sample =sample_ref.current
        picker_color = picker_color_ref.current
        picker_hue = picker_hue_ref.current
        picker_opacity = picker_opacity_ref.current

        picker_color_indicator = picker_color_indicator_ref.current
        picker_hue_indicator =picker_hue_indicator_ref.current
        picker_opacity_indicator = picker_opacity_indicator_ref.current



        var preTimeOut = null
        var wait = false
        window.onmousemove = function (e) {
            if (!wait) {
                e.preventDefault();
                if (picker.sliders['picker_color'].down) picker.mouse_move(e, picker_color, picker_color_indicator, false, update_picker_color);
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


        picker_color.onmousedown = function (e) {
            e.preventDefault();
            picker.sliders['picker_color'].down = true;
            picker.mouse_move(e, picker_color, picker_color_indicator, true, update_picker_color);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 60);
        };



        picker_hue.onmousedown = function (e) {
            e.preventDefault();
            picker.sliders['picker_hue'].down = true;
            picker.mouse_move(e, picker_hue, picker_hue_indicator, true, update_picker_hue);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 60);
        };


        picker_opacity.onmousedown = function (e) {
            e.preventDefault();
            picker.sliders['picker_opacity'].down = true;
            picker.mouse_move(e, picker_opacity, picker_opacity_indicator, true, update_picker_opacity);
            wait = true;
            clearTimeout(preTimeOut);
            preTimeOut = setTimeout(function () {
                wait = false;
            }, 60);
        };


        window.onmouseup = function () {
            for (var name in picker.sliders) {
                picker.sliders[name].down = false;
            }
        };
    },[])
    return (
        <div id="picker_wrapper">
            <div id="picker_arrow"></div>
            <div id="picker_color" ref={picker_color_ref}>
                <div id="picker_saturation"></div>
                <div id="picker_value"></div>
                <div className="picker_color_indicator" ref={picker_color_indicator_ref}></div>
            </div>
            <div id="picker_hue" className="picker_slider" ref={picker_hue_ref}>
                <div className="picker_hue_indicator" ref={picker_hue_indicator_ref}></div>
            </div>
            <div id="picker_opacity" className="picker_slider" ref={picker_opacity_ref}>
                <div id="picker_opacity_fade"></div>
                <div className="picker_opacity_indicator" ref={picker_opacity_indicator_ref}></div>
            </div>
            <br />
            <div id="picker_sample">
                <div id="picker_sample_color" ref={sample_ref}></div>
            </div>
        </div>
    )
}


export default ColorPicker