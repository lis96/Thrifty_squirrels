'use strict';

class Squirrel {
	constructor(coords, field, type) {
		this.coords = [coords[0], coords[1]];
		this.field = field;
		if (!(type in squirrelsTypes)) {
			throw 'Wrong squirrels type founded';
		}
		this.type = type;
		this.field.setSquirrel(this);
		this.jQ = squirrelsGraphicFactory[this.field]();
	}
	getCoordsList() {
		return squirrelsTypes[this.type]['coordsOnGrid'](this.coords);
	}
	_filterSameCell(Coords, newCoords) {
		return newCoords.filter(function(el){
			for (let key in Coords) {
				if (el[0] == Coords[key][0] && el[1] == Coords[key][1]) {
					return false;
				}
			}
			return true;
		});
	}
	getLeftCoords() {
		let newCoords = [];
		this.getCoordsList().forEach(function(el){
			newCoords.push([ el[0], el[1] - 1 ]);
		});

		return this._filterSameCell(this.getCoordsList(), newCoords);
	}
	getRightCoords() {
		let newCoords = [];
		this.getCoordsList().forEach(function(el){
			newCoords.push([ el[0], el[1] + 1 ]);
		});

		return this._filterSameCell(this.getCoordsList(), newCoords);
	}
	getTopCoords() {
		let newCoords = [];
		this.getCoordsList().forEach(function(el){
			newCoords.push([ el[0] - 1, el[1] ]);
		});

		return this._filterSameCell(this.getCoordsList(), newCoords);
	}
	getBottomCoords() {
		let newCoords = [];
		this.getCoordsList().forEach(function(el){
			newCoords.push([ el[0] + 1, el[1] ]);
		});

		return this._filterSameCell(this.getCoordsList(), newCoords);
	}
	_canMoveToCoords(newCoords) {
		let free = true;
		for (let key in newCoords) {
			if (!this.field.isFree(newCoords[key])) {
				free = false;
				break;
			}
		}

		return free;
	}
	canLeft() {
		return this._canMoveToCoords(this.getLeftCoords());
	}
	canRight() {
		return this._canMoveToCoords(this.getRightCoords());
	}
	canTop() {
		return this._canMoveToCoords(this.getTopCoords());
	}
	canBottom() {
		return this._canMoveToCoords(this.getBottomCoords());
	}
	left() {
		if (this.canLeft()) {
			this.coords[1] -= 1;
			this.field.resolveSquirrelsSpace();
			if (typeof this.field.jQ !== 'undefined') {
				this.rrre();			//REMOVE this.jQ
				this.field.checkAllSquirrels();
			}
		}
	}
	right() {
		if (this.canRight()) {
			this.coords[1] += 1;
			this.field.resolveSquirrelsSpace();
			if (typeof this.field.jQ !== 'undefined') {
				this.rrre();			//REMOVE this.jQ
				this.field.checkAllSquirrels();
			}
		}
	}
	top() {
		if (this.canTop()) {
			this.coords[0] -= 1;
			this.field.resolveSquirrelsSpace();
			if (typeof this.field.jQ !== 'undefined') {
				this.rrre();			//REMOVE this.jQ
				this.field.checkAllSquirrels();
			}
		}
	}
	bottom() {
		if (this.canBottom()) {
			this.coords[0] += 1;
			this.field.resolveSquirrelsSpace();
			if (typeof this.field.jQ !== 'undefined') {
				this.rrre();			//REMOVE this.jQ
				this.field.checkAllSquirrels();
			}
		}
	}
	rrre() {
		const coords = this.field.coordsOfTheGrid(this.coords);
		this.jQ.animate({
			top: coords.top,
			left: coords.left
		}, ANIMATE_SPEED);
	}
	jQpossibilityCheck() {
		const mouseevents = function(el, action) {
			el.on('mouseenter', function(){
				$(this).css('border', '1px solid #FF0');
			}).on('mouseleave', function() {
				$(this).css('border', '1px solid #000');
			}).on('click', ()=>{
				action();
				setTimeout(()=>{ $(this).css('border', '1px solid #000'); }, 1000);
			});
		};
		const removeMouseEvents = function(el) {
			el.unbind('mouseenter').unbind('mouseleave').unbind('click');
		};
		[
			{
				canMove: this.canTop(),
				arrowClass: '.arrowTop',
				move: this.top()
			},
			{
				canMove: this.canBottom(),
				arrowClass: '.arrowBottom',
				move: this.bottom()
			},
			{
				canMove: this.canLeft(),
				arrowClass: '.arrowLeft',
				move: this.left()
			},
			{
				canMove: this.canRight(),
				arrowClass: '.arrowRight',
				move: this.right()
			}
		].forEach(function(obj){
			const arrow = $(obj.canMove, this.jQ);
			if (this.canMove) {
				if (arrow.hasClass('deactivate')) {
					arrow.removeClass('deactivate');
					mouseevents(arrow, ()=>{ obj.move(); });
				}
			} else {
				if (!arrow.hasClass('deactivate')) {
					arrow.addClass('deactivate');
					removeMouseEvents(arrow);
				}
			}
		});
	}
	render(color) {
		const coords = this.field.coordsOfTheGrid(this.coords);
		this.jQ.empty().css('backgroundColor', color);
		if (squirrelsTypes[this.type].jQuery)
			squirrelsTypes[this.type].jQuery(this.jQ, Number(coords.width.slice(0, -2)), Number(coords.height.slice(0, -2)), color);
		this.jQ.css(coords);
		this.jQpossibilityCheck();
	}
}

class Field {
	emptyField() {
		for (let i = 0, len = this._height * this._width;i < len;i++) {
			this._field[i] = 0;
		}
	}
	constructor(parent) {
		this._squirrels = [];
		this._height = this._width = 4;
		this._field = [];
		this.emptyField();
		fieldGraphicFactory.createField(parent);
	}
	resolveSquirrelsSpace() {
		const self = this;
		this.emptyField();
		this._squirrels.forEach(function(sq){
			sq.getCoordsList().forEach(function(coords){
				if (self._field[coords[0] * self._width + coords[1]]) {
					throw 'Squirrels placement in the field conflict detected';
				}
				self._field[coords[0] * self._width + coords[1]] = 1;
			});
		})
	}
	setSquirrel(sq) {
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
		if (coords[0] < 0 || coords[0] >= this._height || coords[1] < 0 || coords[1] >= this._width) {
			return false;
		}
		return (this._field[coords[0] * this._width + coords[1]] == 0);
	}
	tojQuery(parent) {
		const self = this;
		this.jQ = $('<div class="field"></div>');
		if (typeof parent !== 'undefined') {
			parent.append(this.jQ);
		}
		for (let i = 0;i < this._height;i++) {
			for (let j = 0;j < this._width;j++) {
				//создаём сетку
				this.jQ.append($('<div class="cell"></div>').css(this.coordsOfTheGrid([j, i])));
			}
		}
		let i = 0;
		this._squirrels.forEach((sq) => {
			this.jQ.append(sq.jQ);
			sq.render(colorList[i++]);
		});
		return this.jQ;
	}
	coordsOfTheGrid(coords) {
		const topLeft = this.jQ.offset();
		const height = this.jQ.height();
		return {
			left:(this.jQ.width() / (this._width)) * (coords[1]) + 'px',
			top:(this.jQ.height() / (this._height)) * (coords[0]) + 'px',
			width: this.jQ.width() / this._width + 'px',
			height: this.jQ.height() / this._height + 'px'
		};
	}
	checkAllSquirrels() {
		this._squirrels.forEach(function(el){
			el.jQpossibilityCheck();
		});
	}
}


