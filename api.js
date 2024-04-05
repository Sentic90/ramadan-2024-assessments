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
        const voteUp = document.querySelector(`#votes_ups_${videoInfo._id}`);
        const voteDown = document.querySelector(
          `#votes_downs_${videoInfo._id}`
        );
        const score = document.querySelector(`#score_${videoInfo._id}`);

        voteUp.addEventListener("click", (e) => {
          const payload = JSON.stringify({
            id: videoInfo._id,
            vote_type: "ups",
          });
          fetch(baseUrl + "/video-request/vote", {
            method: "PUT",
            headers: {
              "content-Type": "application/json",
            },
            body: payload,
          })
            .then((blob) => blob.json())
            .then((data) => {
              score.innerText = data.ups - data.downs;
            });
        });

        voteDown.addEventListener("click", (e) => {
          const payload = JSON.stringify({
            id: videoInfo._id,
            vote_type: "downs",
          });
          fetch(baseUrl + "/video-request/vote", {
            method: "PUT",
            headers: {
              "content-Type": "application/json",
            },
            body: payload,
          })
            .then((blob) => blob.json())
            .then((data) => {
              score.innerText = data.ups - data.downs;
            });
        });
      });
    });
});

// send video request
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  fetch(baseUrl + "/video-request", { method: "post", body: formData })
    .then((blob) => blob.json())
    .then((data) => {
      requestVidsElement.prepend(getSignleVidReq(data));
    });
});

// Voting
// up Vote

// async function sendVideoRequest(payload) {
//   // XHR => XMLHttpRequest
//   // It's can be used with JSON & FORM DATA as well

//   const res = await fetch(baseUrl + "/video-request", {
//     method: "post",
//     body: payload,
//   });
// }

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
                  ${
                    videoInfo.expected_result &&
                    `<strong>Expected results:</strong> ${videoInfo.expected_result}`
                  }  
                  
                  </p>
                </div>
                <div class="d-flex flex-column text-center">
                  <a id="votes_ups_${videoInfo._id}" class="btn btn-link">🔺</a>
                  <h3 id="score_${videoInfo._id}">${
    videoInfo.votes.ups - videoInfo.votes.downs
  }</h3>
                  <a id="votes_downs_${
                    videoInfo._id
                  }" class="btn btn-link">🔻</a>
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
