class FieldGUI {
	constructor(wrapped, parent) {
		/*
			Конструктор графического элемента поля
		*/
		this.wrapped = wrapped;						//обёрнуты элемент поля игры
		this.jQ = $('<div class="field"></div>');	//jQ-элемент поля игры
		//попытка внесения jQ элемента поля на HTML-страницу
		try {
			parent.append(this.jQ);
		} catch(err) {
			throw 'Error in trying create';
		}
		//рисуем сетку
		for (let i = 0;i < this.wrapped.getHeight();i++) {
			for (let j = 0;j < this.wrapped.getWidth();j++) {
				const coordsOfTheGrid = this.coordsOfTheGrid([j, i]);
				coordsOfTheGrid.top += 'px';
				coordsOfTheGrid.bottom += 'px';
				coordsOfTheGrid.left += 'px';
				coordsOfTheGrid.right += 'px';
				//вносим сетку на поле сетку
				this.jQ.append($('<div class="cell"></div>').css(coordsOfTheGrid));
			}
		}
		this._squirrels = [];			//массив графических элементов белок
		//размещаем белок в поле
		this.wrapped._squirrels.forEach(sq => {
			this._squirrels.push(new SquirrelGUI(sq, this));
		});
		this._minks = [];				//массив графических элементов норок
		//размещаем норки в поле
		this.wrapped._minks.forEach(mink => {
			this._minks.push(new MinkGUI(mink, this));
		});
	}

	coordsOfTheGrid(coords) {
		/*
			Возвращаем координаты (высота и положение) ячейки поля
		*/
		const width = this.jQ.width();
		const height = this.jQ.height();
		return {
			left:(width / (this.wrapped.getWidth())) * (coords[1]),
			top:(height / (this.wrapped.getHeight())) * (coords[0]),
			width: width / this.wrapped.getWidth(),
			height: height / this.wrapped.getHeight()
		};
	}

	checkAllSquirrelsPossibleDirections() {
		/*
			Для всех графических элементов - белок на поле проверяем возможность
			движения в ту или иную сторону, в зависимости от текущей конфигурации поля
		*/
		this._squirrels.forEach(sq => {
			sq.checkPossibleDirectionOfMove();
		});
	}
}