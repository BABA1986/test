(function ($) {
    "use strict";
    var $products;
    $(document).ready(function () {
        console.log("product json called")
        $.getJSON("products/ctjProducts.json", function(productObjs){
            var groupedProducts = productObjs.reduce(function(result, current) {
                result[current.catageory] = result[current.catageory] || [];
                result[current.catageory].push(current);
                return result;
            }, {})
            $.fn.appendTabs(groupedProducts);
        }).fail(function(){
            var products = "[{\"id\":1,\"pid\":1,\"title\":\"Paneer Tikka Roll\",\"catageory\":\"Chawla's Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"paneertikkarolls.png\",\"desc\":\"\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":189}]},{\"id\":2,\"pid\":2,\"title\":\"Malai Chaap Roll\",\"catageory\":\"Chawla's Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"malaichaaproll.png\",\"desc\":\"\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":189}]},{\"id\":3,\"pid\":3,\"title\":\"Mutton Seek Roll\",\"catageory\":\"Chawla's Rolls\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"muttonseekroll.png\",\"desc\":\"\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":189}]},{\"id\":4,\"pid\":4,\"title\":\"Panner Tikka\",\"catageory\":\"Veg Tandoori\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"pannertikka.png\",\"desc\":\"\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":299}]},{\"id\":5,\"pid\":5,\"title\":\"Mashroom Tikka\",\"catageory\":\"Veg Tandoori\",\"catageorySubtitle\":\"Snacks\",\"type\":1,\"img\":\"mashroom.png\",\"desc\":\"\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":299}]},{\"id\":6,\"pid\":6,\"title\":\"Tandoori Chicken (With Butter)\",\"catageory\":\"NonVeg Barbeque\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"tandoorichicken.png\",\"desc\":\"\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":299},{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":499}]},{\"id\":7,\"pid\":7,\"title\":\"Afghani Chicken (With Butter)\",\"catageory\":\"NonVeg Barbeque\",\"catageorySubtitle\":\"Snacks\",\"type\":0,\"img\":\"afganichicken.png\",\"desc\":\"\",\"prices\":[{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":329},{\"id\":1,\"type\":\"full\",\"desc\":\"\",\"price\":599}]}]"
            var productObjs = JSON.parse(products)
            var groupedProducts = productObjs.reduce(function(result, current) {
                result[current.catageory] = result[current.catageory] || [];
                result[current.catageory].push(current);
                return result;
            }, {})
            $.fn.appendTabs(groupedProducts);
        });

        $.fn.appendTabs = function(productsParam) { 
            console.log("Function Called ---> appendTabs")
            var index = 0;
            Object.entries(productsParam).forEach(([key, value]) => {
                console.log(key, value);
                var active = (index == 0) ? "active" : ""
                var tabId = 'tab-'+index
                $('#menuCategory').append(`<li class=\"nav-item\"><a class=\"d-flex align-items-center text-start mx-3 ms-0 pb-3 ${active}\" data-bs-toggle=\"pill\" href=\"#${tabId}\"><i class=\"fa fa-coffee fa-2x text-primary\"></i><div class=\"ps-3\"><small class=\"text-body\">${value[0].catageorySubtitle}</small><h6 class=\"mt-n1 mb-0\">${key}</h6></div></a></li>`);
                index += 1;
                $.fn.appendTabContent(value, tabId, active);
            });
        }

        $.fn.appendTabContent = function(tabItems, tabId, active) { 
            console.log("Function Called ---> appendTabContent ")
            var tabContainer = `<div id="${tabId}" class="tab-pane fade show p-0 ${active}"><div class="row g-4">`
            var innerItems = ``
            $.each( tabItems, function( index, tabObj ){
                 innerItems = innerItems + `<div class="col-lg-6"><div class="d-flex align-items-center"><img class="flex-shrink-0 img-fluid rounded" src="${tabObj.img}" alt="" style="width: 80px;">
                                        <div class="w-100 d-flex flex-column text-start ps-4">
                                            <h5 class="d-flex justify-content-between border-bottom pb-2">
                                                <span>${tabObj.title}</span>
                                                <span class="text-primary">${tabObj.prices[0].price}</span>
                                            </h5>
                                            <small class="fst-italic">Ipsum ipsum clita erat amet dolor justo diam</small>
                                        </div>
                                    </div>
                                </div>`
            });
            tabContainer = tabContainer + innerItems + `</div></div>`
            $('#menuContent').append(tabContainer);
        }
             
    });
    })(jQuery);
