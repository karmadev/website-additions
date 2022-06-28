let canvas = document.getElementById("qr-code");
let ctx = canvas.getContext("2d");

//Get the width & height of the canvas
let size = canvas.width;

let sizeMultiplier = 3.527777366203752; //From 283px to 1000 in this tool!
let centerRadiusOffset = 3.2;

let imageLogo;
let karmaLogo;

let tempImage = new Image;
tempImage.crossOrigin="anonymous";
tempImage.onload = function () {
    karmaLogo = tempImage;
    drawImage();
}

tempImage.src = "https://raw.githubusercontent.com/karmadev/website-additions/master/images/powered.png";

WebFont.load({
    google: {
        families: ['Inter:500,700,800,900']
    }
});

WebFontConfig = {
    active: updateTexts()
};

let imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

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
    ctx.fillStyle = document.getElementById("backgroundColor").value;
    if(imageLogo != null) {
        let w = 200;
        let h = 100;
        let offsetY = 40;
        ctx.fillRect(size/2-w/2, offsetY, w, h);
        coverImg(imageLogo, 'contain', w, h, size/2-w/2, offsetY, ctx);
    }

    //Draw the Karma logotype
    if(karmaLogo != null) {
        let w = 150;
        let h = 50;
        let offsetY = size - 80;
        ctx.fillRect(size/2-w/2, offsetY, w, h);
        coverImg(karmaLogo, 'contain', w, h, size/2-w/2, offsetY, ctx);
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
    ctx,
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

function getText(name) {
    let defaultTexts = document.getElementById("defaultTexts").checked;
    let defaults = {
        textTitle : {
            se : "Beställ &--betala här",
            en : "Order &--pay here"
        },
        textTitleSquare : {
            se : "Beställ & betala här",
            en : "Order & pay here"
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
        return defaults[name][lang];
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

function updateCode(updateCodeToo = true) {

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width/2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    let defaults = {
        "circle" : {
            shape: {
                type: "circle"
            },
            title: {
                offset_x: radius,
                offset_y: radius-225,
                fontsize: 40
            },
            subtitle : {
                offset_x: radius,
                offset_y: radius-10,
                fontsize: 12
            },
            tableTitle : {
                offset_x: radius + radius/centerRadiusOffset,
                offset_y: radius+100,
                fontsize: 15.66
            },
            tableNumber : {
                offset_x: radius + radius/centerRadiusOffset,
                offset_y: radius+250,
                fontsize: 47.45
            },
            bottomTitle : {
                offset_x: radius,
                offset_y: radius*2-100,
                fontsize: 10
            },
            QRCode : {
                offset_x: radius,
                offset_y: radius-10,
            }
        },
        "square1" : {
            shape: {
                type: "rect",
                radius: 140
            },
            title: {
                offset_x: radius,
                offset_y: radius-225,
                fontsize: 20
            },
            subtitle : {
                offset_x: radius,
                offset_y: radius-100,
                fontsize: 12
            }
        }
    }

    let bgColor = document.getElementById("backgroundColor").value;
    let textColor = document.getElementById("textColor").value;

    //Find out which style we're using
    let selected = document.querySelector('input[name="design"]:checked').value;
    let def = defaults[selected];

    //Draw the circle
    ctx.fillStyle = bgColor;
    let title = "textTitle"; //The circle and square default titles are different
    if(def.shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    } else {
        roundRect(ctx,0,0,size, size, def.shape.radius, true, false);
        title = "textTitleSquare";
    }

    //Draw a safety margin circle
    let safetyMarginShow = document.getElementById("safetyMarginShow").checked;
    let safetyMargin = document.getElementById("safetyMargin").value;
    if(safetyMarginShow) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - safetyMargin * 2, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
    }

    //Generate the texts
    let text = getText(title);
    ctx.font = 'bold ' + def.title.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    ctx.fillStyle = textColor;
    writeText(text, def.title.offset_x, def.title.offset_y, def.title.fontsize);

    //Generate the subtitle
    text = getText("textSubtitle");
    ctx.font = '500 ' + def.subtitle.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    writeText(text, def.subtitle.offset_x, def.subtitle.offset_y, def.subtitle.fontsize);

    //Generate the bottom text
    text = getText("textBottom");
    ctx.font = '500 ' + def.bottomTitle.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    writeText(text, def.bottomTitle.offset_x, def.bottomTitle.offset_y, def.bottomTitle.fontsize);

    //Generate the table text
    text = getText("textTableTitle");
    ctx.font = '500 ' + def.tableTitle.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    writeText(text, def.tableTitle.offset_x, def.tableTitle.offset_y, def.tableTitle.fontsize);

    //Generate the table number text
    text = document.getElementById("textTableNumber").value;
    ctx.font = 'bold ' + def.tableNumber.fontsize * sizeMultiplier + 'px inter';
    ctx.textAlign = 'center'
    writeText(text, def.tableNumber.offset_x, def.tableNumber.offset_y, def.tableNumber.fontsize);

    //Generate a base QR-code
    updateQR();

    //Update any logotype/image
    drawImage();
}

function writeText(txt, x, y, fontSize = 0) {
    let lineHeight = fontSize * sizeMultiplier;
    let lines = txt.split('--');

    for (let i = 0; i<lines.length; i++)
        ctx.fillText(lines[i], x, y + (i*lineHeight) );
}

function updateQR() {
    const radius = canvas.width/2;
    let text = document.getElementById("storefrontURL").value;

    let bgColor = document.getElementById("backgroundColor").value;
    let qrColor = document.getElementById("qrColor").value;

    console.log(qrColor);

    let qr = new QRious({
        background: bgColor,
        foreground: qrColor,
        level: 'H',
        padding: 0,
        value: text.toString(),
        size: 76.235*sizeMultiplier
    });

    let offset = 160;

    ctx.drawImage(qr.image,radius - radius/centerRadiusOffset - qr.size/2,radius - radius/2 + qr.size/2 + offset);
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