let shopMeat = document.getElementById("shop-meat");
let shopSeafood = document.getElementById("shop-seafood");
let shopVegetable = document.getElementById("shop-vegetable");
let shopDumplings = document.getElementById("shop-dumplings");
let shopHotPot = document.getElementById("shop-hotPot");

let meatType = projectDataList.filter((x) => {return x.type === "meat"});
let seafoodType = projectDataList.filter((x) => {return x.type === "seafood"});
let vegetableType = projectDataList.filter((x) => {return x.type === "vegetable"});
let dumplingsType = projectDataList.filter((x) => {return x.type === "dumplings"});
let hotPotType = projectDataList.filter((x) => {return x.type === "hotPot"});

let basket = JSON.parse(localStorage.getItem("data")) || [] ;

//品項生成
let generateMenuCard = (dom, datalist) => {
    return dom.innerHTML = datalist.map((x) => {//slice選取projectDataList內部分物件
        let {img, product, price, id} = x;
        //從本機儲存裡找資料
        let search = basket.find((x) => x.id === id) || [];
        return `
            <div class="col-12 col-lg-6" id=project-id-${id}>
                <div class="item">
                    <div class="mycard">
                        <img class="card-img" src=${img} alt="project-pic"/>
                        <div class="mycard-body">
                            <div class="body-info">
                                <h4 class="card-title">${product}</h4>
                                <p class="card-text">$${price}</p>
                            </div>
                            <div class="project-btn-group">
                                <i class="bi bi-dash" onclick="decrement(${id})"></i>
                                <div id=${id} class="project-count">${search.item === undefined ? 0 : search.item}</div>
                                <i class="bi bi-plus" onclick="increment(${id})"></i>
                            </div>
                        </div>
                    </div>   
                </div>
            </div>
        `
    }).join("")

}
generateMenuCard(shopMeat, meatType);
generateMenuCard(shopSeafood, seafoodType);
generateMenuCard(shopVegetable, vegetableType);
generateMenuCard(shopDumplings, dumplingsType);

// 鍋物生成
let generateHotPotCard = (dom, datalist) => {
    return dom.innerHTML = datalist.map((x) => {//slice選取projectDataList內部分物件
        let {img, product, price, id} = x;
        //從本機儲存裡找資料
        let search = basket.find((x) => x.id === id) || [];
        return `
            <div class="col-12 col-lg-6">
                <input type="radio" id=${id} name="hotPot" value=${id}>
                <label class="hotPot-label" for=${id} onclick="orderHotPot(${id})">
                    <span class="hotPot-radio"></span>
                    <img class="card-img" src="${img}"/>
                    <div class="body-info">
                        <h4 class="card-title">${product}</h4>
                        <p class="card-text">$${price}</p>
                    </div>
                </label>
            </div>
            
        `
    }).join("")

}
generateHotPotCard(shopHotPot, hotPotType);

let orderHotPot = (id) => {
    //以訂單id去火鍋商品資料內核對
    let search = basket.find((x) => { 
        return hotPotType.find((y) => {
            return x.id === y.id
        })
    })

    if (search === undefined) {
        basket.push({
            id: id.id,
            item: 1,
        });
    }
    else{
        search.id = id.id
    }
    generateCartItem(shoppingCart);
    generateCartItem(cartContainer);
    generateCartButton();
    cartTotal();
    totalPrice();

    localStorage.setItem("data", JSON.stringify(basket));
}

//check box 顯示
let itemChecked = () => {
    let search = basket.find((x) => { 
        return hotPotType.find((y) => {
            return x.id === y.id
        })
    })

    if (search === undefined) {
        return
    }
    else{
        document.getElementById(search.id).setAttribute("checked", "checked");
    } 
}
itemChecked();


//增量數量函式

let increment = (id) => {
    // console.log(id);return;
    let productItem = id;

    let search = basket.find((x) => { return x.id === productItem.id})

    if (search === undefined) {
        basket.push({
            id: productItem.id,
            item: 1,
        });
    }
    else{
        search.item += 1;
    }
    updata(productItem.id);
    generateCartItem(shoppingCart);
    generateCartItem(cartContainer);
    generateCartButton();
    localStorage.setItem("data", JSON.stringify(basket));
};

//減量數量函式
let decrement = (id) => {
    let productItem = id;
    
    let search = basket.find((x) => { return x.id === productItem.id})


    if (search === undefined) {
        return;
    }
    else if (search.item === 0) {
        return;
    }
    else{
        search.item -= 1;
    }
    // console.log(basket);
    updata(productItem.id);
    //移除數量為0的物件
    basket = basket.filter((x) => x.item !== 0);//回傳此條件為true的物件
    generateCartItem(shoppingCart);
    generateCartItem(cartContainer);
    generateCartButton();
    localStorage.setItem("data", JSON.stringify(basket));
};

