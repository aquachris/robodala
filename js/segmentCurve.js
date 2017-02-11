define(['util'], function (UTIL) {
    'use strict';

    var SegmentCurve = function (innerRadius, outerRadius, numSides) {
        this.innerRadius = innerRadius || 100;
        this.outerRadius = outerRadius || 150;
        this.numSides = numSides || 8;
        this.shapeWidth = 0; // to be determined later
        this.shapeHeight = 0; // to be determined later
        this.points = []; // to be determined later
        this.generateBasicCurve();
    };

    /**
     * @private
     */
    SegmentCurve.prototype.generateBasicCurve = function () {
        var halfHeight;

        // calculate basic shape height / width
        this.shapeWidth = this.outerRadius - this.innerRadius;
        this.shapeHeight = 2 * this.innerRadius * Math.tan(Math.PI / this.numSides);

        halfHeight = this.shapeHeight * .5;

        // basic curve shape
        this.points.push([this.innerRadius,halfHeight]);
        this.points.push([this.innerRadius + 5,halfHeight*.5]);
        this.points.push([this.innerRadius + this.shapeWidth - 5,halfHeight*.5]);
        this.points.push([this.innerRadius + this.shapeWidth,0]);
        this.points.push([this.innerRadius + this.shapeWidth -5,-halfHeight*.5]);
        this.points.push([this.innerRadius + 5,-halfHeight*.5]);
        this.points.push([this.innerRadius,-halfHeight]);
    };

    return SegmentCurve;
});
