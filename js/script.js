/**
 * JavaScript para la Institución Educativa San Isidro Labrador
 * Biblioteca Digital - E-book Viewer
 * Funcionalidades: descarga de PDF, año actual, navegación suave
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar todas las funcionalidades
    initializeApp();
    
});

/**
 * Función principal de inicialización
 */
function initializeApp() {
    setCurrentYear();
    initializeDownloadButton();
    initializeSmoothScrolling();
    initializePDFViewer();
    initializeResponsiveFeatures();
}

/**
 * Establecer el año actual en el footer
 */
function setCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
    }
}

/**
 * Inicializar funcionalidad del botón de descarga
 */
function initializeDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mostrar feedback visual
            showDownloadFeedback(downloadBtn);
            
            // Iniciar descarga
            downloadPDF();
            
            // Tracking de evento (opcional)
            trackDownloadEvent();
        });
    }
}

/**
 * Función para descargar el PDF
 */
function downloadPDF() {
    const pdfUrl = 'public/assets/Libro Ciberseguridad LAFC.pdf';
    const fileName = 'Libro_Ciberseguridad_LAFC.pdf';
    
    try {
        // Crear elemento de descarga temporal
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';
        
        // Agregar al DOM, hacer clic y remover
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Mostrar mensaje de éxito
        showNotification('¡Descarga iniciada! El archivo se guardará en tu carpeta de descargas.', 'success');
        
    } catch (error) {
        console.error('Error al descargar el PDF:', error);
        
        // Fallback: abrir en nueva pestaña
        window.open(pdfUrl, '_blank');
        showNotification('Se abrió el PDF en una nueva pestaña. Puedes descargarlo desde allí.', 'info');
    }
}

/**
 * Mostrar feedback visual en el botón de descarga
 */
function showDownloadFeedback(button) {
    const originalText = button.innerHTML;
    const originalClass = button.className;
    
    // Cambiar texto y estilo temporalmente
    button.innerHTML = `
        <svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4-2"></path>
        </svg>
        Descargando...
    `;
    button.style.opacity = '0.7';
    button.disabled = true;
    
    // Restaurar después de 2 segundos
    setTimeout(() => {
        button.innerHTML = originalText;
        button.className = originalClass;
        button.style.opacity = '1';
        button.disabled = false;
    }, 2000);
}

/**
 * Inicializar navegación suave
 */
function initializeSmoothScrolling() {
    // Manejar clics en enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Inicializar funcionalidades del visor PDF
 */
function initializePDFViewer() {
    const pdfEmbed = document.querySelector('.pdf-embed');
    const fallbackDiv = document.querySelector('.pdf-fallback');
    
    if (pdfEmbed && fallbackDiv) {
        // Ocultar fallback inicialmente
        fallbackDiv.style.display = 'none';
        
        // Verificar si el PDF se carga correctamente
        pdfEmbed.addEventListener('load', function() {
            console.log('PDF cargado correctamente');
            fallbackDiv.style.display = 'none';
        });
        
        pdfEmbed.addEventListener('error', function() {
            console.log('Error al cargar PDF, mostrando fallback');
            fallbackDiv.style.display = 'flex';
        });
        
        // Timeout para mostrar fallback si el PDF no carga en 5 segundos
        setTimeout(() => {
            if (pdfEmbed.style.display !== 'none') {
                // Verificar si el PDF realmente se cargó
                try {
                    if (!pdfEmbed.contentDocument && !pdfEmbed.contentWindow) {
                        fallbackDiv.style.display = 'flex';
                    }
                } catch (e) {
                    fallbackDiv.style.display = 'flex';
                }
            }
        }, 5000);
    }
}

/**
 * Inicializar características responsivas
 */
function initializeResponsiveFeatures() {
    // Ajustar altura del visor PDF en dispositivos móviles
    function adjustPDFViewerHeight() {
        const pdfContainer = document.querySelector('.pdf-embed-container');
        if (pdfContainer && window.innerWidth <= 768) {
            const viewportHeight = window.innerHeight;
            const maxHeight = Math.min(400, viewportHeight * 0.6);
            pdfContainer.style.height = maxHeight + 'px';
        }
    }
    
    // Ejecutar al cargar y al redimensionar
    adjustPDFViewerHeight();
    window.addEventListener('resize', debounce(adjustPDFViewerHeight, 250));
    
    // Manejar orientación en dispositivos móviles
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustPDFViewerHeight, 500);
    });
}

/**
 * Mostrar notificaciones al usuario
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0056A4'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Agregar estilos de animación si no existen
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Manejar cierre
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Función de tracking para analytics (opcional)
 */
function trackDownloadEvent() {
    // Aquí puedes agregar código para tracking con Google Analytics, etc.
    console.log('Evento de descarga registrado:', {
        file: 'Libro_Ciberseguridad_LAFC.pdf',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
    
    // Ejemplo para Google Analytics (descomenta si usas GA)
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'PDF',
            'event_label': 'Libro Ciberseguridad LAFC',
            'value': 1
        });
    }
    */
}

/**
 * Función debounce para optimizar eventos de resize
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Función para detectar si el usuario está en un dispositivo móvil
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Función para verificar soporte de PDF en el navegador
 */
function supportsPDFViewing() {
    const mimeTypes = navigator.mimeTypes;
    return mimeTypes && mimeTypes['application/pdf'] && mimeTypes['application/pdf'].enabledPlugin;
}

// Funciones adicionales para mejorar la experiencia del usuario

/**
 * Manejar errores globales de JavaScript
 */
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    // En producción, podrías enviar estos errores a un servicio de logging
});

/**
 * Manejar estado de conexión (online/offline)
 */
window.addEventListener('online', function() {
    showNotification('Conexión restaurada', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Sin conexión a internet. Algunas funciones pueden no estar disponibles.', 'error');
});

/**
 * Optimización de rendimiento: lazy loading para imágenes
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observar imágenes con data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}