export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).YT && (window as any).YT.Player) {
      return resolve();
    }
    
    const existingScript = document.getElementById('youtube-api-script');
    if (existingScript) {
      const currentCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (currentCallback) currentCallback();
        resolve();
      };
      return;
    }

    const tag = document.createElement("script");
    tag.id = 'youtube-api-script';
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    
    (window as any).onYouTubeIframeAPIReady = () => resolve();
  });
}
