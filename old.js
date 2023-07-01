    function includeHTML() {
        var navbarRequest = new XMLHttpRequest();
        navbarRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("navbar-placeholder").innerHTML = this.responseText;
            includeFooter();
        }
        };
        navbarRequest.open("GET", "navbar.html", true);
        navbarRequest.send();
    }
    
    function includeFooter() {
        var footerRequest = new XMLHttpRequest();
        footerRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("footer-placeholder").innerHTML = this.responseText;
        }
        };
        footerRequest.open("GET", "footer.html", true);
        footerRequest.send();
    }
    
    includeHTML();
    includeFooter()
    
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
        var loadingIcon = document.createElement("img");
        loadingIcon.src = "icons/loading.gif"; // Replace 'path/to/loading.gif' with the actual path to your GIF file
        loadingIcon.classList.add("loading-icon"); // Add a CSS class for styling the loading icon
    
        var loadingContainer = document.getElementById("loading-container");
        loadingContainer.innerHTML = "";
        loadingContainer.appendChild(loadingIcon);
    
        // Append Loading Icon and clear search results:
        var searchResults = document.getElementById("search-results");
        searchResults.innerHTML = "";
    
        fetch("https://8gi380k5nd.execute-api.ap-northeast-1.amazonaws.com/Dev", requestOptions)
        .then((response) => response.json()) // Parse the response as JSON
        .then((result) => {
            // Iterate through the papers and generate HTML elements dynamically
            result.body.papers.forEach((paper) => {
            // Create the card element
            var card = document.createElement("div");
            card.className = "card";
    
            // Create the card header
            var cardHeader = document.createElement("div");
            cardHeader.className = "card-header";
    
            // Create the date badge within the card header
            var dateBadge = document.createElement("span");
            dateBadge.className = "badge badge-primary";
            dateBadge.textContent = paper.Date;
    
            // Create the title of the paper within the card header
            var paperTitle = document.createElement("a");
            paperTitle.className = "paper-title";
            paperTitle.href = paper.Link;
            paperTitle.target = "_blank";
            paperTitle.textContent = paper.Title;
    
            // Create the AI Summary button within the card header
            var summaryButton = document.createElement("button");
            summaryButton.className = "btn btn-outline-primary ml-auto ai-summary-button";
            summaryButton.textContent = "AI Summary";
            summaryButton.setAttribute("data-bs-toggle", "collapse");
            var collapseTargetID = generateUniqueID();
            summaryButton.setAttribute("data-bs-target", "#" + collapseTargetID);
            summaryButton.setAttribute("aria-expanded", "false");
            summaryButton.setAttribute("aria-controls", collapseTargetID);
    
            // Append the date badge, paper title, and AI Summary button to the card header
            cardHeader.appendChild(dateBadge);
            cardHeader.appendChild(paperTitle);
            cardHeader.appendChild(summaryButton);
    
            // Create the card body
            var cardBody = document.createElement("div");
            cardBody.id = collapseTargetID;
            cardBody.className = "collapse";
            cardBody.setAttribute("aria-labelledby", collapseTargetID);
    
            // Create the card body content
            var cardBodyContent = document.createElement("div");
            cardBodyContent.className = "card-body";
            cardBodyContent.textContent = "This should include the AI Summary content";
    
            // Append the card body content to the card body
            cardBody.appendChild(cardBodyContent);
    
            // Append the card header and card body to the card
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
    
            // Append the card to the search results container
            searchResults.appendChild(card);
            });
    
            // Remove the loading icon
            loadingContainer.removeChild(loadingIcon);
        })
        .catch((error) => console.log("error", error));
    }
    
    var counter = 1;
    
    // Function to generate unique IDs
    function generateUniqueID() {
        var uniqueID = "cardCollapse" + counter;
        counter++;
        return uniqueID;
    }
    