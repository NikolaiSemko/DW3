export default function FormDoc() {
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
export function FormDoc2() {
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