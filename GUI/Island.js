'use strict';

class IslandGUI {
	constructor(wrapped, fieldGUI) {
		this.wrapped = wrapped;						//обёртывающая декоратора
		this.wrapped.setWrapper(this);				//регистрируем обёртку
		this.field = fieldGUI;						//GUI поля
		this.color = Settings.getFollowingColor();	//выдаём цвет
		//на фаборике создаём объект графического элемента белочки
		this.jQ = $('<div class="island"></div>').css(this.field.coordsOfTheGrid(this.wrapped.coords)).css('background-color', this.color);
		//добавляем элемент на поле
		this.field.jQ.append(this.jQ);
	}
}