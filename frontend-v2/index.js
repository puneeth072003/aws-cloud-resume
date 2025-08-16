// --- DATA ---
const navData = [
  { href: "#home", labelKey: "navigation.home", icon: "fas fa-house" },
  { href: "#about", labelKey: "navigation.about", icon: "fas fa-user" },
  { href: "#recommendations", labelKey: "navigation.recommendations", icon: "fas fa-star" },
  { href: "#pipeline", labelKey: "navigation.pipeline", icon: "fas fa-file" },
  { href: "#skills", labelKey: "navigation.skills", icon: "fas fa-trophy" },
  {
    href: "#portfolio",
    labelKey: "navigation.projects",
    icon: "fas fa-laptop",
  },
  {
    href: "#experience",
    labelKey: "navigation.experience",
    icon: "fa-briefcase",
  },
  { href: "#blogs", labelKey: "navigation.blogs", icon: "fas fa-pen-nib" },
  {
    href: "#photography",
    labelKey: "navigation.photography",
    icon: "fas fa-camera-retro",
  },
];







// --- CORE LOGIC ---
async function main() {
  console.log("Initializing main function");

  // Listen for language changes
  document.addEventListener("languageChanged", handleLanguageChange);

  // Wait for i18n to be ready
  if (window.i18n) {
    // Wait a bit for i18n to initialize
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Update language display after i18n is ready
    updateLanguageDisplay();
  }

  // Rest of the main function...
  try {
    setupHeroAnimation();
  } catch (e) {
    console.error("Failed to initialize Hero Animation:", e);
    const heroCanvas = document.getElementById("hero-canvas");
    if (heroCanvas) heroCanvas.style.display = "none";
  }

  setupSkillsRadar();
  setupScrollAnimations();
  setupEasterEggs(); // Add Easter Eggs

  console.log("Populating content...");
  try {
    populateDock();
    populatePhotography();
  } catch (e) {
    console.error("Failed to populate content:", e);
    console.error(e.stack);
  }

  setupDockAnimation();
  setupPhotographyCarousel();
  setupLightbox();
  setupThemeSwitcher();
  updateCounter(); // This will now also show the toast

  ensureBottomDockOnTop();

  // Final language display update
  setTimeout(() => {
    console.log("Final language display update...");
    updateLanguageDisplay();
  }, 1000);
}

function checkDependencies() {
  if (window.THREE && window.Chart) {
    main();
  } else {
    setTimeout(checkDependencies, 100);
  }
}

// Initialize language switcher immediately when DOM is ready, independent of other dependencies
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded, initializing language switcher...");

  // Initialize language switcher first
  initializeLanguageSwitcher();

  // Then check for other dependencies
  checkDependencies();
});

// Function to initialize language switcher independently
function initializeLanguageSwitcher() {
  console.log("Initializing language switcher independently...");

  // Wait for i18n to be ready
  const waitForI18n = () => {
    if (window.i18n) {
      console.log("i18n is ready, setting up language switcher");

      // Create language switcher if dock exists
      const desktopDock = document.getElementById("bottom-dock");
      const mobileMenu = document.getElementById("mobile-dock-menu");

      if (desktopDock && mobileMenu) {
        // Only create language switcher if it doesn't exist yet
        if (!document.getElementById("desktop-language-switcher")) {
          createLanguageSwitcherOnly();
        }
      }

      // Update language display
      setTimeout(() => {
        updateLanguageDisplay();
      }, 100);
    } else {
      console.log("Waiting for i18n...");
      setTimeout(waitForI18n, 100);
    }
  };

  waitForI18n();
}

// Function to create only the language switcher
function createLanguageSwitcherOnly() {
  console.log("createLanguageSwitcherOnly called");
  const desktopDock = document.getElementById("bottom-dock");
  const mobileMenu = document.getElementById("mobile-dock-menu");

  console.log("Desktop dock:", desktopDock);
  console.log("Mobile menu:", mobileMenu);

  if (!desktopDock || !mobileMenu) {
    console.log("Dock elements not found, skipping language switcher creation");
    return;
  }

  const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : "en";
  console.log("Current language for switcher:", currentLang);

  const langItemData = {
    id: "language-switcher",
    label: "", // Empty label to prevent tooltip
    text: currentLang.toUpperCase(), // Show current language
  };

  // Create desktop language switcher
  const desktopItem = createDockItem(langItemData);
  desktopItem.id = "desktop-language-switcher";
  desktopDock.appendChild(desktopItem);
  console.log("Desktop language switcher created:", desktopItem);

  // Create mobile language switcher
  const mobileItem = createDockItem(langItemData);
  mobileItem.id = "mobile-language-switcher";
  mobileMenu.appendChild(mobileItem);
  console.log("Mobile language switcher created:", mobileItem);

  console.log("Language switcher created independently");
}

