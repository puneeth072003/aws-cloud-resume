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
    loop: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true
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
    loop: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true
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
// const COUNTER_URL = "/.netlify/functions/proxy";
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

// Add Easter Eggs
document.addEventListener('DOMContentLoaded', function() {
    // Easter Egg 1: Konami Code (up, up, down, down, left, right, left, right, b, a)
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPosition = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiPosition]) {
            konamiPosition++;
            if (konamiPosition === konamiCode.length) {
                // Trigger easter egg - rainbow effect on name
                const name = document.querySelector('.font-staat.font-size-40');
                if (name) {
                    // Create and show message toast
                    const toast = document.createElement('div');
                    toast.style.position = 'fixed';
                    toast.style.top = '20px';
                    toast.style.left = '50%';
                    toast.style.transform = 'translateX(-50%)';
                    toast.style.background = '#fff';
                    toast.style.padding = '10px 20px';
                    toast.style.borderRadius = '8px';
                    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    toast.style.zIndex = '9999';
                    toast.style.fontFamily = 'var(--font-ram)';
                    toast.style.animation = 'fadeInDown 0.5s forwards';
                    toast.innerHTML = '🌈 <strong>Konami Code Activated!</strong> Witness my name in RGB chaos!';
                    
                    // Add animation keyframes
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes fadeInDown {
                            from { opacity: 0; transform: translate(-50%, -20px); }
                            to { opacity: 1; transform: translate(-50%, 0); }
                        }
                        @keyframes rainbow {
                            0% { background-position: 0% 50%; }
                            100% { background-position: 100% 50%; }
                        }
                    `;
                    document.head.appendChild(style);
                    document.body.appendChild(toast);
                    
                    // Apply rainbow effect to name
                    name.style.transition = 'all 0.5s ease';
                    name.style.background = 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)';
                    name.style.backgroundSize = '200% auto';
                    name.style.webkitBackgroundClip = 'text';
                    name.style.backgroundClip = 'text';
                    name.style.color = 'transparent';
                    name.style.animation = 'rainbow 2s linear infinite';
                    
                    // Remove toast after 4 seconds
                    setTimeout(() => {
                        toast.style.animation = 'fadeOutUp 0.5s forwards';
                        setTimeout(() => {
                            document.body.removeChild(toast);
                        }, 500);
                    }, 4000);
                    
                    // Add fadeout animation
                    const fadeOutStyle = document.createElement('style');
                    fadeOutStyle.textContent = `
                        @keyframes fadeOutUp {
                            from { opacity: 1; transform: translate(-50%, 0); }
                            to { opacity: 0; transform: translate(-50%, -20px); }
                        }
                    `;
                    document.head.appendChild(fadeOutStyle);
                    
                    konamiPosition = 0;
                }
            }
        } else {
            konamiPosition = 0;
        }
    });
    
    // Easter Egg 2: Click author image 5 times quickly
    const authorImg = document.querySelector('.author-img');
    if (authorImg) {
        let clickCount = 0;
        let clickTimer;
        
        authorImg.addEventListener('click', function() {
            clickCount++;
            clearTimeout(clickTimer);
            
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 2000);
            
            if (clickCount >= 5) {
                // Trigger spin animation
                authorImg.style.transition = 'all 0.5s ease';
                authorImg.style.animation = 'spin 1s ease-in-out';
                
                // Add spin animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
                
                // Reset after animation
                setTimeout(() => {
                    authorImg.style.animation = '';
                }, 1000);
                
                clickCount = 0;
            }
        });
    }
    
    // Easter Egg 3: Hidden message in console
    console.log("%cYou found a secret! 🎉", "color: #92d805; font-size: 20px; font-weight: bold;");
    console.log("%cTry the Konami code: ↑↑↓↓←→←→BA", "color: #666; font-style: italic;");
});
