import { roundRect, createCircle } from "./Functions.js";
export default class Slider {
  constructor(wnd, x = 0.24, y = 0.1, w = 0.2, start = 0, end = 100, val = 50, r = 0.0035, clr = '#AAF', text = '', clr_text = '#FFF', is = "no", addwin = 0, yh = true) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.start = start;
    this.end = end;
    this.val = val;
    this.clr = clr;
    this.r = r;
    this.wnd = wnd;
    this.text = text;
    this.clr_text = clr_text;
    this.is = is;
    this.addwin = addwin;
    this.focus = false;
    this.newpos = false;
    //this.last_x = 0;
    this.yh = yh;
  }
  MouseDown(wnd) {
    if (wnd != this.wnd) return;
    let _w = this.wnd.w;
    let _h = this.wnd.h;
    let ww = this.w * _w;
    let cx = _w * this.x + ww * (this.val - this.start) / (this.end - this.start);
    let dx = this.wnd.mouse.x - cx;
    let _g = (this.yh) ? _h : _w;
    let dy = this.wnd.mouse.y - this.y * _g;

    let _r = (_h + _w) * this.r;
    if (dy * dy + dx * dx <= _r * _r) {
      this.focus = true; //!this.focus;
      //this.last_x = this.wnd.mouse.x;
    }
    //this.IfAddWin(this.addwin);
    //wnd.change = true;
  }
  TouchStart(wnd) {
    if (wnd != this.wnd) return;
    let _w = this.wnd.w;
    let _h = this.wnd.h;
    let ww = this.w * _w;
    let cx = _w * this.x + ww * (this.val - this.start) / (this.end - this.start);
    let dx = this.wnd.touch.x - cx;
    let _g = (this.yh) ? _h : _w;
    let dy = this.wnd.touch.y - this.y * _g;

    let _r = (_h + _w) * this.r;
    if (dy * dy + dx * dx <= 4 * _r * _r) {
      this.focus = true;
      //this.last_x = this.wnd.touch.x;
    }
  }
  MouseUp() {
    //if (this.last_x != this.wnd.mouse.x) 
    this.focus = false;
  }
  TouchEnd() {
    //if (this.last_x != this.wnd.touch.x) 
    this.focus = false;
  }
  MouseMove(wnd) {
    if (!this.focus || wnd != this.wnd) return;
    let _w = this.wnd.w;
    let mx = this.wnd.mouse.x;
    let x0 = this.x * _w;
    let x1 = x0 + this.w * _w;
    let cur = 0;
    if (mx <= x0) cur = this.start;
    else if (mx >= x1) cur = this.end;
    else cur = Math.round(this.start + (this.end - this.start) * (mx - x0) / (x1 - x0));
    if (cur == this.val) this.newpos = false;
    else {
      this.newpos = true;
      this.val = cur;
    }
    this.wnd.change = true;
  }
  TouchMove(wnd) {
    if (!this.focus || wnd != this.wnd) return;
    let _w = this.wnd.w;
    let mx = this.wnd.touch.x;
    let x0 = this.x * _w;
    let x1 = x0 + this.w * _w;
    let cur = 0;
    if (mx <= x0) cur = this.start;
    else if (mx >= x1) cur = this.end;
    else cur = Math.round(this.start + (this.end - this.start) * (mx - x0) / (x1 - x0));
    if (cur == this.val) this.newpos = false;
    else {
      this.newpos = true;
      this.val = cur;
    }
    this.wnd.change = true;
  }
  Draw() {
    let _w = this.wnd.w;
    let _h = this.wnd.h;
    let _x = _w * this.x;
    let _g = (this.yh) ? _h : _w;
    let _y = this.y * _g;
    let ww = this.w * _w;
    let cxl = ww * (this.val - this.start) / (this.end - this.start);
    let cxr = ww * (this.end - this.val) / (this.end - this.start);
    let cx = _x + cxl;
    let ctx = this.wnd.context;
    ctx.globalAlpha = 1.0;
    let _r = (_h + _w) * this.r;
    let r0 = 0.3 * _r;
    ctx.fillStyle = "#66D";
    roundRect(ctx, _x - r0, _y - r0, cxl + r0 * 2, 2 * r0, r0, true, false);
    ctx.fillStyle = "#666";
    roundRect(ctx, cx - r0, _y - r0, cxr + r0 * 2, 2 * r0, r0, true, false);
    createCircle(ctx, cx, _y, _r, true, this.clr);

    ctx.font = String(Math.round(1.4 * _r)) + "px Roboto-Light";
    ctx.textAlign = "left";
    ctx.fillStyle = this.clr_text;
    if (this.text != '') {
      ctx.fillText(this.text + " = " + this.val.toString(), _x, _y - 1.3 * _r);
    }
    else {
      ctx.fillStyle = "#FFF";
      ctx.fillText(this.val.toString(), cx, _y - 1.3 * _r);
    }
  }
}

