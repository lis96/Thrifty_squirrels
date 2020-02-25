class SquirrelGUI {
	constructor(wrapped, fieldGUI) {
		this.wrapped = wrapped;						//обёртывающая декоратора
		this.field = fieldGUI;						//GUI поля
		this.color = Settings.getFollowingColor();	//выдаём цвет
		const coords = this.field.coordsOfTheGrid(this.wrapped.coords);		//выдаём координаты элемента на поле
		//на фаборике создаём объект графического элемента белочки
		this.jQ = squirrelsGraphicFactory[this.wrapped.type](coords.width, coords.height, this.color);
		//добавляем элемент на поле
		this.field.jQ.append(this.jQ);
		this.jQ.css({
			left: coords.left + 'px',
			top: coords.top + 'px'
		});
		this.checkPossibleDirectionOfMove();
	}
	/*rrre() {
		const coords = this.field.coordsOfTheGrid(this.coords);
		this.jQ.animate({
			top: coords.top,
			left: coords.left
		}, ANIMATE_SPEED);
	}*/

	checkPossibleDirectionOfMove() {
		const mouseevents = (el, action) => {
			el.on('mouseenter', function(){
				$(this).css('border', '1px solid #FF0');
			}).on('mouseleave', function() {
				$(this).css('border', '1px solid #000');
			}).on('click', ()=>{
				action();
			});
		};
		const removeMouseEvents = el => {
			el.unbind('mouseenter').unbind('mouseleave').unbind('click');
		};
		[
			{
				canMove: this.wrapped.canTop(),
				arrowClass: '.arrowTop',
				move: this.wrapped.top
			},
			{
				canMove: this.wrapped.canBottom(),
				arrowClass: '.arrowBottom',
				move: this.wrapped.bottom
			},
			{
				canMove: this.wrapped.canLeft(),
				arrowClass: '.arrowLeft',
				move: this.wrapped.left
			},
			{
				canMove: this.wrapped.canRight(),
				arrowClass: '.arrowRight',
				move: this.wrapped.right
			}
		].forEach(obj => {
			const arrow = $(obj.arrowClass, this.jQ);
			if (obj.canMove) {
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
}