(function ($) {
    "use strict";
    var products = [];
    var checkoutProducts = [];
    $(document).ready(function () {
        console.log("product json called")
        $.getJSON("products/ctjProducts.json", function(productObjs){
            products = productObjs
            var groupedProducts = $.fn.arrangeItemByCategory(productObjs);
            if (localStorage.getItem("checkoutProducts")) {
                checkoutProducts = JSON.parse(localStorage.getItem("checkoutProducts"));
            }
            $.fn.loadCart();
            $.fn.appendTabs(groupedProducts);
            $.fn.refreshAllAddBtnQuantity()
        }).fail(function(){
            var productsJson = "[{\"id\":1,\"pid\":1,\"title\":\"Paneer Tikka Roll\",\"catageory\":\"Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"paneertikkarolls.png\",\"desc\":\"Soft cottage cheese marinated and skewered in tandoor mixed with lots of vegetables and sauces served on a crispy tawa parantha\",\"prices\":[{\"id\":1,\"type\":\"Full\",\"desc\":\"\",\"price\":189}]},{\"id\":2,\"pid\":2,\"title\":\"Malai Chaap Roll\",\"catageory\":\"Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"malaichaaproll.png\",\"desc\":\"Soya chaap marinated and skewered in tandoor mixed with lots of vegetables, cream and sauces served on a crispy tawa parantha.\",\"prices\":[{\"id\":1,\"type\":\"Full\",\"desc\":\"\",\"price\":189}]},{\"id\":3,\"pid\":3,\"title\":\"Mutton Seek Roll\",\"catageory\":\"Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"muttonseekroll.png\",\"desc\":\"Chef's Special Soft tendered lamb seekh marinated and skewered in tandoor mixed with lots of vegetables and sauces served on a crispy tawa parantha\",\"prices\":[{\"id\":1,\"type\":\"Full\",\"desc\":\"\",\"price\":189}]},{\"id\":4,\"pid\":4,\"title\":\"Panner Tikka\",\"catageory\":\"Veg Tandoori\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"pannertikka.png\",\"desc\":\"Fresh cottage cheese, marinated in fresh yogurt, gram flour and chilies skewered and grilled in the earthen oven - Classic, Malai, Achari\",\"prices\":[{\"id\":1,\"type\":\"Full\",\"desc\":\"\",\"price\":299}]},{\"id\":5,\"pid\":5,\"title\":\"Mashroom Tikka\",\"catageory\":\"Veg Tandoori\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"mashroom.png\",\"desc\":\"Fresh Mashroom, fresh cottage cheese, marinated in fresh yogurt, gram flour and chilies skewered and grilled in the earthen oven - Classic, Malai, Achari\",\"prices\":[{\"id\":1,\"type\":\"Full\",\"desc\":\"\",\"price\":299}]},{\"id\":6,\"pid\":6,\"title\":\"Tandoori Chicken (With Butter)\",\"catageory\":\"Non Veg Barbeque\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"tandoorichicken.png\",\"desc\":\"Chicken marinated in an ajwain flavored mixture of yoghurt, red chili, turmeric and garam masala, skewered and roasted over Earthen oven\",\"prices\":[{\"id\":1,\"type\":\"Half\",\"desc\":\"\",\"price\":299},{\"id\":2,\"type\":\"Full\",\"desc\":\"\",\"price\":499}]},{\"id\":7,\"pid\":7,\"title\":\"Afghani Chicken (With Butter)\",\"catageory\":\"Non Veg Barbeque\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"afganichicken.png\",\"desc\":\"Chicken marinated in an cashew nut paste, black pepper and garam masala, skewered and roasted over Earthen oven\",\"prices\":[{\"id\":1,\"type\":\"Half\",\"desc\":\"\",\"price\":329},{\"id\":2,\"type\":\"Full\",\"desc\":\"\",\"price\":599}]}]"
            var productObjs = JSON.parse(productsJson)
            products = productObjs
            if (localStorage.getItem("checkoutProducts")) {
                checkoutProducts = JSON.parse(localStorage.getItem("checkoutProducts"));
            }
            var groupedProducts = $.fn.arrangeItemByCategory(productObjs);
            $.fn.loadCart();
            $.fn.appendTabs(groupedProducts);
            $.fn.refreshAllAddBtnQuantity()
        });

        $.fn.arrangeItemByCategory = function(allProducts) { 
           var groupedPrds = allProducts
            .reduce((hash, obj) => {
            if(obj["catageory"] === undefined) return hash; 
            return Object.assign(hash, { [obj["catageory"]]:( hash[obj["catageory"]] || [] ).concat(obj)})
            }, {})
            var groupData = Object.keys(groupedPrds).map(function (key) {
                return {"catageory": key, "items" : groupedPrds[key]};
            });

            groupData.splice(0, 0, {"catageory": "All Foods", "items" : allProducts});
            return groupData
        }

        /*Raise item Selection Model*/
        $('body').on('click','.addProductButton',function() {
            console.log("addProductButton")
            var product = $(this).attr('data-id')
            var productObj = JSON.parse(product)
            if (productObj.prices.length == 1) {
                $.fn.appendCartItem(productObj, productObj.prices[0]);
                $.fn.refreshAddBtnForItem(productObj);
                return
            }
            $("#myModal").modal('show');
            $.fn.loadModalHeader(productObj);
            $.fn.loadModalContent(productObj);
            $.fn.refreshAddBtnForItem(productObj);
        });

        $('body').on('click','.deleteProductBtn',function(){
            console.log("deleteProductBtn")
            var product = $(this).attr('data-id')
            var productObj = JSON.parse(product)
            var selectedItems = checkoutProducts.filter (function(obj) { return (obj.id == productObj.id); });
            if (productObj.prices.length == 1 || selectedItems.length == 1) {
                $.fn.deleteCartItem(productObj, productObj.prices[0]);
                $.fn.refreshAddBtnForItem(productObj);
                return
            } else {
                $("#deleteAlert").modal('show');
                $('.modal-title-detele').empty();
                $('.modal-title-detele').append(`${productObj.title}`)
                var colorClass = (productObj.type == 1) ? "green-color" : "red-color";
                $('#vegType-delete').addClass(colorClass)
            }
            
        });

        $('body').on('click','.model-delete-Item',function() {
            $("#deleteAlert").modal('hide');
        });

        $('body').on('click','.model-close-delete',function() {
            $("#deleteAlert").modal('hide');
        });

        $('body').on('click','.model-close',function() {
            $("#myModal").modal('hide');
        });

        $('body').on('click','.model-add-Item',function() {
            /* required Item Selection Logic*/
            var selectedproductId = $('input[name="flexCheck"]:checked').attr('data-id')
            var selectedPricesIds = $.map($('input[name="flexCheck"]:checked'), function(c) {return c.value; })
            var productObj = products.find((productItem) => { return (productItem.id == parseInt(selectedproductId)) });
            var productObjPrice = productObj.prices.find((priceItem) => { return (priceItem.id == parseInt(selectedPricesIds[0])) });

            if (productObjPrice != undefined) {
                $.fn.appendCartItem(productObj, productObjPrice)
                $.fn.refreshAddBtnForItem(productObj);
            }
            /* required Item Selection Logic till Here*/

            $("#myModal").modal('hide');
        });

        $.fn.appendCartItem = function(productItem, selectedPrice) {
            var lastChechoutProduct = checkoutProducts.find((checkoutProduct) => 
                { 
                    return (checkoutProduct.id === productItem.id && checkoutProduct.prices[0].price == selectedPrice.price)
                });

            var cartItem = jQuery.extend(true, {}, productItem);
            cartItem.prices = [];
            var clonePriceObj = jQuery.extend(true, {}, selectedPrice);
            

            if (lastChechoutProduct != undefined) {
                var lastPrices = lastChechoutProduct.prices[0];
                var lastQuantity = parseInt(lastPrices["quantity"]) || 0;
                lastQuantity += 1;
                lastChechoutProduct.prices[0]["quantity"] = lastQuantity;
            } else {
                cartItem.prices.push(selectedPrice);
                cartItem.prices[0]["quantity"] = 1;
                checkoutProducts.push(cartItem)    
            }
        }

         $.fn.deleteCartItem = function(productItem, selectedPrice) {
            var lastChechoutProduct = checkoutProducts.find((checkoutProduct) => 
                { 
                    return (checkoutProduct.id === productItem.id && checkoutProduct.prices[0].price == selectedPrice.price)
                });

            if (lastChechoutProduct != undefined) {
                var lastPrice = lastChechoutProduct.prices[0];
                var lastQuantity = parseInt(lastPrice["quantity"]) || 0;
                if (lastQuantity > 0) {
                    lastQuantity -= 1;
                    lastChechoutProduct.prices[0]["quantity"] = lastQuantity;
                } else {
                    checkoutProducts = checkoutProducts.filter (function(obj) {
                    return (obj.id !== lastChechoutProduct.id);
                    });
                }
            } 
        }

        $.fn.selectedItemsForProductId = function(productId) {        
            var filterednames = checkoutProducts.filter(function(obj) {
                return (obj.id === productId);
            });

            return filterednames;
        }

        $.fn.loadModalHeader = function(productObj) {
            $('.modal-title').empty();
            $('.modal-title').append(`${productObj.title}`)
            $('.modal-title').attr('data-id', `${productObj.id}`);

            var colorClass = (productObj.type == 1) ? "green-color" : "red-color";
            $('#vegType').addClass(colorClass)

            var minPrice = $.fn.minimumPrice(productObj);
            var maxPrice = $.fn.maximumPrice(productObj);
            var priceRange = (minPrice == maxPrice) ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`
            $('.price-tag').empty();
            $('.price-tag').append(`${priceRange}`)
        }

        $.fn.loadModalContent = function(productItem) {
            $('.item-Prices').empty();
            var minPrice = $.fn.minimumPrice(productItem);
            // var jsonString = JSON.stringify(tabObj)
            $.each( productItem.prices, function( index, priceObj ) {
                var checkedStr = (minPrice == priceObj.price) ? "checked" : ""
                var singleChoice = `<div class="form-check"> <input class="form-check-input" type="radio" value = "${priceObj.id}" data-id = "${productItem.id}" name="flexCheck" id="flexCheckId-${index}" ${checkedStr}> 
                <label class="form-check-label paragraph" for="flexCheckId-${index}"><small class = "paragraph">${priceObj.type}</small><small class = "ps-2">₹${priceObj.price}</small></label></div>`
                $('.item-Prices').append(`${singleChoice}`);
            });

            $('.extra-Items').empty();
            // $('.extra-Items').append(`${priceRange}`)
        }

        /*min Price*/
        $.fn.minimumPrice = function(productItem) {
             var priceObj = productItem.prices.reduce(function(prev, curr) {
                return prev.price < curr.price ? prev : curr;
             });

             return priceObj.price;
        }

        $.fn.maximumPrice = function(productItem) {
             var priceObj = productItem.prices.reduce(function(prev, curr) {
                return prev.price > curr.price ? prev : curr;
             });

             return priceObj.price;
        }

        $.fn.refreshPriceFloatCart = function() { 
            if (checkoutProducts.length <= 0) {
                $('.fixed-bottom-cart').hide();
            } else {
                $('.fixed-bottom-cart').show();
            }

            var totalPrice = 0;
            $.each(checkoutProducts, function( index, obj ) {
                totalPrice += obj.prices[0].price * obj.prices[0].quantity;
            });

            $(`.price-total`).empty();
            $(`.price-total`).append(`₹ ${totalPrice}`);
        }

         $.fn.refreshAllAddBtnQuantity = function() { 
            const uniqueCheckoutItemsIds = [...new Set(checkoutProducts.map(item => item.id))];
            $.each(uniqueCheckoutItemsIds, function( index, uniqueCheckoutItemId ) {
                var checkoutItemsOfThisId = $.fn.selectedItemsForProductId(uniqueCheckoutItemId)
                var totalQuatity = 0;
                $.each(checkoutItemsOfThisId, function( index, obj ) {
                    totalQuatity += (obj.prices[0].quantity != undefined) ? obj.prices[0].quantity : 1;
                });
                var btnTitle = (totalQuatity > 0) ? totalQuatity : "Add"
                $(`.addBtnTitle_${uniqueCheckoutItemId}`).empty();
                $(`.addBtnTitle_${uniqueCheckoutItemId}`).append(`${btnTitle}`)
            });

            $.fn.refreshPriceFloatCart();
        }

        $.fn.refreshAddBtnForItem = function(productItem) { 
            var checkoutItemsOfThisId = $.fn.selectedItemsForProductId(productItem.id)
            var totalQuatity = 0;
            $.each(checkoutItemsOfThisId, function( index, obj ) {
                totalQuatity += (obj.prices[0].quantity != undefined) ? obj.prices[0].quantity : 1;
            });
            var btnTitle = (totalQuatity > 0) ? totalQuatity : "Add"
            $(`.addBtnTitle_${productItem.id}`).empty();
            $(`.addBtnTitle_${productItem.id}`).append(`${btnTitle}`)
            $.fn.refreshPriceFloatCart();
            localStorage.setItem("checkoutProducts", JSON.stringify(checkoutProducts));
        }

        /* load Cart*/

        $.fn.totalCartItems = function() {
            var totalQuatity = 0;
            const uniqueCheckoutItemsIds = [...new Set(checkoutProducts.map(item => item.id))];
            $.each(uniqueCheckoutItemsIds, function( index, uniqueCheckoutItemId ) {
                var checkoutItemsOfThisId = $.fn.selectedItemsForProductId(uniqueCheckoutItemId)
                $.each(checkoutItemsOfThisId, function( index, obj ) {
                    totalQuatity += (obj.prices[0].quantity != undefined) ? obj.prices[0].quantity : 1;
                });
            });
            return totalQuatity;
        }

        $.fn.loadCart = function() { 
            $('.select-Items-Total').empty();
            var totalItems = $.fn.totalCartItems()
            $('.select-Items-Total').append(`${totalItems} ITEMS`);
        }

        /*Create Tabs*/
        $.fn.appendTabs = function(productsParam) { 
            console.log("Function Called ---> appendTabs")
            $.each( productsParam, function( index, tabItem) {
                var active = (index == 0) ? "active" : "";
                var tabId = 'tab-'+index;
                var catageoryName = tabItem.catageory;
                $('#menuCategory').append(`<li class=\"nav-item\"><a class=\"d-flex align-items-center text-start mx-3 ms-0 pb-3 ${active}\" data-bs-toggle=\"pill\" href=\"#${tabId}\"><i class=\"fa fa-coffee fa-2x text-primary\"></i><div class=\"ps-3\"><h6 class=\"mt-n1 mb-0\">${catageoryName}</h6></div></a></li>`);
                $.fn.appendTabContent(tabItem.items, tabId, active);
            });
        }

        /*Create Tabs Content*/
        $.fn.appendTabContent = function(tabItems, tabId, active) { 
            console.log("Function Called ---> appendTabContent ")
            var tabContainer = `<div id="${tabId}" class="tab-pane fade show p-0 ${active}"><div class="row g-4">`
            var innerItems = ``
            $.each( tabItems, function( index, tabObj ){
                 var priceToDisplay = $.fn.minimumPrice(tabObj);

                 var jsonString = JSON.stringify(tabObj)
                 var checkoutItemsOfThisId = $.fn.selectedItemsForProductId(tabObj.id)
                 var btnTitle = (checkoutItemsOfThisId.length > 0) ? checkoutItemsOfThisId.length : "Add"
                 var colorClass = (tabObj.type == 1) ? "green-color" : "red-color"
                 innerItems = innerItems + `<div class="col-lg-6"><div class="d-flex align-items-center"><img class="flex-shrink-0 img-fluid rounded" src="${tabObj.img}" alt="" style="width: 80px;">
                                        <div class="w-100 d-flex flex-column text-start border-bottom ps-4">
                                            <small class="d-flex justify-content-between">
                                                <span>
                                                <h5 class = "productName" style="max-width: 200px;"><i class="fas fa-dot-circle ${colorClass}" style = "padding-right: 5px"></i>${tabObj.title}</h5>
                                                <small style = "font-family: Nutino; font-size: 15px">${tabObj.desc}</small>
                                                </span>
                                                <span>
                                                <h6 class="text-primary">₹${priceToDisplay}</h6>
                                                <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                                  <div class="btn-group" role="group" aria-label="First group">
                                                    <button type="button" class="btn btn-outline-secondary deleteProductBtn" data-id='${jsonString}'>-</button>
                                                    <button type="button" class="btn btn-outline-secondary addProductButton addBtnTitle_${tabObj.id}" style = "min-width:50px" data-id='${jsonString}'>${btnTitle}</button>
                                                    <button type="button" class="btn btn-outline-secondary addProductButton" data-id='${jsonString}'>+</button>
                                                </div>
                                                </div>
                                                </span>
                                            </small>
                                        </div>
                                    </div>
                                </div>`
            });

            tabContainer = tabContainer + innerItems + `</div></div>`
            $('#menuContent').append(tabContainer);
        }
             
    });
    })(jQuery);
