const NEW_SCREENSHOT_COUNT_STORAGE_KEY = 'new-screenshot-count';
const SCREENSHOT_DATA_STORAGE_KEY = 'screenshot-data';
const SCREENSHOT_SETTINGS_STORAGE_KEY = 'screenshot-settings';
const CAPTURE_NEW_SCREENSHOT_COMMAND = 'capture_new_screenshot';
let PORT;

const INITIAL_SETTINGS = {
    autoDownload: false,
    fileFormat: 'jpeg',
    fileQuality: 100,
    conflictAction: 'uniquify',
    alwaysShowSaveAs: false,
};

chrome.omnibox.setDefaultSuggestion({ description: 'make - capture new screenshot' });

chrome.runtime.onConnect.addListener(onConnect);
chrome.commands.onCommand.addListener(onCommand);
chrome.omnibox.onInputEntered.addListener(onOmniboxInputEntered);

function onConnect(port) {
    PORT = port;

    port.onDisconnect.addListener(deleteBadgeText);
    port.onDisconnect.addListener(resetNewScreenshotCounter);
}

function onOmniboxInputEntered(text) {
    switch (text) {
        case 'make': {
            captureNewScreenshot();
            break;
        }
    }
}

function onCommand(triggeredCommand) {
    switch (triggeredCommand) {
        case CAPTURE_NEW_SCREENSHOT_COMMAND: {
            captureNewScreenshot();
            break;
        }
    }
}

function deleteBadgeText() {
    chrome.browserAction.setBadgeText({ text: '' });
}

function resetNewScreenshotCounter() {
    chrome.storage.local.remove(NEW_SCREENSHOT_COUNT_STORAGE_KEY);
}

function captureNewScreenshot() {
    Promise.all([
        loadExtensionSettingsFromStorage(),
        loadScreenshotsFromStorage(),
        loadActiveTab(),
        loadNewScreenshotCount(),
    ]).then(([ extensionSettings, screenshots, activeTab, newScreenshotCount ]) => {
        const { fileFormat: format, fileQuality: quality, conflictAction, alwaysShowSaveAs, autoDownload } = extensionSettings;
        const { title, url } = activeTab;

        chrome.tabs.captureVisibleTab({ format, quality }, (dataUrl) => {
            const screenshot = buildScreenshotData(dataUrl, title, url, format, quality);

            downloadScreenshotOnEnabledAutoDownloadOption(autoDownload, screenshot, format, conflictAction, alwaysShowSaveAs);
            updateLocalScreenshotsStorage(screenshot, screenshots);
            updateBadgeText(newScreenshotCount);
            updateNewScreenshotCounter(newScreenshotCount);
            notifySuccessfulScreenshotCapture(screenshot.data);
        });
    });
}

function buildScreenshotData(dataUrl, title, url, format, quality) {
    return {
        id: uuid(),
        data: dataUrl,
        time: new Date().toISOString(),
        title,
        url,
        size: dataUrlToBytes(dataUrl),
        format,
        quality,
        favorite: false,
    };
}

function downloadScreenshotOnEnabledAutoDownloadOption(autoDownload, screenshot, fileFormat, conflictAction, alwaysShowSaveAs) {
    if (autoDownload) {
        chrome.downloads.download({
            url: screenshot.data,
            filename: `${ screenshot.id }.${ fileFormat }`,
            conflictAction,
            saveAs: alwaysShowSaveAs,
        });
    }
}

function updateLocalScreenshotsStorage(screenshot, screenshots) {
    chrome.storage.local.set({
        [SCREENSHOT_DATA_STORAGE_KEY]: [
            screenshot,
            ...screenshots,
        ],
    });
}

function updateBadgeText(newScreenshotCount) {
    chrome.browserAction.setBadgeText({ text: `${ newScreenshotCount + 1 }` });
}

function updateNewScreenshotCounter(newScreenshotCount) {
    chrome.storage.local.set({ [NEW_SCREENSHOT_COUNT_STORAGE_KEY]: newScreenshotCount + 1 });
}

function notifySuccessfulScreenshotCapture(dataUrl) {
    if (chrome.notifications.onClicked.hasListeners()) {
        chrome.notifications.onClicked.removeListener();
    }

    chrome.notifications.create({ type: 'image', title: 'Screenshoter', message: 'Screenshot has been saved', iconUrl: 'assets/browser-48.png', imageUrl: dataUrl });

    chrome.notifications.onClicked.addListener(() => {
        chrome.tabs.create({ url: dataUrl });
    });

    if (PORT) {
        PORT.postMessage({ type: '[screenshot effects] add screenshot' });
    }
}

function loadExtensionSettingsFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(SCREENSHOT_SETTINGS_STORAGE_KEY, (items) => {
            resolve({
                ...INITIAL_SETTINGS,
                ...items[SCREENSHOT_SETTINGS_STORAGE_KEY],
            });
        });
    });
}

function loadScreenshotsFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(SCREENSHOT_DATA_STORAGE_KEY, (items) => {
            resolve(items[SCREENSHOT_DATA_STORAGE_KEY] || []);
        });
    });
}

function loadActiveTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true }, (tabs) => {
            resolve(tabs.find((tab) => tab.active));
        });
    });
}

function loadNewScreenshotCount() {
    return new Promise((resolve) => {
        chrome.storage.local.get(NEW_SCREENSHOT_COUNT_STORAGE_KEY, (items) => {
            resolve(+items[NEW_SCREENSHOT_COUNT_STORAGE_KEY] || 0);
        });
    });
}

function dataUrlToBytes(dataUrl) {
    return window.atob(dataUrl.split(',')[1]).length;
}

function uuid() {
    let dt = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
