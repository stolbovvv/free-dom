import { Fancybox } from '@fancyapps/ui';
import { BackgroundSound, Schedule, SiteHeader, SiteNavbar, Slider, Sound, Tabs } from './modules';
import { moveElementOnMediaQuery } from './utilities';

function renderScheduleCard(event) {
	return `
		<div class="card-schedule">
			<a class="card-schedule__link" href="${event.link ?? '#'}">
				<img class="card-schedule__image" src="${event.img ?? './assets/images/content-schedule-1.jpg'}" alt="${event.title}">
			</a>
			<div class="card-schedule__body">
				<p class="card-schedule__name">${event.title}</p>
				<p class="card-schedule__time">${event.time}</p>
			</div>
		</div>
	`;
}

// Пример использования
const weeklyEvents = {
	'2024-10-14': [
		// Неделя с 14 октября 2024
		{ day: 1, time: '09:00', title: 'Йога', duration: 1 },
		{ day: 1, time: '12:00', title: 'Встреча с Татьяной', duration: 1 },
		{ day: 2, time: '12:00', title: 'Встреча с Татьяной вторник', duration: 1.5 },
	],
	'2024-10-21': [
		// Неделя с 21 октября 2024
		{ day: 2, time: '10:00', title: 'Танцы', duration: 2 },
		{ day: 4, time: '15:00', title: 'Мастер-класс', duration: 1.5 },
	],
	'2024-10-28': [
		// Неделя с 28 октября 2024
		{ day: 3, time: '11:00', title: 'Врач', duration: 1 },
		{ day: 5, time: '14:00', title: 'Собрание', duration: 1.5 },
	],
	'2024-10-07': [
		// Неделя с 7 октября 2024 (раньше текущей)
		{ day: 1, time: '10:00', title: 'Визит в библиотеку', duration: 1 },
		{ day: 5, time: '13:00', title: 'Рабочая встреча', duration: 1 },
	],
};

window.addEventListener('DOMContentLoaded', () => {
	/* Базовые модули */
	new SiteNavbar();
	new SiteHeader();
	new Schedule(weeklyEvents, renderScheduleCard);
	new Sound();
	new BackgroundSound();
	new Tabs('#section-journal-tabs');

	/* Интерактивные галереи */
	Fancybox.bind('[data-fancybox="certificates"]');

	/* Слайдеры */
	document.querySelectorAll('.splide[data-slider-id="section-events"]').forEach((item) => {
		new Slider(item, {
			type: 'loop',
			perPage: 2,
			perMove: 1,
			gap: '3.75rem',
			pagination: false,
			updateOnMove: true,
			breakpoints: {
				1280: {
					gap: '2.5rem',
				},
				768: {
					perPage: 1,
					gap: '1.25rem',
				},
			},
		});
	});

	document.querySelectorAll('.splide[data-slider-id="section-journal"]').forEach((item) => {
		new Slider(item, {
			type: 'slide',
			perPage: 4,
			perMove: 1,
			gap: '3.75rem',
			arrows: false,
			breakpoints: {
				1600: {
					gap: '2.5rem',
				},
				1280: {
					perPage: 3,
					gap: '1.875rem',
				},
				768: {
					perPage: 1,
					gap: '1.25rem',
				},
			},
		});
	});

	document.querySelectorAll('.splide[data-slider-id="section-library"]').forEach((item) => {
		new Slider(item, {
			type: 'loop',
			perPage: 3,
			perMove: 1,
			gap: '3.75rem',
			pagination: false,
			breakpoints: {
				1280: {
					perPage: 2,
					gap: '2.5rem',
				},
				768: {
					perPage: 1,
					gap: '1.25rem',
				},
			},
		});
	});

	document.querySelectorAll('.splide[data-slider-id="section-masters"]').forEach((item) => {
		new Slider(item, {
			type: 'slide',
			destroy: true,
			arrows: false,
			pagination: false,
			breakpoints: {
				768: {
					destroy: false,
					perPage: 1,
					perMove: 1,
					gap: '1.25rem',
				},
			},
		});
	});

	document.querySelectorAll('.splide[data-slider-id="section-reviews"]').forEach((item) => {
		new Slider(item, {
			type: 'loop',
			start: 0,
			focus: 'center',
			perMove: 1,
			perPage: 3,
			updateOnMove: true,
			gap: '3.75rem',
			breakpoints: {
				1280: {
					perPage: 2,
					gap: '2.5rem',
					focus: 0,
				},
				1024: {
					gap: '1.25rem',
					perPage: 1,
				},
			},
		});
	});

	/* Перенос элементов */
	moveElementOnMediaQuery('#section-events-navigation', '(max-width: 47.99em)', {
		targetContainer: '#section-events-mobile-navigation',
		sourceContainer: '#section-events-desktop-navigation',
	});

	moveElementOnMediaQuery('#section-library-navigation', '(max-width: 47.99em)', {
		targetContainer: '#section-library-mobile-navigation',
		sourceContainer: '#section-library-desktop-navigation',
	});

	moveElementOnMediaQuery('#section-reviews-navigation', '(max-width: 47.99em)', {
		targetContainer: '#section-reviews-mobile-navigation',
		sourceContainer: '#section-reviews-desktop-navigation',
	});
});

console.log(
	'%cGOWEB.PRO\n' + '%cХочешь такой же сайт?' + '%c\n\nПиши в telegram: @goweb_pro\nНаш сайт: https://goweb.pro',
	'font-size: 37px; font-weight: 900; color: rgb(90, 205, 211);',
	'font-size: 14px; background: rgb(90, 205, 211); padding: 5px 10px; color: rgb(255, 255, 255);',
	'line-height: 1.5; background: none;',
);
