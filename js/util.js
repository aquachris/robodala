define([], function () {
    return {

        /**
         * @param deg {float} angle in degrees
         * @param {float} angle in radians
         */
        degToRad : function (deg) {
            return deg * Math.PI / 180;
        },

        /**
         * @param rad {float} angle in radians
         * @returns {float} angle in degrees
         */
        radToDeg : function (rad) {
            return rad * 180 / Math.PI;
        },

        /**
         * The matrices are arrays going line-by-line, i.e.:
         * m2x2 =
         * [ 0, 1
         *   2, 3 ]
         * m1x2 =
         * [ 0,
         *   1 ]
         *
         * @param m2x2 {Array} transformation matrix
         * @param m1x2 {Array} point
         */
        matrixMultiply2d : function (m2x2, m1x2) {
            return [
                m2x2[0] * m1x2[0] + m2x2[1] * m1x2[1],
                m2x2[2] * m1x2[0] + m2x2[3] * m1x2[1]
            ];
        },

        /**
         * Rotation around origin
         * @param point {Array} point to rotate
         * @param theta {float} rotation angle in radians
         */
        rotatePoint2d : function (point, theta) {
            return this.matrixMultiply2d(
                [ Math.cos(theta),-Math.sin(theta),
                  Math.sin(theta), Math.cos(theta) ],
                point
            );
        },

        /**
         * "Scaling" i.e. translation of a point away from or towards the origin
         * @param point {Array} point to translate
         * @param scaleBy {Array} scale factor in horizontal, vertical direction
         */
        scalePoint2d : function (point, scaleBy) {
            return this.matrixMultiply2d(
                [ scaleBy[0], 0,
                  0, scaleBy[1] ],
                point
            );
        },

        /**
         * Translation of a point by a given vector
         * @param point {Array} point to translate
         * @param translateBy {Array} absolute units by which to translate (in x, y direction)
         */
        translatePoint2d : function (point, translateBy) {
            return [point[0] + translateBy[0], point[1] + translateBy[1]];
        },

        /**
         * @param point {Array} point to reflect
         */
        reflectPoint2dXAxis : function (point) {
            return this.matrixMultiply2d(
                [ 1, 0,
                  0, -1 ],
                point
            );
        },

        /**
         * @param point {Array} point to reflect
         */
        reflectPoint2dYAxis : function (point) {
            return this.matrixMultiply2d(
                [ -1, 0,
                   0, 1 ],
                point
            )
        },

        pointOnCircle : function (cx, cy, r, theta) {
            return [cx + r * Math.cos(theta), cy + r * Math.sin(theta)];
        }
    };
});
