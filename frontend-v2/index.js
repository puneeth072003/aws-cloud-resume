// --- DATA ---
const navData = [
  { href: "#home", label: "Home", icon: "fa-house" },
  { href: "#about", label: "About", icon: "fa-user" },
  { href: "#pipeline", label: "Pipeline", icon: "fa-network-wired" },
  { href: "#skills", label: "Skills", icon: "fa-chart-pie" },
  { href: "#portfolio", label: "Projects", icon: "fa-briefcase" },
  { href: "#blogs", label: "Blogs", icon: "fa-pen-to-square" },
  { href: "#photography", label: "Photography", icon: "fa-camera" },
  { href: "#contact", label: "Contact", icon: "fa-envelope" },
];
const certificationsData = [
  { name: "Top 1% in GSSoC'ext 2024", icon: "fa fa-trophy" },
  {
    name: "1st Place in the department-level mini-project",
    icon: "fa fa-trophy",
  },
  { name: "AZ-305 Microsoft Azure Architect Design Prerequisites", icon: "fa fa-trophy" },
  { name: "AWS Cloud Practitioner Essentials", icon: "fa fa-trophy" },
  { name: "Postman API Fundamentals Student Expert", icon: "fa fa-trophy" }
];
const portfolioData = [
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
const blogData = [
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

// --- CORE LOGIC ---
function main() {
  try {
    setupHeroAnimation();
  } catch (e) {
    console.error("Failed to initialize Hero Animation:", e);
    const heroCanvas = document.getElementById("hero-canvas");
    if (heroCanvas) heroCanvas.style.display = "none";
  }
  setupSkillsRadar();
  setupScrollAnimations();

  populateDock();
  populatePortfolio();
  populateCertifications();
  populateBlogs();
  populatePhotography();

  setupDockAnimation();
  setupPhotographyCarousel();
  setupLightbox();
  setupThemeSwitcher();
  updateCounter(); // Add this line to call the counter function
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
        "Python",
        "Monitoring",
      ],
      datasets: [
        {
          data: [90, 95, 85, 90, 92, 88, 85],
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
  if (!container) return;
  portfolioData.forEach((project) => {
    const projectEl = document.createElement("a");
    projectEl.href = "#";
    projectEl.className =
      "reveal-section glass-pane p-8 rounded-xl block hover:border-sky-400 transition-colors";
    projectEl.innerHTML = `
                    <div class="text-sky-400 mb-4 text-4xl">
                        <i class="fas ${project.icon}"></i>
                    </div>
                    <h3 class="font-orbitron text-2xl text-white">${project.title}</h3>
                    <p class="text-slate-400 mt-2">${project.description}</p>
                `;
    container.appendChild(projectEl);
  });
}

function populateBlogs() {
  const container = document.getElementById("blog-grid");
  if (!container) return;

  const featuredBlog = blogData.find((b) => b.featured);
  if (featuredBlog) {
    const featuredEl = document.createElement("a");
    featuredEl.href = featuredBlog.link;
    featuredEl.className =
      "reveal-section glass-pane p-8 rounded-xl block hover:border-sky-400 transition-colors md:flex items-start gap-6";
    featuredEl.innerHTML = `
                     <div class="text-sky-400 text-4xl mt-1 mb-4 md:mb-0">
                        <i class="fas fa-star"></i>
                    </div>
                    <div>
                        <h3 class="font-orbitron text-2xl md:text-3xl text-white">${featuredBlog.title}</h3>
                        <p class="text-slate-300 mt-2 text-md md:text-lg">${featuredBlog.excerpt}</p>
                        <span class="inline-block mt-4 font-semibold text-sky-300 text-lg">Read Spotlight Post &rarr;</span>
                    </div>
                `;
    container.appendChild(featuredEl);
  }

  const standardBlogsContainer = document.createElement("div");
  standardBlogsContainer.className = "grid md:grid-cols-2 gap-8 mt-8";

  blogData
    .filter((b) => !b.featured)
    .forEach((blog) => {
      const blogEl = document.createElement("a");
      blogEl.href = blog.link;
      blogEl.className =
        "reveal-section glass-pane p-8 rounded-xl block hover:border-sky-400 transition-colors";
      blogEl.innerHTML = `
                    <h3 class="font-orbitron text-2xl text-white">${blog.title}</h3>
                    <p class="text-slate-400 mt-2">${blog.excerpt}</p>
                    <div class="flex justify-between items-end mt-4">
                        <span class="font-semibold text-sky-400">Read More &rarr;</span>
                        <i class="fas fa-newspaper text-2xl text-slate-500"></i>
                    </div>
                `;
      standardBlogsContainer.appendChild(blogEl);
    });
  container.appendChild(standardBlogsContainer);
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
