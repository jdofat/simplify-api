document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const inputSection = document.getElementById("inputSection");
  const startSection = document.getElementById("startSection");
  const goButton = document.getElementById("goButton");
  const topicInput = document.getElementById("topicInput");
  const loadingScreen = document.getElementById("loadingScreen");
  const resultSection = document.getElementById("resultSection");
  const explanationText = document.getElementById("explanationText");

  // Show the input section when "start" is clicked
  startButton.addEventListener("click", () => {
    startSection.style.display = "none";
    inputSection.style.display = "block";
  });

  // Handle "simplify" button click
  goButton.addEventListener("click", async () => {
    const topic = topicInput.value.trim();
    if (!topic) return;

    // Show loading overlay
    loadingScreen.style.display = "flex";
    resultSection.style.display = "none";

    try {
      const response = await fetch("/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (data.simplifiedText) {
        explanationText.innerText = data.simplifiedText;
        resultSection.style.display = "block";
      } else {
        explanationText.innerText = "Something went wrong. Try again!";
        resultSection.style.display = "block";
      }
    } catch (error) {
      explanationText.innerText = "Error connecting to Simplify API.";
      resultSection.style.display = "block";
    }

    // Hide loading overlay
    loadingScreen.style.display = "none";
  });
});
