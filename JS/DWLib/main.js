import SvgImage, { svg } from "./svg.js";
import { SliderSvg } from "./SliderSvg.js";
import { Switch } from "./Switch.js";
import { CheckBox } from "./Check.js";

export default class Layer {
  constructor(f, grid_x = [0, 20, 60, 100], grid_y = [0, 10, 50, 100]) {
    // create new canvas element
    this.canvas = document.createElement("canvas");
    this.f = f;
    this.n_win = 0;
    this.g_x = grid_x;
    this.g_y = grid_y;
    this.grid_x = grid_x;
    this.grid_y = grid_y;
    this.n_x = this.grid_x.length;
    this.n_y = this.grid_y.length;
    this.wins = [];
    //this.canvas.tabindex = 1;
    document.body.style.margin = "0";
    document.body.style.width = "100vw";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.display = "block";
    this.canvas.style.width = "100vw";
    this.canvas.style.height = "100vh";

    // get acceess to 2d drawing tools
    this.ctx = this.canvas.getContext("2d");
    this.scale = 0; // Change to 1 on retina screens to see blurry canvas.

    this.w = 0;
    this.h = 0;

    this.mouse = { x: 100, y: 100, xc: 0, yc: 0, down: false, move: false, xi: -1, yi: -1, down_grid: false };
    this.touch = { x: 100, y: 100, xc: 0, yc: 0, down: false, move: false };
    this.wheel = 0;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "mysvg";
    this.svg.style.zIndex = 10;
    //this.svg.setAttributeNS(null,"viewBox", "0 0 100 100");
    this.svg.setAttributeNS(null, "width", "100%");
    this.svg.setAttributeNS(null, "height", "100%");

    document.body.appendChild(this.canvas);
    document.body.appendChild(this.svg);

    this.fitToContainer();

    window.addEventListener("resize", () => this.fitToContainer());
    window.addEventListener("orientationchange", () => this.fitToContainer());
    this.svg.addEventListener(
      "mousemove",
      (event) => {
        let x = event.pageX;
        let y = event.pageY;
        this.mouse.x = x;
        this.mouse.y = y;
        if (this.mouse.down_grid) {
          if (this.mouse.xi >= 0) this.grid_x[this.mouse.xi] = (100.0 * x) / this.w;
          if (this.mouse.yi >= 0) this.grid_y[this.mouse.yi] = (100.0 * y) / this.h;
          this.draw();
          return;
        }
        let xi = -1;
        let yi = -1;
        for (let i = 0; i < this.grid_x.length; i++) {
          let dx = (this.grid_x[i] * this.w) / 100 - x;
          if (dx < 5 && dx > -5) {
            xi = i;
            break;
          }
        }
        for (let i = 0; i < this.grid_y.length; i++) {
          let dy = (this.grid_y[i] * this.h) / 100 - y;
          if (dy < 5 && dy > -5) {
            yi = i;
            break;
          }
        }
        if (xi >= 0 && yi < 0) this.svg.style.cursor = "w-resize";
        else if (xi < 0 && yi >= 0) this.svg.style.cursor = "n-resize";
        else if (xi >= 0 && yi >= 0) this.svg.style.cursor = "all-scroll";
        else this.svg.style.cursor = "default";
        this.mouse.xi = xi;
        this.mouse.yi = yi;
      },
      true
    );
    window.addEventListener("mousedown", () => {
      this.mouse.down = true;
      if (!this.mouse.down_grid) if (this.mouse.xi >= 0 || this.mouse.yi >= 0) this.mouse.down_grid = true;
    });
    window.addEventListener("mouseup", () => {
      this.mouse.down = false;
      this.mouse.down_grid = false;
    });
  }
  fitToContainer() {
    window.offsetHeight;
    this.scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    //this.canvas.width = Math.floor(window.innerWidth * this.scale);
    //this.canvas.height = Math.floor(window.innerHeight * this.scale);
    this.canvas.width = Math.floor(this.canvas.offsetWidth * this.scale);
    this.canvas.height = Math.floor(this.canvas.offsetHeight * this.scale);

    this.w = this.canvas.width;
    this.h = this.canvas.height;
    this.draw();
  }
  // if r = null - no rectangle
  addWin(win) {
    //{xi_left: 1, xi_right: 2, yi_top: 0, yi_bottom: 1, min_width: 300, min_height: 200, border: 3, r: 3, clr_background: "#225F"}
    //this.wins[this.n_win] = win;
    //console.log(this);
    this.wins[this.n_win] = new CElement(this, this.n_win, win.xi_left, win.xi_right, win.yi_top, win.yi_bottom, win.border, win.r, win.clr_background);

    this.n_win++;
  }
  draw() {
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = "#FF02";
    this.ctx.fillStyle = "#0000";
    this.ctx.clearRect(0, 0, this.w, this.h);
    /*for (let i = 0; i < this.grid_x.length; i++) {
      this.ctx.beginPath();
      let x = (this.grid_x[i] * this.w) / 100;
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.h - 1);
      this.ctx.stroke();
    }
    for (let i = 0; i < this.grid_y.length; i++) {
      this.ctx.beginPath();
      let y = (this.grid_y[i] * this.h) / 100;
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.w - 1, y);
      this.ctx.stroke();
    }*/
    for (let i = 0; i < this.n_win; i++) this.wins[i].draw();
    this.f();
  }
}

