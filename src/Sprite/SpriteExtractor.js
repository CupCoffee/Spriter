import Sprite from './Sprite';
import _ from 'lodash';
import ImageManipulator from "./ImageManipulator";
import Rect from "../Geometry/Rect";
import Point from "../Geometry/Point";

export default class SpriteExtractor {
    constructor(image) {
        if (!(image instanceof Image)) {
            throw `SpriteExtractor requires instance of Image, ${typeof image} given`;
        }

	    /**
	     * @type {Image}
	     */
	    this.image = image;

        this.manipulator = new ImageManipulator(image);

    }

    /**
     * @return Sprite[]
     */
    extract() {
        /**
         * @type {Pixel[][]}
         */
        this.pixels = this.manipulator.getPixels();
        this.manipulator.getColorCount();

        for(let x = 0; x < this.pixels.length; x++) {
        	for(let y = 0; y < this.pixels[x].length; y++) {
        		let sprite;
        		if (sprite = this.resolveSprite(new Point(x, y))) {
        			console.log(sprite);
        			debugger;
		        }
	        }
        }
    }

	getBackgroundColor()
	{
		if (typeof this.backgroundColor === 'undefined') {
			this.backgroundColor = _.maxBy(Object.keys(this.manipulator.getColorCount()), (o) => { return this.manipulator.getColorCount()[o]; });
		}

		return this.backgroundColor;
	}

	/**
	 * @param pixel {Pixel}
	 */
	isBackgroundPixel(pixel)
	{
		return this.getBackgroundColor() === pixel.getColor();
	}

	/**
	 * @param point {Point}
	 * @returns {Rect}
	 */
	resolveSprite(point)
	{
		let originPixel = this.getPixel(point);

		if (!originPixel) return;
		if (this.isBackgroundPixel(originPixel)) return;

		let spriteBounds = new Rect();

		debugger;

		/**
		 * @type {Point[]}
		 */
		let queue = [];

		queue.push(point);

		let i = 0;
		while (i < queue.length) {
			let west = queue[i].offset(-1, 0);
			let east = queue[i].offset(1, 0);

			while (west.isWithinBounds(this.getImageBounds()) && !this.isBackgroundPixel(this.getPixel(west))) {
				west = west.offset(-1, 0);
			}

			while (east.isWithinBounds(this.getImageBounds()) && !this.isBackgroundPixel(this.getPixel(east))) {
				east = east.offset(1, 0);
			}

			if (!spriteBounds.left || west.getX() < spriteBounds.left) {
				spriteBounds.left = west.getX();
			}

			if (!spriteBounds.right || east.getX() > spriteBounds.right) {
				spriteBounds.right = east.getX();
			}

			for (let x = west.getX(); x < east.getY(); x++) {
				let node = new Point(x, point.getY());
				let north = node.offset(0, -1);

				if (north.isWithinBounds(this.getImageBounds()) && !this.isBackgroundPixel(this.getPixel(north))) {
					queue.push(north);

					if (!spriteBounds.top || north.getY() < spriteBounds.top) {
						spriteBounds.top = north.getY();
					}
				}

				let south = node.offset(0, 1);
				if (south.isWithinBounds(this.getImageBounds()) && !this.isBackgroundPixel(this.getPixel(south))) {
					queue.push(south);

					if (!spriteBounds.bottom || south.getY() > spriteBounds.bottom) {
						spriteBounds.bottom = south.getY();
					}
				}
			}

			i++;
		}

		return spriteBounds;
	}

	/**
	 * @return Rect
	 */
	getImageBounds()
	{
		if (typeof this.imageBounds === 'undefined')
		{
			this.imageBounds = new Rect();
			this.imageBounds.left = 0, this.imageBounds.top = 0, this.imageBounds.right = this.image.width, this.imageBounds.bottom = this.image.height;
		}

		return this.imageBounds;
	}

	/**
	 * @param point {Point}
	 */
	getPixel(point)
	{
		if (point.isWithinBounds(this.getImageBounds())) {
			return this.pixels[point.getX()][point.getY()];
		}

		return null;
	}
}