function loadData() {
    /**
     *  Loads all the snapshots from the sync storage area when called
     */
    chrome.storage.sync.get(null, function(res) {
        let infoBox = document.getElementById("tester");
        let output = "";

        for (let key in res) {
            // For every snapshot in the returned object
            output += `<div class="yuppa1"><table>`;
            output += `<tr><div class="yuppa2"><a href="" id="${key}Link" class="noUnderline">${key}</a> <a href="" class="delButton noUnderline" id="${key}Delete">x</a></div></tr>`;

            // For every link in one specific snapshot
            for (let i = 0; i < res[key].length; i++) {
                console.log(res[key][i][0]);
                output += `<a href="${res[key][i][0]}" target="_blank"><img src="${res[key][i][1]}" title="${res[key][i][0]}" class="favs"></a>`;
            }
            output += `</table></div>`;
        }
        infoBox.innerHTML = output;
    });
}

function addSnapshot() {
    /**
     *  Cleans the snapshot name to make sure no < or > characters are in there.
     *  Then it parses the active tabs and adds them to the synced storage
     */
    let snapshotName = document.getElementById("snapshotNameBox").value;
    snapshotName = snapshotName.replace(/</g, "").replace(/>/g, "");
    console.log(snapshotName);

    chrome.tabs.query({ 'currentWindow': true }, function(tabs) {
        let infoBox = document.getElementById("tester");
        let currentTabs = new Array();
        let output = ""

        const url = new URL(tabs[0].url);

        output += `<div class="yuppa1"><table>`;
        output += ` <tr>
                        <div class="yuppa2"> 
                            <a href=""> ${snapshotName} </a> 
                        </div>
                    </tr>`;

        for (let i = 0; i < tabs.length; i++) {
            const url = new URL(tabs[i].url);
            const urlPath = url.pathname.split("/");
            const favUrl = tabs[i].favIconUrl;

            output += `<a href="${url}" title="${url.hostname}"> <img src="${favUrl}" class="favs"> </a>`;

            /**
             * currentEntry = ["link","faviconUrl"]
             */
            let currentEntry = []
            currentEntry.push(url.href);
            currentEntry.push(favUrl);

            currentTabs.push(currentEntry);
        }
        output += `</tr></table></div>`;
        infoBox.innerHTML = output;

        let tabsJSON = {}
        tabsJSON[snapshotName] = currentTabs;
        chrome.storage.sync.set(tabsJSON);
        loadData();
    });
}

document.getElementById("snapshot").addEventListener("click", function() {
    /**
     * When new snapshot is clicked, generate the box to enter it's details
     */
    let infoBox = document.getElementById("tester");
    console.log(infoBox.innerHTML);
    if (!infoBox.innerHTML.includes("snapshotNameBox")) {
        output = `  <div class="yuppa1">
                    <table>
                        <tr>
                            <div class="yuppa2">
                                    <input type="text" placeholder="Enter Name" id="snapshotNameBox" class="inputBox" maxlength="17" size="19">
                                    <a href=""> <span class="yesBox" id="addSnapshot">Add</span> </a>
                            </div>
                        </tr>
                    </table>
                </div>`;
        infoBox.innerHTML += output;
    }
});

document.querySelector('#tester').addEventListener("click", function(e) {
    /**
     * Listens for clicks anywhere in the extension window
     * checks the event's target ID to then decide what to do.
     */

    /**
     * See if the ID has any data in our synced storage.
     * The x buttons have their delete at the end of their IDs,
     * if it does have delete, delete the snapshot it references
     */
    if (e.target.id.includes("Delete")) {
        const actualTargetName = e.target.id.slice(0, -6);
        chrome.storage.sync.remove(actualTargetName).then((res) => {
            loadData();
        });
    }

    /**
     * If the ID includes "Link" (The buttons to open the snapshots)
     * Open all the tabs in that specific snapshot.
     */
    if (e.target.id.includes("Link")) {
        const actualTargetName = e.target.id.slice(0, -4);
        chrome.storage.sync.get(actualTargetName, function(res) {
            console.log(actualTargetName + " : " + JSON.stringify(res));
            for (let i = 0; i < res[actualTargetName].length; i++) {
                chrome.tabs.create({ "url": res[actualTargetName][i][0] });
            }
        });
    } else if (e.target.id === "addSnapshot") {
        addSnapshot();
    }
});

loadData()