//更新函式input值
let updata = (id) => {
    let search = basket.find((x) => x.id === id);
    
    if (search !== undefined) {
        document.getElementById(id).innerHTML = search.item;
    }
    else {
        document.getElementById(id).innerHTML = 0;
    }
    
    
    cartTotal();
    totalPrice();
};


//購物車加總顯示
let orderCount = document.getElementById("order-count");
let cartTotal = () => {
    let itemAmount = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
    orderCount.innerText = itemAmount;
}

cartTotal();

//購物車

let openCart = () => {
    let cartPage = document.getElementById("cart-page");
    cartPage.style.transform = "translateX(0%)";
}

let closeCart = () => {
    let cartPage = document.getElementById("cart-page");
    cartPage.style.transform = "translateX(100%)";
}

let shoppingCart = document.getElementById("shopping-cart");

let generateCartItem = (dom) => {
    //dom參數
    let cartTotle = document.getElementById("cart-total");
    if (basket.length !== 0){
        //cart not empty
        return dom.innerHTML = basket.map((x) => {
            let {id , item} = x;//物件解構賦值變數
            
            let search = projectDataList.find((y) => y.id === id) || [];
            // console.log(search);
            return `
            <div class="cart-item">
                <img src=${search.img} alt="">
                <div class="cart-info">
                    <p class="cart-info-title">${search.product}</p>
                    <div class="price">
                        <p>$ ${search.price} x ${item} = ${search.price * item}</p>
                    </div>
                </div>
                <i onclick="removeItem(${id})" class="bi bi-trash"></i>
            </div>
            `
        }).join("")
    }
    else {
        //cart empty
        cartTotle.innerHTML = ``;
        dom.innerHTML = `
        <div class="no-item"><h4>購物車是空的唷</h4></div>
        `;
    }
}

generateCartItem(shoppingCart);

//顯示購物車按鈕
let generateCartButton = () => {
    if (basket.length !== 0){
        document.getElementById("order-info").style.display = "block";
    }else {
        document.getElementById("order-info").style.display = "none";
    }
}
generateCartButton();

//開啟購物車
let cartContainer = document.getElementById("cart-container");
generateCartItem(cartContainer);

let displayCart = () =>{
    document.getElementById("order-page").style.transform = "translateY(0%)";
    console.log("ok");
    document.querySelector("#order-info > div").setAttribute('onclick',"sendCart()");
    document.getElementById("order-title").innerHTML = "送出";
    document.querySelector("#order-info > div > div:nth-child(2)").style.display = "none";
}

//隱藏購物車
let hideCart = () => {
    document.getElementById("order-page").style.transform = "translateY(120%)";
    document.querySelector("#order-info > div").setAttribute('onclick',"displayCart()");
    document.getElementById("order-title").innerHTML = "目前";
    document.querySelector("#order-info > div > div:nth-child(2)").style.display = "block";
}

//送單
let sendCart = () => {
    console.log("sendCart");
    clearCart();
}


// console.log(document.getElementById("project01"))
let removeItem = (id) => {
    let productItem = id;
    //移除物件
    basket = basket.filter((x) => x.id !== productItem.id);
    generateCartItem(shoppingCart);
    generateCartItem(cartContainer);
    generateCartButton();
    cartTotal();
    updata(productItem.id);
    generateHotPotCard(shopHotPot, hotPotType);
    localStorage.setItem("data", JSON.stringify(basket));
}

//購物車金額加總
let totalPrice = () => {
    let orderPrice = document.getElementById("order-price");
    if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let {id, item} = x;
            let search = projectDataList.find((y) => y.id === id) || [];
            return item * search.price;
        }).reduce((x, y) => x + y ,0);

        orderPrice.innerHTML = `
        $ ${amount}
        `;
        // return amount;
    }
    else {
        orderPrice.innerHTML = `
        $ 0
        `
    }
}

totalPrice();

let clearCart = () => {
    basket = [];
    generateCartItem(shoppingCart);
    generateCartItem(cartContainer);
    generateCartButton();
    cartTotal();
    totalPrice();
    generateMenuCard(shopMeat, meatType);
    generateMenuCard(shopSeafood, seafoodType);
    generateMenuCard(shopVegetable, vegetableType);
    generateMenuCard(shopDumplings, dumplingsType);
    generateHotPotCard(shopHotPot, hotPotType);
    
    localStorage.setItem("data", JSON.stringify(basket)); 
}


//分類錨點
function scrollToAnchor(anchorName) {
    var anchor = document.getElementById(anchorName);
    var offset = anchor.offsetTop;
    document.getElementById("page-wrapper").scrollTo({
        top: offset - 30,
        behavior: "smooth",
    })
}
