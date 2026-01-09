function toggleSearch() {
    var searchBox = document.getElementById("searchBox");
    var c2 = document.getElementById("con2");
    var nb = document.getElementById("nb");
    var nav = document.getElementById("nav");

    if(nav.style.display === "flex"){
        nav.style.display = "none";
        nb.style.borderRadius = "5px 10px 10px 5px";
    }

    if (searchBox.style.display === "none" || searchBox.style.display === "") {
        searchBox.style.display = "block";
        c2.style.width = "660px";
        nb.style.display = "none";
    } else {
        searchBox.style.display = "none";
        c2.style.width = "480px";
        nb.style.display = "block";
    }
}
function toggleProfile() {
    var profileBox = document.getElementById("profile");
    var pb = document.getElementById("pb");

    if(profileBox.style.display === "none" || profileBox.style.display === ""){
        profileBox.style.display = "block";
    } else {
        profileBox.style.display = "none";
    }
    document.body.addEventListener('click', () => {
        if(event.target !== profileBox && event.target !== pb){
            profileBox.style.display = "none";
        }
    })
}
function toggleMenu(){
    var menuBox = document.getElementById("menubox");
    var mb = document.getElementById("menu");

    if(menuBox.style.display === "none" || menuBox.style.display === ""){
        menuBox.style.display = "block";
    } else {
        menuBox.style.display = "none";
    }
    document.body.addEventListener('click', () => {
        if(event.target !== menuBox && event.target !== mb){
            menuBox.style.display = "none";
        }
    })
}
function toggleNav(){
    var nav = document.getElementById("nav");
    var c2 = document.getElementById("con2");
    var nb = document.getElementById("nb");
    var sb = document.getElementById("sb");

    if(nav.style.display === "none" || nav.style.display === ""){
        c2.style.width = "1520px";
        nav.style.display = "flex";
        nb.style.borderRadius = "10px 5px 5px 10px";
    }
    else{
        c2.style.width = "480px";
        nav.style.display = "none";
        nb.style.borderRadius = "5px 10px 10px 5px";
    }
}
function display(){
    var au = document.getElementById("abtus");
    var h = document.getElementById("help");
    var s = document.getElementById("sett");
    var cb = document.getElementById("cb");
    au.style.display = "block";
    au.style.zIndex = "1000";
    h.style.display = "block";
    h.style.zIndex = "1000";
    s.style.display = "block";
    s.style.zIndex = "1000";
    cb.style.transform = "scale(1.15)";

}
function undisplay(){
    var mor = document.getElementById("abtus");
    var h = document.getElementById("help");
    var s = document.getElementById("sett");
    var cb = document.getElementById("cb");
    mor.style.display = "none";
    h.style.display = "none";
    s.style.display = "none";
    cb.style.transform = "scale(1)";
}
function aboutus(){
    var mor = document.getElementById("abtus");
    var h = document.getElementById("help");
    var s = document.getElementById("sett");
    var cb = document.getElementById("cb");
    cb.style.transform = "scale(50)";
}
function setMedia() {
    var gr = document.querySelector("greet");
    var og = document.getElementById("ongoingevents");

    if(!gr || !og) return;

    let sw = window.innerWidth;

    if(sw > 1500){
        gr.style.left = "450px";
    }
    else if(sw > 1200){
        gr.style.left = "335px";
        og.style.top = "230px";
    }
    else if(sw > 1000){
        gr.style.left = "235px";
        og.style.top = "230px";
    }
}
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "landingpage.html";
}
setMedia();
window.addEventListener("resize", setMedia);