// --- ANIMATIONS & DYNAMIC CONTENT ---

function setupHeroAnimation() {
  const container = document.getElementById("home");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("hero-canvas"),
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Particle Sphere
  const points = [];
  for (let i = 0; i < 5000; i++) {
    const vertex = new THREE.Vector3();
    const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
    const phi = THREE.MathUtils.randFloatSpread(360);
    vertex.x = 2.5 * Math.sin(theta) * Math.cos(phi);
    vertex.y = 2.5 * Math.sin(theta) * Math.sin(phi);
    vertex.z = 2.5 * Math.cos(theta);
    points.push(vertex);
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.015 });
  const sphere = new THREE.Points(geometry, material);
  scene.add(sphere);

  camera.position.z = 5;

  let mouseX = 0;
  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  });

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.0005 + mouseX * 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupDockAnimation() {
  const dock = document.getElementById("bottom-dock");
  const items = Array.from(dock.querySelectorAll(".dock-item"));
  const separators = Array.from(dock.querySelectorAll(".dock-separator"));

  if (!dock || items.length === 0) return;

  // MacBook dock configuration
  const itemSize = 50; // Base size of each item
  const gap = 12; // Gap between items
  const padding = 24; // Padding on both sides
  const maxScale = 1.4; // Maximum scale factor (reduced from 1.8)
  const effectRadius = 80; // Radius of magnification effect

  // Calculate initial dock width
  const baseWidth =
    items.length * itemSize + (items.length - 1) * gap + padding * 2;
  dock.style.width = `${baseWidth}px`;

  // Initialize items with proper positioning
  items.forEach((item, index) => {
    item.style.position = "absolute";
    item.style.width = `${itemSize}px`;
    item.style.height = `${itemSize}px`;
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.justifyContent = "center";
    item.style.transformOrigin = "center bottom";

    // Set initial position
    const initialLeft = padding + index * (itemSize + gap);
    item.style.left = `${initialLeft}px`;
    item.style.transform = "scale(1)";
  });

  let isAnimating = false;

  dock.addEventListener("mousemove", (e) => {
    if (isAnimating) return;

    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;

    // Calculate scales and positions
    const scales = [];
    const positions = [];
    let totalWidth = padding;

    items.forEach((item, index) => {
      const itemCenter = padding + index * (itemSize + gap) + itemSize / 2;
      const distance = Math.abs(mouseX - itemCenter);

      // Calculate scale with smooth falloff
      let scale = 1;
      if (distance < effectRadius) {
        const normalizedDistance = distance / effectRadius;
        scale =
          1 + (maxScale - 1) * Math.cos((normalizedDistance * Math.PI) / 2);
      }

      scales.push(scale);
    });

    // Calculate new positions based on scales
    items.forEach((item, index) => {
      const scale = scales[index];
      const scaledWidth = itemSize * scale;

      positions.push(totalWidth);
      totalWidth += scaledWidth + gap;
    });

    // Remove last gap and add final padding
    totalWidth = totalWidth - gap + padding;

    // Update dock width smoothly
    dock.style.width = `${totalWidth}px`;

    // Apply transformations
    items.forEach((item, index) => {
      const scale = scales[index];
      const position = positions[index];

      item.style.left = `${position}px`;
      item.style.transform = `scale(${scale})`;

      // Add glow effect for highly scaled items
      if (scale > 1.4) {
        const glowIntensity = (scale - 1) / (maxScale - 1);
        item.style.filter = `drop-shadow(0 0 ${
          10 * glowIntensity
        }px rgba(56, 189, 248, ${0.6 * glowIntensity}))`;
      } else {
        item.style.filter = "none";
      }
    });
  });

  dock.addEventListener("mouseleave", () => {
    // Smooth reset animation
    dock.style.width = `${baseWidth}px`;

    items.forEach((item, index) => {
      const initialLeft = padding + index * (itemSize + gap);
      item.style.left = `${initialLeft}px`;
      item.style.transform = "scale(1)";
      item.style.filter = "none";
    });
  });
}

