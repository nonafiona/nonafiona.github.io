"use strict";

const holes = [
    { x: 159, y:  48, w: 36, h: 33, note: "E5", freq: 659.26,
      clip: "polygon(36% 100%, 15% 94%, 3% 79%, 0% 60%, 2% 45%, 15% 26%, 37% 10%, 61% 1%, 82% 3%, 90% 11%, 96% 23%, 99% 37%, 100% 50%, 92% 71%, 76% 87%, 56% 97%)" },
    { x: 206, y:  69, w: 27, h: 27, note: "D5", freq: 587.33 },
    { x: 116, y:  70, w: 18, h: 20, note: "C5", freq: 523.25,
      clip: "polygon(94% 67%, 81% 84%, 64% 95%, 44% 100%, 26% 97%, 11% 87%, 2% 71%, 0% 52%, 6% 33%, 19% 16%, 36% 5%, 56% 0%, 74% 3%, 89% 13%, 98% 29%, 100% 48%)" },
    { x: 193, y: 130, w: 29, h: 32, note: "A4", freq: 440.00 },
    { x: 219, y: 160, w: 24, h: 24, note: "G4", freq: 392.00 },
    { x:  70, y: 179, w: 27, h: 43, note: "E4", freq: 329.63,
      clip: "polygon(67% 0%, 84% 7%, 95% 20%, 100% 37%, 97% 57%, 87% 75%, 71% 90%, 52% 98%, 33% 100%, 16% 93%, 5% 80%, 0% 63%, 3% 43%, 13% 25%, 29% 10%, 48% 2%)" },
    { x: 137, y: 196, w: 43, h: 42, note: "D4", freq: 293.66 },
    { x:  52, y: 264, w: 23, h: 30, note: "C4", freq: 261.63 },
    { x:  84, y: 289, w: 20, h: 24, note: "A3", freq: 220.00 },
    { x:  70, y: 350, w: 36, h: 41, note: "G3", freq: 196.00,
      clip: "polygon(94% 35%, 100% 55%, 98% 73%, 89% 87%, 74% 97%, 55% 100%, 37% 96%, 20% 85%, 7% 68%, 1% 48%, 1% 28%, 9% 13%, 23% 3%, 42% 0%, 63% 5%, 81% 17%)" },
];

let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
}

function playTone(freq) {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = "sine";
    osc1.frequency.value = freq;

    osc2.type = "triangle";
    osc2.frequency.value = freq * 2.003;

    filter.type = "lowpass";
    filter.frequency.value = freq * 3;
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2);
    osc2.stop(now + 2);
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("holes");

    holes.forEach((hole, i) => {
        const btn = document.createElement("button");
        btn.className = "hole-btn";
        btn.style.left = hole.x + "px";
        btn.style.top = hole.y + "px";
        btn.style.width = hole.w + "px";
        btn.style.height = hole.h + "px";
        btn.setAttribute("aria-label", hole.note);
        if (hole.clip) btn.style.clipPath = hole.clip;

        const glow = document.createElement("div");
        glow.className = "hole-glow";
        glow.style.left = hole.x + "px";
        glow.style.top = hole.y + "px";
        glow.style.width = hole.w + "px";
        glow.style.height = hole.h + "px";

        let glowTimer = null;
        let usedPointer = false;

        const trigger = () => {
            playTone(hole.freq);
            if (glowTimer) clearTimeout(glowTimer);
            glow.classList.add("active");
            glowTimer = setTimeout(() => {
                glow.classList.remove("active");
                glowTimer = null;
            }, 400);
        };

        btn.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            usedPointer = true;
            trigger();
        });
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (usedPointer) { usedPointer = false; return; }
            trigger();
        });
        btn.addEventListener("mouseenter", () => { if (!glow.classList.contains("active")) glow.classList.add("hover"); });
        btn.addEventListener("mouseleave", () => glow.classList.remove("hover"));

        container.appendChild(btn);
        container.appendChild(glow);
    });
});
