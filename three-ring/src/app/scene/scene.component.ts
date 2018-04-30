import { Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import * as THREE from 'three';
import { RingShape} from '../ring-shape.enum'
import { CourtRingGeometry} from '../court-ring-geometry'

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit, AfterViewInit {

    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.Renderer;
    cube: THREE.Mesh;
    range: number;
    material: string;
    ringShape: RingShape ;

    price: number = 5000;
    daysToDeliver: number = 21;
    @ViewChild('canvas')
    canvasRef: ElementRef;

    constructor() {
        this.render = this.render.bind(this);
    }

    slidebar($event) {
        this.range = $event.target.value;
        console.log(this.range);
    }
    materialChange($event) {
        this.material = $event.target.value;
        console.log(this.material);
    }
    ringShapeChange($event) {
        console.log($event.target.value);
        this.ringShape = $event.target.value;
        console.log(this.ringShape);
    }

    render() {
        requestAnimationFrame(this.render);
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }

    createScene() {
        this.scene = new THREE.Scene();
        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // let geometry = new CourtRingGeometry( 1, 1, 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );
    }
    createLight() {
    };

    createCamera() {
        let canvas = this.canvasRef.nativeElement;
        this.camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );
        this.camera.position.z = 5;

    };

    startRendering() {
        let canvas = this.canvasRef.nativeElement;
        this.renderer = new THREE.WebGLRenderer({canvas: canvas});
        this.renderer.setSize(innerWidth, innerHeight);
        this.render();
    };

    ngAfterViewInit() {
        this.createScene();
        this.createLight();
        this.createCamera();
        this.startRendering();
    };

    ngOnInit() {
    };
}
