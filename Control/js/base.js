const clientAddr = 'http://localhost/PHP/server.php';
const controlAddr = 'http://localhost/PHP/control-server.php';
const imgRoot = 'http://localhost/PHP/img/'
const req = new XMLHttpRequest();
let onRecieve = null;
const debug = true;
const popup = document.querySelector(".popup");

req.onreadystatechange = function() {
    if(req.readyState == 4) {
        if(onRecieve) {
            console.log(req.responseText);
            if(req.status == 200) onRecieve(req.responseText);
            else onRecieve(debug? req.statusText:null);
        }
    }
};

function Request(command,onrecievefunc,additionalArgs,addr) {
    addr = (!addr? controlAddr : addr) + "?command=" + command + (!additionalArgs? "" : "&" + additionalArgs);
    onRecieve = onrecievefunc;
    req.open("GET",addr);
    req.setRequestHeader('Content-Type', 'text/plain');
    req.send();
}

function SendFile(command,onrecievefunc,filedata,additionalArgs) {
    var addr = controlAddr + "?command=" + command + (!additionalArgs? "" : "&" + additionalArgs);;
    onRecieve = onrecievefunc;
    req.open("POST",addr,false);
    req.setRequestHeader('Content-Type', 'application/upload');
    req.send(filedata);
}

function FatalError(msg) {
    location.href = "error.html?code="+msg;
}

function TogglePopup(state) {
    switch(state) {
        case true:
            popup.style.animation = "OpenPopup .25s ease-in-out forwards";
            break;
        case false:
            popup.style.animation = "ClosePopup .25s ease-in-out forwards";
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
