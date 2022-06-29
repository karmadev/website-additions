//Yes I know this is hideous, but I don't have anything other than vanilla js :D Please make this recursive so it gets all json files in a directlry instead

let canvas = document.getElementById("qr-code");
let ctx = canvas.getContext("2d");

//Get the width & height of the canvas
let size = canvas.width;
let radius = size/2;

let sizeMultiplier = 3.527777366203752; //From 283px to 1000 in this tool!
let centerRadiusOffset = 3.2;

let imageLogo;
let karmaLogo;

//Load all the templates
//fetch('/templates/circle.json').then((data) => data.json()).then(json => defaults = { ...defaults, "circle" : json });

let defaults = {
    "circle":
        {
            "name": "Acrylic circle fish",
            "print_size": "10cm x 10cm",
            "canvas_w": 1000,
            "canvas_h": 1000,
            "shape": {
                "type": "circle"
            },
            "logo": {
                "w": 200,
                "h": 100,
                "offset_y": 0.09,
                "offset_x": 0.5
            },
            "karmaLogo": {
                "w": 200,
                "h": 50,
                "offset_y": 0.95,
                "offset_x": 0.5
            },
            "title": {
                "offset_x": 0.5,
                "offset_y": 0.275,
                "fontsize": 40
            },
            "subtitle": {
                "offset_x": 0.5,
                "offset_y": 0.49,
                "fontsize": 12
            },
            "tableTitle": {
                "offset_x": 0.66,
                "offset_y": 0.6,
                "fontsize": 15.66
            },
            "tableNumber": {
                "offset_x": 0.66,
                "offset_y": 0.75,
                "fontsize": 47.45
            },
            "bottomTitle": {
                "offset_x": 0.5,
                "offset_y": 0.89,
                "fontsize": 10
            },
            "QRCode": {
                "size": 76.235,
                "offset_x": 0.33,
                "offset_y": 0.68
            }
        },
    "square1":
        {
            "name": "Acrylic square",
            "print_size": "10cm x 10cm",
            "canvas_w": 1000,
            "canvas_h": 1000,
            "shape": {
                "type": "rect",
                "radius": 140
            },
            "logo": {
                "w": 200,
                "h": 100,
                "offset_y": 0.08,
                "offset_x": 0.5
            },
            "karmaLogo": {
                "w": 200,
                "h": 50,
                "offset_y": 0.95,
                "offset_x": 0.5
            },
            "title": {
                "offset_x": 0.5,
                "offset_y": 0.275,
                "fontsize": 40
            },
            "subtitle": {
                "offset_x": 0.5,
                "offset_y": 0.49,
                "fontsize": 12
            },
            "tableTitle": {
                "offset_x": 0.66,
                "offset_y": 0.6,
                "fontsize": 16
            },
            "tableNumber": {
                "offset_x": 0.66,
                "offset_y": 0.75,
                "fontsize": 49
            },
            "bottomTitle": {
                "offset_x": 0.5,
                "offset_y": 0.89,
                "fontsize": 10
            },
            "QRCode": {
                "size": 76.235,
                "offset_x": 0.33,
                "offset_y": 0.68
            }
        },
    "a6":
        {
            "name": "A6 acrylic stand",
            "print_size": "10,5cm x 14,5cm",
            "canvas_w": 1240,
            "canvas_h": 1748,
            "shape": {
                "type": "rect",
                "radius": 0
            },
            "logo": {
                "w": 400,
                "h": 200,
                "offset_y": 0.1,
                "offset_x": 0.5
            },
            "karmaLogo": {
                "w": 400,
                "h": 100,
                "offset_y": 0.95,
                "offset_x": 0.5
            },
            "title": {
                "offset_x": 0.5,
                "offset_y": 0.275,
                "fontsize": 57
            },
            "subtitle": {
                "offset_x": 0.5,
                "offset_y": 0.84,
                "fontsize": 14
            },
            "tableTitle": {
                "offset_x": 0.76,
                "offset_y": 0.58,
                "fontsize": 16
            },
            "tableNumber": {
                "offset_x": 0.76,
                "offset_y": 0.68,
                "fontsize": 49
            },
            "bottomTitle": {
                "offset_x": 0.5,
                "offset_y": 0.88,
                "fontsize": 14
            },
            "QRCode": {
                "size": 150,
                "offset_x": 0.33,
                "offset_y": 0.615
            }
        }
}

let tempImage = new Image;
tempImage.crossOrigin="anonymous";
tempImage.onload = function () {
    karmaLogo = tempImage;
    updateCode();
}

WebFont.load({
    google: {
        families: ['Inter:500,700,800,900']
    }
});

WebFontConfig = {
    active: init()
};

