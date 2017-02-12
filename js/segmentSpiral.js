define(['util'], function (UTIL) {
    'use strict';

    var SegmentSpiral = function (innerRadius, outerRadius, numSides, startAtAngle, degreesToRepeatAfter, isTopSegment) {
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.numSides = numSides;
        this.startAtAngle = startAtAngle;
        this.degreesToRepeatAfter = degreesToRepeatAfter;
        this.isTopSegment = isTopSegment;
        this.rotationSteps = [];

        // make sure the spirals look ok
        if(this.outerRadius < 100 || this.outerRadius - this.innerRadius < 30) {
            this.numSides = Math.min(this.numSides, 8);
        }
        else if(this.outerRadius < 200 || this.outerRadius - this.innerRadius < 40) {
            this.numSides = Math.min(this.numSides, 12);
        }

        this.shapeHeight = 2 * this.innerRadius * Math.tan(Math.PI / this.numSides);
        this.shapeWidth = 0; // calculated later

        this.createRandomizedSpiral();
    };

    /**
     * @private
     */
    SegmentSpiral.prototype.createRandomizedSpiral = function () {
        var isSingle;
        var isReversed;
        var isClockwise;
        var numRevs;
        var widthFactor;
        var halfWidth, halfHeight;
        var shapeRadius;
        var cx, cy;
        var basePoints1, basePoints2;
        var points1, points2;
        var curPoint;
        var theta;
        var rot;
        var sideways;

        halfHeight = this.shapeHeight * .5;

        isSingle = Math.random() > 0.5 ? true : false;
        isReversed = !this.isTopSegment && Math.random() > 0.5 ? true : false;
        isClockwise = Math.random() > 0.5;
        numRevs = Math.floor(Math.random() * 3) + 1;

        if(this.shapeHeight < 30) {
            numRevs = Math.min(numRevs, 1);
        }

        if(isSingle) { // single spiral
            // use between 90% and 95% of the available space
            widthFactor = Math.random() * .05 + .9;
            this.shapeWidth = (this.outerRadius - this.innerRadius) * widthFactor;
            halfWidth = this.shapeWidth * .5;
            shapeRadius = Math.min(halfWidth, halfHeight);

            if(isReversed) {
                cx = this.outerRadius - shapeRadius;
            } else {
                cx = this.innerRadius + shapeRadius;
            }
            cy = 0;
            basePoints1 = this.generateBasicSpiralPoints([cx, cy], isClockwise, isReversed, numRevs, shapeRadius, 0);

        } else { // double spiral
            // use between 90% and 95% of the available space
            widthFactor = Math.random() * .05 + .9;
            this.shapeWidth = (this.outerRadius - this.innerRadius) * widthFactor;
            halfWidth = this.shapeWidth * .5;
            shapeRadius = Math.min(halfWidth, halfHeight * .5);
            sideways = Math.random() > .5;
            rot = 0;

            cy = isClockwise ? shapeRadius : -shapeRadius;
            if(sideways) {
                cx = this.innerRadius + .5 * (this.outerRadius - this.innerRadius);
                cy *= .9;
                rot = Math.random() * 360;
            } else if(isReversed) {
                cx = this.outerRadius - shapeRadius;
            } else {
                cx = this.innerRadius + shapeRadius;
            }

            basePoints1 = this.generateBasicSpiralPoints([cx, cy], isClockwise, isReversed, numRevs, shapeRadius, rot);
            basePoints2 = [];
            for(var pi = 0, plen = basePoints1.length; pi < plen; pi++) {
                curPoint = UTIL.reflectPoint2dXAxis(basePoints1[pi]);
                basePoints2.push(curPoint);
            }
        }

        // create rotationSteps based on the 0° variant
        for(var angle = this.startAtAngle;
                angle < this.startAtAngle + 360;
                angle += this.degreesToRepeatAfter) {
            theta = UTIL.degToRad(angle);
            if(basePoints1 && basePoints1.length > 0) {
                points1 = [];
                for(var pi = 0, plen = basePoints1.length; pi < plen; pi++) {
                    curPoint = UTIL.rotatePoint2d(basePoints1[pi], theta);
                    points1.push(curPoint);
                }
            }
            if(basePoints2 && basePoints2.length > 0) {
                points2 = [];
                for(var pi = 0, plen = basePoints2.length; pi < plen; pi++) {
                    curPoint = UTIL.rotatePoint2d(basePoints2[pi], theta);
                    points2.push(curPoint);
                }
            }
            this.rotationSteps.push({
                angle : angle,
                points1 : points1,
                points2 : points2
            });
        }
    };

    /**
     * @private
     */
    SegmentSpiral.prototype.generateBasicSpiralPoints = function (center, clockwise, reversed, numRevs, maxRadius, rotAngle) {
        var dir = reversed ? 1 : -1;
        var points = [];
        var revDist;
        var circDist;
        var numPoints;
        var theta;
        var step;
        var x, y;
        var curPoint;

        rotAngle = rotAngle || 0;
        numPoints = numRevs * (Math.round(Math.random(12)) + 12);
        step = (2 * Math.PI * numRevs) / numPoints;
        circDist = (maxRadius / numRevs) / (2 * Math.PI);

        for(var i = 0; i <= numPoints; i++) {
            theta = dir * step * i;
            curPoint = [
                circDist * theta * Math.cos(theta),
                circDist * theta * Math.sin(theta)
            ];
            curPoint = UTIL.translatePoint2d(UTIL.rotatePoint2d(curPoint, rotAngle), center);
            if(clockwise) {
                curPoint = UTIL.reflectPoint2dXAxis(curPoint);
            }
            points.push(curPoint);
        }
        return points;
    };


    return SegmentSpiral;
});
