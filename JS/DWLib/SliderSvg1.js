// copyright "Copyright 2021, Nikolai Semko"
// telegram https://t.me/ivi314
import SvgImage, { svg, GetPath } from './svg.js';

export class SliderSvg1 {
    constructor(wnd, parentid, id, x, y, w, h, min, max, sign = 2, val = 0, horizontal = true, units = "%") {
        this.wnd = wnd;
        this.parent = parentid;
        this.tag = null;
        this.id = id;
        this.x = x;
        this.y = y;
        this.xb = w * (val - min) / (max - min);
        this.w = w;
        this.h = h;
        this.r = h / 8;
        this.units = units;
        this.n_sl = -1;

        this.min = min;
        this.max = max;
        this.sign = sign;
        this.lineL = null;
        this.lineR = null;
        this.rect0 = null;
        this.circ1 = null;
        this.circ2 = null;
        this.grad = null;
        this.path = null;
        this.text = null;
        this.svgp = null;
        this.val = val;

        this.horizontal = horizontal;
        this.mouse = { x: 0, y: 0, down: false, move: false, xc: 0, yc: 0, in: false };
        this.touch = { x: 0, y: 0, down: false, move: false, xc: 0, yc: 0, in: false };
        this.frame = [["M", 50, 95], ["q", 0, -15, -15, -15], ["h", -15], ["q", -15, 0, -15, -15], ["v", -45], ["q", 0, -15, 15, -15], ["h", 60], ["q", 15, 0, 15, 15], ["v", 45], ["q", 0, 15, -15, 15], ["h", -15], ["q", -15, 0, -15, 15]];
        this.draw();
        this.draw();
        this.addEvents();
    }

    draw() {
        let _r = 100 * this.r / this.w;
        let ht = 0;
        let wt = 0;
        let k1 = 0;
        if (this.lineL == null) {
            this.tag = document.getElementById(this.parent);
            ht = this.tag.height.baseVal.value;
            wt = this.tag.width.baseVal.value;
            k1 = wt / ht;
            this.lineL = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            this.lineR = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            this.lineL.style.stroke = "#00A";
            this.lineR.style.stroke = "#88F";
            this.lineL.style.strokeLinecap = "round";
            this.lineR.style.strokeLinecap = "round";
            this.lineL.style.strokeWidth = (_r * 2) + "%";
            this.lineR.style.strokeWidth = (_r * 2) + "%";
            let yL = this.y + "%";
            this.lineL.x1.baseVal.valueAsString = this.x + "%";
            this.lineL.y1.baseVal.valueAsString = yL;
            this.lineL.y2.baseVal.valueAsString = yL;

            this.lineR.y1.baseVal.valueAsString = yL;
            this.lineR.y2.baseVal.valueAsString = yL;
            this.lineR.x2.baseVal.valueAsString = (this.x + this.w) + "%";

            this.tag.appendChild(this.lineL);
            this.tag.appendChild(this.lineR);
            if (document.getElementById('grad_but') == null) {
                this.grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                this.grad.id = "grad_but";
                this.grad.setAttributeNS(null, "gradientTransform", "rotate(45)");
                this.grad.innerHTML = "<stop offset='0%' stop-color='#99F' />  <stop offset='100%' stop-color='#003' />";
                this.tag.appendChild(this.grad);
            }
            this.circ1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            this.circ2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            this.circ1.cy.baseVal.valueAsString = this.y + "%";
            this.circ1.r.baseVal.valueAsString = (_r * 4).toFixed(2) + "%";
            this.circ1.style.fill = "url('#grad_but')";

            //this.circ2.id = "sl" + this.wnd.newSlider(this);
            this.circ2.style.cursor = "grab";

            this.circ2.r.baseVal.valueAsString = (_r * 3.2).toFixed(2) + "%";
            this.circ2.cy.baseVal.valueAsString = this.y + "%";
            this.circ2.style.fill = "#009";
            this.tag.appendChild(this.circ1);
            this.tag.appendChild(this.circ2);

            this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            this.text.setAttributeNS(null, 'fill', "#FFF");

            this.text.style.userSelect = "none";
            this.text.style.textAnchor = "middle";

            this.svgp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.tag.appendChild(this.svgp);

            this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            this.path.setAttributeNS(null, "fill", "#00A5");
            this.svgp.appendChild(this.path);

            this.tag.appendChild(this.text);
        }
        ht = this.tag.height.baseVal.value;
        wt = this.tag.width.baseVal.value;
        
        let R = this.circ1.r.baseVal.value;
        this.text.style.fontSize = (0.087 * R).toFixed(2) + "rem";
        let curX = this.x + this.w * (this.val - this.min) / (this.max - this.min);
        let cur_x = curX.toFixed(2) + "%";
        k1 = wt / ht;

        this.lineL.x2.baseVal.valueAsString = cur_x;
        this.lineR.x1.baseVal.valueAsString = cur_x;
        this.circ1.cx.baseVal.valueAsString = cur_x;
        this.circ2.cx.baseVal.valueAsString = cur_x;
        this.text.setAttributeNS(null, 'x', cur_x);
        this.text.setAttributeNS(null, 'y', (this.y - 200*R/ht).toFixed(2) + "%");
        this.text.textContent = (this.val).toFixed(this.sign) + " " + this.units;
        let w = 1.4 * this.text.textLength.baseVal.value;
        if (w == 0) {
            let bt = this.text.getBBox();
            w = bt.width * 1.4;
        }
        let h = R * 0.087 * 16;
        this.path.setAttributeNS(null, "d", GetPath(this.frame, w / 100, h / 55));
        this.svgp.x.baseVal.valueAsString = (curX - 50 * w / wt).toFixed(2) + "%";
        this.svgp.y.baseVal.valueAsString = (this.y - 350 * R / ht) + "%";


    }
    addVal(val) {
        this.val += val;
        if (this.val > this.max) this.val = this.min;
        if (this.val < this.min) this.val = this.max;
        this.draw();
    }

    addEvents() {
        this.circ2.addEventListener('mousedown', (event) => {
            this.mouse.down = true;
            this.mouse.xc = this.val;
            this.mouse.yc = event.offsetX;
            this.circ2.style.cursor = "w-resize";
        });
        window.addEventListener('mouseup', () => {
            if (this.mouse.down) {
                this.circ2.style.cursor = "grab";
                this.mouse.down = false;
            }
            //if (this.mouse.in) this.circ2.style.cursor = "grab";
            //else this.circ2.style.cursor = "default";
        });
        window.addEventListener('mousemove', (event) => {
            if (this.mouse.down) {
                //console.log(document.getElementsByTagName('*').length);
                //console.log(document.getElementById(this.parent).childElementCount);
                let cur_x = (event.offsetX - this.mouse.yc) / (this.tag.width.baseVal.value * this.w / 100);
                this.val = this.mouse.xc + cur_x * (this.max - this.min);
                if (this.val > this.max) this.val = this.max;
                else if (this.val < this.min) this.val = this.min;
                this.draw();
            }
        });

        /*this.circ2.addEventListener('mouseout', () => {
            this.mouse.in = false;
            this.circ2.style.cursor = "default";
        });
        this.circ2.addEventListener('mouseover', () => {
            this.mouse.in = true;
            if (!this.mouse.down) this.circ2.style.cursor = "grab";
            else this.circ2.style.cursor = "grabbing";
        });*/
        window.addEventListener("resize", () => {
            this.draw();
        });
    }
}