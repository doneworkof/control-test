const imgContainer = document.querySelector(".imgContainer"); 

function OptimizeFilename(name) {
    return name.replace(/\<|\>|\?|\"|\||\/|\:|\*|\ |\+/g,'_').replace(/\./g,'-');
}

/* IMAGE LOADER */

let loader = document.querySelector(".loader");
let loadzone = document.querySelector(".loadzone");

function OpenImageLoader() {
    Loader_Reset();
    TogglePopup(true);
    ToggleContent(".loader");
}

function Loader_BrowseFiles() {
    var filebrowser = document.createElement("input");
    filebrowser.type = "file";
    filebrowser.accept="image/*";
    filebrowser.click();
    filebrowser.onchange = function() {
        Loader_Loaded(this.files[0]);
    };
}

function Loader_Loaded(file) {
    var extension = file.name.split(".").pop();
    if(!['jpg','png','webp'].includes(extension)) {
        alert("Ошибка! Недопустимое расширение файла.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
        loader.querySelector(".soft").style.display = "block";
        loader.querySelector(".preview").src = ev.target.result;
        loadzone.style.display = "none";
        document.querySelector(".photoName").focus();
    };
    reader.readAsDataURL(file);
}

function strweight(str) {
    for(var a = 0; a < str.length;a+=1)
        if(![' ', /\n/].includes(str[a])) return true;
    return false;
}

function Loader_DisableButtons() {
    var buttonHolder = loader.querySelector(".controls");
    for(var a = 0; a < 2; a+=1)
        buttonHolder.children[a].classList.add("disabled");
}

function Loader_Cancel() {
    Loader_DisableButtons();
    TogglePopup(false);
}

function Loader_Done() {
    var name = loader.querySelector(".photoName").value;
    var base64 = loader.querySelector(".preview").src;
    if(!strweight(name)) {
        alert("Ошибка! Пустое имя!");
        return;
    }
    else if(base64 == "") {
        alert("Ошибка! Нету фотографии.");
        return;
    }
    name = OptimizeFilename(name);
    Request("doesImageExist",function(exist) {
        if(exist == "true" && !confirm("Изображение с таким именем уже есть. Перезаписать?"))
            return;

        Loader_DisableButtons();

        SendFile("addImage",function() {
            TogglePopup(false);
            UpdatePhotos();
        },base64,"name="+name);
    },"name="+name);
}

function Loader_Reset() {
    loader.querySelector(".soft").style.display = "none";
    loader.querySelector(".preview").src = "";
    loadzone.style.display = "flex";
    loader.querySelector(".photoName").value="";
    
    var buttonHolder = loader.querySelector(".controls");
    for(var a = 0; a < 2; a+=1)
        buttonHolder.children[a].classList.remove("disabled");
}


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


function UpdatePhotos() {
    Request("getAllImages",function(result) {
        function ClearImages() {
            var oldImages = imgContainer.querySelectorAll(".imgFrame:not(.new)");
            oldImages.forEach(el=>{imgContainer.removeChild(el)});
        }

        if(!strweight(result)) {
            if(imgContainer.children.length==1) return;
            ClearImages();
            return;
        }

        var images = result.split(",");
        if(imgContainer.children.length > 1) ClearImages();

        images.forEach(img=>{
            var phElem = document.createElement("div");
            phElem.className="imgFrame";
            phElem.id = img;
            phElem.onclick = function() {Edit_Open(this)};
            phElem.innerHTML = '<div class="soft"><img src="'+imgRoot+img+'.jpg"></div><h1>'+img+'</h1>';
            imgContainer.insertBefore(phElem,imgContainer.lastElementChild); 
        });

    });
}

/* IMAGE EDIT WINDOW */

let Edit_startName;
const edit = document.querySelector(".edit");

function Edit_Open(el) {
    TogglePopup(true);
    ToggleContent(".edit");
    Edit_startName = el.id;
    edit.querySelector(".photoName").value=Edit_startName;

    var soft = edit.querySelector(".soft");
    var img = edit.querySelector("img");
    img.src=el.querySelector("img").src;
    
    var sideRatio = img.naturalWidth/img.naturalHeight;

    soft.style.width = (soft.clientHeight * sideRatio) + "px";
}

function Edit_Done() {
    var newName = edit.querySelector(".photoName").value;
    if(!strweight(newName)) {
        alert("Ошибка! Пустое имя!");
        return;
    }
    newName = OptimizeFilename(newName);
    if(newName == Edit_startName) {
        TogglePopup(false);
        return;
    }
    Request("doesImageExist",function(result) {
        if(result == "true") {
            alert("Имя занято!");
            return;
        }
        Request("renameImage",function(answer) {
            if(answer == "Ошибка!") {
                alert("Что-то пошло не так...");
            }
            else UpdatePhotos();
            TogglePopup(false);
        },"oldName="+Edit_startName+"&newName="+newName);
    },"name="+newName);
}

function Edit_Delete() {
    if(!confirm("Вы уверены?")) return;
    Request("deleteImage",function() {
        TogglePopup(false);
        UpdatePhotos();
    },"name="+Edit_startName);
}

// SCRIPT PART

UpdatePhotos();

TogglePopup("-all");