function init() {
    //Connect the file upload step
    let imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

    //Prep the templates
    let container = document.getElementById("designOptions");
    container.innerHTML = "";
    Object.keys(defaults).forEach(val => {
        let design = defaults[val];
        container.innerHTML += `<div><input type='radio' id='${val}' name='design' value='${val}' checked><label for='${val}'>${design.name}</label> <span style='font-size:12px;color:#aaa;'>${design.print_size}</span></div>`;
    })

    //Update the texts
    updateTexts();

    //Load the Karma logo - this will trigger the onloaded function that will render the code
    tempImage.src = "https://raw.githubusercontent.com/karmadev/website-additions/master/images/powered.png";
}

const coverImg = (img, type, winW, winH, offsetX, offsetY, context) => {
    const imgRatio = img.height / img.width
    const winRatio = winH / winW
    if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) {
        const h = winW * imgRatio
        context.drawImage(img, 0 + offsetX, (winH - h) / 2 + offsetY, winW, h)
    }
    if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) {
        const w = winW * winRatio / imgRatio
        context.drawImage(img, (winW - w) / 2 + offsetX, 0 + offsetY, w, winH)
    }
}

function drawImage() {
    //Find out which style we're using
    let selected = document.querySelector('input[name="design"]:checked').value;
    let def = defaults[selected];

    ctx.fillStyle = document.getElementById("backgroundColor").value;
    if(imageLogo != null) {
        let w = def.logo.w;
        let h = def.logo.h;

        //Recalc the offset in %
        let offsetY = def.logo.offset_y * canvas.height;
        let offsetX = def.logo.offset_x * size;

        ctx.fillRect(offsetX-w/2, offsetY-h/2, w, h);
        coverImg(imageLogo, 'contain', w, h, offsetX-w/2, offsetY-h/2, ctx);
    }

    //Draw the Karma logotype
    if(karmaLogo != null) {
        let w = def.karmaLogo.w;
        let h = def.karmaLogo.h;

        //Recalc the offset in %
        let offsetY = def.karmaLogo.offset_y * canvas.height
        let offsetX = def.karmaLogo.offset_x * size

        ctx.fillRect(offsetX-w/2, offsetY-h/2, w, h);
        coverImg(karmaLogo, 'contain', w, h, offsetX-w/2, offsetY-h/2, ctx);
    }
}

function handleImage(e){
    let reader = new FileReader();
    reader.onload = function(event){
        let img = new Image();
        img.crossOrigin="anonymous";
        img.onload = function(){
            imageLogo = img;
            drawImage();
            /*var hRatio = 200 / img.width    ;
            var vRatio = 100 / img.height  ;
            var ratio  = Math.min ( hRatio, vRatio );
            ctx.drawImage(img,0,0, img.width, img.height, size/2-100, 40, 200, 100);*/
            //https://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas/21961894#21961894
        }

        img.src = event.target.result;
    }

    reader.readAsDataURL(e.target.files[0]);
}