// Counter Logic
const COUNTER_URL =
  "https://dviz66qcm3vqhccxryrjmvn7yq0rnink.lambda-url.ap-south-1.on.aws/?key=oe7XZ2FvVVRpWkUMokTuEC3PuAKpy4u9";

async function updateCounter() {
  const counter = document.getElementById("counter-number");
  if (!counter) return;

  let method = "GET";
  if (!sessionStorage.getItem("counterIncremented")) {
    method = "POST";
  }

  try {
    const response = await fetch(COUNTER_URL, { method });
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();

    // Update the counter display
    counter.innerHTML = data.views;

    // Also update the visitor number in the toast
    const visitorToastNumber = document.querySelector(
      "#visitor-toast-number span"
    );
    if (visitorToastNumber) {
      visitorToastNumber.textContent = data.views;
    }

    // Show the greeting toast
    showGreetingToast();

    if (method === "POST") {
      sessionStorage.setItem("counterIncremented", "true");
    }
  } catch (err) {
    counter.innerHTML = "0";
    console.error("Counter error:", err);
  }
}

function setupSkillsRadar() {
  const ctx = document.getElementById("skillsRadar");
  if (!ctx) return;
  const chart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "Kubernetes",
        "Docker",
        "Terraform",
        "AWS",
        "CI/CD",
        "GitHub",
        "Monitoring",
      ],
      datasets: [
        {
          data: [95, 90, 70, 80, 80, 85, 75],
          backgroundColor: "rgba(56, 189, 248, 0.2)",
          borderColor: "rgba(56, 189, 248, 1)",
          pointBackgroundColor: "rgba(56, 189, 248, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000 },
      scales: {
        r: {
          angleLines: { color: "rgba(255, 255, 255, 0.2)" },
          grid: { color: "rgba(255, 255, 255, 0.2)" },
          pointLabels: {
            color: getComputedStyle(document.body).getPropertyValue(
              "--text-main"
            ),
            font: { size: 12 },
          },
          ticks: { display: false, stepSize: 25 },
        },
      },
      plugins: { legend: { display: false } },
    },
  });
  // Update chart colors on theme change
  document.body.addEventListener("themeChanged", (e) => {
    const isLight = e.detail.theme === "light";
    const pointLabelColor = isLight ? "#1f2937" : "#e2e8f0";
    chart.options.scales.r.pointLabels.color = pointLabelColor;
    chart.options.scales.r.angleLines.color = isLight
      ? "rgba(0,0,0,0.1)"
      : "rgba(255,255,255,0.2)";
    chart.options.scales.r.grid.color = isLight
      ? "rgba(0,0,0,0.1)"
      : "rgba(255,255,255,0.2)";
    chart.update();
  });
}

function setupScrollAnimations() {
  const sections = document.querySelectorAll(".reveal-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((section) => observer.observe(section));

  const counter = document.getElementById("counter");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;

      animateCounter(counter, 0, 350, 2000);
      observer.unobserve(counter);
    },
    { threshold: 0.5 }
  );
  if (counter) counterObserver.observe(counter);
}

function animateCounter(el, from, to, duration) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * (to - from) + from).toLocaleString();
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}

