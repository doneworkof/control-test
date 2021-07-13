const holder = document.querySelector(".productList");

const edit = document.querySelector(".edit");
const editArticle = document.querySelector(".edit-article");

function Edit_Open(data) {
    TogglePopup(true);
    ToggleContent(".edit");

    //set information
    edit.querySelector("img").src = imgRoot + data.imgName + ".jpg";
    edit.querySelector(".productName").value = data.name;
    edit.querySelector(".costfield").value = data.cost;
    edit.querySelector(".available").checked = data.available == 1;

    //set article
    edit.querySelector(".article").innerHTML = data.article;
}

function AppendProduct(data) {
    var product = document.createElement("div");
    product.onclick = () => Edit_Open(data);
    product.className = "product" + (data.available == 0? " notAvailable" : "");
    product.innerHTML = '<div class="soft"><img src="' + imgRoot + data.imgName +'.jpg"></div><h1 class="productName">' + data.name + '</h1><h3 class="productCost">' + data.cost + '₽</h3>'
    holder.appendChild(product);
}

function UpdateProducts() {
    Request("getAllProducts",function(result) {
        var products = JSON.parse(result);
        products.forEach((productData) => AppendProduct(productData));
    },"",clientAddr);
}

UpdateProducts();