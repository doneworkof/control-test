let ajax = new XMLHttpRequest;
const img = document.querySelector("img");


ajax.onreadystatechange = function() {
    if(ajax.readyState == 4) {
        if(onRecieve) {
            if(ajax.status == 200) console.log(ajax.responseText);
            else console.log(ajax.statusText);
        }
    }
};

ajax.open("GET",'http://localhost/PHP/control-server.php?command=renameImage&oldName=zazar&newName=zazae');
ajax.send();

