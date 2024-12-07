import {v4 as uuidv4} from "https://jspm.dev/uuid"
import { photosData } from "./photosData.js"

let wishlistArray = []
let cartListArray = []
let totalPrice = 0


document.addEventListener('click', function(e){
    if(e.target.dataset.likebtn){
        handleLikeBtn(e.target.dataset.likebtn)
    } else if(e.target.dataset.cartbtn){
        handleCartBtn(e.target.dataset.cartbtn)
    } else if(e.target.id === 'wishlistIcon'){
        handleOpenWishlistBtn()
    } else if(e.target.id === 'closeWishlistContainer'){
        closeWishtlistContainer()
    } else if(e.target.id === 'cartIcon'){
        handleOpenCartBtn()
    } else if(e.target.id === 'closeCartBtn'){
        handleCloseCartBtn()
    } else if(e.target.dataset.removebtn){
        handleRemoveBtn(e.target.dataset.removebtn)
        renderOrderSummary()
        totalPrice = 0
        if(cartListArray.length === 0){
            document.getElementById('cartFeedData').innerHTML = `
        <div class="emptyCartList">
            <h2>The Cart is empty</h2>
            <img src="https://i.pinimg.com/736x/34/fc/9e/34fc9e34d2df1427f277130f8c59d8c0.jpg">
        </div>
            `
        }
    } else if(e.target.id === 'placeOrder'){
       handlePaymentModul()
    } else if(e.target.id === 'payBtn'){
        handlePayBtn(e)
    } else if(e.target.id === 'closeStatusModul'){
        handleCloseOrderStatusBtn()
    }
})

function handleLikeBtn(like){
    const targetedLikedBtn = photosData.filter(function(photo){
        return photo.uuid === like
    })[0]
    if(targetedLikedBtn){
        targetedLikedBtn.isLiked = !targetedLikedBtn.isLiked

        if(targetedLikedBtn.isLiked){
            wishlistArray.push(targetedLikedBtn)
        } else{
            wishlistArray = wishlistArray.filter(function(photo){
                return photo.uuid !== like
            })
        }
        render()
        renderWishlistModul()
    } 
}
function renderWishlistModul(){
    if(wishlistArray.length === 0){
        wishListEmpty()
    } else {
        document.getElementById('wishlisted').innerHTML =  storeLikesInWishList(wishlistArray)
    }
}

function wishListEmpty(){
 return document.getElementById('wishlisted').innerHTML = `
        <div class="emptyWishlist">
        <h2>The wishlist is empty</h2>
        <img src="https://i.pinimg.com/736x/16/5c/ec/165cecaddccf3945f16dbcf9875c3d68.jpg">
        </div>
        `
}

function storeLikesInWishList(wishlist){
    return wishlist.map(function(wish){
     return `
     <div class="wishlistTab" id="wishlistTab">
        <img src="${wish.photo}" alt="wishlist images">
        <h1>${wish.title}</h1>
     </div>
        `
    }).join('')
}

function handleCartBtn(cart){
    const targetedCartBtn = photosData.filter(function(photo){
        return photo.uuid === cart
    })[0]

    if(targetedCartBtn){
        targetedCartBtn.isCart = !targetedCartBtn.isCart

        if(targetedCartBtn.isCart){
            cartListArray.push(targetedCartBtn)
        } else{
            cartListArray = cartListArray.filter(function(photo){
                return photo.uuid !== cart
            })
        }
        
        render()
        renderOrderSummary()
    } 
}


function emptyOrderFeed(){
    if(cartListArray.length === 0){
        return document.getElementById('cartFeedData').innerHTML = `
        <div class="emptyCartList">
        <h2>Add Photos to the Cart</h2>
        <img src="https://i.pinimg.com/736x/38/93/93/3893933662360612a780b56cc7e3e1c1.jpg">
        </div>
        `
        }
}
emptyOrderFeed()
function renderOrderSummary(){
  

    document.getElementById('cartFeedData').innerHTML = 

    `${storedCartsInCartModul(cartListArray)}

    <div class="border"></div>

    ${getTotalPrice()}

    <button class="placeOrder" id="placeOrder">Place Order</button>`
}
function storedCartsInCartModul(cartItems){
    let total = 0
    return cartItems.map(cart => {
        const {
            photo,
            price,
            uuid,
        } = cart
        total += price
        totalPrice = total
        return `
       <div class="flexThree">
                <div class="flexFour">
                    <img class="cartImg" src="${photo}" alt="">
                    <button class="removeBtn" data-removebtn="${uuid}">remove</button>
                </div>
                 <h2 class="imagePrice">$${price}</h2>
            </div>
        `
    }).join('')
}

