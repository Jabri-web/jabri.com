// js/init-page.js - تحميل الهيدر والفوتر من الجذر

async function initPage() {
    console.log('🔄 [init-page] بدء تحميل الهيدر والفوتر...');
    
    try {
        // 1️⃣ تحميل الهيدر من الجذر
        console.log('📄 [init-page] جاري تحميل الهيدر...');
        const headerRes = await fetch('/header.html');
        if (!headerRes.ok) {
            throw new Error(`الهيدر غير موجود (${headerRes.status})`);
        }
        const headerHTML = await headerRes.text();
        console.log('✅ [init-page] تم تحميل الهيدر بنجاح');
        
        const parser = new DOMParser();
        const headerDoc = parser.parseFromString(headerHTML, 'text/html');
        
        // إضافة محتوى الهيدر إلى <head>
        document.head.insertAdjacentHTML('beforeend', headerDoc.head.innerHTML);
        console.log('✅ [init-page] تم إضافة محتوى الهيدر');
        
        // تنفيذ سكريبتات الهيدر
        const headerScripts = headerDoc.querySelectorAll('script');
        headerScripts.forEach((script, index) => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.head.appendChild(newScript);
            console.log(`✅ [init-page] تم تنفيذ سكريبت الهيدر ${index + 1}`);
        });
        
        // 2️⃣ تحميل الفوتر من الجذر
        console.log('📄 [init-page] جاري تحميل الفوتر...');
        const footerRes = await fetch('/footer.html');
        if (!footerRes.ok) {
            throw new Error(`الفوتر غير موجود (${footerRes.status})`);
        }
        const footerHTML = await footerRes.text();
        console.log('✅ [init-page] تم تحميل الفوتر بنجاح');
        
        const footerDoc = parser.parseFromString(footerHTML, 'text/html');
        
        // وضع الفوتر في المكان المخصص
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerDoc.body.innerHTML;
            console.log('✅ [init-page] تم وضع الفوتر في المكان المخصص');
            
            // تنفيذ سكريبتات الفوتر
            const footerScripts = footerDoc.querySelectorAll('script');
            footerScripts.forEach((script, index) => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
                console.log(`✅ [init-page] تم تنفيذ سكريبت الفوتر ${index + 1}`);
            });
            
            // إعلام بأن الفوتر تم تحميله
            document.dispatchEvent(new Event('footerLoaded'));
            console.log('✅ [init-page] تم إرسال حدث footerLoaded');
        } else {
            console.warn('⚠️ [init-page] عنصر footer-placeholder غير موجود');
        }
        
        console.log('🎉 [init-page] تم تحميل الهيدر والفوتر بنجاح!');
        
    } catch (error) {
        console.error('❌ [init-page] خطأ في تحميل المكونات:', error);
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

// تشغيل التحميل عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
