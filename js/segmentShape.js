define(['util'], function (UTIL) {
    'use strict';

    var SegmentShape = function (innerRadius, outerRadius, numSides) {
        this.innerRadius = innerRadius || 100;
        this.outerRadius = outerRadius || 150;
        this.numSides = numSides || 8;
        this.shapeWidth = 0; // to be determined later
        this.shapeHeight = 0; // to be determined later
        this.points = []; // to be determined later
        this.generateBasicShape();
    };

    /**
     * @private
     */
    SegmentShape.prototype.generateBasicShape = function () {
        var halfHeight, numPoints, pointUnit, deviation, x, y;

        // calculate basic shape height / width
        this.shapeWidth = this.outerRadius - this.innerRadius;
        this.shapeHeight = 2 * this.innerRadius * Math.tan(Math.PI / this.numSides);
        //console.log(this.shapeWidth, this.shapeHeight, this.innerRadius, Math.tan(Math.PI / this.numSides), Math.PI / this.numSides);

        halfHeight = this.shapeHeight * .5;

        numPoints = 2 * Math.floor(Math.random() * 5) + 1;
        pointUnit = this.shapeWidth / (numPoints + 1);

        // initial points
        this.points.push([this.innerRadius, halfHeight]);
        for(var i = 0; i < numPoints; i++) {
            deviation = pointUnit * -.45 + Math.random() * pointUnit * .9;
            x = pointUnit * (i + 1) + deviation;
            y = Math.random() * halfHeight;
            this.points.push([this.innerRadius + x, y]);
        }
        this.points.push([this.innerRadius + this.shapeWidth, 0]);

        // x-mirrored version of the points
        for(var i = this.points.length - 2; i >= 0; i--) {
            this.points.push(UTIL.reflectPoint2dXAxis(this.points[i]));
        }
    };

    return SegmentShape;
});