export class CElement {
  constructor(wnd, i, left = 0, right = 1, top = 0, bottom = 1, border = 3, r = 3, clr_background = "#225") {
    this.wnd = wnd;
    this.parent = wnd.svg;
    this.i = i;
    this.gx = wnd.grid_x;
    this.gy = wnd.grid_y;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    //this.min_width = min_width;
    //this.min_height = min_height;
    this.border = border;
    this.r = r;
    this.clr_background = clr_background;
    this.svg = null;
    this.rect = null;
    this.slider = [];
    this.switch = [];
    this.checkBox = [];
    this.draw();
  }
  newSlider(x, y, w, h, min, max, sign = 2, val = 0, func = null, units = "%", clr = "#000090", clroff = "#88F", clrtext = "#FFF", horizontal = true) {
    let i = this.slider.length;
    this.slider[i] = new SliderSvg(this, x, y, w, h, min, max, sign, val, func, i, units, clr, clroff, clrtext, horizontal);
  }
  newCheckBox(x, y, h, val = true, func = null, text = "", xText = 0.5, clrR = "#33A", clrOn = "#4F4", clrOff = "#F44") {
    let i = this.checkBox.length;
    this.checkBox[i] = new CheckBox(this, x, y, h, val, func, text, xText, clrR, clrOn, clrOff);
  }
  newSwitch(x, y, r, h, val = true, text = "", clrOn = "#66D", clrOff = "#888", clrBOn = "#44A", clrBOff = "#666") {
    let i = this.checkBox.length;
    this.switch[i] = new Switch(this, x, y, r, h, val, text, clrOn, clrOff, clrBOn, clrBOff);
  }
  draw() {
    if (this.svg == null) {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.parent.appendChild(this.svg);
      if (this.r != null) {
        this.rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.rect.style.fill = this.clr_background;
        if (this.r > 0) this.rect.rx.baseVal.valueAsString = this.r.toFixed(0);
        this.rect.x.baseVal.valueAsString = "0%";
        this.rect.y.baseVal.valueAsString = "0%";
        this.rect.width.baseVal.valueAsString = "100%";
        this.rect.height.baseVal.valueAsString = "100%";
        this.svg.appendChild(this.rect);
      }
    }
    let k1 = this.wnd.w / this.wnd.h;
    this.svg.width.baseVal.valueAsString = (this.gx[this.right] - this.gx[this.left] - this.border * 2).toFixed(2) + "%";
    this.svg.height.baseVal.valueAsString = (this.gy[this.bottom] - this.gy[this.top] - this.border * 2 * k1).toFixed(2) + "%";
    this.svg.x.baseVal.valueAsString = (this.gx[this.left] + this.border).toFixed(2) + "%";
    this.svg.y.baseVal.valueAsString = (this.gy[this.top] + this.border * k1).toFixed(2) + "%";
  }
}
