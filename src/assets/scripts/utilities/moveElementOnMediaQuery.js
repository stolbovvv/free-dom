export function moveElementOnMediaQuery(target, mediaQuery, { targetContainer, sourceContainer } = {}) {
	const element = document.querySelector(target);
	const targetElement = document.querySelector(targetContainer);
	const sourceElement = document.querySelector(sourceContainer);

	if (!element || !targetElement || !sourceElement) {
		return;
	}

	const mediaMatch = window.matchMedia(mediaQuery);

	const moveElement = () => {
		if (mediaMatch.matches) {
			targetElement.appendChild(element);
		} else {
			sourceElement.appendChild(element);
		}
	};

	moveElement();

	mediaMatch.addEventListener('change', moveElement);
}
