import { TextLine } from "./SvgText.js";
export default class WndArr {
  constructor() {
    this.win = [];
    this.cur = -1;
    this.N = 0;
    this.moving = false;
    /*window.addEventListener('click', function (event) {
            console.log(event);
            event.stopPropagation();
          }, {capture: true});*/
    //this.txtcol = new TagCollection('div', 'wt');
  }
  newWin(parent, title, x, y, w, h, r, clr, clr_text, clr_title, clr_text_title, move = true, resize = true, shadow = false) {
    this.win[this.N] = new WND(parent, title, x, y, w, h, r, clr, clr_text, clr_title, clr_text_title, move, resize, shadow);

    //let wnd = this.win[this.N];
    let h0 = 0.025;
    let H = parent.height.baseVal.value;
    if (h0 * H < 10) h0 = 10 / H;
    //this.txtcol.addTextFull(wnd.title, (x + h0 / 5) * 100, (y + h0 / 13) * 100, wnd.clr_text_title, 80 * h0 * H / this.wnd.w);
    //this.txtcol.list[this.txtcol.cur - 1].style.width = String(Math.round((wnd.w - h0 / 5) * 100)) + 'vw';
    //this.txtcol.list[this.txtcol.cur - 1].style.userSelect = "none";
    this.cur = this.N;
    this.N++;
    //return (this.win[this.N - 1]);
  }
  delete(i) {
    if (i < 0 || this.N < 1) return;
    if (i < this.N) {
      if (i != this.N) {
        this.win[i] = this.win[this.N - 1];
      }
      this.win.length = i;
      this.N--;
      //this.txtcol.newSize(this.N);
      if (this.cur >= this.N) this.cur = this.N - 1;
    }
  }
  /*mouseControl(mouse) {
        let change = false;
        for (let i = this.N - 1; i >= 0; i--) {
            let wnd = this.win[i];
            if (!wnd.move && !wnd.resize) continue;
            let W = this.wnd.w;
            let H = this.wnd.h;
            let x = wnd.x * W;
            let y = wnd.y * H;
            let w = wnd.w * W;
            //let h = wnd.h * H;
            if (wnd.move && !mouse.down) {
                if (wnd.down) {
                    wnd.down = false;
                    this.moving = false;
                    document.body.style.cursor = "default";
                }
                continue;
            }

            if (!wnd.down) {
                if (!this.moving && mouse.xc > x && mouse.xc < (x + w) && mouse.yc > y && mouse.yc < (y + wnd.h0)) {
                    //this.win[i].focus = true;
                    wnd.down = true;
                    wnd.dx = mouse.xc - x;
                    wnd.dy = mouse.yc - y;
                    document.body.style.cursor = "all-scroll";
                    if (i != (this.N - 1)) {
                        let temp = this.win[i];
                        for (let j = i; j < (this.N - 1); j++) this.win[j] = this.win[j + 1];
                        this.win[this.N - 1] = temp;
                    }
                    this.moving = true;
                    break;
                }
            }
            else {
                if ((mouse.x - wnd.x) != wnd.dx) {
                    wnd.x = (mouse.x - wnd.dx) / W;
                    change = true;
                }
                if ((mouse.y - wnd.y) != wnd.dy) {
                    wnd.y = (mouse.y - wnd.dy) / H;
                    change = true;
                }
            }
        }
        if (change) this.ReDrawAll();
    }*/
  ReDrawAll() {
    /*if (this.N > 0) {
            //this.wnd.ctx.fillStyle = set.clr_b;
            this.wnd.ctx.fillRect(0, 0, this.wnd.w, this.wnd.h);
        }*/
    //this.txtcol.newSize(this.N);
    //let h0 = 0.025;
    //let H = this.wnd.h;
    //if (h0 * H < 10) h0 = 10 / H;
    for (let i = 0; i < this.N; i++) {
      let wnd = this.win[i];
      wnd.drawSVG();
      //if (wnd._svg) wnd.drawSVG();
      //else wnd.drawCanvas();
      //this.txtcol.addTextFull(wnd.title, (wnd.x + h0 / 5) * 100, (wnd.y + h0 / 13) * 100, wnd.clr_text_title, 80 * h0 * H / this.wnd.w);
      //this.txtcol.list[this.txtcol.cur - 1].style.width = String(Math.round((wnd.w - h0 / 5) * 100)) + 'vw';
      //this.txtcol.list[this.txtcol.cur - 1].style.userSelect = "none";
    }
  }
}
class WND {
  constructor(parent, title, x, y, w, h, r, clr, clr_text, clr_title, clr_text_title, move = true, resize = true, shadow = false, opacity = 1.0) {
    this.parent = parent;
    //console.log(parent);
    this.title = title;
    this.x = x;
    this.y = y;

    this.r = r;
    this.clr = clr;
    this.clr_title = clr_title;
    this.clr_text = clr_text;
    this.clr_text_title = clr_text_title;
    this.move = move;
    this.resize = resize;
    this.down = false;
    this.dx = 0;
    this.dy = 0;

    this.svg = null;
    this.text = null;
    this.rect = null;

    this.shadow = shadow;
    this.mouse = { x: 0, y: 0, down: false, move: false, xc: 0, yc: 0, in: false };
    this.touch = { x: 0, y: 0, down: false, move: false, xc: 0, yc: 0, in: false };
    this.opacity = opacity;

    this.w = w;
    this.h = h;

    let H = window.innerHeight * window.devicePixelRatio;
    let W = window.innerWidth * window.devicePixelRatio;

    if (w * W <= 20) this.w = 20 / W;
    if (h * H <= 20) this.h = 20 / H;
    //console.log("******  " + H);
    this.h0 = W / 40;
    if (this.h0 < 10) this.h0 = 10;
    this.drawSVG();
    this.addEvents();
  }

