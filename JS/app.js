import TagCollection from "./TagColl.js";
import Layer from "./DWLib/main.js";
import SvgImage, { svg } from "./DWLib/svg.js";
import { TextLine } from "./DWLib/SvgText.js";

let clr = {background: "#131722", wnd: "#1E222D"};
let logo = [];
let data = new Object();
let txt = [];
let txt1, txt2, txt3, txt4 ;
export let win;

let img_logo = new Image();
img_logo.src = "/IMG/logo.png";

// html text collections
//let list_ch = new TagCollection("div", "lch", 1.5, 3.8, "#BBF", "Roboto-Light", 1.0, 1.005, 11, true, "em");

// ******************************************************************************************
function reDrawWin() {
  /*if (data.videos == undefined || data.videos.length < 1) return;
  //win.context.clearRect(0, 0, win.w, win.h);
  //InfoChannels(win.w, win.h, 0.0, 0.06, 0.44);
  win.mouse.move = false;
  win.wheel = 0;

  txt2.newText("Width = " + win.w); 
  txt3.newText("Height = " + win.h); 
  txt4.newText("Scale = " + win.scale);*/
}
function Slw(el,i) {
  //console.log(el);
  let val = el.slider[i].val;
  el.checkBox[i].newX(val);
  txt[el.i].size = Math.sqrt(val*5);
  logo[el.i].svg.setAttributeNS(null, "width", val + "%");
  logo[el.i].svg.setAttributeNS(null, "height", val + "%");
  //this.svg.setAttributeNS(null, "height", size + "%");
  txt[el.i].draw();
}

// ******************************************************************************************
onload = () => {
  //GetDataFromServer();
  win = new Layer(reDrawWin);

  win.addWin({xi_left: 0, xi_right: 3, yi_top: 0, yi_bottom: 1, border: 0.0, r: null, clr_background: "#1E222D"});
  win.addWin({xi_left: 0, xi_right: 1, yi_top: 1, yi_bottom: 2, border: 0.3, r: 10, clr_background: "#1E222D"});
  win.addWin({xi_left: 1, xi_right: 3, yi_top: 1, yi_bottom: 2, border: 0.3, r: 10, clr_background: "#1E222D"});
  win.addWin({xi_left: 0, xi_right: 1, yi_top: 2, yi_bottom: 3, border: 0.3, r: 10, clr_background: "#1E222D"});
  win.addWin({xi_left: 1, xi_right: 2, yi_top: 2, yi_bottom: 3, border: 0.3, r: 10, clr_background: "#1E222D"});
  win.addWin({xi_left: 2, xi_right: 3, yi_top: 2, yi_bottom: 3, border: 0.3, r: 10, clr_background: "#1E222D"});
  

  //win.svg.removeChild(win.wins[1].win.svg);
  txt1 = new TextLine(win.svg, 50, 2, "Hello World!", 2); 
  txt2 = new TextLine(win.svg, 70, 2, "Width = " + win.w, 3); 
  txt3 = new TextLine(win.svg, 70, 7, "Height = " + win.h, 3); 
  txt4 = new TextLine(win.svg, 70, 12, "Scale = " + win.scale, 3);
  for (let i = 0; i < win.n_win; i++) {
    if (i == win.n_win-1) logo[i] = new SvgImage(win.wins[i].svg, "youtube_logo", svg.youtube_logo, i, 0, 0, 100);
    else logo[i] = new SvgImage(win.wins[i].svg, "youtube_logo1", svg.youtube_logo1, i, 0, 0, 50);
    win.wins[i].newSlider(30, 60, 60, 1.5, 0, 300, 2, 5, Slw);
    win.wins[i].newSwitch(5, 20, 2, 2.8, Math.random() < 0.5); 
    win.wins[i].newSwitch(4.5, 33, 2, 4.4, Math.random() < 0.5);
    win.wins[i].newCheckBox(5, 70, 5, Math.random() < 0.5, null, "Dislikes");
    txt[i] = new TextLine(win.wins[i].svg, 50, 10, "Hello World!", 5);
  }
};
