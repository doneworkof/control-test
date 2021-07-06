let address = 'http://localhost/PHP/control-server.php';
let valueText = document.querySelector("p");
let nigga = new XMLHttpRequest();

nigga.onreadystatechange = function() {
    if(nigga.readyState == 4) {
        if(nigga.status == 200) {
            valueText.innerHTML = nigga.responseText;
        }
        else valueText.innerHTML = "ERROR: " + nigga.statusText;
    }
};

//nigga.open("GET",address);
//nigga.send();


function ConvertToBASE64(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    document.body.appendChild(canvas);
    var dataURL = canvas.toDataURL("image/jpg");
    //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL;
}

var img = new Image();
img.crossOrigin="anonymous";

img.src="minecraft.jpg";

img.onload = function() {
    alert(ConvertToBASE64(this));
};