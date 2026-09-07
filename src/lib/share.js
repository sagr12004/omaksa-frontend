export async function shareResults(title = "Octavium OMAKS results") {
  const data = {
    title,
    text: "I completed the Octavium Musical Aptitude, Knowledge & Skills challenge.",
    url: window.location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${data.text} ${data.url}`);
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
  }
  window.prompt("Copy your results link", data.url);
}
