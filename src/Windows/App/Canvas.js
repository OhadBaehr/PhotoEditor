import React, { useEffect, useRef ,useContext} from 'react'
import { useAbuse } from 'use-abuse'
import ToolProperties from './ToolProperties'
import './Canvas.less'
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux'
import store from '../../Store'
var history = {
  redo_list: [],
  undo_list: [],
  init: function(redo,undo){
    this.redo_list=redo
    this.undo_list=undo
  },
  saveState: function (canvas, list, keep_redo) {
    keep_redo = keep_redo || false;
    if (!keep_redo) {
      this.redo_list = [];
    }
    let data
    (list || this.undo_list).push(data=canvas.toDataURL());
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
    }
  }
}

const pencil = (canvas, strokeColor) => {
  let ctx = canvas.getContext("2d")
  ctx.lineWidth = 10;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.strokeStyle = "rgba(0,0,0,0.5)"
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
        store.dispatch({type:"SET_LAYERS",payload:store.getState().canvasStore.layers.map((item, j) => {
          if (j === store.getState().canvasStore.ActiveLayer) {
            return canvas.toDataURL();
          } else {
            return item;
          }
        })})
      }
    },
    onPointerMove: function (e) {
      if (e.width === 1) {
        if (!isDrawing) return;
        var rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX -rect.left
        let mouseY = e.clientY -  rect.top
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
        if (prevCtxOperation !== ctx.globalCompositeOperation) {
          //fixing issues when switching from one ctx composition to another
          ctx.globalCompositeOperation = prevCtxOperation
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
          ctx.beginPath()
          img.src = history.saveState(ctx.canvas);
          points.length = 0;
          prevCtxOperation === 'source-over' ? ctx.globalCompositeOperation = 'destination-out' : ctx.globalCompositeOperation = 'source-over'
        } else {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
          ctx.beginPath()
        }
      }
    },
  }
}



const Canvas = () => {
  let layers=store.getState().canvasStore.layers

  let activeLayer=store.getState().canvasStore.ActiveLayer
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
    itemsRef.current = itemsRef.current.slice(0, layers.length);
    canvas=itemsRef.current[activeLayer]
    //Here we set up the properties of the canvas element. 
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
    itemsRef.current.map((el,i)=>{
      let ctx= el.getContext('2d')
      let img = new Image()
      img.src= layers[i]
      img.onload = function () {
        ctx.drawImage(img, 0, 0, el.width, el.height);
      }
      //history.saveState(ctx.canvas);
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
  }, [activeLayer])
  
  const canvasMap = React.useMemo(()=>{
    return layers.map((_,index)=>{
      let el=<canvas key={`canvas-${index.toString()}`} ref={el => itemsRef.current[index] = el} />
      return el
    },[activeLayer])
  })
  return (
    <div className={`inner-app-container`}>
      <ToolProperties/>
      <div className={`canvas-container`} style={{ minHeight:state.canvasHeight+100}}ref={canvasContainer}>
        <div className={`transparent-background`} style={{ width: state.canvasWidth, height: state.canvasHeight }}>
          {canvasMap}
        </div>
      </div>
    </div>
  );
}

export default Canvas;