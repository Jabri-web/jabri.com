// js/language-switcher.js
// Master language control for the entire site

(function() {
    'use strict';
    
    // Language state
    let currentLang = 'ar'; // 'ar' or 'en'
    let isInitialized = false;
    
    // Get DOM elements with safe fallbacks
    function getElements() {
        return {
            html: document.documentElement,
            body: document.body,
            title: document.querySelector('title'),
            metaDesc: document.querySelector('.meta-desc'),
            ogTitle: document.querySelector('.og-title'),
            ogDesc: document.querySelector('.og-desc'),
            twTitle: document.querySelector('.tw-title'),
            twDesc: document.querySelector('.tw-desc'),
            footer: document.getElementById('site-footer'),
            searchTitle: document.getElementById('searchTitle'),
            copyright: document.getElementById('copyright'),
            footerTexts: () => document.querySelectorAll('#site-footer .txt'),
            langAr: document.getElementById('lang-ar'),
            langEn: document.getElementById('lang-en'),
            langToggle: document.getElementById('lang-toggle')
        };
    }
    
    // Update HTML direction and language attributes
    function updateDocumentAttributes(lang, elements) {
        const isEnglish = lang === 'en';
        if (elements.html) {
            elements.html.lang = lang;
            elements.html.dir = isEnglish ? 'ltr' : 'rtl';
        }
        if (elements.body) {
            elements.body.classList.remove('ar', 'en');
            elements.body.classList.add(lang);
        }
    }
    
    // Update HEAD meta tags
    function updateHeadContent(lang, elements) {
        const isEnglish = lang === 'en';
        
        // Update title
        if (elements.title) {
            const newTitle = isEnglish 
                ? elements.title.getAttribute('data-en') 
                : elements.title.getAttribute('data-ar');
            if (newTitle) elements.title.textContent = newTitle;
        }
        
        // Update meta descriptions
        const metaElements = [
            elements.metaDesc,
            elements.ogTitle,
            elements.ogDesc,
            elements.twTitle,
            elements.twDesc
        ];
        
        metaElements.forEach(el => {
            if (!el) return;
            const newContent = isEnglish 
                ? el.getAttribute('data-en') 
                : el.getAttribute('data-ar');
            if (newContent) el.setAttribute('content', newContent);
        });
    }
    
    // Update FOOTER content
    function updateFooterContent(lang, elements) {
        const isEnglish = lang === 'en';
        
        // Update footer direction
        if (elements.footer) {
            elements.footer.dir = isEnglish ? 'ltr' : 'rtl';
        }
        
        // Update search title
        if (elements.searchTitle) {
            elements.searchTitle.innerHTML = isEnglish 
                ? '<strong>🔍 Search for Researcher:</strong>' 
                : '<strong>🔍 البحث عن الباحث:</strong>';
        }
        
        // Update copyright
        if (elements.copyright) {
            elements.copyright.innerHTML = isEnglish 
                ? '© 2026 Eng. Abdulla Mohammed Nasser Al-Jabri - All Rights Reserved' 
                : '© 2026 م/ عبدالله محمد ناصر الجبري - جميع الحقوق محفوظة';
        }
        
        // Update all text elements with data attributes
        const texts = elements.footerTexts();
        if (texts) {
            texts.forEach(el => {
                const newText = isEnglish 
                    ? el.getAttribute('data-en') 
                    : el.getAttribute('data-ar');
                if (newText) el.textContent = newText;
            });
        }
    }
    
    // Update language switch button states
    function updateButtonStates(lang, elements) {
        const isEnglish = lang === 'en';
        
        if (elements.langAr) {
            elements.langAr.classList.toggle('active', !isEnglish);
        }
        if (elements.langEn) {
            elements.langEn.classList.toggle('active', isEnglish);
        }
        if (elements.langToggle) {
            elements.langToggle.textContent = isEnglish ? '🇸🇦 عربي' : '🇬🇧 English';
        }
    }
    
    // Main language switch function
    function switchLanguage(lang) {
        if (!lang || (lang !== 'ar' && lang !== 'en')) return;
        if (lang === currentLang && isInitialized) return;
        
        currentLang = lang;
        const elements = getElements();
        
        // Update everything
        updateDocumentAttributes(lang, elements);
        updateHeadContent(lang, elements);
        updateFooterContent(lang, elements);
        updateButtonStates(lang, elements);
        
        // Store preference
        try {
            localStorage.setItem('preferred-language', lang);
        } catch (e) {
            // Ignore localStorage errors
        }
        
        isInitialized = true;
        console.log(`🌐 Language switched to: ${lang}`);
        
        // Dispatch custom event for any other components
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    }
    
    // Load saved language preference
    function loadSavedLanguage() {
        try {
            const saved = localStorage.getItem('preferred-language');
            if (saved === 'en' || saved === 'ar') {
                return saved;
            }
        } catch (e) {
            // Ignore
        }
        // Default: Arabic
        return 'ar';
    }
    
    // Initialize language
    function initLanguage() {
        const savedLang = loadSavedLanguage();
        currentLang = savedLang;
        const elements = getElements();
        
        // Set language
        updateDocumentAttributes(savedLang, elements);
        updateHeadContent(savedLang, elements);
        updateButtonStates(savedLang, elements);
        
        // Update footer if it exists
        if (document.getElementById('site-footer')) {
            updateFooterContent(savedLang, elements);
        }
        
        isInitialized = true;
        console.log(`🌐 Language initialized: ${savedLang}`);
    }
    
    // Expose functions globally
    window.switchLanguage = switchLanguage;
    window.getCurrentLanguage = function() { return currentLang; };
    window.updateHeadLang = function() { 
        const elements = getElements();
        updateHeadContent(currentLang, elements); 
    };
    window.updateFooterLang = function() { 
        const elements = getElements();
        updateFooterContent(currentLang, elements); 
    };
    window.toggleLang = function() {
        switchLanguage(currentLang === 'ar' ? 'en' : 'ar');
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguage);
    } else {
        initLanguage();
    }
    
    // Also re-run when footer is dynamically loaded
    document.addEventListener('footerLoaded', function() {
        const elements = getElements();
        updateFooterContent(currentLang, elements);
        console.log('🔄 Footer updated after dynamic load');
    });
    
    // Also re-run when DOM is fully loaded (for safety)
    document.addEventListener('DOMContentLoaded', function() {
        if (!isInitialized) {
            initLanguage();
        }
        // Ensure footer is updated
        const elements = getElements();
        updateFooterContent(currentLang, elements);
    });
    
    console.log('✅ Language switcher loaded successfully');
})();