function createDockItem(item) {
  const dockItem = document.createElement("div");
  dockItem.className = "dock-item";

  if (item.id === "language-switcher") {
    // Create language switcher with just text (no icon)
    const textSpan = document.createElement("span");
    textSpan.className = "lang-text";
    textSpan.textContent = item.text || "EN";
    textSpan.style.fontSize = "14px";
    textSpan.style.fontWeight = "bold";
    textSpan.style.fontFamily = "'Orbitron', monospace";

    dockItem.appendChild(textSpan);
    dockItem.addEventListener("click", toggleLanguage);

    console.log(`Created language switcher with text: ${item.text}`);
  } else {
    // Create regular icon
    const icon = document.createElement("i");
    icon.className = `fas ${item.icon}`;
    dockItem.appendChild(icon);

    // Add tooltip with translated label if available
    if (item.labelKey) {
      const label = getTranslation(item.labelKey) || item.labelKey;
      dockItem.setAttribute("title", label);
    }

    // Add href if available
    if (item.href) {
      dockItem.addEventListener("click", function () {
        document.querySelector(item.href).scrollIntoView({
          behavior: "smooth",
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-dock-menu");
        if (mobileMenu && mobileMenu.classList.contains("open")) {
          mobileMenu.classList.remove("open");
        }
      });
    } else if (item.id === "theme-switcher") {
      dockItem.addEventListener("click", toggleTheme);
    }
  }

  return dockItem;
}

function createSeparator() {
  const separator = document.createElement("div");
  separator.className = "dock-separator";
  separator.style.width = "1px";
  separator.style.height = "30px";
  separator.style.background = "rgba(255, 255, 255, 0.3)";
  separator.style.margin = "0 8px";
  separator.style.alignSelf = "center";
  return separator;
}

function populateDock() {
  const desktopDock = document.getElementById("bottom-dock");
  const mobileMenu = document.getElementById("mobile-dock-menu");
  if (!desktopDock || !mobileMenu) return;

  // Clear existing items
  desktopDock.innerHTML = "";
  mobileMenu.innerHTML = "";

  // Theme switcher button data
  const themeItemData = {
    id: "theme-switcher",
    label: "", // Empty label to prevent tooltip
    icon: "fa-moon",
  };

  // Language switcher button data - get current language for display
  const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : "en";
  console.log(`Creating dock with current language: ${currentLang}`);
  const langItemData = {
    id: "language-switcher",
    label: "", // Empty label to prevent tooltip
    text: currentLang.toUpperCase(), // Show current language
  };

  const toggleableItems = [themeItemData, langItemData];

  // Add navigation items
  navData.forEach((item) => {
    const desktopItem = createDockItem(item);
    if (item.id) desktopItem.id = `desktop-${item.id}`;
    desktopDock.appendChild(desktopItem);

    const mobileItem = createDockItem(item);
    if (item.id) mobileItem.id = `mobile-${item.id}`;
    mobileMenu.appendChild(mobileItem);
  });

  // Add separator before the last two toggle items
  const separator = createSeparator();
  desktopDock.appendChild(separator);

  // Add toggleable items (theme and language) - these are the last two items
  toggleableItems.forEach((item) => {
    const desktopItem = createDockItem(item);
    if (item.id) desktopItem.id = `desktop-${item.id}`;
    desktopDock.appendChild(desktopItem);

    const mobileItem = createDockItem(item);
    if (item.id) mobileItem.id = `mobile-${item.id}`;
    mobileMenu.appendChild(mobileItem);
  });

  // Setup mobile dock toggle
  const mobileToggle = document.getElementById("mobile-dock-toggle");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });
  }

  // Ensure z-index is applied
  if (desktopDock) desktopDock.style.zIndex = "1000";
  if (mobileMenu) mobileMenu.style.zIndex = "999";
  if (mobileToggle) mobileToggle.style.zIndex = "1000";

  // Update language display after dock is populated
  setTimeout(() => {
    updateLanguageDisplay();
    debugLanguageSwitcher();
  }, 100);
}

function setupThemeSwitcher() {
  const themeSwitchers = [
    document.getElementById("desktop-theme-switcher"),
    document.getElementById("mobile-theme-switcher"),
  ];

  const applyTheme = (theme) => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    themeSwitchers.forEach((switcher) => {
      if (switcher) {
        const icon = switcher.querySelector("i");
        icon.className = `fas ${theme === "light" ? "fa-sun" : "fa-moon"}`;
      }
    });
    document.body.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme } })
    );
  };

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  themeSwitchers.forEach((switcher) => {
    if (switcher) {
      switcher.addEventListener("click", (e) => {
        e.preventDefault();
        const newTheme = document.body.classList.contains("light-theme")
          ? "dark"
          : "light";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
      });
    }
  });
}







function populatePhotography() {
  // Skip populating since we're using Swiper directly in the HTML
  console.log("Using Swiper for photography carousel");
}

