document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const introLabel = document.getElementById("introLabel");
  const inputSection = document.getElementById("inputSection");
  const startSection = document.getElementById("startSection");
  const goButton = document.getElementById("goButton");
  const loadingScreen = document.getElementById("loadingScreen");
  const loadingText = document.getElementById("loadingText");
  const topicInput = document.getElementById("topicInput");
  const resultSection = document.getElementById("resultSection");
  const explanationText = document.getElementById("explanationText");

  // Fade to input section
  startButton.addEventListener("click", () => {
    startButton.classList.add("fade-out");
    introLabel.classList.add("fade-out");

    setTimeout(() => {
      startSection.style.display = "none";
      introLabel.style.display = "none";
      inputSection.style.display = "block";
      inputSection.classList.add("fade-in");
    }, 800);
  });

  // "Go" button → show loading → fetch simplified text
  goButton.addEventListener("click", async () => {
    const topic = topicInput.value.trim();
    if (topic === "") {
      alert("Please enter a topic first.");
      return;
    }

    // Show loading screen
    inputSection.style.display = "none";
    loadingScreen.style.display = "flex";
    loadingText.textContent = "Simplifying...";

    try {
      // Call backend API (relative path)
      const simplifiedText = await fetchSimplifiedExplanation(topic);

      // Fade out loading, fade in result
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
        explanationText.textContent = simplifiedText;
        resultSection.style.display = "block";
        resultSection.classList.add("fade-in");
      }, 800);
    } catch (error) {
      loadingText.textContent = "Error: Could not simplify. Try again.";
      console.error(error);
    }
  });

  // Fetch simplified explanation from backend
  async function fetchSimplifiedExplanation(topic) {
    const res = await fetch("/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();

    if (!res.ok || !data.simplifiedText) {
      throw new Error(data.error || "No response from API");
    }

    return data.simplifiedText;
  }
});
