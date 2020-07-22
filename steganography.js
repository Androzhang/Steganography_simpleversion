//Upload image
function loadimg(imgname, canvasname) {
    var i = document.getElementById(imgname);
    img = new SimpleImage(i);
    var c = document.getElementById(canvasname);
    img.drawTo(c);
}

//crop two images into same size
function crop(img,width,height){   
    var cropped = new SimpleImage(width,height); 
    for(var p of img.values()){
        var x = p.getX();
        var y = p.getY();
        if (x < width && y < height){
            var cp = cropped.getPixel(x,y);
            cp.setRed(p.getRed());
            cp.setGreen(p.getGreen());
            cp.setBlue(p.getBlue());
        }
    }
    return cropped;
}

//steganography
//zero the low bits
function clearBits(colorval) {
    var x = Math.floor(colorval/16)*16;
    return x;
}
//clear the low bits for each pixel of the show-image
function chop2hide(showimg) {
    for (var px of showimg.values()) {
        px.setRed(clearBits(px.getRed()));
        px.setGreen(clearBits(px.getGreen()));
        px.setBlue(clearBits(px.getBlue()));
    }
    return showimg;
}
//shift over each pixel of the hide-image
function shift(hideimg) {
    for (var px of hideimg.values()) {
        px.setRed(px.getRed()/16);
        px.setGreen(px.getGreen()/16);
        px.setBlue(px.getBlue()/16);
    }
    return hideimg;
}
//combine two images
function combine(showimg, hideimg) {
    //make a new image the same size as "show"
    var answer = new SimpleImage(showimg.getWidth(),showimg.getHeight());
    for (var px of answer.values()) {
        var x = px.getX();
        var y = px.getY();
        var showPixel = showimg.getPixel(x,y);
        var hidePixel = hideimg.getPixel(x,y);
        px.setRed(showPixel.getRed()+hidePixel.getRed());
        px.setGreen(showPixel.getGreen()+hidePixel.getGreen());
        px.setBlue(showPixel.getBlue()+hidePixel.getBlue());
    }
    return answer;
}

function createCmp() {
    var show = document.getElementById("c1");
    var hide = document.getElementById("c2");
    var start = new SimpleImage(show);
    var hide = new SimpleImage(hide);
    if (hide.getWidth() < start.getWidth() || hide.getHeight() < start.getHeight()) {
        alert("The hidden image cannot have smaller size than the surface image.\nPlease try angain.");
    } else {
        crop(hide,start.getWidth(),start.getHeight());
        start = chop2hide(start);
        hide = shift(hide);
        var ans = combine(start,hide);
        var c3 = document.getElementById("c3");
        ans.drawTo(c3);
    }
}

function clearCvs(elid) {
    var ctx = document.getElementById(elid).getContext("2d");
    var image = new SimpleImage(document.getElementById(elid));
    ctx.clearRect(0,0,image.getWidth(),image.getHeight());
}

