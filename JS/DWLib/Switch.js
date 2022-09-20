export class Switch {
  constructor(parent, x, y, r, h, val = true, text = "", clrOn = "#66D", clrOff = "#888", clrBOn = "#44A", clrBOff = "#666") {
    this.parent = parent;
    this.tag = parent.svg;
    this.r = r;
    this.h = h;
    this.w = r > h / 2 ? h + 1.3 * r : 1.5 * h;
    this.xl = x + this.h / 2;
    this.xr = x + this.w - this.h / 2;
    this.cy = y + this.h / 2;
    this.val = val;
    this.clrOn = clrOn;
    this.clrOff = clrOff;
    this.clrBOn = clrBOn;
    this.clrBOff = clrBOff;
    this.rect = null;
    this.cir = null;
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
    if (this.cir == null) {
      this.rect = document.createElementNS("http://www.w3.org/2000/svg", "line");
      this.rect.style.strokeLinecap = "round";
      this.rect.style.strokeWidth = this.h + "%";
      this.rect.x1.baseVal.valueAsString = this.xl + "%";
      this.rect.y1.baseVal.valueAsString = this.cy + "%";
      this.rect.x2.baseVal.valueAsString = this.xr + "%";
      this.rect.y2.baseVal.valueAsString = this.cy + "%";

      //this.rect.style.stroke = this.val ? this.clrOn : this.clrOff;
      this.tag.appendChild(this.rect);
      this.cir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      this.cir.cy.baseVal.valueAsString = this.cy + "%";
      //this.cir.style.fill = this.val ? this.clrBOn : this.clrBOff;
      this.cir.r.baseVal.valueAsString = this.r + "%";
      this.tag.appendChild(this.cir);
    }
    this.rect.style.stroke = this.val ? this.clrOn : this.clrOff;
    this.cir.style.fill = this.val ? this.clrBOn : this.clrBOff;
    this.cir.cx.baseVal.valueAsString = this.val ? this.xr + "%" : this.xl + "%";
  }
  addEvents() {
    this.cir.addEventListener("mousedown", (event) => {
      this.val = !this.val;
      anime({
        targets: this.cir,
        cx: this.val ? this.xr + "%" : this.xl + "%",
        fill: this.val ? this.clrBOn : this.clrBOff,
        easing: "easeInOutBack",
        duration: 500
      });
      anime({
        targets: this.rect,
        stroke: this.val ? this.clrOn : this.clrOff,
        easing: "easeInOutBack",
        duration: 500
      });
      //this.draw();
    });
    this.rect.addEventListener("mousedown", (event) => {
      this.val = !this.val; 
      anime({
        targets: this.cir,
        cx: this.val ? this.xr + "%" : this.xl + "%",
        fill: this.val ? this.clrBOn : this.clrBOff,
        easing: "easeInOutBack",
        duration: 500
      });
      anime({
        targets: this.rect,
        stroke: this.val ? this.clrOn : this.clrOff,
        easing: "easeInOutBack",
        duration: 500
      });
      //this.draw();
    });
  }
}
