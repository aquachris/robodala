define(['util'], function (UTIL) {
    'use strict';

    var SegmentShape = function (innerRadius, outerRadius, numSides) {
        this.innerRadius = innerRadius || 100;
        this.outerRadius = outerRadius || 150;
        this.numSides = numSides || 8;
        this.shapeWidth = 0; // to be determined later
        this.shapeHeight = 0; // to be determined later
        this.points = []; // to be determined later
        if(true) {
            this.adaptFixedShape();
        } else {
            this.generateBasicShape();
        }

        var shape;
        var rotationSteps;
        var theta;
        var curPoint;

        if(this.innerRadius < 10) {
            this.innerRadius = 10;
        }
        if(this.startAtAngle === undefined) {
            this.startAtAngle = 0;
        }
        if(this.degreesToRepeatAfter === undefined) {
            this.degreesToRepeatAfter = 0;
        }

        // initialize rotation steps
        this.rotationSteps = [{
            angle : this.startAtAngle,
            points : []
        }];
        if(this.degreesToRepeatAfter > 0) {
            for(var angle = degreesToRepeatAfter; angle < 360; angle += degreesToRepeatAfter) {
                rotationSteps.push({
                    angle : startAtAngle + angle,
                    points : []
                })
            }
        }

        // populate rotation steps
        for(var i = 0, len = this.rotationSteps.length; i < len; i++) {
            theta = UTIL.degToRad(this.rotationSteps[i].angle);
            for(var pi = 0, plen = this.points.length; pi < plen; pi++) {
                curPoint = UTIL.rotatePoint2d(this.points[pi], theta);
                this.rotationSteps[i].points.push(curPoint);
            }
        }
    };

    // a collection of fixed shapes scaled to 100 x 100
    // all shapes stretch in the positive x direction and are centered
    // around 0 in the y direction
    SegmentShape.FIXED = [{
        name : 'heart',
        points : [[0,0],[25,30],[50,42],[80,55],[92,40],[110,15],[75,0],[110,-15],[92,-40],[80,-55],[50,-42],[25,-30],[0,0]]
    }];

    SegmentShape.prototype.adaptFixedShape = function () {
        var curPoint;
        var rot = Math.random() < .5 ? 0 : Math.PI; //UTIL.degToRad(Math.random() * 60 - 30);
        this.shapeWidth = .9 * (this.outerRadius - this.innerRadius);
        this.shapeHeight = this.shapeWidth;

        // determine numSides
        this.numSides = Math.ceil(Math.PI / Math.atan(.5 * this.shapeHeight / this.innerRadius));

        var shapeIdx = Math.floor(Math.random() * SegmentShape.FIXED.length);
        var fixedShape = SegmentShape.FIXED[shapeIdx];
        var scalingFactor = 0.01 * this.shapeHeight;

        // create points for the basic shape
        for(var i = 0, len = fixedShape.points.length; i < len; i++) {
            curPoint = UTIL.translatePoint2d(fixedShape.points[i], [-50, 0]);
            curPoint = UTIL.rotatePoint2d(curPoint, rot);
            curPoint = UTIL.translatePoint2d(curPoint, [50, 0]);
            curPoint = UTIL.scalePoint2d(curPoint, [scalingFactor, scalingFactor]);
            this.points.push(UTIL.translatePoint2d(curPoint, [this.innerRadius + .05 * (this.outerRadius - this.innerRadius), 0]));
        }
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
