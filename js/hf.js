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