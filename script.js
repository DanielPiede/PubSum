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
        .then(response => response.text())
        .then(result => {
        var searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = JSON.parse(result).body;
        })
        .catch(error => console.log('error', error));
    }