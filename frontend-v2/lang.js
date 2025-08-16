// Internationalization (i18n) System
class I18n {
  constructor() {
    this.currentLanguage = "en";
    this.translations = {};
    this.supportedLanguages = ["en", "de"];
    this.defaultLanguage = "en";

    // Initialize the system
    this.init();
  }

  async init() {
    if (document.readyState === "loading") {
      await new Promise((r) =>
        document.addEventListener("DOMContentLoaded", r)
      );
    }
    this.currentLanguage =
      this.getStoredLanguage() || this.detectBrowserLanguage();
    await this.loadTranslations(this.currentLanguage);
    this.applyTranslations();
    document.documentElement.lang = this.currentLanguage;
  }

  getStoredLanguage() {
    return localStorage.getItem("preferred-language");
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split("-")[0]; // Get 'en' from 'en-US'

    return this.supportedLanguages.includes(langCode)
      ? langCode
      : this.defaultLanguage;
  }

  async loadTranslations(language) {
    try {
      const translationPath = `./translations/${language}.json`;
      console.log(`Loading translations from: ${translationPath}`);

      const response = await fetch(translationPath);
      if (!response.ok) {
        throw new Error(
          `Failed to load translations for ${language}: ${response.status} ${response.statusText}`
        );
      }

      this.translations = await response.json();
      console.log(
        `Successfully loaded translations for ${language}:`,
        this.translations
      );
    } catch (error) {
      console.error("Error loading translations:", error);
      // Fallback to default language if current language fails
      if (language !== this.defaultLanguage) {
        console.log(`Falling back to ${this.defaultLanguage}`);
        await this.loadTranslations(this.defaultLanguage);
        this.currentLanguage = this.defaultLanguage;
      }
    }
  }

  applyTranslations() {
    console.log("Applying translations...", this.translations);

    // Update meta tags
    this.updateMetaTags();

    // Update elements with data-i18n attributes
    const elements = document.querySelectorAll("[data-i18n]");
    console.log(`Found ${elements.length} elements with data-i18n attributes`);

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.getTranslation(key);

      console.log(`Translating key "${key}" to "${translation}"`);

      if (translation && translation !== key) {
        // Handle different types of content
        if (element.tagName === "INPUT" && element.type === "submit") {
          element.value = translation;
        } else if (
          element.tagName === "INPUT" ||
          element.tagName === "TEXTAREA"
        ) {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      } else {
        console.warn(
          `No translation found for key: ${key}, keeping original content`
        );
        // Keep the original content if no translation is found
      }
    });

    // Update elements with data-i18n-html attributes (for HTML content)
    const htmlElements = document.querySelectorAll("[data-i18n-html]");
    htmlElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-html");
      const translation = this.getTranslation(key);

      if (translation && translation !== key) {
        element.innerHTML = translation;
      }
    });

    // Update dynamic content (JavaScript data objects)
    this.updateDynamicContent();

    // Dispatch event to notify other parts of the application
    document.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: {
          language: this.currentLanguage,
          translations: this.translations,
        },
      })
    );
  }

  updateMetaTags() {
    const meta = this.translations.meta;
    if (!meta) return;

    // Update title
    if (meta.title) {
      document.title = meta.title;
    }

    // Update meta description
    const description = document.querySelector('meta[name="description"]');
    if (description && meta.description) {
      description.setAttribute("content", meta.description);
    }

    // Update meta keywords
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords && meta.keywords) {
      keywords.setAttribute("content", meta.keywords);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && meta.ogTitle) {
      ogTitle.setAttribute("content", meta.ogTitle);
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription && meta.ogDescription) {
      ogDescription.setAttribute("content", meta.ogDescription);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && meta.twitterTitle) {
      twitterTitle.setAttribute("content", meta.twitterTitle);
    }

    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (twitterDescription && meta.twitterDescription) {
      twitterDescription.setAttribute("content", meta.twitterDescription);
    }
  }

  updateDynamicContent() {
    // This will be called to update JavaScript data objects
    // The main application will listen for the 'languageChanged' event
    // and update its data accordingly
  }

  getTranslation(key) {
    const keys = key.split(".");
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        // Return the key itself as fallback instead of null
        return key;
      }
    }

    return value;
  }

  async switchLanguage(language) {
    if (!this.supportedLanguages.includes(language)) {
      console.error(`Unsupported language: ${language}`);
      return;
    }

    if (language === this.currentLanguage) {
      console.log(
        `Language is already ${language}, but applying translations anyway`
      );
    }

    this.currentLanguage = language;

    // Save preference
    localStorage.setItem("preferred-language", language);

    // Load new translations
    await this.loadTranslations(language);

    // Apply translations
    this.applyTranslations();

    // Update HTML lang attribute
    document.documentElement.lang = language;

    console.log(`Language switched to: ${language}`);
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Helper method to get language display names
  getLanguageDisplayName(langCode) {
    const displayNames = {
      en: "English",
      de: "Deutsch",
    };
    return displayNames[langCode] || langCode;
  }

  // Helper method to get language flags
  getLanguageFlag(langCode) {
    const flags = {
      en: "🇺🇸",
      de: "🇩🇪",
    };
    return flags[langCode] || "🌐";
  }
}

// Create global instance
window.i18n = new I18n();

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = I18n;
}
