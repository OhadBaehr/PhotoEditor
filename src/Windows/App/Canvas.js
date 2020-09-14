import React, { useEffect, useRef } from 'react'
import { useAbuse } from 'use-abuse'
import './Canvas.less'


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
      this.saveState(canvas, push, true);
      var restore_state = pop.pop();
      var img = new Image();
      img.src = restore_state
      img.onload = function () {
        canvas.style.userEvents = "none"
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
  }
}

const pencil = (canvas, strokeColor) => {
    let ctx=canvas.getContext("2d")
    ctx.lineWidth = 10;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle="rgba(0,0,0,0.5)"
    let isDrawing, points = [ ];
    let restore_state=null
    let img=null
  return {
    onPointerDown: function (e) {
      if (e.width === 1) {
        isDrawing = true;
        history.saveState(ctx.canvas);
        restore_state=canvas.toDataURL()
        img = new Image();
        img.src = restore_state
      }
    },
    onPointerUp: function (e) {
      if (e.width === 1) {
        isDrawing = false;
        points.length = 0;
      }
    },
    onPointerMove: function (e) {
      if (e.width === 1) {
        if (!isDrawing) return;
        let mouseX = e.clientX - canvas.offsetLeft
        let mouseY = e.clientY - canvas.offsetTop
        let prevCtxOperation=ctx.globalCompositeOperation
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        points.push({ x:mouseX, y: mouseY });
        switch (e.buttons) {
            case 1: ctx.globalCompositeOperation = 'source-over';
              break;
            case 2:
            case 3:
              ctx.globalCompositeOperation = 'destination-out';
              break;
            default:
              break;
          }
        if(prevCtxOperation!==ctx.globalCompositeOperation){

        }
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.beginPath()
      }
    },
  }
}



const Canvas = () => {
  const [state, setState] = useAbuse({ strokeColor: "rgba(0,0,0,0.5)", canvasHeight: 400, canvasWidth: 400})
  let canvas = useRef(null)
  let canvasContainer = useRef(null)
  let tool = null

  const handleCommands = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      history.undo(canvas.current, canvas.current.getContext('2d'));
    }
    if (e.ctrlKey && e.key === 'y') {
      history.redo(canvas.current, canvas.current.getContext('2d'))
    }
  }

  useEffect(() => {
    // Here we set up the properties of the canvas element. 
    canvas.current.width = state.canvasWidth;
    canvas.current.height = state.canvasHeight;
    tool = pencil(canvas.current, state.strokeColor)

    window.addEventListener('keydown', handleCommands);
    window.addEventListener('pointerup', tool.onPointerUp);
    canvasContainer.current.addEventListener("pointermove", tool.onPointerMove)
    canvasContainer.current.addEventListener("pointerdown", tool.onPointerDown)
    return () => {
      window.removeEventListener('keydown', handleCommands);
      window.removeEventListener('pointerup', tool.onPointerUp);
      canvasContainer.current.removeEventListener("pointermove", tool.onPointerMove)
      canvasContainer.current.removeEventListener("pointerdown", tool.onPointerDown)
    }
  }, [])
  return (
    <div className={`canvas-container`} ref={canvasContainer}>
      <div className={`transparent-background`} style={{ width: state.canvasWidth, height: state.canvasHeight }}>
        <canvas style={{ position: "absolute" }} ref={canvas} />
      </div>
    </div>
  );
}

export default Canvas;