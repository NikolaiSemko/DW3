export class TextLine {
  // Anchor: start | middle | end
  // size - as a percentage of the width of the parent element
  constructor(parent, x, y, text = "", size = 1, anchor = "start", fill = "#99F", font = "Roboto-Light", select = "none", textLength = "none", lengthAdjust = "spacingAndGlyphs") {
    this.parent = parent;
    this.svg = null;
    this.size = size;
    this.anchor = anchor;
    this.fill = fill;
    this.font = font;
    this.select = select;
    this.textLength = textLength;
    this.lengthAdjust = lengthAdjust;
    this.x = x;
    this.y = y;
    this.content = text;
    this.text = null;
    this.wW = 0;
    this.draw();
  }
  newText(text) {
    this.text.textContent = text;
  }
  draw() {
    let w = this.parent.width.baseVal.value;
    let h = this.parent.height.baseVal.value;
    let k1 = w / h;
    if (this.text == null) {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttributeNS(null, "viewBox", "0 0 " + (100*this.content.length) +" 100");
      this.svg.x.baseVal.valueAsString = this.x + "%";
      this.svg.y.baseVal.valueAsString = this.y + "%";

      //this.svg.setAttributeNS(null, "pointer-events", "visible");
      this.parent.appendChild(this.svg);

      this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      //this.text.style.fill = this.fill;
      this.text.setAttributeNS(null, "fill", this.fill);

      this.text.style.userSelect = this.select;
      this.text.style.textAnchor = this.anchor;
      this.text.setAttributeNS(null, "x", "0%");
      this.text.setAttributeNS(null, "y", "95%");
      this.text.style.fontSize = "95px";
      //this.text.x.baseVal.valueAsString = "5%";
      //this.text.y.baseVal.valueAsString = "80%";
      //this.text.setAttributeNS(null, "x", this.x + "%");
      //this.text.setAttributeNS(null, "y", this.y + "%");
      this.text.setAttributeNS(null, "font-family", this.font);
      this.svg.appendChild(this.text);
    }
    //console.log(((this.size * w) / W).toFixed(2) + "vw" + "   " + W + "  " + w);
    //console.log(this.parent.style.fontSize);
    //this.svg.viewBox.baseVal.width = 10;
    //this.svg.x.baseVal.valueAsString = this.x + "%";
    this.svg.width.baseVal.valueAsString = (this.size * this.content.length).toFixed(2) + "%";
    this.svg.height.baseVal.valueAsString = (this.size*k1).toFixed(2) + "%";

    this.text.textContent = this.content;
    //this.text.y.baseVal.value = "100%";
  }
}
