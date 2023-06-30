function includeHTML() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("navbar-placeholder").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "navbar.html", true);
    xhttp.send();
}

includeHTML();

document.addEventListener('DOMContentLoaded', function() {});

function togglemenu() {

    if (menuList.style.maxHeight === "0px") {
        menuList.style.maxHeight = "130px";
    } else {
        menuList.style.maxHeight = "0px";
    }
}

function callAPI(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var searchInput = document.getElementById('search');
    var searchValue = searchInput.value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"search": searchValue});
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // Create the loading icon element
    var loadingIcon = document.createElement('img');
    loadingIcon.src = 'icons/loading.gif'; // Replace 'path/to/loading.gif' with the actual path to your GIF file
    loadingIcon.classList.add('loading-icon'); // Add a CSS class for styling the loading icon

    // Append Loading Icon
    
    var searchResults = document.getElementById('loading-container');
    searchResults.innerHTML = '';
    searchResults.appendChild(loadingIcon);


    fetch("https://8gi380k5nd.execute-api.ap-northeast-1.amazonaws.com/Dev", requestOptions)
        .then(response => response.json()) // Parse the response as JSON
        .then(result => {

        // Iterate through the papers and generate HTML elements dynamically
        result.body.papers.forEach(paper => {

            // Create the outer accordion div
            // Counter variable for unique IDs


        // Create the outer accordion div
        var accordionDiv = document.createElement("div");
        accordionDiv.className = "accordion accordion-flush";
        accordionDiv.id = "accordionFlushExample";

        // Create the first accordion item
        var accordionItemDiv = document.createElement("div");
        accordionItemDiv.className = "accordion-item";

        // Create the first accordion header
        var accordionHeader = document.createElement("h2");
        accordionHeader.className = "accordion-header";
        var headingID = generateUniqueID();
        accordionHeader.id = headingID;

        // Create the button within the accordion header
        var accordionButton = document.createElement("button");
        accordionButton.className = "accordion-button collapsed";
        accordionButton.type = "button";
        accordionButton.setAttribute("data-bs-toggle", "collapse");
        var collapseTargetID = generateUniqueID();
        accordionButton.setAttribute("data-bs-target", "#" + collapseTargetID);
        accordionButton.setAttribute("aria-expanded", "false");
        accordionButton.setAttribute("aria-controls",collapseTargetID);
        accordionButton.textContent = paper.Date + " " + paper.Title;

        // Append the button to the accordion header
        accordionHeader.appendChild(accordionButton);

        // Create the accordion collapse div
        var accordionCollapseDiv = document.createElement("div");
        accordionCollapseDiv.id = collapseTargetID;
        accordionCollapseDiv.className = "accordion-collapse collapse";
        accordionCollapseDiv.setAttribute("aria-labelledby", headingID);
        accordionCollapseDiv.setAttribute("data-bs-parent", "#accordionFlushExample");

        // Create the accordion body
        var accordionBodyDiv = document.createElement("div");
        accordionBodyDiv.className = "accordion-body";
        accordionBodyDiv.textContent = "This should include the FullText summary created by the language model";

        // Append the accordion body to the accordion collapse div
        accordionCollapseDiv.appendChild(accordionBodyDiv);

        // Append the accordion header and collapse div to the accordion item
        accordionItemDiv.appendChild(accordionHeader);
        accordionItemDiv.appendChild(accordionCollapseDiv);

        // Append the accordion item to the outer accordion div
        accordionDiv.appendChild(accordionItemDiv);

        // Append the accordion div to the desired container element on your page
        var container = document.getElementById("search-results"); // Replace "container" with the actual ID of the container element
        container.appendChild(accordionDiv);
        });
        // Remove the loading icon
        searchResults.removeChild(loadingIcon);
    })
    .catch(error => console.log('error', error));
}

var counter = 1;

// Function to generate unique IDs
function generateUniqueID() {
var uniqueID = "accordionItem" + counter;
counter++;
return uniqueID;
}
