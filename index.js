(function(){
	'use strict';

	var menuModel = (function() {

		var model = {
			menuItems: [],
			SideMenuItem: SideMenuItem
		}

		function SideMenuItem(options, index){
			this.title = options.name || 'Some cat';
			this.index = index || 0;
		}

		return model;
	})();

	var menuView = (function(){
		function init() {
			var menuItems = menuController.getMenuItems();

			for (var i = menuItems.length - 1; i >= 0; i--) {
				render(menuItems[i]);
			}
		}

		function render(menuItem) {
			var domSideMenuItem = document.createElement('li');

			domSideMenuItem.innerHTML = menuItem.title;
			domSideMenuItem.onclick = itemOnclick.bind(menuItem);

			document.getElementById('side-menu').appendChild(domSideMenuItem);
		}

		function itemOnclick(){
			catsController.showCat(this.index);
			console.log('showing cat ' + this.index);
		}

		return { 
			init: init
		}

	})();

	var menuController = (function(){

		var controller = {
			init: init,
			getMenuItems: getMenuItems
		}

		function init(catsInfo) {
			for (var i = catsInfo.length - 1; i >= 0; i--) {
				menuModel.menuItems[i] = new menuModel.SideMenuItem(catsInfo[i], i);
			}

			menuView.init();
		}

		function getMenuItems() {
			return menuModel.menuItems;
		}

		return controller;
	})();

	var catsModel = (function() {

		var instance = {
			cats: [],
			currentCat: 0,
			Cat: Cat,
			setCurrentCat: setCurrentCat,
			getCurrentCatIndex: getCurrentCatIndex,
			Counter: Counter
		}

		function Cat(options, index) {
			this.name = options ? options.name || 'Cat' : 'Cat';
			this.clicks = new Counter();
			this.img = options.img;
			this.index = index;
		}

		Cat.prototype.catClicked = function() {
			return this.clicks.increment();
		}

		Cat.prototype.updateCat = function(updatedCat) {
			this.name = updatedCat.name || this.name;
			this.img = updatedCat.img || this.img;
		}

		function setCurrentCat(index) {
			instance.currentCat = index;
		}

		function getCurrentCatIndex() {
			return instance.currentCat
		}

		function Counter(){
			var count = 0;

			this.increment = function() {
				return ++count;
			}
			this.getCounter = function() {
				return count;
			}
		}

		return instance;
	})();

	var catsController = (function(){

		var controller = {
			init: init,
			getCat: getCat,
			catOnclick: catOnclick,
			showCat: showCat,
			getCurrentCat: getCurrentCat,
			updateCat: updateCat
		}

		function init(catsInfo) {
			for (var i = catsInfo.length - 1; i >= 0; i--) {
				catsModel.cats[i] = new catsModel.Cat(catsInfo[i], i);
			}

			catsView.init();
			catEditView.init();
		}

		function getCat(index) {
			return catsModel.cats[index];
		}

		function getCurrentCat() {
			return catsModel.cats[catsModel.currentCat];
		}

		function setCurrentCat(index) {
			catsModel.setCurrentCat(index);
		}

		function catOnclick(index) {
			catsModel.cats[index].catClicked();
			catsView.rerenderCatClicks(index);
		}

		function showCat(index) {
			catsModel.setCurrentCat(index);
			catsView.render(catsModel.cats[index]);
		}

		function updateCat(index, updatedCat) {
			var cat;

			if ( index === -1 ) {
				cat = getCurrentCat();
			} else {
				cat = getCat(index);
			}
			
			cat.updateCat(updatedCat);
			catsView.render(catsModel.cats[catsModel.currentCat]);
		}
		return controller;

	})();

	var catsView = (function(){

		var view = {
			init: init,
			render: render,
			rerenderCatClicks: rerenderCatClicks
		}

		var container = document.getElementById('cat-container');
		var title = document.getElementById('cat-title');
		var clicks = document.getElementById('cat-clicks');

		function init() {
			var cat = catsController.getCurrentCat();
			render(cat);
		}

		function render(cat) {
			container.style.background = 'url(' + cat.img + ')';
			title.innerHTML = cat.name;
			clicks.innerHTML = cat.clicks.getCounter();
			container.onclick = catOnclick.bind(cat);
		}

		function rerenderCatClicks(index){
			var cat = catsController.getCat(index);
			clicks.innerHTML = cat.clicks.getCounter();
		}

		function catOnclick() {
			catsController.catOnclick(this.index);
		}

		return view;
	})();

	var catEditView = (function(){

		var view = {
			init: init
		}

		var adminBtn = document.getElementById('admin-mode-btn');
		var catEditContainer = document.getElementById('cat-edit-form');
		var catEditForm = document.getElementById('cat-edit');
		var catEditCancelBtn = document.getElementById('cat-edit-cancel-btn');
		var catNameInput = document.getElementsByClassName('cat-name-input')[0];
		var catImgInput = document.getElementsByClassName('cat-img-url-input')[0];
		var catClicksInput = document.getElementsByClassName('cat-clicks-number-input')[0];
		
		function init() {
			adminBtn.onclick = showCatEditWindow;
			catEditForm.onsubmit = updateCatFormSubmitted;
			catEditCancelBtn.onclick = hideCatEditWindow;
		}

		function showCatEditWindow() {
			var currentCat = catsController.getCurrentCat();

			render(currentCat);
		}

		function hideCatEditWindow(e) {
			e ? e.preventDefault() : '';

			catEditContainer.style.display = 'none';
			catNameInput.value = '';
			catImgInput.value = '';
			catClicksInput.value = 0;
		}

		function render(currentCat) {
			catNameInput.value = currentCat.name || '';
			catImgInput.value = currentCat.img || '';
			catClicksInput.value = currentCat.clicks.getCounter() || 0;

			catEditContainer.style.display = 'block';
		}

		function updateCatFormSubmitted(e) {
			e.preventDefault();

			var updatedCat = {
				name: catNameInput.value || 'Cat',
				img: catImgInput.value || '' 
			}

			catsController.updateCat(-1, updatedCat);

			hideCatEditWindow();
		}

		return view;
	})();

	var catsInfo = [
		{
			name: 'Cat 1',
			img: 'http://dreamatico.com/data_images/kitten/kitten-3.jpg'
		},
		{
			name: 'Cat 2',
			img: 'http://images4.fanpop.com/image/photos/16100000/Cute-Kitten-kittens-16123796-1280-800.jpg'
		},
		{
			name: 'Cat 3',
			img: 'https://wallpaperscraft.com/image/kitten_ball_thread_white_background_95135_602x339.jpg'
		},
		{
			name: 'Cat 4',
			img: 'http://cf.ltkcdn.net/cats/images/slide/129551-850x565r1-Gray-kitten-5.jpg'
		},
		{
			name: 'Cat 5',
			img: 'http://assets.nydailynews.com/polopoly_fs/1.1269592.1361443092!/img/httpImage/image.jpg_gen/derivatives/article_970/daisy-kitten-4.jpg'
		},
		{
			name: 'Cat 6',
			img: 'http://cdn.playbuzz.com/cdn/154cb38e-55e3-4294-bffe-6906b6a41a6b/eecbac70-bf61-41d9-a542-1fc80cd81dbc.jpg'
		}
	]

	menuController.init(catsInfo);
	catsController.init(catsInfo);

})();