/**
 * Created by lvxianlei on 2017/8/11.
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import BIM from '../../../model/building';
const { Initialization, BaseObject, DrawControl, BaseShape, WallMesh, Point, LoadObjMtlModel, DoorFrame } = BIM;
const THREE = require('three');
let webGLStart, draw, loadModel,doorFrame;
export default class DrawingCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flags: ''
        };
        this.animate = this.animate.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        const canvasPage = document.getElementById('edit');
        webGLStart = new Initialization({ domElement: canvasPage });
        draw = new DrawControl(canvasPage);
        loadModel = new LoadObjMtlModel;
        this.animate();
    }

    animate() {
        webGLStart.render();
        requestAnimationFrame(this.animate);
    }

    componentWillUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        const flags = Object.assign({}, nextProps.flags);

        let model = {
            mtl: 'http://t.50-jia.com/bim/oss/50jia-bim/M002700S10102021900C_H.mtl',
            obj: 'http://t.50-jia.com/bim/oss/50jia-bim/M002700S10102021900C_H.obj',
            plane: '',
            position: [0, 0, 0],
            rotation: [0.5 * Math.PI, 0, 0],
            scale: [0.1, 0.1, 0.1]
        };

        switch (flags.flags) {
            case 'wall':
                draw.drawInnerLine();
                break;
            case 'sofa':
                loadModel.startLoad(model);
                break;
            case '3D':
                draw.sceneTo3D();
                break;
            case 'door':
                draw.sceneChange();
                doorFrame = new DoorFrame;
                break;
            case 'plane':
                draw.sceneChange();
                break;
        }
    }

    render() {
        return (
            <div className="canvasPage" id="screenCanvas">
                <div className="textHelper" id="textContent">
                </div>
                <canvas id='edit' xmlns="http://www.w3.org/1999/xhtml" />
            </div>
        );
    }
}

DrawingCanvas.propTypes = {
    flags: PropTypes.object.isRequired,
};