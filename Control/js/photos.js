const clientAddr = 'http://localhost/PHP/server.php';
const controlAddr = 'http://localhost/PHP/control-server.php';
const req = new XMLHttpRequest();
let onRecieve = null;
const debug = true;
const imgContainer = document.querySelector(".imgContainer"); 
const popup = document.querySelector(".popup");

req.onreadystatechange = function() {
    if(req.readyState == 4) {
        if(onRecieve) {
            if(req.status == 200) onRecieve(req.responseText);
            else onRecieve(debug? req.statusText:null);
        }
    }
};

function Request(command,onrecievefunc,additionalArgs,addr) {
    addr = (!addr? controlAddr : addr) + "?command=" + command + (!additionalArgs? "" : "&" + additionalArgs);
    onRecieve = onrecievefunc;
    req.open("GET",addr);
    req.send();
}

function AppendPhoto(name,base64code) {
    var phElem = document.createElement("div");
    phElem.className="imgFrame";
    phElem.innerHTML = '<div class="soft"><img src="'+base64code+'"></div><h1>'+name+'</h1>';
    imgContainer.insertBefore(phElem,imgContainer.lastChild()); 
}

function TogglePopup(state) {
    switch(state) {
        case true:
            popup.style.animation = "OpenPopup .4s ease-in-out forwards";
            break;
        case false:
            popup.style.animation = "ClosePopup .4s ease-in-out forwards";
            break;
        default:
            break;
    }
}

function ToggleContent(query) {
    for(var a = 0; a < popup.children.length;a+=1) popup.children[a].style.display = "none";
    if(query == "-all") return;
    (typeof query == "number"? popup.children[query] : popup.querySelector(query)).style.display = "flex";
}

function IsPopupObject(element) {
    var windows = document.querySelectorAll(".popup-window");
    for(var a = 0; a < windows.length;a+=1) 
        if(windows[a].contains(element)) return true;
    return false;
}

popup.onclick = function(event){
    if(event.target.classList == "popup-window" || IsPopupObject(event.target)) return;
    TogglePopup(false);
};

/* IMAGE LOADER */

let loader = document.querySelector(".loader");
let loadzone = document.querySelector(".loadzone");

function OpenImageLoader() {
    TogglePopup(true);
    ToggleContent(".loader");
}

function Loader_BrowseFiles() {
    var filebrowser = document.createElement("input");
    filebrowser.type = "file";
    filebrowser.click();
    filebrowser.onchange = function() {
        Loader_Loaded(this.files[0]);
    };
}

function Loader_Loaded(file) {
    var extension = file.name.split(".").pop();
    if(!['jpg','png','svg'].includes(extension)) {
        alert("Ошибка! Недопустимое расширение файла.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
        loader.querySelector(".soft").style.display = "block";
        loader.querySelector(".preview").src = ev.target.result;
        loadzone.style.display = "none";
    };
    reader.readAsDataURL(file);
}

function strweight(str) {
    for(var a = 0; a < str.length;a+=1)
        if(![' ', /\n/].includes(str[a])) return true;
    return false;
}

function Loader_Done() {
    Request("addImage",function(result) {
        alert(result);
    },"code=" + loader.querySelector(".preview").src);

    return;
    var name = loader.querySelector(".photoName").value;
    if(!strweight(name)) {
        alert("Ошибка! Пустое имя!");
        return;
    }
    name = name.replace(/\<|\>|\?|\"|\||\/|\:|\*|\ /g,'_');

}

// /\ : * ? " < > |


loadzone.addEventListener("drop",function(ev) {
    Loader_Loaded(ev.dataTransfer.files[0]);
    loadzone.style.borderColor = "grey";
    ev.preventDefault();
},false);

loadzone.addEventListener("dragover",function(ev) {
    loadzone.style.borderColor = "black";
    ev.preventDefault();
},false);
loadzone.addEventListener("dragleave",function(ev) {
    loadzone.style.borderColor = "grey";
    ev.preventDefault();
},false);




// SCRIPT PART

//load all photos
Request("getAllImages",function(result) {
    if(!result) {
        alert("Ошибка!");
        return;
    }
    var images = JSON.parse(result);
    for(var a = 0; a < images.length;a+=1)
        AppendPhoto(images[a].name,images[a].base64);
});

ToggleContent("-all");

OpenImageLoader();
