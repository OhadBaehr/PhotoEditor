import React, { useEffect, useRef, useContext } from 'react'
import { useAbuse } from 'use-abuse'
import ToolProperties from './ToolProperties'
import './Canvas.less'
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux'
import globalStore, { saveActiveLayerImage } from '../../Store'
var history = {
  redo_list: [],
  undo_list: [],
  init: function (redo, undo) {
    this.redo_list = redo
    this.undo_list = undo
  },
  saveState: function (canvas, list, keep_redo) {
    keep_redo = keep_redo || false;
    if (!keep_redo) {
      this.redo_list = [];
    }
    let data
    (list || this.undo_list).push(data = canvas.toDataURL());
    return data
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
      saveActiveLayerImage(restore_state)
    }
  }
}

const pencil = (canvas, strokeColor) => {
  let ctx = canvas.getContext("2d")
  let dpi=globalStore.getState().canvasStore.dpi
  ctx.lineWidth = 20;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.strokeStyle = "rgba(0,0,0,0.75)"
  let isDrawing, points = [];
  let img = new Image();
  return {
    onPointerDown: function (e) {
      if (e.width === 1) {
        isDrawing = true;
        img.src = history.saveState(ctx.canvas);
      }
    },
    onPointerUp: function (e) {
      if (e.width === 1) {
        isDrawing = false;
        points.length = 0;
        ctx.globalCompositeOperation = 'source-over'
        saveActiveLayerImage(canvas.toDataURL())
      }
    },
    onPointerMove: function (e) {
      if (e.width === 1) {
        if (!isDrawing) return;
        var rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left
        let mouseY = e.clientY - rect.top
        let prevCtxOperation = ctx.globalCompositeOperation
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        points.push({ x: mouseX, y: mouseY });
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
        ctx.scale(dpi,dpi)
        ctx.beginPath();
        if (prevCtxOperation !== ctx.globalCompositeOperation) {
          //fixing issues when switching from one ctx composition to another
          ctx.globalCompositeOperation = prevCtxOperation
          ctx.moveTo(points[0].x, points[0].y);
          for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.stroke();
          img.src = history.saveState(ctx.canvas);
          points.length = 0;
          prevCtxOperation === 'source-over' ? ctx.globalCompositeOperation = 'destination-out' : ctx.globalCompositeOperation = 'source-over'
        } else {
          ctx.moveTo(points[0].x, points[0].y);
          for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.stroke();
        }
      }
    },
  }
}



const Canvas = () => {
  const store = useSelector(store => store.canvasStore)
  const [state, setState] = useAbuse({ strokeColor: "rgba(0,0,0,0.5)", canvasHeight: 400, canvasWidth: 400 })
  let canvas = null
  const itemsRef = useRef([]);
  let canvasContainer = useRef(null)
  let tool = null
  const handleCommands = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      history.undo(canvas, canvas.getContext('2d'));
    }
    if (e.ctrlKey && e.key === 'y') {
      history.redo(canvas, canvas.getContext('2d'))
    }
  }

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, store.layers.length);
    canvas = itemsRef.current[store.activeLayer]
    //Here we set up the properties of the canvas element. 
    itemsRef.current.map((el, i) => {
      let ctx = el.getContext('2d')
      let img = new Image()
      img.src = store.layers[i].src
      img.onload = function () {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img, 0, 0, el.width, el.height);
      }
    })
    tool = pencil(canvas, state.strokeColor)

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
  }, [store.activeLayer,store.dpi])

  const canvasMap = React.useMemo(() => {
    return store.layers.map((_, index) => {
      let el = <canvas className={`canvas`} key={`canvas-${index.toString()}`} ref={el => itemsRef.current[index] = el} 
        width={state.canvasWidth*store.dpi} height={state.canvasHeight*store.dpi} style={{ width: state.canvasWidth, height: state.canvasHeight }}/>
      return el
    })
  }, [store.activeLayer,store.layersCount,store.dpi])
  return (
      <div className={`canvas-container`} style={{ minHeight: state.canvasHeight + 100 }} ref={canvasContainer}>
        <div className={`transparent-background`} style={{ width: state.canvasWidth, height: state.canvasHeight }}>
          {canvasMap}
        </div>
      </div>
  );
}

export default Canvas;