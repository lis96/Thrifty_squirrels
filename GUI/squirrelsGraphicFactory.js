const squirrelsGraphicFactory = new (function(){
	function stylesOfSquirrelsBlocks(width, height, color) {
		/*
			стили конкретного блока и стрелки
		*/
		return {
			style: {
				width: width + 'px',
				height: height + 'px',
				backgroundColor: color
			},
			arrowStyle:{
				width: width / 4 + 'px',
				height: height / 4 + 'px'
			}
		}
	}
	function createBlocks(block, width, height, color) {
		/*
			Элемент белки состоит из блока на поле, здесь задаём создаём массив блоков на основе
			переданного массива классов блока и его положения
		*/
		const style = stylesOfSquirrelsBlocks(width, height, color).style;
		return block.map(classes => {
			return  $('<div class="block ' + classes.reduce((style, cssClass) => style + ' ' + cssClass) + '"></div>').css(style);
		});
	}
	function createArrows(width, height, color, styles) {
		/*
			Элемент белки содержит четыре стрелки. Здесь мы создаём эти стрелки на основе их положения 
			на основном элементе белки
		*/
		const arrowStyle = stylesOfSquirrelsBlocks(width, height, color).arrowStyle;
		return {
			top: $('<div class="arrow arrowTop deactivate"></div>').css(arrowStyle).css(typeof styles.top === 'undefined' ? {} : styles.top),
			bottom: $('<div class="arrow arrowBottom deactivate"></div>').css(arrowStyle).css(typeof styles.bottom === 'undefined' ? {} : styles.bottom),
			left: $('<div class="arrow arrowLeft deactivate"></div>').css(arrowStyle).css(typeof styles.left === 'undefined' ? {} : styles.left),
			right: $('<div class="arrow arrowRight deactivate"></div>').css(arrowStyle).css(typeof styles.right === 'undefined' ? {} : styles.right)
		}
	}
	function createSquirrel(blocks, arrows) {
		/*
			Функция создания конкретного графического элемента белки на основе элементов блоков
			её составляющий и стрелок с заданными стилями и положениями. Это простой сборщик
		*/
		const parent = $('<div class="squirrel"></div>');
		blocks.forEach(block => {
			parent.append(block);
		});
		for (key in arrows) {
			parent.append(arrows[key]);
		}
		return parent;
	}
	//типовые функции создания конкретных типов белок
	this.line2height = function(width, height, color) {
		const blocks = createBlocks([['withoutBottom'], ['withoutTop']], width, height, color);
		blocks[1].css({
			top: height + 'px'
		});
		const arrows = createArrows(width, height, color, {
			top: {
				left: width * 0.375 + 'px'
			},
			bottom: {
				left: width * 0.375 + 'px',
				top: (height * 1.75 - 3) + 'px'
			},
			left: {
				top: height * 0.875 + 'px'
			},
			right: {
				top: height * 0.875 + 'px',
				left: 0.75 * height - 3 + 'px'
			}
		});
		return createSquirrel(blocks, arrows);
	};
	this.line2width = function(width, height, color) {
		const blocks = createBlocks([['withoutRight'], ['withoutLeft']], width, height, color);
		blocks[1].css({
			left: width + 'px'
		});
		const arrows = createArrows(width, height, color, {
			top: {
				left: width * 0.875 + 'px'
			},
			bottom: {
				left: width * 0.875 + 'px',
				top: (height * 0.75 - 3) + 'px'
			},
			left: {
				top: height * 0.375 + 'px'
			},
			right: {
				top: height * 0.375 + 'px',
				left: 1.75 * height - 3 + 'px'
			}
		});
		return createSquirrel(blocks, arrows);
	};
	/*this.CounterclockwiseCorner = function(width, height, color) {
		const blocks = createBlocks([['withoutBottom'], ['withoutTop', 'withoutRight'], ['withoutLeft']]);
		blocks[1].css({
			top: height + 'px'
		});
		blocks[2].css({
			top: height + 'px',
			left: width + 'px'
		});
		const arrows = createArrows({
			top:{
				left: width * 0.375 + 'px'
			},
			bottom:{
				left: width * 0.875 + 'px',
				top: (height * 1.75 - 3) + 'px'
			},
			left:{
				top: height * 0.75 + 'px'
			},
			right:{
				top: height * 1.375 + 'px',
				left: 1.75 * height - 3 + 'px'
			}
		});
		return createSquirrel(blocks, arrows);
	};
	this.ClockwiseCorner = function(width, height, color) {
		parent.empty();
		const blocks = createBlocks([['withoutRight'], ['withoutLeft', 'withoutBottom'], ['withoutTop']]);
		blocks[1].css({
			left: width + 'px'
		});
		blocks[2].css({
			top: height + 'px',
			left: width + 'px'
		});
		const arrows = createArrows({
			top:{
				left: width * 0.875 + 'px'
			},
			bottom:{
				left: width * 1.375 + 'px',
				top: (height * 1.75 - 3) + 'px'
			},
			left:{
				top: height * 0.375 + 'px'
			},
			right:{
				top: height * 0.875 + 'px',
				left: 1.75 * height - 3 + 'px'
			}
		});
		return createSquirrel(blocks, arrows);
	};*/
})();