"use client";

import { useEffect, useRef } from "react";
import { smoothstep } from "@/utils/easing";

type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export function useAmbientDrone(progress = 0) {
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    let context: AudioContext | null = null;
    let gain: GainNode | null = null;
    let started = false;

    const start = async () => {
      if (started) return;
      started = true;

      const audioWindow = window as AudioContextWindow;
      const AudioCtor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
      if (!AudioCtor) return;

      context = new AudioCtor();
      contextRef.current = context;
      gain = context.createGain();
      gainRef.current = gain;
      gain.gain.value = 0;
      gain.connect(context.destination);

      [41.2, 55, 82.4, 164.8, 246.9].forEach((frequency, index) => {
        const osc = context!.createOscillator();
        const oscGain = context!.createGain();
        osc.type = index === 1 || index > 2 ? "sine" : "triangle";
        osc.frequency.value = frequency;
        oscGain.gain.value = index === 0 ? 0.18 : index > 2 ? 0.018 : 0.08;
        osc.connect(oscGain);
        oscGain.connect(gain!);
        osc.start();
        oscillatorsRef.current.push(osc);
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
      noiseRef.current = noise;

      await context.resume();
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

    const oscillators = oscillatorsRef.current;

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, start));
      if (context && gain) {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.35);
        window.setTimeout(() => {
          oscillators.forEach((osc) => osc.stop());
          noiseRef.current?.stop();
          context?.close();
        }, 420);
      }
    };
  }, []);

  useEffect(() => {
    const context = contextRef.current;
    const gain = gainRef.current;
    if (!context || !gain) return;

    const vibration = smoothstep(0.02, 0.09, progress) * 0.008;
    const swell = smoothstep(0.08, 0.2, progress) * (1 - smoothstep(0.28, 0.44, progress)) * 0.02;
    const matterTexture = smoothstep(0.2, 0.34, progress) * (1 - smoothstep(0.44, 0.58, progress)) * 0.009;
    const resonance = smoothstep(0.32, 0.5, progress) * 0.01;
    const volume = vibration + swell + matterTexture + resonance;

    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.linearRampToValueAtTime(volume, context.currentTime + 0.35);
  }, [progress]);
}
