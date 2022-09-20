import { win } from "./app.js";
import RadioButton from './RadioButton.js';

export default class Channel {
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
export class Video {
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