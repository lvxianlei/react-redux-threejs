'use strict';
const THREE = require('three');

function findXYZ(model) {
    const array = model.geometry.attributes.position.array;
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    let minZ = 0;
    let maxZ = 0;
    let item = 0;
    let index = 0;
    for (let loop = 0; loop < array.length; loop++) {
        item = array[loop];

        index = loop + 1;
        if (index % 3 === 1) {
            if (array[loop] < minX) {
                minX = array[loop];
            }

            if (array[loop] > maxX) {
                maxX = array[loop];
            }
        }

        if (index % 3 === 2) {
            if (array[loop] < minY) {
                minY = array[loop];
            }

            if (array[loop] > maxY) {
                maxY = array[loop];
            }
        }

        if (index % 3 === 0) {
            if (array[loop] < minZ) {
                minZ = array[loop];
            }

            if (array[loop] > maxZ) {
                maxZ = array[loop];
            }
        }
    }

    return { minX, minY, minZ, maxX, maxY, maxZ };
}

const GizmoMaterial = function (parameters) {

    THREE.MeshBasicMaterial.call(this);

    this.depthTest = false;
    this.depthWrite = false;
    this.side = THREE.FrontSide;
    this.transparent = true;

    this.setValues(parameters);

    this.oldColor = this.color.clone();
    this.oldOpacity = this.opacity;

    this.highlight = function (highlighted) {

        if (highlighted) {

            this.color.setRGB(1, 1, 0);
            this.opacity = 1;

        } else {

            this.color.copy(this.oldColor);
            this.opacity = this.oldOpacity;

        }

    };

};

GizmoMaterial.prototype = Object.create(THREE.MeshBasicMaterial.prototype);
GizmoMaterial.prototype.constructor = GizmoMaterial;


const GizmoLineMaterial = function (parameters) {

    THREE.LineDashedMaterial.call(this);

    this.depthTest = false;
    this.depthWrite = false;
    this.transparent = true;
    this.linewidth = 1;

    this.setValues(parameters);

    this.oldColor = this.color.clone();
    this.oldOpacity = this.opacity;

    this.highlight = function (highlighted) {
        console.log('GizmoLineMaterial->highlight');
        if (highlighted) {

            this.color.setRGB(1, 1, 0);
            this.opacity = 1;

        } else {

            this.color.copy(this.oldColor);
            this.opacity = this.oldOpacity;

        }

    };

};

GizmoLineMaterial.prototype = Object.create(THREE.LineDashedMaterial.prototype);
GizmoLineMaterial.prototype.constructor = GizmoLineMaterial;

class InteractiveContainer {
    constructor() {
        this.model = null;
        this.frame = null;
        this.circle = null;
    }

    setModel(model) {
        const group = new THREE.Group();
        this.model = model;
        const array = model.geometry.attributes.position.array;
        const vector = this.findXYZ(array);
        const r = (vector.maxX - vector.minX) * 0.65;
        const lr = { x: r * 1.2, y: vector.maxY * 1.2, z: r * 1.2, r };

        this.frame = new DottedLineFrame(vector);
        this.circle = new DottedLineCircle(r);
        this.circle.addCircleGeometry(r);
        this.circle.addDottedine(lr);
        this.circle.addTriangelShape(lr);

        group.add(this.frame);
        group.add(this.circle);
        return group;
    }

    findXYZ(array) {
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;
        let minZ = 0;
        let maxZ = 0;
        let item = 0;
        let index = 0;
        for (let loop = 0; loop < array.length; loop++) {
            item = array[loop];

            index = loop + 1;
            if (index % 3 === 1) {
                if (array[loop] < minX) {
                    minX = array[loop];
                }

                if (array[loop] > maxX) {
                    maxX = array[loop];
                }
            }

            if (index % 3 === 2) {
                if (array[loop] < minY) {
                    minY = array[loop];
                }

                if (array[loop] > maxY) {
                    maxY = array[loop];
                }
            }

            if (index % 3 === 0) {
                if (array[loop] < minZ) {
                    minZ = array[loop];
                }

                if (array[loop] > maxZ) {
                    maxZ = array[loop];
                }
            }
        }

        return { minX, minY, minZ, maxX, maxY, maxZ };
    }

