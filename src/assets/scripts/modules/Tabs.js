export class Tabs {
	constructor(selector) {
		this.element = document.querySelector(selector || '.js-tabs');
		this.options = {
			activeClass: 'is-active',
		};

		if (this.element) {
			this.tabsTrigger = this.element.querySelectorAll('.js-tabs-trigger');
			this.tabsContent = this.element.querySelectorAll('.js-tabs-content');

			this.update = this.update.bind(this);

			this.init();
		}
	}

	update(tabId) {
		this.tabsTrigger.forEach((trigger) => {
			if (trigger.dataset.tabId === tabId) trigger.classList.add(this.options.activeClass);
			if (trigger.dataset.tabId !== tabId) trigger.classList.remove(this.options.activeClass);
		});

		this.tabsContent.forEach((content) => {
			if (content.dataset.tabId === tabId) content.classList.add(this.options.activeClass);
			if (content.dataset.tabId !== tabId) content.classList.remove(this.options.activeClass);
		});
	}

	init() {
		this.tabsTrigger.forEach((trigger) => {
			trigger.addEventListener('click', () => this.update(trigger.dataset.tabId));
		});

		this.update(this.tabsTrigger[0].dataset.tabId);
	}
}
