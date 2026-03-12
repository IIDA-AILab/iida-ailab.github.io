import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs";

const previewNodes = document.querySelectorAll("[data-pdf-preview]");

if (previewNodes.length > 0) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

  previewNodes.forEach(async (node) => {
    const pdfUrl = node.dataset.pdfPreview;
    const canvas = node.querySelector(".preview-pdf-canvas");
    const fallback = node.querySelector(".preview-pdf-fallback");

    if (!pdfUrl || !canvas) {
      return;
    }

    try {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const targetWidth = 220;
      const scale = targetWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });
      const context = canvas.getContext("2d");

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;

      canvas.style.display = "block";
      if (fallback) {
        fallback.style.display = "none";
      }
    } catch (error) {
      if (fallback) {
        fallback.style.display = "flex";
      }
    }
  });
}
