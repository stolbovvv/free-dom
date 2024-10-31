/** Modules: Site menu */
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

export class SiteNavbar {
	constructor() {
		this.element = document.querySelector('.js-site-navbar');
		this.buttons = document.querySelectorAll('.js-site-navbar-button');
		this.options = {
			openClass: 'is-open',
		};

		if (this.element) {
			this.init();
		}
	}

	open = () => {
		disablePageScroll();
		this.buttons.forEach((button) => button.classList.add(this.options.openClass));
		this.element.classList.add(this.options.openClass);
		this.element.style.paddingRight = getComputedStyle(document.body).paddingRight;
	};

	close = () => {
		this.buttons.forEach((button) => button.classList.remove(this.options.openClass));
		this.element.classList.remove(this.options.openClass);
		this.element.style.removeProperty('padding-right');
		enablePageScroll();
	};

	init() {
		this.buttons.forEach((button) => {
			if (button.dataset?.menuAction === 'open') button.addEventListener('click', this.open);
			if (button.dataset?.menuAction === 'close') button.addEventListener('click', this.close);
		});

		this.element.addEventListener('click', ({ target }) => {
			if (target && target.closest('a[href]')) this.close();
		});
	}
}
