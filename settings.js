const Settings = new (function(obj) {
	/*
		Объект-хранитель настроек конкретной игры. Может быть переоределён или расширен.
		Сейчас принимает дефолтные значения настроек просто в аргументах функции-конструктора
	*/
	let animateSpeed = obj.animateSpeed;	//скорость анимации
	let colorList = obj.colorList;			//список цветов белок
	let colorUsed = 0;						//сколько цветов белкам уже выдано
	this.getAnimateSpeed = () => {
		/*
			Защищённый доступ к скорости анимации
		*/
		return animateSpeed;
	};
	this.setAnimateSpeed = val => {
		/*
			Задаём скорость анимации
		*/
		val = Number(val);
		if (val !== val || val <= 0) {
			throw 'Trying to set wrong Settings:animateSpeed';
		}
		animateSpeed = val;
	};
	this.getColorListElement = ind => {
		/*
			ind элемент списка цветов, защищённый доступ
		*/
		return colorList[ind].slice();
	};
	this.setColorListElement = (ind, color) => {
		/*
			Задаём ind элемент списка цветов
		*/
		colorList[ind] = color.slice();
	};
	this.getFollowingColor = () => {
		/*
			Выдаём следующий цвет
		*/
		return this.getColorListElement(colorUsed++);
	};
	this.resetColor = () => {
		colorUsed = 0;
	}
})({
	animateSpeed: 400,
	colorList: [
		'#FAA',
		'#AFA',
		'#AAF',
		'#FFA',
		'#FAF',
		'#AFF'
	]
});