function setupPhotographyCarousel() {
  var swiper = new Swiper("#photography .swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 3,
      slideShadows: true,
    },
    keyboard: {
      enabled: true,
    },
    mousewheel: {
      thresholdDelta: 70,
    },
    loop: true,
    pagination: {
      el: "#photography .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 1,
      },
      1024: {
        slidesPerView: 2,
      },
      1560: {
        slidesPerView: 3,
      },
    },
  });

  // Setup lightbox for Swiper slides
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  // Map slide indices to image paths
  const imagePaths = [
    "./assets/photos/DSC03302.png",
    "./assets/photos/DSC03471.jpg",
    "./assets/photos/DSC03550.JPG",
    "./assets/photos/DSC03763.JPG",
    "./assets/photos/DSC03529.JPG",
  ];

  document.querySelectorAll("#photography .view-full").forEach((btn, index) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      lightboxImg.src = imagePaths[index];
      lightbox.classList.add("show");
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("show");
  };

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Add keyboard navigation for lightbox
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("show")) {
      if (e.key === "Escape") {
        closeLightbox();
      }
    }
  });
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const grid = document.getElementById("photography-carousel");

  if (!lightbox || !lightboxImg || !closeBtn || !grid) return;

  grid.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      lightboxImg.src = e.target.src;
      lightbox.classList.add("show");
    }
  });

  const closeLightbox = () => {
    lightbox.classList.remove("show");
  };

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Update the populatePhotography function to not interfere with Swiper
function populatePhotography() {
  // Skip populating since we're using Swiper directly in the HTML
  console.log("Using Swiper for photography carousel");
}

// Replace setupPhotographyCarousel with Swiper initialization
function setupPhotographyCarousel() {
  var swiper = new Swiper("#photography .swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 3,
      slideShadows: true,
    },
    keyboard: {
      enabled: true,
    },
    mousewheel: {
      thresholdDelta: 70,
    },
    loop: true,
    pagination: {
      el: "#photography .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 1,
      },
      1024: {
        slidesPerView: 2,
      },
      1560: {
        slidesPerView: 3,
      },
    },
  });

  // Setup lightbox for Swiper slides
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  // Map slide indices to image paths
  const imagePaths = [
    "./assets/photos/DSC03302.png",
    "./assets/photos/DSC03471.jpg",
    "./assets/photos/DSC03550.JPG",
    "./assets/photos/DSC03307.jpg",
    "./assets/photos/DSC03529.JPG",
  ];

  document.querySelectorAll("#photography .view-full").forEach((btn, index) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      lightboxImg.src = imagePaths[index];
      lightbox.classList.add("show");
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("show");
  };

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Add keyboard navigation for lightbox
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("show")) {
      if (e.key === "Escape") {
        closeLightbox();
      }
    }
  });
}

// Make sure to call setupPhotographyCarousel after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  setupPhotographyCarousel();
});





function handleScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-section");
  const timelineItems = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => observer.observe(el));
  timelineItems.forEach((el) => observer.observe(el));
}

// Add this to your main function
document.addEventListener("DOMContentLoaded", () => {
  handleScrollAnimations();
});

