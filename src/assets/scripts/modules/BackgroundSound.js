import WaveSurfer from 'wavesurfer.js';

export class BackgroundSound {
	constructor() {
		this.element = document.querySelector('.js-background-sound');
		this.trigger = document.querySelectorAll('.js-background-sound-trigger');

		if (this.element) {
			this.waveSurfer = new WaveSurfer({
				container: this.element,
				interact: false,
				autoplay: true,
				height: 0,
				url: this.element.dataset.soundUrl,
			});

			this.init();
		}

		this.init = this.init.bind(this);
	}

	setPlayStateForTrigger = () => {
		this.trigger.forEach((item) => {
			item.classList.remove('is-paused');
			item.classList.add('is-playing');
		});
	};

	setPauseStateForTrigger = () => {
		this.trigger.forEach((item) => {
			item.classList.remove('is-playing');
			item.classList.add('is-paused');
		});
	};

	init() {
		this.trigger.forEach((trigger) => {
			trigger.addEventListener('click', () => {
				this.waveSurfer.playPause();
			});
		});

		this.waveSurfer.on('play', this.setPlayStateForTrigger);

		this.waveSurfer.on('pause', this.setPauseStateForTrigger);

		this.waveSurfer.on('finish', () => {
			this.waveSurfer.play();
		});
	}
}
