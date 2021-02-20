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
            nativeWindowOpen: true,
        },
    });

    win.maximize();
    // win.setMenu(null); // 배포할때는 주석 해제

    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, "/../build/index.html"),
            protocol: "file:",
            slashes: true,
        });

    win.loadURL(startUrl);

    win.webContents.on("new-window", (event, url, frameName, disposition, options, additionalFeatures) => {
        if (frameName === "PopupPhoneCall") {
            // open window as modal
            event.preventDefault();
            Object.assign(options, {
                modal: true,
                parent: win,
                frame: false,
                alwaysOnTop: true,
            });
            event.newGuest = new BrowserWindow(options);
        }
    });
}

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
