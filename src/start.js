const { app, BrowserWindow, ipcMain} = require('electron')
const {configureStore} = require('../src/store/configureStore')
//const path = require('path')
//const url = require('url')

global.state = {}

const setupStore = ()=>{
  const store = configureStore(global.state, 'main');
  global.state = store.getState();
}

ipcMain.on('runCommand', async (event, arg) => {
  event.returnValue = await runCommand(arg);
});

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    transparent: false,
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
    backgroundColor:"rgb(31, 31, 30)"
  })


  mainWindow.loadURL(
    process.env.ELECTRON_START_URL + '?App'
  )
  let webContents = mainWindow.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
    subWindowsOverlay()
  })
  mainWindow.on('closed', () => {
    subWindowsHide()
    mainWindow = null
  })

  mainWindow.on('minimize', () => {
    subWindowsHide()
  })

  mainWindow.on('restore', () => {
    subWindowsOverlay()
  })

  mainWindow.on('focus', () => {
    subWindowsOverlay()
  })
  mainWindow.on('maximize', () => {
    subWindowsOverlay()
    mainWindow.webContents.send('fullscreen-true', '');
  })
  mainWindow.on('unmaximize', () => {
    subWindowsOverlay()
    mainWindow.webContents.send('fullscreen-false', '');
  })
  mainWindow.on('enter-full-screen', () => {
    subWindowsOverlay()
  })
  mainWindow.on('move', () => {
    subWindowsOverlay()
  })
}



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})


function subWindowsHide(){
  layersWindow.hide()
  toolsWindow.hide()
}
function subWindowsOverlay(){
  layersWindow.showInactive()
  toolsWindow.showInactive()
  layersWindow.moveTop()
  toolsWindow.moveTop()
}



let layersWindow
function createLayers() {
  layersWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    width: 160,
    minWidth:120,
    height: 300,
    minHeight:200,
    type: 'toolbar',
    setSkipTaskbar:true,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
      nodeIntegration: true
    },
  })

  layersWindow.loadURL(
    process.env.ELECTRON_START_URL + '?Layers'
  )
  let webContents = layersWindow.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
  })

  mainWindowSize=mainWindow.getNormalBounds()
  layersWindowSize=layersWindow.getNormalBounds()
  layersWindow.setPosition(mainWindowSize.width+mainWindowSize.x-layersWindowSize.width-5,mainWindowSize.y+mainWindowSize.height-layersWindowSize.height-5)
}

let toolsWindow
function createTools() {
  toolsWindow = new BrowserWindow({
    width: 68,
    minWidth:40,
    height: 350,
    minHeight:60,
    type: 'toolbar',
    setSkipTaskbar:true,
    transparent: true,
    frame: false,
    resizable:false,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
      nodeIntegration: true
    },
  })

  toolsWindow.loadURL(
    process.env.ELECTRON_START_URL + '?Tools'
  )
  let webContents = toolsWindow.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
  })


  mainWindowSize=mainWindow.getNormalBounds()
  toolsWindowSize=toolsWindow.getNormalBounds()
  toolsWindow.setPosition(mainWindowSize.x+5,mainWindowSize.y+mainWindowSize.height-toolsWindowSize.height-5)
}

app.on('ready', ()=>{
  createWindow()
  createLayers()
  createTools()
  setupStore()
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
