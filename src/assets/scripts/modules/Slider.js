/**
 * @typedef {import('@splidejs/splide').Options} Options
 */

import Splide from '@splidejs/splide';

/**
 * @extends {Splide}
 */
export class Slider extends Splide {
	/**
	 * @param {HTMLElement | string} target
	 * @param {Options} options
	 */
	constructor(target, options) {
		super(target, {
			type: 'loop',
			perPage: 1,
			perMove: 1,
			pagination: false,
			...options,
		});
		this.indexSlide = target.querySelector('.splide__arrow-index');
		this.totalSlide = target.querySelector('.splide__arrow-total');

		this.mount();
		this.initCounter();
	}

	updateTotal() {
		if (this.length < 10) this.totalSlide.textContent = `0${this.length}`;
		if (this.length >= 10) this.totalSlide.textContent = `${this.length}`;
	}

	updateIndex() {
		if (this.index + 1 < 10) this.indexSlide.textContent = `0${this.index + 1}`;
		if (this.index + 1 >= 10) this.indexSlide.textContent = `${this.index + 1}`;
	}

	initCounter() {
		if (!this.indexSlide || !this.totalSlide) return;

		this.updateIndex();
		this.updateTotal();

		this.on('move', () => {
			this.updateIndex();
		});
	}
}
