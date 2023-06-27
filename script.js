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