let contentPort = chrome.runtime.connect(null, { name: "contentPort" });

let commentData = new Array();
let messageData = new Array();
let commentStatus = null;
let messageStatus = null;

execute();

window.addEventListener("scroll", function () {
    execute();
});

window.addEventListener("mousemove", function () {
    execute();
});

window.addEventListener("click", function () {
    execute();
});

contentPort.onMessage.addListener(function (msg, sender) {
    if (msg.type == "getPredict") {
        let from = msg.from;
        let dataId = msg.dataId;
        let prediction = msg.value.prediction;
        console.log("prediction ", prediction);
        if (from == "comment") {
            if (prediction == true) {
                commentData[dataId].prediction = true;
                commentData[dataId].originalText = new String(commentData[dataId].innerText);
            } else {
                commentData[dataId].prediction = false;
            }
        }
        if (from == "message") {
            if (prediction == true) {
                messageData[dataId].prediction = true;
                messageData[dataId].originalText = new String(messageData[dataId].innerText);
            } else {
                messageData[dataId].prediction = false;
            }
        }
        console.log("commentData ", commentData);
        console.log("messageData ", messageData);
    }
    
    if (msg.type == "setCommentStatus") {
        let status = msg.value;
        if (status == ACTIVE) {
            hideComment();
        } else {
            showComment();
        }
    }
    if (msg.type == "setMessageStatus") {
        let status = msg.value;
        if (status == ACTIVE) {
            hideMessage();
        } else {
            showMessage();
        }
    }
});

function execute() {
    getCommentData();
    getMessageData();
    getStatus();
    if (commentStatus == ACTIVE && commentData.length != 0) hideComment();
    if (messageStatus == ACTIVE && messageData.length != 0) hideMessage();
    window.fb
}

function getCommentData() {
    let datas = Array.from(
        document.getElementsByClassName("ecm0bbzt e5nlhep0 a8c37x1j")
    );
    for (let data of datas) {
        if (!commentData.includes(data)) {
            contentPort.postMessage({
                type: "getPredict",
                from: "comment",
                dataId: commentData.length,
                value: data.innerText,
            });
            commentData.push(data);
            console.log(commentData);
        }
    }
}

function getMessageData() {
    let datas = Array.from(
        document.getElementsByClassName("ni8dbmo4 stjgntxs ii04i59q")
    );
    for (let data of datas) {
        if (!messageData.includes(data)) {
            contentPort.postMessage({
                type: "getPredict",
                from: "message",
                dataId: messageData.length,
                value: data.innerText,
            });
            messageData.push(data);
            console.log(messageData);
        }
    }
}

function getStatus() {
    contentPort.postMessage({ type: "getCommentStatus" });
    contentPort.onMessage.addListener(function (msg, sender) {
        if (msg.type == "getCommentStatus") {
            commentStatus = msg.value;
        }
    });

    contentPort.postMessage({ type: "getMessageStatus" });
    contentPort.onMessage.addListener(function (msg, sender) {
        if (msg.type == "getMessageStatus") {
            messageStatus = msg.value;
        }
    });
}

function hideComment() {
    for (let data of commentData) {
        if (data.prediction == true) {
            data.firstChild.firstChild.innerText = HIDDEN_TEXT;
        }
    }
}

function showComment() {
    for (let data of commentData) {
        if (data.prediction == true) {
            data.firstChild.firstChild.innerText = data.originalText;
            data.firstChild.firstChild.innerHTML = data.originalText;
        }
    }
}

function hideMessage() {
    for (let data of messageData) {
        if (data.prediction == true) {
            data.firstChild.firstChild.innerText = HIDDEN_TEXT;
        }
    }
}

function showMessage() {
    for (let data of messageData) {
        if (data.prediction == true) {
            data.firstChild.firstChild.innerText = data.originalText;
            data.firstChild.firstChild.innerHTML = data.originalText;
        }
    }
}