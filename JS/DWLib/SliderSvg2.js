import SvgImage, { svg, GetPath } from './svg.js';

export class SliderSvg2 {
    constructor(parentid, id, x, y, w, h, min, max, step = 1, val = 0, horizontal = true) {
        //this.wnd = wnd;
        this.parent = parentid;
        this.tag = null;
        this.id = id;
        this.x = x;
        this.y = y;
        this.xb = w * (val - min) / (max - min);
        this.w = w;
        this.h = h;
        this.r = h / 8;

        this.min = min;
        this.max = max;
        this.step = step;
        this.rectL = null;
        this.rectR = null;
        this.rect0 = null;
        this.svg = null;
        this.button = null;
        this.svgb = null;
        this.path = null;
        this.text = null;
        this.svgp = null;
        this.val = val;
        this.kx = 0.1;

        this.horizontal = horizontal;
        this.mouse = { x: 0, y: 0, down: false, move: false, xc: 0, yc: 0, in: false };
        this.touch = { x: 0, y: 0, down: false, move: false, xc: 0, yc: 0, in: false };
        this.frame = [["M", 50, 95], ["q", 0, -15, -15, -15], ["h", -15], ["q", -15, 0, -15, -15], ["v", -45], ["q", 0, -15, 15, -15], ["h", 60], ["q", 15, 0, 15, 15], ["v", 45], ["q", 0, 15, -15, 15], ["h", -15], ["q", -15, 0, -15, 15]];
        this.draw();
        this.addEvents();
    }

    draw() {
        let _r = 100 * this.r / this.w;
        let k = this.w / this.h;
        let ht = 0;
        let wt = 0;
        if (this.svg == null) {
            //console.log(k);
            this.tag = document.getElementById(this.parent);
            this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            ht = this.tag.height.baseVal.value;
            wt = this.tag.width.baseVal.value;
            let k1 = wt / ht;
            this.svg.setAttributeNS(null, "id", this.id + "s");
            this.svg.setAttributeNS(null, 'x', this.x + "%");
            this.svg.setAttributeNS(null, 'y', (this.y) + "%");
            this.svg.setAttributeNS(null, 'width', (this.w) + "%");
            this.svg.setAttributeNS(null, 'height', (this.h * k1 + 1) + "%");
            //this.svg.style.zIndex = this.zIndex;
            //this.svg.innerHTML = '<defs> <filter id="shadow" color-interpolation-filters="sRGB"> <feDropShadow dx="10" dy="10" stdDeviation="3" flood-opacity="0.5"/> </filter> </defs>'
            this.tag.appendChild(this.svg);
            this.rectL = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            this.rectR = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            //this.rectL.setAttributeNS(null, "id", this.id + "r");
            //this.rectL.setAttributeNS(null, 'fill-opacity', '1.0');

            this.rectL.setAttributeNS(null, 'x', (3 * _r) + "%");
            this.rectL.setAttributeNS(null, 'y', (3 * _r * k).toFixed(2) + "%");
            //this.rectL.setAttributeNS(null, 'width', (100 - 6*_r)  + "%");
            this.rectL.setAttributeNS(null, 'height', (2 * _r * k).toFixed(2) + "%");
            //this.rectL.setAttributeNS(null, 'rx', ((100*_r)/(100 - 6*_r)) + "%");
            this.rectL.setAttributeNS(null, 'ry', "50%");
            this.rectL.style.fill = "#00A";
            //this.rectR.setAttributeNS(null, 'x', (3*_r)  + "%");
            this.rectR.setAttributeNS(null, 'y', (3 * _r * k).toFixed(2) + "%");
            //this.rectR.setAttributeNS(null, 'width', (100 - 6*_r)  + "%");
            this.rectR.setAttributeNS(null, 'height', (2 * _r * k).toFixed(2) + "%");
            //this.rectR.setAttributeNS(null, 'rx', ((100*_r)/(100 - 6*_r)) + "%");
            this.rectR.setAttributeNS(null, 'ry', "50%");
            this.rectR.style.fill = "#88F";
            this.svg.appendChild(this.rectL);
            this.svg.appendChild(this.rectR);
            this.svgb = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.svgb.innerHTML = svg.button;
            this.svg.appendChild(this.svgb);
            this.button = document.getElementById("button");
            //this.button.id = this.id + "b";
            this.button.setAttributeNS(null, "id", this.id + "b");
            this.button.setAttributeNS(null, "width", (_r * 8) + "%");
            this.button.setAttributeNS(null, "height", (_r * 8 * k) + "%");
            this.button.setAttributeNS(null, "y", "0");

            this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            this.text.setAttributeNS(null, 'y', (this.y - _r * 8) + "%");
            this.text.setAttributeNS(null, 'fill', "#FFF");
            //this.text.setAttributeNS(null, 'font-size', wt * this.h / 100);
            this.text.style.userSelect = "none";

            this.svgp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            //this.svgp.setAttributeNS(null, 'viewBox', "0 0 100 100");
            //this.svgp.setAttributeNS(null, 'preserveAspectRatio', "none");
            //this.svgp.setAttributeNS(null, 'text-anchor', "middle");
            this.tag.appendChild(this.svgp);

            this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            //this.path.setAttributeNS(null, "stroke", "#00A8");
            //this.path.setAttributeNS(null, "stroke-width", "1.5px");
            this.path.setAttributeNS(null, "fill", "#00A5");
            this.svgp.appendChild(this.path);

            this.tag.appendChild(this.text);
        }
        ht = this.tag.height.baseVal.value;
        wt = this.tag.width.baseVal.value;
        this.text.setAttributeNS(null, 'font-size', wt * this.h / 100);
        let cur_x = (100 - _r * 8) * this.val / (this.max - this.min);
        let r = wt * this.h / 800;
        //let k1 = wt / ht;


        //while (r==0) r = this.rectL.height.baseVal.value / 2;
        //let r = this.rectL.getAttributeNS(null, "height")/2;
        //console.log(r + "   " + this.rectL.height.baseVal.value);
        //console.log(this.tag.width.baseVal.value);
        //console.log(this.rectL.height.baseVal.value);
        this.rectL.setAttributeNS(null, 'width', (cur_x + _r).toFixed(2) + "%");
        this.rectL.setAttributeNS(null, 'rx', r.toFixed(2));
        this.rectR.setAttributeNS(null, 'x', (4 * _r + cur_x) + "%");
        this.rectR.setAttributeNS(null, 'width', (100 - 5 * _r - cur_x).toFixed(2) + "%");
        this.rectR.setAttributeNS(null, 'rx', r.toFixed(2));
        this.button.setAttributeNS(null, "x", cur_x.toFixed(2) + "%");
        this.text.setAttributeNS(null, 'x', ((cur_x + 4 * _r) * this.w / 100 + this.x).toFixed(1) + "%");
        this.text.textContent = this.val.toFixed(1);
        this.text.setAttributeNS(null, 'text-anchor', "middle");
        let bt = this.text.getBBox();
        let w = bt.width * 1.5;
        let h = bt.width / 6 + this.svg.y.baseVal.value - bt.y;
        this.svgp.setAttributeNS(null, 'x', (100 * (bt.x - bt.width / 4) / wt).toFixed(2) + "%");
        this.svgp.setAttributeNS(null, 'y', (100 * (bt.y - bt.width / 6) / ht).toFixed(2) + "%");
        //this.svgp.setAttributeNS(null, 'viewBox', "0 0 " + w + " " + h);
        this.svgp.setAttributeNS(null, 'width', (100 * w / wt).toFixed(2) + "%");
        this.svgp.setAttributeNS(null, 'height', (100 * h / ht).toFixed(2) + "%");
        this.path.setAttributeNS(null, "d", GetPath(this.frame, w/100, h/100));

        this.kx = wt * this.w * this.h / 10000.0;
        //this.xvals =this.button.x.baseVal.valueInSpecifiedUnits;
        //this.addEvents();
    }
    getBox() {
        let ww = this.text.getComputedTextLength();
        let xx = this.text.x.baseVal[0].value;
        let yy = this.text.y.baseVal[0].value;
        let val = { x: xx, y: yy, width: ww };
        return val;
    }
    addVal(val) {
        this.val += val;
        if (this.val > this.max) this.val = this.min;
        if (this.val < this.min) this.val = this.max;
        this.draw();
    }

