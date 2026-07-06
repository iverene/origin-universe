"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { smoothstep } from "@/utils/easing";

type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function getAmbientVolume(progress: number) {
  const introBed = 0.018 * (1 - smoothstep(0.22, 0.4, progress));
  const vibration = smoothstep(0.004, 0.06, progress) * 0.026;
  const swell = smoothstep(0.045, 0.18, progress) * (1 - smoothstep(0.28, 0.44, progress)) * 0.055;
  const matterTexture = smoothstep(0.18, 0.34, progress) * (1 - smoothstep(0.44, 0.58, progress)) * 0.032;
  const resonance = smoothstep(0.32, 0.5, progress) * 0.034;

  return Math.min(0.11, introBed + vibration + swell + matterTexture + resonance);
}

export function useAmbientDrone(progress = 0) {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);
  const progressRef = useRef(progress);
  const unlockingRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const unlockAudio = useCallback(async () => {
    if (startedRef.current || unlockingRef.current) return;
    unlockingRef.current = true;

    const audioWindow = window as AudioContextWindow;
    const AudioCtor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioCtor) {
      unlockingRef.current = false;
      return;
    }

    let context: AudioContext | null = null;

    try {
      context = new AudioCtor();
      contextRef.current = context;

      if (context.state !== "running") {
        await context.resume();
      }

      if (context.state !== "running") {
        throw new Error("AudioContext did not start.");
      }

      const gain = context.createGain();
      gainRef.current = gain;
      gain.gain.value = 0;

      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 18;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.012;
      compressor.release.value = 0.28;
      gain.connect(compressor);
      compressor.connect(context.destination);

      [
        { frequency: 110, level: 0.2, type: "triangle" },
        { frequency: 220, level: 0.12, type: "sine" },
        { frequency: 329.6, level: 0.09, type: "sine" },
        { frequency: 440, level: 0.055, type: "sine" },
        { frequency: 660, level: 0.032, type: "sine" },
      ].forEach(({ frequency, level, type }) => {
        const osc = context!.createOscillator();
        const oscGain = context!.createGain();
        osc.type = type as OscillatorType;
        osc.frequency.value = frequency;
        oscGain.gain.value = level;
        osc.connect(oscGain);
        oscGain.connect(gain);
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
      filter.frequency.value = 520;
      noise.buffer = noiseBuffer;
      noise.loop = true;
      noise.connect(filter);
      filter.connect(gain);
      noise.start();
      noiseRef.current = noise;

      gain.gain.linearRampToValueAtTime(getAmbientVolume(progressRef.current), context.currentTime + 0.25);
      startedRef.current = true;
      setIsAudioReady(true);
    } catch {
      oscillatorsRef.current.forEach((osc) => osc.stop());
      oscillatorsRef.current = [];
      noiseRef.current?.stop();
      noiseRef.current = null;
      gainRef.current = null;
      contextRef.current = null;
      void context?.close();
    } finally {
      unlockingRef.current = false;
    }
  }, []);

  useEffect(() => {
    return () => {
      const context = contextRef.current;
      const gain = gainRef.current;
      if (context && gain) {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.35);
        window.setTimeout(() => {
          oscillatorsRef.current.forEach((osc) => osc.stop());
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

    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.linearRampToValueAtTime(getAmbientVolume(progress), context.currentTime + 0.35);
  }, [progress]);

  return { isAudioReady, unlockAudio };
}
