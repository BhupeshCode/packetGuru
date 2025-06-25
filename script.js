window.onload = function () {
  console.log("Script loaded");

  window.calculate = function () {
    // existing subnet calculator code...
  };

  // ✅ Load particles with retry mechanism (safe)
  function loadParticlesSafely() {
    if (typeof tsParticles !== 'undefined') {
      tsParticles.load("tsparticles", {
        particles: {
          number: { value: 80 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.5 },
          size: { value: 3 },
          move: { enable: true, speed: 1 }
        },
        interactivity: {
          events: { onhover: { enable: true, mode: "repulse" } },
          modes: { repulse: { distance: 100 } }
        },
        background: {
          color: "#000000"
        }
      });
    } else {
      console.log("Waiting for tsParticles to load...");
      setTimeout(loadParticlesSafely, 100); // try again after 100ms
    }
  }

  loadParticlesSafely();
};
