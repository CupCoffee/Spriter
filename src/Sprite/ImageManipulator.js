import Pixel from "./Pixel";

export default class ImageManipulator {
	/**
	 * @param image {Image}
	 */
	constructor(image)
	{
		/**
		 * @type {Image}
		 */
		this.image = image;

		/**
		 * @type {HTMLCanvasElement}
		 */
		this.canvas = document.createElement('canvas');
		this.canvas.width = image.width;
		this.canvas.height = image.height;

		/**
		 * @type {CanvasRenderingContext2D|WebGLRenderingContext}
		 */
		this.context2D = this.canvas.getContext('2d');
		this.context2D.drawImage(this.image, 0, 0);

		/**
		 * @type {ImageData}
		 */
		this.imageData = this.context2D.getImageData(0, 0, this.image.width, this.image.height);

		this._resolvePixels();
	}

	_iteratePixels(callback) {
		for (let x = 0; x < this.pixels.length; x++) {
			for (let y = 0; y < this.pixels[x].length; y++) {
				callback(x, y, this.pixels[x][y]);
			}
		}
	}

	getColorCount()
	{
		if (typeof this.pixelCountByColor === 'undefined') {
			this.pixelCountByColor = {};

			this._iteratePixels((x, y, pixel) => {
				if (typeof this.pixelCountByColor[pixel.getColor()] === 'undefined') {
					this.pixelCountByColor[pixel.getColor()] = 1;
					return;
				}

				this.pixelCountByColor[pixel.getColor()]++;
			});
		}

		return this.pixelCountByColor;
	}



	/**
	 * @return Pixel[][]
	 * @private
	 */
	_resolvePixels() {
		this.pixels = [];
		for (let x = 0; x < this.imageData.width; x++) {
			this.pixels[x] = [];
			for (let y = 0; y < this.imageData.height; y++) {
				this.pixels[x][y] = this._getPixel(x, y);
			}
		}

		return this.pixels;
	}

	/**
	 * @param x int
	 * @param y int
	 * @return Pixel
	 * @private
	 */
	_getPixel(x, y) {
		if (x < 0 || x > this.imageData.width || y < 0 || y > this.imageData.height) {
			throw `Pixel position out of bounds`;
		}

		let red = this.imageData.data[((y * (this.imageData.width * 4)) + (x * 4))];
		let green = this.imageData.data[((y * (this.imageData.width * 4)) + (x * 4)) + 1];
		let blue = this.imageData.data[((y * (this.imageData.width * 4)) + (x * 4)) + 2];
		let alpha = this.imageData.data[((y * (this.imageData.width * 4)) + (x * 4)) + 3];

		return new Pixel(red, green, blue, alpha);
	}

	getPixels()
	{
		return this.pixels || [];
	}
}