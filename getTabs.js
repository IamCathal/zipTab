function loadData() {
    chrome.storage.sync.get(null, function(res) {
        let infoBox = document.getElementById("tester");
        let output = "";

        for (let key in res) {
            output += `<div class="yuppa1"><table>`;
            output += `<tr><div class="yuppa2"><a href="" id="${key}Link">${key}</a> <a class="delButton" id="${key}">x</a></div></tr>`;
            for (let i = 0; i < res[key].length; i++) {
                console.log(res[key][i][0]);
                output += `<a href="${res[key][i][0]}" target="_blank"><img src="${res[key][i][1]}" title="${res[key][i][0]}" class="favs"></a>`;
            }
            output += `</table></div>`;
        }

        infoBox.innerHTML = output;
    });
}


document.getElementById("snapshot").addEventListener("click", function() {

    chrome.tabs.query({ 'currentWindow': true }, function(tabs) {
        let currentTabs = new Array();
        const url = new URL(tabs[0].url);
        let infoBox = document.getElementById("tester");
        output = "";
        const thisBatch = window.prompt("Enter batch name: ");

        output += `<div class="yuppa1"><table>`;
        output += `<tr><div class="yuppa2"> <a href="">${thisBatch}</a> </div></tr></br><tr class="yuppa3">`;

        for (let i = 0; i < tabs.length; i++) {
            const url = new URL(tabs[i].url);
            const urlPath = url.pathname.split("/");
            const favUrl = tabs[i].favIconUrl;

            output += `<a href="${url}" title="${url.hostname}"><img src="${favUrl}" class="favs"></a> `;

            const currentEntry = []
            currentEntry.push(url.href);
            currentEntry.push(favUrl);

            currentTabs.push(currentEntry);
        }
        output += `</tr></table></div>`;

        infoBox.innerHTML = output;

        let tabsJSON = {}
        tabsJSON[thisBatch] = currentTabs;
        chrome.storage.sync.set(tabsJSON);
        loadData();

    });
});

document.querySelector('#tester').addEventListener("click", function(e) {
    chrome.storage.sync.getBytesInUse(e.target.id, function(bytes) {
        if (bytes > 0) {
            chrome.storage.sync.remove(e.target.id);
            loadData();
        }
    });

    if (e.target.id.includes("Link")) {
        const actualTargetName = e.target.id.slice(0, -4);
        chrome.storage.sync.get(actualTargetName, function(res) {
            console.log(actualTargetName + " : " + JSON.stringify(res));
            for (let i = 0; i < res[actualTargetName].length; i++) {
                chrome.tabs.create({ "url": res[actualTargetName][i][0] });
            }
        });
    }

});

document.onload(loadData());