    clear() {
        this.model = null;
    }
}

// 虚线框
class DottedLineFrame extends THREE.Group {
    constructor(v) {
        super();
        const geometryCube = this.createCubeBox(v);
        geometryCube.computeLineDistances();
        let object = new THREE.LineSegments(geometryCube, new THREE.LineDashedMaterial({
            color: 0x0000ff,
            dashSize: 20,
            gapSize: 10,
            linewidth: 1
        }));
        this.add(object);
    }

    createCubeBox(vector) {

        const geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(vector.minX, vector.minY, vector.minZ),
            new THREE.Vector3(vector.minX, vector.maxY, vector.minZ),
            new THREE.Vector3(vector.minX, vector.maxY, vector.minZ),
            new THREE.Vector3(vector.maxX, vector.maxY, vector.minZ),
            new THREE.Vector3(vector.maxX, vector.maxY, vector.minZ),
            new THREE.Vector3(vector.maxX, vector.minY, vector.minZ),
            new THREE.Vector3(vector.maxX, vector.minY, vector.minZ),
            new THREE.Vector3(vector.minX, vector.minY, vector.minZ),
            new THREE.Vector3(vector.minX, vector.minY, vector.maxZ),
            new THREE.Vector3(vector.minX, vector.maxY, vector.maxZ),
            new THREE.Vector3(vector.minX, vector.maxY, vector.maxZ),
            new THREE.Vector3(vector.maxX, vector.maxY, vector.maxZ),
            new THREE.Vector3(vector.maxX, vector.maxY, vector.maxZ),
            new THREE.Vector3(vector.maxX, vector.minY, vector.maxZ),
            new THREE.Vector3(vector.maxX, vector.minY, vector.maxZ),
            new THREE.Vector3(vector.minX, vector.minY, vector.maxZ),
            new THREE.Vector3(vector.minX, vector.minY, vector.minZ),
            new THREE.Vector3(vector.minX, vector.minY, vector.maxZ),
            new THREE.Vector3(vector.minX, vector.maxY, vector.minZ),
            new THREE.Vector3(vector.minX, vector.maxY, vector.maxZ),
            new THREE.Vector3(vector.maxX, vector.maxY, vector.minZ),
            new THREE.Vector3(vector.maxX, vector.maxY, vector.maxZ),
            new THREE.Vector3(vector.maxX, vector.minY, vector.minZ),
            new THREE.Vector3(vector.maxX, vector.minY, vector.maxZ)
        );
        return geometry;
    }

}

// 交互圆
class DottedLineCircle extends THREE.Group {
    constructor(radius) {
        super();
        this.r = radius;
    }

    addCircleGeometry(r) {
        let circleGeometry = new THREE.CircleGeometry(r, r / 2);
        circleGeometry.vertices.shift();
        circleGeometry.computeLineDistances();
        let circleObject = new THREE.Line(circleGeometry, new GizmoLineMaterial({
            color: 0xffff00,
            dashSize: 50,
            gapSize: 50
        }));

        circleObject.rotation.x = -(Math.PI / 2);
        // circleObject.renderOrder = 99999;
        // circleObject.onBeforeRender = function (render) {
        //     render.clearDepth();
        // };

        this.add(circleObject);
    }

