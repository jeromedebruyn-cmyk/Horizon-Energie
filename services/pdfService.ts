import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateResultsPdf = async (elementId: string, filename: string = 'Simulation_Horizon_Energie.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return null;
  }

  try {
    // 1. Prepare element for capture (temporary styles if needed)
    const originalStyle = element.style.backgroundColor;
    element.style.backgroundColor = '#f9fafb'; // Light gray background like the site

    // 2. Capture with html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#f9fafb',
      ignoreElements: (el) => {
        // Ignore buttons and the lead form during PDF generation
        return el.tagName === 'BUTTON' || el.classList.contains('no-pdf');
      }
    });

    // 3. Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Handle multi-page if necessary (though a single long page is often better for digital)
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // 4. Reset original styles
    element.style.backgroundColor = originalStyle;

    // 5. Return PDF object (can be used to save or get base64)
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
};

export const downloadPdf = (pdf: jsPDF, filename: string) => {
  pdf.save(filename);
};

export const getPdfBase64 = (pdf: jsPDF) => {
  return pdf.output('datauristring');
};
