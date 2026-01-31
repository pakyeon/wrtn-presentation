document.addEventListener('DOMContentLoaded', function() {
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
