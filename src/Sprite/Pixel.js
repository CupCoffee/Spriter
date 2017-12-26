export default class Pixel {
	constructor(r, g, b, a) {
		this._red = r;
		this._green = g;
		this._blue = b;
		this._alpha = a;
	}

	getRed() {
		return this._red;
	}

	getGreen() {
		return this._green;
	}

	getBlue() {
		return this._blue;
	}

	getAlpha() {
		return this._alpha;
	}

	getColor() {
		return (("0" + this.getRed().toString(16)).slice(-2) +
			("0" + this.getGreen().toString(16)).slice(-2) +
			("0" + this.getBlue().toString(16)).slice(-2)).toUpperCase();
	}

	getColorAlpha() {
		return this.getColor() + ("0" + this.getAlpha().toString(16)).slice(-2).toUpperCase();
	}

}