import { win } from "./app.js";
import RadioButton from './RadioButton.js';

export default class GetDataFromServer {
    constructor(f) {
        this.last_time = Date.now() / 1000;
        this.timer = setInterval(this.GetData, 5 * 60 * 1000);
        this.arr = new Object();
        this.channels = [];
        this.videos = [];
        this.cc = []; // checked channels array
        this.range_min = [0, 0, 0.85, 0, 0];
        this.range_max = [0.5, 1, 1, 0.15, 0.025];
        this.rmin = [];
        this.rmax = [];
        this.last_vid = 15;
        this.anom = true;
        this.range_inv = [true, false, false, false, false];
        this.f = f;
        $(document).on('submit', '#form1', function (e) {
            e.preventDefault();
            let d1 = $('#mytextbox').val();
            //let d2 = $('#mytextbox2').val();
            let d2 = "";
            document.getElementById("mytextbox").value = '';
            //document.getElementById("mytextbox2").value = '';
            this.Ajax(d1, d2);
        });
        this.GetData(false);
    }
    // ******************************************************************************************
    GetData(timer = true, d1 = '', d2 = '') {
        let now = Date.now() / 1000;
        if (!timer || ((now - this.last_time) > 3600 || (now % 3600 > 300 && now % 3600 <= 600)))
            this.Ajax(d1, d2);
    }
    // ******************************************************************************************
    NewListFromServer(c) {
        this.arr = { ...c };  //????
        // new array of data
        this.channels.length = 0;
        this.videos.length = 0;
        let z = 0;
        let size2 = c[2].length;
        if (c[0][0] != -2) {
            for (let i = 0; i < c[0].length; i++) {
                this.channels[i] = new Channel(c[0][i]);

            }
            for (let i = 0; i < c[1].length; i++) {
                this.videos[i] = new Video(c[1][i]);
                while (z < size2 && this.videos[i].id != c[2][z][3]) z++;
                if (z == size2) {
                    z = 0;
                    while (z < size2 && this.videos[i].id != c[2][z][3]) z++;
                }
                let a = 0;
                while (z < size2 && this.videos[i].id == c[2][z][3]) {
                    this.videos[i].upd[a] = c[2][z][1];
                    this.videos[i].views[a] = c[2][z][2];
                    a++;
                    z++;
                }
            }
            let j = 0;
            let size = this.videos.length;
            for (let i = 0; i < c[0].length; i++) {
                let id = this.channels[i].id;
                while (j < size && this.videos[j].channel != id) j++;
                this.channels[i].from = j;
                while (j < size && this.videos[j].channel == id) {
                    j++;
                }
                this.channels[i].to = j - 1;
            }
        }
        this.Checked_list();
        this.CalcVal();
        this.f();
        setTimeout(this.f(), 1000);
    }
    // ******************************************************************************************
    Ajax(d1, d2) {
        $.ajax({
            type: 'POST',
            url: 'actionUrl',
            async: true,
            cache: true,
            data: {
                channel: d1,
                find: d2,
                platform: 0,//cur_platf,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: (resp) => {
                this.NewListFromServer(resp.channels);
                this.last_time = Date.now() / 1000;
            }
        })
    }
    // ******************************************************************************************
    Checked_list(all = true) {
        if (this.videos.length < 1) return;
        let size = this.channels.length;
        let j = 0;
        if (all) {
            this.cc.length = 0;
            for (let i = 0; i < size; i++) {
                if (this.channels[i].check.checked) {
                    this.cc[j] = i;
                    j++;
                }
            }
        }
        else j = 1;
        this.rmin = [...this.range_min];
        this.rmax = [...this.range_max];

        for (let i = 0; i < j; i++) {
            for (let u = 0; u < 5; u++) {
                let cur_val = this.channels[this.cc[i]].val[u];
                if (cur_val > this.rmax[u]) this.rmax[u] = cur_val;
                if (cur_val < this.rmin[u]) this.rmin[u] = cur_val;
            }
        }
        // console.log(this.rmin[0]);
        // console.log(this.rmax[0]);
        for (let i = 0; i < j; i++) {  // j = this.cc.length
            let sum0 = 0;
            for (let u = 0; u < 5; u++) {
                this.channels[this.cc[i]].valc[u] = (this.channels[this.cc[i]].val[u] - this.rmin[u]) / (this.rmax[u] - this.rmin[u]);
                if (this.range_inv[u]) this.channels[this.cc[i]].valc[u] = 1 - this.channels[this.cc[i]].valc[u];
                sum0 += this.channels[this.cc[i]].valc[u];
            }
            this.channels[this.cc[i]].valc[5] = sum0 / 5;
        }
    }

    // ******************************************************************************************

    CalcVal() {
        if (this.videos.length < 1) return;
        let size = this.channels.length;
        for (let i = 0; i < size; i++) {
            let total_v = 0, total_l = 0, total_d = 0, total_c = 0;
            let s = this.channels[i].to - this.channels[i].from + 1;
            let total = this.last_vid;
            if (s < total) total = s;
            if (total < 1) return;
            // anomalies
            let arr = [];
            for (let j = this.channels[i].to; j > this.channels[i].to - total; j--) {
                arr.push({ v: this.videos[j].viewCount, i: j });
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
                    else this.videos[arr[i2].i].view_anom = arr[i2].v;
                }
                first_na++;
                for (let i2 = 0; i2 < first_na; i2++) {
                    this.videos[arr[i2].i].view_anom = arr[first_na].v;
                }
                let n_a = 0;
                for (let i2 = last_na; i2 < arr.length; i2++) {
                    if (n_a < 2) this.videos[arr[i2].i].view_anom = Math.round(q75);
                    else this.videos[arr[i2].i].view_anom = Math.round(q87);
                    n_a++;
                }
            } else {
                for (let i2 = 0; i2 < arr.length; i2++) {
                    this.videos[arr[i2].i].view_anom = arr[i2].v;
                }
            }
            // end anomalies
            for (let j = this.channels[i].to; j > this.channels[i].to - total; j--) {
                if (this.anom) total_v += this.videos[j].view_anom;
                else total_v += this.videos[j].viewCount;
                total_l += this.videos[j].likeCount;
                total_d += this.videos[j].dislikeCount;
                total_c += this.videos[j].commentCount;
            }
            this.channels[i].sumv[0] = total_v;
            this.channels[i].sumv[1] = total_l;
            this.channels[i].sumv[2] = total_d;
            this.channels[i].sumv[3] = total_c;
            let avr = total_v / total;
            let sum = 0;
            for (let j = this.channels[i].to; j > this.channels[i].to - total; j--) {
                let dif = 0;
                if (this.anom) dif = avr - this.videos[j].view_anom;
                else dif = avr - this.videos[j].viewCount;
                sum += dif * dif;
            }
            this.channels[i].val[0] = Math.sqrt(sum / total) / avr;
            if (this.channels[i].subscribers == 0) this.channels[i].val[1] = 0;
            else this.channels[i].val[1] = avr / this.channels[i].subscribers;
            this.channels[i].val[2] = (total_l - total_d) / (total_l + total_d);
            this.channels[i].val[3] = (total_l / total) / avr;
            this.channels[i].val[4] = (total_c / total) / avr;
            this.Checked_list();
            //console.log(this.channels[i].val[0]);
        }
    }
}
// ******************************************************************************************
export class Channel {
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