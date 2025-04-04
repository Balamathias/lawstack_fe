// hooks/usePrint.ts
import { useRef } from 'react';

const usePrint = () => {
  const ref = useRef<HTMLDivElement>(null);

  const printDiv = () => {
    if (ref.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print</title>');
        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
          .map(style => style.outerHTML)
          .join('');
        printWindow.document.write(styles);
        printWindow.document.write('</head><body>');
        printWindow.document.write(ref.current.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return { ref, printDiv };
};

export default usePrint;
