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
        'Kubernetes devotee'
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
        'Kubernetes devotee'
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
const COUNTER_URL = "https://dviz66qcm3vqhccxryrjmvn7yq0rnink.lambda-url.ap-south-1.on.aws/?key=oe7XZ2FvVVRpWkUMokTuEC3PuAKpy4u9";

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