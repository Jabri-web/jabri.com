// js/init-page.js
// Legacy version - for pages in root directory (if any)

async function initPage() {
  try {
    console.log('🔄 Loading header and footer from root...');
    
    // Load header from root
    const headerRes = await fetch('header.html');
    const headerHTML = await headerRes.text();
    const parser = new DOMParser();
    const headerDoc = parser.parseFromString(headerHTML, 'text/html');
    document.head.insertAdjacentHTML('beforeend', headerDoc.head.innerHTML);
    
    // Load footer from root
    const footerRes = await fetch('footer.html');
    const footerHTML = await footerRes.text();
    const footerDoc = parser.parseFromString(footerHTML, 'text/html');
    document.getElementById('footer-placeholder').outerHTML = footerDoc.body.innerHTML;
    
    console.log('✅ Header/footer loaded from root');
  } catch (error) {
    console.warn('Error loading:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
