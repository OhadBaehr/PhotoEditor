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
  saveState: function (ctx, list, keep_redo) {
    keep_redo = keep_redo || false;
    if (!keep_redo) {
      this.redo_list = [];
    }
    let data
    (list || this.undo_list).push({ src: data = ctx.canvas.toDataURL(), id: ctx.canvas.id });
    return data
  },
  undo: function (ctx) {
    this.restoreState(ctx, this.undo_list, this.redo_list);
  },
  redo: function (ctx) {
    this.restoreState(ctx, this.redo_list, this.undo_list);
  },
  restoreState: function (ctx, pop, push) {
    console.log(this.undo_list,this.redo_list)
    if (pop.length) {
      let index = pop.slice(0).reverse().findIndex(x => x.id === ctx.canvas.id);
      if (index !== -1) {
        let backwardsIndex = pop.length - 1 - index
        this.saveState(ctx, push, true);
        var restore_state = pop.splice(backwardsIndex, 1)[0].src;
        var img = new Image();
        img.onload = function () {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.img = img
        }
        img.src = restore_state
        saveActiveLayerImage(restore_state)
      }
    }
  }
}

const pencil = (ctx, strokeColor) => {
  let dpi = globalStore.getState().canvas.dpi
  ctx.lineWidth = 20;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.strokeStyle = "rgba(0,0,0,0.75)"
  let isDrawing, points = [];
  let img = new Image();
  function draw(e,firstRun) {
    let rect = ctx.canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left
    let mouseY = e.clientY - rect.top
    let prevCtxOperation = ctx.globalCompositeOperation
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    try {
      if(prevCtxOperation=== 'source-over' || img.src===null) ctx.drawImage(ctx.img, 0, 0, ctx.canvas.width, ctx.canvas.height);
      else ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    } catch { } //we cant allow for waiting for the img.onload event as it is too time consuming, we have to handle broken images
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
    ctx.scale(dpi, dpi)
    ctx.beginPath();
    if (!firstRun && prevCtxOperation !== ctx.globalCompositeOperation) {
      //fixing issues when switching from one ctx composition to another
      ctx.globalCompositeOperation = prevCtxOperation
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 0; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.stroke();
      points.length = 0;
      if(prevCtxOperation==='source-over'){
        img.src = history.saveState(ctx);
        ctx.globalCompositeOperation = 'destination-out'
      }else{
        ctx.globalCompositeOperation = 'source-over'
        ctx.img.src = history.saveState(ctx);
      } 
    } else {
      if(firstRun && ctx.globalCompositeOperation === 'destination-out')img.src = ctx.canvas.toDataURL()
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
        if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
          isDrawing = true;
          history.saveState(ctx);
          draw(e,true)
        }
      }
    },
    onPointerUp: function (e) {
      if (e.width === 1 && isDrawing) {
        isDrawing = false;
        points.length = 0;
        ctx.globalCompositeOperation = 'source-over'
        let data = ctx.canvas.toDataURL()
        if (ctx.img) {
          ctx.img.src = data
          saveActiveLayerImage(data)
        }
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
    if (store.layers.length) {
      itemsRef.current = itemsRef.current.slice(0, store.layers.length);
      //Here we set up the properties of the canvas element. 
      itemsRef.current.map((el, i) => {
        let ctx = el.getContext('2d')
        let img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(img, 0, 0, el.width, el.height);
          ctx.img = img
        }
        img.onerror = () => {
          ctx.img = img
        }
        img.src = store.layers[i].src
      })

      if (store.layers[store.activeLayer].visible) {
        canvas = itemsRef.current[store.activeLayer]
        tool = pencil(canvas.getContext('2d'), state.strokeColor)
        canvasContainer.current.addEventListener("pointermove", tool.onPointerMove)
        canvasContainer.current.addEventListener("pointerdown", tool.onPointerDown)
        window.addEventListener('pointerup', tool.onPointerUp);
      }
      window.addEventListener('keydown', handleCommands);
      return () => {
        window.removeEventListener('keydown', handleCommands);
        if (store.layers[store.activeLayer].visible) {
          window.removeEventListener('pointerup', tool.onPointerUp);
          canvasContainer.current.removeEventListener("pointermove", tool.onPointerMove)
          canvasContainer.current.removeEventListener("pointerdown", tool.onPointerDown)
        }
      }
    }
  }, [store.activeLayer, store.layersCount, store.dpi, store.layers[store.activeLayer]?.visible])//do not put store.layers as a dependency

  const canvasMap = React.useMemo(() => {
    return store.layers.map((_, index) => {
      return <canvas id={store.layers[index].id} className={`canvas ${store.layers[index].visible ? '' : 'hidden'}`} key={`canvas-${store.layers[index].id}-key`} ref={el => itemsRef.current[index] = el}
        style={{ width: state.canvasWidth, height: state.canvasHeight }} width={state.canvasWidth * store.dpi} height={state.canvasHeight * store.dpi} />
    })
  }, [store.activeLayer, store.layersCount, store.dpi, store.layers])

  return (
    <div className={`canvas-container`} style={{ minHeight: state.canvasHeight + 100 }} ref={canvasContainer}>
      <div className={`transparent-background`} style={{ width: state.canvasWidth, height: state.canvasHeight }}>
        {canvasMap}
      </div>
    </div>
  );
}

export default Canvas;