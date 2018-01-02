/**
 * Created by lvxianlei on 2017/10/18.
 */
const THREE = require('three');
import './threePlugin/MTLLoader';
import './threePlugin/OBJLoader';
import './threePlugin/CopyShader';
import './threePlugin/SSAOShader';
import './threePlugin/Projector';
import './ModelObject';
import './threePlugin/ThreeBSP';

export default ((THREE) => {
    'use strict';
    const {
        Projector,
        Object3D,
        Geometry,
        BoxGeometry,
        BoxBufferGeometry,
        Scene,
        PerspectiveCamera,
        OrthographicCamera,
        WebGLRenderer,
        Shape,
        ShapeBufferGeometry,
        Vector2,
        Vector3,
        EventDispatcher,
        CircleGeometry,
        Mesh,
        Line,
        BufferGeometry,
        MeshBasicMaterial,
        PointsMaterial,
        LineBasicMaterial,
        Path,
        ExtrudeGeometry,
        Group,
        TextureLoader,
        MeshPhongMaterial,
        MeshLambertMaterial,
        // OrbitControls,
        TransformControls,
        MTLLoader,
        OBJLoader,
        AmbientLight,
        PointLight,
        DoubleSide,
        Raycaster,
        ModelObject3D,
        DirectionalLight
    } = THREE;

    let mouse = new Vector3();

    const mouseArray = [];

    const eventType = {type: null, mean: null, isBind: false};

    let aspect = window.innerWidth / window.innerHeight;
    let frustumSize = 5000;

    const ambientLight = new AmbientLight(0xffffff);

    const perspectiveCamera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 10, 10000);
    perspectiveCamera.name = 'perspectiveCamera';

    perspectiveCamera.position.z = 1000;
    perspectiveCamera.position.y = -1000;
    perspectiveCamera.position.x = 0;
    perspectiveCamera.lookAt(new Vector3(0, 0, 0));

    const orthographicCamera = new OrthographicCamera(frustumSize * aspect / -10, frustumSize * aspect / 10, frustumSize / 10, frustumSize / -10, 1, 10000);
    orthographicCamera.name = 'orthographicCamera';
    orthographicCamera.position.x = 0;
    orthographicCamera.position.y = 0;
    orthographicCamera.position.z = 5000;
    orthographicCamera.up.y = 1;
    orthographicCamera.lookAt(new Vector3(0, 0, 0));

    let domElement = null;

    let scene = null;

    let camera = null;

    let baseShapeID = 0;
    let wallID = 0;
    let pointID = 0;
    const ray = new Raycaster();

    const extrudeSettings = {
        amount: 300,
        bevelEnabled: false
    };

    const doorFrameExtrudeSettings = {
        amount: 240,
        bevelEnabled: false
    };

    let pointerVector = new Vector2();
    let transformControl = null;
    const group = new Group;
    group.name = 'shape';
    const standbyGroup = new Group;
    standbyGroup.name = '3DScene';

    const light = new DirectionalLight(0xf0f0f0);
    light.position.set(400, 1000, 800);
    light.castShadow = true;
    light.intensity = 0.5;
    standbyGroup.add(light);

    const objGroup = new Group;
    objGroup.name = 'objGroup';

    let orbitControls;

    const doorFrame = {width: 400, height: 200, depth: 240};

    let wallSpace = null;

    class Initialization {
        constructor(option = {domElement: null, camera: null, clearColor: null, callback: null}) {
            for (let key in option) {
                this[key] = option[key];
            }
            this.scene = scene = new Scene;
            this.camera = camera = orthographicCamera;
            if (option.camera) camera = this.camera = option.camera;

            this.scene.add(ambientLight);
            this.domElement = this.domElement ? this.domElement : this.renderer.domElement;
            domElement = this.domElement;
            this.renderer = new WebGLRenderer({antialias: true, canvas: this.domElement || undefined, alpha: true});
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.clearColor = this.clearColor || 0xe5ebe0;
            this.renderer.setClearColor(this.clearColor);
            window.onresize = () => this.onWindowResize();
            transformControl = new THREE.TransformControls(perspectiveCamera, domElement);
            // this.scene.add(transformControl.getObject());
            this.scene.add(this.camera);
        }

        render() {
            // this.renderer.setClearColor(this.clearColor);
            transformControl.update();
            // transformControl.cameraUpdate();
            this.renderer.render(this.scene, camera);
        }

        onWindowResize() {
            if (this.camera instanceof OrthographicCamera) {
                aspect = window.innerWidth / window.innerHeight;
                this.camera.left = -frustumSize * aspect / 10;
                this.camera.right = frustumSize * aspect / 10;
                this.camera.top = frustumSize / 10;
                this.camera.bottom = -frustumSize / 10;
                this.camera.updateProjectionMatrix();
                // MarkLine.onWindowResize();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
            if (this.camera instanceof PerspectiveCamera) {
                aspect = window.innerWidth / window.innerHeight;
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
            }
        }

        onMouseWheel(event) {

        }

        setCamera(camera) {
            this.camera = camera;
        }

        setScene(scene) {
            this.scene = scene;
        }

        getDomElement() {
            return this.domElement;
        }

        getCamera() {
            return this.camera;
        }

        add(object) {
            this.scene.add(object);
        }
    }

    class PointCircle {
        constructor(point = new Vector3) {
            this.pointID = pointID = ++pointID;
            this.name = '';
            this.type = 'point';
            return this.pointMesh(this.pointShape(point));
        }

        pointMesh(pointShape) {
            const material = new LineBasicMaterial({color: 0x000, linewidth: 2});
            return new Line(pointShape.createPointsGeometry(10), material);
        }

        pointShape(point = new Vector3(0, 0, 0), radius = 5) {
            const pointCircle = new Shape;
            pointCircle.absellipse(point.x, point.y, radius, radius, 0, 2 * Math.PI);
            return pointCircle;
        }
    }

    class MarkLine {
        constructor(camera) {
            this.line = new Group;
            this.lineMesh = null;
            this.camera = camera;
            this.startArrowMesh = null;
            this.endArrowMesh = null;
            this.middlePoint = null;
            this.lineWidth = null;
            this.text = document.createElement('input');
            this.text.type = 'text';
            window.addEventListener('resize', () => this.onWindowResize());
            this.init();
            this.markLineCreate = this.markLineCreate.bind(this);
        }

        init() {
            this.lineGeometry = new Geometry;
            this.startArrowGeometry = new Geometry;
            this.endArrowGeometry = new Geometry;
            this.lineGeometry.vertices.push(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
            this.startArrowGeometry.vertices.push(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
            this.endArrowGeometry.vertices.push(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
            this.lineMesh = new Line(this.lineGeometry, new LineBasicMaterial({color: 0x000000}));
            this.startArrowMesh = new Line(this.startArrowGeometry, new LineBasicMaterial({color: 0x000000}));
            this.endArrowMesh = new Line(this.endArrowGeometry, new LineBasicMaterial({color: 0x000000}));
            this.line.add(this.lineMesh);
            this.line.add(this.startArrowMesh);
            this.line.add(this.endArrowMesh);
        }

        // 世界坐标转屏幕坐标
        worldToScene(vector) {
            vector.project(this.camera);
            const sx = (vector.x + 1) / 2 * domElement.width;
            const sy = -(vector.y - 1) / 2 * domElement.height;
            return new Vector2(sx, sy);
        }

        onWindowResize() {
            this.createText();
        }

        createText() {
            const position = this.worldToScene(this.middlePoint.clone());
            this.text.value = Math.floor(this.lineWidth);
            this.text.style.display = 'block';
            this.text.style.width = '40px';
            this.text.style.position = 'absolute';
            this.text.style.padding = '0px 2px';
            this.text.style.fontSize = '14px';
            this.text.style.lineHeight = '15px';
            this.text.style.textAlign = 'center';
            this.text.style.top = position.y + 'px';
            this.text.style.left = position.x + 'px';
        }

        createMarkLine(startPoint, endPoint) {
            this.lineWidth = endPoint.distanceTo(startPoint);
            this.middlePoint = new Vector3((endPoint.x + startPoint.x) / 2, (endPoint.y + startPoint.y) / 2, 0);
            this.createText();
            const startArrow = [new Vector3(startPoint.x, startPoint.y + 5, 0), new Vector3(startPoint.x, startPoint.y - 5, 0)];
            const endArrow = [new Vector3(endPoint.x, endPoint.y + 5, 0), new Vector3(endPoint.x, endPoint.y - 5, 0)];
            this.startArrowMesh.geometry.verticesNeedUpdate = true;
            this.startArrowMesh.geometry.vertices = startArrow;
            this.endArrowMesh.geometry.verticesNeedUpdate = true;
            this.endArrowMesh.geometry.vertices = endArrow;
            this.lineMesh.geometry.verticesNeedUpdate = true;
            this.lineMesh.geometry.vertices = [startPoint, endPoint];
        }

        markLineCreate(startPint) {
            return endPoint => this.createMarkLine(startPint, endPoint);
        }

    }

    // 基础类,=>主要是2D画墙 (只生成three Geometry)
    class BaseShape extends MarkLine {
        constructor(camera) {
            super();
            this.type = 'BaseShape';
            this.name = '';
            this.baseId = baseShapeID = ++baseShapeID;
            this.innerLine = null;
            this.innerShape = null;
            this.lineGeometry = null;
            this.innerPlanGeometry = null;
            this.camera = camera;
            this.innerLineShape();
            this.vertexCalculate = this.vertexCalculate.bind(this);
            this.lineSlopeCalculate = this.lineSlopeCalculate.bind(this);
            this.updateShapePoint = this.updateShapePoint.bind(this);
        }

        /**
         * 根据两点生成内线shape
         * @param firstPoint
         * @param secondPoint
         * @param wallDepth 墙厚度，默认为10
         */
        innerLineShape(firstPoint = new Vector3(0, 0, 0), secondPoint = new Vector3(1, 0, 0), wallDepth = 20) {
            firstPoint.z = 0;
            secondPoint.z = 0;
            let thirdPoint, fourthPoint;
            const isClockwise = (secondPoint.y - firstPoint.y) > 0 ? 1 : -1;
            const angle = isClockwise * (secondPoint.clone().sub(firstPoint.clone()).angleTo(new Vector3(1, 0, 0)));
            let distanceA = 0;
            const distanceB = secondPoint.clone().distanceTo(firstPoint);
            thirdPoint = new Vector3(distanceB * Math.cos(angle) - wallDepth * Math.sin(angle) + firstPoint.x, (wallDepth * Math.cos(angle)) + distanceB * Math.sin(angle) + firstPoint.y, 0);
            fourthPoint = new Vector3(distanceA * Math.cos(angle) - wallDepth * Math.sin(angle) + firstPoint.x, (wallDepth * (Math.cos(angle)) + distanceA * Math.sin(angle) + firstPoint.y), 0);
            this.innerLine = [firstPoint, secondPoint, thirdPoint, fourthPoint];
            this.innerShape = new Shape(this.innerLine);
            this.innerShape.autoClose = true;
            this.lineGeometry = this.innerShape.createPointsGeometry();
            this.lineGeometry.verticesNeedUpdate = true;
            this.lineGeometry.name = this.type + 'line' + this.baseId;
            this.innerPlanGeometry = new ShapeBufferGeometry(this.innerShape);
            this.innerPlanGeometry.name = this.type + 'shapeBufferGeometry' + this.baseId;
            this.wallGeometry = new ExtrudeGeometry(this.innerShape, extrudeSettings);
            this.wallGeometry.name = this.type + 'extrudeGeometry' + this.baseId;
            this.createMarkLine(firstPoint, secondPoint);
        }

        /**
         *计算顶点 。返回值为一个函数，传入第一个顶点后，第一个顶点不变，return的函数传入第二个顶点，开始计算。
         * @param point 第一个顶点
         * @returns {function(*=)}
         */
        vertexCalculate(point) {
            const firstPoint = point;
            return secondPoint => {
                this.innerLineShape(firstPoint, secondPoint);
                return this.innerLine;
            };
        }

        /**
         * 计算直线斜率，函数形式同pointCalculate.
         * @param firstPoint
         */
        lineSlopeCalculate(firstPoint) {
            return secondPoint => {
                const vertex = this.vertexCalculate(firstPoint)(secondPoint);
                const [a, b, c, d] = vertex;
                const a1 = b.y - a.y;
                const b1 = a.x - b.x;
                const c1 = b.x * a.y - a.x * b.y;
                const a2 = c.y - d.y;
                const b2 = d.x - c.x;
                const c2 = c.x * d.y - d.x * c.y;
                return {innerLine: {a: a1, b: b1, c: c1}, outLine: {a: a2, b: b2, c: c2}};
            };
        }

        /**
         * 计算两条直线的交点。直线必须为 Ax+By+C = 0表达式中的A，B，C,{A,B,C}
         * @param firstLine
         * @param secondLine
         * @returns {*} Vector3
         */
        intersectPoint(firstLine, secondLine) {
            const a1 = firstLine.a,
                b1 = firstLine.b,
                c1 = firstLine.c,
                a2 = secondLine.a,
                b2 = secondLine.b,
                c2 = secondLine.c,
                x = ((b1 * c2 - b2 * c1) / (a1 * b2 - a2 * b1)),
                y = (a2 * c1 - a1 * c2) / (a1 * b2 - a2 * b1);
            return new Vector3(x, y, 0);
        }

        middleLineShape(firstPoint, secondPoint, wallDepth = 10) {
            let targetPointX = (firstPoint.x + secondPoint.x) / 2;
            let targetPointY = (firstPoint.y + secondPoint.y) / 2;
            let targetScale = Math.sqrt((firstPoint.x - secondPoint.x) * (firstPoint.x - secondPoint.x) + (firstPoint.y - secondPoint.y) * (firstPoint.y - secondPoint.y));
            let dLine = new THREE.Vector3((secondPoint.x - firstPoint.x), (secondPoint.y - firstPoint.y), 0);
            let dLine_init = new THREE.Vector3(1, 0, 0);
            let targetRotation = dLine.angleTo(dLine_init);
            if (secondPoint.y < firstPoint.y) {
                targetRotation = (-targetRotation);
            }

            // let geometry = new THREE.BoxGeometry(targetScale, 10, 100);
            // let textImageArr = [];
            // let wall = new THREE.Mesh(geometry, new THREE.MultiMaterial(textImageArr));
            // wall.position.set(targetPointX, targetPointY, 50);
            // wall.rotation.z = targetRotation;
        }

        updateShapePoint(pointArray = []) {
            this.innerLine = pointArray;
            this.innerShape = new Shape(this.innerLine);
            this.innerShape.autoClose = true;
            this.lineGeometry = this.innerShape.createPointsGeometry();
            this.innerPlanGeometry = new ShapeBufferGeometry(this.innerShape);
        }

        shapeArrayGeometry(shapeArray) {
            return shapeArray.map((item, index) => {
                return this.innerLineShape(item[0].clone().unproject(orthographicCamera), item[1].unproject(orthographicCamera));
            });
        }

        showAdsorptionLine() {

        }

        // 线框
        outFrame() {

        }

    }

    class WallMesh extends BaseShape {
        constructor() {
            super();
            Object.assign(WallMesh.prototype, EventDispatcher.prototype);
            this.wall = new Group();
            this.shape = new Shape([new Vector3(-100, 0, 0), new Vector3(-100, 10, 0), new Vector3(100, 10, 0), new Vector3(100, 0, 0)]);
            this.shape.autoClose = true;
            this.wallShape = new Mesh(new ShapeBufferGeometry(this.shape), new MeshBasicMaterial({color: 0xff0000}));
            this.cicrle = new PointCircle(new Vector3(0, 0, 0));
            scene.add(this.cicrle);
            this.wall.position.x = 0;
            this.wall.position.y = 0;
            this.wall.position.z = 0;
            this.wallShape.position.x = 100;
            this.wall.rotation.z = -0.5 * Math.PI;
            this.wall.add(this.wallShape);

            /*if (!geometry && !material) {
                console.error('BIM.WallMesh: Parameter must be THREE.Geometry and THREE.Material');
            } else {
                this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
                this.material = material !== undefined ? material : {color: Math.random() * 0xffffff};
                this.type = 'WallMesh';
                this.wall_id = wallID = ++wallID;
                this.name = '';
                delete this.baseId;
                this.lineMesh = new Line(geometry, new LineBasicMaterial(material));
                this.shapeMesh = new ShapeBufferGeometry(geometry, new MeshBasicMaterial(material));
            }*/
        }

        onMouseDown(event) {
        }

        onMouseMove(event) {
        }

        onMouseOver(event) {
        }

        onMouseOut(event) {
        }

        removeEvent(event) {
        }
    }

    class DoorFrame {
        constructor() {
            this.doorFrame = new Group;
            this.doorFrame.name = 'doorFrame';
            this.camera = camera;
            this.container = domElement;
            this.doorModel = null;
            this.container.selfe = this;
            this.makeDoorFrame();
        }

        transformCoordinate(event, _camera) {
            const mouseX = (event.clientX / this.container.width) * 2 - 1;
            const mouseY = -(event.clientY / this.container.height) * 2 + 1;
            const point = new Vector3(mouseX, mouseY, 0).unproject(_camera);
            point.z = 0;
            return point;
        }

        makeDoorFrame() {
            const doorPoint = [new Vector3(-100, 0, 0), new Vector3(100, 0, 0), new Vector3(100, 20, 0), new Vector3(-100, 20, 0)];
            const doorModelPoint = [new Vector3(-100, 20, 0), new Vector3(100, 20, 0), new Vector3(100, -20, 0), new Vector3(-100, -20, 0)];
            const commonDoor = new Shape(doorPoint);
            const doorMesh = new Mesh(new ShapeBufferGeometry(commonDoor), new MeshLambertMaterial({color: 0x000}));
            this.doorFrame.add(doorMesh);
            group.add(this.doorFrame);
            this.doorFrame.position.z = 1;
            this.doorModel = new Mesh(new ExtrudeGeometry(new Shape(doorModelPoint), doorFrameExtrudeSettings), new MeshLambertMaterial({color: 0x000}));
            this.boundEvent();
        }

        distanceFromPointToLine(point, line) {
            const px = point.x, py = point.y, la = line.a, lb = line.b, lc = line.c;
            return Math.abs((la * px + lb * py + lc) / Math.sqrt(la * la + lb * lb));
        }

        intersectsFromPointToLine(point, line) {
            const intersectsPoint = point.clone();
            const lineSlope = -(line.a / line.b);
            const k2 = (line.b === 0 || line.a === 0 ) ? 0 : line.b / line.a;
            const la = line.a, lb = line.b, lc = line.c, px = point.x, py = point.y;
            if (line.a === 0) {
                intersectsPoint.y = -lc / lb;
                intersectsPoint.x = px;
            } else if (line.b === 0) {
                intersectsPoint.y = py;
                intersectsPoint.x = -lc / la;
            } else {
                intersectsPoint.x = (k2 * lb * px - lb * py - lc) / (la + lb * k2);
                intersectsPoint.y = (-(la * intersectsPoint.x) - lc) / lb;
            }
            return intersectsPoint;
        }

        angleToFollow(item) {
            const la = item.lineSlope.innerLine.a, lb = item.lineSlope.innerLine.b, lc = item.lineSlope.innerLine.c;
            let angle;
            if (la === 0) {
                angle = lb > 0 ? Math.PI : 0;
            } else if (lb === 0) {
                angle = la > 0 ? 1.5 * Math.PI : -0.5 * Math.PI;
            } else {
                if (la < 0) {
                    angle = Math.atan(-la / lb);
                    angle = angle > 0 ? angle - Math.PI: angle;
                } else if (la > 0 && lb > 0) {
                    angle = Math.atan(-la / lb) + Math.PI;
                } else {
                    angle = Math.atan(-la / lb);
                }
            }
            return angle;
        }

        xiFu(point) {
            const wall = wallSpace.concat();
            for (let item of wall) {
                const distance = this.distanceFromPointToLine(point, item.lineSlope.innerLine);
                if (distance <= 100) {
                    point = this.intersectsFromPointToLine(point, item.lineSlope.innerLine);
                    const angle = this.angleToFollow(item);
                    this.doorFrame.position.x = point.x;
                    this.doorFrame.position.y = point.y;
                    this.doorFrame.rotation.z = angle;
                    this.doorModel.position.x = point.x;
                    this.doorModel.position.y = point.y;
                    this.doorModel.rotation.z = angle;
                    break;
                }
            }
        }

        inciseDoorFrame(point) {
            const newPoint = new Vector2(point.x, point.y);
            const raycaster = new Raycaster;
            raycaster.setFromCamera(newPoint, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            if (Array.isArray(intersects) && intersects.length > 1) {
                intersects.forEach((item, index) => {
                    if (item.object.name !== '') {
                        const result1 = new ThreeBSP(standbyGroup.getObjectByName(item.object.name));
                        const result2 = new ThreeBSP(this.doorModel);
                        const doorBSP = result1.subtract(result2).toMesh(new MeshLambertMaterial({color: 0x828282}));
                        doorBSP.name = item.object.name;
                        doorBSP.geometry.computeFaceNormals();
                        doorBSP.geometry.computeVertexNormals();
                        standbyGroup.remove(standbyGroup.getObjectByName(item.object.name));
                        standbyGroup.add(doorBSP);
                    }
                });
            }
        }

        onMouseMove(event) {
            const point = this.selfe.transformCoordinate(event, camera);
            this.selfe.doorFrame.position.x = point.x;
            this.selfe.doorFrame.position.y = point.y;
            this.selfe.doorModel.position.x = point.x;
            this.selfe.doorModel.position.y = point.y;
            this.selfe.xiFu(point);
            this.addEventListener('mousedown', this.selfe.onMouseDown, false);
        }

        onMouseDown(event) {
            const point = this.selfe.transformCoordinate(event, camera);
            point.project(camera);
            this.selfe.inciseDoorFrame(point);
            this.removeEventListener('mousemove', this.selfe.onMouseMove, false);
            this.removeEventListener('mousedown', this.selfe.onMouseDown, false);
        }

        boundEvent() {
            if (eventType.isBind) {
                this.container.removeEventListener(eventType.type, eventType.mean, false);
            }
            this.container.addEventListener('mousemove', this.onMouseMove, false);
            eventType.isBind = true;
            eventType.type = 'mousemove';
            eventType.mean = this.onMouseMove;
        }

        removeEvent() {

        }
    }

    class Floor extends WallMesh {
        constructor() {
            super();
        }
    }

    class Roof extends WallMesh {
        constructor() {
            super();
        }
    }

    class Room extends WallMesh {
        constructor(innerGeometry) {
            super(innerGeometry);
        }
    }

    class House extends WallMesh {
        constructor() {
            super();
        }
    }

    class LoadObjMtlModel {
        constructor() {
            this.mtlLoad = new MTLLoader;
            this.objLoad = new OBJLoader;
        }

        startLoad(model) {

            this.mtlLoad.load(model.mtl, mtlFile => {
                mtlFile.preload();
                this.objLoad.setMaterials(mtlFile);
                this.objLoad.load(model.obj, objFile => {
                    objFile.position.set(...model.position);
                    objFile.scale.set(...model.scale);
                    objFile.rotation.set(...model.rotation);
                    // objFile.scale.set(.1, .1, .1);
                    // objFile.rotation.x = 0.5 * Math.PI;

                    const modelObject = new ModelObject3D();
                    modelObject.addModel(objFile);
                    scene.add(modelObject);
                }, this.onProgress, this.onError);
            }, this.onProgress, this.onError);
        }

        onProgress(xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        }

        onError(error) {
            console.error(error);
        }
    }

    class DrawControl {
        constructor(_domElement, object) {
            this.contener = document.getElementsByClassName('textHelper')[0];
            this.domElement = (_domElement !== undefined) ? _domElement : domElement;
            this.object = (object !== undefined) ? object : orthographicCamera;
            window.document.oncontextmenu = function () {
                return false;
            };
            this.domElement.that = this;
            this.domElement.index = 0;
            this.isSecondDraw = false;
            this.bindEvent = false;
            this.vertex = null;
            this.texture = new TextureLoader().load('/src/img/tietu.png');
            this.lineSlope = null;
            this.geometryArray = wallSpace = [];
            this.baseShape = null;
            this.markLine = null;
        }

        intersectObjects(pointer, objects) {

            let rect = domElement.getBoundingClientRect();
            let x = (pointer.clientX - rect.left) / rect.width;
            let y = (pointer.clientY - rect.top) / rect.height;

            pointerVector.set((x * 2) - 1, -(y * 2) + 1);

            ray.setFromCamera(pointerVector, camera);

            let intersections = ray.intersectObjects(objects, true);

            return intersections[0] ? intersections[0] : false;
        }

        calculateGeometryWidth(firstPoint = new Vector3, secondPoint = new Vector3) {
            if (firstPoint && firstPoint instanceof Vector3 && secondPoint && secondPoint instanceof Vector3) return secondPoint.distanceTo(firstPoint);
            console.error('BIM.DrawControl: Parameter for calculateGeometryWidth() must be (THREE.Vector3)');
        }

        // 返回度数为弧度值
        calculateGeometryAngle(firstPoint = new Vector3, secondPoint = new Vector3) {
            if (firstPoint && firstPoint instanceof Vector3 && secondPoint && secondPoint instanceof Vector3) return secondPoint.angleTo(firstPoint);
            console.error('BIM.DrawControl: Parameter for calculateGeometryAngle() must be (THREE.Vector3)');
        }

        //屏幕坐标转世界坐标
        transformCoordinate(event, _camera) {
            const mouseX = (event.clientX / this.domElement.width) * 2 - 1;
            const mouseY = -(event.clientY / this.domElement.height) * 2 + 1;
            const point = _camera === undefined ? new Vector3(mouseX, mouseY, 0).unproject(this.object) : new Vector3(mouseX, mouseY, 0).unproject(_camera);
            point.z = 0;
            return point;
        }

        shapeToWall(shapeArray = []) {
            const geometryArray = shapeArray.slice(0).map(item => new ExtrudeGeometry(item.baseShape.innerShape, extrudeSettings));
            // scene.remove(scene.getObjectByName('shape'));
            let wall = null;
            geometryArray.forEach((item, index) => {
                wall = new Mesh(item, new MeshLambertMaterial({color: 0x828282}));
                wall.name = index;
                standbyGroup.add(wall);
            });
        }

        sceneTo3D() {
            if (this.bindEvent) {
                this.bindEvent = !this.bindEvent;
                this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
            }
            this.domElement.addEventListener('mousedown', this.on3DMouseDown, false);
            camera = perspectiveCamera;
            scene.add(transformControl);
            scene.remove(scene.getObjectByName('shape'));
            this.contener.style.display = 'none';
            scene.add(standbyGroup);
        }

        //两点90°吸附
        adsorption(mouse) {
            const item = this.geometryArray[this.geometryArray.length - 1].baseShape.innerLine[0].clone();
            const allPoint = this.geometryArray.map(item => item.baseShape.innerLine[0]);
            for (let i = 0; i < allPoint.length; i++) {
                if (mouse.clone().distanceTo(allPoint[i].clone()) <= 20) {
                    mouse.x = allPoint[i].x;
                    mouse.y = allPoint[i].y;
                    return;
                }
            }
            if (mouse.y >= item.y - 50 && mouse.y <= item.y + 50) {
                mouse.y = item.y;
                return;
            } else if (mouse.x >= item.x - 50 && mouse.x <= item.x + 50) {
                mouse.x = item.x;
                return;
            }
        }

        //判断是否闭合区域
        isClose(mouse) {
            const allPoint = this.geometryArray.map((item, index) => {
                return {index, point: item.baseShape.innerLine[0]};
            });
            let isClose = false;
            for (let item of allPoint) {
                if (item.point.x === mouse.x && item.point.y === mouse.y) {
                    isClose = true;
                    return {isClose, index: item.index};
                }
            }
            return {isClose};
        }

        onMouseDown(event) {
            this.style.cursor = 'crosshair';
            const point = this.that.transformCoordinate(event);
            this.that.baseShape = new BaseShape(this.that.object);
            const {lineSlopeCalculate, vertexCalculate} = this.that.baseShape;
            this.that.vertex = vertexCalculate(point);
            this.that.lineSlope = lineSlopeCalculate(point);
            this.that.geometryArray.push({lineSlope: null, baseShape: this.that.baseShape});

            const shapeGeometry = new Mesh(this.that.geometryArray[this.that.geometryArray.length - 1].innerPlanGeometry, new MeshLambertMaterial({
                side: DoubleSide,
                color: 0x828282
            }));
            shapeGeometry.name = this.that.geometryArray.length - 1;
            shapeGeometry.matrixWorldNeedsUpdate = true;
            group.add(shapeGeometry);
            group.add(this.that.baseShape.line);
            this.addEventListener('mousemove', this.that.onMouseMove, false);
        }

        on3DMouseDown(event) {
            const pointer = event.changedTouches ? event.changedTouches[0] : event;
            let obj = this.that.intersectObjects(pointer, scene.children);
            let model = null;
            if (obj && obj.object.parent.name === 'ModelObject3D') {
                model = obj.object.parent;
                model.parent.check();
                transformControl.attach(model);
            }
        }

        corner(firstGeometry, secondGeometry) {
            const firstLine = firstGeometry.lineSlope.outLine;
            const secondLine = secondGeometry.lineSlope.outLine;
            const crossPoint = this.baseShape.intersectPoint(firstLine, secondLine);
            const frontGeometryVertices = firstGeometry.baseShape.innerLine.slice(0);
            const backGeometryVertices = secondGeometry.baseShape.innerLine.slice(0);
            frontGeometryVertices[2] = backGeometryVertices[3] = crossPoint;
            firstGeometry.baseShape.updateShapePoint(frontGeometryVertices);
            secondGeometry.baseShape.updateShapePoint(backGeometryVertices);
        }

        onSecondMouseDown(event) {
            if (event.buttons === 2) {
                this.style.cursor = 'default';
                this.that.isSecondDraw = !this.that.isSecondDraw;
                group.remove(group.getObjectByName(this.that.geometryArray.length - 1));
                this.that.geometryArray.length--;

                this.that.shapeToWall(this.that.geometryArray);
                this.removeEventListener('mousemove', this.that.onMouseMove, false);
                this.removeEventListener('mousedown', this.that.onSecondMouseDown, false);
                return;
            }
            const geometryArray = this.that.geometryArray;
            const point = this.that.geometryArray[this.that.geometryArray.length - 1].baseShape.innerLine[1];
            const isClose = this.that.isClose(point);

            if (geometryArray.length >= 2) {
                if (this.that.isSecondDraw) {
                    this.that.isSecondDraw = !this.that.isSecondDraw;
                } else {
                    const firstGeometry = geometryArray[geometryArray.length - 2];
                    const secondGeometry = geometryArray[geometryArray.length - 1];
                    this.that.corner(firstGeometry, secondGeometry);
                    group.getObjectByName(geometryArray.length - 2).geometry = geometryArray[geometryArray.length - 2].baseShape.innerPlanGeometry;
                    group.getObjectByName(geometryArray.length - 1).geometry = geometryArray[geometryArray.length - 1].baseShape.innerPlanGeometry;
                }
            }
            if (isClose.isClose) {
                const firstGeometry = geometryArray[geometryArray.length - 1];
                const secondGeometry = geometryArray[isClose.index];
                this.that.corner(firstGeometry, secondGeometry);
                group.getObjectByName(isClose.index).geometry = geometryArray[isClose.index].baseShape.innerPlanGeometry;
                group.getObjectByName(geometryArray.length - 1).geometry = geometryArray[geometryArray.length - 1].baseShape.innerPlanGeometry;
                const allPoint = this.that.geometryArray.map((item, index) => item.baseShape.innerLine[3]);
                const planShape = new Shape(allPoint.slice(isClose.index));
                const plan = new Mesh(new ShapeBufferGeometry(planShape), new MeshLambertMaterial({
                    map: this.that.texture,
                    opacity: .35,
                    transparent: .2
                }));
                plan.position.z = -1;
                group.add(plan);
                const floorPlan = new Mesh(new ShapeBufferGeometry(planShape), new MeshLambertMaterial({color: 0x828282}));
                standbyGroup.add(floorPlan);
                this.style.cursor = 'default';
                this.that.isSecondDraw = !this.that.isSecondDraw;
                this.that.shapeToWall(this.that.geometryArray);
                this.removeEventListener('mousemove', this.that.onMouseMove, false);
                this.removeEventListener('mousedown', this.that.onSecondMouseDown, false);
                return;
            }
            this.that.baseShape = new BaseShape(this.that.object);
            // event.target.offsetParent.appendChild(this.that.baseShape.text);
            const {lineSlopeCalculate, vertexCalculate} = this.that.baseShape;


            this.that.vertex = vertexCalculate(point);
            this.that.lineSlope = lineSlopeCalculate(point);
            this.that.geometryArray.push({lineSlope: null, baseShape: this.that.baseShape});
            const shapeGeometry = new Mesh(this.that.geometryArray[this.that.geometryArray.length - 1].innerPlanGeometry, new MeshLambertMaterial({
                side: DoubleSide,
                color: 0x828282
            }));
            shapeGeometry.name = this.that.geometryArray.length - 1;
            shapeGeometry.matrixWorldNeedsUpdate = true;
            group.add(shapeGeometry);
            group.add(this.that.baseShape.line);
            this.addEventListener('mousemove', this.that.onMouseMove, false);
        }

        onMouseMove(event) {
            const point = this.that.transformCoordinate(event);
            this.that.adsorption(point);
            this.that.contener.appendChild(this.that.baseShape.text);
            const {innerPlanGeometry} = this.that.baseShape;
            const meshName = this.that.geometryArray.length - 1;
            this.that.vertex(point);
            this.that.lineSlope(point);
            this.that.geometryArray[meshName].lineSlope = this.that.lineSlope(point);
            group.getObjectByName(meshName).geometry = innerPlanGeometry;
            this.removeEventListener('mousedown', this.that.onMouseDown, false);
            this.addEventListener('mousedown', this.that.onSecondMouseDown, false);
        }

        sceneChange() {
            this.contener.style.display = 'block';
            camera = orthographicCamera;
            scene.remove(scene.getObjectByName('3DScene'));
            scene.add(group);
        }

        drawInnerLine() {
            if (eventType.isBind) {
                this.domElement.removeEventListener(eventType.type, eventType.mean, false);
            }
            this.sceneChange();
            this.domElement.addEventListener('mousedown', this.onMouseDown, false);
            this.bindEvent = !this.bindEvent;
            eventType.type = 'mousedown';
            eventType.mean = this.onMouseDown;
            eventType.isBind = true;
        }

        removeEvent() {
            this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
        }
    }

    class Model3DControl {
        constructor() {

        }

        on3DMouseDown(event) {
            var pointer = event.changedTouches ? event.changedTouches[0] : event;

            let obj = intersectObjects(pointer, scene.children);
            if (obj && obj.object.name === 'shafa') {
                obj.object.parent.parent.check();
                transformControl.attach(obj.object);
            }
        }
    }

    return {
        Initialization: Initialization,
        PointCircle: PointCircle,
        BaseShape: BaseShape,
        WallMesh: WallMesh,
        Room: Room,
        House: House,
        Floor: Floor,
        Roof: Roof,
        DrawControl: DrawControl,
        DoorFrame: DoorFrame,
        MarkLine: MarkLine,
        ModelObject: ModelObject3D,
        LoadObjMtlModel: LoadObjMtlModel,
    };
    // exports.Initialization = Initialization;
    // exports.PointCircle = PointCircle;
    // exports.BaseShape = BaseShape;
    // exports.WallMesh = WallMesh;
    // exports.Room = Room;
    // exports.House = House;
    // exports.Floor = Floor;
    // exports.Roof = Roof;
    // exports.DrawControl = DrawControl;
    // exports.DoorFrame = DoorFrame;
    // exports.MarkLine = MarkLine;
    // exports.ModelObject = ModelObject3D;
    // exports.LoadObjMtlModel = LoadObjMtlModel;
})(THREE);