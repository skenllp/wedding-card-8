const weddingDate = new Date("2026-08-10T11:00:00+05:30").getTime();
const site = document.getElementById("site");
const openButton = document.getElementById("openInvitation");
const progressBar = document.querySelector(".scroll-progress");
const revealItems = document.querySelectorAll(".reveal");

const countdownNodes = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = Math.max(0, weddingDate - Date.now());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  countdownNodes.days.textContent = pad(days);
  countdownNodes.hours.textContent = pad(hours);
  countdownNodes.minutes.textContent = pad(minutes);
  countdownNodes.seconds.textContent = pad(seconds);
}

function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

const bgMusic = document.getElementById("bgMusic");
const musicControl = document.getElementById("musicControl");

function playAudio() {
  if (musicControl) {
    musicControl.classList.add("visible");
  }
  if (bgMusic && bgMusic.paused) {
    bgMusic.play()
      .then(() => {
        musicControl.classList.remove("paused");
      })
      .catch((error) => {
        console.log("Audio play failed or was prevented by browser:", error);
        musicControl.classList.add("paused");
      });
  }
}

// Explicitly attach to window for inline onclick handler compatibility
window.playAudio = playAudio;

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    playAudio();
  } else {
    bgMusic.pause();
    musicControl.classList.add("paused");
  }
}

if (musicControl) {
  musicControl.classList.add("paused");
  musicControl.addEventListener("click", toggleMusic);
}

function openInvitation() {
  site.classList.add("opened");
  document.body.classList.remove("locked");
  if (musicControl) {
    musicControl.classList.add("visible");
  }
  window.setTimeout(() => {
    document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
  }, 720);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));
openButton.addEventListener("click", openInvitation);
window.addEventListener("scroll", updateProgress, { passive: true });

updateCountdown();
updateProgress();
window.setInterval(updateCountdown, 1000);
