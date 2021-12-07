import $ from 'jquery';
import Mustache from 'mustache';
import './list.scss';

const modalConfirmBtn = document.getElementById('deleteConfirm');

class List {
	constructor() {
		this.items = null;
		this.searchValue = '';
		this.page = 1;
		this.currentSection = 'list';

		this.renderList = this.renderList.bind(this);
		this.showProfile = this.showProfile.bind(this);
		this.confirmBtnHandler = this.confirmBtnHandler.bind(this);
		this.searchFormHandler = this.searchFormHandler.bind(this);
		this.navBtnHandler = this.navBtnHandler.bind(this);

		modalConfirmBtn.addEventListener('click', this.confirmBtnHandler);

		$('#deleteModal').on('show.bs.modal', e => {
			$('#showProfileModal').addClass('overlapped');
		});
		$('#deleteModal').on('hidden.bs.modal', e => {
			$('#showProfileModal').removeClass('overlapped');
		});
	}

	renderList(items, params = {}) {
		!items && (document.querySelector('.list-section__search-indicator').innerHTML = this.searchValue ? `You've entered: ${this.searchValue}` : '');
		// document.getElementById('list').innerHTML = `
		// <div class="container">
		// 	<div class="spinner-border" role="status">
		// 		<span class="sr-only">Loading...</span>
		// 	</div>
		// </div>`;

		Promise.all([
			fetch('http://localhost:3000/templates/list.mst').then(x => x.text()),
			!items ? fetch('http://localhost:3000/templates/pagination.mst').then(x => x.text()) : null,
			!items ? fetch(`http://localhost:3000/api/universities?name=${this.searchValue}&page=${params.page || 1}&limit=${params.limit || 5}`).then(x => x.json()) : null,
		])
			.then(([listStr, paginationStr, itemsData]) => {
				this.items = items || itemsData.results;
				this.page = params.page || this.page;

				const dataObject = { items: this.items, title: items ? 'Last created' : 'All entities', showProfile: this.showProfile };
				const renderedListStr = Mustache.render(listStr, dataObject);

				if (paginationStr) {
					const pages = [...Array(itemsData.numOfPages).keys()].map(x => ++x);
					const paginationObject = { page: params.page || 1, pages, next: itemsData.next, prev: itemsData.previous };
					const renderedPaginationStr = Mustache.render(paginationStr, paginationObject);

					return [renderedListStr, renderedPaginationStr];
				}

				return [renderedListStr];
			})
			.then(([listStr, paginationStr = null]) => {
				const listEl = document.getElementById('list');
				listEl.innerHTML = listStr;

				if (paginationStr) {
					const paginationEl = document.getElementById('pagination');
					paginationEl.innerHTML = paginationStr;
				}

				const listLinks = document.querySelectorAll('.list__link');
				listLinks?.forEach(link => {
					link.addEventListener('click', this.showProfile);
				});

				const searchForm = document.querySelector('.list-section__search');
				searchForm?.addEventListener('submit', this.searchFormHandler);

				const navBtns = document.querySelectorAll('.page-link');
				navBtns?.forEach(btn => {
					btn.dataset.page === (params.page || '1') ? btn.parentElement.classList.add('active') : btn.parentElement.classList.remove('active');
					btn.addEventListener('click', this.navBtnHandler);
				});
			})
			.catch(err => {
				console.error(err);
				document.getElementById('list').innerHTML = 'Server error';
			});
	}

	showProfile(e, isToast) {
		const elId = e.target.dataset.id;
		this.currentItemId = elId;

		Promise.all([fetch('http://localhost:3000/templates/profile.mst').then(x => x.text()), fetch(`http://localhost:3000/api/universities/${elId}`).then(x => x.json())])
			.then(([templateStr, itemData]) => {
				const entity = itemData;

				const renderedHtmlStr = Mustache.render(templateStr, entity);
				return renderedHtmlStr;
			})
			.then(htmlStr => {
				const profileEl = document.getElementById('profile');
				profileEl.innerHTML = htmlStr;

				$('#showProfileModal').modal('show');
			})
			.catch(err => console.log(err));
	}

	confirmBtnHandler(e) {
		const id = this.currentItemId;
		fetch(`http://localhost:3000/api/universities/${id}`, {
			method: 'DELETE',
		})
			.then(x => x.json())
			.then(response => {
				if (response.deletedCount > 0) {
					const index = this.items.findIndex(item => item._id === id);
					if (index !== -1) {
						const profile = document.getElementById('profile');
						profile.classList.add('hide');
						profile.innerHTML = '';

						this.items.splice(index, 1);
						this.renderList(this.currentSection === 'list' ? null : this.items, { page: this.page });
					} else {
						console.log('Index not found');
					}
					$('#deleteModal').modal('hide');
					$('#showProfileModal').modal('hide');
					$('.modal-backdrop').remove();
				} else {
					console.log('No entity with this id');
				}
			})
			.catch(err => console.log(err));
	}

	searchFormHandler(e) {
		e.preventDefault();
		const searchEl = document.querySelector('.list-section__search-input');
		this.searchValue = searchEl.value;

		document.activeElement.blur();
		searchEl.value = '';

		this.renderList();
	}

	navBtnHandler(e) {
		const page = e.target.dataset.page;

		this.renderList(null, { page, limit: 5 });
	}
}

export default new List();
