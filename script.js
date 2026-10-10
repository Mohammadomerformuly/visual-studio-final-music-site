const stage = document.querySelector("#visualStage");
const animateButton = document.querySelector("#animateButton");
const equalizerBars = [...document.querySelectorAll(".equalizer span")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let animationFrame;
let isPlaying = true;

function animateEqualizer(time) {
  equalizerBars.forEach((bar, index) => {
    const wave = Math.sin(time / 220 + index * 1.35);
    const secondWave = Math.sin(time / 410 + index * 0.7);
    const height = 12 + Math.abs(wave + secondWave * 0.45) * 35;
    bar.style.height = `${height}px`;
  });

  if (isPlaying && !reducedMotion.matches) {
    animationFrame = requestAnimationFrame(animateEqualizer);
  }
}

function releaseNotes() {
  if (reducedMotion.matches) {
    animateButton.textContent = "Rhythm released!";
    return;
  }

  const symbols = ["♪", "♫", "♩", "♬"];

  for (let index = 0; index < 16; index += 1) {
    const note = document.createElement("span");
    note.className = "music-note";
    note.textContent = symbols[index % symbols.length];
    note.style.left = `${35 + Math.random() * 30}%`;
    note.style.top = `${35 + Math.random() * 30}%`;
    note.style.fontSize = `${18 + Math.random() * 22}px`;
    stage.appendChild(note);

    const direction = Math.random() > 0.5 ? 1 : -1;
    const destinationX = direction * (100 + Math.random() * 180);
    const destinationY = -120 - Math.random() * 220;

    note.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: `translate(${destinationX}px, ${destinationY}px) rotate(${direction * 70}deg)`, opacity: 0 }
      ],
      {
        duration: 1100 + Math.random() * 950,
        delay: index * 45,
        easing: "cubic-bezier(.2,.7,.25,1)",
        fill: "forwards"
      }
    ).finished.then(() => note.remove());
  }

  animateButton.textContent = "Rhythm released!";
  window.setTimeout(() => {
    animateButton.textContent = "Release the rhythm";
  }, 1800);
}

function updateAnimationPreference() {
  cancelAnimationFrame(animationFrame);
  equalizerBars.forEach((bar, index) => {
    bar.style.height = `${16 + index * 6}px`;
  });

  if (!reducedMotion.matches) {
    animationFrame = requestAnimationFrame(animateEqualizer);
  }
}

animateButton.addEventListener("click", releaseNotes);
reducedMotion.addEventListener("change", updateAnimationPreference);
updateAnimationPreference();

document.addEventListener("visibilitychange", () => {
  isPlaying = !document.hidden;
  cancelAnimationFrame(animationFrame);
  if (isPlaying && !reducedMotion.matches) {
    animationFrame = requestAnimationFrame(animateEqualizer);
  }
});
