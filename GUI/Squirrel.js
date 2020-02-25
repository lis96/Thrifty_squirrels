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
		//распологаем элемент на поле
		this.jQ.css({
			left: coords.left + 'px',
			top: coords.top + 'px'
		});
		this.checkPossibleDirectionOfMove();
	}

	move() {
		/*
			приводим анимацией GUI белки в соответствие реальному положению
			белки на поле в игре
		*/
		//находим реальные координаты
		const coords = this.field.coordsOfTheGrid(this.wrapped.coords);
		//приводим в соответствие анимацией
		this.jQ.animate({
			top: coords.top,
			left: coords.left
		}, Settings.getAnimateSpeed(), () => {
			//чекаем возможность движения каждой из белок
			this.field.checkAllSquirrelsPossibleDirections();
		});
	}

	checkPossibleDirectionOfMove() {
		//функция навешивает эвенты мыши на графический элемент - стрелку
		const mouseevents = (el, action) => {
			el.on('mouseenter', function(){
				$(this).css('border', '1px solid #FF0');
			}).on('mouseleave', function() {
				$(this).css('border', '1px solid #000');
			}).on('click', ()=>{
				action();
			});
		};
		//функция снимает эвенты мыши
		const removeMouseEvents = el => {
			el.unbind('mouseenter').unbind('mouseleave').unbind('click');
		};
		//задаём массив для текущего положения белки, в массиве по каждому из направлений
		//задана возможность движения, класс, которым можно выбрать стрелку направления
		//и функцию движения (движение на реальной игре с коллбэком анимации в GUI)
		[
			{
				canMove: this.wrapped.canTop(),
				arrowClass: '.arrowTop',
				move: callback => { this.wrapped.top.apply(this.wrapped, [callback]); }
			},
			{
				canMove: this.wrapped.canBottom(),
				arrowClass: '.arrowBottom',
				move: callback => { this.wrapped.bottom.apply(this.wrapped, [callback]); }
			},
			{
				canMove: this.wrapped.canLeft(),
				arrowClass: '.arrowLeft',
				move: callback => { this.wrapped.left.apply(this.wrapped, [callback]); }
			},
			{
				canMove: this.wrapped.canRight(),
				arrowClass: '.arrowRight',
				move: callback => { this.wrapped.right.apply(this.wrapped, [callback]); }
			}
		].forEach(obj => {
			//выбираем стрелку
			const arrow = $(obj.arrowClass, this.jQ).css('border', '1px solid #000');
			//если соответствующее движение возможно
			if (obj.canMove) {
				//снимаем класс деактивации графической стрелки и навешиваем эвенты
				if (arrow.hasClass('deactivate')) {
					arrow.removeClass('deactivate');
					mouseevents(arrow, ()=>{ obj.move(() => { this.move.apply(this); }); });
				}
			} else {
				//навешиваем класс деактивации графической стрелки и убираем эвенты
				if (!arrow.hasClass('deactivate')) {
					arrow.addClass('deactivate');
					removeMouseEvents(arrow);
				}
			}
		});
	}
}