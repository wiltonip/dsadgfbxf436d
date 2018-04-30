import { Geometry, Vector3, Face3 } from 'three';

export class CourtRingGeometry extends Geometry{
    private parameters = {};
    constructor(radius, tube, radialSegments, tubularSegments, arc) {
        super();
        this.type = 'MyGeometry';

        this.parameters = {
            radius: radius,
            tube: tube,
            radialSegments: radialSegments,
            tubularSegments: tubularSegments,
            arc: arc
        };
        this.vertices.push(new Vector3( 1, 0, 0));
        this.vertices.push(new Vector3( 0, 0, 0));
        this.vertices.push(new Vector3( 0, 1, 0));

        this.faces.push(new Face3(0, 1, 2));
    }
}
