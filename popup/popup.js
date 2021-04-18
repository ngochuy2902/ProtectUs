let buttonComment = document.getElementById("buttonComment");
let buttonMessage = document.getElementById("buttonMessage");
let commentCountText = document.getElementById("commentCount");
let messageCountText = document.getElementById("messageCount");

let popupPort = chrome.runtime.connect(null, { name: "popupPort" });

popupPort.postMessage({
  type: "initPort"
});

if (localStorage.getItem(PROTECTUS_COMMENT_STATUS_STORAGE) == ACTIVE) {
  buttonComment.checked = true;
}
if (localStorage.getItem(PROTECTUS_MESSAGE_STATUS_STORAGE) == ACTIVE) {
  buttonMessage.checked = true;
}

commentCountText.innerText = localStorage.getItem(PROTECTUS_COMMENT_COUNT_STORAGE);
messageCountText.innerText = localStorage.getItem(PROTECTUS_MESSAGE_COUNT_STORAGE);

buttonComment.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (localStorage.getItem(PROTECTUS_COMMENT_STATUS_STORAGE) == INACTIVE) {
      popupPort.postMessage({
        type: "setCommentStatus",
        value: ACTIVE
      });
      localStorage.setItem(PROTECTUS_COMMENT_STATUS_STORAGE, ACTIVE);
    } else {
      popupPort.postMessage({
        type: "setCommentStatus",
        value: INACTIVE
      });
      localStorage.setItem(PROTECTUS_COMMENT_STATUS_STORAGE, INACTIVE);
    }
  });
};

buttonMessage.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (localStorage.getItem(PROTECTUS_MESSAGE_STATUS_STORAGE)  == INACTIVE) {
      popupPort.postMessage({
        type: "setMessageStatus",
        value: ACTIVE
      });
      localStorage.setItem(PROTECTUS_MESSAGE_STATUS_STORAGE, ACTIVE);
    } else {
      popupPort.postMessage({
        type: "setMessageStatus",
        value: INACTIVE
      });
      localStorage.setItem(PROTECTUS_MESSAGE_STATUS_STORAGE, INACTIVE);
    }
  });
};

popupPort.onMessage.addListener(function (msg, sender) {
  if (msg.type == "setCommentCount") {
    if (localStorage.getItem(PROTECTUS_COMMENT_COUNT_STORAGE) < +msg.countNumber) {
      commentCountText.innerText = msg.countNumber;
      localStorage.setItem(PROTECTUS_COMMENT_COUNT_STORAGE, msg.countNumber);
    }
  }
  if (msg.type == "setMessageCount") {
    if (localStorage.getItem(PROTECTUS_MESSAGE_COUNT_STORAGE) < +msg.countNumber) {
      messageCountText.innerText = msg.countNumber;
      localStorage.setItem(PROTECTUS_MESSAGE_COUNT_STORAGE, msg.countNumber);
    }
  }
});