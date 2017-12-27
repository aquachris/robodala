define(['util'], function (UTIL) {
    'use strict';

    var SegmentShape = function (innerRadius, outerRadius, numSides, startAtAngle, degreesToRepeatAfter, shapeRotation) {
        this.innerRadius = innerRadius || 0;
        this.outerRadius = outerRadius || 150;
        this.numSides = numSides || 8;
        this.startAtAngle = startAtAngle || 0;
        this.degreesToRepeatAfter = degreesToRepeatAfter || 90;
        this.shapeRotation = shapeRotation; // can be undefined
        this.shapeWidth = 0; // to be determined later
        this.shapeHeight = 0; // to be determined later
        this.points = []; // to be determined later

        if(this.innerRadius < 1) {
            this.innerRadius = 1;
        }

        // roll a die: use a fixed shape or generate a random one?
        if(Math.random() < .3) {
            this.adaptFixedShape();
        } else {
            this.generateBasicShape();
        }

        var shape;
        var rotationSteps;
        var theta;
        var curPoint;

        // initialize rotation steps
        this.rotationSteps = [{
            angle : this.startAtAngle,
            points : []
        }];
        if(this.degreesToRepeatAfter > 0) {
            for(var angle = this.degreesToRepeatAfter; angle < 360; angle += this.degreesToRepeatAfter) {
                this.rotationSteps.push({
                    angle : this.startAtAngle + angle,
                    points : []
                });
            }
        }
        console.log(this.rotationSteps.length + ' rotation steps');

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
    }, {
        name : 'cross',
        points : [[10,0],[10,10],[0,20],[40,10],[30,50],[70,50],[60,10],[100,20],[100,0],[50,0],[10,0]]
    }];

    SegmentShape.prototype.adaptFixedShape = function () {
        var curPoint, theta, rot;

        if(this.shapeRotation !== undefined) {
            rot = this.shapeRotation;
        } else {
            // shape is either not rotated at all or rotated by 180 degrees (i.e. upside down)
            rot = Math.random() < 0.5 ? 0 : Math.PI; //UTIL.degToRad(Math.random() * 60 - 30);
        }

        if(this.numSides === 0) {
            this.shapeWidth = 0.9 * (this.outerRadius - this.innerRadius);
            this.shapeHeight = this.shapeWidth;
            this.numSides = Math.min(100, Math.abs(Math.ceil(Math.PI / Math.atan(0.5 * this.shapeHeight / this.innerRadius))));
        } else if(this.numSides === 1) {
            this.shapeWidth = 0.9 * (this.outerRadius - this.innerRadius);
            this.shapeHeight = this.shapeWidth;
        } else {
            theta = Math.PI * 2 / this.numSides;
            this.shapeWidth = this.innerRadius * 2 * Math.sin(theta / 2); // 2 * sin(theta / 2) is the "chord"
            this.shapeWidth = Math.min(this.shapeWidth, this.outerRadius - this.innerRadius);
            this.shapeWidth *= 0.9;
            this.shapeHeight = this.shapeWidth;
        }

        var shapeIdx = Math.floor(Math.random() * SegmentShape.FIXED.length);
        var fixedShape = SegmentShape.FIXED[shapeIdx];
        var scalingFactor = 0.01 * this.shapeHeight;

        // create points for the basic shape
        for(var i = 0, len = fixedShape.points.length; i < len; i++) {
            curPoint = UTIL.translatePoint2d(fixedShape.points[i], [-50, 0]);
            curPoint = UTIL.rotatePoint2d(curPoint, rot);
            curPoint = UTIL.translatePoint2d(curPoint, [50, 0]);
            curPoint = UTIL.scalePoint2d(curPoint, [scalingFactor, scalingFactor]);
            this.points.push(UTIL.translatePoint2d(curPoint, [this.innerRadius + 0.05 * (this.outerRadius - this.innerRadius), 0]));
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
        this.points.push([this.innerRadius * .95, halfHeight]);
        for(var i = 0; i < numPoints; i++) {
            deviation = pointUnit * -.45 + Math.random() * pointUnit * .9;
            x = pointUnit * (i + 1) + deviation;
            y = Math.random() * halfHeight;
            this.points.push([this.innerRadius * .95 + x, y]);
        }
        this.points.push([this.innerRadius * .95 + this.shapeWidth, 0]);

        // x-mirrored version of the points
        for(var i = this.points.length - 2; i >= 0; i--) {
            this.points.push(UTIL.reflectPoint2dXAxis(this.points[i]));
        }
    };


    return SegmentShape;
});