    addEvents() {
        this.button.addEventListener('mousedown', (event) => {
            this.mouse.down = true;
            this.mouse.xc = this.button.x.baseVal.valueInSpecifiedUnits;
            this.mouse.yc = event.offsetX;
            //const _x0 =this.button.x.baseVal.valueInSpecifiedUnits;
            this.button.style.cursor = "grabbing";
            // if (this.horizontal) this.mouse.xc = event.pageX * this.wnd.scale / this.wnd.w - this.x;
            // this.mouse.yc = event.pageY * this.wnd.scale / this.wnd.h - this.y;
        });
        window.addEventListener('mouseup', () => {
            this.mouse.down = false;
            if (this.mouse.in) this.button.style.cursor = "grab";
            else this.button.style.cursor = "default";
        });
        window.addEventListener('mousemove', (event) => {
            //console.log("window X = " + event.offsetX);
            if (this.mouse.down) {
                //let _r = 100 * this.r / this.w;
                let cur_x = this.mouse.xc + (event.offsetX - this.mouse.yc) * this.h / this.kx;
                this.val = cur_x * (this.max - this.min) / (100 - 800 * this.r / this.w);
                if (this.val > this.max) this.val = this.max;
                else if (this.val < this.min) this.val = this.min;
                this.draw();
            }

            //console.log(event);
            //event.stopPropagation();
        });

        this.button.addEventListener('mouseout', (event) => {
            this.mouse.in = false;
            this.button.style.cursor = "default";
        });
        this.button.addEventListener('mouseover', (event) => {
            this.mouse.in = true;
            if (!this.mouse.down) this.button.style.cursor = "grab";
            else this.button.style.cursor = "grabbing";
        });
        window.addEventListener("resize", () => {
            this.draw();
        });
    }
}