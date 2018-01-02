/**
 * Created by lvxianlei on 17/4/10.
 */
const THREE = require('three');

function wall(width, height, depth, x, y, z, rotationx, rotationy, rotationz, floor) {
    var cubeGeometry = new THREE.BoxGeometry(width, height, depth);
    var matArray, cube;
    if (floor === undefined) {
        matArray = [];
        matArray.push(new THREE.MeshLambertMaterial({
            color: 0xffffff
        }));
        matArray.push(new THREE.MeshLambertMaterial({
            color: 0xffffff
        }));
        matArray.push(new THREE.MeshLambertMaterial({
            color: 0xffffff
        }));
        matArray.push(new THREE.MeshLambertMaterial({
            color: 0xffffff
        }));
        matArray.push(new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('/src/img/wall.jpg')
        }));
        matArray.push(new THREE.MeshLambertMaterial({
            color: 0xffffff
        }));
    } else {
        matArray = new THREE.MeshLambertMaterial({
            color: 0xFFE4B5
        });
    }
    if (matArray.length > 0) {
        var faceMaterial = new THREE.MultiMaterial(matArray);
        cube = new THREE.Mesh(cubeGeometry, faceMaterial);
        cube.rotation.x = rotationx;
        cube.rotation.y = rotationy;
        cube.rotation.z = rotationz;
        cube.position.z = z;
        cube.position.y = y;
        cube.position.x = x;
    } else {
        cube = new THREE.Mesh(cubeGeometry, matArray);
        cube.rotation.x = rotationx;
        cube.rotation.y = rotationy;
        cube.rotation.z = rotationz;
        cube.position.z = z;
        cube.position.y = y;
        cube.position.x = x;
    }

    return cube;
}

function createRoom(width, height, callBack) {
    var rooms = [];
    var depth = 10;
    var cube = wall(width, height, depth, width / 2, height / 2, depth / 2, 0, 0, 0);
    var cubeFloor = wall(width, 20, 2, width / 2, 10, 11, 0, 0, 0, 'floor');
    rooms.push(cube);
    rooms.push(cubeFloor);

    var leftCube = wall(width, height, depth, 5, height / 2, width / 2, 0, 0.5 * Math.PI, 0);
    leftCube.name = 'left';
    var leftFloor = wall(width, 20, 2, 11, 10, width / 2, 0, 0.5 * Math.PI, 0, 'floor');
    rooms.push(leftCube);
    rooms.push(leftFloor);

    var rightCube = wall(width, height, depth, width - depth / 2, height / 2, width / 2, 0, 0.5 * Math.PI, 0);
    rooms.push(rightCube);

    // var topCube = wall(width, width - depth, depth, width / 2 , height - 5, width / 2 + depth / 2, 0.5 * Math.PI, 0, 0);
    // rooms.push(topCube);

    var plan = new THREE.PlaneGeometry(800, 800);
    var topPlan = new THREE.PlaneGeometry(800, 800);

    var texture = new THREE.TextureLoader().load('/src/img/floor.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);

    var material = new THREE.MeshPhongMaterial({
        map: texture,
    });

    plan = new THREE.Mesh(plan, material);
    topPlan = new THREE.Mesh(topPlan, material);
    plan.position.x = 400;
    topPlan.position.x = 400;
    plan.position.y = 0;
    topPlan.position.y = height;
    plan.position.z = 400;
    topPlan.position.z = 400;
    plan.rotation.x = -0.5 * Math.PI;
    topPlan.rotation.x = 0.5 * Math.PI;
    rooms.push(plan);
    rooms.push(topPlan);
    callBack && callBack(rooms);
}

function ArrowHelper(option) {
    let arrowGroup = new THREE.Object3D();
    let dir = new THREE.Vector3(20, 0, 0);
    let origin = new THREE.Vector3(option.x, option.y, option.z);
    let length = 100;
    let hex = 0x000000;
    let dir2 = new THREE.Vector3(0, 20, 0);
    let dir3 = new THREE.Vector3(0, 0, 20);
    let arrowHelper1 = new THREE.ArrowHelper(dir.normalize(), origin, length, hex);
    let arrowHelper2 = new THREE.ArrowHelper(dir2.normalize(), origin, length, hex);
    let arrowHelper3 = new THREE.ArrowHelper(dir3.normalize(), origin, length, hex);
    arrowGroup.add(arrowHelper1);
    arrowGroup.add(arrowHelper2);
    arrowGroup.add(arrowHelper3);
    return arrowGroup;
}

function loaderOBJ(mtlURL, objURL, onSuccess, onProgress, onError) {
    let mtlLoader = new THREE.MTLLoader();
    const regExp = /^(\/src\/img\/)?(.*\/)?(.*)/;
    const needURL = regExp.exec(mtlURL)[1] === undefined ? regExp.exec(mtlURL)[2] === undefined ? '/src/img/' : '/src/img/' + regExp.exec(objURL)[2] : '/src/img/' + regExp.exec(objURL)[2];
    const regObjURL = regExp.exec(objURL)[1] === undefined ? '/src/img/' + regExp.exec(objURL)[2] + regExp.exec(objURL)[3] : objURL;
    // console.log('regExp----URL', needURL, '------', regExp.exec(mtlURL), '-------', regExp.exec(objURL)[3],'---regObjURL',regObjURL);
    mtlLoader.setPath(needURL);
    // console.log(regExp.exec(mtlURL)[3]);
    mtlLoader.load(regExp.exec(mtlURL)[3], function (materials) {
        materials.preload();
        let loader = new THREE.OBJLoader();
        loader.setPath(needURL);
        loader.setMaterials(materials);
        loader.load(regExp.exec(objURL)[3], mesh => {
            mesh.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.side = THREE.DoubleSide;
                }
            });
            onSuccess && onSuccess(mesh);
        }, onProgress, onError);
    }, onProgress, onError);
}

