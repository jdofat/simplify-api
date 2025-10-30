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

  // Create Learn More container
  const learnMoreSection = document.createElement("div");
  learnMoreSection.id = "learnMoreSection";
  learnMoreSection.style.display = "none";
  learnMoreSection.innerHTML = `
      <h3>learn more</h3>
      <ul id="learnMoreLinks"></ul>
  `;
  resultSection.appendChild(learnMoreSection);
  const learnMoreLinks = document.getElementById("learnMoreLinks");

  // Fade transition from start to input section
  startButton.addEventListener("click", () => {
    startButton.classList.add("fade-out");
    introLabel.classList.add("fade-out");

    setTimeout(() => {
      startSection.style.display = "none";
      introLabel.style.display = "none";
      inputSection.style.display = "block";
      inputSection.classList.add("fade-in");
    }, 500);
  });

  // "Simplify" button → show loading → fetch simplified text
  goButton.addEventListener("click", async () => {
    const topic = topicInput.value.trim();
    if (topic === "") {
      alert("you didn't even enter a topic.");
      return;
    }

    // Hide input, show loading
    inputSection.style.display = "none";
    loadingScreen.style.display = "flex";
    loadingText.textContent = "one sec";

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

        // --- NEW: Format explanation neatly into paragraphs ---
        const rawText = data.simplifiedText;
        const paragraphs = rawText.split(/\.\s+/); // split after periods
        explanationText.innerHTML = paragraphs
          .map(p => `<p>${p.trim()}.</p>`)
          .join("");

        resultSection.style.display = "block";
        resultSection.classList.add("fade-in");

        // Show Learn More section after explanation
        showLearnMoreSection(topic);

        // Dynamically create Start Over button
        let restartButton = document.createElement("button");
        restartButton.textContent = "Start Over";
        restartButton.id = "restartButton";
        restartButton.style.marginTop = "20px";
        resultSection.appendChild(restartButton);

        // Add click handler
        restartButton.addEventListener("click", () => {
          resultSection.style.display = "none";
          resultSection.classList.remove("fade-in", "fade-out");
          restartButton.remove();
          topicInput.value = "";
          startSection.style.display = "block";
          introLabel.style.display = "block";
          startButton.classList.remove("fade-out");
          introLabel.classList.remove("fade-out");
          startButton.classList.add("fade-in");
          introLabel.classList.add("fade-in");
          learnMoreSection.style.display = "none"; // hide Learn More on reset
        });
      }, 400);

    } catch (error) {
      loadingText.textContent = "try something else.";
      console.error(error);
    }
  });

  // Function to populate Learn More links
  function showLearnMoreSection(topic) {
    learnMoreLinks.innerHTML = "";

    const query = encodeURIComponent(topic);
    const sources = [
      `https://en.wikipedia.org/wiki/${query}`,
      `https://www.google.com/search?q=${query}`,
      `https://www.khanacademy.org/search?search_again=1&page_search_query=${query}`
    ];

    sources.forEach(url => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.textContent = new URL(url).hostname.replace("www.", "");
      li.appendChild(a);
      learnMoreLinks.appendChild(li);
    });

    learnMoreSection.style.display = "block";
  }
});
