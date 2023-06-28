$(document).ready(function() {
    $.ajax({
        url: 'header.html',
        dataType: 'html',
        success: function(data) {
            $('#header-placeholder').replaceWith(data);
            var menuList = document.getElementById("menuList")
            menuList.style.maxHeight = "0px"
        }
    });
    $.ajax({
        url: 'footer.html',
        dataType: 'html',
        success: function(data) {
            $('#footer-placeholder').replaceWith(data);
        }
    });
});

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

    fetch("https://8gi380k5nd.execute-api.ap-northeast-1.amazonaws.com/Dev", requestOptions)
        .then(response => response.json()) // Parse the response as JSON
        .then(result => {
        var searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = ''; // Clear the search results container

        // Iterate through the papers and generate HTML elements dynamically
        result.body.papers.forEach(paper => {
            // Create a div element for the paper box
            var paperBox = document.createElement('div');
            paperBox.classList.add('paper-box');

            // Create a paragraph element for the date
            var dateElement = document.createElement('p');
            dateElement.textContent = paper.Date;

            // Create a heading element for the title
            var titleElement = document.createElement('h3');
            titleElement.textContent = paper.Title;

            // Append the date and title elements to the paper box
            paperBox.appendChild(dateElement);
            paperBox.appendChild(titleElement);

            // Append the paper box to the search results container
            searchResults.appendChild(paperBox);
        });
    })
    .catch(error => console.log('error', error));
}
