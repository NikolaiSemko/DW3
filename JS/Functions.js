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
export function createCircle(ctx, x, y, r, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
}
// ******************************************************************************************
export function DrawCurve(wnd, x, y, x0, y0, x1, y1, _clr1, _clr2, fill, circl, line_width, r_circl = 5, fill_circ = false, draw_mouse_point = false) {
    let ctx = wnd.context;
    //y0 = wnd.h - y0;
    ctx.lineWidth = line_width;
    ctx.strokeStyle = _clr1;
    let size = x.length;
    let gradient;
    if (fill) {
        gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, _clr1);
        gradient.addColorStop(1, _clr2);
    }
    ctx.beginPath();
    ctx.moveTo(x[0], y[0]);
    let m_in = false;
    if (draw_mouse_point) m_in = (wnd.mouse.x < x[size - 1] && wnd.mouse.x > x[0] && wnd.mouse.y < y1 && wnd.mouse.y > y0);
    let ym = 0;
    for (let i = 0; i < size - 1; i++) {
        let x_mid = (x[i] + x[i + 1]) / 2;
        let y_mid = (y[i] + y[i + 1]) / 2;
        let cp_x1 = (x_mid + x[i]) / 2;
        let cp_x2 = (x_mid + x[i + 1]) / 2;
        ctx.quadraticCurveTo(cp_x1, y[i], x_mid, y_mid);
        ctx.quadraticCurveTo(cp_x2, y[i + 1], x[i + 1], y[i + 1]);
        if (m_in && wnd.mouse.x >= x[i] && wnd.mouse.x < x[i + 1]) {
            if (wnd.mouse.x < x_mid) ym = _getQBezierValue((wnd.mouse.x - x[i]) / (x_mid - x[i]), y[i], y[i], y_mid);
            else ym = _getQBezierValue((wnd.mouse.x - x_mid) / (x_mid - x[i]), y_mid, y[i + 1], y[i + 1]);
        }

    }
    if (fill) {
        ctx.lineTo(x[size - 1], y1);
        ctx.lineTo(x[0], y1);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    if (!fill) ctx.stroke();
    if (circl) {
        ctx.lineWidth = 2;
        for (let i = 0; i < size; i++) {
            createCircle(ctx, x[i], y[i], r_circl, fill_circ, _clr1);
        }
    }
    if (m_in) {
        ctx.strokeStyle = '#8888';
        ctx.beginPath();
        ctx.moveTo(wnd.mouse.x, y0);
        ctx.lineTo(wnd.mouse.x, y1);
        ctx.stroke();
        createCircle(ctx, wnd.mouse.x, ym, 4, true, '#00FF');

    }
}
// ******************************************************************************************
export function DrawPolyLine(wnd, x, y, x0, y0, x1, y1, _clr1, _clr2, fill, circl, line_width, r_circl = 5, fill_circ = false, draw_mouse_point = true) {
    let ctx = wnd.context;
    //y0 = wnd.h - y0;
    ctx.lineWidth = line_width;
    ctx.strokeStyle = _clr1;
    let size = x.length;
    if (fill) {
        gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, _clr1);
        gradient.addColorStop(1, _clr2);
    }
    ctx.beginPath();
    ctx.moveTo(x[0], y[0]);
    let m_in = false;
    if (draw_mouse_point) m_in = (wnd.mouse.x < x[size - 1] && wnd.mouse.x > x[0] && wnd.mouse.y < y1 && wnd.mouse.y > y0);
    let ym = 0;
    for (let i = 1; i < size; i++) {
        ctx.lineTo(x[i], y[i]);
        if (m_in && wnd.mouse.x >= x[i - 1] && wnd.mouse.x < x[i]) {
            ym = y[i - 1] + (y[i] - y[i - 1]) * (wnd.mouse.x - x[i - 1]) / (x[i] - x[i - 1]);
        }
    }
    if (fill) {
        ctx.lineTo(x[size - 1], y1);
        ctx.lineTo(x[0], y1);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    if (!fill) ctx.stroke();
    if (circl) {
        ctx.lineWidth = 2;
        for (let i = 0; i < size; i++) {
            createCircle(ctx, x[i], y[i], r_circl, fill_circ, _clr1);
        }
    }
    return ym;
}
// ******************************************************************************************
export function _getQBezierValue(t, p1, p2, p3) {
    var iT = 1 - t;
    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}
// ******************************************************************************************
export function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
    return {
        x: _getQBezierValue(position, startX, cpX, endX),
        y: _getQBezierValue(position, startY, cpY, endY),
    };
}
// ******************************************************************************************
export function Grad(p, a, Col) {
    if (p > 0.9999) p = 1;
    if (p < 0.0001) p = 0;
    let size = Col.length;
    p = p * (size - 1);
    let n = Math.floor(p);
    let k = p - n;
    let c1 = Col[n];
    let c2 = Col[n + 1];
    return "rgba(" + [c1[0] + Math.floor(k * (c2[0] - c1[0]) + 0.5), c1[1] + Math.floor(k * (c2[1] - c1[1]) + 0.5), c1[2] + Math.floor(k * (c2[2] - c1[2]) + 0.5), a].join(",") + ")";
  }