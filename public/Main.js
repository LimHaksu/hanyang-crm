const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const url = require("url");

let forceQuit = false;
function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            nativeWindowOpen: true,
        },
        icon: path.join(__dirname, "/../build/icon.ico"),
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

    win.on("close", async function (e) {
        if (!forceQuit) {
            e.preventDefault();
            const choice = await dialog.showMessageBox(this, {
                type: "question",
                buttons: ["예", "아니요"],
                title: "프로그램 종료",
                message: "정말로 종료하시겠어요?",
            });
            if (choice.response === 0) {
                forceQuit = true;
                win.close();
            }
        }
    });

    win.webContents.on("new-window", (event, url, frameName, disposition, options, additionalFeatures) => {
        if (frameName === "PopupPhoneCall") {
            // open window as modal
            event.preventDefault();
            Object.assign(options, {
                modal: true,
                parent: win,
                frame: false,
                alwaysOnTop: true,
                resizable: false,
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
