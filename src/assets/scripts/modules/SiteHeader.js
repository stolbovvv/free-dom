/** Modules: Site header */
export class SiteHeader {
	constructor() {
		this.element = document.querySelector('.js-site-header');
		this.sidebar = document.querySelector('.js-site-sidebar');
		this.elementState = 'static';
		this.lastScrollTop = document.documentElement.scrollTop;

		if (this.element) this.init();
	}

	init() {
		this.element.style.top = '0';
		this.element.style.position = 'sticky';

		if (document.documentElement.scrollTop > 10) {
			this.element.classList.add('is-active');
		}

		window.addEventListener('resize', () => {
			if (document.documentElement.scrollTop > 10) {
				this.element.classList.add('is-active');
			}
		});

		window.addEventListener('scroll', () => {
			const { scrollTop } = document.documentElement;
			const { offsetHeight } = this.element;

			if (this.lastScrollTop < scrollTop && scrollTop > offsetHeight) {
				this.element.style.transform = `translateY(-100%)`;
				if (this.sidebar) this.sidebar.style.removeProperty('top');
				if (this.sidebar) this.sidebar.style.maxHeight = `calc(80vh - ${0}px)`;
			}

			if (this.lastScrollTop > scrollTop && scrollTop > offsetHeight) {
				this.element.style.transform = `translateY(0%)`;
				if (this.sidebar) this.sidebar.style.top = `${offsetHeight + 40}px`;
				if (this.sidebar) this.sidebar.style.maxHeight = `calc(80vh - ${offsetHeight}px)`;
			}

			if (scrollTop > 10) {
				this.element.classList.add('is-active');
			} else {
				this.element.classList.remove('is-active');
			}

			this.lastScrollTop = scrollTop;
		});
	}
}
