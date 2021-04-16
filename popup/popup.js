let buttonAction = document.getElementById("buttonAction");
if (localStorage.getItem(PROTECTUS_STORAGE) == ACTIVE) {
  buttonAction.checked = true;
}

var popupPort = chrome.runtime.connect(null, { name: "popupPort" });

buttonAction.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let status = localStorage.getItem(PROTECTUS_STORAGE);
    if (status == INACTIVE) {
      popupPort.postMessage({
        type: "setStatus",
        value: ACTIVE
      });
      localStorage.setItem(PROTECTUS_STORAGE, ACTIVE);
    } else {
      popupPort.postMessage({
        type: "setStatus",
        value: INACTIVE
      });
      localStorage.setItem(PROTECTUS_STORAGE, INACTIVE);
    }
  });
};
