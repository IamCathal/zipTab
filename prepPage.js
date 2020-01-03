function loadPresets() {
    chrome.storage.local.set({ "yupp": "2" });

    chrome.storage.local.get(null, function(result) {
        let infoBox = document.getElementById("tester2");
        infoBox.innerHTML = "<br>YUPP: " + result.identifier;
    });
}

document.onload = loadPresets();