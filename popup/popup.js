let buttonComment = document.getElementById("buttonComment");
let buttonMessage = document.getElementById("buttonMessage");

let popupPort = chrome.runtime.connect(null, { name: "popupPort" });

if (localStorage.getItem(PROTECTUS_COMMENT_STATUS_STORAGE) == ACTIVE) {
  buttonComment.checked = true;
}
if (localStorage.getItem(PROTECTUS_MESSAGE_STATUS_STORAGE) == ACTIVE) {
  buttonMessage.checked = true;
}


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

