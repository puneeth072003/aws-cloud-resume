// --- DATA ---
const navData = [
  { href: "#home", label: "Home", icon: "fas fa-house" },
  { href: "#about", label: "About", icon: "fas fa-user" },
  { href: "#pipeline", label: "Pipeline", icon: "fas fa-file" },
  { href: "#skills", label: "Skills", icon: "fas fa-trophy" },
  { href: "#portfolio", label: "Projects", icon: "fas fa-laptop" },
  { href: "#experience", label: "Experience", icon: "fa-briefcase" },
  { href: "#blogs", label: "Blogs", icon: "fas fa-pen-nib" },
  { href: "#photography", label: "Photography", icon: "fas fa-camera-retro" },
];
const certificationsData = [
  { name: "Top 1% in GSSoC'ext 2024", icon: "fa fa-trophy" },
  {
    name: "1st Place in the department-level mini-project",
    icon: "fa fa-trophy",
  },
  {
    name: "AZ-305 Microsoft Azure Architect Design Prerequisites",
    icon: "fa fa-trophy",
  },
  { name: "AWS Cloud Practitioner Essentials", icon: "fa fa-trophy" },
  { name: "Postman API Fundamentals Student Expert", icon: "fa fa-trophy" },
];
const portfolioData = [
  {
    title: "CODESOURCERER",
    description:
      "An intelligent code assistant platform that helps developers find and understand code snippets across large codebases.",
    icon: "fa-code",
    video: "./videos/CS-demo.mp4",
    links: {
      live: "https://codesourcerer.webflow.io",
      github: "https://github.com/puneeth072003/CODESOURCERER",
    },
  },
  {
    title: "Vitista",
    description:
      "A modern campus tour and information platform for university visitors and prospective students.",
    icon: "fa-building-columns",
    video: "./videos/vitista.mp4",
    links: {
      live: "https://vitista.vercel.app/",
      github: "https://github.com/puneeth072003/Vitista",
    },
  },
  {
    title: "Sputilties",
    description:
      "A collection of Spotify utilities and tools to enhance your music streaming experience.",
    icon: "fa-music",
    video: "./videos/Sputilties-demo.mp4",
    links: {
      live: "https://sputilities.netlify.app/",
      github: "https://github.com/puneeth072003/sputilities.V1",
    },
  },
  {
    title: "Huddle",
    description:
      "A collaborative meeting and team communication platform for remote teams.",
    icon: "fa-users",
    video: "./videos/huddle.mp4",
    links: {
      live: "https://ho-huddle.vercel.app/",
      github: "https://github.com/puneeth072003/huddle",
    },
  },
];
const blogData = [
  {
    title: "My Attempt at the AWS Cloud Resume Challenge",
    excerpt:
      "Curious about how the architecture behind this website is structured using modern DevOps practices? I break it all down in my blog post as part of the Cloud Resume Challenge.\n\nFrom CI/CD to infrastructure as code, it's all in there. Be sure to check it out!",
    link: "https://dev.to/puneeth072003/my-attempt-at-the-aws-cloud-resume-challenge-a-journey-in-the-cloud-13gd",
    featured: true,
    image: "./assets/Cover.png",
  },
];
const photographyData = [
  {
    src: "https://placehold.co/800x600/050816/e0f2fe?text=Neon+Grid",
    alt: "A glowing neon grid stretching into the distance",
  },
  {
    src: "https://placehold.co/800x600/1e3a8a/e0f2fe?text=Circuitry",
    alt: "Macro shot of a complex circuit board",
  },
  {
    src: "https://placehold.co/800x600/0284c7/e0f2fe?text=Data+Flow",
    alt: "Abstract long exposure of fiber optic lights",
  },
  {
    src: "https://placehold.co/800x600/0891b2/e0f2fe?text=Hologram",
    alt: "A projected data hologram in a dark room",
  },
  {
    src: "https://placehold.co/800x600/0f172a/e0f2fe?text=Digital+Rain",
    alt: "Code cascading down a screen, digital rain effect",
  },
  {
    src: "https://placehold.co/800x600/1e40af/e0f2fe?text=Server+Aisle",
    alt: "A long aisle of server racks",
  },
];

