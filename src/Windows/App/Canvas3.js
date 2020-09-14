import React, { Component, useCallback, useEffect, useRef } from 'react';
import './Canvas.less'
import { useAbuse } from 'use-abuse'
var history = {
  redo_list: [],
  undo_list: [],
  saveState: function (canvas, list, keep_redo) {
    keep_redo = keep_redo || false;
    if (!keep_redo) {
      this.redo_list = [];
    }

    (list || this.undo_list).push(canvas.toDataURL());
  },
  undo: function (canvas, ctx) {
    this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
  },
  redo: function (canvas, ctx) {
    this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
  },
  restoreState: function (canvas, ctx, pop, push) {
    if (pop.length) {
      let changeBack=ctx.globalCompositeOperation === 'destination-out'
      this.saveState(canvas, push, true);
      var restore_state = pop.pop();
      var img = new Image();
      img.src = restore_state
      img.onload = function () {
        canvas.style.userEvents="none"
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      if(changeBack) ctx.globalCompositeOperation = 'destination-out'
    }
  }
}


function Canvas() {
  const [state, setState] = useAbuse({ strokeColor: "#000000", canvasHeight: 400, canvasWidth: 400})
  let ctx = null;
  let canvas = useRef(null)
  let isPainting = false;
  let zoomLevel=1
  // Different stroke styles to be used for user and guest
  let prevPos = { offsetX: 0, offsetY: 0 };
  const chooseCtxOperation=(e)=>{
    switch (e.nativeEvent.buttons) {
      case 1: ctx.globalCompositeOperation = 'source-over';
        break;
      case 2:
      case 3:ctx.globalCompositeOperation = 'color';
        break;
      default:
        break;
    }
    return ctx.globalCompositeOperation
  }
  const startPaintEvent = useCallback((e) => {
    if (e.width === 1) {
      history.saveState(canvas.current);
      isPainting = true;
      }
      paint(e)
    }
  )

  const paint = useCallback((e) => {
    if (!isPainting) return;
    if (e.width === 1) {
      // let canvasRect = e.target.getBoundingClientRect();
      //  const offset = {x:e.pageX - canvasRect.left, y:e.pageY - canvasRect.top}
      let mouseX = e.clientX - canvas.current.offsetLeft
      let mouseY = e.clientY - canvas.current.offsetTop

      let prevCtxOperation=ctx.globalCompositeOperation
      let currentCtxOperation=chooseCtxOperation(e)
      if(prevCtxOperation!==currentCtxOperation)history.saveState(canvas.current);
      console.log(e.nativeEvent.buttons)
      // ctx.shadowBlur = 10;
      // ctx.shadowOffsetX =0
      // ctx.shadowOffsetY = 0
      // ctx.shadowColor = "rgba(0,0,0," + 0.8 + ")";
      ctx.strokeStyle = "rgba(0,0,0," + 0.5 + ")";
      // ctx.miterLimit = 1;
      // ctx.fillStyle = "rgba(255,255,255," + 0.8 + ")";
      ctx.lineWidth = 100;
      ctx.lineCap = "round"
      // ctx.lineJoin = "round";
      ctx.lineTo(mouseX, mouseY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(mouseX, mouseY)
    }
  })

  const endPaintEvent = useCallback((e) => {
    if (e.width === 1) {
      if (isPainting) {
        isPainting = false;
        ctx.beginPath()
      }
      // switch (e.which) {
      //   case 1: ctx.globalCompositeOperation = 'source-over';
      //     break;
      //   case 2:
      //     break;
      //   case 3:ctx.globalCompositeOperation = 'destination-out';
      //     break;
      //   default:
      //     break;
      // }
    }
  })

  const handleChangeComplete = (color) => {
    setState({ strokeColor: color.hex });
    console.log(state.strokeColor)
    
  };
  useEffect(() => {
    // Here we set up the properties of the canvas element. 
    canvas.current.width = state.canvasWidth;
    canvas.current.height = state.canvasHeight;
    ctx = canvas.current.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerup', endPaintEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerup', endPaintEvent);
    }
  }, [])


  const zoom=(e)=>{
    const delta = Math.sign(e.deltaY);
    if(delta<0) zoomLevel+=0.05
    else zoomLevel-=0.05
    canvas.current.parentElement.style.transform=`scale(${zoomLevel})`
    console.log(canvas.current.parentElement)
  }
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      history.undo(canvas.current, ctx);
    }
    if (e.ctrlKey && e.key === 'y') {
      history.redo(canvas.current, ctx)
    }
  }

  useEffect(() => {
    ctx = canvas.current.getContext('2d');
  })
  return (
    <div className={`canvas-container`}
      onPointerMove={paint}
    >
      <div className={`transparent-background`} style={{ width: state.canvasWidth, height: state.canvasHeight }}>
        <canvas
          // We use the ref attribute to get direct access to the canvas element. 
          ref={canvas}
          onPointerDown={startPaintEvent}
          onWheel={zoom}
        />
      </div>
    </div>
  );
}
export default Canvas;