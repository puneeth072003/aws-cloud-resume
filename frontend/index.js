$(document).ready(function (e) {
    $win = $(window);
    $navbar = $('#header');
    $toggle = $('.toggle-button');
    var width = $navbar.width();
    toggle_onclick($win, $navbar, width);

    // resize event
    $win.resize(function () {
        toggle_onclick($win, $navbar, width);
    });

    $toggle.click(function (e) {
        $navbar.toggleClass("toggle-left");
    })
});

function toggle_onclick($win, $navbar, width) {
    if ($win.width() <= 768) {
        $navbar.css({ left: `-${width}px` });
    } else {
        $navbar.css({ left: '0px' });
    }
}

var typed = new Typed('#typed', {
    strings: [
        'Aspiring DevOps Engineer',
        'Cloud Enthusiast',
        'Cloud-Native Nomad',
        'Kubernetes Fan'
    ],
    typeSpeed: 50,
    backSpeed: 50,
    loop: true
});

var typed_2 = new Typed('#typed_2', {
    strings: [
        'Aspiring DevOps Engineer',
        'Cloud Enthusiast',
        'Cloud-Native Nomad',
        'Kubernetes Fan'
    ],
    typeSpeed: 50,
    backSpeed: 50,
    loop: true
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const counter = document.querySelector(".counter-number");
const COUNTER_URL = "/.netlify/functions/proxy";

async function updateCounter() {
    let method = "GET";
    if (!sessionStorage.getItem("counterIncremented")) {
        method = "POST";
    }
    try {
        const response = await fetch(COUNTER_URL, { method });
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        counter.innerHTML = `👀 ${data.views} spies detected`;
        if (method === "POST") {
            sessionStorage.setItem("counterIncremented", "true");
        }
    } catch (err) {
        counter.innerHTML = "Couldn't read the counter";
    }
}
updateCounter();

document.addEventListener('DOMContentLoaded', function () {
    var carousel = document.getElementById('photographyCarousel');
    if (!carousel) return;

    // Touch events for mobile/tablet
    let touchStartX = 0, touchEndX = 0;
    carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    });
    carousel.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].clientX;
        if (touchEndX < touchStartX - 40) {
            $(carousel).carousel('next');
        }
        if (touchEndX > touchStartX + 40) {
            $(carousel).carousel('prev');
        }
    });

    // Mouse events for desktop/laptop
    let isDragging = false, dragStartX = 0, dragEndX = 0;
    carousel.addEventListener('mousedown', function (e) {
        isDragging = true;
        dragStartX = e.clientX;
    });
    carousel.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        dragEndX = e.clientX;
    });
    carousel.addEventListener('mouseup', function (e) {
        if (!isDragging) return;
        isDragging = false;
        // Only trigger if the mouse was actually dragged
        if (Math.abs(dragEndX - dragStartX) > 40) {
            if (dragEndX < dragStartX) {
                $(carousel).carousel('next');
            } else {
                $(carousel).carousel('prev');
            }
        }
        dragStartX = dragEndX = 0;
    });
    carousel.addEventListener('mouseleave', function () {
        isDragging = false;
        dragStartX = dragEndX = 0;
    });

    // Prevent unwanted text/image selection while dragging
    carousel.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
});

// Greeting toast logic (shows on every page load)
document.addEventListener("DOMContentLoaded", function() {
    var toast = document.getElementById("greeting-toast");
    var closeBtn = document.getElementById("greeting-toast-close");
    var visitorNum = document.getElementById("greeting-visitor-number");

    function showGreeting(visitorNumber) {
        if (visitorNumber) {
            visitorNum.textContent = `You are visitor #${visitorNumber}`;
        } else {
            visitorNum.textContent = "";
        }
        toast.style.display = "flex";
        // Dismiss on button or after 5 seconds
        closeBtn.onclick = function() {
            toast.style.display = "none";
        };
        setTimeout(function() {
            toast.style.display = "none";
        }, 5000);
    }

    // Try to get visitor number from counter, fallback if not found
    function tryShowGreeting() {
        var counterElem = document.querySelector(".counter-number");
        if (counterElem) {
            var visitorText = counterElem.textContent || "";
            var match = visitorText.match(/(\d+)/);
            showGreeting(match ? match[1] : null);
        } else {
            showGreeting(null);
        }
    }

    // Wait up to 2s for counter to appear, then show anyway
    let waited = 0;
    function waitForCounter() {
        var counterElem = document.querySelector(".counter-number");
        var hasNumber = counterElem && /\d+/.test(counterElem.textContent);
        if (hasNumber) {
            tryShowGreeting();
        } else if (waited < 2000) {
            waited += 100;
            setTimeout(waitForCounter, 100);
        } else {
            tryShowGreeting();
        }
    }
    waitForCounter();
});