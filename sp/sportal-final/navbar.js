class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <nav>
          <div class="navbar">
            <i class='bx bx-menu'></i>
            <div class="logo"><a href="#">HOTEL MANAGEMENT</a></div>
            <div class="nav-links">
              <div class="sidebar-logo">
                <span class="logo-name">Student Portal</span>
                <i class='bx bx-x'></i>
              </div>
              <ul class="links">
                <li><a href="alumni.html">Home</a></li>
                <li><a href="mentorship.html">Book Room</a></li>
                <li><a href="offers.html">Available</a></li>
                <li><a href="offers.html">Payment</a></li>
                <li><a href="http://127.0.0.1:5000/">Ask AI for help</a></li>
              </ul>
            </div>
            <div class="search-box">
              <i class='bx bx-search'></i>
              <div class="input-box">
                <input type="text" placeholder="Search...">
              </div>
            </div>
          </div>
        </nav>
        `;

    this.addScriptAndEventListeners();
  }

  addScriptAndEventListeners() {
    // Add event listeners for the search box and sidebar toggle.
    let navbar = this.querySelector(".navbar");
    let searchBox = this.querySelector(".search-box .bx-search");

    searchBox.addEventListener("click", () => {
      navbar.classList.toggle("showInput");
      if (navbar.classList.contains("showInput")) {
        searchBox.classList.replace("bx-search", "bx-x");
      } else {
        searchBox.classList.replace("bx-x", "bx-search");
      }
    });

    // Sidebar open/close code
    let navLinks = this.querySelector(".nav-links");
    let menuOpenBtn = this.querySelector(".navbar .bx-menu");
    let menuCloseBtn = this.querySelector(".nav-links .bx-x");

    menuOpenBtn.onclick = function () {
      navLinks.style.left = "0";
    };
    menuCloseBtn.onclick = function () {
      navLinks.style.left = "-100%";
    };

    // Sidebar submenu open/close for mentorship
    let mentorshipArrow = this.querySelector(".mentorship-arrow");
    if (mentorshipArrow) {
      mentorshipArrow.onclick = function () {
        navLinks.classList.toggle("showMentorship");
      };
    }
  }
}

customElements.define('custom-navbar', CustomNavbar);
