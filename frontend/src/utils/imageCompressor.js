/**
 * Utility to compress and resize images client-side before uploading.
 * Ensures payloads stay well within Vercel's 4.5MB serverless limits and upload instantaneously.
 */
export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    // If already an HTTP/HTTPS URL, no compression needed
    if (typeof file === "string" && (file.startsWith("http://") || file.startsWith("https://"))) {
      return resolve(file);
    }

    const processImageSource = (src) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };

    if (file instanceof Blob || file instanceof File) {
      const reader = new FileReader();
      reader.onerror = (err) => reject(err);
      reader.onload = (e) => {
        processImageSource(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (typeof file === "string" && file.startsWith("data:")) {
      processImageSource(file);
    } else {
      resolve(file);
    }
  });
};