    createTriangelShape(name, shape, color, x, y, z, rx, ry, rz, s) {
        let geometry = new THREE.ShapeBufferGeometry(shape);

        let mesh = new THREE.Mesh(geometry, new GizmoMaterial({
            color, //0xffff00,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        }));
        mesh.name = name;
        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        mesh.scale.set(s, s, s);
        this.add(mesh);
    }

    addTriangelShape(vector) {
        // Y+
        let r = 100;
        let color = 0xff0000;
        let triangleShape = new THREE.Shape();
        triangleShape.moveTo(-r, 0);
        triangleShape.lineTo(r, 0);
        triangleShape.lineTo(0, r);
        triangleShape.lineTo(-r, 0); // close path
        this.createTriangelShape('Y', triangleShape, color, 0, vector.y + r * 2, 0, 0, 0, 0, 1);
        // this.createTriangelShape('y-', triangleShape, color, 0, vector.y + r * 1.5, 0, -(Math.PI), 0, 0, 1);

        // X+
        let triangleShapeX = new THREE.Shape();
        triangleShapeX.moveTo(0, -r);
        triangleShapeX.lineTo(0, r);
        triangleShapeX.lineTo(r, 0);
        triangleShapeX.lineTo(0, -r); // close path
        this.createTriangelShape('X', triangleShapeX, color, vector.x, 0, 0, -(Math.PI / 2), 0, 0, 1);

        // X-
        let triangleShapeXL = new THREE.Shape();
        triangleShapeXL.moveTo(0, -r);
        triangleShapeXL.lineTo(0, r);
        triangleShapeXL.lineTo(-r, 0);
        triangleShapeXL.lineTo(0, -r); // close path
        // this.createTriangelShape('x-', triangleShapeXL, color, -vector.x, 0, 0, -(Math.PI / 2), 0, 0, 1);

        // Z+
        let triangleShapeZ = new THREE.Shape();
        triangleShapeZ.moveTo(-r, 0);
        triangleShapeZ.lineTo(r, 0);
        triangleShapeZ.lineTo(0, r);
        triangleShapeZ.lineTo(-r, 0); // close path
        this.createTriangelShape('Z', triangleShapeZ, color, 0, 0, vector.z, (Math.PI / 2), 0, 0, 1);

        // Z-
        let triangleShapeZF = new THREE.Shape();
        triangleShapeZF.moveTo(-r, 0);
        triangleShapeZF.lineTo(r, 0);
        triangleShapeZF.lineTo(0, r);
        triangleShapeZF.lineTo(-r, 0); // close path
        // this.createTriangelShape('z-', triangleShapeZF, color, 0, 0, -vector.z, -(Math.PI / 2), 0, 0, 1);

        // triangle-
        let triangleShapeTri = new THREE.Shape();
        // 圆点 x = 0, y = 0
        // x1 = x + r * cos(angle)
        // y1 = y + r * sin(angle)
        let ta = 43 * Math.PI / 180;
        let Tx = vector.r * Math.cos(ta);
        let Ty = vector.r * Math.sin(ta);
        triangleShapeTri.moveTo(-r, 0);
        triangleShapeTri.lineTo(r, 0);
        triangleShapeTri.lineTo(0, r);
        triangleShapeTri.lineTo(-r, 0); // close path
        this.createTriangelShape('xz+', triangleShapeTri, color, -Tx, 0, Ty, -(Math.PI / 2), 0, Math.PI / 180 * 45, 1);
        this.createTriangelShape('xz-', triangleShapeTri, color, Tx, 0, -Ty, (Math.PI / 2), 0, -Math.PI / 180 * 45, 1);
        // triangle-
        let triangleShapeTriF = new THREE.Shape();
        let taf = 47 * Math.PI / 180;
        let Txf = vector.r * Math.cos(taf);
        let Tyf = vector.r * Math.sin(taf);
        triangleShapeTriF.moveTo(-r, 0);
        triangleShapeTriF.lineTo(r, 0);
        triangleShapeTriF.lineTo(0, r);
        triangleShapeTriF.lineTo(-r, 0); // close path
        this.createTriangelShape('xzf1', triangleShapeTriF, color, -Txf, 0, Tyf, (Math.PI / 2), 0, -(Math.PI / 180 * 45), 1);
        this.createTriangelShape('xzf2', triangleShapeTri, color, Txf, 0, -Tyf, -(Math.PI / 2), 0, Math.PI / 180 * 45, 1);

    }

    addDottedine(v) {
        let lineR = v.x;
        let lineGeometryX = new THREE.Geometry();
        let material = new GizmoLineMaterial({
            color: 0xffff00,
            dashSize: 20,
            gapSize: 20,
            linewidth: 1
        });

        // -x -> x
        lineGeometryX.vertices.push(new THREE.Vector3(-lineR, 0, 0));
        lineGeometryX.vertices.push(new THREE.Vector3(lineR, 0, 0));
        lineGeometryX.computeLineDistances();
        let lineX = new THREE.Line(lineGeometryX, material);
        // lineX.renderOrder = 99999;

        // lineX.onBeforeRender = function (renderer) { renderer.clearDepth(); };
        this.add(lineX);

        // y 
        let lineGeometryY = new THREE.Geometry();
        lineGeometryY.vertices.push(new THREE.Vector3(0, 0, 0));
        lineGeometryY.vertices.push(new THREE.Vector3(0, v.y, 0));
        lineGeometryY.computeLineDistances();
        let lineY = new THREE.Line(lineGeometryY, material);
        // lineY.renderOrder = 99999;
        // lineY.onBeforeRender = function (renderer) { renderer.clearDepth(); };
        this.add(lineY);

        // -z -> z
        let lineGeometryZ = new THREE.Geometry();
        lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, -lineR));
        lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, lineR));
        lineGeometryZ.computeLineDistances();
        let lineZ = new THREE.Line(lineGeometryZ, material);
        // lineZ.renderOrder = 99999;
        // lineZ.onBeforeRender = function (renderer) { renderer.clearDepth(); };
        this.add(lineZ);
    }
}

