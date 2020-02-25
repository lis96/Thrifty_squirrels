const Settings = new (function(obj){
	let animateSpeed = obj.animateSpeed;
	let colorList = obj.colorList;
	let colorUsed = 0;
	this.getAnimateSpeed = function() {
		return animateSpeed;
	}
	this.setAnimateSpeed = function(val) {
		val = Number(val);
		if (val !== val) {
			throw 'Trying to set wrong Settings:animateSpeed';
		}
		animateSpeed = val;
	}
	this.getColorListElement = function(ind) {
		return colorList[ind].slice();
	}
	this.setColorListElement = function(ind, color) {
		colorList[ind] = color.slice();
	}
	this.getFollowingColor = function() {
		return this.getColorListElement(colorUsed++);
	}
})({
	animateSpeed: 400,
	colorList: [
		'#FAA',
		'#AFA',
		'#AAF',
		'#FFA',
		'#FAF',
		'#AFF'
	]
});