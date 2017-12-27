define(['util', 'segmentCurve', 'segmentShape', 'segmentSpiral'],
    function (UTIL, SegmentCurve, SegmentShape, SegmentSpiral) {
    'use strict';

    var Mandala = function (maxOuterRadius) {
        this.numSegments = Math.round(Math.random() * 4) + 6;
        //this.numSegments = 3;
        this.segments = [];

        var sideOptions = [10, 12, 16, 20, 24, 32];
        var curRadius = maxOuterRadius;
        var segmentThickness = maxOuterRadius / this.numSegments;
        var curThickness;
        var numSidesIdx;
        var curNumSides;
        var shapeRand, thicknessRand;
        var angle, angleOffset;

        while(curRadius > 0) {
            console.group('adding new segment at radius ' + curRadius);
            numSidesIdx = Math.floor(Math.random()*sideOptions.length);
            if(curRadius > 200) {
                numSidesIdx = Math.min(numSidesIdx + 2, sideOptions.length - 1);
            } else if (curRadius < 100){
                numSidesIdx = Math.max(numSidesIdx - 2, 0);
            } else {
                numSidesIdx = Math.max(numSidesIdx - 1, 0);
            }
            curNumSides = sideOptions[numSidesIdx];
            shapeRand = Math.random();
            thicknessRand = Math.random();

            angle = 360 / curNumSides;
            angleOffset = Math.random() * angle;

            // deviate in segment thickness
            curThickness = Math.min(segmentThickness * (1 + thicknessRand), curRadius);
            // option 1: a single shape
            if(shapeRand >= 0.75) {
                console.log('creating a single shape');
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, 0, angle);
            // option 2: two alternating shapes
            } else if(shapeRand >= 0.30)  {
                console.log('creating two shapes');
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, 0, angle * 2, Math.random() < .5 ? 0 : Math.PI);
                this.createSegment(curRadius - curThickness, curRadius,
                    curNumSides, angle, angle * 2, Math.random() < .5 ? 0 : Math.PI);
            } else if(shapeRand >= 0.15) {
                console.log('creating a spiral');
                this.createSpiralSegment(curRadius - curThickness, curRadius,
                    curNumSides, 0, angle, this.segments.length === 0);
            } else {
                if(this.segments.length > 0) {
                    console.log('creating a curve');
                    this.createCurveSegment(curRadius - curThickness, curRadius, curNumSides);
                }
            }
            curRadius -= curThickness;

            if(curRadius > 0) {
                this.createCircleSegment(curRadius);
            }
            console.groupEnd();
        }
    };

    Mandala.SHAPE = 'shape';
    Mandala.CURVE = 'curve';
    Mandala.CIRCLE = 'circle';
    Mandala.SPIRAL = 'spiral';

    Mandala.prototype.createCircleSegment = function (radius) {
        console.log('creating circle segment, radius: ' + radius);
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
        outerRadius = 0.9 * outerRadius;

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
        console.log('create spiral', innerRadius, outerRadius, numSides, startAtAngle, degreesToRepeatAfter, isTopSegment);
        var spiralShape = new SegmentSpiral(innerRadius, outerRadius, numSides, startAtAngle, degreesToRepeatAfter, isTopSegment);

        this.segments.push({
            type : Mandala.SPIRAL,
            rotationSteps : spiralShape.rotationSteps
        });
    };

    return Mandala;
});