function getTotalPrice(){
return  `<div class="flexThree">
            <h2 class="totalPriceTxt">Total Price:</h2>
            <p class="totalPriceNum">$${totalPrice}</p>
        </div>`
}

function handleOpenWishlistBtn(){
    renderWishlistModul()
    document.getElementById('wishtlistContainer').style.display = 'block'
    document.getElementById('photosContainer').style.filter = 'blur(20px)';
}
function closeWishtlistContainer(){
    document.getElementById('wishtlistContainer').style.display = 'none'
    document.getElementById('photosContainer').style.filter = 'blur(0px)';
}
function handleOpenCartBtn(){
    document.getElementById('cartFeed').style.display = 'block'
    document.getElementById('photosContainer').style.filter = 'blur(20px)';
}
function handleCloseCartBtn(){
    document.getElementById('cartFeed').style.display = 'none'
    document.getElementById('photosContainer').style.filter = 'blur(0px)';
}
function handleRemoveBtn(remove){
    cartListArray = cartListArray.filter(function(order){
        return order.uuid !== remove
    })
    const targetedPhoto = photosData.find(function(photo){
        return photo.uuid === remove
    }) 
    if(targetedPhoto){
        targetedPhoto.isCart = false
    }
    render()
    renderOrderSummary()

    const findIndexOf = cartListArray.findIndex(order => order.uuid === remove)

    if(findIndexOf !== -1){
        cartListArray.splice(findIndexOf, 1)
    }
}

function handlePaymentModul(){
    document.getElementById('paymentModul').style.display = "block"
    document.getElementById('paymentModul').innerHTML = renderPaymentModul()
}

function renderPaymentModul(){
    return `
    <form>
        <h1 class="cardHeading">Enter You Card Details:</h1>

        <input type="text"
        placeholder="Enter your name"
        id="cardNameInp"
        required>

        <input type="text"
        placeholder="Enter your card number"
        id="cardNumInp"
        maxlength="15-19"
        inputmode="numeric"
        required>

        <input type="text"
        placeholder="Enter your cvv"
        id="cardCvvInp"
        maxlength="3"
        required>
        

        <button class="payBtn" id="payBtn" type="submit">Pay</button>
    </form>
`
}

function handlePayBtn(e){
    e.preventDefault()
    document.getElementById('cartFeed').style.display = 'none'
    document.getElementById('paymentModul').style.display = 'none'
    document.getElementById('orderComplete').style.display = 'block'

    renderPaymentComplete()
}

function renderPaymentComplete(){
    const nameValue = document.getElementById('cardNameInp')
    document.getElementById('orderComplete').innerHTML = `
    <i class="fa-solid fa-circle-xmark" id="closeStatusModul"></i>
        <div>
            <h1>Order Placed 📦</h1>
            <h4>You order will reach within 4 days!</h4>
            <h2>જ⁀➴ ⛟</h2>
            <h3>Thanks, ${nameValue.value} For ordering! 🥰</h3>
        </div>`
}
function handleCloseOrderStatusBtn(){
    document.getElementById('orderComplete').style.display = 'none'
    document.getElementById('photosContainer').style.filter = 'blur(0px)';
    location.reload()
}
function getPhotoFeedHTML(){
    let photofeed = ''
    photosData.forEach(function(tab){
        let likeColorIcon = ''
        let cartColorIcon = ''
        let cartBackshadow = ''
        if(tab.isLiked){
            likeColorIcon = 'liked'
        }
        if(tab.isCart){
            cartColorIcon = 'cart'
            cartBackshadow = 'backShadow'
        }
     photofeed +=   `
        <div class="photoTab">
            <h1>${tab.title}</h1>
            <img src="${tab.photo}" alt="psycho">
            <div class="flexOne">
            <i class="fa-solid fa-heart ${likeColorIcon}" data-likebtn="${tab.uuid}"></i>
            <div class="flexTwo">
            <i class="fa-solid fa-cart-plus ${cartColorIcon}" data-cartbtn="${tab.uuid}"></i>
            <h2 class="price ${cartBackshadow}">$${tab.price}</h2>
            </div>
            </div>
        </div>
        `
    });
    return photofeed
}

function render(){
    document.getElementById('photosContainer').innerHTML = getPhotoFeedHTML()
}
render()