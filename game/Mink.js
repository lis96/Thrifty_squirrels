'use strict';

class Mink {
	constructor(coords, field) {
		/*
			Создание норки для орешка
		*/
		this.coords = [coords[0], coords[1]];	//координаты норки на поле
		this.field = field;						//поле
		this.field.setMink(this);				//регистрируем норку
		this.fulled = false;					//переменная, которая фиксирует заполнение норки орешком
		this.wrappers = [];						//список обёртывающих
	}
	isFulled() {
		/*
			Заполнена ли норка? защищённый доступ к fulled
		*/
		return this.fulled ? true : false;
	}
	getCoords() {
		/*
			Защищённый доступ к координатам
		*/
		return [this.coords[0], this.coords[1]];
	}
	setWrapper(wrapper) {
		/*
			Регистрируем обёртывающую
		*/
		this.wrappers.push(wrapper);
	}
	tryingToHideNut(coords) {
		/*
			Попытка спрятать в норку орешек, находящийся в координатах coords
		*/
		if (this.isFulled() || this.coords[0] !== coords[0] || this.coords[1] !== coords[1]) {
			return false;
		}
		this.hideNut();
		return true;
	}
	hideNut() {
		/*
			Заполнение норки орешком
		*/
		this.fulled = true;
		/*
			Сообщение hideNut всем обёртывающим
		*/
		this.wrappers.forEach(wrap => {
			wrap.hideNut();
		});
	}
}