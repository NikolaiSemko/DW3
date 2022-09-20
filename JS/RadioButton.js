import { win} from "./app.js";
import { roundRect, createCircle } from "./Functions.js";

export default class RadioButton {
    constructor(wnd, x = 0.24, y = 0.1, r = 0.0035, checked = true, clr = '#AAF', text = '', clr_text = '#FFF', type = "square", is = "no", addwin = 0, yh = true) {
        this.x = x;
        this.y = y;
        this.checked = checked;
        this.clr = clr;
        this.r = r;
        this.wnd = wnd;
        this.text = text;
        this.clr_text = clr_text;
        this.type = type;
        this.is = is;
        this.addwin = addwin;
        this.yh = yh;
    }
    CheckFocus(wnd) {
        if (wnd != this.wnd) return;
        let _w = this.wnd.w;
        let _h = this.wnd.h;
        let dx = this.wnd.mouse.x - _w * this.x;
        let _g = (this.yh) ? _h : _w;
        let dy = this.wnd.mouse.y - this.y * _g;

        let _r = (_h + _w) * this.r;
        if (this.type != "switch") {
            if (dy * dy + dx * dx <= _r * _r) {
                if (wnd.mouse.down) {
                    this.checked = !this.checked;
                    wnd.change = true;
                }
            }
        }
        else {
            if (dx < _r * 4.1 && dx > -1.6 * _r && dy < _r * 1.6 && dy > -1.6 * _r) {
                if (wnd.mouse.down) {
                    this.checked = !this.checked;
                    if (this.is == "no") {
                        Checked_list();
                    }
                    wnd.change = true;
                }
            }
        }
    }
    Draw() {
        let _w = this.wnd.w;
        let _h = this.wnd.h;
        let _x = _w * this.x;
        let _g = (this.yh) ? _h : _w;
        let _y = this.y * _g;
        let ctx = this.wnd.context;
        let _r = (_h + _w) * this.r;
        if (this.type == "circle") {
            ctx.lineWidth = _r * 0.25;
            ctx.globalAlpha = 1.0;
            createCircle(ctx, _x, _y, _r, false, this.clr);
            if (this.checked)
                createCircle(ctx, _x, _y, _r * 0.5, true, this.clr);
        }
        else if (this.type == "square") {
            ctx.lineWidth = _r * 0.2;
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = this.clr;
            roundRect(ctx, _x - _r, _y - _r, 2 * _r, 2 * _r, 0.5 * _r, false, true);
            if (this.checked) {
                ctx.font = String(Math.round(3 * _r)) + "px Roboto-Light";
                ctx.fillStyle = "#0F0";
                ctx.fillText('✓', _x - 0.9 * _r, _y + 0.7 * _r);
            }
            //createCircle(ctx, _x, _y, _r * 0.5, true, this.clr);
        }
        else if (this.type == "switch") {
            ctx.lineWidth = _r * 0.01;
            ctx.globalAlpha = 1.0;
            if (this.checked) {
                ctx.strokeStyle = ctx.fillStyle = "#99F";
                roundRect(ctx, _x - _r, _y - _r, 4.5 * _r, 2 * _r, _r, true, true);
                createCircle(ctx, _x + 2.5 * _r, _y, _r * 1.5, true, this.clr);
            }
            else {
                ctx.strokeStyle = ctx.fillStyle = "#666";
                roundRect(ctx, _x - _r, _y - _r, 4.5 * _r, 2 * _r, _r, true, true);
                createCircle(ctx, _x, _y, _r * 1.5, true, "#999");
            }
        }
        if (this.text != '') {
            ctx.font = String(Math.round(1.4 * _r)) + "px Roboto-Light";
            ctx.textAlign = "left";
            ctx.fillStyle = this.clr_text;
            if (this.type != "switch") ctx.fillText(this.text, _x + 2 * _r, _y + 0.7 * _r);
            else {
                ctx.font = String(Math.round(2 * _r)) + "px Roboto-Light";
                ctx.fillText(this.text, _x + 4.5 * _r, _y + 0.7 * _r);
            }
        }
    }
}
