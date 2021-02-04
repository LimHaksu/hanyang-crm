const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    });

    win.maximize();

    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, "/../build/index.html"),
            protocol: "file:",
            slashes: true,
        });

    win.loadURL(startUrl);
}

// electron 8 이전은 false, electron 9부터는 true
app.allowRendererProcessReuse = true;

app.whenReady().then(createWindow);

// 모든 윈도우가 닫히면 종료된다.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
