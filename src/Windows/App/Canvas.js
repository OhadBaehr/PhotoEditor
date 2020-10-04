import React, { useEffect, useRef, useContext } from 'react'
import { useAbuse } from 'use-abuse'
import ToolProperties from './ToolProperties'
import './Canvas.less'
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux'
import globalStore, { saveActiveLayerImage } from '../../Store/StoreFuncs'

var history = {
  actions:[],
  redo_list: [],
  undo_list: [],
  saveAction: function(action){
    this.actions.push(action)
    console.log(this.actions)
  },
  saveState: function (ctx, list, keep_redo) {
    keep_redo = keep_redo || false;
    if (!keep_redo) {
      this.redo_list = [];
    }
    let data=ctx.canvas.toDataURL();
    (list || this.undo_list).push({ src: data , id: ctx.canvas.id });
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
      let index = pop.slice(0).reverse().findIndex(x => x.id === ctx.canvas.id);
      if (index !== -1) {
        let backwardsIndex = pop.length - 1 - index
        ctx.drawing=false;
        ctx.points.length=0
        this.saveState(ctx, push, true);
        var restore_state = pop.splice(backwardsIndex, 1)[0].src;
        ctx.img.src = restore_state
        saveActiveLayerImage(restore_state)
      }
    }
  }
}

const pencil = (ctx) => {
  let dpi = globalStore.getState().canvas.dpi
  ctx.lineWidth = 20;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.strokeStyle = "black"
  ctx.shadowColor="red"
  let img = new Image();
  let prevCtxOperation = null
  function draw(e,firstRun) {
    if (e.width === 1) {
      if (!ctx.drawing) return;
      var rect = ctx.canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left
      let mouseY = e.clientY - rect.top
      if(!firstRun){
        ctx.shadowBlur = 0;
        prevCtxOperation = ctx.globalCompositeOperation
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
      }
      ctx.points.push({ x: mouseX, y: mouseY });
      ctx.shadowBlur = 15;
      switch (e.buttons) {
        case 1: ctx.globalCompositeOperation = 'source-over';
          break;
        case 2:
        case 3:
          ctx.globalCompositeOperation = 'destination-out';
          break;
        default:
          ctx.globalCompositeOperation = 'source-over';
          break;
      }
      ctx.scale(dpi,dpi)
      ctx.beginPath();
      if (!firstRun && prevCtxOperation !== ctx.globalCompositeOperation) {
        //fixing issues when switching from one ctx composition to another
        ctx.globalCompositeOperation = prevCtxOperation
        ctx.moveTo(ctx.points[0].x, ctx.points[0].y);
        for (var i = 0; i < ctx.points.length; i++) {
          ctx.lineTo(ctx.points[i].x, ctx.points[i].y);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.stroke();
        img.src = history.saveState(ctx);
        history.saveAction({points:[...ctx.points],tool:{name:'pencil',operation:ctx.globalCompositeOperation}})
        ctx.points.length = 0;
        prevCtxOperation === 'source-over' ? ctx.globalCompositeOperation = 'destination-out' : ctx.globalCompositeOperation = 'source-over'
      } else {
        ctx.moveTo(ctx.points[0].x, ctx.points[0].y);
        for (var i = 0; i < ctx.points.length; i++) {
          ctx.lineTo(ctx.points[i].x, ctx.points[i].y);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.stroke();
      }
    }
  }
  return {
    onPointerDown: function (e) {
      if(e.ctrlKey) return
      if (e.width === 1) {
        let tools=globalStore.getState().tools
        ctx.strokeStyle = tools.colors[tools.colors.activeColor]
        let rect = ctx.canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left
        let mouseY = e.clientY - rect.top
        if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
          ctx.drawing = true;
          ctx.points=[]
          img.src = history.saveState(ctx);
          draw(e,true)
        }
      }
    },
    onPointerUp: function (e) {
      if (e.width === 1 && ctx.drawing) {
        ctx.drawing = false;
        history.saveAction({points:[...ctx.points],tool:{name:'pencil',operation:ctx.globalCompositeOperation}})
        ctx.points.length = 0;
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
        draw(e)
      }
    },
  }
}



const Canvas = () => {
  const store = useSelector(store => store.canvas)
  // const [state, setState] = useAbuse({canvasHeight: 400, canvasWidth: 400 })
  let canvas = null
  const itemsRef = useRef([]);
  let canvasContainer = useRef(null)
  let tool = null

  const handleCommands = (e) => {
    console.log("changed")
    if (e.ctrlKey) {
      if(e.key === 'z') history.undo(canvas.getContext('2d'));
      else if(e.key === 'y') history.redo(canvas.getContext('2d'))
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
          let prevCompositeOperation= ctx.globalCompositeOperation 
          document.body.style.pointerEvents='none'
          ctx.globalCompositeOperation = 'source-over'
          ctx.shadowBlur=0
          ctx.drawImage(img, 0, 0, el.width, el.height);
          ctx.img = img
          ctx.globalCompositeOperation =prevCompositeOperation
          document.body.style.pointerEvents='auto'
        }
        img.onerror = () => {
          ctx.img = img
        }
        img.src = store.layers[i].src
      })

      if (store.layers[store.activeLayer].visible) {
        canvas = itemsRef.current[store.activeLayer]
        tool = pencil(canvas.getContext('2d'))
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
        style={{ width: store.width, height: store.height }} width={store.width * store.dpi} height={store.height * store.dpi} />
    })
  }, [store.activeLayer, store.layersCount, store.dpi, store.layers])

  return (
    <div className={`canvas-container`} style={{ minHeight: store.height + 100 }} ref={canvasContainer}>
      <div className={`transparent-background`} style={{ width: store.width, height: store.height }}>
        {canvasMap}
      </div>
    </div>
  );
}

export default Canvas;