const form = document.querySelector("form");
const button = document.querySelector("button[type=submit]");
const alertBox = document.querySelector("#alert");
const requestVidsElement = document.getElementById("listOfRequests");
const baseUrl = "http://localhost:7777";

// Listener

document.addEventListener("DOMContentLoaded", async () => {
  fetch(baseUrl + "/video-request")
    .then((blob) => blob.json())
    .then((data) => {
      data.forEach((videoInfo) => {
        requestVidsElement.appendChild(getSignleVidReq(videoInfo));
      });
    });

  // send video request
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    sendVideoRequest(formData);
  });
});

async function sendVideoRequest(payload) {
  // XHR => XMLHttpRequest
  // It's can be used with JSON & FORM DATA as well

  const res = await fetch(baseUrl + "/video-request", {
    method: "post",
    body: payload,
  });
  console.log(res);
}

async function getAllVideoRequest() {
  return await fetch(baseUrl + "/video-request");
}

function getSignleVidReq(videoInfo) {
  const div = document.createElement("div");
  div.innerHTML = `
        <div class="card mb-3" >
              <div class="card-body d-flex justify-content-between flex-row">
                <div class="d-flex flex-column">
                  <h3>${videoInfo.topic_title}</h3>
                  <p class="text-muted mb-2">${videoInfo.topic_details}</p>
                  <p class="mb-0 text-muted">
                    <strong>Expected results:</strong> ${
                      videoInfo.expected_result
                    }
                  </p>
                </div>
                <div class="d-flex flex-column text-center">
                  <a class="btn btn-link">🔺</a>
                  <h3>0</h3>
                  <a class="btn btn-link">🔻</a>
                </div>
              </div>
              <div class="card-footer d-flex flex-row justify-content-between">
                <div>
                  <span class="text-info">${videoInfo.status.toUpperCase()}</span>
                  &bullet; added by <strong>${videoInfo.author_name}</strong> on
                  <strong>${new Date(
                    videoInfo.submit_date
                  ).toLocaleDateString()}</strong>
                </div>
                <div
                  class="d-flex justify-content-center flex-column 408ml-auto mr-2"
                >
                  <div class="badge badge-success">${videoInfo.target_level.toUpperCase()}</div>
                </div>
              </div>
            </div>
      `;
  return div;
}
