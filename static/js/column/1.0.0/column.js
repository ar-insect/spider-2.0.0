

;(function($) {
    $.fn.launch = function(options) {
        // default options
        if (false === $.isPlainObject(options)) options = {};
        var def = {
            direction: 'horizontal',
            position: 'bottom',
            transparence: '1.0',
            isShow: true
        };
        var defaultOption = $.extend({}, def, options);
        //console.log(defaultOption);
        if ('vertical' === defaultOption.direction) {
            this.addClass('vertical');
        }
        switch (defaultOption.position) {
            case 'bottom':
                var tby = parseInt($('body').height() - this.height());
                this.css('top', tby);
                break;
            case 'top':
                this.css('top', '0px');
                break;
            case 'left':
                this.css('left', '0px');
                break;
            case 'right':
                this.css('right', '0px');
                break;
        }
        this.css('opacity', defaultOption.transparence);

    };

    $(document).ready(function() {
        /*
         $(window).scroll(function() {
         // 重点就是下面这一条语句的实现
         $("#toolbar").css({
         top: window.innerHeight + window.scrollY - $("#toolbar").height()
         });
         });
         */
        var timeout = false;
        $(document).on('touchstart', function() {
            $("#toolbar").hide();
        });
        $(document).on('touchmove', function() {
            $("#toolbar").hide();
        });
        $(document).on('scrollstop', function() {
            console.log("结束滚动！");
        });
        $(document).on('touchend', function() {
            //$("#toolbar").show();
            //if (timeout){clearTimeout(timeout);}
            $("#toolbar").show().css({
                top: window.innerHeight + window.scrollY - $("#toolbar").height()
            });
        });

        $('#toolbar').launch({

        });



    });


})(Zepto);

