(function ($) {
    "use strict";
    var $products;
    $(document).ready(function () {
        console.log("product json called")
        $.getJSON("products/ctjProducts.json", function(productObjs){
            var groupedProducts = $.fn.arrangeItemByCategory(productObjs);
            $.fn.appendTabs(groupedProducts);
        }).fail(function(){
            var products = "[{\"id\":1,\"pid\":1,\"title\":\"Paneer Tikka Roll\",\"catageory\":\"Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"paneertikkarolls.png\",\"desc\":\"Soft cottage cheese marinated and skewered in tandoor mixed with lots of vegetables and sauces served on a crispy tawa parantha\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":189}]},{\"id\":2,\"pid\":2,\"title\":\"Malai Chaap Roll\",\"catageory\":\"Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"malaichaaproll.png\",\"desc\":\"Soya chaap marinated and skewered in tandoor mixed with lots of vegetables, cream and sauces served on a crispy tawa parantha.\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":189}]},{\"id\":3,\"pid\":3,\"title\":\"Mutton Seek Roll\",\"catageory\":\"Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"muttonseekroll.png\",\"desc\":\"[Chef's Special] Soft tendered lamb seekh marinated and skewered in tandoor mixed with lots of vegetables and sauces served on a crispy tawa parantha\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":189}]},{\"id\":4,\"pid\":4,\"title\":\"Panner Tikka\",\"catageory\":\"Veg Tandoori\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"pannertikka.png\",\"desc\":\"Fresh cottage cheese, marinated in fresh yogurt, gram flour and chilies skewered and grilled in the earthen oven - Classic, Malai, Achari\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":299}]},{\"id\":5,\"pid\":5,\"title\":\"Mashroom Tikka\",\"catageory\":\"Veg Tandoori\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"mashroom.png\",\"desc\":\"Fresh Mashroom, fresh cottage cheese, marinated in fresh yogurt, gram flour and chilies skewered and grilled in the earthen oven - Classic, Malai, Achari\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":299}]},{\"id\":6,\"pid\":6,\"title\":\"Tandoori Chicken (With Butter)\",\"catageory\":\"Non Veg Barbeque\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"tandoorichicken.png\",\"desc\":\"Chicken marinated in an ajwain flavored mixture of yoghurt, red chili, turmeric and garam masala, skewered and roasted over Earthen oven\",\"prices\":[{\"id\":1,\"type\":\"half\",\"desc\":\"\",\"price\":299},{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":499}]},{\"id\":7,\"pid\":7,\"title\":\"Afghani Chicken (With Butter)\",\"catageory\":\"Non Veg Barbeque\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"afganichicken.png\",\"desc\":\"Chicken marinated in an cashew nut paste, black pepper and garam masala, skewered and roasted over Earthen oven\",\"prices\":[{\"id\":1,\"type\":\"half\",\"desc\":\"\",\"price\":329},{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":599}]}]"
            var productObjs = JSON.parse(products)
            var groupedProducts = $.fn.arrangeItemByCategory(productObjs);
            $.fn.appendTabs(groupedProducts);
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
                 var priceToDisplay = tabObj.prices.filter(v => v.type === "plate");
                 if (priceToDisplay == 'undefined' || priceToDisplay.length <= 0) {
                    priceToDisplay = tabObj.prices.filter(v => v.type === "half");
                 } 
                 if (priceToDisplay == 'undefined' || priceToDisplay.length <= 0) {
                    priceToDisplay = tabObj.prices.filter(v => v.type === "full");
                 }

                 innerItems = innerItems + `<div class="col-lg-6"><div class="d-flex align-items-center"><img class="flex-shrink-0 img-fluid rounded" src="${tabObj.img}" alt="" style="width: 80px;">
                                        <div class="w-100 d-flex flex-column text-start border-bottom ps-4">
                                            <small class="d-flex justify-content-between">
                                                <span>
                                                <h5 class = "productName" style="max-width: 200px;">${tabObj.title}</h5>
                                                <small style = "font-family: Nutino; font-size: 15px">${tabObj.desc}</small>
                                                </span>
                                                <span>
                                                <h6 class="text-primary">₹${tabObj.prices[0].price}</h6>
                                                <a href="#" class="addButton">Add</a>
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
