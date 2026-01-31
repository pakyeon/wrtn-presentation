const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        console.log('Starting PDF conversion...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Create a new PDF document for merging
        const mergedPdf = await PDFDocument.create();

        // Loop through slides 1 to 14
        for (let i = 1; i <= 14; i++) {
            const slidePath = path.join(__dirname, `../슬라이드/슬라이드${i}.html`);
            const fileUrl = `file://${slidePath}`;
            
            console.log(`Processing Slide ${i}: ${fileUrl}`);

            if (!fs.existsSync(slidePath)) {
                console.error(`Slide file not found: ${slidePath}`);
                continue;
            }

            // Set viewport and scale factor for high resolution
            await page.setViewport({
                width: 1280,
                height: 720,
                deviceScaleFactor: 2
            });

            await page.goto(fileUrl, { waitUntil: 'networkidle0' });

            // Remove the "Use Arrow Keys to Navigate" hint
            await page.evaluate(() => {
                const divs = document.querySelectorAll('div');
                for (const div of divs) {
                    if (div.textContent.trim() === 'Use Arrow Keys to Navigate') {
                        div.style.display = 'none';
                    }
                }
            });

            // Generate PDF for the current slide
            // 1280x720 pixels approx 13.33 x 7.5 inches at 96 DPI
            // But PDF size helps printing. Let's just fit to the page.
            // Using a standard width and calculating height to maintain aspect ratio is tricky in PDF.
            // We'll set the PDF page size to match the viewport pixel size roughly.
            // 1280px / 96dpi * 72 points/inch = 960 points
            // 720px / 96dpi * 72 points/inch = 540 points
            // Let's use flexible format.
            const pdfBuffer = await page.pdf({
                printBackground: true,
                width: '1280px',
                height: '720px',
                pageRanges: '1' // Ensure only one page is captured if there's overflow
            });

            // Load the generated PDF
            const slidePdf = await PDFDocument.load(pdfBuffer);
            
            // Copy pages to the merged document
            const copiedPages = await mergedPdf.copyPages(slidePdf, slidePdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        await browser.close();

        // Save the merged PDF
        const outputPath = path.join(__dirname, '../output/presentation.pdf');
        const pdfBytes = await mergedPdf.save();
        fs.writeFileSync(outputPath, pdfBytes);

        console.log(`Successfully created PDF at: ${outputPath}`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    }
})();
