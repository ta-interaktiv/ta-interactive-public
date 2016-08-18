module.exports = (function() {

    // Format Number functions
    function ReplaceNumberWithCommas(num) {
        //Seperates the components of the number

        if(typeof num === 'undefined' || num == null){
            num = 0;
        }

        var components = num.toString().split(".");
        //Comma-fies the first part
        components[0] = components[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //Combines the two sections
        return components.join(".");
    }


    // SHARE COUNTS FUNCTIONS 

    // Facebook Shares Count
    function facebookShares(URL,$container) {

        var setCount = function( counts ){
            var counts = typeof counts === 'number' ? counts : 0;
            $container.text( ReplaceNumberWithCommas(counts) ).attr('data-count',counts);
        }
        $.getJSON('http://graph.facebook.com/?id=' + URL, function (data) {
            setCount(data.shares || 0);
        })
        .promise().fail(setCount)

    }

    // Twitter Shares Count
    function twitterShares(URL,$container) {

        $.getJSON('http://cdn.api.twitter.com/1/urls/count.json?url=' + URL + '&callback=?', function (data) {
            var counts = data.count || 0;
            $container.text( ReplaceNumberWithCommas(counts) ).attr('data-count',counts);
        });

    }

    // LinkIn Shares Count
    function linkdInShares(URL,$container) {

        $.getJSON('http://www.linkedin.com/countserv/count/share?url=' + URL + '&callback=?', function (data) {
            var counts = data.count || 0;
            $container.text( ReplaceNumberWithCommas(counts) ).attr('data-count',counts);
        });

    }

    // Check if all JSON calls are finished or not

    function checkJSON_getSum( $containers, $container, callback ) {
        

        var countsLoaded = true; 
        var totalShares = 0, count;   
        $containers.each(function(){
            count = $(this).data('count');
            if( typeof count === 'undefined' ){
                countsLoaded = false;
            }else if(countsLoaded){
                totalShares += count;
            }
        });
        if (countsLoaded) {            
            $container.text( ReplaceNumberWithCommas(totalShares) ).attr('data-count',totalShares);
            if( typeof callback === 'function' ){
                callback.call(this,totalShares)
            }
        }
        // Check for JSON again!
        else {
            setTimeout(function () {
               checkJSON_getSum($containers, $container, callback);
            }, 200);
        }

    }

    return {

        count: function(URL, $fb, $tw, $total, callback) {

            // console.log(URL);
            // linkdInShares(URL);
            if($fb) facebookShares(URL, $fb);
            if($tw) twitterShares(URL, $tw);
            
            if($total){
                $counters = $fb.add($tw)
                checkJSON_getSum( $counters, $total, callback);
            }
            
        }
    }

})();