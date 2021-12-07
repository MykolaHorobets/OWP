import Mustache from 'mustache';
import socketInit from '../../utils/socket';
import list from '../list/list';
import './createSection.scss';

class CreateSection {
	constructor() {
		this.lastCreated = [];
		this.currentItemId = null;

		this.menuBtnHandler = this.menuBtnHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
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

		return fetch(`http://localhost:3000/templates/createSection.mst`)
			.then(raw => raw.text())
			.then(templateStr => {
				const renderedHtmlStr = Mustache.render(templateStr);
				return renderedHtmlStr;
			})
			.then(htmlStr => {
				const appEl = document.getElementById('root');
				appEl.innerHTML = htmlStr;

				list.currentSection = 'create';
				list.renderList(this.lastCreated);
				const form = document.querySelector('.create-section__form');
				form.addEventListener('submit', this.submitHandler);
			})
			.catch(err => {
				console.log(err);
				document.getElementById('cnt').innerHTML = 'Server error';
			});
	}

	submitHandler(e) {
		e.preventDefault();

		const university = {
			name: e.target[0].value,
			country: e.target[1].value,
			numOfStudents: +e.target[2].value,
			campus: +e.target[3].value,
			foundationDate: e.target[4].value,
		};

		const file = e.target[5].files[0];
		const formData = new FormData();
		formData.append('image', file);
		formData.append('university', JSON.stringify(university));

		document.querySelector('.create-section__form').reset();

		fetch('http://localhost:3000/api/universities', {
			method: 'POST',
			body: formData,
		})
			.then(response => response.json())
			.then(jsonRes => {
				this.lastCreated.unshift(jsonRes);
				list.renderList(this.lastCreated);

				socketInit.then(([socket, userId]) => {
					socket.send(JSON.stringify({ userId, entityId: jsonRes._id, method: 'create' }));
				});
			});
	}
}

export default new CreateSection();
