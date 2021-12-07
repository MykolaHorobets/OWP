import $ from 'jquery';
import Mustache from 'mustache';
import NotificationLogo from '../assets/icons/notification.png';
import list from '../modules/list/list';
import userId from './userId';

function socketInit() {
	const socket = new WebSocket('ws://localhost:3000');
	return new Promise(res => {
		socket.onopen = () => {
			socket.send(JSON.stringify({ userId, method: 'connection' }));

			socket.onmessage = event => {
				const data = JSON.parse(event.data);
				switch (data.method) {
					case 'create':
						createToast(data.entityId);
						break;
					default:
						console.log(data);
				}
			};

			res([socket, userId]);
		};
	});
}

function createToast(id) {
	Promise.all([fetch('http://localhost:3000/templates/toast.mst').then(x => x.text()), fetch(`http://localhost:3000/api/universities/${id}`).then(x => x.json())])
		.then(([templateStr, itemData]) => {
			const dataObject = { item: itemData, img: NotificationLogo };
			console.log(dataObject);

			const renderedHtmlStr = Mustache.render(templateStr, dataObject);
			return renderedHtmlStr;
		})
		.then(htmlStr => {
			const appEl = document.querySelector('.toast-wrapper');
			appEl.insertAdjacentHTML('afterbegin', htmlStr);

			const toast = document.getElementById(`toast-${id}`);
			if (toast) {
				const toastShowProfile = toast.querySelector('.toast__show-profile');

				toastShowProfile.addEventListener('click', list.showProfile);

				const $toast = $(`#toast-${id}`);
				$toast.toast('show');
				$toast.on('hidden.bs.toast', e => {
					toast.remove();
				});
			}
		})
		.catch(err => {
			console.error(err);
			document.getElementById('root').innerHTML = 'Server error';
		});
}

export default socketInit();
