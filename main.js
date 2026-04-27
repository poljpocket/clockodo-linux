const { app, BrowserWindow, Tray, Menu, session } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('use-gl', 'angle');
app.commandLine.appendSwitch('use-angle', 'vulkan');
app.commandLine.appendSwitch('enable-features', 'UseOzonePlatform,AcceleratedVideoDecodeLinuxZeroCopyGL,AcceleratedVideoDecodeLinuxGL,AcceleratedVideoEncoder,VaapiIgnoreDriverChecks,Vulkan,DefaultANGLEVulkan,VulkanFromANGLE,WebRTCPipeWireCapturer');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-gpu-driver-bug-workaround');

let mainWindow;
let tray;

function createWindow() {
  const persistentSession = session.fromPartition('persist:clockodo-linux');

  mainWindow = new BrowserWindow({
    width: 430,
    height: 750,
    title: 'Clockodo',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      session: persistentSession,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL('https://my.clockodo.com/clock');

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  tray.setToolTip('Clocko:do');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  // Do nothing — app stays in tray
});
