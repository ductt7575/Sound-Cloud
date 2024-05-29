'use client';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWavesurfer } from '@/utils/customHook';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';
import './wave.scss';

// WaveSurfer hook
const WaveTrack = () => {
  const searchParams = useSearchParams();
  const fileName = searchParams.get('audio');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    gradient.addColorStop(0, '#656666'); // Top color
    gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666'); // Top color
    gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
    gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
    gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1'); // Bottom color
    gradient.addColorStop(1, '#B1B1B1'); // Bottom color

    const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    progressGradient.addColorStop(0, '#EE772F'); // Top color
    progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926'); // Top color
    progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
    progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
    progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094'); // Bottom color
    progressGradient.addColorStop(1, '#F6B094'); // Bottom color

    return {
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 2,
      height: 150,
      url: `/api?audio=${fileName}`,
    };
  }, [fileName]);

  const wavesurfer = useWavesurfer(containerRef, optionsMemo);

  useEffect(() => {
    if (!wavesurfer) return;
    const timeEl = document.querySelector('#time')!;
    const durationEl = document.querySelector('#duration')!;
    const hover = document.querySelector('#hover')!;
    const waveform = document.querySelector('.wave-form-container')!;

    const onPointerMove = (e: MouseEvent) => {
      const hoverElement = hover as HTMLElement; // Type assertion
      hoverElement.style.width = `${(e as MouseEvent).offsetX}px`;
    };
    // @ts-ignore
    waveform.addEventListener('pointermove', onPointerMove);

    const subscriptions = [
      wavesurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration))),
      wavesurfer.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime))),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
      // @ts-ignore
      waveform.removeEventListener('pointermove', onPointerMove);
    };
  }, [wavesurfer, formatTime]);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
    setIsPlaying((prev) => !prev);
  }, [wavesurfer]);

  return (
    <div>
      <div ref={containerRef} className="wave-form-container">
        wave track
        <div id="time">0:00</div>
        <div id="duration">0:00</div>
        <div id="hover"></div>
      </div>
      <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
};

export default WaveTrack;
