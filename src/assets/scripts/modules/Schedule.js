import { addDays, addWeeks, endOfWeek, format, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

export class Schedule {
	constructor(scheduleEvents, renderEvent = false) {
		this.scheduleContainer = document.querySelector('.js-schedule');
		this.scheduleEvents = scheduleEvents;
		this.scheduleStart = startOfWeek(new Date(), { weekStartsOn: 1 });
		this.hours = Array.from({ length: 12 }, (_, i) => i + 8);
		this.days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		this.smallDesktopWidthMediaQuery = window.matchMedia('(max-width: 80em)');

		this.renderEvent = renderEvent;

		if (this.scheduleContainer && this.scheduleEvents) {
			this.weekDisplay = this.scheduleContainer.querySelector('.js-schedule-week-display');
			this.buttonPrev = this.scheduleContainer.querySelector('.js-schedule-button-prev');
			this.buttonNext = this.scheduleContainer.querySelector('.js-schedule-button-next');
			this.eventsGrid = this.scheduleContainer.querySelector('.js-schedule-events-grid');
			this.daysGrid = this.scheduleContainer.querySelector('.js-schedule-days-grid');

			this.init();
		}
	}

	populateEvents() {
		const week = format(this.scheduleStart, 'yyyy-MM-dd');
		const events = this.scheduleEvents[week] || [];

		events.forEach((event) => {
			const eventHour = event.time.split(':').map(Number)[0];
			const eventDay = event.day === 0 ? 6 : event.day - 1;

			const slot = document.getElementById(`js-schedule-day-${eventDay}-hour-${eventHour}`);

			if (slot) {
				const eventElement = document.createElement('div');

				eventElement.className = 'js-schedule-event';

				if (this.renderEvent) {
					eventElement.innerHTML = this.renderEvent(event);
				} else {
					eventElement.innerHTML = `
						<p class="js-schedule-name">${event.title ?? 'Нет названия'}</p>
						<p class="js-schedule-time">${event.time ?? 'Нет времени'}</p>
					`;
				}

				slot.innerHTML = '';
				slot.appendChild(eventElement);
			}
		});
	}

	generateWeeklyCalendar() {
		if (this.daysGrid) this.daysGrid.innerHTML = '';
		if (this.eventsGrid) this.eventsGrid.innerHTML = '';

		const week = format(this.scheduleStart, 'yyyy-MM-dd');
		const events = this.scheduleEvents[week] || [];

		// Собираем уникальные часы с мероприятиями
		const uniqueHours = new Set();
		events.forEach((event) => {
			const eventHour = event.time.split(':').map(Number)[0];
			uniqueHours.add(eventHour);
		});

		// Если событий нет, заполнять календарь не будем
		if (uniqueHours.size === 0) return;

		// Отображаем дни недели
		if (this.daysGrid) {
			let daysHtml = '';
			this.days.forEach((day, index) => {
				const date = format(addDays(this.scheduleStart, index), 'dd.MM', { locale: ru });
				daysHtml += `<div class="js-schedule-day-slot">${day} ${date}</div>`;
			});
			this.daysGrid.innerHTML = daysHtml;
		}

		// Отображаем временные слоты для всех дней недели, только для уникальных часов с мероприятиями
		if (this.eventsGrid) {
			let eventsHtml = '';
			uniqueHours.forEach((hour) => {
				const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
				for (let i = 0; i < 7; i++) {
					const slotId = `js-schedule-day-${i}-hour-${hour}`;
					eventsHtml += `
				<div class="js-schedule-event-slot" id="${slotId}">
				  <span class="js-schedule-event-empty-text">${formattedHour}:00</span>
				</div>
			  `;
				}
			});
			this.eventsGrid.innerHTML = eventsHtml;

			// Заполняем календарь мероприятиями
			this.populateEvents();
		}
	}

	updateWeekDisplay() {
		const startOfWeekDate = format(this.scheduleStart, 'd MMMM yyyy', { locale: ru });
		const endOfWeekDate = format(endOfWeek(this.scheduleStart, { weekStartsOn: 1 }), 'd MMMM yyyy', { locale: ru });

		if (this.weekDisplay) {
			this.weekDisplay.textContent = `${startOfWeekDate} - ${endOfWeekDate}`;
		}
	}

	changeWeek(isNext) {
		if (this.eventsGrid) {
			this.eventsGrid.classList.add('fade-out');
		}

		setTimeout(() => {
			this.scheduleStart = addWeeks(this.scheduleStart, isNext ? 1 : -1);
			this.updateWeekDisplay();
			this.generateWeeklyCalendar();
			this.eventsGrid.classList.remove('fade-out');
		}, 300);
	}

	prevWeek = () => {
		this.changeWeek(false);
	};

	nextWeek = () => {
		this.changeWeek(true);
	};

	init() {
		this.updateWeekDisplay();
		this.generateWeeklyCalendar();

		if (this.buttonPrev) this.buttonPrev.addEventListener('click', this.prevWeek);
		if (this.buttonNext) this.buttonNext.addEventListener('click', this.nextWeek);
	}
}