function roundRect(
    context,
    x,
    y,
    width,
    height,
    radius = 5,
    fill = false,
    stroke = true
) {
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
    }
    context.beginPath();
    context.moveTo(x + radius.tl, y);
    context.lineTo(x + width - radius.tr, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    context.lineTo(x + width, y + height - radius.br);
    context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    context.lineTo(x + radius.bl, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    context.lineTo(x, y + radius.tl);
    context.quadraticCurveTo(x, y, x + radius.tl, y);
    context.closePath();
    if (fill) {
        context.fill();
    }
    if (stroke) {
        context.stroke();
    }
}

function getText(name) {
    let defaultTexts = document.getElementById("defaultTexts").checked;
    let textDefaults = {
        textTitle : {
            se : "Beställ &--betala här",
            en : "Order &--pay here"
        },
        textTitleSquare : {
            se : "Beställ &--betala här",
            en : "Order &--pay here"
        },
        textSubtitle : {
            se : "Skanna QR-koden med din mobil",
            en : "Scan the QR-code with your phone"
        },
        textTableTitle : {
            se : "BORD",
            en : "TABLE"
        },
        textBottom : {
            se : "Ingen app behövs",
            en : "No app needed"
        }
    }

    //What language is selected for the defaults
    let lang = document.getElementById("defaultLanguage").value;

    if(defaultTexts) {
        return textDefaults[name][lang];
    } else {
        if(name === "textTitleSquare") {
            name = "textTitle"; //Correct the default fetch
        }
        return document.getElementById(name).value;
    }
}

function updateTexts() {
    let defaultTexts = document.getElementById("defaultTexts").checked;

    //Define all the fields
    let textTitle = document.getElementById("textTitle");
    let textSubtitle = document.getElementById("textSubtitle");
    let textTableTitle = document.getElementById("textTableTitle");
    let textBottom = document.getElementById("textBottom");

    let arrayTextFields = [textTitle, textSubtitle, textTableTitle, textBottom];

    if(defaultTexts) {
        //Disable all the text fields
        arrayTextFields.forEach(field => {
            field.disabled = true;
            field.parentElement.style.display = "none";
        });
    } else {
        //Enable all the text fields
        arrayTextFields.forEach(field => {
            field.disabled = false;
            field.parentElement.style.display = "block";
        });
    }

    updateCode();
}

function updateCode() {

    //Find out which style we're using
    let selected = document.querySelector('input[name="design"]:checked').value;
    let def = defaults[selected];

    //Update the canvas size
    canvas.width = def.canvas_w;
    canvas.height = def.canvas_h;

    size = canvas.width;
    radius = size/2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let bgColor = document.getElementById("backgroundColor").value;
    let textColor = document.getElementById("textColor").value;



    //Draw the circle
    ctx.fillStyle = bgColor;
    let title = "textTitle"; //The circle and square default titles are different
    if(def.shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    } else {
        roundRect(ctx,0,0,canvas.width, canvas.height, def.shape.radius, true, false);
        title = "textTitleSquare";
    }

    //Draw a safety margin circle
    let safetyMarginShow = document.getElementById("safetyMarginShow").checked;
    let safetyMargin = document.getElementById("safetyMargin").value;
    if(safetyMarginShow) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FF0000';
        if(def.shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(radius, radius, radius - safetyMargin * 2, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.stroke();
        } else {
            //ctx.closePath();
            //roundRect(ctx,safetyMargin,safetyMargin,size - safetyMargin * 2, size - safetyMargin * 2, 0, false, true);
            //ctx.stroke();
        }
    }

    //Update any logotype/image
    drawImage();

    //Generate the texts
    let text = getText(title);
    ctx.font = 'bold ' + def.title.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    ctx.fillStyle = textColor;
    writeText(text, def.title.offset_x * size, def.title.offset_y * canvas.height, def.title.fontsize);

    //Generate the subtitle
    text = getText("textSubtitle");
    ctx.font = '500 ' + def.subtitle.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    writeText(text, def.subtitle.offset_x * size, def.subtitle.offset_y * canvas.height, def.subtitle.fontsize);

    //Generate the bottom text
    text = getText("textBottom");
    ctx.font = '500 ' + def.bottomTitle.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    writeText(text, def.bottomTitle.offset_x * size, def.bottomTitle.offset_y * canvas.height, def.bottomTitle.fontsize);

    //Generate the table text
    text = getText("textTableTitle");
    ctx.font = '500 ' + def.tableTitle.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    writeText(text, def.tableTitle.offset_x * size, def.tableTitle.offset_y * canvas.height, def.tableTitle.fontsize);

    //Generate the table number text
    text = document.getElementById("textTableNumber").value;
    ctx.font = 'bold ' + def.tableNumber.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    writeText(text, def.tableNumber.offset_x * size, def.tableNumber.offset_y * canvas.height, def.tableNumber.fontsize);

    //Generate a base QR-code
    updateQR();
}

function writeText(txt, x, y, fontSize = 0) {
    let lineHeight = fontSize * sizeMultiplier;
    let lines = txt.split('--');

    for (let i = 0; i<lines.length; i++)
        ctx.fillText(lines[i], x, y + (i*lineHeight) );
}

function updateQR() {

    //Find out which style we're using
    let selected = document.querySelector('input[name="design"]:checked').value;
    let def = defaults[selected];

    let text = document.getElementById("storefrontURL").value;

    let bgColor = document.getElementById("backgroundColor").value;
    let qrColor = document.getElementById("qrColor").value;

    let qrSize = def.QRCode.size * sizeMultiplier;

    console.log(qrColor);

    let qr = new QRious({
        background: bgColor,
        foreground: qrColor,
        level: 'H',
        padding: 0,
        value: text.toString(),
        size: qrSize
    });

    ctx.drawImage(qr.image,def.QRCode.offset_x*size - qrSize/2, def.QRCode.offset_y*canvas.height - qrSize/2);
    //document.getElementById("debug").innerText = text;
}

const {
    jsPDF
} = window.jspdf;
const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width,canvas.height],
    hotfixes: ["px_scaling"]
});

const download = document.getElementById('downloadPDF');
download.addEventListener("click", () => {
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0);
    let tableName = document.getElementById("textTableTitle").value;
    let tableNumber = document.getElementById("textTableNumber").value;
    pdf.save("qr-code-"+tableName+"-"+tableNumber+".pdf");
}, false);