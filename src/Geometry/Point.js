export default class Point {
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	getX()
	{
		return this.x;
	}

	getY()
	{
		return this.y;
	}

	/**
	 * @param rect Rect
	 * @return {boolean}
	 */
	isWithinBounds(rect)
	{
		return this.x >= rect.getLeft() &&
			this.x < rect.getRight() &&
			this.y >= rect.getTop() &&
			this.y < rect.getBottom()
	}

	offset(x, y)
	{
		return new Point(this.getX() + x, this.getY() + y);
	}
}