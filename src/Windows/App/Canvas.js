import React, { useEffect, useRef ,useContext} from 'react'
import { useAbuse } from 'use-abuse'
import ToolProperties from './ToolProperties'
import './Canvas.less'
import {StoreContext} from '../../Store'
import ReactDOM from 'react-dom';

var history = {
  redo_list: [],
  undo_list: [],
  init: function(redo,undo){
    this.redo_list=redo
    this.undo_list=undo
  },
  saveState: function (store ,canvas, list, keep_redo) {
    keep_redo = keep_redo || false;
    if (!keep_redo) {
      this.redo_list = [];
    }
    let img
    (list || this.undo_list).push(img=canvas.toDataURL());
    let im=new Image()
    im.src=img
    
    store.setLayers(store.Layers.map((item, j) => {
      if (j === store.ActiveLayer) {
        return im;
      } else {
        return item;
      }
    }))
    return img
  },
  undo: function (store,canvas, ctx) {
    this.restoreState(store,canvas, ctx, this.undo_list, this.redo_list);
  },
  redo: function (store,canvas, ctx) {
    this.restoreState(store,canvas, ctx, this.redo_list, this.undo_list);
  },
  restoreState: function (store,canvas, ctx, pop, push) {
    if (pop.length) {
      this.saveState(store,canvas, push, true);
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

const pencil = (store,canvas, strokeColor) => {
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
        img.src = history.saveState(store,ctx.canvas);
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
          img.src = history.saveState(store,ctx.canvas);
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
  const store=useContext(StoreContext)
  const [state, setState] = useAbuse({ strokeColor: "rgba(0,0,0,0.5)", canvasHeight: 400, canvasWidth: 400 })
  let canvas = null
  const itemsRef = useRef([]);
  let canvasContainer = useRef(null)
  let tool = null

  const handleCommands = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      console.log(canvas)
      history.undo(store,canvas, canvas.getContext('2d'));
    }
    if (e.ctrlKey && e.key === 'y') {
      history.redo(store,canvas, canvas.getContext('2d'))
    }
  }

  useEffect(() => {
    console.log(store.ActiveLayer)
    itemsRef.current = itemsRef.current.slice(0, store.Layers.length);
    canvas=itemsRef.current[store.ActiveLayer]
    //Here we set up the properties of the canvas element. 
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
    itemsRef.current.map((el,i)=>{
      let ctx= el.getContext('2d')
      ctx.drawImage(store.Layers[i], 0, 0, el.width, el.height);
      //history.saveState(ctx.canvas);
    })
    tool = pencil(store,canvas, state.strokeColor)

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
  }, [store.ActiveLayer])
  
  const bla = React.useMemo(()=>{
    return store.Layers.map((_,index)=>{
      let el=<canvas key={`canvas-${index.toString()}`} ref={el => itemsRef.current[index] = el} />
      return el
    },[store.ActiveLayer])
  })
  return (
    <div className={`inner-app-container`}>
    <ToolProperties/>
    <div className={`canvas-container`} style={{ minHeight:state.canvasHeight+100}}ref={canvasContainer}>
      <div className={`transparent-background`} style={{ width: state.canvasWidth, height: state.canvasHeight }}>
        {bla}
      </div>
    </div>
    </div>
  );
}

export default Canvas;