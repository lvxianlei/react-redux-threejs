/**
 * Created by lvxianlei on 2017/8/11.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
let THREE = require('three');
import '../../../conf/TrackballControls';
import '../../../conf/CanvasRenderer';
import '../../../conf/OBJExporter';
import '../../../conf/Projector';
import '../../../conf/OrbitControls';
import '../../../conf/OBJLoader';
import '../../../conf/FBXLoader';
import '../../../conf/DragControls';
import '../../../conf/DDSLoader';
import '../../../conf/MTLLoader';
import '../../../conf/ThreeBSP';
import LineDraw from '../../../conf/LineDraw';
import {createRoom, wall, ArrowHelper, loaderOBJ, stretch, createWall, assignUVs} from '../../../conf/wall';
let width, height, scene, renderer, camera, orbitControls,controls2, modules,rayCasterCanvas, rayCaster, mouse, projector, transformControl,
    drawArray,
    meshArray = [];
let exporters = new THREE.OBJExporter();
// camera = new THREE.OrthographicCamera(window.innerWidth /-2,window.innerWidth /2, window.innerHeight/2, window.innerHeight/-2,1, 10000);
camera = new THREE.OrthographicCamera(window.innerHeight / -20, window.innerHeight/20, window.innerWidth/20, window.innerWidth / -20, 1, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 500;

camera.lookAt({
    x: 0,
    y: 0,
    z: 0
});

// camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 200, 10000);
// camera.position.x = 0;
// camera.position.y = 0;
// camera.position.z = 500;
// camera.up.x = 0;
// camera.up.y = 0;
// camera.up.z = 1;
// camera.lookAt({
//     x: 0,
//     y: 0,
//     z: 0
// });

export default class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flags: '',
            modelItem: null,
            webGLScene: new THREE.Scene(),
            canvasScene: new THREE.Scene()
        };
        this.initThree = this.initThree.bind(this);
        this.initWebGLRenderer = this.initWebGLRenderer.bind(this);
        this.windowDraw = this.windowDraw.bind(this);
    }

    componentWillMount() {
        let light, light2, light3, webGLScene = new THREE.Scene();
        light = new THREE.DirectionalLight(0xFFFFFF, 2.1, 1);
        light2 = new THREE.DirectionalLight(0xFFFFFF, 2.1, 1);
        light3 = new THREE.DirectionalLight(0xFFFFFF, 2.1, 1);
        light.position.set(400, 200, 800);
        light2.position.set(-400, 200, 800);
        light3.position.set(200, -400, 800);
        webGLScene.add(light);
        webGLScene.add(light2);
        webGLScene.add(light3);
        this.setState({
            webGLScene
        });
    }

    initThree() {
        let renderer;
        this.state.canvasScene.add(camera);
        renderer = new THREE.CanvasRenderer();
        renderer.setClearColor(0xe5ebe0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);
        // let axes = new THREE.AxisHelper(2000);
        // this.state.canvasScene.add(axes);
        let gridHelper = new THREE.GridHelper(1000, 50, 0x808080, 0x0000ff);
        gridHelper.position.z = -1;
        gridHelper.position.x = 0;
        gridHelper.position.y = 0;
        gridHelper.rotation.x = 0.5*Math.PI;
        this.state.canvasScene.add(gridHelper);
        let that = this;
        // controls2 = new THREE.TrackballControls(camera);
        // controls2.zoomSpeed = 0.1;

        let clock = new THREE.Clock();


        // -----读取缓存
        if ((localStorage.getItem('drawArray') !== null) && (localStorage.getItem('drawArray').length > 0)) {
            let localArray = JSON.parse(localStorage.getItem('drawArray'));
            for (let i = 0; i < localArray.length; i++) {
                localArray[i] = new THREE.Vector3(localArray[i].x, localArray[i].y,0).unproject(camera);
                localArray[i].z = 0;
            }

            let geometry = new THREE.Geometry();
            let material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 10});
            let lines = new THREE.Line(geometry, material);
            geometry.vertices = localArray;
            lines.name = 'initLines';
            this.state.canvasScene.add(lines);
        }

        let geometry = new THREE.Geometry();
        let material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 10});
        let lines = new THREE.Line(geometry, material);
        lines.name = 'lines';
        let geometry2 = new THREE.Geometry();
        let lines2 = new THREE.Line(geometry2, material);
        lines2.name = 'lines2';
        this.state.canvasScene.add(lines);
        this.state.canvasScene.add(lines2);
        rayCasterCanvas = new THREE.Raycaster();
        let mouseCanvas = new THREE.Vector2();
        document.getElementById('canvas-frame').addEventListener('mouseover', e => {
            let _this = this;
            e.preventDefault();
            document.getElementById('canvas-frame').addEventListener('mousemove',e=>{
                mouseCanvas.x = (e.clientX / renderer.domElement.width) * 2 - 1;
                mouseCanvas.y = -(e.clientY / renderer.domElement.height) * 2 + 1;
                rayCasterCanvas.setFromCamera(mouseCanvas, camera);
                let intersects = rayCasterCanvas.intersectObjects(that.state.canvasScene.children);
                if(intersects[0] instanceof THREE.Line){
                    console.log(intersects[0]);
                }
            });
        });

        let linesVector = new LineDraw(renderer.domElement, camera);
        let render = () => {
            // let delta = clock.getDelta();
            // controls2.update(delta);
            renderer.setClearColor(0xe5ebe0);
            geometry.vertices = linesVector.clickArray;
            geometry2.vertices = linesVector.moveArray;
            renderer.render(that.state.canvasScene, camera);
            requestAnimationFrame(render);
            drawArray = linesVector.drawArray;
            if (drawArray.length > 0) {
                localStorage.setItem('drawArray', JSON.stringify(drawArray));
            }
        };
        render();
    }

    initWebGLRenderer(array = []) {
        if (array) {
            let renderer, camera2, orbitControls, mixers = [];
            let that = this;
            camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
            camera2.position.x = 0;
            camera2.position.y = 0;
            camera2.position.z = 500;
            camera2.up.x = 0;
            camera2.up.y = 0;
            camera2.up.z = 1;
            camera2.lookAt({
                x: 0,
                y: 0,
                z: 0
            });
            this.state.webGLScene.add(camera2);
            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0xe5ebe0);
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('canvas-frame-2').appendChild(renderer.domElement);

            // let axes = new THREE.AxisHelper(200);
            // this.state.webGLScene.add(axes);

            let gridHelper = new THREE.GridHelper(1000, 50, 0x0000ff, 0x808080);
            gridHelper.position.y = -2;
            gridHelper.position.x = 0;
            gridHelper.rotation.x = 0.5 * Math.PI;
            this.state.webGLScene.add(gridHelper);

            let array2 = [];
            for (let i = 0; i < array.length - 1; i++) {
                let item = new THREE.Vector3(array[i].x, array[i].y, 0).unproject(camera2);
                item.x *= 200;
                item.y *= 200;
                array2.push(item);
            }

            for (let i = 0; i < array2.length; i++) {
                if (i === parseFloat(array2.length - 1)) {
                    createWall(array2[i], array2[0], this.state.webGLScene);
                } else {
                    createWall(array2[i], array2[i + 1], this.state.webGLScene);
                }
            }


            let floorShape = new THREE.ShapeBufferGeometry(new THREE.Shape(array2.slice(0, array2.length)));

            let load = new THREE.TextureLoader();
            load.setCrossOrigin('anonymous');
            let floorImage = load.load('http://50jia-bim.oss-cn-beijing.aliyuncs.com/bim_ico/diban.png');
            let floorMesh = new THREE.Mesh(floorShape, new THREE.MeshLambertMaterial({map:floorImage,side:THREE.DoubleSide}));


            this.state.webGLScene.add(floorMesh);


            rayCaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            document.getElementById('canvas-frame-2').addEventListener('mousedown', e => {
                let _this = this;
                e.preventDefault();
                mouse.x = (e.clientX / renderer.domElement.width) * 2 - 1;
                mouse.y = -(e.clientY / renderer.domElement.height) * 2 + 1;
                rayCaster.setFromCamera(mouse, camera2);
                let intersects = rayCaster.intersectObjects(that.state.webGLScene.children, true);
                // intersects[0].object.material.color.set(0xff0000);
                for (let i = 0; i < intersects.length; i++) {
                    if (intersects[i].object.parent.type === 'Group') {
                        // intersects[i].object.parent.children.forEach(item => item.object.material.color.set(0xff0000));
                        document.getElementById('canvas-frame-2').addEventListener('mousemove', e => {
                            let mouseMove = new THREE.Vector3();
                            mouseMove.x = (e.clientX / renderer.domElement.width) * 2 - 1;
                            mouseMove.y = -(e.clientY / renderer.domElement.height) * 2 + 1;
                            mouseMove = mouseMove.unproject(camera2);
                            intersects[i].object.parent.position.x = mouseMove.x * 200;
                            // intersects[i].object.parent.position.z = mouseMove.y*200;
                            intersects[i].object.parent.position.y = 0;
                            console.log(intersects[i].object.parent.position);
                        });
                    }
                }
            });

            orbitControls = new THREE.OrbitControls(camera2, renderer.domElement);
            orbitControls.damping = 0.2;
            let render = () => {
                renderer.setClearColor(0xe5ebe0);
                renderer.render(that.state.webGLScene, camera2);
                requestAnimationFrame(render);
            };
            render();
        }
    }


    componentDidMount() {
        // this.initThree();

    }

    componentWillUpdate() {

    }

    windowDraw() {
        let doorGeometry = new THREE.Geometry();
        doorGeometry.vertices = [
            new THREE.Vector3(0, 0, 100),
            new THREE.Vector3(0, 100, 100)
        ];
        doorGeometry.name = 'doorLines';
        let doorLines = new THREE.Line(doorGeometry, new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 15}));
        this.state.canvasScene.add(doorLines);
        document.getElementById('canvas-frame').addEventListener('mousemove', function (event) {
            event.preventDefault();
            let mouse = new THREE.Vector3();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouse.unproject(camera);
            doorLines.position.copy(mouse);
        });
        // document.documentElement.addEventListener('keydown', e => {
        //     // console.log(e);
        //     console.log(this.state.canvasScene);
        //     switch (e.keyCode) {
        //         case 49:
        //             console.log(1);
        //             doorLines.position.x += 100;
        //             break;
        //         case 50:
        //             doorLines.position.y += 100;
        //             break;
        //         case 51:
        //             console.log(3);
        //             doorLines.position.z += 100;
        //             break;
        //     }
        // });
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
                    mesh.children.forEach((item,index)=>{
                        item.material=new THREE.MeshLambertMaterial({color: 0xe6e6e6});
                        if(index%2===0){
                            item.material=new THREE.MeshLambertMaterial({color: 0xff0000});
                        }
                    });
                    console.log(mesh);
                    this.state.webGLScene.add(mesh);
                });
                break;
            case '3D':
                document.getElementById('canvas-frame').style.display = 'none';
                document.getElementById('canvas-frame-2').style.display = 'block';
                this.initWebGLRenderer(JSON.parse(localStorage.getItem('drawArray')));
                break;
            case 'door':
                this.windowDraw();
                break;
            case 'plane':
                document.getElementById('canvas-frame').style.display = 'block';
                document.getElementById('canvas-frame-2').style.display = 'none';
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
//     componentWillMount() {
//     }
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