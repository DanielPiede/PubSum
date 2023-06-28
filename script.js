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

function handleSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the value entered in the search input
    const searchValue = document.getElementById('search').value;

    // Make the API call with the search value
    fetch(`https://8gi380k5nd.execute-api.ap-northeast-1.amazonaws.com/Dev?q=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            // Display the results on the page
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = ''; // Clear previous results

        if (data && data.length > 0) {
            data.forEach(result => {
                const resultItem = document.createElement('p');
                resultItem.textContent = result;
                searchResults.appendChild(resultItem);
            });
        }   
        else {
            const noResults = document.createElement('p');
            noResults.textContent = 'No results found.';
            searchResults.appendChild(noResults);
        }
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'An error occurred while fetching results.';
            searchResults.appendChild(errorMessage);
        });
    }

    // Add an event listener to the form to handle submission
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', handleSubmit);