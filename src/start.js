const { app, BrowserWindow } = require('electron')

const path = require('path')
const url = require('url')

let mainWindow




function createWindow() {
  mainWindow = new BrowserWindow({
    frame: false,
    width: 800,
    minWidth:340,
    height: 600,
    minHeight:300,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
      nodeIntegration: true
    },
    backgroundColor:'#2e2c29',
  })
  
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL + '?App'
  )
  let webContents = mainWindow.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
  })
  mainWindow.on('closed', () => {
    layersWindow.hide()
    mainWindow = null
  })

  mainWindow.on('minimize', () => {
    layersWindow.hide()
  })
  
  mainWindow.on('restore', () => {
    subWindowsOverlay()
  })

  mainWindow.on('focus', () => {
    subWindowsOverlay()
  })
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})


function subWindowsOverlay(){
  layersWindow.moveTop()
  toolsWindow.moveTop()
}



let layersWindow
function createLayers() {
  layersWindow = new BrowserWindow({
    frame: false,
    width: 200,
    minWidth:140,
    height: 300,
    minHeight:200,
    type: 'toolbar',
    setSkipTaskbar:true,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
      nodeIntegration: true
    },
    backgroundColor:'#2e2c29',
  })

  layersWindow.loadURL(
    process.env.ELECTRON_START_URL + '?Layers'
  )
  let webContents = layersWindow.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
  })

  mainWindowSize=mainWindow.getSize()
  layersWindowSize=layersWindow.getSize()
  layersWindow.setPosition(mainWindowSize[0]+32,mainWindowSize[1]-layersWindowSize[1]+32)
}

let toolsWindow
function createTools() {
  toolsWindow = new BrowserWindow({
    frame: false,
    width: 140,
    minWidth:100,
    height: 500,
    minHeight:200,
    type: 'toolbar',
    setSkipTaskbar:true,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
      nodeIntegration: true
    },
    backgroundColor:'#2e2c29',
  })

  toolsWindow.loadURL(
    process.env.ELECTRON_START_URL + '?Layers'
  )
  let webContents = toolsWindow.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
  })

  mainWindowSize=mainWindow.getNormalBounds()
  toolsWindowSize=toolsWindow.getNormalBounds()
  toolsWindow.setPosition(mainWindowSize.x+8,mainWindowSize.y+toolsWindowSize.y)
}

app.on('ready', ()=>{
  createWindow()
  createLayers()
  createTools()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })