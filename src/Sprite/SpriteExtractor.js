import Sprite from './Sprite';
import _ from 'lodash';

export class Pixel {
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

export default class SpriteExtractor {
    constructor(image) {
        if (!(image instanceof Image)) {
            throw `SpriteExtractor requires instance of Image, ${typeof image} given`;
        }

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
    }

    init()
    {
        this.context2D.drawImage(this.image, 0, 0);

        /**
         * @type {ImageData}
         */
        this.imageData = this.context2D.getImageData(0, 0, this.image.width, this.image.height);
    }

    /**
     * @return Sprite[]
     */
    extract() {
        this.init();

        /**
         * @type {Pixel[][]}
         */
        this.pixels = this._resolvePixels();
        this.getColorCount();



        this._iteratePixels((x, y, pixel) => {

        })
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

    getBackgroundColor()
    {
        return _.max(Object.keys(this.getColorCount()), function (o) { return this.getColorCount[o]; });
    }

    /**
     * @return Pixel[][]
     * @private
     */
    _resolvePixels() {
        let pixels = [];
        for (let x = 0; x < this.imageData.width; x++) {
            pixels[x] = [];
            for (let y = 0; y < this.imageData.height; y++) {
                pixels[x][y] = this._getPixel(x, y);
            }
        }

        return pixels;
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