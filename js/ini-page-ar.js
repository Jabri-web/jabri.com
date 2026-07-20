// js/init-page-ar.js
// This loads Arabic header and footer from the /ar/ folder

async function initPage() {
  try {
    console.log('🔄 Loading Arabic header and footer...');
    
    // 1️⃣ LOAD ARABIC HEADER (from /ar/ folder)
    const headerResponse = await fetch('../ar/header.html');
    if (!headerResponse.ok) {
      throw new Error(`Header not found (${headerResponse.status})`);
    }
    const headerHTML = await headerResponse.text();
    
    // Parse header HTML
    const parser = new DOMParser();
    const headerDoc = parser.parseFromString(headerHTML, 'text/html');
    
    // Inject header <head> content (SEO, meta tags, scripts)
    const headContent = headerDoc.head.innerHTML;
    document.head.insertAdjacentHTML('beforeend', headContent);
    
    // Handle any <body> content from header
    const headerBodyContent = headerDoc.body.innerHTML;
    if (headerBodyContent.trim()) {
      const container = document.createElement('div');
      container.id = 'header-body-content';
      container.style.display = 'none';
      document.body.prepend(container);
      container.innerHTML = headerBodyContent;
    }
    
    console.log('✅ Arabic header loaded successfully');
    
    // Verify Google tags
    const verification = document.querySelector('meta[name="google-site-verification"]');
    if (verification) {
      console.log('🔑 Google Verification:', verification.content);
    }
    
    // 2️⃣ LOAD ARABIC FOOTER (from /ar/ folder)
    const footerResponse = await fetch('../ar/footer.html');
    if (!footerResponse.ok) {
      throw new Error(`Footer not found (${footerResponse.status})`);
    }
    const footerHTML = await footerResponse.text();
    
    // Parse footer HTML
    const footerDoc = parser.parseFromString(footerHTML, 'text/html');
    
    // Replace footer placeholder with footer content
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      const footerContent = footerDoc.body.innerHTML;
      footerPlaceholder.outerHTML = footerContent;
      console.log('✅ Arabic footer loaded successfully');
    } else {
      console.warn('⚠️ Footer placeholder not found (add <div id="footer-placeholder"></div>)');
    }
    
    // Also inject any <head> content from footer
    if (footerDoc.head.innerHTML.trim()) {
      document.head.insertAdjacentHTML('beforeend', footerDoc.head.innerHTML);
    }
    
    console.log('🎉 Arabic page initialization complete!');
    
  } catch (error) {
    console.error('❌ Error loading Arabic header/footer:', error);
    // Show fallback message
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = `
                <div style="background: #1a1a2e; color: #888; padding: 2rem; text-align: center; border-top: 1px solid #333;">
                    <p>⚠️ Footer could not be loaded. Please refresh the page.</p>
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
