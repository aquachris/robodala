(function () {
    'use strict';

    var HUMANDALA = {

        degToRad : function (deg) {
            return deg * Math.PI / 180;
        },

        radToDeg : function (rad) {
            return rad * 180 / Math.PI;
        },

        /**
         * m2x2 =
         * [ 0, 1
         *   2, 3 ]
         * m1x2 =
         * [ 0,
         *   1 ]
         */
        matrixMultiply2d : function (m2x2, m1x2) {
            return [
                m2x2[0] * m1x2[0] + m2x2[1] * m1x2[1],
                m2x2[2] * m1x2[0] + m2x2[3] * m1x2[1]
            ];
        },

        /**
         * Rotation around origin
         * theta in radians
         */
        rotatePoint2d : function (point, theta) {
            return this.matrixMultiply2d(
                [ Math.cos(theta),-Math.sin(theta),
                  Math.sin(theta), Math.cos(theta) ],
                point
            );
        },

        scalePoint2d : function (point, scaleBy) {
            return this.matrixMultiply2d(
                [ scaleBy[0], 0,
                  0, scaleBy[1] ],
                point
            );
        },


        translatePoint2d : function (point, translateBy) {
            return [point[0] + translateBy[0], point[1] + translateBy[1]];
        },

        reflectPoint2dXAxis : function (point) {
            return this.matrixMultiply2d(
                [ 1, 0,
                  0, -1 ],
                point
            );
        },

        reflectPoint2dYAxis : function (point) {
            return this.matrixMultiply2d(
                [ -1, 0,
                   0, 1 ],
                point
            )
        },

        render : function () {
            var svg = document.getElementById('humandala-canvas');
            var center = [300, 150];

            var points = [[0, 40]];
            var numPoints = 2 * Math.floor(Math.random()*5) + 1;
            var unit = 50 / (numPoints + 1);
            var deviation;
            var x, y;

            // initial points
            for(var i = 0; i < numPoints; i++) {
                deviation = unit * -.45 + Math.random() * unit * .9;
                //console.log('deviation ' + i + ' is ' + deviation + ' (unit '+unit+')');
                x = Math.round((i+1) * unit + deviation);
                y = Math.round(Math.random() * 40);

                points.push([x, y]);
            }
            points.push([50,0]);

            // mirrored version (start from the next to last one)
            for(var i = points.length - 2; i >= 0; i--) {
                points.push(this.reflectPoint2dXAxis(points[i]));
            }

            var rotatedPaths = [{
                theta : 0,
                points : points
            }];

            // create rotated versions
            for(var theta = 90; theta < 360; theta += 90) {
                var obj = {
                    theta : theta,
                    points : []
                };
                for(var j = 0, len = points.length; j < len; j++) {
                    obj.points.push(this.rotatePoint2d(points[j], this.degToRad(theta)));
                }
                rotatedPaths.push(obj);
            }

            // trace paths
            var pathDesc, pArr, pathElement;
            for(var pi = 0, pLen = rotatedPaths.length; pi < pLen; pi++) {
                pArr = rotatedPaths[pi].points;
                pathDesc = 'M'+this.translatePoint2d(pArr[0], center)[0]+' '+this.translatePoint2d(pArr[0], center)[1] + ' ';
                for(var i = 1, len = pArr.length; i < len; i++) {
                    if(i % 2 === 1) {
                        pathDesc += 'Q';
                    }
                    pathDesc += this.translatePoint2d(pArr[i], center)[0] + ' ' + this.translatePoint2d(pArr[i], center)[1] + ' ';
                }
                pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                pathElement.setAttribute('d', pathDesc);
                svg.appendChild(pathElement);
            }


            //newElement.style.stroke = '#000';
            //newElement.style.strokeWidth = '1px';
        }
    };

    HUMANDALA.render();

})();
