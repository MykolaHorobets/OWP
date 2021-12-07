import 'normalize.css';
import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import $ from 'jquery';
import './index.scss';
import createSection from './modules/createSection/createSection';
import listSection from './modules/listSection/listSection';

const btns = document.querySelectorAll('.menu__btn');
btns.forEach(btn => {
	const templateName = btn.getAttribute('data-template');

	if (templateName === 'create') {
		btn.addEventListener('click', createSection.menuBtnHandler);
	} else if (templateName === 'list') {
		btn.addEventListener('click', listSection.menuBtnHandler);
	}
});

window.addEventListener('load', () => {
	listSection.menuBtnHandler();
	// btns.forEach(btn => (btn.disabled = false));
});

//modal scroll bug fix
$(document).on('hidden.bs.modal', '.modal', () => {
	$('.modal:visible').length && $(document.body).addClass('modal-open');
});