const pickerMaterial = new GizmoMaterial({
    visible: true,
    transparent: false
});


THREE.TransformGizmo = function () {

    this.init = function (model) {

        THREE.Object3D.call(this);

        this.handles = new THREE.Object3D();
        this.pickers = new THREE.Object3D();
        this.planes = new THREE.Object3D();

        // this.add(this.handles);
        // this.add(this.pickers);
        // this.add(this.planes);

        //// PLANES

        const planeGeometry = new THREE.PlaneBufferGeometry(3400, 3400, 2, 2);
        const planeMaterial = new THREE.MeshBasicMaterial({
            visible: false,
            side: THREE.DoubleSide,
            color: 0xff0000
        });

        const planes = {
            "XY": new THREE.Mesh(planeGeometry, planeMaterial),
            "YZ": new THREE.Mesh(planeGeometry, planeMaterial),
            "XZ": new THREE.Mesh(planeGeometry, planeMaterial),
            "XYZE": new THREE.Mesh(planeGeometry, planeMaterial)
        };

        this.activePlane = planes["XYZE"];

        planes["YZ"].rotation.set(0, Math.PI / 2, 0);
        planes["XZ"].rotation.set(-Math.PI / 2, 0, 0);

        for (let i in planes) {

            planes[i].name = i;
            this.planes.add(planes[i]);
            this.planes[i] = planes[i];

        }

        //// HANDLES AND PICKERS

        const setupGizmos = function (gizmoMap, parent) {

            let object = null;
            let position = null;
            let rotation = null;

            for (let name in gizmoMap) {

                for (let i = gizmoMap[name].length; i--;) {

                    object = gizmoMap[name][i][0];
                    position = gizmoMap[name][i][1];
                    rotation = gizmoMap[name][i][2];

                    object.name = name;

                    if (position) object.position.set(position[0], position[1], position[2]);
                    if (rotation) object.rotation.set(rotation[0], rotation[1], rotation[2]);

                    parent.add(object);

                }

            }

        };

        setupGizmos(this.pickerGizmos, this.pickers);

        model.parent.add(this.pickers);
        model.parent.add(this.planes);

        // reset Transformations
        this.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.updateMatrix();

                let tempGeometry = child.geometry.clone();
                tempGeometry.applyMatrix(child.matrix);
                child.geometry = tempGeometry;

                child.position.set(0, 0, 0);
                child.rotation.set(0, 0, 0);
                child.scale.set(1, 1, 1);

            }

        });

    };

    this.highlight = function (axis) {

        this.traverse(function (child) {

            if (child.material && child.material.highlight) {
                if (child.name === axis) {
                    child.material.highlight(true);
                } else {
                    child.material.highlight(false);
                }
            }

        });

    };

};

THREE.TransformGizmo.prototype = Object.create(THREE.Object3D.prototype);
THREE.TransformGizmo.prototype.constructor = THREE.TransformGizmo;

THREE.TransformGizmo.prototype.update = function (rotation, eye) {

    let vec1 = new THREE.Vector3(0, 0, 0);
    let vec2 = new THREE.Vector3(0, 1, 0);
    let lookAtMatrix = new THREE.Matrix4();

    this.traverse(function (child) {

        if (child.name.search("X") !== -1) {

            child.quaternion.setFromRotationMatrix(lookAtMatrix.lookAt(eye, vec1, vec2));

        } else if (child.name.search("X") !== -1 || child.name.search("Y") !== -1 || child.name.search("Z") !== -1) {

            child.quaternion.setFromEuler(rotation);

        }

    });

};

