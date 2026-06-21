/** Grab a single JPEG frame from a video file and return it as base64 (no
 *  data-URL prefix). Used to send the AI verifier something to look at. */
export async function extractFrameBase64(file: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    const done = (value: string | null) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };

    video.onloadeddata = () => {
      const seekTo = Math.min(0.6, (video.duration || 1) / 2);
      const grab = () => {
        try {
          const w = Math.min(512, video.videoWidth || 512);
          const ratio = video.videoHeight && video.videoWidth ? video.videoHeight / video.videoWidth : 1;
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = Math.round(w * ratio);
          const ctx = canvas.getContext("2d");
          if (!ctx) return done(null);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          done(dataUrl.split(",")[1] ?? null);
        } catch {
          done(null);
        }
      };
      video.onseeked = grab;
      try {
        video.currentTime = seekTo;
      } catch {
        grab();
      }
    };
    video.onerror = () => done(null);
  });
}
