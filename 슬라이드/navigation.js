document.addEventListener('DOMContentLoaded', function() {
    
    // --- Responsive Slide Scaling ---
    function fitSlideToScreen() {
        const slide = document.querySelector('.slide');
        if (!slide) return;

        const targetWidth = 1280;
        const targetHeight = 720;
        
        // Get available window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate scale to fit
        const scaleX = windowWidth / targetWidth;
        const scaleY = windowHeight / targetHeight;
        const scale = Math.min(scaleX, scaleY);
        
        // Apply transformation
        slide.style.transform = `scale(${scale})`;
        slide.style.transformOrigin = 'top left';
        
        // Center the slide
        const rect = slide.getBoundingClientRect();
        const scaledWidth = rect.width;
        const scaledHeight = rect.height;
        
        const left = (windowWidth - scaledWidth) / 2;
        const top = (windowHeight - scaledHeight) / 2;
        
        slide.style.position = 'absolute';
        slide.style.left = `${left}px`;
        slide.style.top = `${top}px`;
        
        // Ensure body background and overflow for presentation mode
        document.body.style.backgroundColor = '#222'; // Dark background
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.body.style.width = '100vw';
    }

    // Initial fit
    fitSlideToScreen();

    // Re-fit on resize
    window.addEventListener('resize', fitSlideToScreen);
    
    // --- Existing Navigation Logic ---

    // Total number of slides - update this if you add more slides
    const totalSlides = 14; 
    
    document.addEventListener('keydown', function(event) {
        // Get current filename from URL
        const path = window.location.pathname;
        // Decode URI component to handle non-ASCII characters (Korean)
        const filename = decodeURIComponent(path.split('/').pop());
        
        // Extract slide number using regex
        // Matches "슬라이드" followed by digits and ".html"
        const match = filename.match(/슬라이드(\d+)\.html/);
        
        if (!match) return;
        
        const currentSlide = parseInt(match[1]);
        let nextSlide = currentSlide;
        
        // Right Arrow, Space, or Enter -> Next Slide
        if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
            if (currentSlide < totalSlides) {
                nextSlide = currentSlide + 1;
            }
        } 
        // Left Arrow -> Previous Slide
        else if (event.key === 'ArrowLeft') {
            if (currentSlide > 1) {
                nextSlide = currentSlide - 1;
            }
        } else {
            return; // Ignore other keys
        }
        
        // Navigate if slide number changed
        if (nextSlide !== currentSlide) {
            window.location.href = `슬라이드${nextSlide}.html`;
        }
    });

    // Add navigation hints (optional)
    const hint = document.createElement('div');
    hint.style.position = 'fixed';
    hint.style.bottom = '10px';
    hint.style.right = '10px';
    hint.style.backgroundColor = 'rgba(0,0,0,0.5)';
    hint.style.color = 'white';
    hint.style.padding = '5px 10px';
    hint.style.borderRadius = '5px';
    hint.style.fontSize = '12px';
    hint.style.fontFamily = 'sans-serif';
    hint.style.zIndex = '9999';
    hint.style.pointerEvents = 'none';
    hint.textContent = 'Use Arrow Keys to Navigate';
    document.body.appendChild(hint);
});
