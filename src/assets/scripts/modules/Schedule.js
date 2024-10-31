import anime from 'animejs';
import { addDays, addWeeks, endOfWeek, format, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

export class Schedule {
	constructor(eventsData, renderEventTemplate = false) {
		this.container = document.querySelector('.js-schedule');
		this.eventsData = eventsData;
		this.currentWeekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
		this.scheduleDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		this.renderEventTemplate = renderEventTemplate;
		this.largeDesktopMediaQuery = window.matchMedia('(min-width: 80em)');

		if (this.container && this.eventsData) {
			this.weekDisplayElement = this.container.querySelector('.js-schedule-week-display');
			this.prevButton = this.container.querySelector('.js-schedule-button-prev');
			this.nextButton = this.container.querySelector('.js-schedule-button-next');
			this.eventSlotsGrid = this.container.querySelector('.js-schedule-events-grid');
			this.daysGrid = this.container.querySelector('.js-schedule-days-grid');

			this.init();
		}
	}

	init() {
		this.container.classList.add('is-init');
		this.updateWeekDisplay();
		this.renderWeeklyCalendar();
		if (!this.largeDesktopMediaQuery.matches) this.initDetails();

		if (this.prevButton) this.prevButton.addEventListener('click', this.showPrevWeek);
		if (this.nextButton) this.nextButton.addEventListener('click', this.showNextWeek);

		this.largeDesktopMediaQuery.addEventListener('change', () => {
			this.eventSlotsGrid.innerHTML = '';
			this.updateWeekDisplay();
			this.renderWeeklyCalendar();
			if (!this.largeDesktopMediaQuery.matches) this.initDetails();
		});
	}

	initDetails() {
		const details = this.container.querySelectorAll('.js-schedule-day-slot');

		details.forEach((detail) => {
			const detailButton = detail.querySelector('.js-schedule-day-slot__button');
			const detailBody = detail.querySelector('.js-schedule-day-slot__body');

			detailBody.style.height = `0px`;

			if (detailButton) {
				detailButton.addEventListener('click', () => {
					if (detail.classList.contains('is-open')) {
						detail.classList.remove('is-open');
						detailBody.style.height = `${detailBody.scrollHeight}px`;
						anime({
							targets: detailBody,
							height: 0,
							easing: 'linear',
							duration: 200,
						});
					} else {
						detail.classList.add('is-open');
						anime({
							targets: detailBody,
							height: (el) => el.scrollHeight,
							easing: 'linear',
							duration: 200,
							complete: () => {
								detailBody.style.height = 'auto';
							},
						});
					}
				});
			}
		});
	}

	renderWeeklyCalendar() {
		if (this.daysGrid) this.daysGrid.innerHTML = '';

		if (this.largeDesktopMediaQuery.matches) {
			this.eventSlotsGrid.innerHTML = '';
			this.renderEventSlots();
		}
		this.renderDaysHeader();
		if (this.largeDesktopMediaQuery.matches) this.populateEvents();
	}

	renderDaysHeader() {
		let daysHtml = '';
		const weeklyEvents = this.getWeeklyEvents();

		this.scheduleDays.forEach((day, dayIndex) => {
			const formattedDate = format(addDays(this.currentWeekStartDate, dayIndex), 'dd.MM', { locale: ru });

			if (this.largeDesktopMediaQuery.matches) {
				daysHtml += `<div class="js-schedule-day-slot">${day} ${formattedDate}</div>`;
			} else if (weeklyEvents[dayIndex].length > 0) {
				daysHtml += this.renderDayButton(day, formattedDate, weeklyEvents[dayIndex]);
			}
		});

		this.daysGrid.innerHTML = daysHtml;
	}

	renderDayButton(day, formattedDate, events) {
		let eventHtml = '';
		events.forEach((event) => {
			eventHtml += this.renderEventTemplate
				? this.renderEventTemplate(event)
				: `
					<div class="js-schedule-event">
						<p class="js-schedule-name">${event.title || 'Без названия'}</p>
						<p class="js-schedule-time">${event.time || 'Без времени'}</p>
					</div>
				`;
		});

		return `
			<div class="js-schedule-day-slot">
				<button class="js-schedule-day-slot__button">
					<span class="js-schedule-day-slot__button-text">${day} ${formattedDate}</span>
					<span class="js-schedule-day-slot__button-icon">→</span>
				</button>
				<div class="js-schedule-day-slot__body">
					<div class="js-schedule-day-slot__content">${eventHtml}</div>
				</div>
			</div>`;
	}

	renderEventSlots() {
		const weeklyEvents = this.getWeeklyEvents();
		const uniqueEventHours = new Set(
			weeklyEvents.flatMap((dayEvents) => dayEvents.map((event) => parseInt(event.time.split(':')[0], 10))),
		);

		if (uniqueEventHours.size === 0) return;

		let eventSlotsHtml = '';

		uniqueEventHours.forEach((hour) => {
			const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
			for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
				eventSlotsHtml += `
					<div class="js-schedule-event-slot" id="js-schedule-day-${dayIndex}-hour-${hour}">
						<span class="js-schedule-event-empty-text">${formattedHour}:00</span>
					</div>
				`;
			}
		});

		this.eventSlotsGrid.innerHTML = eventSlotsHtml;
	}

	populateEvents() {
		const weeklyEvents = this.getWeeklyEvents();

		weeklyEvents.forEach((dayEvents, dayIndex) => {
			dayEvents.forEach((event) => {
				const eventHour = parseInt(event.time.split(':')[0], 10);
				const eventSlot = document.getElementById(`js-schedule-day-${dayIndex}-hour-${eventHour}`);

				if (eventSlot) {
					const eventElement = document.createElement('div');

					eventElement.className = 'js-schedule-event';
					eventElement.innerHTML = this.renderEventTemplate
						? this.renderEventTemplate(event)
						: `
							<p class="js-schedule-name">${event.title || 'Без названия'}</p>
							<p class="js-schedule-time">${event.time || 'Без времени'}</p>
						`;

					eventSlot.innerHTML = '';
					eventSlot.appendChild(eventElement);
				}
			});
		});
	}

	getWeeklyEvents() {
		const weekKey = format(this.currentWeekStartDate, 'yyyy-MM-dd');
		const weeklyEvents = this.eventsData[weekKey] || [];
		return this.scheduleDays.map((_, i) => weeklyEvents.filter((event) => event.day === (i === 6 ? 0 : i + 1)));
	}

	updateWeekDisplay() {
		const dateFormat = this.largeDesktopMediaQuery.matches ? 'd MMMM yyyy' : 'd.MM.yy';
		const weekStart = format(this.currentWeekStartDate, dateFormat, { locale: ru });
		const weekEnd = format(endOfWeek(this.currentWeekStartDate, { weekStartsOn: 1 }), dateFormat, {
			locale: ru,
		});
		if (this.weekDisplayElement) {
			this.weekDisplayElement.textContent = `${weekStart} - ${weekEnd}`;
		}
	}

	changeWeek(isNextWeek) {
		if (this.eventSlotsGrid && this.largeDesktopMediaQuery.matches) {
			this.eventSlotsGrid.classList.add('fade-out');
		}

		if (this.largeDesktopMediaQuery.matches) {
			setTimeout(() => {
				this.currentWeekStartDate = addWeeks(this.currentWeekStartDate, isNextWeek ? 1 : -1);
				this.updateWeekDisplay();
				this.renderWeeklyCalendar();
				this.eventSlotsGrid.classList.remove('fade-out');
			}, 300);
		} else {
			this.currentWeekStartDate = addWeeks(this.currentWeekStartDate, isNextWeek ? 1 : -1);
			this.updateWeekDisplay();
			this.renderWeeklyCalendar();
			this.initDetails();
		}
	}

	showPrevWeek = () => this.changeWeek(false);
	showNextWeek = () => this.changeWeek(true);
}
