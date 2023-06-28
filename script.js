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

    // callAPI function that takes the base and exponent numbers as parameters
    var callAPI = (search)=>{
        // instantiate a headers object
        var myHeaders = new Headers();
        // add content type header to object
        myHeaders.append("Content-Type", "application/json");
        // using built in JSON utility package turn object to string and store in a variable
        var raw = JSON.stringify({"search": search});
        // create a JSON object with parameters for API call and store in a variable
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        // make API call with parameters and use promises to get response
        fetch("https://8gi380k5nd.execute-api.ap-northeast-1.amazonaws.com/Dev", requestOptions)
        .then(response => response.text())
        .then(result => alert(JSON.parse(result).body))
        .catch(error => console.log('error', error));
    }