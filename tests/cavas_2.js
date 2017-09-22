/**
 * Created by lvxianlei on 2017/8/11.
 */
/**
 * Created by lvxianlei on 17/4/10.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
let THREE = require('three');
import '../../../conf/TransformControls';
import '../../../conf/CanvasRenderer';
import '../../../conf/OBJExporter';
import '../../../conf/Projector';
import '../../../conf/OrbitControls';
import '../../../conf/OBJLoader';
import '../../../conf/FBXLoader';
// import '../../../conf/FBXLoader2';
import '../../../conf/DragControls';
import '../../../conf/DDSLoader';
import '../../../conf/MTLLoader';
import '../../../conf/ThreeBSP';
import LineDraw from '../../../conf/LineDraw';
import {createRoom, wall, ArrowHelper, loaderOBJ, stretch} from '../../../conf/wall';
let width, height, scene, renderer, camera, orbitControls, modules, rayCaster, mouse, projector, transformControl,
    clickArray,
    meshArray = [];

let exporters = new THREE.OBJExporter();

export default class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flags: '',
            modelItem: null,
            scene: new THREE.Scene(),
        };
        this.initThree = this.initThree.bind(this);
        this.initWebGLRenderer = this.initWebGLRenderer.bind(this);
    }

    initThree() {
        let scene, renderer, camera, light;
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        camera.lookAt({x: 0, y: 0, z: 0});
        scene.add(camera);

        renderer = new THREE.CanvasRenderer();
        renderer.setClearColor(0xfafaee);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);

        let axes = new THREE.AxisHelper(2000);
        scene.add(axes);
        if ((localStorage.getItem('clickArray') !== null) && (localStorage.getItem('clickArray').length > 0)) {
            let localArray = JSON.parse(localStorage.getItem('clickArray'));
            let geometry = new THREE.Geometry();
            let material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 10});
            let lines = new THREE.Line(geometry, material);
            geometry.vertices = localArray;
            lines.name = 'initLines';
            scene.add(lines);

        }
        let linesVector = new LineDraw(renderer.domElement, camera);

        let geometry = new THREE.Geometry();
        let material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 10});

        let lines = new THREE.Line(geometry, material);
        lines.name = 'lines';

        let geometry2 = new THREE.Geometry();
        let lines2 = new THREE.Line(geometry2, material);
        lines2.name = 'lines2';

        scene.add(lines);
        scene.add(lines2);

        return render();

        function render() {

            renderer.setClearColor(0xfafaee);

            scene.remove(scene.getObjectByName('lines'));
            geometry.vertices = linesVector.clickArray;
            lines = new THREE.Line(geometry, material);
            lines.name = 'lines';
            scene.add(lines);

            scene.remove(scene.getObjectByName('lines2'));
            geometry2.vertices = linesVector.moveArray;
            lines2 = new THREE.Line(geometry2, material);
            lines.name = 'lines2';
            scene.add(lines2);
            renderer.render(scene, camera);
            requestAnimationFrame(render);
            clickArray = linesVector.clickArray;
            if (clickArray.length > 0) {
                localStorage.setItem('clickArray', JSON.stringify(clickArray));
            }
        }
    }

    initWebGLRenderer(array,flag) {
        let renderer, camera, light, orbitControls;
        let that = this;
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 1000;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });
        this.state.scene.add(camera);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xc4ff93);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById('canvas-frame-2').appendChild(renderer.domElement);
        light = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
        light.position.set(200, 200, 800);
        this.state.scene.add(light);
        let axes = new THREE.AxisHelper(200);
        this.state.scene.add(axes);
        let shape = new THREE.Shape(array.slice(0, array.length - 1));
        let floorShape = new THREE.ShapeGeometry(new THREE.Shape(array.slice(0, array.length - 1)));
        floorShape.scale(200, 200, 200);
        let floorMesh = new THREE.Mesh(floorShape, new THREE.MeshLambertMaterial({color: 0x537e51}));
        let floorShape2 = new THREE.BoxGeometry(5000, 5000, .1);
        let floorMesh2 = new THREE.Mesh(floorShape2, new THREE.MeshLambertMaterial({color: 0xfafaee}));
        floorMesh2.position.z = -0.5;
        this.state.scene.add(floorMesh);
        this.state.scene.add(floorMesh2);

        let array2 = [];
        for (let i = 0; i < array.length - 1; i++) {
            if (i !== 0 && i !== (array.length - 2) && i !== (array.length - 1)) {
                array2.push(stretch(array[i - 1], array[i], array[i + 1], 0.05));
            } else if (i === 0) {
                array2.unshift(stretch(array[array.length - 2], array[0], array[1], 0.05));
            } else if (i === (array.length - 2)) {
                array2.push(stretch(array[array.length - 3], array[array.length - 2], array[0], 0.05));
            }
        }
        let shape2 = new THREE.Shape(array2);
        let extrudeSettings = {
            amount: 0.8,
            steps: 1,
            bevelThickness: 10,
            bevelEnabled: false
        };
        let geometry = new THREE.ExtrudeGeometry(shape2, extrudeSettings);
        let geometry2 = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.scale(200, 200, 100);
        geometry2.scale(200, 200, 100);

        let material = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: true});
        let mesh = new THREE.Mesh(geometry, material);
        mesh = new ThreeBSP(mesh);
        let mesh2 = new THREE.Mesh(geometry2, material);
        mesh2 = new ThreeBSP(mesh2);
        let newMesh = mesh.subtract(mesh2);

        // let image = new THREE.TextureLoader('/src/img/uv_1.png');

        let matArray = new THREE.MeshLambertMaterial({color: 0x537e51,wireframe:true});

        let result = newMesh.toMesh(matArray);

        console.log(this.state.modelItem);
        result.geometry.computeFaceNormals();
        result.geometry.uvsNeedUpdate = true;
        result.geometry.verticesNeedUpdate = true;
        result.geometry.normalsNeedUpdate = true;
        result.geometry.colorsNeedUpdate = true;

        this.state.scene.add(result);

        rayCaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        document.getElementById('canvas-frame-2').addEventListener('mousedown', e => {
            let _this = this;
            e.preventDefault();
            mouse.x = (e.clientX / renderer.domElement.width) * 2 - 1;
            mouse.y = -(e.clientY / renderer.domElement.height) * 2 + 1;
            rayCaster.setFromCamera(mouse, camera);
            let intersects = rayCaster.intersectObjects(that.state.scene.children, true);
            console.log(intersects);
            // intersects[0].object.material.color.set(0xff0000);
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.parent.type === 'Group') {
                    intersects[i].object.parent.children.forEach(item => item.object.material.color.set(0xff0000));
                    document.getElementById('canvas-frame-2').addEventListener('mousemove',e=>{
                        let mouseMove = new THREE.Vector3();
                        mouseMove.x = (e.clientX / renderer.domElement.width) * 2 - 1;
                        mouseMove.y = -(e.clientY / renderer.domElement.height) * 2 + 1;
                        mouseMove = mouseMove.unproject(camera);
                        // intersects[i].material.color.set(0xff0000);
                        intersects[i].object.parent.position.x = mouseMove.x;
                        intersects[i].object.parent.position.z = mouseMove.y;
                        // intersects[i].object.parent.position.z = mouseMove.z;
                        console.log(intersects[i].object.parent.position);
                    });
                }
            }
        });

        document.documentElement.addEventListener('keydown', e => {
            // console.log(e);
            switch (e.keyCode) {
                case 49:
                    console.log(1);
                    if (this.state.scene.children[6].name === 'door') {
                        this.state.scene.children[6].position.x += 100;
                    }
                    break;
                case 50:
                    console.log(2);
                    if (this.state.scene.children[6].name === 'door') {
                        this.state.scene.children[6].position.y += 100;
                    }
                    break;
                case 51:
                    console.log(3);
                    if (this.state.scene.children[6].name === 'door') {
                        this.state.scene.children[6].position.z += 100;
                    }
                    break;
            }
        });
        orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControls.damping = 0.2;

        function render() {
            renderer.setClearColor(0xfafaee);
            renderer.render(that.state.scene, camera);
            requestAnimationFrame(render);
        }

        render();
    }

    componentDidMount() {
        this.initThree();
        this.props.getDesignItemShape();
    }

    componentWillUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        const flags = Object.assign({}, nextProps.flags);
        let loader = new THREE.OBJLoader();
        switch (flags.flags) {
            case 'wall':
                document.getElementById('canvas-frame').style.display = 'block';
                document.getElementById('canvas-frame-2').style.display = 'none';
                this.initThree();
                break;

            case 'sofa':
                loader.load('http://t.50-jia.com/product/bim/downloadBimFile/webgl?id=297e78e159aa2e8e0159aa2f9a7a04ac', mesh => {
                    mesh.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.material.side = THREE.DoubleSide;
                        }
                    });
                    mesh.scale.set(0.7, 0.7, 1);
                    mesh.position.set(10, 5, 4);
                    mesh.rotation.x = 0.5 * Math.PI;
                    // mesh.rotation.z = Math.PI;
                    mesh.rotation.y = -0.5 * Math.PI;
                    mesh.name = 'door';
                    this.state.scene.add(mesh);
                    console.log(this.state.scene);
                });
                break;
            case '3D':
                document.getElementById('canvas-frame').style.display = 'none';
                document.getElementById('canvas-frame-2').style.display = 'block';
                this.initWebGLRenderer(JSON.parse(localStorage.getItem('clickArray')));
                break;
            case 'door':
                let doorLine = new THREE.Geometry();
                this.state.scene.add(doorLine,new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 10}));
                break;
        }
    }


    render() {
        return (
            <div className="canvasPage" id="screenCanvas">
                <div id="canvas-frame" className="canvas"></div>
                <div id="canvas-frame-2" className="canvas2"></div>
                <span
                    onClick={(event) => {
                        event.preventDefault();
                        document.getElementById("screenCanvas").webkitRequestFullScreen();
                        document.getElementById("screenCanvas").lastElementChild.style.display = 'none';
                    }}>全屏</span>
            </div>
        );
    }
}

Canvas.propTypes = {
    flags: PropTypes.object.isRequired,
};

// export default class Canvas extends Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             flags: this.props.flags
//         };
//         this.initThree = this.initThree.bind(this);
//         this.initObject = this.initObject.bind(this);
//         this.threeStart = this.threeStart.bind(this);
//         this.animate = this.animate.bind(this);
//     }
//
//     componentWillMount() {
//
//     }
//
//     componentDidMount() {
//
//         this.threeStart();
//     }
//
//     componentWillUpdate() {
//
//     }
//
//     componentWillReceiveProps(nextProps) {
//
//         this.setState({flags: nextProps.flags});
//
//         const flags = Object.assign({}, nextProps.flags);
//
//         const showView = () => {
//             loaderOBJ('module_1.mtl', 'module_1.obj', mesh => {
//                 mesh.position.x = 200;
//                 mesh.position.y = 0;
//                 mesh.position.z = 200;
//                 mesh.scale.set(0.1, 0.1, 0.1);
//                 mesh.name = 'char';
//                 scene.add(mesh);
//             });
//
//             loaderOBJ('bed/file.mtl', 'bed/file.obj', object => {
//                 object.position.x = 400;
//                 object.position.y = 0;
//                 object.position.z = 120;
//                 object.scale.set(0.1, 0.1, 0.1);
//                 object.name = 'bed';
//                 scene.add(object);
//             });
//
//             loaderOBJ('windows/windows.mtl', 'windows/windows.obj', mesh => {
//                 mesh.position.x = 15;
//                 mesh.position.y = 210;
//                 mesh.position.z = 400;
//                 mesh.rotation.y = 0.5 * Math.PI;
//                 mesh.scale.set(67, 32, 90);
//                 mesh.name = 'windows';
//                 scene.add(mesh);
//             });
//         };
//
//         switch (flags.flags) {
//             case 'window':
//                 loaderOBJ('windows/windows.mtl', 'windows/windows.obj', mesh => {
//                     mesh.position.x = 15;
//                     mesh.position.y = 210;
//                     mesh.position.z = 400;
//                     mesh.rotation.y = 0.5 * Math.PI;
//                     mesh.scale.set(67, 32, 90);
//                     mesh.name = 'windows';
//                     scene.add(mesh);
//                 });
//                 break;
//
//             case 'installSofa':
//                 loaderOBJ('module_1.mtl', 'module_1.obj', mesh => {
//                     mesh.position.x = 200;
//                     mesh.position.y = 0;
//                     mesh.position.z = 200;
//                     mesh.scale.set(0.1, 0.1, 0.1);
//                     mesh.name = 'installSofa';
//                     scene.add(mesh);
//                 });
//                 break;
//
//             case 'show':
//                 showView();
//                 break;
//
//             case 'top':
//                 initOrthographicCamera();
//                 break;
//             case '3D':
//                 initPerspectiveCamera();
//                 break;
//         }
//     }
//
//     initThree() {
//         scene = new THREE.Scene();
//         document.addEventListener("webkitfullscreenchange", function () {
//             height = screen.height;
//             renderer1();
//         }, false);
//
//         const renderer1 = () => {
//             width = document.getElementById('canvas-frame').clientWidth;
//             height = document.getElementById('canvas-frame').clientHeight;
//             renderer = new THREE.WebGLRenderer({
//                 antialias: true
//             });
//             renderer.sortObjects = false;
//             renderer.setSize(width, height);
//             renderer.setClearColor(0xeeeeee, 1.0);
//             renderer.setPixelRatio(window.devicePixelRatio);
//             renderer.shadowMap.enabled = true;
//             document.getElementById('canvas-frame').appendChild(renderer.domElement);
//         };
//
//         const initLight = () => {
//             let light = new THREE.PointLight(0xFAFAD2);
//             // let gLight = new THREE.AmbientLight(0xffffff);
//             // gLight.position.set(0, 4000, 0);
//             light.position.set(400, 200, 400);
//             // light.castShadow = true;
//             let sportLight = new THREE.SpotLight(0xFFFFFF, 1, 500, 2);
//             sportLight.position.set(-100, 200, 100);
//             scene.add(sportLight);
//             // scene.add(gLight);
//             scene.add(light);
//             let directLight = new THREE.DirectionalLight(0xffffff, 1.0, 0);
//             directLight.position.set(-1000, 2000, -1000);
//             directLight.castShadow = true;
//             directLight.shadow.camera.near = 2;
//             directLight.shadow.camera.far = 200;
//             directLight.shadow.camera.left = -200;
//             directLight.shadow.camera.right = 50;
//             directLight.shadow.camera.top = 100;
//             directLight.shadow.camera.bottom = -200;
//
//             directLight.distance = 0;
//             directLight.intensity = 2;
//             directLight.shadow.mapSize.height = 1024;
//             directLight.shadow.mapSize.width = 1024;
//             scene.add(directLight);
//             // scene.add(directLight);
//         };
//         renderer1();
//
//         // initOrthographicCamera();
//         initPerspectiveCamera();
//         initLight();
//     }
//
//     animate() {
//         orbitControls.update();
//         transformControl.update();
//         requestAnimationFrame(this.animate);
//         renderer.render(scene, camera);
//     }
//
//     initObject() {
//
//         let axes = new THREE.AxisHelper(20000);
//         scene.add(axes);
//
//         let cubeGeometry = new THREE.BoxGeometry(300, 200, 20);
//         let cubeMesh = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
//         }));
//         cubeMesh.position.x = 0.2;
//         cubeMesh.position.y = 210;
//         cubeMesh.position.z = 400;
//         cubeMesh.rotation.x = 0.5 * Math.PI;
//         cubeMesh.rotation.y = -0.5 * Math.PI;
//         cubeMesh.rotation.z = 0.5 * Math.PI;
//         // scene.add(cubeMesh);
//         createRoom(800, 400, cubes => {
//             cubes.forEach(item => {
//                 if (item.name === 'left') {
//                     let sphere1BSP = new ThreeBSP(item);
//                     let cube2BSP = new ThreeBSP(cubeMesh);
//                     let resultBSP = sphere1BSP.subtract(cube2BSP);
//                     let result = resultBSP.toMesh(new THREE.MeshLambertMaterial({
//                         map: new THREE.TextureLoader().load('/src/img/wall.jpg')
//                     }));
//                     // result.material.shading = THREE.FlatShading;
//                     result.geometry.computeFaceNormals();
//                     result.geometry.computeVertexNormals();
//                     // result.material.needsUpdate = true;
//                     // result.geometry.buffersNeedUpdate = true;
//                     result.geometry.uvsNeedUpdate = true;
//                     meshArray.push(result);
//                     scene.add(result);
//                 } else {
//                     scene.add(item);
//                     meshArray.push(item);
//                 }
//             });
//         });
//
//         orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
//         orbitControls.damping = 0.2;
//         transformControl = new THREE.TransformControls(camera, renderer.domElement);
//         scene.add(transformControl);
//     }
//
//     threeStart() {
//         this.initThree();
//         this.initObject();
//         this.animate();
//     }
//
//     render() {
//         return (
//             <div className="canvasPage">
//                 <div id="canvas-frame"><span onClick={(event) => {
//                     event.preventDefault();
//                     document.getElementById("canvas-frame").lastElementChild.webkitRequestFullScreen();
//                 }}>全屏</span></div>
//             </div>
//         );
//     }
// }