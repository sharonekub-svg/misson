/** Grab several evenly-spaced JPEG frames from a video and return them as
 *  base64 (no data-URL prefix). Sending a few moments — not one still — lets
 *  the AI actually see an action happen, so it can verify movement-based
 *  missions, not just static ones. */
export async function extractFramesBase64(file: Blob, count = 4): Promise<string[]> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    const frames: string[] = [];
    const finish = () => {
      URL.revokeObjectURL(url);
      resolve(frames);
    };

    video.onloadeddata = () => {
      const duration = video.duration && isFinite(video.duration) ? video.duration : 1;
      // Sample across the clip, skipping the very start/end.
      const times: number[] = [];
      for (let i = 0; i < count; i++) {
        times.push(Math.max(0.05, ((i + 0.5) / count) * duration));
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let idx = 0;

      const grab = () => {
        try {
          if (!ctx) return finish();
          const w = Math.min(512, video.videoWidth || 512);
          const ratio = video.videoHeight && video.videoWidth ? video.videoHeight / video.videoWidth : 1;
          canvas.width = w;
          canvas.height = Math.round(w * ratio);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const b64 = canvas.toDataURL("image/jpeg", 0.6).split(",")[1];
          if (b64) frames.push(b64);
        } catch {
          /* skip this frame */
        }
        idx += 1;
        if (idx >= times.length) return finish();
        seekNext();
      };

      const seekNext = () => {
        try {
          video.currentTime = times[idx];
        } catch {
          grab();
        }
      };

      video.onseeked = grab;
      seekNext();
    };

    video.onerror = () => finish();
  });
}
