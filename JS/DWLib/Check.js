import { TextLine } from "./SvgText.js";

export class CheckBox {
  constructor(parent, x, y, h, val = true, func = null, text = "", xText = 0.5, clrR = "#33A", clrOn = "#4F4", clrOff = "#F44") {
    this.parent = parent;
    this.tag = parent.svg;
    this.h = h;
    this.w = h;
    this.x = x;
    this.y = y;
    this.f = func;
    this.txt = text;
    this.xText = xText;
    this.text = null;
    this.val = val;
    this.clrR = clrR;
    this.clrOn = clrOn;
    this.clrOff = clrOff;
    this.svg = null;
    this.rect = null;
    this.path = null;
    this.fig1 = "M634.29 93.99c-272.08,273.41 -271.93,272.06 0.08,544.12 -272.01,-272.06 -272.05,-272.04 -543.74,-0.21 271.69,-271.83 271.69,-271.83 -0.28,-543.82 271.97,271.99 271.86,273.32 543.94,-0.09z";
    this.fig2 = "M676.42 15.02c-190.11,172.98 -306.07,400.33 -371.44,667.55 -42.28,-175.98 -132.84,-317.95 -233.19,-446.79 103.21,60.21 156,98.2 223.94,177.52 89.42,-162.01 216.9,-296.88 380.69,-398.28z";
    this.k = 0;
    this.draw();
    this.addEvents();
    //this.draw();
  }
  draw() {
    let ht = this.tag.height.baseVal.value;
    let wt = this.tag.width.baseVal.value;
    //console.log(wt);
    //if (ht == 0) return;
    let k1 = wt / ht;
    if (this.svg == null) {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttributeNS(null, "viewBox", "0 0 730 730");
      this.svg.x.baseVal.valueAsString = this.x + "%";
      this.svg.y.baseVal.valueAsString = this.y + "%";
      this.svg.width.baseVal.valueAsString = this.w + "%";
      this.svg.height.baseVal.valueAsString = (this.h * k1).toFixed(2) + "%";
      this.svg.setAttributeNS(null, "pointer-events", "visible");
      this.tag.appendChild(this.svg);
      this.rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      this.rect.style.stroke = this.clrR;
      this.rect.style.strokeWidth = "5%";
      this.rect.style.fill = "none";
      this.rect.rx.baseVal.valueAsString = "15%";
      this.rect.x.baseVal.valueAsString = "5%";
      this.rect.y.baseVal.valueAsString = "5%";
      this.rect.width.baseVal.valueAsString = "90%";
      this.rect.height.baseVal.valueAsString = "90%";
      this.svg.appendChild(this.rect);
      this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.path.style.fill = this.val ? this.clrOn : this.clrOff;
      this.path.style.stroke = this.val ? this.clrOn : this.clrOff;
      this.path.style.strokeWidth = "2%";
      this.path.setAttributeNS(null, "d", this.val ? this.fig2 : this.fig1);
      this.svg.appendChild(this.path);
      if (this.txt != "") {
        this.text = new TextLine(this.tag, this.x + 1.3 * this.w, this.y - 0.15 * this.w, this.txt, this.h);
        /*this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //this.text.x.baseVal.valueAsString = this.x + this.h * (1 + this.xText) + "%";
        //this.text.y.baseVal.valueAsString = this.y + "%";

        this.text.setAttributeNS(null, "x", (this.x + this.h * (1 + this.xText)).toFixed(2) + "%");
        this.text.setAttributeNS(null, "y", (this.y + 0.85 * this.h * k1).toFixed(2) + "%");

        this.text.textContent = this.txt;
        this.text.setAttributeNS(null, "fill", this.clrOn);

        this.text.style.userSelect = "none";
        this.text.style.textAnchor = "start";
        this.text.style.fontSize = this.h * 2 + "vh";
        this.text.setAttributeNS(null, "font-family", "Roboto-Light");
        this.parent.appendChild(this.text);*/
      }
    }
    if (this.k != k1) {
      this.svg.height.baseVal.valueAsString = (this.h * k1).toFixed(2) + "%";
      this.k = k1;
    }
    this.path.style.fill = this.val ? this.clrOn : this.clrOff;
    this.path.style.stroke = this.val ? this.clrOn : this.clrOff;
    this.path.setAttributeNS(null, "d", this.val ? this.fig2 : this.fig1);
  }
  newX(x) {
    this.x = x;
    this.svg.x.baseVal.valueAsString = this.x + "%";
    this.text.svg.x.baseVal.valueAsString = (this.x + 1.3 * this.w).toFixed(2) + "%";
  }
  addEvents() {
    this.svg.addEventListener("mousedown", () => {
      this.val = !this.val;
      anime({
        targets: this.path,
        fill: this.val ? this.clrOn : this.clrOff,
        stroke: this.val ? this.clrOn : this.clrOff,
        //opacity: this.val ? 1:0,
        d: this.val ? this.fig2 : this.fig1,
        easing: "linear",
        duration: 300,
      });
      if (this.f != null) {
        this.f();
      }
      //this.draw();
    });
  }
}