  drawCanvas() {
    /*let ctx = this.wnd.ctx;
        let W = this.wnd.w;
        let H = this.wnd.h;

        let h = H / 40;
        if (h < 10) h = 10;
        this.h0 = h;
        ctx.fillStyle = this.clr_title;
        roundRect(ctx, this.x * W, this.y * H, this.w * W, h, 0, true, false);
        ctx.fillStyle = this.clr;
        if (this.shadow) {
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        }
        roundRect(ctx, this.x * W, this.y * H + h - 1, this.w * W, this.h * H - h, 5, true, false)*/
  }
  drawSVG(move = false) {
    let H = this.parent.height.baseVal.value;
    //let W = this.parent.width.baseVal.value;

    let h = H / 40;
    if (h < 10) h = 10;
    this.h0 = h;
    if (this.svg == null) {
      //let tag = document.getElementById('mysvg');
      //console.log(this.wnd.w + "  " + tag.width.baseVal.value);
      //console.log(this.wnd.h + "  " + tag.height.baseVal.value);
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      //this.svg.style.zIndex = 2000;
      this.svg.setAttributeNS(null, "id", this.title + "z");
      if (this.shadow) this.svg.innerHTML = '<defs> <filter id="shadow" color-interpolation-filters="sRGB"> <feDropShadow dx="10" dy="10" stdDeviation="4" flood-opacity="0.3"/> </filter> </defs>';
      //tag.innerHTML = '<svg id="' + this.title + 'z" width="100vw" height="100vh" viewBox="0 0 '+win.w+" "+win.h+'"> <rect id="' + this.title + 'j" x="'+xx+'" y="'+xx+'" width="'+ww+'" height="'+hh+'" rx="0.5vh" ry="0.5vh" style="fill: blue; stroke-width: 0; opacity: 0.5"/></svg>';
      this.parent.appendChild(this.svg);
      this.rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      //console.log(this.w);

      //this.svg.width.baseVal.valueAsString = (this.w * 100).toFixed(2) + "%";
      //this.svg.height.baseVal.valueAsString = (this.h * 100).toFixed(2) + "%";
      this.svg.setAttributeNS(null, "width", (this.w * 100).toFixed(2) + "%");
      this.svg.setAttributeNS(null, "height", (this.h * 100).toFixed(2) + "%");
      this.svg.setAttributeNS(null, "font-family", "Roboto-Light");
      //this.svg.x.baseVal.valueAsString =
      this.svg.setAttributeNS(null, "x", (this.x * 100).toFixed(2) + "%");
      this.svg.setAttributeNS(null, "y", (this.y * 100).toFixed(2) + "%");
      //this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      if (this.opacity < 1.0) this.rect.setAttributeNS(null, "fill-opacity", this.opacity);
      this.rect.setAttributeNS(null, "x", "0");
      this.rect.setAttributeNS(null, "y", "0");
      this.rect.setAttributeNS(null, "rx", this.r + "em");
      this.rect.style.fill = this.clr;
      if (this.shadow) {
        this.rect.setAttributeNS(null, "width", "calc(100% - 16px)");
        this.rect.setAttributeNS(null, "height", "calc(100% - 16px)");
      } else {
        this.rect.setAttributeNS(null, "width", "100%");
        this.rect.setAttributeNS(null, "height", "100%");
      }
      this.rect.setAttributeNS(null, "id", this.title + "j");
      if (this.shadow) this.rect.setAttributeNS(null, "filter", "url(#shadow)");
      //this.text.setAttributeNS(null, "x", (h / 2).toFixed(2));
      //this.text.setAttributeNS(null, "y", (h * 0.8).toFixed(2));
      //this.text.setAttributeNS(null, "fill", this.clr_text_title);

      //this.text.setAttributeNS(null, 'font-family', "Roboto-Light");
      //this.text.setAttributeNS(null, "id", this.title + "t");
      //this.text.textContent = this.title;
      //this.text.style.userSelect = "none";
      this.svg.appendChild(this.rect);
      if (this.title != "") {
        this.text = new TextLine(this.svg, 1, 2.5, this.title, 3, "start", "#FFF");
      }
      //this.svg.appendChild(this.text);
    }
    if (move) {
      this.svg.setAttributeNS(null, "x", (this.x * 100).toFixed(2) + "%");
      this.svg.setAttributeNS(null, "y", (this.y * 100).toFixed(2) + "%");
    }
    //console.log(this.title);
    //let xx = Math.round(this.x * W);
    //let yy = Math.round(this.y * H);
    //let ww = Math.round(this.w * this.wnd.w);
    //let hh = Math.round(this.h * this.wnd.h);
    //this.svg.setAttributeNS(null, "width", ww);
    //this.svg.setAttributeNS(null, "height", hh);
    //rect.setAttributeNS(null, "ry", this.r * (hh + ww));
    //this.svg.setAttributeNS(null, "x", xx);
    //this.svg.setAttributeNS(null, "y", yy);
    //this.svg.setAttributeNS(null, "viewBox", "0 0 " + (ww + 20) + " " + (hh + 20));

    //this.rect.setAttributeNS(null, 'width', ww);
    //this.rect.setAttributeNS(null, 'height', hh);
    //rect.setAttributeNS(null, 'fill', '#' + Math.round(0xffffff * Math.random()).toString(16));

    //this._x = this.x; this._y = this.y; this._w = this.w; this._h = this.h;
    //this._ww = this.wnd.w; this._wh = this.wnd.h;
    //if (!this.events_init) this.addEvents();
  }

