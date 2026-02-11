/**
 * SISTEMA DE COMPARTIR EN REDES SOCIALES - Aula Industrial
 * Permite compartir progreso en LinkedIn, Facebook, Twitter, WhatsApp
 */

class SocialShareService {
    constructor() {
        // Detectar la URL base correctamente
        this.baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
    }

    /**
     * Generar texto aleatorio de compartir
     */
    generateShareText(stats) {
        const messages = [
            `🏭 He completado ${stats.completedExercises} ejercicios en Aula Industrial con un ${stats.successRate}% de aciertos!`,
            `⚡ Avanzando en mi formación industrial: ${stats.completedExercises}/${stats.totalExercises} ejercicios completados`,
            `🎯 Mejorando mis skills técnicos - ${stats.completedExercises} ejercicios de Aula Industrial completados`,
            `💪 Formación en electricidad, PLCs y diagnóstico: ${stats.completedExercises} ejercicios con ${stats.successRate}% de aciertos`
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Compartir en LinkedIn
     */
    shareOnLinkedIn(stats) {
        const url = encodeURIComponent(this.baseUrl);
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    }

    /**
     * Compartir en Facebook
     */
    shareOnFacebook(stats) {
        const url = encodeURIComponent(this.baseUrl);
        const quote = encodeURIComponent(this.generateShareText(stats));
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
        window.open(facebookUrl, '_blank', 'width=600,height=600');
    }

    /**
     * Compartir en Twitter/X
     */
    shareOnTwitter(stats) {
        const text = encodeURIComponent(this.generateShareText(stats) + '\n\n#FormaciónIndustrial #PLCs #Electricidad');
        const url = encodeURIComponent(this.baseUrl);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(twitterUrl, '_blank', 'width=600,height=600');
    }

    /**
     * Compartir en WhatsApp
     */
    shareOnWhatsApp(stats) {
        const text = encodeURIComponent(this.generateShareText(stats) + '\n\n' + this.baseUrl);
        const whatsappUrl = `https://wa.me/?text=${text}`;
        window.open(whatsappUrl, '_blank');
    }

    /**
     * Copiar enlace al portapapeles
     */
    async copyLink(stats) {
        const text = `${this.generateShareText(stats)}\n\n${this.baseUrl}`;
        
        try {
            await navigator.clipboard.writeText(text);
            return { success: true };
        } catch (error) {
            console.error('Error copiando:', error);
            return { success: false };
        }
    }
}

// Inicializar
window.socialShareService = new SocialShareService();
console.log('✅ Sistema de compartir en redes sociales listo');
