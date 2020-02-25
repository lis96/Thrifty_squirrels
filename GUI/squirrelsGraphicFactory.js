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
	
	const BlockTypes = {
		/*
			Здесь заданы варианты блоков, из которых собираются белки:
				CCSclasses - в зависимости от набора остальных блоков, данные классы будут
					включены в классы конкретного блока
				position - позиционирование конкретного блока
		*/
		topLeft: {
			CSSclasses: {
				'topRight': 'withoutRight',
				'bottomLeft': 'withoutBottom'
			},
			position: (style) => {
				return {}
			}
		},
		topRight: {
			CSSclasses: {
				'topLeft': 'withoutLeft',
				'bottomRight': 'withoutBottom'
			},
			position: (style) => {
				return {
					left: style.width
				}
			}
		},
		bottomLeft: {
			CSSclasses: {
				'topLeft': 'withoutTop',
				'bottomRight': 'withoutRight'
			},
			position: (style) => {
				return {
					top: style.height
				}
			}
		},
		bottomRight: {
			CSSclasses: {
				'topRight': 'withoutTop',
				'bottomLeft': 'withoutLeft'
			},
			position: (style) => {
				return {
					left: style.width,
					top: style.height
				}
			}
		}
	}
	
	function centralizationPosition (blockWidth, arrowWidth, lineIndex) {
		/*
			расположение стрелочки ровно по центру границы белки
				lineIndex определяет характер границы, составленный блоками
		*/
		blockWidth = Number(blockWidth.slice(0, -2));
		arrowWidth = Number(arrowWidth.slice(0, -2));
		if (lineIndex === 1) {
			return ((blockWidth - arrowWidth) / 2) + 'px';
		} else if (lineIndex === 2) {
			return (blockWidth + (blockWidth - arrowWidth) / 2) + 'px';
		} else if (lineIndex === 3) {
			return (blockWidth - arrowWidth / 2) + 'px';
		} else {
			throw 'Wrong index of blocks type';
		}
	}

	function SolvePosition(blocksPosition) {
		/*
			Функция, возвращающая на основе функции централизации по границе общего вида, функцию,
				проводящую конкретную централизацию конкретной стрелочки для конкретного вида белки
		*/
		return (blockWidth, arrowWidth, blocks) => {
			if (blocks.indexOf(blocksPosition[0]) !== -1 || blocks.indexOf(blocksPosition[1]) !== -1) {
				return centralizationPosition(blockWidth, arrowWidth,
					(blocks.indexOf(blocksPosition[0]) !== -1 ? 1 : 0) + (blocks.indexOf(blocksPosition[1]) !== -1 ? 2 : 0)
				);
			} else {
				return centralizationPosition(blockWidth, arrowWidth,
					(blocks.indexOf(blocksPosition[2]) !== -1 ? 1 : 0) + (blocks.indexOf(blocksPosition[3]) !== -1 ? 2 : 0)
				);
			}
		}
	}

	function toBorderPosition(blocksPosition) {
		/*
			Функция позиционирования стрелочки точно у границы конкретной белки (паз 3 пикселя
				до границы)
		*/
		return (blockWidth, arrowWidth, blocks) => {
			arrowHeight = Number(arrowWidth.slice(0, -2));
			blockHeight = Number(blockWidth.slice(0, -2));
			return (blockHeight - arrowHeight - 3 + 
				(blocks.indexOf(blocksPosition[0]) !== -1 || blocks.indexOf(blocksPosition[1]) !== -1 ? blockHeight : 0)) + 'px';
		}
	}

	const arrowTypes = {
		/*
			Это объект, который характеоризует конкретные типы стрелочек
				CSSclass - класс стрелочки
				position - позиционирование стрелочки
		*/
		top: {
			CSSclass: 'arrowTop',
			position: (styles, blocks) => {
				return {
					left: SolvePosition(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])(styles.style.width, styles.arrowStyle.width, blocks),
					top: '3px'
				};
			}
		},
		bottom: {
			CSSclass: 'arrowBottom',
			position: (styles, blocks) => {
				return {
					left: SolvePosition(['bottomLeft', 'bottomRight', 'topLeft', 'topRight'])(styles.style.width, styles.arrowStyle.width, blocks),
					top: toBorderPosition(['bottomLeft', 'bottomRight'])(styles.style.width, styles.arrowStyle.width, blocks)
				};
			}
		},
		left: {
			CSSclass: 'arrowLeft',
			position: (styles, blocks) => {
				return {
					top: SolvePosition(['topLeft', 'bottomLeft', 'topRight', 'bottomRight'])(styles.style.height, styles.arrowStyle.height, blocks),
					left: '3px'
				};
			}
		},
		right: {
			CSSclass: 'arrowRight',
			position: (styles, blocks) => {
				return {
					top: SolvePosition(['topRight', 'bottomRight', 'topLeft', 'bottomLeft'])(styles.style.height, styles.arrowStyle.height, blocks),
					left: toBorderPosition(['topRight', 'bottomRight'])(styles.style.height, styles.arrowStyle.height, blocks)
				};
			}
		}
	}
	function createBlock(type, style, blocks) {
		/*
			Функция создания конкретного типа блока для белки
		*/
		if (typeof BlockTypes[type] === 'undefined') {
			/*
				Для незаданного типа пораждаем исключение
			*/
			throw 'Trying to create block with undefined type in squirrelsGraphicFactory';
		}
		return $('<div class="block ' + (() => {
			let classes = '';
			/*
				Формируем классы на основе прочих блоков данной белки (они отвечают
					за то, какие бордеры данного блока будут отсутствовать)
			*/
			for (let otherBlock in BlockTypes[type].CSSclasses) {
				if (blocks.indexOf(otherBlock) !== -1) {
					classes += ' ' + BlockTypes[type].CSSclasses[otherBlock];
				}
			}
			return classes;
		})() + '"></div>').css(style).css(BlockTypes[type].position(style));
	}
	function createArrow(type, styles, blocks) {
		/*
			функция создания стрелки конкретного типа
		*/
		if (typeof arrowTypes[type] === 'undefined') {
			throw 'Trying to crate arrow with undefined type in squirrelsGraphicFactory';
		}
		return $('<div class="arrow ' + arrowTypes[type].CSSclass + ' deactivate"></div>').css(styles.arrowStyle).css(arrowTypes[type].position(styles, blocks));
	}
	function createSquirrel(blocks, width, height, color) {
		/*
			Функция создания конкретного графического элемента белки на основе элементов блоков
			её составляющий и стрелок с заданными стилями и положениями. Это простой сборщик
		*/
		const styles = stylesOfSquirrelsBlocks(width, height, color);
		const parent = $('<div class="squirrel"></div>');
		/*
			Добавляем блоки и стрелки
		*/
		blocks.map(block => {
			return createBlock(block, styles.style, blocks);
		}).forEach(block => {
			parent.append(block);
		});
		[
			createArrow('top', styles, blocks),
			createArrow('bottom', styles, blocks),
			createArrow('left', styles, blocks),
			createArrow('right', styles, blocks)
		].forEach(arrow => {
			parent.append(arrow);
		});
		return parent;
	}
	
	//типовые функции создания конкретных типов белок
	this.line2height = (width, height, color) => {
		return createSquirrel(['topLeft', 'bottomLeft'], width, height, color);
	};
	this.line2width = function(width, height, color) {
		return createSquirrel(['topLeft', 'topRight'], width, height, color);
	};
	this.topLeftCorner = function(width, height, color) {
		return createSquirrel(['topRight', 'bottomLeft', 'bottomRight'], width, height, color);
	};
	this.topRightCorner = function(width, height, color) {
		return createSquirrel(['topLeft', 'bottomLeft', 'bottomRight'], width, height, color);
	};
	this.bottomLeftCorner = function(width, height, color) {
		return createSquirrel(['topLeft', 'topRight', 'bottomRight'], width, height, color);
	};
	this.bottomRightCorner = function(width, height, color) {
		return createSquirrel(['topLeft', 'topRight', 'bottomLeft'], width, height, color);
	};
})();