// Add experience data
const experienceData = [
  {
    company: "HCLSoftware",
    position: "Intern",
    period: "Mar 2025 - Present",
    description:
      "Contributed as a primary team member in architecting the upcoming cloud-native migration blueprint, focusing on defining the target architecture, technology stack, and deployment patterns tailored for future scalability and maintainability. Led several targeted proofs of concept (PoCs) to validate new tools, frameworks, and deployment strategies, directly influencing final architecture decisions and shaping the release automation framework later adopted in the company’s product.",
    technologies: [
      "AWS",
      "Azure",
      "Terraform",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
    ],
  },
  {
    company: "GirlScript Summer of Code (GSSoC-ext'24)",
    position: "Open Source Contributor",
    period: "Oct 2024 - Nov 2024",
    description:
      "Actively contributed to open-source repositories as part of GSSoC-ext 2024, demonstrating strong coding proficiency, collaboration, and problem-solving abilities. Achieved a top ranking of 281 out of 60,000 participants, reflecting high technical competence and consistent engagement throughout the program.",
    technologies: ["Git", "GitHub", "React", "Markdown", "HTML", "CSS"],
  },
];

// --- CORE LOGIC ---
function main() {
  console.log("Initializing main function");

  // Check if data is properly loaded
  checkDataLoading();

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

  console.log("Populating content...");
  try {
    populateDock();
    populatePortfolio(); // Fixed function
    populateCertifications();
    populateExperience(); // Add this line
    populateBlogs();
    populatePhotography();
  } catch (e) {
    console.error("Failed to populate content:", e);
    console.error(e.stack); // Log the full stack trace for debugging
  }

  setupDockAnimation();
  setupPhotographyCarousel();
  setupLightbox();
  setupThemeSwitcher();
  updateCounter(); // Add this line to call the counter function

  // Ensure the bottom dock is always on top
  ensureBottomDockOnTop();
}

