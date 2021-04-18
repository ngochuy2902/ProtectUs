let contentPort = null;
let popupPort = null;
chrome.runtime.onConnect.addListener(port => {
    if (port.name == 'contentPort') {
        contentPort = port;
        contentPort.onMessage.addListener(function (msg, sender) {
            if (msg.type == 'getCommentStatus') {
                contentPort.postMessage({
                    type: msg.type,
                    value: localStorage.getItem(PROTECTUS_COMMENT_STATUS_STORAGE)
                })
            } else if (msg.type == 'getMessageStatus') {
                contentPort.postMessage({
                    type: msg.type,
                    value: localStorage.getItem(PROTECTUS_MESSAGE_STATUS_STORAGE)
                })
            } else if (msg.type == 'getPredict') {
                let text = msg.value;
                let request = { "text": text };
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
                                from: msg.from,
                                dataId: msg.dataId,
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
        popupPort.onMessage.addListener(function (msg, sender) {
            if (!contentPort) {
                return;
            }
            if (msg.type == 'setCommentStatus') {
                contentPort.postMessage({
                    type: msg.type,
                    value: msg.value
                });
            }
            if (msg.type == 'setMessageStatus') {
                contentPort.postMessage({
                    type: msg.type,
                    value: msg.value
                });
            }
        });
    }
});