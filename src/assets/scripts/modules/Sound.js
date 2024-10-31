import WaveSurfer from 'wavesurfer.js';

export class Sound {
	constructor() {
		this.elements = document.querySelectorAll('.js-sound');
		this.instances = [];

		if (this.elements.length) {
			this.init();
		}
	}

	init() {
		this.elements.forEach((sound) => {
			const button = sound.querySelector('.js-sound-button');
			const wave = sound.querySelector('.js-sound-wave');
			const time = sound.querySelector('.js-sound-time');

			if (!wave || !button) return;

			const instance = new WaveSurfer({
				container: wave,
				url: wave.dataset.soundUrl,
				waveColor: '#c9d6e9',
				progressColor: '#4b87e1',
				height: 60,
				barGap: 4,
				barAlign: 'bottom',
				barWidth: 3,
				barHeight: 3,
				barRadius: 30,
				cursorWidth: 0,
			});

			this.instances.push(instance);

			const pause = () => {
				instance.pause();
				button.classList.remove('is-playing');
				button.classList.add('is-paused');
			};

			const play = () => {
				instance.play();
				button.classList.remove('is-paused');
				button.classList.add('is-playing');
			};

			play();
			pause();

			const addZero = (number) => {
				return number < 10 ? `0${number}` : number;
			};

			instance.on('ready', () => {
				if (!time) return;

				const hours = Math.floor(instance.getDuration() / 3600);
				const minutes = Math.floor((instance.getDuration() - hours * 3600) / 60);
				const seconds = Math.floor(instance.getDuration() - hours * 3600 - minutes * 60);

				time.textContent = `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
			});

			button.addEventListener('click', () => (instance.isPlaying() ? pause() : play()));
		});
	}
}