  addEvents() {
    //console.log(this.svg);
    this.svg.addEventListener("mousedown", (event) => {
      //this.events_init = true;
      let H = this.parent.height.baseVal.value;
      if (event.pageY < this.h0 + this.y * H) {
        let W = this.parent.width.baseVal.value;
        this.mouse.down = true;
        this.svg.style.cursor = "all-scroll";
        this.mouse.xc = event.pageX / W - this.x;
        this.mouse.yc = event.pageY / H - this.y;
      }
      //this.mouseControl(true);
      //console.log(event);
      //event.stopPropagation();
    });
    window.addEventListener("mouseup", (event) => {
      let H = this.parent.height.baseVal.value;
      this.mouse.down = false;
      if (event.pageY < this.h0 + this.y * H) this.svg.style.cursor = "grab";
      else this.svg.style.cursor = "default";
    });
    window.addEventListener("mousemove", (event) => {
      if (this.mouse.down) {
        let H = this.parent.height.baseVal.value;
        let W = this.parent.width.baseVal.value;
        this.x = event.pageX / W - this.mouse.xc;
        this.y = event.pageY / H - this.mouse.yc;
        //console.log(H + "  " + W + "  " + this.x + "  " + this.y);
        this.drawSVG(true);
      }
      //console.log(event);
      //event.stopPropagation();
    });
    this.svg.addEventListener("mousemove", (event) => {
      if (!this.mouse.down) {
        let H = this.parent.height.baseVal.value;
        if (event.pageY < this.h0 + this.y * H) this.svg.style.cursor = "grab";
        else this.svg.style.cursor = "default";
      }
    });
    this.svg.addEventListener("mouseout", () => {
      this.svg.style.cursor = "default";
    });
  }
}

// ******************************************************************************************
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 * ctx.strokeStyle = "#0f0";
 * ctx.fillStyle = "#ddd";
 * ctx.strokeStyle = "rgb(255, 0, 0)";
 * ctx.fillStyle = "rgba(255, 255, 0, .5)";
 * roundRect(ctx, 300, 5, 200, 100, {tl: 50, br: 25}, true);
 */
export function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (let side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}
// ******************************************************************************************
