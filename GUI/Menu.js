class MenuGUI {
	constructor(menu, display, PositionGetter) {
		const mouseevents = (el, ind) => {
			const self = this;
			el.on('mouseenter', function(){
				$(this).addClass('hovering');
			}).on('mouseleave', function(){
				$(this).removeClass('hovering');
			}).on('click', function(){
				self.changeOption(ind);
			});
			return el;
		};

		this.jQ = $(menu);
		this.display = $(display);
		this.PositionGetter = PositionGetter;
		(() => {
			const allPos = this.PositionGetter.allPositionsName();
			for (let key in allPos) {
				this.jQ.append(mouseevents($('<article class="option">' + allPos[key] + '</article>'), key));
			}
		})();
	}
	changeOption(option) {
		this.display.empty();
		Settings.resetColor();
		this.PositionGetter.setPosition(this.display, option);
	}
}