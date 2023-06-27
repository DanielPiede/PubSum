function togglemenu() {
    var menuList = document.getElementById("menuList");

    if (menuList.style.maxHeight === "0px") {
        menuList.style.maxHeight = "130px";
    } else {
        menuList.style.maxHeight = "0px";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Code that needs to be executed on DOMContentLoaded event
    // This could be any additional initialization code
});