THREE.TransformGizmoTranslate = function (model) {

    THREE.TransformGizmo.call(this);

    this.pickerGizmos = {

        // X: [
        //     [new THREE.Mesh(new THREE.CylinderBufferGeometry(100, 0, 1410, 4, 1, false), pickerMaterial), [1410 / 2, 0, 0],
        //     [0, 0, -Math.PI / 2]
        //     ]
        // ],

        // Y: [
        //     [new THREE.Mesh(new THREE.CylinderBufferGeometry(100, 0, 1100, 4, 1, false), pickerMaterial), [0, 1100 / 2, 0]]
        // ],

        // Z: [
        //     [new THREE.Mesh(new THREE.CylinderBufferGeometry(100, 0, 1410, 4, 1, false), pickerMaterial), [0, 0, 1410 / 2],
        //     [Math.PI / 2, 0, 0]
        //     ]
        // ],
        // XYZ: [
        //     [new THREE.Mesh(new THREE.OctahedronGeometry(100, 0), pickerMaterial)]
        // ],
    };

    this.setActivePlane = function (axis, eye) {

        let tempMatrix = new THREE.Matrix4();
        eye.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(this.planes["XY"].matrixWorld)));

        if (axis === "X") {

            this.activePlane = this.planes["XY"];

            if (Math.abs(eye.y) > Math.abs(eye.z)) {
                this.activePlane = this.planes["XZ"];
            }

        }

        if (axis === "Y") {

            this.activePlane = this.planes["XY"];

            if (Math.abs(eye.x) > Math.abs(eye.z)) {
                this.activePlane = this.planes["YZ"];
            }

        }

        if (axis === "Z") {

            this.activePlane = this.planes["XZ"];

            if (Math.abs(eye.x) > Math.abs(eye.y)) {
                this.activePlane = this.planes["YZ"];
            }

        }

        if (axis === "XYZ") this.activePlane = this.planes["XYZE"];

        if (axis === "XY") this.activePlane = this.planes["XY"];

        if (axis === "YZ") this.activePlane = this.planes["YZ"];

        if (axis === "XZ") this.activePlane = this.planes["XZ"];
    };

    this.init(model);

};

THREE.TransformGizmoTranslate.prototype = Object.create(THREE.TransformGizmo.prototype);
THREE.TransformGizmoTranslate.prototype.constructor = THREE.TransformGizmoTranslate;

