console.log("{background.js}");

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("{browserAction}");
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("{background.js}:onMessage");
    if (request.cmd == 'getWeekNum') {
        console.log("getWeekNum");
    }
    return true;
});