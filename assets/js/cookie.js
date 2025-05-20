document.addEventListener('DOMContentLoaded', function() {
    setupCookieConsent();
});

function setupCookieConsent() {
    const cookieModal = document.getElementById('cookie-modal');
    const cookieClose = document.getElementById('cookie-close');
    const cookieAcceptAll = document.getElementById('cookie-accept-all');
    const cookieRejectAll = document.getElementById('cookie-reject-all');
    const cookieSave = document.getElementById('cookie-save');
    
    // Wenn keine Cookie-Präferenz gesetzt ist, Cookie-Modal anzeigen
    if (!localStorage.getItem('cookieConsent')) {
        cookieModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Modal schließen ohne Einstellungen zu speichern
    cookieClose.addEventListener('click', function() {
        cookieModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Alle Cookies akzeptieren
    cookieAcceptAll.addEventListener('click', function() {
        const settings = {
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('cookieConsent', JSON.stringify(settings));
        cookieModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Hier könnten Sie Code einfügen, um die entsprechenden Cookies zu setzen
        // z.B. activateAnalytics(), activateMarketing() etc.
    });
    
    // Alle nicht-essentiellen Cookies ablehnen
    cookieRejectAll.addEventListener('click', function() {
        const settings = {
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('cookieConsent', JSON.stringify(settings));
        cookieModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Hier könnten Sie Code einfügen, um alle nicht-essentiellen Cookies zu entfernen
    });
    
    // Ausgewählte Cookie-Einstellungen speichern
    cookieSave.addEventListener('click', function() {
        const analyticsConsent = document.getElementById('analytics-cookies').checked;
        const marketingConsent = document.getElementById('marketing-cookies').checked;
        
        const settings = {
            essential: true,
            analytics: analyticsConsent,
            marketing: marketingConsent,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('cookieConsent', JSON.stringify(settings));
        cookieModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Aktivieren Sie die entsprechenden Cookies basierend auf den Benutzereinstellungen
        if (analyticsConsent) {
            // Analyse-Cookies aktivieren
        }
        
        if (marketingConsent) {
            // Marketing-Cookies aktivieren
        }
    });
}