THREE.TransformControls = function (camera, domElement) {

    // TODO: Make non-uniform scale and rotate play nice in hierarchies
    // TODO: ADD RXYZ contol

    THREE.Object3D.call(this);

    domElement = (domElement !== undefined) ? domElement : document;

    this.object = undefined;
    this.visible = false;
    this.translationSnap = null;
    this.rotationSnap = null;
    this.space = "world";
    this.size = 1;
    this.axis = null;

    const scope = this;

    let _mode = "translate";
    let _dragging = false;
    let _gizmo = {

    };

    const changeEvent = {
        type: "change"
    };
    const mouseDownEvent = {
        type: "mouseDown"
    };
    const mouseUpEvent = {
        type: "mouseUp",
        mode: _mode
    };
    const objectChangeEvent = {
        type: "objectChange"
    };

    const element = domElement;
    let prevTime = performance.now();
    const velocity = new THREE.Vector3(0, 0, 0);
    const direction = new THREE.Vector3();
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    const pitchObject = new THREE.Object3D();
    const yawObject = new THREE.Object3D();
    const PI_2 = Math.PI / 2;


    // yawObject.position.y = 10;
    yawObject.add(pitchObject);
    let oldCameraPosition = camera.position.clone();
    camera.position.set(0, 0, 0);

    camera.rotation.set(0, 0, 0);

    pitchObject.add(camera);
    yawObject.position.set(0, 1000, 2000);

    const ray = new THREE.Raycaster();
    const pointerVector = new THREE.Vector2();

    const point = new THREE.Vector3();
    const offset = new THREE.Vector3();

    const rotation = new THREE.Vector3();
    const offsetRotation = new THREE.Vector3();
    let scale = 1;

    const lookAtMatrix = new THREE.Matrix4();
    const eye = new THREE.Vector3();

    const tempMatrix = new THREE.Matrix4();
    const tempVector = new THREE.Vector3();
    const tempQuaternion = new THREE.Quaternion();
    const unitX = new THREE.Vector3(1, 0, 0);
    const unitY = new THREE.Vector3(0, 1, 0);
    const unitZ = new THREE.Vector3(0, 0, 1);

    const quaternionXYZ = new THREE.Quaternion();
    const quaternionX = new THREE.Quaternion();
    const quaternionY = new THREE.Quaternion();
    const quaternionZ = new THREE.Quaternion();
    const quaternionE = new THREE.Quaternion();

    const oldPosition = new THREE.Vector3();
    const oldScale = new THREE.Vector3();
    const oldRotationMatrix = new THREE.Matrix4();

    const parentRotationMatrix = new THREE.Matrix4();
    const parentScale = new THREE.Vector3();

    const worldPosition = new THREE.Vector3();
    const worldRotation = new THREE.Euler();
    const worldRotationMatrix = new THREE.Matrix4();
    const camPosition = new THREE.Vector3();
    const camRotation = new THREE.Euler();
    /*-----------摄像机----------*/
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);

    // domElement.addEventListener('mousemove', onMouseMove, false);
    // domElement.addEventListener('mousedown', onMouseDown, false);
    // domElement.addEventListener('mouseup', onMouseUp, false);

    /*-----------物体----------*/
    domElement.addEventListener("mousedown", onPointerDown, false);
    domElement.addEventListener("touchstart", onPointerDown, false);

    domElement.addEventListener("mousemove", onPointerHover, false);
    domElement.addEventListener("touchmove", onPointerHover, false);

    domElement.addEventListener("mousemove", onPointerMove, false);
    domElement.addEventListener("touchmove", onPointerMove, false);

    domElement.addEventListener("mouseup", onPointerUp, false);
    domElement.addEventListener("mouseout", onPointerUp, false);
    domElement.addEventListener("touchend", onPointerUp, false);
    domElement.addEventListener("touchcancel", onPointerUp, false);
    domElement.addEventListener("touchleave", onPointerUp, false);

    this.enabled = false;

    this.dispose = function () {
        window.removeEventListener('keydown', onKeyDown, false);
        window.removeEventListener('keyup', onKeyUp, false);

        // domElement.removeEventListener('mousemove', onMouseMove, false);
        // domElement.removeEventListener('mousedown', onMouseDown, false);
        // domElement.removeEventListener('mouseup', onMouseUp, false);

        domElement.removeEventListener("mousedown", onPointerDown);
        domElement.removeEventListener("touchstart", onPointerDown);

        domElement.removeEventListener("mousemove", onPointerHover);
        domElement.removeEventListener("touchmove", onPointerHover);

        domElement.removeEventListener("mousemove", onPointerMove);
        domElement.removeEventListener("touchmove", onPointerMove);

        domElement.removeEventListener("mouseup", onPointerUp);
        domElement.removeEventListener("mouseout", onPointerUp);
        domElement.removeEventListener("touchend", onPointerUp);
        domElement.removeEventListener("touchcancel", onPointerUp);
        domElement.removeEventListener("touchleave", onPointerUp);

    };

    this.attach = function (object) {
        // TODO 删除上一个模型的辅助线
        if (this.object === object) return;

        _gizmo['translate'] = new THREE.TransformGizmoTranslate(object);
        this.add(_gizmo['translate']);

        this.object = object;
        this.visible = true;
        this.update();

    };

    this.detach = function () {

        this.object = undefined;
        this.visible = false;
        this.axis = null;

    };

    this.getMode = function () {

        return _mode;

    };

    this.setMode = function (mode) {

        _mode = mode ? mode : _mode;

        // if (_mode === "scale") scope.space = "local";

        for (let type in _gizmo) _gizmo[type].visible = (type === _mode);

        this.update();
        scope.dispatchEvent(changeEvent);

    };

    this.setTranslationSnap = function (translationSnap) {

        scope.translationSnap = translationSnap;

    };

    this.setRotationSnap = function (rotationSnap) {

        scope.rotationSnap = rotationSnap;

    };

    this.setSize = function (size) {

        scope.size = size;
        this.update();
        scope.dispatchEvent(changeEvent);

    };

    this.setSpace = function (space) {

        scope.space = space;
        this.update();
        scope.dispatchEvent(changeEvent);

    };

    this.update = function () {

        if (scope.object === undefined) return;

        scope.object.updateMatrixWorld();
        worldPosition.setFromMatrixPosition(scope.object.matrixWorld);
        worldRotation.setFromRotationMatrix(tempMatrix.extractRotation(scope.object.matrixWorld));

        camera.updateMatrixWorld();
        camPosition.setFromMatrixPosition(camera.matrixWorld);
        camRotation.setFromRotationMatrix(tempMatrix.extractRotation(camera.matrixWorld));

        scale = worldPosition.distanceTo(camPosition) / 6 * scope.size;
        this.position.copy(worldPosition);
        this.scale.set(scale, scale, scale);

        if (camera instanceof THREE.PerspectiveCamera) {

            eye.copy(camPosition).sub(worldPosition).normalize();

        } else if (camera instanceof THREE.OrthographicCamera) {

            eye.copy(camPosition).normalize();

        }

        // if (scope.space === "local") {

        //     _gizmo[_mode].update(worldRotation, eye);

        // } else if (scope.space === "world") {

        //     _gizmo[_mode].update(new THREE.Euler(), eye);

        // }
        _gizmo[_mode].update(new THREE.Euler(), eye);
        _gizmo[_mode].highlight(scope.axis);

    };

    this.cameraUpdate = function () {

        let time = performance.now();
        let delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 5.0 * delta;
        velocity.z -= velocity.z * 5.0 * delta;

        // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) {
            velocity.z -= direction.z * 400.0 * delta;
        }
        if (moveLeft || moveRight) {
            velocity.x -= direction.x * 400.0 * delta;
        }

        yawObject.translateX(velocity.x * delta * 20);
        yawObject.translateZ(velocity.z * delta * 20);

        prevTime = time;
    };

    this.getObject = function () {
        return yawObject;
    };

    this.getDirection = function () {
        // assumes the camera itself is not rotated
        let direction = new THREE.Vector3(0, 0, -1);
        let rotation = new THREE.Euler(0, 0, 0, "YXZ");

        return function (v) {
            rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
            v.copy(direction).applyEuler(rotation);
            return v;
        };
    }();

    function onKeyDown(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;
        }
    }

    function onKeyUp(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }
    }

    // function onMouseMove(event) {

    //     if (scope.enabled === false) return;

    //     let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    //     let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    //     yawObject.rotation.y += movementX * 0.002;  // 摄像机旋转
    //     pitchObject.rotation.x += movementY * 0.002;

    //     pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));

    // }

    // function onMouseDown(event) {
    //     if (event.buttons === 1) {
    //         scope.enabled = true;
    //     }
    // }

    // function onMouseUp(event) {
    //     scope.enabled = false;
    // }

    function onPointerHover(event) {

        if (scope.object === undefined || _dragging === true || (event.button !== undefined && event.button !== 0)) return;

        let pointer = event.changedTouches ? event.changedTouches[0] : event;
        let objects = scope.object.parent.children[2];

        let intersect = intersectObjects(pointer, objects.children);

        let axis = null;

        if (intersect) {
            axis = intersect.object.name;
            event.preventDefault();
        }

        if (scope.axis !== axis) {
            scope.axis = axis;
            scope.update();
            scope.dispatchEvent(changeEvent);
        }
    }

    function onPointerDown(event) {

        if (event.button !== undefined && event.button !== 0) return;

        if (scope.object === undefined) {
            scope.enabled = true;
            return;
        }

        if (_dragging === true) {
            return;
        }

        let pointer = event.changedTouches ? event.changedTouches[0] : event;

        let objects = scope.object.parent.children[2];

        let intersect = intersectObjects(pointer, objects.children);

        if (intersect) {

            event.preventDefault();
            event.stopPropagation();

            scope.dispatchEvent(mouseDownEvent);

            scope.axis = intersect.object.name;

            scope.update();

            eye.copy(camPosition).sub(worldPosition).normalize();

            _gizmo[_mode].setActivePlane(scope.axis, eye);

            let planeIntersect = intersectObjects(pointer, [_gizmo[_mode].activePlane]);

            if (planeIntersect) {

                oldPosition.copy(scope.object.position);
                oldScale.copy(scope.object.scale);

                oldRotationMatrix.extractRotation(scope.object.matrix);
                worldRotationMatrix.extractRotation(scope.object.matrixWorld);

                parentRotationMatrix.extractRotation(scope.object.parent.matrixWorld);
                parentScale.setFromMatrixScale(tempMatrix.getInverse(scope.object.parent.matrixWorld));

                offset.copy(planeIntersect.point);
                _dragging = true;
            }
        } else {
            scope.enabled = true;
        }
    }

    function onPointerMove(event) {

        if (event.button !== undefined && event.button !== 0) return;

        let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        if (scope.object === undefined || scope.axis === null || _dragging === false) {
            // if (scope.enabled) {
            //     yawObject.rotation.y += movementX * 0.002;
            //     pitchObject.rotation.x += movementY * 0.002;
            //     pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
            // }

            return;
        }

        let pointer = event.changedTouches ? event.changedTouches[0] : event;


        let planeIntersect = intersectObjects(pointer, [_gizmo[_mode].activePlane]);

        if (planeIntersect === false) return;

        event.preventDefault();
        event.stopPropagation();

        point.copy(planeIntersect.point);

        if (_mode === "translate") {

            point.sub(offset);
            point.multiply(parentScale);

            if (scope.space === "world" || scope.axis.search("XYZ") !== -1) {

                if (scope.axis.search("X") === -1) point.x = 0;
                if (scope.axis.search("Y") === -1) point.y = 0;
                if (scope.axis.search("Z") === -1) point.z = 0;

                point.applyMatrix4(tempMatrix.getInverse(parentRotationMatrix));

                scope.object.parent.position.copy(oldPosition);
                scope.object.parent.position.add(point);

            }
        }

        scope.update();
        scope.dispatchEvent(changeEvent);
        scope.dispatchEvent(objectChangeEvent);

    }

    function onPointerUp(event) {

        event.preventDefault(); // Prevent MouseEvent on mobile

        if (event.button !== undefined && event.button !== 0) return;

        if (scope.enabled) {
            scope.enabled = false;
        }

        if (_dragging && (scope.axis !== null)) {

            mouseUpEvent.mode = _mode;
            scope.dispatchEvent(mouseUpEvent);

        }

        _dragging = false;

        if ('TouchEvent' in window && event instanceof TouchEvent) {

            // Force "rollover"

            scope.axis = null;
            scope.update();
            scope.dispatchEvent(changeEvent);

        } else {
            onPointerHover(event);
        }

    }

    function intersectObjects(pointer, objects) {

        let rect = domElement.getBoundingClientRect();
        let x = (pointer.clientX - rect.left) / rect.width;
        let y = (pointer.clientY - rect.top) / rect.height;

        pointerVector.set((x * 2) - 1, -(y * 2) + 1);

        ray.setFromCamera(pointerVector, camera);

        let intersections = ray.intersectObjects(objects, true);

        return intersections[0] ? intersections[0] : false;

    }

};

THREE.TransformControls.prototype = Object.create(THREE.Object3D.prototype);
THREE.TransformControls.prototype.constructor = THREE.TransformControls;

class ModelObject3D extends THREE.Object3D {

    constructor() {
        super();
        this._obj = null;
    }

    addModel(model) {
        let isObject = model instanceof THREE.Object3D;
        if (!isObject) {
            console.error('BIM:ModelObject.addModel: The parameters must be THREE.Object3D classes');
            return;
        }

        model.children[0].name = 'shafa';
        this._obj = model.children[0];
        this.add(model);
    }

    check() {
        let container = new InteractiveContainer();

        let fz = container.setModel(this._obj);
        this._obj.parent.add(...fz.children);
    }

    dispose() {
        // TODO删除辅助模型
    }
}
THREE.ModelObject3D = ModelObject3D;

