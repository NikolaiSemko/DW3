export default class TagCollection {
  constructor(type, id, x = 0, y = 0, clr = "#FFF", font = "Roboto-Light", font_size = 2, step = 2.2, maxWidth = "auto", yh = true, vw = 'vw') {
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
    this.vw = vw;
    this.yh = (vw == 'vw') ? ((yh) ? 'vh' : 'vw') : vw;
    let style = document.createElement('style');
    let max_Width = (maxWidth == 'auto') ? 'width: auto' : 'width: ' + String(maxWidth) + this.vw;
    style.innerHTML = '.' + this.style + ' { color: ' + clr + '; position: absolute; font-family: "'
      + font + '"; font-size: ' + String(font_size) + this.vw + '; ' + max_Width + '; left: ' + String(x) +
      this.vw + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; z-index: 2000;}';
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
    this.list[cur].style.top = 'calc(' + String(this.y) + this.yh + " + " + String(this.curline * this.step) + this.vw + ')';
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
  addTextClr(text, clr) {
    let cur = this.cur;
    this.addText(text);
    this.list[cur].style.color = clr;
  }
  addTextXY(text, x, y) {
    let cur = this.cur;
    this.addText(text, false);
    this.list[cur].style.left = String(x) + this.vw;
    this.list[cur].style.top = String(y) + this.yh;
    //this.list[cur].style.width = String(w) + this.vw;
    //this.list[cur].style.fontSize = String(font_size) + this.vw;
  }
  addTextXYclr(text, x, y, clr) {
    let cur = this.cur;
    this.addTextXY(text, false);
    this.list[cur].style.color = clr;
  }
  addTextFull(text, x, y, clr, font_size) {
    let cur = this.cur;
    this.addText(text, false);
    this.list[cur].style.left = String(x) + this.vw;
    this.list[cur].style.top = String(y) + this.yh;
    this.list[cur].style.color = clr;
    this.list[cur].style.fontSize = String(font_size) + this.vw;
  }
  addTextX(text, x, yplus = false) {
    this.addText(text, yplus);
    this.list[this.cur - 1].style.left = String(x) + this.vw;
  }
  addTextXclr(text, x, clr, yplus = false) {
    this.addText(text, yplus);
    this.list[this.cur - 1].style.left = String(x) + this.vw;
    this.list[this.cur - 1].style.color = clr;
  }
  addTextY(text, y) {
    this.addText(text, false);
    this.list[this.cur - 1].style.top = String(y) + this.yh;
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