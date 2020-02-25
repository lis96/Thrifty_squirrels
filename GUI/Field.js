class FieldGUI {
	constructor(wrapped, parent) {
		this.wrapped = wrapped;
		this.jQ = $('<div class="field"></div>');
		try {
			parent.append(this.jQ);
		} catch(err) {
			throw 'Error in trying create';
		}
		for (let i = 0;i < this.wrapped.getHeight();i++) {
			for (let j = 0;j < this.wrapped.getWidth();j++) {
				const coordsOfTheGrid = this.coordsOfTheGrid([j, i]);
				coordsOfTheGrid.top += 'px';
				coordsOfTheGrid.bottom += 'px';
				coordsOfTheGrid.left += 'px';
				coordsOfTheGrid.right += 'px';
				//создаём сетку
				this.jQ.append($('<div class="cell"></div>').css(coordsOfTheGrid));
			}
		}
		this.wrapped._squirrels.forEach(sq => {
			new SquirrelGUI(sq, this);
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

	/*checkAllSquirrels() {			
		
		this._squirrels.forEach(function(el){
			el.jQpossibilityCheck();
		});
	}*/
}