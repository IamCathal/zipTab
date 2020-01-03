//get all contents of chrome storage
chrome.storage.sync.get(null, function(obj) {
    // console.log(JSON.stringify(obj));
    console.log(obj);
});

// chrome.storage.sync.clear(function() {
//     console.log("Cleared!");
// })