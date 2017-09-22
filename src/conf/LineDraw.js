/**
 * Created by lvxianlei on 2017/6/16.
 */
let THREE = require('three');
export default function LineDraw(ele, camera) {

    window.document.oncontextmenu = function () {
        return false;
    };

    var that = this;
    this.ele = ele;
    this.camera = camera;
    this.count = 0;
    this.clickArray = [];
    this.drawArray = [];
    this.moveArray = [];
    this.mouse = new THREE.Vector3();
    this.MouseDown = function (e) {
        that.mousedown.call(that, e);
    };
    this.MouseMove = function (e) {
        that.mouseMove.call(that, e);
    };
    this.Remove = function (e) {
        that.remove.call(that, e);
    };

    this.ele.addEventListener('mousedown', that.MouseDown, false);
}


LineDraw.prototype.mousedown = function (e) {
    e.preventDefault();
    this.ele.style.cursor = "crosshair";
    var mouse = new THREE.Vector3();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;


    this.mouse = mouse.clone().unproject(this.camera);
    this.mouse.z = 0;
    this.drawArray.push(mouse);

    this.clickArray.push(this.mouse);
    this.ele.addEventListener('mousedown', this.Remove, false);
    this.ele.addEventListener('mousemove', this.MouseMove, false);
};

LineDraw.prototype.mouseMove = function (e) {
    e.preventDefault();
    this.moveArray = [];
    var mouse = new THREE.Vector3();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.z = 0;
    var mouse2 = mouse.clone().unproject(this.camera);
    mouse2.z = 0;
    this.moveArray.push(this.mouse);
    this.moveArray.push(mouse2);
    this.ele.addEventListener('mousedown', this.Remove, false);
};

LineDraw.prototype.remove = function (e) {
    e.preventDefault();
    if (parseFloat(e.button) === 2) {
        this.ele.style.cursor = "default";
        this.ele.removeEventListener('mousedown', this.MouseDown, false);
        this.ele.removeEventListener('mousemove', this.MouseMove, false);
        this.moveArray = [];
    }
};
