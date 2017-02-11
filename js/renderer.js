define(['util', 'mandala'], function (UTIL, Mandala) {
    'use strict';

    return {
        render : function () {
            this.svg = document.getElementById('robodala-canvas');
            this.center = [250, 250];

            this.renderMandala(new Mandala(248));
        },

        clear : function () {
            this.svg = document.getElementById('robodala-canvas');
            while (this.svg.lastChild) {
                this.svg.removeChild(this.svg.lastChild);
            }
        },

        setColoredMode : function (colored) {
            this.svg = document.getElementById('robodala-canvas');
            if(colored) {
                this.svg.classList.remove('uncolored');
            } else {
                this.svg.classList.add('uncolored');
            }
        },

        /**
         * @private
         */
        renderMandala : function (mandala) {
            for(var i = 0, len = mandala.segments.length; i < len; i++) {
                this.renderSegment(mandala.segments[i], 'segment-'+i);
            }
        },

        /**
         * @private
         */
        renderSegment : function (segment, cls) {
            var gElement, circleElement, pathElement, pathDesc;
            var curPoint;
            var generatedColor;

            generatedColor = 'rgb(';
            generatedColor += Math.round(Math.random()*255) + ',';
            generatedColor += Math.round(Math.random()*255) + ',';
            generatedColor += Math.round(Math.random()*255) + ')';

            // create and append svg elements
            gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            gElement.setAttribute('class', cls || '');
            switch(segment.type) {
                case Mandala.CIRCLE:
                    circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circleElement.setAttribute('r', segment.r);
                    circleElement.setAttribute('cx', this.center[0]);
                    circleElement.setAttribute('cy', this.center[1]);
                    //circleElement.setAttribute('stroke', '#000');
                    circleElement.setAttribute('fill', generatedColor);
                    gElement.appendChild(circleElement);
                    break;
                case Mandala.CURVE:
                    for(var i = 0, len = segment.rotationSteps.length; i < len; i++) {
                        pathDesc = '';
                        for(var pi = 0, plen = segment.rotationSteps[i].points.length; pi < plen; pi++) {
                            curPoint = UTIL.translatePoint2d(segment.rotationSteps[i].points[pi], this.center);
                            if(pi === 0) {
                                pathDesc += 'M';
                            } else if(pi % 3 === 1) {
                                pathDesc += 'C';
                            }
                            pathDesc += curPoint[0] + ',';
                            pathDesc += curPoint[1] + ' ';
                        }
                        pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathElement.setAttribute('fill', 'transparent');
                        pathElement.setAttribute('d', pathDesc);
                        gElement.appendChild(pathElement);
                    }

                    break;
                case Mandala.SHAPE:
                    for(var i = 0, len = segment.rotationSteps.length; i < len; i++) {
                        pathDesc = '';
                        for(var pi = 0, plen = segment.rotationSteps[i].points.length; pi < plen; pi++) {
                            curPoint = UTIL.translatePoint2d(segment.rotationSteps[i].points[pi], this.center);
                            //curPoint = segment.rotationSteps[i].points[pi];
                            if(pi === 0) {
                                pathDesc += 'M';
                            } else if(pi % 2 === 1) {
                                pathDesc += 'Q';
                            }
                            pathDesc += curPoint[0] + ' ';
                            pathDesc += curPoint[1] + ' ';
                        }
                        pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathElement.setAttribute('fill', generatedColor);
                        pathElement.setAttribute('d', pathDesc);
                        gElement.appendChild(pathElement);
                    }
                    break;
                default:
                    console.error('segment type "' + segment.type + '" is unknown');
            }
            this.svg.appendChild(gElement);
        }
    };

});