// Add a function to ensure the bottom dock is always on top
function ensureBottomDockOnTop() {
  // Get all elements that might overlap with the dock
  const bottomNav = document.getElementById("bottom-nav");
  if (!bottomNav) return;

  // Force a repaint to ensure z-index is applied
  bottomNav.style.display = "none";
  setTimeout(() => {
    bottomNav.style.display = "";
  }, 10);

  // Add event listener to ensure dock stays on top during scrolling
  window.addEventListener("scroll", () => {
    bottomNav.style.zIndex = "1000";
  });

  // Check for any dynamically added content that might overlap
  const observer = new MutationObserver(() => {
    bottomNav.style.zIndex = "1000";
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Add function to show the greeting toast
function showGreetingToast() {
  const toast = document.getElementById("greeting-toast");
  const closeBtn = document.getElementById("toast-close");

  if (!toast || !closeBtn) return;

  // Remove any existing animations
  toast.classList.remove("show", "hide");

  // Force a reflow to ensure the animation restarts
  void toast.offsetWidth;

  // Show the toast with animation
  toast.classList.add("show");

  // Set up close button
  closeBtn.addEventListener("click", () => {
    toast.classList.remove("show");
    toast.classList.add("hide");
  });

  // Auto-hide after 6 seconds
  setTimeout(() => {
    if (toast.classList.contains("show")) {
      toast.classList.remove("show");
      toast.classList.add("hide");
    }
  }, 6000);
}

// Add Easter Egg: Konami Code
function setupEasterEggs() {
  let konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiPosition = 0;

  document.addEventListener("keydown", function (e) {
    if (e.key === konamiCode[konamiPosition]) {
      konamiPosition++;
      if (konamiPosition === konamiCode.length) {
        // Trigger easter egg - rainbow effect on name
        const name = document.querySelector("h1.font-orbitron");
        if (name) {
          // Create rainbow effect
          name.style.background =
            "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)";
          name.style.backgroundSize = "200% auto";
          name.style.webkitBackgroundClip = "text";
          name.style.backgroundClip = "text";
          name.style.color = "transparent";
          name.style.animation = "rainbow 2s linear infinite";

          // Add rainbow animation if not already defined
          if (!document.querySelector("style#rainbow-style")) {
            const style = document.createElement("style");
            style.id = "rainbow-style";
            style.textContent = `
              @keyframes rainbow {
                0% { background-position: 0% 50%; }
                100% { background-position: 100% 50%; }
              }
            `;
            document.head.appendChild(style);
          }

          // Show a special toast
          const toast = document.getElementById("greeting-toast");
          if (toast) {
            const toastTitle = toast.querySelector("h3");
            const toastMessage = toast.querySelector("p");
            const visitorNumber = toast.querySelector("#visitor-toast-number");

            if (toastTitle)
              toastTitle.textContent = "🌈 Konami Code Activated!";
            if (toastMessage)
              toastMessage.textContent =
                "You found a secret! Enjoy the rainbow effect.";
            if (visitorNumber) visitorNumber.style.display = "none";

            // Show the toast
            toast.classList.remove("show", "hide");
            void toast.offsetWidth;
            toast.classList.add("show");

            // Auto-hide after 6 seconds
            setTimeout(() => {
              if (toast.classList.contains("show")) {
                toast.classList.remove("show");
                toast.classList.add("hide");

                // Reset toast content after hiding
                setTimeout(() => {
                  if (toastTitle) toastTitle.textContent = "Welcome!";
                  if (toastMessage)
                    toastMessage.textContent =
                      "Thanks for visiting my portfolio.";
                  if (visitorNumber) visitorNumber.style.display = "block";
                }, 500);
              }
            }, 6000);
          }

          konamiPosition = 0;
        }
      }
    } else {
      konamiPosition = 0;
    }
  });
}



// Language switcher setup
function setupLanguageSwitcher() {
  console.log("Setting up language switcher...");

  // Wait a bit for DOM to be ready, then update language display
  setTimeout(() => {
    updateLanguageDisplay();
  }, 500);
}

async function toggleLanguage() {
  console.log("toggleLanguage called");
  if (window.i18n) {
    const currentLang = window.i18n.getCurrentLanguage();
    const newLang = currentLang === "en" ? "de" : "en";
    console.log(`Switching language from ${currentLang} to ${newLang}`);

    try {
      await window.i18n.switchLanguage(newLang);
      console.log("Language switch completed, updating display...");

      // The language display will be updated automatically by the languageChanged event
      // But we can also force update it here for immediate feedback
      setTimeout(() => {
        updateLanguageDisplay();
      }, 100);
    } catch (error) {
      console.error("Error switching language:", error);
    }
  } else {
    console.error("window.i18n not available");
  }
}

// Make toggleLanguage globally accessible
window.toggleLanguage = toggleLanguage;

// Also make updateLanguageDisplay globally accessible for debugging
window.updateLanguageDisplay = updateLanguageDisplay;

// Debug function to check language switcher status
window.debugLanguageSwitcher = function() {
  console.log("=== Language Switcher Debug ===");
  console.log("window.i18n available:", !!window.i18n);
  if (window.i18n) {
    console.log("Current language:", window.i18n.getCurrentLanguage());
  }

  const desktopSwitcher = document.getElementById("desktop-language-switcher");
  const mobileSwitcher = document.getElementById("mobile-language-switcher");

  console.log("Desktop switcher element:", desktopSwitcher);
  console.log("Mobile switcher element:", mobileSwitcher);

  if (desktopSwitcher) {
    console.log("Desktop switcher text:", desktopSwitcher.textContent);
    console.log("Desktop switcher has click listener:", desktopSwitcher.onclick !== null);
  }

  if (mobileSwitcher) {
    console.log("Mobile switcher text:", mobileSwitcher.textContent);
    console.log("Mobile switcher has click listener:", mobileSwitcher.onclick !== null);
  }

  const dock = document.getElementById("bottom-dock");
  const mobileMenu = document.getElementById("mobile-dock-menu");
  console.log("Dock element:", dock);
  console.log("Mobile menu element:", mobileMenu);

  if (dock) {
    console.log("Dock children:", dock.children.length);
    Array.from(dock.children).forEach((child, index) => {
      console.log(`Dock child ${index}:`, child.id, child.className, child.textContent);
    });
  }

  console.log("=== End Debug ===");
};

function updateLanguageDisplay() {
  const langSwitchers = [
    document.getElementById("desktop-language-switcher"),
    document.getElementById("mobile-language-switcher"),
  ];

  const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : "en";
  const displayText = currentLang.toUpperCase();

  console.log(`Updating language display to: ${displayText}`);

  langSwitchers.forEach((switcher, index) => {
    if (switcher) {
      // Find the text span within the switcher
      const textSpan =
        switcher.querySelector(".lang-text") || switcher.querySelector("span");

      if (textSpan) {
        textSpan.textContent = displayText;
        console.log(
          `Updated language text to: ${displayText} for switcher ${index}`
        );
      } else {
        console.warn(`No text span found in language switcher ${index}`);
        // If no span found, create one
        const newSpan = document.createElement("span");
        newSpan.className = "lang-text";
        newSpan.textContent = displayText;
        newSpan.style.fontSize = "14px";
        newSpan.style.fontWeight = "bold";
        newSpan.style.fontFamily = "'Orbitron', monospace";
        switcher.innerHTML = "";
        switcher.appendChild(newSpan);
        console.log(`Created new language text span for switcher ${index}`);
      }
    } else {
      console.log(`Language switcher ${index} element not found`);
    }
  });
}

function handleLanguageChange(event) {
  const { language } = event.detail;
  console.log(`Language changed to: ${language}`);

  // Update language display in dock immediately
  updateLanguageDisplay();

  // Update dynamic content that uses translation keys
  updateDynamicTranslations();
}

function updateDynamicTranslations() {
  // Re-populate content with new translations
  try {
    console.log("Updating dynamic translations...");
    populateDock();

    // Re-setup dock animation after repopulating
    setupDockAnimation();

    console.log("Dynamic translations updated successfully");
  } catch (e) {
    console.error("Failed to update dynamic translations:", e);
  }
}

// Helper function to get translation from global i18n instance
function getTranslation(key) {
  if (window.i18n) {
    const translation = window.i18n.getTranslation(key);
    // Return the translation if it exists and is not the same as the key (meaning it was found)
    return translation && translation !== key ? translation : null;
  }
  return null;
}

// Debug function to check language switcher state
function debugLanguageSwitcher() {
  console.log("=== Language Switcher Debug ===");
  console.log("window.i18n available:", !!window.i18n);
  if (window.i18n) {
    console.log("Current language:", window.i18n.getCurrentLanguage());
  }

  const desktopSwitcher = document.getElementById("desktop-language-switcher");
  const mobileSwitcher = document.getElementById("mobile-language-switcher");

  console.log("Desktop switcher found:", !!desktopSwitcher);
  if (desktopSwitcher) {
    console.log("Desktop switcher content:", desktopSwitcher.innerHTML);
  }

  console.log("Mobile switcher found:", !!mobileSwitcher);
  if (mobileSwitcher) {
    console.log("Mobile switcher content:", mobileSwitcher.innerHTML);
  }
  console.log("=== End Debug ===");
}

// Make debug function available globally
window.debugLanguageSwitcher = debugLanguageSwitcher;

// Add a function to handle theme switching
function toggleTheme() {
  const body = document.body;
  const isDark = !body.classList.contains("light-theme");

  if (isDark) {
    body.classList.add("light-theme");
    localStorage.setItem("theme", "light");

    // Update theme icon
    const themeIcons = document.querySelectorAll(
      "#desktop-theme-switcher i, #mobile-theme-switcher i"
    );
    themeIcons.forEach((icon) => {
      icon.className = "fas fa-sun";
    });
  } else {
    body.classList.remove("light-theme");
    localStorage.setItem("theme", "dark");

    // Update theme icon
    const themeIcons = document.querySelectorAll(
      "#desktop-theme-switcher i, #mobile-theme-switcher i"
    );
    themeIcons.forEach((icon) => {
      icon.className = "fas fa-moon";
    });
  }
}

// Setup theme switcher based on saved preference
function setupThemeSwitcher() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");

    // Update theme icon
    const themeIcons = document.querySelectorAll(
      "#desktop-theme-switcher i, #mobile-theme-switcher i"
    );
    themeIcons.forEach((icon) => {
      icon.className = "fas fa-sun";
    });
  }
}
