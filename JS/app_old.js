//import * as Module from './modules/Layer.js';

$(document).on('submit', '#form1', function (e) {
  e.preventDefault();
  let d1 = $('#mytextbox').val();
  //let d2 = $('#mytextbox2').val();
  let d2 = "";
  document.getElementById("mytextbox").value = '';
  //document.getElementById("mytextbox2").value = '';
  $.ajax({
    type: 'POST',
    url: 'actionUrl',
    async: true,
    cache: true,
    data: {
      channel: d1,
      find: d2,
      platform: cur_platf,
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function (resp) {
      NewListFromServer(resp.channels);
    }
  })
});

let win;
let kkk = true;
let chart1 = -1;
let chart2;
let channels = [];
let videos = [];
let clr1 = "#050530";
let clr2 = "#050530";
let clr3 = "#050530";
let clr4 = "#050530";
let hh = 130;
let radio = [];
let slider = [];
let gradient;
let left_win = 0.27;
let right_win = 0.3;
let cur_y_top = 0;
let cur_y_bottom = 0;
let step_ch = 0;
let last_vid = 15;
let cc = []; // checked channels array
let _cc = new Object();
// var for Radar chart
let range_min = [0, 0, 0.85, 0, 0];
let range_max = [0.5, 1, 1, 0.15, 0.025];
let range_inv = [true, false, false, false, false];
let radar_names = ["Consistent\nViewership %", "View/Subscr %", "Like/Dislike %", "Like/View %", "Comm/View %"];
let rmin = [];
let rmax = [];

let search = false;
let lines_y = [];
let curCh = 0, pre_cur_v = -1, si = 0, ei = 0, _si = 0;
let no_videos = true;
let cur_row_video = 0;
let x2 = [];
let Colors = [[255, 255, 255], [255, 255, 100], [100, 255, 100], [100, 255, 255], [100, 100, 255], [255, 100, 255], [255, 100, 100], [100, 100, 100]];
let timer = setInterval(GetDataFromServer, 5 * 60 * 1000);
let last_time = Date.now() / 1000;
let img_logo = new Image();
img_logo.src = 'static/IMG/logo.png';
let img_tiktok = new Image();
img_tiktok.src = 'static/IMG/tiktok3.png';
let img_youtube = new Image();
img_youtube.src = 'static/IMG/youtube-logo.png';
let img_instagram = new Image();
img_instagram.src = 'static/IMG/Instagram.png';
let cur_platf = 0;


// ******************************************************************************************
class Channel {
  constructor(c) {
    this.id = c[0];
    this.id_channel = c[1];
    this.title = c[2];
    this.network_type = c[3];
    this.monitoring = c[4];
    this.img = new Image();
    this.img.src = c[5];
    this.description = c[6];
    this.published_at = new Date(c[7] * 1000);
    this.total_views = c[8];
    this.viewCount = 0;
    this.likeCount = 0;
    this.dislikeCount = 0;
    this.commentCount = 0;
    this.hiddenSubscriberCount = c[9];
    this.subscribers = c[10];
    this.videos = c[11];
    this.check = new RadioButton(win);
    this.from = 0;
    this.to = 0;
    this.val = [5];   //  0 - Standard deviation from views, 
    //  1 - Views / Subscribers * 100 %, 
    //  2 - (Likes - Dislikes) / (Likes + Dislikes),
    //  3 - Likes/Views*100,    
    //  4 - Comments / Views * 100
    this.valc = [6];
    this.sumv = [5];
    //sumv[0] = total_v;
    //sumv[1] = total_l;
    //sumv[2] = total_d;
    //sumv[3] = total_c;
    //sumv[4] = total_va;  // anomalies
    //this.upd = [];
    //this.views = [];
    //this.subsc = [];
    //this.videosh = [];
  }
}
// ******************************************************************************************
class Video {
  constructor(c) {
    this.id = c[0];
    this.id_video = c[1];
    this.title = c[2];
    this.monitoring = c[3];
    this.img = new Image();
    this.img.src = c[4];
    this.published_at = new Date(c[5] * 1000);
    this.categoryId = c[6];
    this.viewCount = c[7];
    this.view_anom = 0;
    this.likeCount = c[8];
    this.dislikeCount = c[9];
    this.commentCount = c[10];
    this.channel = c[11];
    this.upd = [];
    this.views = [];
    //this.likes = [];
    //this.dlikes = [];
    //this.comms = [];
  }
}
// ******************************************************************************************
class TagCollection {
  constructor(type, id, x, y, clr = "#FFF", font = "Roboto-Light", font_size = 2, step = 2.2, maxWidth = "auto", yh = true) {
    this.list = [];
    this.size = 0;
    this.type = type;
    this.cur = 0;
    this.cursize = 0;
    this.curline = 0;
    this.font = font;
    this.font_size = font_size;
    this.clr = clr;
    this.step = step;
    // = maxWidth;
    this.x = x;
    this.y = y;
    this.id = id;
    this.style = String(id) + 'cssClass';
    this.yh = yh;
    let style = document.createElement('style');
    let max_Width = (maxWidth == 'auto') ? 'width: auto' : 'width: ' + String(maxWidth) + 'vw';
    style.innerHTML = '.' + this.style + ' { color: ' + clr + '; position: absolute; font-family: "'
      + font + '"; font-size: ' + String(font_size) + 'vw; ' + max_Width + '; left: ' + String(x) +
      'vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; z-index: 1000;}';
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  newLine(text, yplus = true) {
    let cur = this.cur;
    this.list[cur] = document.createElement(this.type);
    document.body.appendChild(this.list[cur]);
    this.list[cur].className = this.style;
    //this.list[cur].style.position = 'absolute';
    //this.list[cur].style.color = this.clr;
    //this.list[cur].id = this.id + String(cur);
    //this.list[cur].style.fontFamily = this.font;
    this.list[cur].innerHTML = text;
    //this.list[cur].style.zIndex = 1000;
    //this.list[cur].style.left = String(this.x) + 'px';
    if (!yplus && this.curline > 0) this.curline--;
    let yh = (this.yh) ? 'vh + ' : 'vw + '
    this.list[cur].style.top = 'calc(' + String(this.y) + yh + String(this.curline * this.step) + 'vw)';
    this.curline++;


    //this.list[cur].style.width = String(this.width) + 'px';
    //this.list[cur].style.textOverflow = "ellipsis";
    //this.list[cur].style.overflow = 'hidden';
    //this.list[cur].style.whiteSpace = 'nowrap';
    this.cur++;
    this.cursize++;
    if (this.cursize > this.size) this.size++;
  }
  addText(text, yplus = true) {
    if (this.cursize > this.cur) {
      this.list[this.cur].innerHTML = text;
      this.cur++;
    }
    else {
      this.newLine(text, yplus);
    }
  }
  addText4(text, x, y, clr) {
    let cur = this.cur;
    this.addTextXY(text, x, y);
    this.list[cur].style.color = clr;
  }
  addTextClr(text, clr) {
    let cur = this.cur;
    this.addText(text);
    this.list[cur].style.color = clr;
  }
  addTextXY(text, x, y) {
    let cur = this.cur;
    this.addText(text, false);
    this.list[cur].style.left = String(x) + 'vw';
    this.list[cur].style.top = String(y) + 'vw';
    //this.list[cur].style.width = String(w) + 'vw';
    //this.list[cur].style.fontSize = String(font_size) + 'vw';
  }
  addTextXYclr(text, x, y, clr) {
    let cur = this.cur;
    this.addText(text, false);
    this.list[cur].style.left = String(x) + 'vw';
    this.list[cur].style.top = String(y) + 'vw';
    this.list[cur].style.color = clr;
  }
  addTextFull(text, x, y, clr, font_size) {
    let cur = this.cur;
    this.addText(text, false);
    this.list[cur].style.left = String(x) + 'vw';
    this.list[cur].style.top = String(y) + 'vw';
    this.list[cur].style.color = clr;
    this.list[cur].style.fontSize = String(font_size) + "vw";
  }
  addTextX(text, x, yplus = false) {
    this.addText(text, yplus);
    this.list[this.cur - 1].style.left = String(x) + 'vw';
  }
  addTextXclr(text, x, clr, yplus = false) {
    this.addText(text, yplus);
    this.list[this.cur - 1].style.left = String(x) + 'vw';
    this.list[this.cur - 1].style.color = clr;
  }
  addTextY(text, y) {
    this.addText(text, false);
    this.list[this.cur - 1].style.top = String(y) + 'vw';
  }
  newSize(size) {
    if (size < this.cursize) {
      for (let i = size; i < this.size; i++) {
        this.list[i].remove();
      }
      this.cursize = size;
    }
    this.cur = 0;
    this.size = size;
  }
}
// html tag collections
let list_ch = new TagCollection("div", "lch", 1.5, 7.8, '#BBF', 'Roboto-Light', 0.84, 1.005, 11);
let info_ch = new TagCollection("div", "ich", 17.5, 5, '#FFF', 'Roboto-Light', 0.8, 1.0, "auto", false);
let list_vd = new TagCollection("div", "lvd", 17.5, 12, '#8FF', 'Roboto-Light', 0.8, 7.0, "auto", false);

// ******************************************************************************************
function GetDataFromServer(d1 = '', d2 = '') {

  let now = Date.now() / 1000;
  if ((now - last_time) > 3600 || (now % 3600 > 300 && now % 3600 <= 600))
    $.ajax({
      type: 'POST',
      url: 'actionUrl',
      async: true,
      cache: true,
      data: {
        find: d2,
        platform: cur_platf,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
      },
      success: function (resp) {
        NewListFromServer(resp.channels);
        last_time = now;
      }
    })
}
// ******************************************************************************************
function NewListFromServer(c) {
  _cc = { ...c };
  win.change = true;
  //console.log(c);
  // new array of data
  channels.length = 0;
  videos.length = 0;
  let z = 0;
  //let e = 0;
  let size2 = c[2].length;
  //let size1 = c[3].length;
  if (c[0][0] != -2) {
    for (let i = 0; i < c[0].length; i++) {
      channels[i] = new Channel(c[0][i]);
      /*while (e < size1 && channels[i].id != c[3][e][5]) e++;
      if (e == size1) {
        e = 0;
        while (e < size1 && channels[i].id != c[3][e][5]) e++;
      }
      let a = 0;
      while (e < size1 && channels[i].id == c[3][e][5]) {
        channels[i].upd[a] = c[3][e][1];
        channels[i].views[a] = c[3][e][2];
        channels[i].subsc[a] = c[3][e][3];
        channels[i].videosh[a] = c[3][e][4];
        a++;
        e++;
      }*/
    }
    for (let i = 0; i < c[1].length; i++) {
      videos[i] = new Video(c[1][i]);
      while (z < size2 && videos[i].id != c[2][z][3]) z++;
      if (z == size2) {
        z = 0;
        while (z < size2 && videos[i].id != c[2][z][3]) z++;
      }
      let a = 0;
      while (z < size2 && videos[i].id == c[2][z][3]) {
        videos[i].upd[a] = c[2][z][1];
        videos[i].views[a] = c[2][z][2];
        //videos[i].likes[a] = c[2][z][3];
        //videos[i].dlikes[a] = c[2][z][4];
        //videos[i].comms[a] = c[2][z][5];
        a++;
        z++;
      }
    }
    let j = 0;
    let size = videos.length;
    for (let i = 0; i < c[0].length; i++) {
      let id = channels[i].id;
      while (j < size && videos[j].channel != id) j++;
      channels[i].from = j;
      while (j < size && videos[j].channel == id) {
        //channels[i].likeCount += videos[j].likeCount;
        //channels[i].dislikeCount += videos[j].dislikeCount;
        //channels[i].viewCount += videos[j].viewCount;
        //channels[i].commentCount += videos[j].commentCount;
        j++;
      }
      channels[i].to = j - 1;
    }
  }
  //console.log(channels);
  //console.log(videos);
  win.change = true;
  chart1.change = true;
  chart2.change = true;
  Checked_list();
  CalcVal();
  reDrawWin();
  reDrawChart1();
  reDrawChart2();
  setTimeout(function () {
    win.change = true;
    chart1.change = true;
    chart2.change = true;
    if (win.change) reDrawWin();
    if (chart1 != undefined && chart1.change) reDrawChart1();
    if (chart2 != undefined && chart2.change) reDrawChart2();
  }, 1000);
}








// ******************************************************************************************
class Slider {
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
      this.IfAddWin(this.addwin);
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
      this.IfAddWin(this.addwin);
    }
    this.wnd.change = true;
  }
  IfAddWin(w) {
    if (w == 0) return;
    if (w == 1) win.change = true;
    if (w == 2) chart1.change = true;
    if (w == 3) chart2.change = true;
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

// ******************************************************************************************
class RadioButton {
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
          this.IfAddWin(this.addwin);
          wnd.change = true;
          if (wnd == win) chart1.change = true;
        }
      }
    }
    else {
      if (dx < _r * 4.1 && dx > -1.6 * _r && dy < _r * 1.6 && dy > -1.6 * _r) {
        if (wnd.mouse.down) {
          this.checked = !this.checked;
          this.IfAddWin(this.addwin);
          if (this.is == "no") {
            Checked_list();
            chart1.change = true;
          }
          wnd.change = true;
        }
      }
    }
  }
  IfAddWin(w) {
    if (w == 0) return;
    if (w == 1) win.change = true;
    if (w == 2) chart1.change = true;
    if (w == 3) chart2.change = true;
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

function Init(n, wnd) {
  if (n == 1) {
    wnd.change = true;
    win = wnd;
    let _x = 1 - right_win + 0.02;
    radio[13] = new RadioButton(wnd, _x, 0.07, 0.004, true, "#66F", "Radar Chart", "#FFF", "switch", "top", 2, false);  // radar chart
    radio[17] = new RadioButton(wnd, _x + 0.15, 0.07, 0.004, true, "#66F", "Anomalies", "#FFF", "switch", "top", 2, false);  // Anomalies
    slider[0] = new Slider(wnd, _x - 0.005, 0.12, right_win - 0.045, 0, 50, 15, 0.006, "#66F", "Last videos", "#FFF", "last_vid", 2, false);
    slider[2] = new Slider(wnd, _x - 0.005, 0.17, right_win - 0.045, 5, 100, 35, 0.006, "#A0F", "CPM", "#FFF", "cpm", 2, false);
    radio[19] = new RadioButton(wnd, _x - 0.045, 0.17, 0.005, false, "#FF0", "", "#FFF", "circle", "", 0, false);
  } else if (n == 2) {
    // chart1
    chart1 = wnd;
    //radio[0] = new RadioButton(wnd, 0.04, 0.96, 0.006, true, "#66F", "Mode", "#FFF", "switch");
    radio[0] = new RadioButton(wnd, 0.04, 0.96, 0.008, true, "#48F", "С.Viewer", "#FFF", "circle", "top");
    radio[1] = new RadioButton(wnd, 0.18, 0.96, 0.008, false, "#FF4", "View/Subs", "#FFF", "circle", "top");
    radio[2] = new RadioButton(wnd, 0.33, 0.96, 0.008, true, "#4F4", "Like/Disl", "#FFF", "circle", "top");
    radio[3] = new RadioButton(wnd, 0.47, 0.96, 0.008, true, "#F99", "Like/View", "#FFF", "circle", "top");
    radio[4] = new RadioButton(wnd, 0.62, 0.96, 0.008, true, "#F22", "Comm/View", "#FFF", "circle", "top");
    radio[5] = new RadioButton(wnd, 0.79, 0.96, 0.008, true, "#4FF", "Score", "#FFF", "square", "top");
    radio[6] = new RadioButton(wnd, 0.90, 0.96, 0.008, true, "#FFF", "Fill", "#FFF", "circle", "top");
    radio[14] = new RadioButton(wnd, 0.02, 0.15, 0.005, true, "#66F", "Lines", "#FF0", "switch", "top", 2);
    radio[15] = new RadioButton(wnd, 0.02, 0.21, 0.005, false, "#66F", "Circle", "#FF0", "switch", "top", 2);
    radio[16] = new RadioButton(wnd, 0.02, 0.27, 0.005, true, "#66F", "Fill", "#FF0", "switch", "top", 2);
    slider[1] = new Slider(wnd, 0.02, 0.1, 0.18, 0, 255, 30, 0.008, "#66F", "transparency", "#FF0", "tr", 2);
  } else if (n == 3) {
    chart2 = wnd;
    radio[7] = new RadioButton(wnd, 0.04, 0.96, 0.008, true, "#48F", "Views", "#FFF", "circle", "down");
    radio[8] = new RadioButton(wnd, 0.16, 0.96, 0.008, true, "#4F4", "Likes", "#FFF", "circle", "down");
    radio[9] = new RadioButton(wnd, 0.28, 0.96, 0.008, true, "#F99", "Dislikes", "#FFF", "circle", "down");
    radio[10] = new RadioButton(wnd, 0.42, 0.96, 0.008, true, "#F22", "Dislikes %", "#FFF", "square", "down");
    radio[11] = new RadioButton(wnd, 0.57, 0.96, 0.008, true, "#4FF", "Comments", "#FFF", "circle", "down");
    radio[12] = new RadioButton(wnd, 0.90, 0.96, 0.008, true, "#FFF", "Fill", "#FFF", "circle", "down");
    radio[18] = new RadioButton(wnd, 0.74, 0.96, 0.008, true, "#FFF", "Time", "#FFF", "square", "down");
  }
}



// ******************************************************************************************
class App {
  constructor(container, clr) {
    // create new Canvas element
    this.layer = new Layer(container, clr);
    //this.layer2 = new Layer(container); 
  }
}
// ******************************************************************************************

class Layer {
  constructor(container, clr) {
    // create new canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.tabindex = 1;
    this.canvas.style.background = clr;

    // get acceess to 2d drawing tools
    this.context = this.canvas.getContext("2d");
    //let wt = this.canvas.width;
    //let ht = this.canvas.height;
    this.scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    //this.canvas.width = Math.floor(wt * scale);
    //this.canvas.height = Math.floor(ht * scale);

    // Normalize coordinate system to use css pixels.
    //this.context.scale(scale, scale);
    this.w = this.canvas.width;
    this.h = this.canvas.height;
    this.win = 1;
    this.change = true;
    this.mouse = { x: 100, y: 100, down: false, move: false };
    this.touch = { x: 100, y: 100, down: false, move: false };
    this.wheel = 0;
    if (container == document.querySelector("#win1")) this.win = 1;
    if (container == document.querySelector("#chart1")) this.win = 2;
    if (container == document.querySelector("#chart2")) this.win = 3;
    Init(this.win, this);

    // put canvas to container
    container.appendChild(this.canvas);

    this.fitToContainer();

    window.addEventListener("resize", () => this.fitToContainer());
    /*window.addEventListener("mousemove", (event) => {
      //if (this.win == 1) [mouseW.x, mouseW.y] = [event.layerX, event.layerY];
      if (kkk) {
        let x = event.clientX;
        addText("11.    Athletic Interest", x, event.clientY, "hello");
      }
    });*/
    // console.log(window.devicePixelRatio);
    window.addEventListener("keydown", (event) => {
      if (event.code == "KeyA" && (event.ctrlKey)) {
        for (let i = 0; i < channels.length; i++) {
          channels[i].check.checked = true;
        }
        this.reDraw(true);
        kkk = !kkk;
      }
      else
        if (event.code == 'KeyX' && (event.ctrlKey)) {
          for (let i = 0; i < channels.length; i++) {
            channels[i].check.checked = false;
          }
          this.reDraw(true);
        }
        else if (event.code == 'KeyP' && (event.shiftKey) && this.win == 1) {
          FormDoc();
        }
    });
    window.addEventListener("mousemove", (event) => {
      if (this.win == 1) [this.mouse.x, this.mouse.y, this.mouse.move] = [event.pageX * this.scale, event.pageY * this.scale, true];
    });
    this.canvas.addEventListener("mousemove", (event) => {
      [this.mouse.x, this.mouse.y, this.mouse.move] = [event.layerX * this.scale, event.layerY * this.scale, true];
      for (let i = 0; i < slider.length; i++)
        if (slider[i].wnd == this) { slider[i].MouseMove(this); reDrawWin(); }
      if (this.win == 3) { chart2.change = true; this.reDraw(); }
      else if (this.win == 2 && !radio[13].checked) { chart1.change = true; this.reDraw(); }
      else if (this.win == 1 && this.mouse.x > (left_win * this.w) && this.mouse.x < (1 - right_win) * this.w) {
        //win.change = true;
        //chart2.change = true;
        reDrawWin();
      }
    });
    window.addEventListener("touchmove", (event) => {
      //event.preventDefault();
      let touches = event.changedTouches;
      if (touches.length > 1) return;
      this.touch.x = touches[0].clientX * this.scale;
      this.touch.y = touches[0].clientY * this.scale;
      if (this.win > 1) this.touch.x -= win.w * this.scale;
      if (this.win > 2) this.touch.y -= chart1.h * this.scale;
      this.touch.move = true;
      for (let i = 0; i < slider.length; i++)
        if (slider[i].wnd == this) { slider[i].TouchMove(this); reDrawWin(); }
    });

    /*this.canvas.addEventListener("wheel", (event) => {
      this.wheel = event.deltaY;
      //this.change = true;
      if (this.win == 1) reDrawWin();
    });*/
    window.addEventListener("wheel", (event) => {
      this.wheel = event.deltaY;
      //this.change = true;
      if (this.win == 1) reDrawWin();
    });
    // window.addEventListener("wheel", event => console.log("win - " + String(event.deltaY)));

    window.addEventListener("touchstart", (event) => {
      let touches = event.changedTouches;
      if (touches.length > 1) return;
      this.touch.x = touches[0].clientX * this.scale;
      this.touch.y = touches[0].clientY * this.scale;
      if (this.win > 1) this.touch.x -= win.w * this.scale;
      if (this.win > 2) this.touch.y -= chart1.h * this.scale;
      this.touch.down = true;
      //console.log("1 - " + touches[0].clientX + "   " + touches[0].clientY);
      //console.log("2 - " + touches[0].pageX + "   " + touches[0].pageY);
      for (let i = 0; i < slider.length; i++)
        if (slider[i].wnd == this) slider[i].TouchStart(this);
    });

    window.addEventListener("mousedown", () => {
      this.mouse.down = true;
      for (let i = 0; i < slider.length; i++)
        if (slider[i].wnd == this) slider[i].MouseDown(this);
      let anom = radio[17].checked;
      for (let i = 0; i < radio.length; i++)
        if (radio[i].wnd == this) radio[i].CheckFocus(this);
      if (anom != radio[17].checked) CalcVal();
      if (this == win && win.mouse.y < 0.04 * win.h && win.mouse.x > 0.41 * win.w) {
        cur_platf = Math.floor((win.mouse.x - 0.41 * win.w) / (0.05 * win.w));
        if (cur_platf > 2) cur_platf = 2;
        win.change = true;
      }
      if (this == win && this.mouse.x < (left_win * win.w)) {
        let last_curCh = curCh;
        if (win.mouse.y > cur_y_top && win.mouse.y < cur_y_bottom) {
          curCh = Math.floor((win.mouse.y - cur_y_top) / step_ch);
          if (win.mouse.x < 10) {
            //console.log(curCh);
            $.ajax({
              type: 'POST',
              url: 'actionUrl',
              async: true,
              cache: true,
              data: {
                channel: channels[curCh].id,
                find: "del_cur",
                platform: cur_platf,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
              },
              success: function (resp) {
                NewListFromServer(resp.channels);
              }
            })
          };
          win.change = true;
        }
        if (last_curCh != curCh) cur_row_video = 0;
        for (let i = 0; i < channels.length; i++)
          channels[i].check.CheckFocus(this);
      }

      this.reDraw();
    });
    window.addEventListener("mouseup", () => {
      this.mouse.down = false;
      for (let i = 0; i < slider.length; i++)
        if (slider[i].wnd == this) slider[i].MouseUp();
    });

    window.addEventListener("touchend", () => {
      this.touch.down = false;
      for (let i = 0; i < slider.length; i++)
        if (slider[i].wnd == this) slider[i].TouchEnd();
    });
  }

  // fit Canvas size to container
  fitToContainer() {
    let wt = this.canvas.offsetWidth;
    let ht = this.canvas.offsetHeight;
    this.scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    this.canvas.width = Math.floor(wt * this.scale);
    this.canvas.height = Math.floor(ht * this.scale);

    // Normalize coordinate system to use css pixels.
    //this.context.scale(scale, scale);
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.change = true;
    this.reDraw();
    this.change = false;
  }

  reDraw(all = false) {
    if (all) {
      win.change = true;
      chart1.change = true;
      chart2.change = true;
    }
    if (win.change) reDrawWin();
    if (chart1 != undefined && chart1.change) reDrawChart1();
    if (chart2 != undefined && chart2.change) reDrawChart2();
  }
}



// ******************************************************************************************
function Checked_list(all = true) {
  if (videos.length < 1) return;
  let size = channels.length;
  let j = 0;
  if (all) {
    cc.length = 0;
    for (let i = 0; i < size; i++) {
      if (channels[i].check.checked) {
        cc[j] = i;
        j++;
      }
    }
  }
  else j = 1;
  rmin = [...range_min];
  rmax = [...range_max];

  for (let i = 0; i < j; i++) {
    for (let u = 0; u < 5; u++) {
      let cur_val = channels[cc[i]].val[u];
      if (cur_val > rmax[u]) rmax[u] = cur_val;
      if (cur_val < rmin[u]) rmin[u] = cur_val;
    }
  }
  // console.log(rmin[0]);
  // console.log(rmax[0]);
  for (let i = 0; i < j; i++) {  // j = cc.length
    let sum0 = 0;
    for (let u = 0; u < 5; u++) {
      channels[cc[i]].valc[u] = (channels[cc[i]].val[u] - rmin[u]) / (rmax[u] - rmin[u]);
      if (range_inv[u]) channels[cc[i]].valc[u] = 1 - channels[cc[i]].valc[u];
      sum0 += channels[cc[i]].valc[u];
    }
    channels[cc[i]].valc[5] = sum0 / 5;
  }
}

// ******************************************************************************************

function CalcVal() {
  if (videos.length < 1) return;
  let size = channels.length;
  for (let i = 0; i < size; i++) {
    let total_v = 0, total_l = 0, total_d = 0, total_c = 0;
    let s = channels[i].to - channels[i].from + 1;
    let total = last_vid;
    if (s < total) total = s;
    if (total < 1) return;
    // anomalies
    let arr = [];
    for (let j = channels[i].to; j > channels[i].to - total; j--) {
      arr.push({ v: videos[j].viewCount, i: j });
    }
    if (arr.length > 2) {
      arr.sort((a, b) => a.v - b.v);

      const quantile = (arr, q) => {
        const pos = (arr.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        if (arr[base + 1].v !== undefined) {
          return arr[base].v + rest * (arr[base + 1].v - arr[base].v);
        } else {
          return arr[base].v;
        }
      };

      const q25 = quantile(arr, .25);
      const median = quantile(arr, .50);
      const q75 = quantile(arr, .75);
      const q87 = quantile(arr, .87);
      const iqr = q75 - q25;
      const outlier_bottom = q25 - 1.5 * iqr;
      const outlier_top = q75 + 1.5 * iqr;
      let first_na = -1;
      let last_na = arr.length;
      for (let i2 = 0; i2 < arr.length; i2++) {
        if (arr[i2].v < outlier_bottom) first_na = i2;
        else if (arr[i2].v > outlier_top) {
          last_na = i2;
          break;
        }
        else videos[arr[i2].i].view_anom = arr[i2].v;
      }
      first_na++;
      for (let i2 = 0; i2 < first_na; i2++) {
        videos[arr[i2].i].view_anom = arr[first_na].v;
      }
      let n_a = 0;
      for (let i2 = last_na; i2 < arr.length; i2++) {
        if (n_a < 2) videos[arr[i2].i].view_anom = Math.round(q75);
        else videos[arr[i2].i].view_anom = Math.round(q87);
        n_a++;
      }
    } else {
      for (let i2 = 0; i2 < arr.length; i2++) {
        videos[arr[i2].i].view_anom = arr[i2].v;
      }
    }
    // end anomalies
    for (let j = channels[i].to; j > channels[i].to - total; j--) {
      if (radio[17].checked) total_v += videos[j].view_anom;
      else total_v += videos[j].viewCount;
      total_l += videos[j].likeCount;
      total_d += videos[j].dislikeCount;
      total_c += videos[j].commentCount;
    }
    channels[i].sumv[0] = total_v;
    channels[i].sumv[1] = total_l;
    channels[i].sumv[2] = total_d;
    channels[i].sumv[3] = total_c;
    let avr = total_v / total;
    let sum = 0;
    for (let j = channels[i].to; j > channels[i].to - total; j--) {
      let dif = 0;
      if (radio[17].checked) dif = avr - videos[j].view_anom;
      else dif = avr - videos[j].viewCount;
      sum += dif * dif;
    }
    channels[i].val[0] = Math.sqrt(sum / total) / avr;
    if (channels[i].subscribers == 0) channels[i].val[1] = 0;
    else channels[i].val[1] = avr / channels[i].subscribers;
    channels[i].val[2] = (total_l - total_d) / (total_l + total_d);
    channels[i].val[3] = (total_l / total) / avr;
    channels[i].val[4] = (total_c / total) / avr;
    Checked_list();
    //console.log(channels[i].val[0]);
  }
}

// ******************************************************************************************
function Grad(p, a, Col) {
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
// ******************************************************************************************
function DrawGraf() {
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
    /*chart1.context.globalAlpha = 1.0;
    chart1.context.lineWidth = 1;
    chart1.context.strokeStyle = "#FFF";
    chart1.context.beginPath();
    chart1.context.moveTo(_x, 0);
    chart1.context.lineTo(_x, chart1.h - _y);
    chart1.context.lineTo(chart1.w, chart1.h - _y);
    chart1.context.stroke();*/
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
function RadarChart(ctx, checked_arr, Col, tr = 128, text_color = '#FFF', k_font = 1.8) {
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
  //let clrc = radio[16].checked ? "#8080FF18" : "#88F";
  //let _x = 0.5 * w;
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
      // console.log(channels[checked_arr[i]].valc[j]);
      // console.log(channels[checked_arr[i]].val[j]);
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

function DrawGraf2() {
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

  /*chart2.context.globalAlpha = 1.0;
  chart2.context.lineWidth = 1;
  chart2.context.strokeStyle = "#FFF";
  chart2.context.beginPath();
  chart2.context.moveTo(_x, 0);
  chart2.context.lineTo(_x, chart2.h - _y);
  chart2.context.lineTo(chart2.w, chart2.h - _y);
  chart2.context.stroke();*/
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



function Info() {
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
function InfoChannels(ctx, W, H, x, y, w, h, lineW, clr_fill, clr_line) {
  //ctx.shadowBlur = 20;
  //ctx.shadowColor = 'black';
  //ctx.strokeStyle = clr_line;
  //ctx.lineWidth = lineW;
  // roundRect(ctx, x * W, y * H, w * W, h * H, 15, true);
  // win.context.fillRect(0.05 * ww, 0.05 * hh, 0.15 * ww, 0.3 * hh);
  //let list_ch = new TextCollection("div", "lch", 1.5, 7.8, '#FFC', 'Roboto-Light', 0.84, 1.005, 11);

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
        //win.context.fillStyle = "#F88";
        //win.context.font = String(1.2*fs) + "px Roboto-Light";
        //ctx.fillText("🗑", 2, Y);
        //ctx.lineWidth = 2;
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
        //ctx.font = String(fs) + "px Roboto-Light";
        //ctx.fillStyle = "#FFF";
        //ctx.fillStyle = Grad(i / size, 1);
        //ctx.fillText(String(i + 1) + ".", X, Y);
        //list_ch.addText2(channels[i].title, (X + nw) / 19.5, (Y - step * 0.77) / 19.5, "#F0F");
        if (i < 9) list_ch.addText(String(i + 1) + ".&ensp;&ensp;" + channels[i].title);
        else list_ch.addText(String(i + 1) + ".&ensp;" + channels[i].title);
        //ctx.fillText(channels[i].title, X + nw, Y, _W * 0.55);
        //ctx.font = String(fs) + "px Roboto-Light";
        //ctx.fillStyle = "#FFF";
        //X += nw + _W * 0.58;
        //ctx.fillText(channels[i].videos, X, Y);
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


function InfoVideo(wnd, x_pos, y_pos, clrb, cur_v, clr) {
  let _w = (0.24 * wnd.w) | 0;
  let _h = (0.13 * wnd.w) | 0;
  if (wnd.w - x_pos < _w) x_pos -= _w;
  if (wnd.h - y_pos < _h) y_pos -= _h;
  //wnd.context.fillStyle = clrb + "8";
  //wnd.context.strokeStyle = clrb;
  //wnd.context.lineWidth = 2;
  //roundRect(wnd.context, x_pos, y_pos, _w, _h, _w * 0.1, true); 
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





// ******************************************************************************************
function ShowListVideos(left, top) {
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
  //ctx.fillStyle = '#101070';
  //ctx.fillRect(0.36 * W, 0, 0.6 * W, 0.04 * H);
  //ctx.fillStyle = clr1;
  //ctx.fillRect((0.40 + cur_platf * 0.07) * W, 0, 0.07 * W, 0.04 * H);
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

  /*ctx.font = String(0.014 * W * 1.3) + "px Roboto-Light";
  ctx.fillStyle = "#FF0F";
  let curX = (left_win + 0.03) * W;
  let curY = 0.075 * W;
  ctx.fillText('Channel:  "' + channels[curCh].title + '"', curX, curY, W * (1 - left_win - right_win - 0.1));
  ctx.font = String(0.014 * W) + "px Roboto-Light";
  ctx.fillStyle = "#FFF";
  curX -= 0.01 * W;
  curY += 1.6 * fs;*/


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

  /*
    ctx.fillText("Total views: ", curX, curY);
    ctx.fillText("Subscribers: ", curX, curY + 1.2 * fs);
    ctx.fillText("Total Videos: ", curX, curY + 2.4 * fs);
    ctx.fillText("Published at: ", curX, curY + 3.6 * fs);
    curX += 0.09 * W;
    ctx.fillStyle = '#0FD';
    ctx.fillText(channels[curCh].total_views.toString(), curX, curY);
    ctx.fillText(channels[curCh].subscribers.toString(), curX, curY + 1.2 * fs);
    ctx.fillText(channels[curCh].videos.toString(), curX, curY + 2.4 * fs);
    ctx.fillText(channels[curCh].published_at.toLocaleDateString(), curX, curY + 3.6 * fs);
    ctx.font = String(0.023 * W) + "px Roboto-Light";
    ctx.fillStyle = '#FF0';
    ctx.fillText(String(Math.round((channels[curCh].sumv[0]) * slider[2].val / 1000)) + " $", curX - 4 * fs, curY + 5.6 * fs);
    ctx.font = String(0.014 * W) + "px Roboto-Light";
    curX = (left_win + 0.22) * W;
    ctx.fillStyle = '#0F0';
    ctx.fillText("INFO FOR " + last_vid.toString() + " LAST VIDEOS", curX, curY);
    curY += 1.2 * fs;
    ctx.fillStyle = '#FFF';
    ctx.fillText("Views: ", curX, curY);
    ctx.fillText("Likes: ", curX, curY + 1.2 * fs);
    ctx.fillText("Dislikes: ", curX, curY + 2.4 * fs);
    ctx.fillText("Comments: ", curX, curY + 3.6 * fs);
    ctx.fillText("Score: ", curX, curY + 4.8 * fs);
    curX += 0.09 * W;
    ctx.fillStyle = '#FA3';
    ctx.fillText(channels[curCh].sumv[0].toString(), curX, curY);
    ctx.fillText(channels[curCh].sumv[1].toString(), curX, curY + 1.2 * fs);
    ctx.fillText(channels[curCh].sumv[2].toString(), curX, curY + 2.4 * fs);
    ctx.fillText(channels[curCh].sumv[3].toString(), curX, curY + 3.6 * fs);
    ctx.fillText(Math.round(100 * channels[curCh].valc[5]).toString() + "%", curX, curY + 4.8 * fs);*/
  radio[19].Draw();

  let X = (left_win + 0.02) * W;
  let Y = 0.05 * W;

  //smallChart(win, (left_win + 0.01) * W, 0.01 * W, (1 - left_win - right_win - 0.02) * W, 0.18 * H, channels[curCh]);
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
function smallChart(wnd, x, y, w, h, elem) {
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
  /*let min_l = Math.min(...elem.likes);
  let deltaYl = h / (Math.max(...elem.likes) - min_l);
  let min_d = Math.min(...elem.dlikes);
  let deltaYd = h / (Math.max(...elem.dlikes) - min_d);
  let min_c = Math.min(...elem.comms);
  let deltaYc = h/(Math.max(...videelements[indx].comms) - min_c);*/
  for (let i = 0; i < size; i++) {
    X[i] = x + (elem.upd[i] - elem.upd[0]) / deltaX;
    Yv[i] = y + h - (elem.views[i] - min_v) / deltaYv;
    if (radio[19].checked) createCircle(ctx, X[i], Yv[i], 2, true, "#FF06");
    /*Yl[i] = y + h - (elem.likes[i] - min_l) * deltaYl;
    //createCircle(ctx, X[i], Yl[i], 1, true, "#0F0");
    Yd[i] = y + h - (elem.dlikes[i] - min_d) * deltaYl;
    //createCircle(ctx, X[i], Yd[i], 1, true, "#F00");
    Yc[i] = y + h - (elem.comms[i] - min_c) * deltaYc;
    //createCircle(ctx, X[i], Yc[i], 1, true, "#F0F"); */
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
    /*ctx.fillStyle = '#FF0';
    ctx.font = String(1.4 * fs) + "px Roboto-Light";
    ctx.fillText('Views', X[0] + 0.05 * w, y + 0.2 * h);*/
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
  //DrawCurve(wnd, X, Yv, 0, y, 0, y + h, "#8FF6", "#AFF2", true, false, 1.414, 2, false);
  //DrawCurve(wnd, X, Yl, 0, y, 0, y + h, "#0F08", "#AFA2", false, false, 1.414, 2, false);
  //DrawCurve(wnd, X, Yd, 0, y, 0, y + h, "#F008", "#FAA2", false, false, 1.414, 2, false);
  //DrawCurve(wnd, X, Yc, 0, y, 0, y + h, "#FF08", "#FAF2", false, false, 1.414, 2, false);

}
// ******************************************************************************************
function reDrawWin() {
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
function reDrawChart1() {
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
function reDrawChart2() {
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
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
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
function createCircle(ctx, x, y, r, fill, color) {
  ctx.fillStyle = ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  fill ? ctx.fill() : ctx.stroke();
}
// ******************************************************************************************
function DrawCurve(wnd, x, y, x0, y0, x1, y1, _clr1, _clr2, fill, circl, line_width, r_circl = 5, fill_circ = false, draw_mouse_point = false) {
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
function DrawPolyLine(wnd, x, y, x0, y0, x1, y1, _clr1, _clr2, fill, circl, line_width, r_circl = 5, fill_circ = false, draw_mouse_point = true) {
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
function _getQBezierValue(t, p1, p2, p3) {
  var iT = 1 - t;
  return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
  return {
    x: _getQBezierValue(position, startX, cpX, endX),
    y: _getQBezierValue(position, startY, cpY, endY),
  };
}

// ******************************************************************************************
function FormDoc() {
  cnvs = document.createElement("canvas");
  cnvs.width = 3000;
  cnvs.height = 2500;
  ctx = cnvs.getContext("2d");

  let Col = [[100, 100, 255], [100, 100, 255]];
  cc.length = 1;
  cc[0] = curCh;
  Checked_list(false);
  RadarChart(ctx, cc, Col, 120, '#000', 3);
  Checked_list();

  let doc = new jsPDF('p', 'mm', 'a4', true);

  cnvs2 = document.createElement("canvas");
  cnvs2.width = img_logo.width;
  cnvs2.height = img_logo.height;
  ctx2 = cnvs2.getContext("2d");
  ctx2.drawImage(img_logo, 0, 0);

  var imgData = cnvs.toDataURL('image/gif');
  var imgData2 = cnvs2.toDataURL('image/gif');
  doc.addImage(imgData2, 'PNG', 162, 5, 38, 30, '', 'FAST');
  doc.setDrawColor('0.3', '0.3', '1.0');
  doc.setFillColor('0.9', '0.9', '1.0');
  doc.roundedRect(10, 40, 190, 247, 3, 3, 'DF');
  doc.setFillColor('1.0', '1.0', '1.0');
  doc.roundedRect(10, 100, 190, 160, 3, 3, 'DF');
  doc.roundedRect(115, 60, 85, 20, 3, 3, 'DF');
  doc.setLineWidth(0.3);
  doc.line(136, 60, 136, 80);
  doc.line(157, 60, 157, 80);
  doc.line(178, 60, 178, 80);
  doc.line(115, 67, 200, 67);
  doc.setTextColor('#1010A0');
  doc.setFontSize(8);
  doc.text("Order-Nr.           Client-Nr.           Pitch-Nr.           Pitch-Dat. ", 118, 65);
  //doc.text("Item                                        Description                                                                        Price            Currency        Nettoprice              Totalprice", 13, 106);
  doc.text("TOTAL PRICE:", 150, 265);
  doc.setFontSize(12);
  doc.text("DREAMWELL INC.", 10, 10);
  doc.setFontSize(15);
  doc.text("PITCH", 115, 55);
  doc.triangle(132, 269, 132, 283, 138, 276, "F");
  let total_vid = (last_vid < 26) ? last_vid : 25;
  doc.setTextColor('#000000');
  doc.setFontSize(12);
  doc.text(channels[curCh].title, 30, 60);
  doc.setFontSize(9);
  let sum = 0;
  doc.addImage(imgData, 'PNG', 10, 110, cnvs.width / 24, cnvs.height / 24, '', 'FAST');
  let dd = new Date().toLocaleDateString();
  doc.text(dd, 182, 74);
  doc.setFontSize(12);
  doc.setTextColor('#AA0000');
  doc.text((Math.round(100 * sum) / 100).toString() + " $", 151, 277);
  doc.save("Pitch.pdf");
}

// ******************************************************************************************
function FormDoc2() {
  let doc = new jsPDF();
  var imgData = chart1.canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', 162, 5, 38, 30);
  //doc.addImage(img_logo, 'PNG', 162, 5, 38, 30);
  doc.setDrawColor('0.3', '0.3', '1.0');
  doc.setFillColor('0.9', '0.9', '1.0');
  doc.roundedRect(10, 40, 190, 247, 3, 3, 'DF');
  doc.setFillColor('1.0', '1.0', '1.0');
  doc.roundedRect(10, 100, 190, 160, 3, 3, 'DF');
  doc.roundedRect(115, 60, 85, 20, 3, 3, 'DF');
  doc.setLineWidth(0.3);
  doc.line(136, 60, 136, 80);
  doc.line(157, 60, 157, 80);
  doc.line(178, 60, 178, 80);
  doc.line(115, 67, 200, 67);
  doc.line(10, 110, 200, 110);
  doc.line(25, 105, 25, 260);
  doc.line(115, 105, 115, 260);
  doc.line(132, 105, 132, 260);
  doc.line(151, 105, 151, 260);
  doc.line(172, 105, 172, 260);
  doc.setTextColor('#1010A0');
  doc.setFontSize(8);
  doc.text("Order-Nr.           Client-Nr.           Invoice-Nr.           Invoice-Dat. ", 118, 65);
  doc.text("Item                                        Description                                                                        Price            Currency        Nettoprice              Totalprice", 13, 106);
  doc.text("TOTAL INVOICE PRICE:", 150, 265);
  doc.setFontSize(12);
  doc.text("DREAMWELL INC.", 10, 10);
  doc.setFontSize(15);
  doc.text("INVOICE", 115, 55);
  doc.triangle(132, 269, 132, 283, 138, 276, "F");
  let total_vid = (last_vid < 26) ? last_vid : 25;
  doc.setTextColor('#000000');
  doc.setFontSize(12);
  doc.text(channels[curCh].title, 30, 60);
  doc.setFontSize(9);
  let sum = 0;
  for (let i = 0; i < total_vid; i++) {
    doc.text((i + 1).toString(), 13, 115 + i * 5);
    doc.text(videos[si + i].title.slice(0, 44), 27, 115 + i * 5);
    doc.text("USD", 136, 115 + i * 5);
    let s = Math.round(100 * videos[si + i].viewCount * slider[2].val / 1000) / 100;
    sum += s;
    doc.text(s.toString() + " $", 177, 115 + i * 5);
  }
  let dd = new Date().toLocaleDateString();
  doc.text(dd, 182, 74);
  doc.setFontSize(12);
  doc.setTextColor('#AA0000');
  doc.text((Math.round(100 * sum) / 100).toString() + " $", 151, 277);
  doc.save("invoice.pdf");
}


// ******************************************************************************************
onload = () => {
  new App(document.querySelector("#win1"), clr1);
  new App(document.querySelector("#chart1"), clr2);
  new App(document.querySelector("#chart2"), clr3);
  document
    .getElementById("form1")
    .addEventListener("submit", NewListFromServer(JSON.parse(document.getElementById("channels").textContent)), false);
};


