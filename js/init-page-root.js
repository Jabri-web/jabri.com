// js/init-page-root.js
// This loads header and footer from the root directory

async function initPage() {
  try {
    console.log('🔄 Loading header and footer from root...');
    
    // 1️⃣ LOAD HEADER (from root)
    const headerResponse = await fetch('header.html');
    if (!headerResponse.ok) {
      throw new Error(`Header not found (${headerResponse.status})`);
    }
    const headerHTML = await headerResponse.text();
    console.log('📄 Header HTML loaded, length:', headerHTML.length);
    
    // Parse header HTML
    const parser = new DOMParser();
    const headerDoc = parser.parseFromString(headerHTML, 'text/html');
    
    // Extract ALL head content
    let headContent = headerDoc.head.innerHTML;
    
    // Remove duplicate title from header (keep page title)
    const titleMatch = headContent.match(/<title>.*?<\/title>/);
    if (titleMatch) {
      headContent = headContent.replace(titleMatch[0], '');
    }
    
    // Inject header content into head
    document.head.insertAdjacentHTML('beforeend', headContent);
    console.log('✅ Header head content injected');
    
    // Handle body content from header (scripts, etc.)
    const headerBodyContent = headerDoc.body.innerHTML;
    if (headerBodyContent.trim()) {
      const container = document.createElement('div');
      container.id = 'header-body-content';
      container.style.display = 'none';
      document.body.prepend(container);
      container.innerHTML = headerBodyContent;
      console.log('✅ Header body content stored');
    }
    
    // Execute any scripts in the header body
    const headerScripts = document.querySelectorAll('#header-body-content script');
    console.log(`📜 Found ${headerScripts.length} scripts in header`);
    headerScripts.forEach((script, index) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      document.head.appendChild(newScript);
      console.log(`✅ Script ${index + 1} executed`);
    });
    
    // 2️⃣ LOAD FOOTER (from root)
    const footerResponse = await fetch('footer.html');
    if (!footerResponse.ok) {
      throw new Error(`Footer not found (${footerResponse.status})`);
    }
    const footerHTML = await footerResponse.text();
    console.log('📄 Footer HTML loaded, length:', footerHTML.length);
    
    // Parse footer HTML
    const footerDoc = parser.parseFromString(footerHTML, 'text/html');
    
    // Replace footer placeholder with footer content
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      const footerContent = footerDoc.body.innerHTML;
      footerPlaceholder.outerHTML = footerContent;
      console.log('✅ Footer loaded successfully');
      // Notify that footer is loaded
      document.dispatchEvent(new Event('footerLoaded'));
    } else {
      console.warn('⚠️ Footer placeholder not found');
      // Fallback: append footer to body
      const footerContent = footerDoc.body.innerHTML;
      const footerDiv = document.createElement('div');
      footerDiv.id = 'site-footer';
      footerDiv.innerHTML = footerContent;
      document.body.appendChild(footerDiv);
    }
    
    // Also inject any <head> content from footer
    if (footerDoc.head.innerHTML.trim()) {
      document.head.insertAdjacentHTML('beforeend', footerDoc.head.innerHTML);
    }
    
    // 3️⃣ Initialize language AFTER all scripts are loaded
    setTimeout(() => {
      const savedLang = localStorage.getItem('preferred-language') || 'ar';
      console.log(`🌐 Setting language to: ${savedLang}`);
      
      // Set body class
      document.body.classList.remove('ar', 'en');
      document.body.classList.add(savedLang);
      
      // Set HTML attributes
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      
      // Update language-specific content
      if (typeof updateHeadLang === 'function') {
        updateHeadLang();
        console.log('✅ updateHeadLang called');
      } else {
        console.warn('⚠️ updateHeadLang not found');
      }
      
      if (typeof updateFooterLang === 'function') {
        updateFooterLang();
        console.log('✅ updateFooterLang called');
      } else {
        console.warn('⚠️ updateFooterLang not found');
      }
      
      // Update button states
      const langAr = document.getElementById('lang-ar');
      const langEn = document.getElementById('lang-en');
      if (langAr) langAr.classList.toggle('active', savedLang === 'ar');
      if (langEn) langEn.classList.toggle('active', savedLang === 'en');
      
      console.log('🎉 Root page initialization complete!');
    }, 100); // Small delay to ensure scripts are processed
    
  } catch (error) {
    console.error('❌ Error loading header/footer:', error);
    // Show fallback message
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = `
                <div style="background: #1a1a2e; color: #888; padding: 2rem; text-align: center; border-top: 1px solid #333;">
                    <p>⚠️ Footer could not be loaded. Please refresh the page.</p>
                    <p style="font-size: 12px; color: #666;">Error: ${error.message}</p>
                </div>
            `;
    }
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
