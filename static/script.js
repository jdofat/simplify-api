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
  const restartButton = document.getElementById("restartButton");

restartButton.addEventListener("click", () => {
    // Hide the result section
    resultSection.style.display = "none";
    resultSection.classList.remove("fade-in", "fade-out");
    inputSection.classList.remove("fade-in", "fade-out");


    // Reset input field
    topicInput.value = "";

    // Show start section and intro label again
    startSection.style.display = "block";
    introLabel.style.display = "block";
    startButton.classList.remove("fade-out");
    introLabel.classList.remove("fade-out");
    startButton.classList.add("fade-in");
    introLabel.classList.add("fade-in");
});

  // Fade transition from start to input section
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

  // "Simplify" button → show loading → fetch simplified text
  goButton.addEventListener("click", async () => {
    const topic = topicInput.value.trim();
    if (topic === "") {
      alert("you didn't even enter a topic.");
      return;
    }

    // Show loading screen
    inputSection.style.display = "none";
    loadingScreen.style.display = "flex";
    loadingText.textContent = "simplifying...";

    try {
      const res = await fetch("/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok || !data.simplifiedText) {
        throw new Error(data.error || "No response from API");
      }

      // Fade out loading, fade in result
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
        explanationText.innerHTML = data.simplifiedText;
        resultSection.style.display = "block";
        resultSection.classList.add("fade-in");
      }, 800);
    } catch (error) {
      loadingText.textContent = "try something else.";
      console.error(error);
    }
  });
});
