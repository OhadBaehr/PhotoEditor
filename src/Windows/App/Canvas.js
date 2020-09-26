import React, { useEffect, useRef, useContext } from 'react'
import { useAbuse } from 'use-abuse'
import ToolProperties from './ToolProperties'
import './Canvas.less'
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux'
import globalStore, { saveActiveLayerImage } from '../../Store/StoreFuncs'
var history = {
  redo_list: [],
  undo_list: [],
  saveState: function (ctx, list) {
    let data
    (list || this.undo_list).push({src:data= ctx.canvas.toDataURL(), id:ctx.canvas.id});
    return data
  },
  undo: function (ctx) {
    this.restoreState(ctx, this.undo_list, this.redo_list);
  },
  redo: function (ctx) {
    this.restoreState(ctx, this.redo_list, this.undo_list);
  },
  restoreState: function (ctx, pop, push) {
    if (pop.length) {
      let index=pop.slice(0).reverse().findIndex(x => x.id === ctx.canvas.id);
      if(index!==-1){
        let backwardsIndex=pop.length-1-index
        this.saveState(ctx, push, true);
        var restore_state = pop.splice(backwardsIndex,1)[0].src;
        var img = new Image();
        img.src = restore_state
        img.onload = function () {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        saveActiveLayerImage(restore_state)
      }
    }
  }
}

const pencil = (ctx, strokeColor) => {
  let dpi=globalStore.getState().canvas.dpi
  ctx.lineWidth = 20;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.strokeStyle = "rgba(0,0,0,0.75)"
  let isDrawing, points = [];
  let img = new Image();
  function draw(e){
    let rect = ctx.canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left
    let mouseY = e.clientY - rect.top
    let prevCtxOperation = ctx.globalCompositeOperation
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
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
      img.src = history.saveState(ctx);
      points.length = 0;
      prevCtxOperation === 'source-over' ? ctx.globalCompositeOperation = 'destination-out' : ctx.globalCompositeOperation = 'source-over'
    } else {
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 0; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.stroke();
    }
  }
  return {
    onPointerDown: function (e) {
      if (e.width === 1) {
        let rect = ctx.canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left
        let mouseY = e.clientY - rect.top
        if(mouseX>=0 && mouseX<=rect.width && mouseY>=0 && mouseY<=rect.height){
          isDrawing = true;
          img.src = history.saveState(ctx);
          draw(e)
        }
      }
    },
    onPointerUp: function (e) {
      if (e.width === 1 && isDrawing) {
        isDrawing = false;
        points.length = 0;
        ctx.globalCompositeOperation = 'source-over'
        let data=ctx.canvas.toDataURL()
        img.src=data
        saveActiveLayerImage(data)
      }
    },
    onPointerMove: function (e) {
      if (e.width === 1) {
        if (!isDrawing) return;
        draw(e)
      }
    },
  }
}



const Canvas = () => {
  const store = useSelector(store => store.canvas)
  const [state, setState] = useAbuse({ strokeColor: "rgba(0,0,0,0.5)", canvasHeight: 400, canvasWidth: 400 })
  let canvas = null
  const itemsRef = useRef([]);
  let canvasContainer = useRef(null)
  let tool = null
  
  const handleCommands = (e) => {
    console.log("changed")
    if (e.ctrlKey && e.key === 'z') {
      history.undo(canvas.getContext('2d'));
    }
    else if (e.ctrlKey && e.key === 'y') {
      history.redo(canvas.getContext('2d'))
    }
  }

  useEffect(() => {
    if(store.layers.length){
      itemsRef.current = itemsRef.current.slice(0, store.layers.length);
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

      if(store.layers[store.activeLayer].visible){
        canvas = itemsRef.current[store.activeLayer]
        tool = pencil(canvas.getContext('2d'), state.strokeColor)
        canvasContainer.current.addEventListener("pointermove", tool.onPointerMove)
        canvasContainer.current.addEventListener("pointerdown", tool.onPointerDown)
        window.addEventListener('pointerup', tool.onPointerUp);
      }
      window.addEventListener('keydown', handleCommands);
      return () => {
        window.removeEventListener('keydown', handleCommands);
        if(store.layers[store.activeLayer].visible){
          window.removeEventListener('pointerup', tool.onPointerUp);
          canvasContainer.current.removeEventListener("pointermove", tool.onPointerMove)
          canvasContainer.current.removeEventListener("pointerdown", tool.onPointerDown)
        }
      }
    }
  }, [store.activeLayer,store.layersCount,store.dpi])

  const canvasMap = React.useMemo(() => {
    return store.layers.map((_, index) => {
      return <canvas id={store.layers[index].id} className={`canvas ${store.layers[index].visible?'':'hidden'}`} key={`canvas-${store.layers[index].id}-key`} ref={el => itemsRef.current[index] = el} 
       style={{ width: state.canvasWidth, height: state.canvasHeight }} width={state.canvasWidth*store.dpi} height={state.canvasHeight*store.dpi}/>
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