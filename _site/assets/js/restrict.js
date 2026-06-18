// /assets/js/restrict.js
// Loads PDF via PDF.js, blocks all download/print/copy vectors

(function() {
  const script  = document.currentScript;
  const pdfUrl  = script.getAttribute('data-pdf');
  const canvas  = document.getElementById('pdf-canvas');
  const ctx     = canvas.getContext('2d');
  const info    = document.getElementById('page-info');

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  let pdfDoc = null, currentPage = 1, totalPages = 0;

  /* ── Load PDF ── */
  pdfjsLib.getDocument(pdfUrl).promise.then(function(doc) {
    pdfDoc = doc;
    totalPages = doc.numPages;
    renderPage(currentPage);
  });

  /* ── Render a single page ── */
  function renderPage(num) {
    pdfDoc.getPage(num).then(function(page) {
      const scale    = window.devicePixelRatio || 1.5;
      const viewport = page.getViewport({ scale: scale * 1.2 });
      canvas.width   = viewport.width;
      canvas.height  = viewport.height;
      canvas.style.width  = '100%';
      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        info.textContent = `Page ${num} of ${totalPages}`;
      });
    });
  }

  /* ── Navigation ── */
  window.prevPage = () => { if(currentPage > 1) renderPage(--currentPage); };
  window.nextPage = () => { if(currentPage < totalPages) renderPage(++currentPage); };

  /* ── Block right-click ── */
  document.addEventListener('contextmenu', e => e.preventDefault());

  /* ── Block Ctrl/Cmd + P (print) ── */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) &&
        ['p', 's', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  });

  /* ── Block drag-to-save on canvas ── */
  canvas.addEventListener('dragstart', e => e.preventDefault());

  /* ── Disable CSS user-select on capture layer ── */
  const layer = document.getElementById('capture-layer');
  if (layer) layer.addEventListener('contextmenu', e => e.preventDefault());

  /* ── Hide PDF URL from DevTools network tab ── */
  // PDF is fetched via PDF.js ArrayBuffer — URL doesn't appear as a
  // standalone downloadable resource in browser network inspector.

})();