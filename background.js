var contentPort = null;
var popupPort = null;
chrome.runtime.onConnect.addListener(port => {
    if (port.name == 'contentPort') {
        contentPort = port;
        port.onMessage.addListener(function (msg, sender) {
            if (msg.type == 'getStatus') {
                port.postMessage({
                    type: msg.type,
                    value: localStorage.getItem(PROTECTUS_STORAGE)
                })
            }

            if (msg.type == 'getPredict') {
                let data = msg.value;
                let request = { "text": data }
                fetch(BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request)
                })
                    .then(response => {
                        if (response.status != 200) {
                            console.log('Request error code ' + response.status);
                            return;
                        }
                        response.json().then(data => {
                            port.postMessage({
                                type: msg.type,
                                cmtId: msg.cmtId,
                                value: data
                            })
                        })
                    })
                    .catch(err => {
                        console.log('Error: ', err)
                    });
            }
        });
    }

    if (port.name == 'popupPort') {
        popupPort = port;
        port.onMessage.addListener(function (msg, sender) {
            if (msg.type == 'setStatus') {
                contentPort.postMessage({
                    type: msg.type,
                    value: msg.value
                });
            }
        });
    }
});