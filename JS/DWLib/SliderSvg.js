export class SliderSvg {
  constructor(parent, x, y, w, h, min, max, sign = 2, val = 0, func = null, i = null, units = "%", clr = "#000090", clroff = "#88F", clrtext = "#FFF", horizontal = true) {
    this.parent = parent;
    this.tag = parent.svg;
    //this.id = id;
    this.x = x;
    this.y = y;
    this.xb = (w * (val - min)) / (max - min);
    this.i = i;
    this.w = w;
    this.h = h;
    this.r = h / 8;
    this.r0 = h / 8;
    this.units = units;
    this.n_sl = -1;
    this.f = func;

    this.min = min;
    this.max = max;
    this.sign = sign;
    this.lineL = null;
    this.lineR = null;
    this.rect0 = null;
    this.circ2 = null;
    this.grad = null;
    this.path = null;
    this.text = null;
    this.svgp = null;
    this.val = val;
    this.clr = clr;
    this.clrtext = clrtext;
    this.clroff = clroff;
    //this.bb;
    this.focus = false;

    this.horizontal = horizontal;
    this.mouse = { x: 0, y: 0, down: false, move: false, xc: 0, yc: 0, in: false };
    this.touch = { x: 0, y: 0, down: false, move: false, xc: 0, yc: 0, in: false };
    //this.frame = [["M", 200, 95], ["q", 0, -15, -60, -15], ["h", -60], ["q", -60, 0, -60, -15], ["v", -45], ["q", 0, -15, 60, -15], ["h", 240], ["q", 60, 0, 60, 15], ["v", 45], ["q", 0, 15, -60, 15], ["h", -60], ["q", -60, 0, -60, 15]];
    this.frame = ""; //"M200,99q-10-19-29-19h-151q-15,0-15-15v-45q0-15,15-15h360q15,0,15,15v45q0,15-15,15h-151q-19,0-29,19";
    this.kp = 0;
    this.deep = 1;
    //console.log(this.parent);
    //console.log(this.tag);
    let node = this.tag.parentElement;
    while (node != document.body) {
      node = node.parentElement;
      this.deep++;
    }
    this.draw();
    this.addEvents();
    /*if (this.lineL == null) {
      this.tag.addEventListener("load", () => {
        this.draw();
        this.addEvents();0
      });
    } else this.addEvents();*/
  }

  draw() {
    let _r = (100 * this.r) / this.w;
    let ht = this.tag.height.baseVal.value;
    let wt = this.tag.width.baseVal.value;
    //console.log(wt);
    //console.log(ht);
    //if (ht == 0) return;
    let k1 = wt / ht;
    if (this.lineL == null) {
      this.lineL = document.createElementNS("http://www.w3.org/2000/svg", "line");
      this.lineR = document.createElementNS("http://www.w3.org/2000/svg", "line");
      this.lineL.style.stroke = this.clr;
      this.lineR.style.stroke = this.clroff;
      this.lineL.style.strokeLinecap = "round";
      this.lineR.style.strokeLinecap = "round";
      this.lineL.style.strokeWidth = _r * 0.6 + "%";
      this.lineR.style.strokeWidth = _r * 0.6 + "%";
      let yL = this.y + "%";
      this.lineL.x1.baseVal.valueAsString = this.x + "%";
      this.lineL.y1.baseVal.valueAsString = yL;
      this.lineL.y2.baseVal.valueAsString = yL;

      this.lineR.y1.baseVal.valueAsString = yL;
      this.lineR.y2.baseVal.valueAsString = yL;
      this.lineR.x2.baseVal.valueAsString = this.x + this.w + "%";

      this.tag.appendChild(this.lineL);
      this.tag.appendChild(this.lineR);
      if (document.getElementById("grad_but") == null) {
        this.grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        this.grad.id = "grad_but";
        this.grad.setAttributeNS(null, "gradientTransform", "rotate(45)");
        this.grad.innerHTML = "<stop offset='0%' stop-color='#99F' />  <stop offset='100%' stop-color='#003' />";
        this.tag.appendChild(this.grad);
      }
      this.circ2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      //this.circ2.style.cursor = "grab";

      this.circ2.cy.baseVal.valueAsString = this.y + "%";
      this.circ2.style.stroke = this.clr;
      this.circ2.style.strokeWidth = _r * 0.6 + "%";
      this.circ2.style.fill = "#FFF0";
      this.tag.appendChild(this.circ2);

      this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      this.text.setAttributeNS(null, "fill", this.clrtext);
      this.text.style.fontFamily = "Roboto-Light"

      this.text.style.userSelect = "none";
      this.text.style.textAnchor = "middle";
      this.text.setAttributeNS(null, "x", "50%");
      this.text.setAttributeNS(null, "y", "55%");
      //this.text.style.fontSize = (0.087 * R).toFixed(2) + "vw";

      this.svgp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      if (this.svgp.viewBox.baseVal != null) {
        this.svgp.viewBox.baseVal.x = 0;
        this.svgp.viewBox.baseVal.y = 0;
        this.svgp.viewBox.baseVal.width = 100;
      } else this.svgp.setAttributeNS(null, "viewBox", "0 0 100 100");
      //this.svgp.viewBox.baseVal.height = 100;
      //this.svgp.setAttributeNS(null, "preserveAspectRatio", "none");
      this.tag.appendChild(this.svgp);

      this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.path.style.fill = "#00A5";
      this.svgp.appendChild(this.path);

      this.svgp.appendChild(this.text);
    }
    this.circ2.r.baseVal.valueAsString = (_r * 4).toFixed(2) + "%";

    let R = this.circ2.r.baseVal.valueInSpecifiedUnits;
    let str = this.val.toFixed(this.sign) + " " + this.units;
    let len_str = str.length;
    this.text.textContent = str;
    let w = len_str * R;
    let curX = this.x + (this.w * (this.val - this.min)) / (this.max - this.min);
    let wp = 0.7 * w;
    let hp = R * 2.5;
    let kp = Math.round(35000 / len_str) / 100;
    if (kp != this.kp) {
      this.svgp.viewBox.baseVal.height = kp;
      let d1 = (0.19 * kp).toFixed(2);
      let d2 = (2.5 + 0.19 * kp).toFixed(2);
      let d3 = (49 - 2.5 - 0.38 * kp).toFixed(2);
      let d4 = (0.41 * kp).toFixed(2);
      this.frame = "M50," + (kp - 1).toFixed(2) + "q-2.5-" + d1 + "-" + d2 + "-" + d1 + "h-" + d3 + "q-" + d1 + ",0-" + d1 + "-" + d1 + "v-" + d4 + "q0-" + d1 + "," + d1 + "-" + d1 + "h" + (98 - 0.38 * kp).toFixed(2) + "q" + d1 + ",0," + d1 + "," + d1 + "v" + d4 + "q0," + d1 + "-" + d1 + "," + d1 + "h-" + d3 + "q-" + d1 + ",0-" + d2 + "," + d1;
      this.path.setAttributeNS(null, "d", this.frame);
      this.kp = kp;
    }
    this.svgp.width.baseVal.valueAsString = wp.toFixed(2) + "%";
    this.svgp.height.baseVal.valueAsString = (hp * k1).toFixed(2) + "%";
    this.svgp.x.baseVal.valueAsString = (curX - wp / 2).toFixed(2) + "%";
    this.svgp.y.baseVal.valueAsString = (this.y - 3.5 * R * k1).toFixed(2) + "%";

    this.text.style.fontSize = (18 / len_str).toFixed(2) + "vh";
    let cur_x = curX.toFixed(2) + "%";
    if (curX - this.x > _r * 3.2) this.lineL.style.stroke = this.clr;
    else this.lineL.style.stroke = "#FFF0";
    this.lineL.x2.baseVal.valueAsString = (curX - _r * 3.2).toFixed(2) + "%";
    if (this.x + this.w - curX > _r * 3.2) this.lineR.style.stroke = this.clroff;
    else this.lineR.style.stroke = this.clroff;
    this.lineR.x1.baseVal.valueAsString = (curX + _r * 3.2).toFixed(2) + "%";
    this.circ2.cx.baseVal.valueAsString = cur_x;

    // this.bb = this.circ2.getBoundingClientRect();
  }
  addVal(val) {
    this.val += val;
    if (this.val > this.max) this.val = this.min;
    if (this.val < this.min) this.val = this.max;
    this.draw();
  }

  addEvents() {
    this.circ2.addEventListener("mousedown", (event) => {
      this.mouse.down = true;
      this.mouse.xc = this.val;
      this.mouse.yc = event.offsetX;
      //this.circ2.style.cursor = "w-resize";
    });
    window.addEventListener("mouseup", () => {
      if (this.mouse.down) {
        //this.circ2.style.cursor = "grab";
        this.mouse.down = false;
      }
    });
    this.tag.addEventListener("mousemove", (event) => {
      if (this.mouse.down) {
        let cur_x = (event.offsetX - this.mouse.yc) / ((this.tag.width.baseVal.value * this.w) / 100);
        this.val = this.mouse.xc + cur_x * (this.max - this.min);
        if (this.val > this.max) this.val = this.max;
        else if (this.val < this.min) this.val = this.min;
        this.circ2.style.fill = this.clr + "F";
        this.draw();
        if (this.f != null) {
          this.f(this.parent, this.i);
        }
      } else {
        let x = this.circ2.cx.baseVal.value;
        let y = this.circ2.cy.baseVal.value;
        let i = this.deep;
        let node = this.tag;
        while (--i) {
          x += node.x.baseVal.value;
          y += node.y.baseVal.value;
          node = node.parentElement;
        }
        let d = (event.offsetX - x) * (event.offsetX - x) + (event.offsetY - y) * (event.offsetY - y);
        if (d < 400) {
          let z = Math.round(255 - (255 * Math.sqrt(d)) / 20);
          this.circ2.style.fill = this.clr + z.toString(16);
          this.r = this.r0 * (1 + z / 480);
          this.focus = true;
          this.draw();
        } else if (this.focus) {
          this.circ2.style.fill = this.clr + "0";
          this.r = this.r0;
          this.focus = false;
          this.draw();
        }
      }
    });
    window.addEventListener("resize", () => {
      this.draw();
    });
  }
}
