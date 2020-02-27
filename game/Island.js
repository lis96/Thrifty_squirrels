class Island {
	constructor(coords, field) {
		this.coords = [coords[0], coords[1]];	//координаты белки на поле
		this.field = field;						//поле
		this.field.setIsland(this);				//вызываем функцию учёта белки на поле
		this.wrappers = [];						//список обёртывающих
	}
	setWrapper(wrapper) {
		/*
			Регистрируем обёртывающую
		*/
		this.wrappers.push(wrapper);
	}
	getCoords() {
		/*
			Защищённый доступ к координатам
		*/
		return [this.coords[0], this.coords[1]];
	}
}