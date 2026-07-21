// js/init-page.js - نسخة ذكية تكتشف المسار تلقائياً

async function initPage() {
    console.log('🔄 [init-page] بدء تحميل الهيدر والفوتر...');
    
    try {
        // 🔍 اكتشاف المسار الصحيح للهيدر والفوتر
        const isRoot = window.location.pathname === '/' || 
                      window.location.pathname === '/index.html' ||
                      window.location.pathname.endsWith('/index.html');
        
        // تحديد المسار الصحيح
        const basePath = isRoot ? '' : '..';
        const headerUrl = `${basePath}/header.html`;
        const footerUrl = `${basePath}/footer.html`;
        
        console.log(`📍 المسار: ${basePath || 'الجذر'}`);
        console.log(`📄 تحميل الهيدر من: ${headerUrl}`);
        
        // 1️⃣ تحميل الهيدر
        const headerRes = await fetch(headerUrl);
        if (!headerRes.ok) {
            throw new Error(`الهيدر غير موجود (${headerRes.status})`);
        }
        const headerHTML = await headerRes.text();
        console.log('✅ تم تحميل الهيدر بنجاح');
        
        const parser = new DOMParser();
        const headerDoc = parser.parseFromString(headerHTML, 'text/html');
        document.head.insertAdjacentHTML('beforeend', headerDoc.head.innerHTML);
        
        // تنفيذ سكريبتات الهيدر
        const headerScripts = headerDoc.querySelectorAll('script');
        headerScripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.head.appendChild(newScript);
        });
        
        // 2️⃣ تحميل الفوتر
        console.log(`📄 تحميل الفوتر من: ${footerUrl}`);
        const footerRes = await fetch(footerUrl);
        if (!footerRes.ok) {
            throw new Error(`الفوتر غير موجود (${footerRes.status})`);
        }
        const footerHTML = await footerRes.text();
        console.log('✅ تم تحميل الفوتر بنجاح');
        
        const footerDoc = parser.parseFromString(footerHTML, 'text/html');
        
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerDoc.body.innerHTML;
            console.log('✅ تم وضع الفوتر في المكان المخصص');
            
            // تنفيذ سكريبتات الفوتر
            const footerScripts = footerDoc.querySelectorAll('script');
            footerScripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
            
            document.dispatchEvent(new Event('footerLoaded'));
        }
        
        console.log('🎉 تم تحميل الهيدر والفوتر بنجاح!');
        
    } catch (error) {
        console.error('❌ خطأ:', error);
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = `
                <div style="background: #1a1a2e; color: #888; padding: 2rem; text-align: center; border-top: 1px solid #333;">
                    <p>⚠️ لم يتم تحميل الفوتر. يرجى تحديث الصفحة.</p>
                    <p style="font-size: 12px; color: #666;">خطأ: ${error.message}</p>
                </div>
            `;
        }
    }
}

// تشغيل التحميل
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
