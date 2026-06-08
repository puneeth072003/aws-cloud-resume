/**
 * Single source of truth for the portfolio's structural content.
 *
 * Text lives in `src/locales/*.json` and is referenced here by i18n key, so a
 * piece of content is only ever defined once. Each entry carries the structural
 * bits (icons, links, media paths, tags) plus the keys used to look up its copy.
 */

export interface NavItem {
  href: string;
  labelKey: string;
  icon: string; // Font Awesome class, e.g. "fa-house"
}

export const NAV_ITEMS: NavItem[] = [
  { href: "#home", labelKey: "navigation.home", icon: "fa-house" },
  { href: "#about", labelKey: "navigation.about", icon: "fa-user" },
  { href: "#recommendations", labelKey: "navigation.recommendations", icon: "fa-star" },
  { href: "#skills", labelKey: "navigation.skills", icon: "fa-chart-simple" },
  { href: "#portfolio", labelKey: "navigation.projects", icon: "fa-laptop" },
  { href: "#experience", labelKey: "navigation.experience", icon: "fa-briefcase" },
  { href: "#photography", labelKey: "navigation.photography", icon: "fa-camera-retro" },
];

export interface ExperienceItem {
  companyKey: string;
  periodKey: string;
  positionKey: string;
  descriptionKey: string;
  tags: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    companyKey: "experience.jobs0Company",
    periodKey: "experience.jobs0period",
    positionKey: "experience.jobs0position",
    descriptionKey: "experience.jobs0description",
    tags: ["SCONE", "Confidential Computing", "Kubernetes", "Docker", "Intel SGX", "Secure Enclaves"],
  },
  {
    companyKey: "experience.jobs1Company",
    periodKey: "experience.jobs1period",
    positionKey: "experience.jobs1position",
    descriptionKey: "experience.jobs1description",
    tags: ["AWS", "Kubernetes", "Docker", "Terraform", "PBC", "Observability"],
  },
  {
    companyKey: "experience.jobs2Company",
    periodKey: "experience.jobs2period",
    positionKey: "experience.jobs2position",
    descriptionKey: "experience.jobs2description",
    tags: ["Git", "GitHub", "React", "Markdown", "HTML", "CSS"],
  },
];

export interface Recommendation {
  nameKey: string;
  positionKey: string;
  quoteKey: string;
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    nameKey: "recommendations.recommender1Name",
    positionKey: "recommendations.recommender1Position",
    quoteKey: "recommendations.recommendation1",
  },
  {
    nameKey: "recommendations.recommender2Name",
    positionKey: "recommendations.recommender2Position",
    quoteKey: "recommendations.recommendation2",
  },
];

export interface Project {
  titleKey: string;
  descriptionKey: string;
  icon: string; // Font Awesome class
  video: string;
  liveUrl: string;
  sourceUrl: string;
}

export const PROJECTS: Project[] = [
  {
    titleKey: "portfolio.portfolioProject0title",
    descriptionKey: "portfolio.portfolioProject0description",
    icon: "fa-code",
    video: "/videos/CS-demo.mp4",
    liveUrl: "https://codesourcerer.webflow.io",
    sourceUrl: "https://github.com/puneeth072003/CODESOURCERER",
  },
  {
    titleKey: "portfolio.portfolioProject1title",
    descriptionKey: "portfolio.portfolioProject1description",
    icon: "fa-building-columns",
    video: "/videos/vitista.mp4",
    liveUrl: "https://vitista.vercel.app/",
    sourceUrl: "https://github.com/puneeth072003/Vitista",
  },
  {
    titleKey: "portfolio.portfolioProject2title",
    descriptionKey: "portfolio.portfolioProject2description",
    icon: "fa-music",
    video: "/videos/Sputilties-demo.mp4",
    liveUrl: "https://sputilities.netlify.app/",
    sourceUrl: "https://github.com/puneeth072003/sputilities.V1",
  },
  {
    titleKey: "portfolio.portfolioProject3title",
    descriptionKey: "portfolio.portfolioProject3description",
    icon: "fa-users",
    video: "/videos/huddle.mp4",
    liveUrl: "https://ho-huddle.vercel.app/",
    sourceUrl: "https://github.com/puneeth072003/huddle",
  },
];

export const CERTIFICATION_KEYS = [
  "certifications.items0",
  "certifications.items1",
  "certifications.items2",
  "certifications.items3",
  "certifications.items4",
];

export interface PipelineStage {
  icon: string;
  labelKey: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { icon: "fa-code-branch", labelKey: "pipeline.code" },
  { icon: "fa-box-open", labelKey: "pipeline.build" },
  { icon: "fa-shield-halved", labelKey: "pipeline.test" },
  { icon: "fa-rocket", labelKey: "pipeline.deploy" },
];

export const SKILL_RADAR = {
  labels: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD", "GitHub", "Monitoring"],
  values: [95, 90, 70, 80, 80, 85, 75],
};

export const PHOTOS: string[] = [
  "/assets/photos/DSC03302.png",
  "/assets/photos/DSC03471.jpg",
  "/assets/photos/DSC03550.JPG",
  "/assets/photos/DSC03763.JPG",
  "/assets/photos/DSC03529.JPG",
];

export const SOCIAL_LINKS = [
  { icon: "fa-github", url: "https://github.com/puneeth072003" },
  { icon: "fa-linkedin", url: "https://www.linkedin.com/in/puneeth072003/" },
  { icon: "fa-twitter", url: "https://twitter.com/puneeth072003" },
];

export const RESUME_PDF = "/assets/Puneeth_Y.pdf";
export const AVATAR = "/assets/avatar-alt1.png";
export const BLOG_COVER = "/assets/Cover.png";
export const BLOG_URL =
  "https://dev.to/puneeth072003/my-attempt-at-the-aws-cloud-resume-challenge-a-journey-in-the-cloud-13gd";
export const PHOTOGRAPHY_PORTFOLIO_URL = "https://500px.com/p/pyd?view=photos";

// Visitor counter (AWS Lambda function URL). The key is intentionally public —
// it is, and always has been, shipped in the client bundle.
export const COUNTER_URL =
  "https://dviz66qcm3vqhccxryrjmvn7yq0rnink.lambda-url.ap-south-1.on.aws/?key=oe7XZ2FvVVRpWkUMokTuEC3PuAKpy4u9";
