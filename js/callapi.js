document.addEventListener("DOMContentLoaded", function () {});
    
function callAPI(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    var searchInput = document.getElementById("search");
    var searchValue = searchInput.value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ search: searchValue });
    var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
    };

    // Create the loading icon element
    var loadingIcon = document.createElement("div");
    loadingIcon.className ="spinner-grow text-primary"
    loadingIcon.role = "status";

    var loadingSpan = document.createElement("span");
    loadingSpan.className = "visually-hidden";
    loadingSpan.textContent = "Loading...";

    loadingIcon.appendChild(loadingSpan);

    var loadingContainer = document.getElementById("loading-container");
    loadingContainer.appendChild(loadingIcon);

    // Append Loading Icon and clear search results:

    fetch("https://8gi380k5nd.execute-api.ap-northeast-1.amazonaws.com/Dev", requestOptions)
    .then((response) => response.json()) // Parse the response as JSON
    .then((result) => {
        buildPapers(result);
    })
    .catch((error) => console.log("error", error));

}
