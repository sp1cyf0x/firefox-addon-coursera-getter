var submissionID = "";
function displayLink(injectionResult) {
  var id = injectionResult?.[0].result;
  if (id == null) {
    document.querySelector(".input-group").style.display = "none";
    document.querySelector(".container").innerHTML += `
    <div class="alert alert-warning" role="alert">
        Make sure you are in the <strong>My submission</strong> tab.
    </div>
    `;
  } else {
    submissionID = id.substring(0, id.indexOf("~"));
    browser.tabs.query({ active: true, currentWindow: true }, function (tab) {
      //Be aware that `tab` is an array of Tabs
      let fromIndex = 0;
      let countSlash = 0;
      //https://www.coursera.org/learn/detect-mitigate-ethical-risks/peer/oqeJE/algorithmic-impact-assessment-aia/submit
      //      ^^                ^     ^                             ^    ^     ^                                 ^
      //Total 8 slash before the end of "real" link
      //So we will romescan ultil slash number 8 and then stop
      while (tab[0].url.indexOf("/", fromIndex) != -1) {
        fromIndex = tab[0].url.indexOf("/", fromIndex + 1);
        countSlash++;
        if (countSlash >= 8) break;
      }
      document.querySelector("#shareLink").value =
        tab[0].url.substring(0, fromIndex) + "/review/" + submissionID;
    });
  }
}

function getSubmissionId() {
  return document.getElementsByClassName("_10nd10j")[0]?.id;
}

browser.tabs.query({ active: true }, function (tabs) {
  var tab = tabs[0];
  tab_title = tab.title;
  browser.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: getSubmissionId,
    },
    displayLink
  );
});

window.onload = function () {
  "use strict";

  function copyToClipboard(elem) {
    var target = elem;

    // select the content
    var currentFocus = document.activeElement;

    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;

    try {
      succeed = document.execCommand("copy");
    } catch (e) {
      console.warn(e);

      succeed = false;
    }

    // Restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
      currentFocus.focus();
    }

    if (succeed) {
      document.getElementsByClassName("copied")[0].style.display = "inline";
    }

    return succeed;
  };
  document.getElementById("shareLink").addEventListener("click", function () {
    copyToClipboard(document.getElementById("shareLink"));
  });
}
