"use strict";

const holes = [
    { x: 159, y:  49, w: 42, h: 36, note: "E5", freq: 659.26,
      clip: "polygon(37% 94%, 24% 92%, 14% 86%, 8% 75%, 5% 65%, 5% 55%, 7% 46%, 13% 35%, 24% 25%, 39% 15%, 53% 8%, 66% 6%, 79% 8%, 84% 12%, 88% 18%, 91% 26%, 94% 34%, 95% 42%, 95% 50%, 91% 63%, 83% 73%, 71% 83%, 60% 89%, 48% 93%)" },
    { x: 206, y:  69, w: 31, h: 30, note: "D5", freq: 587.33,
      clip: "polygon(94% 51%, 92% 62%, 88% 72%, 81% 81%, 72% 87%, 62% 92%, 50% 93%, 39% 92%, 29% 88%, 19% 81%, 13% 73%, 8% 63%, 6% 51%, 8% 39%, 12% 29%, 19% 20%, 28% 13%, 38% 8%, 50% 7%, 61% 8%, 71% 12%, 81% 20%, 87% 28%, 92% 38%)" },
    { x: 116, y:  69, w: 22, h: 25, note: "C5", freq: 523.25,
      clip: "polygon(82% 65%, 75% 74%, 67% 82%, 56% 88%, 45% 91%, 34% 92%, 23% 89%, 15% 85%, 11% 78%, 9% 69%, 10% 59%, 13% 49%, 19% 37%, 25% 28%, 33% 20%, 44% 13%, 55% 9%, 66% 8%, 77% 10%, 85% 15%, 89% 22%, 91% 32%, 90% 42%, 87% 53%)" },
    { x: 193, y: 130, w: 33, h: 36, note: "A4", freq: 440.00 },
    { x: 219, y: 160, w: 28, h: 28, note: "G4", freq: 392.00 },
    { x:  70, y: 178, w: 32, h: 48, note: "E4", freq: 329.63,
      clip: "polygon(63% 5%, 73% 8%, 82% 14%, 89% 24%, 93% 34%, 94% 45%, 91% 58%, 86% 69%, 77% 79%, 65% 87%, 53% 93%, 40% 95%, 27% 95%, 17% 92%, 11% 87%, 7% 78%, 6% 69%, 8% 58%, 11% 45%, 16% 34%, 22% 24%, 31% 14%, 40% 8%, 50% 5%)" },
    { x: 137, y: 196, w: 47, h: 47, note: "D4", freq: 293.66,
      clip: "polygon(96% 50%, 94% 61%, 90% 72%, 83% 82%, 74% 89%, 64% 94%, 51% 96%, 39% 94%, 28% 90%, 18% 82%, 11% 73%, 6% 63%, 4% 50%, 6% 39%, 10% 28%, 18% 18%, 27% 11%, 38% 6%, 51% 4%, 62% 6%, 73% 10%, 83% 18%, 89% 27%, 94% 37%)" },
    { x:  52, y: 264, w: 27, h: 34, note: "C4", freq: 261.63,
      clip: "polygon(93% 44%, 91% 56%, 87% 67%, 80% 78%, 72% 86%, 63% 92%, 51% 94%, 40% 93%, 30% 90%, 20% 84%, 14% 76%, 9% 67%, 7% 55%, 9% 43%, 13% 32%, 20% 21%, 29% 13%, 39% 8%, 51% 6%, 62% 7%, 71% 10%, 80% 16%, 87% 23%, 91% 32%)" },
    { x:  85, y: 289, w: 23, h: 28, note: "A3", freq: 220.00,
      clip: "polygon(91% 50%, 90% 61%, 86% 71%, 79% 80%, 71% 87%, 61% 91%, 49% 93%, 38% 91%, 28% 87%, 20% 80%, 14% 72%, 10% 62%, 9% 50%, 10% 39%, 13% 29%, 20% 20%, 27% 13%, 37% 9%, 49% 7%, 59% 9%, 69% 13%, 79% 20%, 85% 28%, 90% 38%)" },
    { x:  70, y: 350, w: 40, h: 45, note: "G3", freq: 196.00,
      clip: "polygon(90% 37%, 94% 48%, 95% 60%, 93% 71%, 89% 80%, 82% 87%, 71% 93%, 61% 95%, 50% 95%, 38% 92%, 28% 87%, 19% 78%, 11% 67%, 7% 55%, 5% 43%, 6% 30%, 10% 21%, 16% 13%, 26% 7%, 36% 5%, 48% 5%, 61% 9%, 72% 16%, 82% 25%)" },
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
        if (hole.clip) glow.style.setProperty("--clip", hole.clip);

        let glowTimer = null;
        let usedPointer = false;

        const trigger = () => {
            playTone(hole.freq);
            if (glowTimer) clearTimeout(glowTimer);
            btn.classList.add("active");
            glow.classList.add("active");
            glowTimer = setTimeout(() => {
                btn.classList.remove("active");
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
