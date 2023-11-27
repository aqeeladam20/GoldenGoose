// imageUtils.ts

export const resizeImage = (file: File, maxSize: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          const scaleFactor = maxSize / Math.max(img.width, img.height);
  
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
  
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Error resizing image.'));
            }
          }, file.type);
        };
      };
  
      reader.onerror = (error) => reject(error);
    });
  };
  
  export const getBase64Image = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
  
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
  
      reader.onerror = (error) => reject(error);
    });
  };
  