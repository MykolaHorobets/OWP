// document.forms.searchUniversities.onsubmit = function () {
// 	const name = this.name.value;
// 	console.log(name);
// 	return false;
// };

function check() {
	return confirm('Вы уверены?');
}

function helper() {
	document.querySelector('.specialty__submit-name').value = document.querySelector('.specialty__input-name').value;
	document.querySelector('.specialty__submit-num-of-students').value = document.querySelector('.specialty__input-num-of-students').value;
	return confirm('Вы уверены?');
}
