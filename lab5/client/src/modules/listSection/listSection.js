import Mustache from 'mustache';
import list from '../list/list';
import './listSection.scss';

class ListSection {
	constructor() {
		this.menuBtnHandler = this.menuBtnHandler.bind(this);
	}

	menuBtnHandler() {
		document.getElementById('root').innerHTML = `
		<div class="container">
			<div class="spinner-cnt">
				<div class="spinner-border" role="status">
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		</div>`;

		const btns = document.querySelectorAll('.menu__btn');
		btns.forEach(btn => {
			btn.disabled = !btn.disabled;
			btn.classList.toggle('active');
		});

		return fetch(`http://localhost:3000/templates/listSection.mst`)
			.then(raw => raw.text())
			.then(templateStr => {
				const renderedHtmlStr = Mustache.render(templateStr);
				return renderedHtmlStr;
			})
			.then(htmlStr => {
				const appEl = document.getElementById('root');
				appEl.innerHTML = htmlStr;

				list.currentSection = 'list';
				list.renderList();
			})
			.catch(err => {
				console.log(err);
				document.getElementById('cnt').innerHTML = 'Server error';
			});
	}
}

export default new ListSection();
