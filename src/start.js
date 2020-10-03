const { app, BrowserWindow, ipcMain} = require('electron')
const {configureStore} = require('./Store/configureStore')
//const path = require('path')
//const url = require('url')

//global.state = {}
const setupStore = ()=>{
  configureStore(undefined, 'main');
  // const store = configureStore(global.state, 'main');
  //global.state = store.getState();
}

ipcMain.on('runCommand', async (event, arg) => {
  event.returnValue = await runCommand(arg);
});

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    transparent: false,
    frame: false,
    // setSkipTaskbar:false,//just for reference: this control if the icon is shown
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
    // mainWindow.webContents.send('debug', 'bloop');
    // subWindowsOverlay()
  })
  mainWindow.on('closed', () => {
    subWindowsClose()
    mainWindow = null
  })

  // mainWindow.on('minimize', () => {
  //   subWindowsHide()
  // })

  // mainWindow.on('restore', () => {
  //   subWindowsOverlay()
  // })

  // mainWindow.on('focus', () => {
  //   subWindowsOverlay()
  // })
  mainWindow.on('maximize', () => {
    // subWindowsOverlay()
    mainWindow.webContents.send('fullscreen-true', '');

  })
  mainWindow.on('unmaximize', () => {
    // subWindowsOverlay()
    mainWindow.webContents.send('fullscreen-false', '');
  })
  // mainWindow.on('enter-full-screen', () => {
  //   subWindowsOverlay()
  // })
  // mainWindow.on('move', () => {
  //   subWindowsOverlay()
  // })
}



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

function subWindowsClose(){
  layersWindow.close()
  toolsWindow.close()
}

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
    minWidth:160,
    height: 300,
    minHeight:200,
    type: 'toolbar',
    parent:mainWindow,
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

  layersWindow.on('focus', () => {
      mainWindow.focus()
  })

  mainWindowSize=mainWindow.getNormalBounds()
  layersWindowSize=layersWindow.getNormalBounds()
  layersWindow.setPosition(mainWindowSize.width+mainWindowSize.x-layersWindowSize.width-25,
    mainWindowSize.y+mainWindowSize.height-layersWindowSize.height-30)
}

let toolsWindow
function createTools() {
  toolsWindow = new BrowserWindow({
    width: 68,
    minWidth:40,
    height: 264,
    minHeight:60,
    type: 'toolbar',
    transparent: true,
    frame: false,
    resizable:false,
    parent:mainWindow,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
      nodeIntegration: true
    },
  })

  toolsWindow.on('focus', () => {
    mainWindow.focus()
  })

  toolsWindow.loadURL(
    process.env.ELECTRON_START_URL + '?Tools'
  )
  let webContents = toolsWindow.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
    toolsWindow.openDevTools()
  })


  mainWindowSize=mainWindow.getNormalBounds()
  toolsWindowSize=toolsWindow.getNormalBounds()
  toolsWindow.setPosition(mainWindowSize.x+25,mainWindowSize.y+mainWindowSize.height-toolsWindowSize.height-40)
}


let colorPickerWindow
function createColorPicker() {
  colorPickerWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    width: 205,
    minWidth:205,
    height: 220,
    minHeight:220,
    type: 'toolbar',
    parent:mainWindow,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
      nodeIntegration: true
    },
  })

  colorPickerWindow.loadURL(
    process.env.ELECTRON_START_URL + '?ColorPicker'
  )
  let webContents = colorPickerWindow.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
    colorPickerWindow.openDevTools()
  })

  // colorPickerWindow.on('focus', () => {
  //     mainWindow.focus()
  // })

  mainWindowSize=mainWindow.getNormalBounds()
  colorPickerWindowSize=colorPickerWindow.getNormalBounds()
  colorPickerWindow.setPosition(mainWindowSize.width+mainWindowSize.x-colorPickerWindowSize.width-25,
    mainWindowSize.y+70)
}


app.on('ready', ()=>{
  setupStore()
  createWindow()
  createLayers()
  createTools()
  // createColorPicker()
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
