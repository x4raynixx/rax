const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, './images/logos/logo.png'),
    title: 'Rax - 1.0.0',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.removeMenu();

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

app.setName('Rax - 1.0.0');

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, './images/logos/logo.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => mainWindow.show() },
    { label: 'Skip Song', click: () => mainWindow.webContents.send('tray-action', 'skip') },
    { label: 'Next Song', click: () => mainWindow.webContents.send('tray-action', 'next') },
    { label: 'Stop Song', click: () => mainWindow.webContents.send('tray-action', 'stop') },
    { label: 'Quit Rax', click: () => {
        isQuitting = true;
        tray.destroy();
        app.quit();
      }
    },
  ]);
  tray.setToolTip('Rax');
  tray.setContextMenu(contextMenu);
});

app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.destroy();
  }
});
