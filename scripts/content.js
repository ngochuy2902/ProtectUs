var contentPort = chrome.runtime.connect(null, { name: 'contentPort' });

let cmt = new Array();
var status = null;

execute();

window.addEventListener('scroll', function () {
    execute();
});

contentPort.onMessage.addListener(function (msg, sender) {
    if (msg.type == 'getPredict') {
        let cmtId = msg.cmtId;
        let prediction = msg.value.prediction;
        if (prediction == true) {
            cmt[cmtId].prediction = true;
        } else {
            cmt[cmtId].prediction = false;
        }
    }
    if (msg.type == 'setStatus') {
        let status = msg.value;
        if (status == ACTIVE) {
            hideComment();
        } else {
            showComment();
        }
    }
});

function execute() {
    getData();
    getStatus();
    if (status == ACTIVE) hideComment();
}

function getData() {
    let data = Array.from(
        document.getElementsByClassName('ecm0bbzt e5nlhep0 a8c37x1j')
    );
    for (let i of data) {
        if (!cmt.includes(i)) {
            contentPort.postMessage({ type: 'getPredict', cmtId: cmt.length, value: i.innerText });
            cmt.push(i);
        }
    }
}

function getStatus() {
    contentPort.postMessage({ type: 'getStatus' });
    contentPort.onMessage.addListener(function (msg, sender) {
        if (msg.type == 'getStatus') {
            status = msg.value;
        }
    });
}

function hideComment() {
    for (let i of cmt) {
        if (i.prediction == true) {
            i.originalText = new String(i.firstChild.firstChild.innerText);
            i.firstChild.firstChild.innerText = HIDDEN_TEXT;
        }
    }
}

function showComment() {
    for (let i of cmt) {
        if (i.prediction == true) {
            i.firstChild.firstChild.innerText = i.originalText;
            i.firstChild.firstChild.innerHTML = i.originalText;
        }
    }
}







