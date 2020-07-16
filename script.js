let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let img = new Image();
img.src = "pic.jpg";
let x = [];
let w;
let h;
let imageData;
img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    imageData = context.getImageData(0, 0, img.width, img.height);
    x = imageData.data;
    let p = 0;
    w = img.width * 4;
    h = img.height;
};

function f() {
    context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    imageData = context.getImageData(0, 0, img.width, img.height);
    x = imageData.data;
    let p = 0;
    w = img.width * 4;
    h = img.height;
}
let rd = 0;
let green = 0;
let blue = 0;

function NearlyBlack(pos) {
    if (x[pos] < rd && x[pos + 1] < green && x[pos + 2] < blue) return true;
    return false;
}

function NearlyWhite(pos) {
    return !NearlyBlack(pos);
}

function MakeBlack(pos) {
    x[pos] = 0;
    x[pos + 1] = 0;
    x[pos + 2] = 0;
}

function MakeWhite(pos) {
    x[pos] = 255;
    x[pos + 1] = 255;
    x[pos + 2] = 255;
}
let white = 0,
    black = 0;

function filter() {
    f();
    rd = parseInt(document.getElementById("size1").value);
    green = parseInt(document.getElementById("size2").value);
    blue = parseInt(document.getElementById("size3").value);
    for (let t = 0; t < parseInt(x.length); t += 4) {
        if (NearlyBlack(t) || ((NearlyBlack(t - w) + NearlyBlack(t + w) + NearlyBlack(t + 4) + NearlyBlack(t - 4)) >= 3)) {
            MakeBlack(t);
            black++;
        } else {
            MakeWhite(t);
            white++;
        }
    }
    context.putImageData(imageData, 0, 0);
};

function func() {
    white = 0, black = 0;
    filter();
    let direction = 0;
    let cont = [];
    let j = 0,
        jj = 0;
    let starts = [];
    let istrt = 0;
    for (let t = w; t < w * h - w; t += 4) {
        let amountBlack = NearlyBlack(t - w - 4) + NearlyBlack(t - w + 4) + NearlyBlack(t + w - 4) + NearlyBlack(t + w + 4) +
            NearlyBlack(t - w) + NearlyBlack(t + w) + NearlyBlack(t + 4) + NearlyBlack(t - 4);
        let amountWhite = NearlyWhite(t - w - 4) + NearlyWhite(t - w + 4) + NearlyWhite(t + w - 4) + NearlyWhite(t + w + 4) +
            NearlyWhite(t - w) + NearlyWhite(t + w) + NearlyWhite(t + 4) + NearlyWhite(t - 4);

        function CheckRed(t) {
            return (x[t] == 255 && x[t + 1] == 0 && x[t + 2] == 0);
        }

        function NotRed(t) {
            return !CheckRed(t) && !CheckRed(t + 4) && !CheckRed(t + 4 + w) && !CheckRed(t + w) && !CheckRed(t + w - 4) &&
                !CheckRed(t - 4) && !CheckRed(t - 4 - w) && !CheckRed(t - w) && !CheckRed(t - w + 4);
        }
        if (NotRed(t - w - 4) && NotRed(t + 4 - w) && NotRed(t + 4 + w) && NotRed(t + w - 4) &&
            (amountWhite >= 2) && (amountWhite <= 6) && (amountBlack >= 2) && (amountBlack <= 6)) {
            //алгоритм жука
            let p = t;
            starts[istrt] = p;
            istrt++;
            let finish = p;
            do {
                if (x[p] > 100) { //попали на черную
                    cont[j] = p;
                    j++
                    direction = (direction + 4 - 1) % 4; // 0 - восток
                    if (direction == 0) p += 4; // 1 - юг   
                    else if (direction == 1) p += w; // 2 - запад
                    else if (direction == 2) p -= 4; // 3 - север
                    else if (direction == 3) p -= w;
                } else { // попали на белую        
                    direction = (direction + 4 + 1) % 4;
                    if (direction == 0) p += 4;
                    else if (direction == 1) p += w;
                    else if (direction == 2) p -= 4;
                    else if (direction == 3) p -= w;
                }
            } while (p != finish);
            for (jj; jj < cont.length; jj++) {
                if ((cont[jj] + 4) % (w) == 0) cont[jj] -= 4;
                x[cont[jj]] = 255;
                x[cont[jj] + 1] = 0;
                x[cont[jj] + 2] = 0;
            }
        }
    } //------------------------------
    context.drawImage(img, 0, 0);
    imageData = context.getImageData(0, 0, img.width, img.height);
    x = imageData.data;
    //рисование контура 
    let sx = [],
        sy = [];
    let index = -1;
    for (let j = 0; j < cont.length; j++) {
        sx[++index] = (cont[j] % w);
        sy[index] = Math.floor(cont[j] / w);
        x[cont[j]] = 255;
        x[cont[j] + 1] = 0;
        x[cont[j] + 2] = 0;
    }

    let delta = 10

    function len(x1, y1, x2, y2) {
        return parseInt(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
    }

    console.log("FINISH!");
    context.putImageData(imageData, 0, 0);
    //--------------------------------------------------------------
    let canvas2 = document.getElementById("canvas2");
    let ctx2 = canvas2.getContext("2d");
    canvas2.width = img.width;
    canvas2.height = img.height;
    ctx2.beginPath();
    ctx2.moveTo(sx[0] / 4, sy[0]);
    let step = 5
    let ii = 1;

    function draw() {
        if (ii >= sx.length) {
            console.log("FINISH2!");
            clearInterval(timerId);
        }
        let x1 = sx[ii] / 4,
            y1 = sy[ii],
            x2 = sx[ii + step] / 4,
            y2 = sy[ii + step];
        if (len(x1, y1, x2, y2) < parseInt(delta)) {
            ctx2.strokeStyle = '#000000';
            ctx2.lineTo(sx[ii] / 4, sy[ii]);
            ctx2.stroke();
        } else {
            ctx2.moveTo(sx[ii + step] / 4, sy[ii + step]);
        }
        ii += step;
    }
    let timerId = setInterval(draw, 1);


    //--------------------------------------------------------------
};