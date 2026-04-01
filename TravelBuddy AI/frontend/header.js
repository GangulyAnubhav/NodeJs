document.addEventListener("DOMContentLoaded", () => {

const currentPage = window.location.pathname.split("/").pop();

const header = `
    <nav class="navbar">
        <div class="logo"> TravelBuddy AI</div>
        <ul class="nav-links">
            <li><a href="index.html" id="homeLink">Home</a></li>
            <li><a href="about.html" id="aboutLink">About Us</a></li>
        </ul>
    </nav>
`;

document.body.insertAdjacentHTML("afterbegin", header);

// Highlight active page
if (currentPage === "about.html") {
    document.getElementById("aboutLink").classList.add("active");
} else {
    document.getElementById("homeLink").classList.add("active");
}

});
