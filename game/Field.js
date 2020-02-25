class Field {
	_emptyField() {
		/*
			Задаём всем ячейкам таблицы поля нули
		*/
		for (let i = 0, len = this._height * this._width;i < len;i++) {
			this._field[i] = 0;
		}
	}

	constructor() {
		this._squirrels = [];
		this._height = this._width = 4;
		this._field = [];
		this._emptyField();
	}

	getHeight() {
		/*
			Защищённое обращение к полю height
		*/
		return this._height;
	}

	getWidth() {
		/*
			Защищённое обращение к полю width
		*/
		return this._width;
	}
	
	resolveSquirrelsSpace() {
		/*
			Производим переграссчёт таблицы поля в соответствии с положением белок на поле
		*/
		this._emptyField();
		this._squirrels.forEach(sq => {
			sq.getCoordsList().forEach(coords => {
				if (this._field[coords[0] * this._width + coords[1]]) {
					throw 'Squirrels placement in the field conflict detected';
				}
				this._field[coords[0] * this._width + coords[1]] = 1;
			});
		});
	}

	setSquirrel(sq) {
		/*
			Функция добавления белки на поле(белка не знает о том, что она добавлена)
		*/
		this._squirrels.push(sq);
		this.resolveSquirrelsSpace();
	}

	toString() {
		let str = '';
		for (let i = 0;i < this._height;i++) {
			for (let j = 0;j < this._width;j++) {
				str += this._field[i * this._width + j] + '  ';
			}
			str += '\n';
		}

		return str;
	}

	isFree(coords) {
		/*
			Проверяет, свободна ли некоторая ячейка поля
		*/
		if (coords[0] < 0 || coords[0] >= this._height || coords[1] < 0 || coords[1] >= this._width) {
			return false;
		}
		return (this._field[coords[0] * this._width + coords[1]] == 0);
	}
}