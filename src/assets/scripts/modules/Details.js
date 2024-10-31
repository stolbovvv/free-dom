import anime from 'animejs';

export class Details {
	constructor(
		target = '.js-details',
		{
			isOpen = false,
			activeClass = 'is-open',
			headSelector = '.js-details-head',
			bodySelector = '.js-details-body',
		} = {},
	) {
		this.isOpen = isOpen;
		this.element = typeof target === 'string' ? document.querySelector(target) : target;
		this.options = {
			activeClass,
		};

		if (this.element) {
			this.head = this.element.querySelector(headSelector);
			this.body = this.element.querySelector(bodySelector);

			this.init();
		}
	}

	open() {
		this.isOpen = true;
		this.element.classList.add(this.options.activeClass);

		if (this.head && this.isOpen) {
			this.head.classList.add(this.options.activeClass);
		}

		if (this.body && this.isOpen) {
			this.body.classList.add(this.options.activeClass);
			anime({
				targets: this.body,
				height: (el) => el.scrollHeight,
				easing: 'linear',
				duration: 200,
				complete: () => {
					this.body.style.height = 'auto';
				},
			});
		}
	}

	close() {
		this.isOpen = false;
		this.element.classList.remove(this.options.activeClass);

		if (this.head && !this.isOpen) {
			this.head.classList.remove(this.options.activeClass);
		}

		if (this.body && !this.isOpen) {
			this.body.classList.remove(this.options.activeClass);
			this.body.style.height = `${this.body.scrollHeight}px`;
			anime({
				targets: this.body,
				height: 0,
				easing: 'linear',
				duration: 200,
			});
		}
	}

	init() {
		if (this.isOpen) {
			this.open();
		} else {
			this.close();
		}

		if (this.head) {
			this.head.addEventListener('click', () => {
				if (this.isOpen) {
					this.close();
				} else {
					this.open();
				}
			});
		}
	}
}