function stretch(x1, x2, x3, dePath) {

    x1 = new THREE.Vector3(x1.x, x1.y, 0);
    x2 = new THREE.Vector3(x2.x, x2.y, 0);
    x3 = new THREE.Vector3(x3.x, x3.y, 0);
    let a;
    let b;
    a = x2.clone().sub(x1.clone());
    b = x2.clone().sub(x3.clone());

    let c = a.clone().normalize();
    let d = b.clone().normalize();

    let direction = (c.add(d).normalize());
    let d1 = new THREE.Vector3(direction.x, direction.y, 0);
    let d2 = new THREE.Vector3(b.x, b.y, 0);

    let myAngle = d1.angleTo(d2) / Math.PI * 180;

    let mathAngle = Math.abs(myAngle);
    let strDistance = dePath / (Math.sin(2 * Math.PI / 360 * mathAngle));

    return x2.add(new THREE.Vector3(direction.x * strDistance, direction.y * strDistance, 0));
}

function createWall(firstPoint, secondPoint, sence) {
    let targetPointX = (firstPoint.x + secondPoint.x) / 2;
    let targetPointY = (firstPoint.y + secondPoint.y) / 2;
    let targetScale = Math.sqrt((firstPoint.x - secondPoint.x) * (firstPoint.x - secondPoint.x) + (firstPoint.y - secondPoint.y) * (firstPoint.y - secondPoint.y));
    let dLine = new THREE.Vector3((secondPoint.x - firstPoint.x), (secondPoint.y - firstPoint.y), 0);
    //console.log(dLine);
    let dLine_init = new THREE.Vector3(1, 0, 0);
    // let targetRotation = Math.abs(dLine_init.angleTo(dLine));
    let targetRotation = dLine.angleTo(dLine_init);
    if (secondPoint.y < firstPoint.y) {
        targetRotation = (-targetRotation);
    }
    let geometry = new THREE.BoxGeometry(targetScale, 10, 100);
    let wall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xe6e6e6, wireframe: false}));
    wall.position.set(targetPointX, targetPointY, 50);
    wall.rotation.z = targetRotation;
    sence.add(wall);
}

function cutMesh() {
    let cutCube = new THREE.BoxGeometry(50, 50, 50);

}
function doorXifu(door,drawArray,camera){
    let xifuArray=[];
    drawArray.forEach(item=>{
        xifuArray.push(new THREE.Vector3(item.x,item.y,0).clone().unproject(camera));
    });

}

function assignUVs(geometry) {
    geometry.computeBoundingBox();
    var max = geometry.boundingBox.max,
        min = geometry.boundingBox.min;
    var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    var faces = geometry.faces;
    geometry.faceVertexUvs[0] = [];
    for (var i = 0; i < faces.length ; i++) {
        var v1 = geometry.vertices[faces[i].a],
            v2 = geometry.vertices[faces[i].b],
            v3 = geometry.vertices[faces[i].c];
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
            new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
            new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
        ]);
    }
    geometry.uvsNeedUpdate = true;
}
exports.wall = wall;
exports.createRoom = createRoom;
exports.ArrowHelper = ArrowHelper;
exports.loaderOBJ = loaderOBJ;
exports.stretch = stretch;
exports.createWall = createWall;
exports.assignUVs = assignUVs;