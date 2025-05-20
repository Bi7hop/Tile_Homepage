document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
});

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const privacy = document.getElementById('privacy');
        
        if (!name.value.trim()) {
            name.classList.add('error');
            isValid = false;
            name.classList.add('shake');
            setTimeout(() => { name.classList.remove('shake'); }, 500);
        } else {
            name.classList.remove('error');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            isValid = false;
            email.classList.add('shake');
            setTimeout(() => { email.classList.remove('shake'); }, 500);
        } else {
            email.classList.remove('error');
        }
        
        if (!message.value.trim()) {
            message.classList.add('error');
            isValid = false;
            message.classList.add('shake');
            setTimeout(() => { message.classList.remove('shake'); }, 500);
        } else {
            message.classList.remove('error');
        }
        
        if (!privacy.checked) {
            privacy.classList.add('error');
            isValid = false;
            const privacyLabel = privacy.parentElement;
            privacyLabel.classList.add('shake');
            setTimeout(() => { privacyLabel.classList.remove('shake'); }, 500);
        } else {
            privacy.classList.remove('error');
        }
        
        return isValid;
    }

    const formFields = contactForm.querySelectorAll('.form-control, .form-check-input');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            if (field.type === 'checkbox') {
                field.classList.toggle('error', !field.checked);
            } else if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                field.classList.toggle('error', !field.value.trim() || !emailRegex.test(field.value.trim()));
            } else if (field.hasAttribute('required')) {
                field.classList.toggle('error', !field.value.trim());
            }
        });
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            if (formMessage) {
                formMessage.textContent = 'Bitte füllen Sie alle Pflichtfelder korrekt aus.';
                formMessage.className = 'form-message error';
            }
            return;
        }
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Wird gesendet...';
            submitBtn.classList.add('btn-loading');
        }
        
        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Fehler beim Senden der Nachricht');
        })
        .then(data => {
            if (formMessage) {
                formMessage.textContent = 'Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.';
                formMessage.className = 'form-message success';
            }
            contactForm.reset();
            setTimeout(() => {
                if (formMessage) formMessage.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            if (formMessage) {
                formMessage.textContent = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie uns telefonisch.';
                formMessage.className = 'form-message error';
            }
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Nachricht senden';
                submitBtn.classList.remove('btn-loading');
            }
        });
    });

    if (!document.querySelector('style#loading-spinner-style')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'loading-spinner-style';
        styleElement.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s infinite linear;
                margin-right: 8px;
            }
            .shake {
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
                40%, 60% { transform: translate3d(3px, 0, 0); }
            }
            .btn-loading {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(styleElement);
    }
}