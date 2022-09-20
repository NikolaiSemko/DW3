import { win, chart1, chart2 } from "./app.js";

export function DrawGraf() {
  if (!radio[13].checked) {
    Checked_list();
    let w = 0.95 * chart1.w;
    let h = 0.88 * chart1.h;
    let _y = 0.1 * chart1.h;
    let _x = 0.02 * chart1.w;
    let size = channels.length;
    let size1 = cc.length;
    let max = { v: 0, s: 0, l: 0, d: 0, d2: 0, c: 0 };
    let disl = [size];

    // move to the first point
    let x = [], yv = [], ys = [], yd = [], yd2 = [], yl = [], yc = [];
    let dx = w / (size1 - 1);
    let dv = h;
    let ds = h;
    let dl = h;
    let dd = h;
    let dd2 = h;
    let dc = h;
    for (let i = 0; i < size1; i++) {
      x[i] = _x + dx * i;
      yv[i] = chart1.h - (_y + h * channels[cc[i]].valc[0]);
      ys[i] = chart1.h - (_y + h * channels[cc[i]].valc[1]);
      yd[i] = chart1.h - (_y + h * channels[cc[i]].valc[2]);
      yd2[i] = chart1.h - (_y + h * channels[cc[i]].valc[3]);
      yl[i] = chart1.h - (_y + h * channels[cc[i]].valc[4]);
      yc[i] = chart1.h - (_y + h * channels[cc[i]].valc[5]);
    }
    if (radio[0].checked) {
      if (radio[6].checked) DrawCurve(chart1, x, yv, 0, 0, 0, chart1.h - _y, radio[0].clr + "8", clr2 + "80", true, false, 0.01);
      DrawCurve(chart1, x, yv, 0, 0, 0, chart1.h - _y, radio[0].clr, clr2, false, true, 3);
      //chart1.context.fillStyle = "#FFF";
      for (let i = 0; i < size1; i++) chart1.context.fillText((100 * channels[cc[i]].val[0]).toFixed(1).toString() + "%", x[i] + 0.01 * chart1.w, yv[i]);
    }
    if (radio[1].checked) {
      if (radio[6].checked) DrawCurve(chart1, x, ys, 0, 0, 0, chart1.h - _y, radio[1].clr + "8", clr2 + "80", true, false, 0.01);
      DrawCurve(chart1, x, ys, 0, 0, 0, chart1.h - _y, radio[1].clr, clr2, false, true, 3);
      //chart1.context.fillStyle = "#FFF";
      for (let i = 0; i < size1; i++) chart1.context.fillText((100 * channels[cc[i]].val[1]).toFixed(1).toString() + "%", x[i] + 0.01 * chart1.w, ys[i]);
    }
    if (radio[2].checked) {
      if (radio[6].checked) DrawCurve(chart1, x, yl, 0, 0, 0, chart1.h - _y, radio[2].clr + "8", clr2 + "80", true, false, 0.01);
      DrawCurve(chart1, x, yl, 0, 0, 0, chart1.h - _y, radio[2].clr, clr2, false, true, 3);
      //chart1.context.fillStyle = "#FFF";
      for (let i = 0; i < size1; i++) chart1.context.fillText((100 * channels[cc[i]].val[4]).toFixed(1).toString() + "%", x[i] + 0.01 * chart1.w, yl[i]);
    }
    if (radio[3].checked) {
      if (radio[6].checked) DrawCurve(chart1, x, yd, 0, 0, 0, chart1.h - _y, radio[3].clr + "8", clr2 + "80", true, false, 0.01);
      DrawCurve(chart1, x, yd, 0, 0, 0, chart1.h - _y, radio[3].clr, clr2, false, true, 3);
      //chart1.context.fillStyle = "#FFF";
      for (let i = 0; i < size1; i++) chart1.context.fillText((100 * channels[cc[i]].val[2]).toFixed(1).toString() + "%", x[i] + 0.01 * chart1.w, yd[i]);
    }
    if (radio[4].checked) {
      if (radio[6].checked) DrawCurve(chart1, x, yd2, 0, 0, 0, chart1.h - _y, radio[4].clr + "8", clr2 + "80", true, false, 0.01);
      DrawCurve(chart1, x, yd2, 0, 0, 0, chart1.h - _y, radio[4].clr, clr2, false, true, 3);
      // chart1.context.fillStyle = "#FFF";
      for (let i = 0; i < size1; i++) chart1.context.fillText((100 * channels[cc[i]].val[3]).toFixed(1).toString() + "%", x[i] + 0.01 * chart1.w, yd2[i]);
    }
    if (radio[5].checked) {
      if (radio[6].checked) DrawCurve(chart1, x, yc, 0, 0, 0, chart1.h - _y, radio[5].clr + "8", clr2 + "80", true, false, 0.01);
      DrawCurve(chart1, x, yc, 0, 0, 0, chart1.h - _y, radio[5].clr, clr2, false, true, 3);
      //chart1.context.fillStyle = "#FFF";
      for (let i = 0; i < size1; i++) chart1.context.fillText((100 * channels[cc[i]].valc[5]).toFixed(1).toString() + "%", x[i] + 0.01 * chart1.w, yc[i]);
    }

    // vertical mouse line
    chart1.context.globalAlpha = 0.65;
    chart1.context.lineWidth = 6;
    chart1.context.strokeStyle = "#FFF4";
    chart1.context.beginPath();
    chart1.context.moveTo(chart1.mouse.x, 0);
    chart1.context.lineTo(chart1.mouse.x, chart1.h - 1);
    chart1.context.stroke();
  }
  //  RADAR CHART
  else {
    let ctx = chart1.context;
    Checked_list();
    RadarChart(ctx, cc, Colors, slider[1].val);
  }
}
// ******************************************************************************************
export function RadarChart(ctx, checked_arr, Col, tr = 128, text_color = '#FFF', k_font = 1.8) {
  let h = ctx.canvas.height;
  let w = ctx.canvas.width;
  let fs = Math.round(0.01 * w * k_font);
  //ctx.translate(1, 1);
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "#88F";
  ctx.fillStyle = "#8080FF18";
  let size = channels.length;
  let _y = (0.05 + 0.9 * (1 / (1 + Math.cos(Math.PI / 5)))) * h;

  let _x = _y * 1.05;
  let _r = 0.45 * h;
  for (let i = 5; i > 0; i--) {
    let _rc = i * _r / 5;
    ctx.globalAlpha = 1.0;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#88F";
    ctx.fillStyle = "#8080FF18";
    if (radio[15].checked) {
      if (radio[16].checked) createCircle(ctx, _x, _y, _rc, true, "#8080FF18");
      if (radio[14].checked) createCircle(ctx, _x, _y, _rc, false, "#88F");
    }
    else {
      ctx.beginPath();
      ctx.moveTo(_x, _y - _rc);
      for (let j = 1; j < 6; j++) {
        let angle = -Math.PI / 2 + j * Math.PI / 2.5;
        ctx.lineTo(_x + Math.cos(angle) * _rc, _y + Math.sin(angle) * _rc);
      }
      if (radio[14].checked) ctx.stroke();
      if (radio[16].checked) ctx.fill();
    }
  }
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "#88F";
  ctx.font = String(Math.round(0.8 * fs)) + "px Roboto-Light";
  ctx.fillStyle = text_color;
  for (let j = 0; j < 5; j++) {
    let angle = -Math.PI / 2 + j * Math.PI / 2.5;
    ctx.beginPath();
    let __x = _x + Math.cos(angle) * _r;
    let __y = _y + Math.sin(angle) * _r;
    ctx.moveTo(__x, __y);
    ctx.lineTo(_x, _y);
    ctx.stroke();
    for (let i1 = 1; i1 < 6; i1++) {
      let i2 = (range_inv[j]) ? (5 - i1) : i1;
      let str = 100 * (rmin[j] + i2 * (rmax[j] - rmin[j]) / 5);
      ctx.fillText(str.toFixed(1).toString() + "%", _x + i1 * (__x - _x) / 5, _y + fs / 2.2 + i1 * (__y - _y) / 5);
    }

  }

  let s = checked_arr.length;
  //ctx.globalAlpha = 1.0;
  ctx.lineWidth = 1;
  for (let i = 0; i < s; i++) {
    ctx.strokeStyle = Grad(i / s, 1, Col);
    ctx.fillStyle = Grad(i / s, tr / 255, Col);
    ctx.beginPath();
    let va = channels[checked_arr[i]].valc[0];
    ctx.moveTo(_x, _y - _r * va);
    ctx.font = String(Math.round(fs)) + "px Roboto-Light";
    ctx.fillStyle = "#FFFFFFFF";
    ctx.textAlign = "left";
    for (let j = 1; j < 5; j++) {
      let angle = -Math.PI / 2 + j * Math.PI / 2.5;
      va = channels[checked_arr[i]].valc[j];
      let d = _r * va;
      ctx.lineTo(_x + Math.cos(angle) * d, _y + Math.sin(angle) * d);
      //ctx.fillText((100*channels[checked_arr[i]].val[j]).toFixed(2).toString(), _x + Math.cos(angle) * d, _y + Math.sin(angle) * d)
    }
    ctx.fillStyle = Grad(i / s, tr / 255, Col);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
  ctx.font = String(fs) + "px Roboto-Light";
  ctx.fillStyle = "#88F";
  ctx.textAlign = "center";
  for (let j = 0; j < 5; j++) {
    let angle = -Math.PI / 2 + j * Math.PI / 2.5;
    ctx.fillText(radar_names[j], fs + _x + Math.cos(angle) * _r * 1.1, _y + Math.sin(angle) * _r * 1.1);
    //ctx.fillText(radar_names[j], _x + Math.cos(angle) * _r*1.1, _y + Math.sin(angle) * _r*1.1);
  }
  ctx.textAlign = "left";
  let X = w * 0.75;
  let X1 = w * 0.78;
  let Y = h * 0.2;
  for (let i = 0; i < s; i++) {
    ctx.font = String(1.3 * fs) + "px Roboto-Light";
    ctx.fillStyle = Grad(i / s, 1, Col);
    ctx.fillText(String(i + 1) + ".", X, Y);
    ctx.fillText(channels[checked_arr[i]].title, X1, Y, 0.2 * w);
    Y += fs * 1.5;
  }
}
// ******************************************************************************************

export function DrawGraf2() {
  let w = 0.95 * chart2.w;
  let h = 0.88 * chart2.h;
  let _y = 0.1 * chart2.h;
  let _x = 0.02 * chart2.w;
  let size = ei - _si;
  let max = { v: 0, l: 0, d: 0, d2: 0, c: 0 };
  let disl = [size];
  for (let i = _si; i < ei; i++) {
    if (radio[17].checked) {
      if (max.v < videos[i].view_anom) max.v = videos[i].view_anom;
    }
    else if (max.v < videos[i].viewCount) max.v = videos[i].viewCount;
    if (max.l < videos[i].likeCount) max.l = videos[i].likeCount;
    if (max.d < videos[i].dislikeCount) max.d = videos[i].dislikeCount;
    disl[i] = 100 * videos[i].dislikeCount / (videos[i].dislikeCount + videos[i].likeCount);
    if (max.d2 < disl[i]) max.d2 = disl[i];
    if (max.c < videos[i].commentCount) max.c = videos[i].commentCount;
  }
  if (max.l > max.d) max.d = max.l;
  else max.l = max.d;
  // move to the first point
  x2.length = size;
  let start_time = videos[_si].published_at.getTime();
  let yv = [], yl = [], yd = [], yd2 = [], yc = [];
  let dx = w / (size - 1);
  let dt = w / (videos[ei - 1].published_at.getTime() - start_time);
  let dv = h / max.v;
  let dl = h / max.l;
  let dd = h / max.d;
  let dd2 = h / max.d2;
  let dc = h / max.c;
  for (let i = _si; i < ei; i++) {
    x2[i - _si] = (radio[18].checked) ? (_x + dt * (videos[i].published_at.getTime() - start_time)) : (_x + dx * (i - _si));
    if (radio[17].checked) yv[i - _si] = chart2.h - (_y + dv * videos[i].view_anom);
    else yv[i - _si] = chart2.h - (_y + dv * videos[i].viewCount);
    yl[i - _si] = chart2.h - (_y + dl * videos[i].likeCount);
    yd[i - _si] = chart2.h - (_y + dd * videos[i].dislikeCount);
    yd2[i - _si] = chart2.h - (_y + dd2 * disl[i]);
    yc[i - _si] = chart2.h - (_y + dc * videos[i].commentCount);
  }
  if (radio[7].checked) {
    if (radio[12].checked) DrawCurve(chart2, x2, yv, 0, 0, 0, chart1.h - _y, radio[7].clr + "A", clr2 + "A0", true, false, 0.01);
    DrawCurve(chart2, x2, yv, 0, 0, 0, chart1.h - _y, radio[7].clr, clr2, false, true, 3, 4, true);
  }
  if (radio[8].checked) {
    if (radio[12].checked) DrawCurve(chart2, x2, yl, 0, 0, 0, chart1.h - _y, radio[8].clr + "A", clr2 + "A0", true, false, 0.01);
    DrawCurve(chart2, x2, yl, 0, 0, 0, chart1.h - _y, radio[8].clr, clr2, false, true, 3, 4, true);
  }
  if (radio[9].checked) {
    if (radio[12].checked) DrawCurve(chart2, x2, yd, 0, 0, 0, chart1.h - _y, radio[9].clr + "A", clr2 + "A0", true, false, 0.01);
    DrawCurve(chart2, x2, yd, 0, 0, 0, chart1.h - _y, radio[9].clr, clr2, false, true, 3, 4, true);
  }
  if (radio[10].checked) {
    if (radio[12].checked) DrawCurve(chart2, x2, yd2, 0, 0, 0, chart1.h - _y, radio[10].clr + "A", clr2 + "A0", true, false, 0.01);
    DrawCurve(chart2, x2, yd2, 0, 0, 0, chart1.h - _y, radio[10].clr, clr2, false, true, 3, 4, true);
  }
  if (radio[11].checked) {
    if (radio[12].checked) DrawCurve(chart2, x2, yc, 0, 0, 0, chart1.h - _y, radio[11].clr + "A", clr2 + "A0", true, false, 0.01);
    DrawCurve(chart2, x2, yc, 0, 0, 0, chart1.h - _y, radio[11].clr, clr2, false, true, 3, 4, true);
  }
  // vertical mouse line
  chart2.context.globalAlpha = 0.65;
  chart2.context.lineWidth = 6;
  chart2.context.strokeStyle = "#FFF4";
  chart2.context.beginPath();
  chart2.context.moveTo(chart2.mouse.x, 0);
  chart2.context.lineTo(chart2.mouse.x, chart2.h - 1);
  chart2.context.stroke();
  let x_pos = chart2.mouse.x;
  let ii = Math.round((x_pos - _x) / dx);
  let _w = 320;//(0.24 * chart2.w) | 0;
  if ((chart2.w - x_pos) < _w) x_pos -= _w;
  if (videos.length > 0 && chart2.mouse.move && (_si + ii) >= 0 && (_si + ii) < videos.length) {
    if (typeof videos[_si + ii] != undefined) chart2.context.drawImage(videos[_si + ii].img, x_pos, 5);
    InfoVideo(chart2, x_pos, 190, "#FFF", ii, "#FFFF");
  }
}
// ******************************************************************************************



export function Info() {
  let size1 = channels.length;
  if (size1 == 0) return;
  let size = 0;
  let ch = [];
  let ctx = chart1.context;
  for (let i = 0, j = 0; i < size1; i++)
    if (channels[i].check.checked) {
      size++;
      ch[j] = i;
      j++;
    }
  ctx.globalAlpha = 1.0;
  let dx = (chart1.w * 0.9) / (size - 1);
  let indx = Math.round((chart1.mouse.x - chart1.w * 0.05) / dx);
  if (indx < 0) indx = 0;
  if (indx >= size) indx = size - 1;
  let fs = Math.round(0.01 * win.w);
  ctx.font = String(Math.round(fs)) + "px Roboto-Light";
  ctx.fillStyle = "#FFFFFFFF";
  ctx.textAlign = "left";
  let X = chart1.mouse.x + 5;
  let Y = chart1.mouse.y + 16;
  if ((chart1.w - X) < 140) X -= 140;
  if ((chart1.h - Y) < 140) Y -= 140;
  let k = Math.round(0.014 * win.w) / 15;
  hh = 130 * k;
  ctx.fillText(channels[ch[indx]].title, X, hh);
  ctx.fillText("Views: ", X, hh + 16);
  ctx.fillText("Subscr: ", X, hh + 32);
  ctx.fillText("Videos: ", X, hh + 48);
  ctx.fillText(channels[ch[indx]].total_views, X + 60, hh + 16);
  ctx.fillText(channels[ch[indx]].subscribers, X + 60, hh + 32);
  ctx.fillText(channels[ch[indx]].videos, X + 60, hh + 48);

  ctx.globalAlpha = 0.65;
  ctx.drawImage(channels[ch[indx]].img, X - 5, 5);
}


// ******************************************************************************************
export function InfoChannels(ctx, W, H, x, y, w, h, lineW, clr_fill, clr_line) {

  let fs = W * list_ch.font_size / 60;
  let k = fs / 15;
  let left = 0.05 * W;
  let top = 0.2 * W;
  let _W = left_win * W;
  let step = list_ch.step * W / 60;
  step_ch = step;
  win.context.textAlign = "left";
  ctx.fillStyle = clr_fill;
  //console.log(String(channels.length)+ "  "+ String(curCh));
  if (win.change || (win.mouse.x < _W && win.wheel != 0)) { // left panel
    let last_curCh = curCh;
    let size = channels.length;
    //console.log(size);
    let maxW = 0;
    let temp = hh;
    if (win.wheel > 0) curCh++;
    if (win.wheel < 0) curCh--;
    if (curCh < 0) curCh = 0;
    if (curCh >= size) curCh = size - 1;
    if (last_curCh != curCh) cur_row_video = 0;
    if (!win.change && temp == curCh) return;
    //cur_row_video = 0;
    si = 0;
    let size_v = videos.length;
    if (size_v > 0) {
      while (si < size_v && videos[si].channel != channels[curCh].id) si++;
      if (si >= size_v) no_videos = true;
      else no_videos = false;
      ei = si;
      while (ei < size_v && videos[ei].channel == channels[curCh].id) ei++;
    }
    _si = ei - last_vid;
    if (si > _si) _si = si;
    ctx.fillRect(0, 0, _W, H);
    win.context.font = String(fs * 1.3) + "px Roboto-Light";
    ctx.fillStyle = "#FF0F";
    win.context.fillText("Channels:               Videos:", 0.05 * W, 0.07 * H);
    win.context.font = String(fs) + "px Roboto-Light";
    ctx.fillStyle = clr_fill;
    let cY = [size];
    if (size > 0) cY[0] = 0.018 * H + y * H;
    if (size > 1) for (let i = 1; i < size; i++) {
      cY[i] = cY[i - 1] + step;
    }
    cur_y_top = cY[0];
    cur_y_bottom = cY[size - 1] + step;
    //let nw = ctx.measureText("999. ").width;
    //_cc = JSON.parse(document.getElementById("channels").textContent);
    win.context.fillStyle = "#448";
    ctx.fillRect(0, cY[curCh], _W, step);
    win.context.fillStyle = "#FFF";
    list_ch.newSize(size * 2);
    if (_cc[0][0][0] == -2)
      ctx.fillText("No channels found.", W * x, w * H + fs * 3);
    else {
      let Y = 0.012 * H + y * H;
      for (let i = 0; i < size; i++) {
        let X = _W * 0.09;
        Y += step;
        // delete sign
        createCircle(ctx, fs / 2 + 1, Y - fs / 3, fs / 2.2, true, '#F008');
        ctx.lineWidth = fs / 6;
        ctx.strokeStyle = clr1;
        ctx.beginPath();
        ctx.moveTo(fs / 4 + 1, Y - 0.58 * fs);
        ctx.lineTo(0.75 * fs + 1, Y - 0.08 * fs);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(fs / 4 + 1, Y - 0.08 * fs);
        ctx.lineTo(0.75 * fs + 1, Y - 0.58 * fs);
        ctx.stroke();
        if (i < 9) list_ch.addText(String(i + 1) + ".&ensp;&ensp;" + channels[i].title);
        else list_ch.addText(String(i + 1) + ".&ensp;" + channels[i].title);
        list_ch.addTextX(String(channels[i].videos), 12.8);
        X = _W * 0.95;
        channels[i].check.x = X / W;
        channels[i].check.y = Y / H - (fs / 3) / W;
        channels[i].check.Draw();
      }
      if (size_v > 0) {
        ShowListVideos(left, top);
        chart2.change = true;
        reDrawChart2();
      }
    }
  } else if ( // right panel
    ei - si > 0 &&
    win.mouse.x >= _W &&
    (win.mouse.move || win.wheel != 0)) {                                                // list of views
    //let ww = ((0.7 * W) / 140) | 0;
    hh = ((win.h - 20) / (130 * k)) | 0;
    if (win.wheel != 0) {
      cur_row_video += win.wheel > 0 ? 1 : -1;
      if ((cur_row_video >= (ei - si)) | 0)
        cur_row_video = (((ei - si)) | 0) - 1;
      if (cur_row_video < 0) cur_row_video = 0;
      ShowListVideos(left, top);
    }
    let _top = 0.18 * win.h + 0.02 * W;
    let cur_v = (cur_row_video + (win.mouse.y - _top) / (130 * k)) | 0;
    ShowListVideos(left, top);
    if (cur_v >= 0 && cur_v < ei - _si) {
      cur_v = ei - _si - 1 - cur_v;
      //InfoVideo(win, win.mouse.x, win.mouse.y, "#FF0", cur_v, "#00FF");
      if (cur_v != pre_cur_v) {
        chart2.change = true;
        reDrawChart2();
        chart2.context.lineWidth = 3;
        chart2.context.globalAlpha = 0.65;
        chart2.context.strokeStyle = "#0F59";
        chart2.context.beginPath();
        chart2.context.moveTo(x2[cur_v], 0);
        chart2.context.lineTo(x2[cur_v], 0.9 * chart2.h);
        chart2.context.stroke();
        let x_pos = x2[cur_v];
        let _w = 320;//(0.24 * chart2.w) | 0;
        if ((chart2.w - x_pos) < _w) x_pos -= _w;
        chart2.context.drawImage(videos[_si + cur_v].img, x_pos, 5);
        InfoVideo(chart2, x2[cur_v], 190, "#FFF", cur_v, "#FFFF");
      }
      pre_cur_v = cur_v;
    }
  }
}

// ******************************************************************************************


export function InfoVideo(wnd, x_pos, y_pos, clrb, cur_v, clr) {
  let _w = (0.24 * wnd.w) | 0;
  let _h = (0.13 * wnd.w) | 0;
  if (wnd.w - x_pos < _w) x_pos -= _w;
  if (wnd.h - y_pos < _h) y_pos -= _h;
  wnd.context.fillStyle = clr;
  wnd.context.globalAlpha = 1;
  let fs = Math.round(0.016 * wnd.w);
  wnd.context.font = String(fs) + "px Roboto-Light";
  wnd.context.textAlign = "left";
  let s = String(videos[si + cur_v].title).substr(0, 25);
  let _y = y_pos + 0.15 * _h;
  wnd.context.fillText(s, x_pos + 6, _y);
  if (radio[17].checked) s = "views: " + String(videos[si + cur_v].view_anom);
  else s = "views: " + String(videos[si + cur_v].viewCount);
  _y += 1.2 * fs;
  //if (wnd==chart2) console.log(x_pos + 6);
  wnd.context.fillText(s, x_pos + 6, _y);
  s = "likes: " + String(videos[si + cur_v].likeCount);
  _y += 1.2 * fs;
  wnd.context.fillText(s, x_pos + 6, _y);
  s = "dislikes: " + String(videos[si + cur_v].dislikeCount);
  _y += 1.2 * fs;
  wnd.context.fillText(s, x_pos + 6, _y);
  s = "comments: " + String(videos[si + cur_v].commentCount);
  _y += 1.2 * fs;
  wnd.context.fillText(s, x_pos + 6, _y);
  s = videos[si + cur_v].published_at.toLocaleDateString();
  _y += 1.2 * fs;
  wnd.context.fillText(s, x_pos + 6, _y);
}
// ******************************************************************************************

export function ShowListVideos(left, top) {
  let size = ei - si;
  let W = win.w;
  let H = win.h;
  let fs = Math.round(0.014 * W);
  let k = fs / 15;
  //let ww = ((0.7 * win.w) / 140) | 0;
  hh = ((win.h - top) / (130 * k)) | 0;
  //let ww = 1;
  let i = cur_row_video;
  let ctx = win.context;
  ctx.fillStyle = clr1;
  ctx.fillRect(left_win * W, 0, (1 - left_win) * W, H);

  ctx.fillStyle = '#44A';
  ctx.strokeStyle = '#FF0';
  ctx.lineWidth = 1.5;
  roundRect(ctx, (0.41 + cur_platf * 0.05) * W, 0.002 * H, 0.05 * W, 0.036 * H, 0.007 * W, true, true);
  ctx.drawImage(img_youtube, 0.435 * W - 0.5 * img_youtube.width * (0.027 * H) / img_youtube.height, 0.006 * H, img_youtube.width * (0.027 * H) / img_youtube.height, 0.027 * H);
  ctx.drawImage(img_tiktok, 0.485 * W - 0.5 * img_tiktok.width * (0.027 * H) / img_tiktok.height, 0.006 * H, img_tiktok.width * (0.027 * H) / img_tiktok.height, 0.027 * H);
  ctx.drawImage(img_instagram, 0.535 * W - 0.5 * img_instagram.width * (0.027 * H) / img_instagram.height, 0.006 * H, img_instagram.width * (0.027 * H) / img_instagram.height, 0.027 * H);
  radio[13].Draw();
  radio[17].Draw();
  slider[0].Draw(); // last video
  slider[2].Draw(); // CPM
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 0.5;
  roundRect(ctx, (1 - right_win) * W, 0.05 * W, 0.288 * W, 0.14 * W, W * 0.01, false);
  roundRect(ctx, (left_win + 0.01) * W, 0.05 * W, (1 - left_win - right_win - 0.02) * W, 0.14 * W, W * 0.01, false);


  let X0 = info_ch.x + 5;
  let X1 = (left_win + 0.22) * 60;
  info_ch.newSize(21);
  info_ch.addText("Total views: ");
  info_ch.addTextXclr(channels[curCh].total_views.toString(), X0, '#0FD');
  info_ch.addTextXclr("INFO FOR " + last_vid.toString() + " LAST VIDEOS", X1, '#0F0');
  info_ch.addText("Subscribers: ");
  info_ch.addTextXclr(channels[curCh].subscribers.toString(), X0, '#0FD');
  info_ch.addTextX("Views: ", X1);
  info_ch.addTextXclr(channels[curCh].sumv[0].toString(), X1 + 5.4, '#FA3');
  info_ch.addText("Total Videos: ");
  info_ch.addTextXclr(channels[curCh].videos.toString(), X0, '#0FD');
  info_ch.addTextX("Likes: ", X1);
  info_ch.addTextXclr(channels[curCh].sumv[1].toString(), X1 + 5.4, '#FA3');
  info_ch.addText("Published at: ");
  info_ch.addTextXclr(channels[curCh].published_at.toLocaleDateString(), X0, '#0FD');
  info_ch.addTextX("Dislikes: ", X1);
  info_ch.addTextXclr(channels[curCh].sumv[2].toString(), X1 + 5.4, '#FA3');
  info_ch.addTextX("Comments: ", X1, true);
  info_ch.addTextXclr(channels[curCh].sumv[3].toString(), X1 + 5.4, '#FA3');
  info_ch.addTextX("Score: ", X1, true);
  info_ch.addTextXclr(Math.round(100 * channels[curCh].valc[5]).toString() + "%", X1 + 5.4, '#FA3');
  info_ch.addTextFull(String(Math.round((channels[curCh].sumv[0]) * slider[2].val / 1000)) + " $", X0 - 3, 9.5, '#FF0', 1.3);
  info_ch.addTextFull('Channel:  "' + channels[curCh].title + '"', X0 - 5, 3.4, '#FF0', 1.3);

  radio[19].Draw();

  let X = (left_win + 0.02) * W;
  let Y = 0.05 * W;

  ctx.font = String(fs) + "px Roboto-Light";
  let end = i + (0.82 * H - 0.02 * W) / (130 * k);
  if (end > size) end = size;
  let h_list = (0.82 * H - 0.02 * W) * (end - i) / size;
  let start = 0.18 * H + 0.02 * W + i * (0.82 * H - 0.02 * W) / size;
  ctx.fillStyle = "#448";
  ctx.fillRect(left_win * W, start, 0.009 * W, h_list);
  //let _size = ()
  list_vd.newSize()
  for (let iy = 0; iy < (hh + 1) && i < size; iy++) {
    let icur = size - 1 - i + si;
    let _top = top + 130 * k * iy;
    let _y = _top + 1.2 * fs;
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 0.5;
    roundRect(ctx, (left_win + 0.01) * W, _top, (1 - left_win - 0.02) * W, 120 * k, W * 0.01, false);
    if (videos[icur].img.width == 120)
      ctx.drawImage(
        videos[icur].img,
        left_win * W + left,
        _y, k * 120, k * 90
      );
    else
      ctx.drawImage(
        videos[icur].img,
        left_win * W + left,
        _y + fs, k * 120, k * 68
      );

    ctx.fillStyle = "#0FF";
    ctx.font = String(0.9 * fs) + "px Roboto-Light";
    ctx.textAlign = "left";
    let s = String(videos[icur].title).substr(0, 45);

    let x_pos = left_win * W + left;
    ctx.fillText(s, x_pos - left + 0.02 * W, _y);
    ctx.fillStyle = "#FFF";
    if (radio[17].checked && i < last_vid) s = "views: " + String(videos[icur].view_anom);
    else s = "views: " + String(videos[icur].viewCount);
    _y += 1.2 * fs;
    x_pos += 135 * k;
    //if (wnd==chart2) console.log(x_pos + 6);
    ctx.fillText(s, x_pos, _y);
    s = "likes: " + String(videos[icur].likeCount);
    _y += 1.2 * fs;
    ctx.fillText(s, x_pos, _y);
    s = "dislikes: " + String(videos[icur].dislikeCount);
    _y += 1.2 * fs;
    ctx.fillText(s, x_pos, _y);
    s = "comments: " + String(videos[icur].commentCount);
    _y += 1.2 * fs;
    ctx.fillText(s, x_pos, _y);
    s = videos[icur].published_at.toLocaleDateString();
    _y += 1.2 * fs;
    ctx.fillText(s, x_pos, _y);
    if (radio[17].checked && i < last_vid) s = "Total: " + String(Math.round(videos[icur].view_anom * slider[2].val / 1000)) + " $";
    else s = "Total: " + String(Math.round(videos[icur].viewCount * slider[2].val / 1000)) + " $";
    _y -= 3.6 * fs;
    x_pos += 120 * k;
    ctx.font = String(1.2 * fs) + "px Roboto-Light";
    ctx.fillStyle = "#0F0";
    ctx.fillText(s, x_pos, _y);
    s = "Avr: " + String(Math.round((channels[curCh].sumv[0] / last_vid) * slider[2].val / 1000)) + " $";
    _y += 1.4 * fs;
    ctx.fillStyle = "#FF0";
    ctx.fillText(s, x_pos, _y);
    s = String(i + 1) + ".";
    _y -= 0.8 * fs;
    x_pos = left_win * W + 0.02 * W;
    ctx.fillStyle = "#FFF";
    ctx.fillText(s, x_pos, _y);
    smallChart(win, (left_win + 0.29) * W + 130 * k, _top + 3, (1 - left_win - 0.29 - 0.02) * W - 130 * k, 114 * k, videos[icur]);
    i++;
  }
  win.wheel = 0;
}
// ******************************************************************************************
export function smallChart(wnd, x, y, w, h, elem) {
  let ctx = wnd.context;
  ctx.fillStyle = '#FFF1';
  roundRect(wnd.context, x, y, w, h, 0, true);
  let fs = Math.round(0.014 * wnd.w);
  let X = [];
  let Yv = [], Yl = [], Yd = [], Yc = [];
  let size = elem.upd.length;
  let deltaX = (elem.upd[size - 1] - elem.upd[0]) / w;
  let min_v = Math.min(...elem.views);
  let max_v = Math.max(...elem.views);
  let deltaYv = (max_v - min_v) / h;
  for (let i = 0; i < size; i++) {
    X[i] = x + (elem.upd[i] - elem.upd[0]) / deltaX;
    Yv[i] = y + h - (elem.views[i] - min_v) / deltaYv;
    if (radio[19].checked) createCircle(ctx, X[i], Yv[i], 2, true, "#FF06");
  }
  ctx.fillStyle = '#88F8';
  ctx.font = String(1.5 * fs) + "px Roboto-Light";
  ctx.fillText("Views: " + elem.views[0].toString() + " - " + elem.views[size - 1].toString(), x + 0.02 * w, y + 0.3 * h);
  ctx.fillText("From: " + (new Date(elem.upd[0] * 1000)).toLocaleDateString() + " to " + (new Date(elem.upd[size - 1] * 1000)).toLocaleDateString(), x + 0.02 * w, y + 0.6 * h);
  let ago = Math.floor((Date.now() - elem.upd[size - 1] * 1000) / 86400000);
  if (ago == 0) ctx.fillText("Last " + Math.round((elem.upd[size - 1] - elem.upd[0]) / 86400).toString() + " days (" + size.toString() + " meterings)", x + 0.02 * w, y + 0.9 * h);
  else ctx.fillText("History " + Math.round((elem.upd[size - 1] - elem.upd[0]) / 86400).toString() + " days " + ago.toString() + " days ago", x + 0.02 * w, y + 0.9 * h);
  let ym = DrawPolyLine(wnd, X, Yv, 0, y, 0, y + h, "#8FF4", "#AFF1", false, false, 1.414, 2, false, true);
  if (ym > 0) {
    ctx.strokeStyle = '#8888';
    ctx.beginPath();
    ctx.moveTo(wnd.mouse.x, y);
    ctx.lineTo(wnd.mouse.x, y + h);
    ctx.stroke();
    createCircle(ctx, wnd.mouse.x, ym, 4, true, '#00FF');

    ctx.font = String(0.9 * fs) + "px Roboto-Light";
    let cy = y + 0.1 * h;
    if (ym < (y + h / 2)) cy = y + 0.9 * h;
    let tm = new Date(Math.round(1000 * (elem.upd[0] + deltaX * (wnd.mouse.x - X[0]))));
    let str1 = Math.round(min_v + deltaYv * (y + h - ym)).toString() + " views ";
    let str2 = tm.toLocaleDateString() + " " + tm.getHours() + ":" + tm.getMinutes();
    let nw1 = ctx.measureText(str1).width;
    let nw2 = ctx.measureText(str2).width;
    let cx = wnd.mouse.x + 0.02 * w;
    let cxv = cx;
    if (wnd.mouse.x > (X[size - 1] + X[0]) / 2) {
      cx -= (nw2 + 0.04 * w);
      cxv -= (nw1 + 0.04 * w);
    }
    ctx.fillStyle = '#FFF';
    ctx.fillText(str1, cxv, ym + 0.1 * h);
    ctx.fillStyle = '#0F0';
    ctx.fillText(str2, cx, cy);
  }
}
// ******************************************************************************************
export function reDrawWin() {
  if (videos.length < 1) return;
  if (!win.change && !win.mouse.move && win.wheel == 0) return;
  //win.context.clearRect(0, 0, win.w, win.h);
  InfoChannels(win.context, win.w, win.h, 0.0, 0.06, 0.44, 0.9, 3, clr4, clr4);
  if (last_vid != slider[0].val) {
    last_vid = slider[0].val;
    _si = ei - last_vid;
    if (si > _si) _si = si;
    CalcVal();
  }
  win.change = false;
  win.mouse.move = false;
  win.wheel = 0;
  if (chart1 != -1 && chart1.change) reDrawChart1();
}
// ******************************************************************************************
export function reDrawChart1() {
  if (videos.length < 1) return;
  if (!chart1.change) return;
  chart1.context.clearRect(0, 0, chart1.w, chart1.h);
  chart1.context.globalAlpha = 1.0;
  let fs = Math.round(0.011 * win.w);
  chart1.context.font = String(Math.round(fs)) + "px Roboto-Light";

  chart1.context.fillStyle = "#FFFFFFFF";
  chart1.context.textAlign = "left";

  chart1.context.globalAlpha = 0.65;
  DrawGraf();
  if (!radio[13].checked) {
    Info();
    radio[0].Draw();
    radio[1].Draw();
    radio[2].Draw();
    radio[3].Draw();
    radio[4].Draw();
    radio[5].Draw();
    radio[6].Draw();
  }
  else {
    slider[1].Draw(); // transp
    radio[14].Draw();
    radio[15].Draw();
    radio[16].Draw();
  }
  chart1.change = false;
  chart1.mouse.move = false;
  chart1.wheel = 0;

  //time = performance.now() - time;
  //console.log('runtime = ', time, ' ms');
}
// ******************************************************************************************
export function reDrawChart2() {
  if (videos.length < 1) return;
  if (!chart2.change) return;
  chart2.context.clearRect(0, 0, chart2.w, chart2.h);
  chart2.context.globalAlpha = 1.0;
  let fs = Math.round(0.001 * win.w);

  chart2.context.globalAlpha = 0.65;
  DrawGraf2();
  radio[7].Draw();
  radio[8].Draw();
  radio[9].Draw();
  radio[10].Draw();
  radio[11].Draw();
  radio[12].Draw();
  radio[18].Draw();
  chart2.change = false;
  chart2.mouse.move = false;
  chart2.wheel = 0;
  //time = performance.now() - time;
  //console.log('runtime = ', time, ' ms');
}
