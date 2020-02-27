'use strict';

class MinkGUI {
	/*
		Графический элемент норки
	*/
	constructor(wrapped, fieldGUI) {
		/*
			Конструктор класса графического элемента норки
		*/
		this.wrapped = wrapped;			//обёртываемая декоратором
		this.wrapped.setWrapper(this);	//регистрируем обёртку
		this.field = fieldGUI;			//графический элемент поля, на котором расположена норка
		//jQuery элемент
		this.jQ = $('<div class="mink"><div class="circle"></div></div>').css(this.field.coordsOfTheGrid(this.wrapped.getCoords()));
		this.field.jQ.append(this.jQ);	//Добавляем элемент на поле
		if (this.wrapped.isFulled()) {
			this.jQ.addClass('deactivate');
		}
	}
	hideNut() {
		/*
			Анимация заполнения норки
		*/
		$('.circle', this.jQ).animate({
			width: '0',
			height: '0',
			margin: '50%'
		}, Settings.getAnimateSpeed(), () => {
			this.jQ.addClass('deactivate');
		});
	}
}