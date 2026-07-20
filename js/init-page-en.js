// js/init-page-en.js
// This loads English header and footer from the /en/ folder

async function initPage() {
    try {
        console.log('🔄 Loading English header and footer...');
        
        // 1️⃣ LOAD ENGLISH HEADER
        const headerResponse = await fetch('../en/header.html');
        if (!headerResponse.ok) {
            throw new Error(`Header not found (${headerResponse.status})`);
        }
        const headerHTML = await headerResponse.text();
        
        const parser = new DOMParser();
        const headerDoc = parser.parseFromString(headerHTML, 'text/html');
        
        let headContent = headerDoc.head.innerHTML;
        const titleMatch = headContent.match(/<title>.*?<\/title>/);
        if (titleMatch) {
            headContent = headContent.replace(titleMatch[0], '');
        }
        
        document.head.insertAdjacentHTML('beforeend', headContent);
        
        const headerBodyContent = headerDoc.body.innerHTML;
        if (headerBodyContent.trim()) {
            const container = document.createElement('div');
            container.id = 'header-body-content';
            container.style.display = 'none';
            document.body.prepend(container);
            container.innerHTML = headerBodyContent;
        }
        
        const scripts = document.querySelectorAll('#header-body-content script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.head.appendChild(newScript);
        });
        
        console.log('✅ English header loaded');
        
        // 2️⃣ LOAD ENGLISH FOOTER
        const footerResponse = await fetch('../en/footer.html');
        if (!footerResponse.ok) {
            throw new Error(`Footer not found (${footerResponse.status})`);
        }
        const footerHTML = await footerResponse.text();
        const footerDoc = parser.parseFromString(footerHTML, 'text/html');
        
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerDoc.body.innerHTML;
            console.log('✅ English footer loaded');
        }
        
        // Set English as default
        document.body.classList.add('en');
        document.body.classList.remove('ar');
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        
        // Update language content
        if (typeof updateHeadLang === 'function') {
            updateHeadLang();
        }
        if (typeof updateFooterLang === 'function') {
            updateFooterLang();
        }
        
        console.log('🎉 English page ready!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
