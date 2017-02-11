define(['util', 'segmentCurve', 'segmentShape'], function (UTIL, SegmentCurve, SegmentShape) {
    'use strict';

    var Mandala = function (maxOuterRadius) {
        this.numSegments = Math.round(Math.random() * 4) + 6;
        this.segments = [];

        var sideOptions = [10, 12, 16, 20, 24, 32];
        var curRadius = maxOuterRadius;
        var segmentThickness = maxOuterRadius / this.numSegments;
        var curThickness;
        var numSidesIdx;
        var curNumSides;
        var rand1, rand2;
        var angle, angleOffset;

        while(curRadius > 0) {
            numSidesIdx = Math.floor(Math.random()*sideOptions.length);
            if(curRadius > 200) {
                numSidesIdx = Math.min(numSidesIdx + 2, sideOptions.length - 1);
            } else if (curRadius < 100){
                numSidesIdx = Math.max(numSidesIdx - 2, 0);
            } else {
                numSidesIdx = Math.max(numSidesIdx - 1, 0);
            }
            curNumSides = sideOptions[numSidesIdx];
            rand1 = Math.random();
            rand2 = Math.random();

            angle = 360 / curNumSides;
            angleOffset = Math.random() * angle;

            // deviate in segment thickness
            curThickness = Math.min(segmentThickness * (1 + rand2), curRadius);
            // option 1: a single shape
            if(rand1 >= .6) {
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, 0, angle);
            // option 2: two alternating shapes
            } else if(rand1 >= .15)  {
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, angleOffset, 2 * angle);
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, angleOffset + angle, 2 * angle);
            } else {
                if(this.segments.length > 0) {
                    this.createCurveSegment(curRadius - curThickness, curRadius, curNumSides);
                }
            }
            curRadius -= curThickness;

            if(curRadius > 0) {
                this.createCircleSegment(curRadius * 1.05);
            }
        }
    };

    Mandala.SHAPE = 'shape';
    Mandala.CURVE = 'curve';
    Mandala.CIRCLE = 'circle';

    Mandala.prototype.createCircleSegment = function (radius) {
        this.segments.push({
            type : Mandala.CIRCLE,
            r : radius
        });
    };

    Mandala.prototype.createCurveSegment = function (innerRadius, outerRadius, numSides) {
        var points = [];
        var curve;
        var rotationSteps;
        var angleIncrement;
        var theta;
        var curStep;

        innerRadius = 1.10 * Math.max(innerRadius, 10);
        outerRadius = .98 * outerRadius;

        curve = new SegmentCurve(innerRadius, outerRadius, numSides);
        angleIncrement = 360 / numSides;

        // initialize rotation steps
        rotationSteps = [];
        for(var angle = 0; angle < 360; angle += angleIncrement) {
            curStep = {
                angle : angle,
                points : []
            };
            theta = UTIL.degToRad(angle);
            for(var pi = 0, plen = curve.points.length; pi < plen; pi++) {
                curStep.points.push(UTIL.rotatePoint2d(curve.points[pi],theta));
            }
            rotationSteps.push(curStep);
        }
        this.segments.push({
            type: Mandala.CURVE,
            rotationSteps : rotationSteps
        });
    };

    Mandala.prototype.createSegment = function(innerRadius, outerRadius, numSides, startAtAngle, degreesToRepeatAfter) {
        var shape;
        var rotationSteps;
        var theta;
        var curPoint;

        if(innerRadius < 10) {
            innerRadius = 10;
        }
        if(startAtAngle === undefined) {
            startAtAngle = 0;
        }
        if(degreesToRepeatAfter === undefined) {
            degreesToRepeatAfter = 0;
        }
        shape = new SegmentShape(innerRadius, outerRadius, numSides);

        // initialize rotation steps
        rotationSteps = [{
            angle : startAtAngle,
            points : []
        }];
        if(degreesToRepeatAfter > 0) {
            for(var angle = degreesToRepeatAfter; angle < 360; angle += degreesToRepeatAfter) {
                rotationSteps.push({
                    angle : startAtAngle + angle,
                    points : []
                })
            }
        }

        // populate rotation steps
        for(var i = 0, len = rotationSteps.length; i < len; i++) {
            theta = UTIL.degToRad(rotationSteps[i].angle);
            for(var pi = 0, plen = shape.points.length; pi < plen; pi++) {
                curPoint = UTIL.rotatePoint2d(shape.points[pi], theta);
                rotationSteps[i].points.push(curPoint);
            }
        }

        this.segments.push({
            type : Mandala.SHAPE,
            rotationSteps : rotationSteps
        });
    };

    return Mandala;
});