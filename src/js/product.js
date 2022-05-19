(function ($) {
    "use strict";
    var $products;
    $(document).ready(function () {
        console.log("product json called")
        $.getJSON("products/ctjProducts.json", function(data){
            console.log(data); // Prints: Harry
            var unoqueByCategory = [...new Map(data.map(item => [item[key], item])).values()];

            // <li class="nav-item">
            //                 <a class="d-flex align-items-center text-start mx-3 ms-0 pb-3 active" data-bs-toggle="pill" href="#tab-1">
            //                     <i class="fa fa-coffee fa-2x text-primary"></i>
            //                     <div class="ps-3">
            //                         <small class="text-body">Popular</small>
            //                         <h6 class="mt-n1 mb-0">Breakfast</h6>
            //                     </div>
            //                 </a>
            //             </li>

        }).fail(function(){
            console.log("An error has occurred.");
        });
    });
    })(jQuery);