function checkDependencies() {
  if (window.THREE && window.Chart) {
    main();
  } else {
    setTimeout(checkDependencies, 100);
  }
}
document.addEventListener("DOMContentLoaded", checkDependencies);

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
  const items = Array.from(dock.children);

  dock.addEventListener("mousemove", (e) => {
    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = itemRect.left - dockRect.left + itemRect.width / 2;
      const distance = Math.abs(mouseX - itemCenterX);

      const maxScale = 1.8;
      const neighborScale = 1.3;
      const effectRadius = 60;

      let scale = 1.0;
      if (distance < effectRadius) {
        scale =
          maxScale - (distance / effectRadius) * (maxScale - neighborScale);
      } else if (distance < effectRadius * 2) {
        const neighborDistance = distance - effectRadius;
        scale =
          neighborScale -
          (neighborDistance / effectRadius) * (neighborScale - 1.0);
      }

      item.style.transform = `scale(${scale.toFixed(2)})`;
    });
  });

  dock.addEventListener("mouseleave", () => {
    items.forEach((item) => {
      item.style.transform = "scale(1)";
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
    counter.innerHTML = data.views;
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
  const dockItem = document.createElement("a");
  dockItem.href = item.href || "#";
  dockItem.className = "dock-item";

  // Create icon only, no tooltip
  dockItem.innerHTML = `<i class="fas ${item.icon}"></i>`;

  // Add click handler for theme switcher
  if (item.id === "theme-switcher") {
    dockItem.addEventListener("click", function (e) {
      e.preventDefault();
      toggleTheme();
    });
  }

  return dockItem;
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
  const allNavData = [...navData, themeItemData];

  allNavData.forEach((item) => {
    // Create dock items without tooltips
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
  if (desktopDock) desktopDock.style.zIndex = '1000';
  if (mobileMenu) mobileMenu.style.zIndex = '999';
  if (mobileToggle) mobileToggle.style.zIndex = '1000';
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

function populateCertifications() {
  const container = document.getElementById("certifications-list");
  if (!container) return;
  certificationsData.forEach((cert) => {
    const certEl = document.createElement("div");
    certEl.className = "flex items-center gap-4 text-slate-300";
    certEl.innerHTML = `
                    <i class="${cert.icon} text-sky-400 text-2xl w-8 text-center"></i>
                    <p class="text-lg">${cert.name}</p>
                `;
    container.appendChild(certEl);
  });
}

function populatePortfolio() {
  const container = document.getElementById("portfolio-grid");
  if (!container) {
    console.warn("Portfolio grid container not found");
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  // Check if we have portfolio data
  if (
    !portfolioData ||
    !Array.isArray(portfolioData) ||
    portfolioData.length === 0
  ) {
    console.warn("Portfolio data is missing or empty");
    container.innerHTML =
      "<p class='text-center text-slate-400'>No projects available at the moment.</p>";
    return;
  }

  // Create and append project elements
  portfolioData.forEach((project) => {
    const projectEl = document.createElement("div");
    projectEl.className =
      "reveal-section project-card glass-pane rounded-xl block hover:border-sky-400 transition-colors overflow-hidden";

    // Create HTML with video
    projectEl.innerHTML = `
      <div class="video-container relative">
        <video src="${
          project.video
        }" autoplay loop muted class="w-full h-48 object-cover"></video>
        <div class="video-title absolute bottom-0 left-0 w-full bg-black/50 p-2 text-white font-orbitron text-lg">
          ${project.title}
        </div>
      </div>
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="text-sky-400 text-3xl">
            <i class="fas ${project.icon}"></i>
          </div>
          <div class="flex gap-3">
            ${
              project.links?.live
                ? `<a href="${project.links.live}" target="_blank" title="Live Site" class="text-2xl text-slate-400 hover:text-sky-400 transition-colors">
                <i class="far fa-eye"></i>
              </a>`
                : ""
            }
            ${
              project.links?.github
                ? `<a href="${project.links.github}" target="_blank" title="Source Code" class="text-2xl text-slate-400 hover:text-sky-400 transition-colors">
                <i class="fab fa-github"></i>
              </a>`
                : ""
            }
          </div>
        </div>
        <p class="text-slate-400 mt-2">${project.description}</p>
      </div>
    `;

    container.appendChild(projectEl);
  });

  console.log(`Populated portfolio with ${portfolioData.length} projects`);
}

function populateBlogs() {
  const container = document.getElementById("blog-grid");
  if (!container) {
    console.warn("Blog grid container not found");
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  // Check if we have blog data
  if (!blogData || !Array.isArray(blogData) || blogData.length === 0) {
    console.warn("Blog data is missing or empty");
    container.innerHTML =
      "<p class='text-center text-slate-400'>No blog posts available at the moment.</p>";
    return;
  }

  // Since we only have one blog, create a featured card
  const blog = blogData[0];
  const blogEl = document.createElement("div");
  blogEl.className =
    "reveal-section glass-pane rounded-xl overflow-hidden hover:border-sky-400 transition-all";

  blogEl.innerHTML = `
    <div class="flex flex-col md:flex-row">
      <div class="md:w-2/5">
        <img src="${
          blog.image
        }" alt="Blog cover image" class="w-full h-full object-cover" />
      </div>
      <div class="p-8 md:w-3/5">
        <h3 class="font-orbitron text-2xl md:text-3xl text-white">${
          blog.title
        }</h3>
        <div class="text-slate-300 mt-4 text-md md:text-lg space-y-4">
          ${blog.excerpt
            .split("\n\n")
            .map((para) => `<p>${para}</p>`)
            .join("")}
        </div>
        <a href="${
          blog.link
        }" target="_blank" class="inline-block mt-6 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors">
          Read The Blog →
        </a>
      </div>
    </div>
  `;

  container.appendChild(blogEl);

  console.log("Populated blogs section with 1 blog post");
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

// Add a function to check if data is loaded properly
function checkDataLoading() {
  // Check if data variables are defined
  if (typeof portfolioData === "undefined") {
    console.error("portfolioData is not defined");
    // Define fallback data
    window.portfolioData = [
      {
        title: "GitOps Infrastructure for E-Commerce",
        description:
          "Built a fully automated, GitOps-driven infrastructure on AWS EKS using ArgoCD, Terraform, and GitHub Actions, reducing deployment times by 90%.",
        icon: "fa-cart-shopping",
      },
      {
        title: "Centralized Logging Platform",
        description:
          "Designed and deployed a centralized logging and monitoring stack using the ELK stack (Elasticsearch, Logstash, Kibana) and Prometheus on Kubernetes.",
        icon: "fa-magnifying-glass-chart",
      },
      {
        title: "Serverless Data Processing Pipeline",
        description:
          "Architected a serverless pipeline using AWS Lambda, S3, and API Gateway to process real-time data streams with high availability and low operational cost.",
        icon: "fa-gears",
      },
    ];
  }

  if (typeof blogData === "undefined") {
    console.error("blogData is not defined");
    // Define fallback data
    window.blogData = [
      {
        title: "The Power of Idempotency in IaC",
        excerpt:
          "Why ensuring your Terraform or Pulumi scripts can run multiple times without side effects is critical for stable automation...",
        link: "#",
        featured: true,
      },
      {
        title: "Kubernetes Cost Management Strategies",
        excerpt:
          "Practical tips for optimizing resource requests, implementing cluster autoscaling, and using spot instances to control cloud spend...",
        link: "#",
        featured: false,
      },
      {
        title: "Service Mesh: Is Istio or Linkerd Right for You?",
        excerpt:
          "A comparative analysis of the leading service meshes, breaking down their features, performance, and operational complexity...",
        link: "#",
        featured: false,
      },
    ];
  }
}

// Add a function to populate the experience section
function populateExperience() {
  const container = document.getElementById("experience-timeline");
  if (!container) {
    console.warn("Experience timeline container not found");
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  // Check if we have experience data
  if (
    !experienceData ||
    !Array.isArray(experienceData) ||
    experienceData.length === 0
  ) {
    console.warn("Experience data is missing or empty");
    container.innerHTML =
      "<p class='text-center text-slate-400'>No experience entries available at the moment.</p>";
    return;
  }

  // Create and append experience elements
  experienceData.forEach((job, index) => {
    const jobEl = document.createElement("div");
    jobEl.className = `reveal-section timeline-item ${
      index % 2 === 0 ? "left" : "right"
    }`;

    jobEl.innerHTML = `
      <div class="glass-pane p-6 rounded-xl hover:border-sky-400 transition-all">
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-orbitron text-xl text-white">${job.company}</h3>
          <span class="text-sky-400 text-sm font-semibold">${job.period}</span>
        </div>
        <h4 class="text-sky-300 font-semibold mb-3">${job.position}</h4>
        <p class="text-slate-400 mb-4">${job.description}</p>
        <div class="flex flex-wrap gap-2">
          ${job.technologies
            .map(
              (tech) =>
                `<span class="bg-slate-800 text-sky-300 text-xs px-3 py-1 rounded-full">${tech}</span>`
            )
            .join("")}
        </div>
      </div>
    `;

    container.appendChild(jobEl);
  });

  console.log(`Populated experience with ${experienceData.length} entries`);
}

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
  const bottomNav = document.getElementById('bottom-nav');
  if (!bottomNav) return;
  
  // Force a repaint to ensure z-index is applied
  bottomNav.style.display = 'none';
  setTimeout(() => {
    bottomNav.style.display = '';
  }, 10);
  
  // Add event listener to ensure dock stays on top during scrolling
  window.addEventListener('scroll', () => {
    bottomNav.style.zIndex = '1000';
  });
  
  // Check for any dynamically added content that might overlap
  const observer = new MutationObserver(() => {
    bottomNav.style.zIndex = '1000';
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
}
