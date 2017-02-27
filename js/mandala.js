define(['util', 'segmentCurve', 'segmentShape', 'segmentSpiral'],
    function (UTIL, SegmentCurve, SegmentShape, SegmentSpiral) {
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
            if(rand1 >= .75) {
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, 0, angle);
            // option 2: two alternating shapes
            } else if(rand1 >= .30)  {
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, angleOffset, 2 * angle);
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, angleOffset + angle, 2 * angle);
            } else if(rand1 >= .15) {
                this.createSpiralSegment(curRadius - curThickness, curRadius,
                    curNumSides, 0, angle, this.segments.length === 0);
            } else {
                if(this.segments.length > 0) {
                    this.createCurveSegment(curRadius - curThickness, curRadius, curNumSides);
                }
            }
            curRadius -= curThickness;

            if(curRadius > 0) {
                this.createCircleSegment(curRadius);
            }
        }
    };

    Mandala.SHAPE = 'shape';
    Mandala.CURVE = 'curve';
    Mandala.CIRCLE = 'circle';
    Mandala.SPIRAL = 'spiral';

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
        outerRadius = .9 * outerRadius;

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
        var shape = new SegmentShape(innerRadius, outerRadius, numSides, startAtAngle, degreesToRepeatAfter);

        this.segments.push({
            type : Mandala.SHAPE,
            rotationSteps : shape.rotationSteps
        });
    };

    Mandala.prototype.createSpiralSegment = function (innerRadius, outerRadius, numSides, startAtAngle, degreesToRepeatAfter, isTopSegment) {
        var spiralShape = new SegmentSpiral(innerRadius, outerRadius, numSides, startAtAngle, degreesToRepeatAfter, isTopSegment);

        this.segments.push({
            type : Mandala.SPIRAL,
            rotationSteps : spiralShape.rotationSteps
        });
    };

    return Mandala;
});
