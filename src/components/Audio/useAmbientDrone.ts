"use client";

import { useEffect } from "react";

type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export function useAmbientDrone() {
  useEffect(() => {
    let context: AudioContext | null = null;
    let gain: GainNode | null = null;
    const oscillators: OscillatorNode[] = [];
    let started = false;

    const start = async () => {
      if (started) return;
      started = true;

      const audioWindow = window as AudioContextWindow;
      const AudioCtor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
      if (!AudioCtor) return;

      context = new AudioCtor();
      gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);

      [41.2, 55, 82.4].forEach((frequency, index) => {
        const osc = context!.createOscillator();
        const oscGain = context!.createGain();
        osc.type = index === 1 ? "sine" : "triangle";
        osc.frequency.value = frequency;
        oscGain.gain.value = index === 0 ? 0.18 : 0.08;
        osc.connect(oscGain);
        oscGain.connect(gain!);
        osc.start();
        oscillators.push(osc);
      });

      const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let index = 0; index < data.length; index++) {
        data[index] = (Math.random() * 2 - 1) * 0.018;
      }

      const noise = context.createBufferSource();
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 260;
      noise.buffer = noiseBuffer;
      noise.loop = true;
      noise.connect(filter);
      filter.connect(gain);
      noise.start();

      await context.resume();
      gain.gain.linearRampToValueAtTime(0.018, context.currentTime + 5);
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
      "scroll",
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, start, { once: true, passive: true });
    });

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, start));
      if (context && gain) {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.35);
        window.setTimeout(() => {
          oscillators.forEach((osc) => osc.stop());
          context?.close();
        }, 420);
      }
    };
  }, []);
}
