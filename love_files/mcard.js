var mobileIndex = {
        
    init : function(){
        this.setKakaotalkLink();
        this.events();
//        this.setSection();
        this.setSwiper();
        this.thumbnail();
        
        var _resize = function (){
        	var _width = $('#top').width();
        	$('.addition, #telephone').css("font-size", ( Math.ceil(_width * 100 / 720) / 100 ) * 10);
        }

        _resize();

        $(window).resize(function(){
        	//_resize();
        });
        
        $('#loading').fadeOut(500);

        if ($('.lazyload').length > 0) {
            $(".lazyload").lazyload();
        }
    },
    
    events : function(){
        var self = this;
        $('#kakaonavi').bind('click', function(){
            self.navi();
        });
        
        $('body').on('click', '.save-action', function (e) {
            e.preventDefault();
            
            var form = $(this).parents('form');
            
            form.submit();
        });
        
        $('body').on('click', '.save-ajax', function (e) {
            e.preventDefault();
            
            var self = this;
            
            var form = $(this).parents('form');
            var bool_pass = mobileIndex.input_validate(form);
            if (bool_pass == false) {
                return false;
            }
            var param = $(form).serialize();

            $.ajax({
                type: "POST",
                url: form.attr('action'),
                data: param,
                dataType:'html',
                success: function( response ) {
                    if ($(self).hasClass('comment') ){
                        $('.comment-list').append(response);
                        $('html, body').animate({scrollTop : $('.reply_wrap:last').offset().top});
                    } else {
                        var wrap = $(self).parents('.reply_wrap').find('.comment-child');
                        wrap.append(response);

                        $('.comment-reply-wrap').hide();
                    }
                    
                    mobileIndex.clearInput();
                }
            });
        });

        $('.remove-ajax').bind('click', function (e) {
            e.preventDefault();
            
            var self = this;

            var form = $(self).parents('form');
            var bool_pass = mobileIndex.input_validate(form);
            if (bool_pass == false) {
                return false;
            } else {
                $(form).find('input[name="type"]').val('remove');    
            }

            var param = $(form).serialize();
            $.ajax({
                type: "POST",
                url: form.attr('action'),
                data: param,
                dataType:'json',
                success: function( response ) {
                    if (response.passwd != 1){
                        alert('??????????????? ????????? ?????????.');
                        
                        return false;
                    }
                    
                    var _idx    = $('#myModal [name="id"]').val();
                    var _wrap   = $('.edit-wrap:has(button[data="'+_idx+'"]):last');
                    
                    if ($(_wrap).hasClass('show')){
                        $('.reply_wrap:has(button[data="'+_idx+'"]):last').remove();
                        
                    } else {
                        $(_wrap).remove();
                    }

                    $('.close[data-dismiss="modal"]').trigger('click');
                    mobileIndex.clearInput();
                }
            });
        });
        
        $('.update-ajax').bind('click', function(e){
            e.preventDefault();
            
            var self = this;
            var form = $(self).parents('form');
            var bool_pass = mobileIndex.input_validate(form);
            if (bool_pass == false) {
                return false;
            } else {
                $(form).find('input[name="type"]').val('update');    
            }

            var param = $(form).serialize();
            $.ajax({
                type: "POST",
                url: form.attr('action'),
                data: param,
                dataType:'json',
                success: function( response ) {
                    if (response.passwd != 1){
                        alert('??????????????? ????????? ?????????.');
                        return false;
                    }
                    
                    var _idx    = $('#myModal [name="id"]').val();
                    var title   = $.trim($('#myModal [name="name"]').val());
                    var comment = $.trim($('#myModal [name="contents"]').val());

                    var _wrap   = $('.edit-wrap:has(button[data="'+_idx+'"]):last');

                    $(_wrap).find('.title:eq(0)').text(title);
                    $(_wrap).find('.comment:eq(0)').text(comment);
                    
                    $('.close[data-dismiss="modal"]').trigger('click');
                    
                    mobileIndex.clearInput();
                }
            });
        });
        
        
        $('body').on('click', '.show_reply', function(){
            var parent = $(this).parents('.reply_wrap');
            $('.comment-reply-wrap').hide();
            $(parent).find('.comment-reply-wrap').show();
        });
        
        $('body').on('click', '.comment-update-btn', function(e){
            var parent = $(this).parents('.edit-wrap').eq(0);

            var title   = $.trim($(parent).find('.title:eq(0)').text());
            var comment = $.trim($(parent).find('.comment:eq(0)').text());
            
            comment = comment.replace(/<br>/, "\n");

            $('#myModal [name="id"]').val($(this).attr('data'));
            $('#myModal [name="name"]').val($(parent).find('.title:eq(0)').text());
            $('#myModal [name="contents"]').val($(parent).find('.comment:eq(0)').text());
            $('#myModal [name="passwd"]').val('');
        });
        
        $('.kakao_navi').bind('click', function(){
            mobileIndex.kakaoNavi(map_info.map_title, map_info.map_long, map_info.map_lat);
        });
        
        $(".carousel").swipe({

            swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

              if (direction == 'left') $(this).carousel('next');
              if (direction == 'right') $(this).carousel('prev');

            },
            allowPageScroll:"vertical"

          });

        $('.toss_send_groom').bind('click', function() {
            var key = $(this).attr('key');
            var token = $(this).attr('token');
            
            if (key){
            	mobileIndex.postToss("/mcard/toss/"+key, {'type' : 'groom', '_token' : token});	
            }
        });
        
        $('.toss_send_bride').bind('click', function() {
            var key = $(this).attr('key');
            var token = $(this).attr('token');
            
            if (key){
            	mobileIndex.postToss("/mcard/toss/"+key, {'type' : 'bride', '_token' : token});	
            }
        });
        
    },
    
    setSection : function(_list) {
        var top  = $('#top');
        var gre  = $('#gretting');
        var d    = $('#direction');
        var gall = $('#gallary');
        var t    = $('#toss');
        var g    = $('#guestbook');
        var f    = $('#footer');

        var list = _list.split('#');
        list.shift();
        list = '['+list.toString()+']';
      
        if(_list != null) {
            $('.col-md-6 #page-top').append(eval(list));
        }
    },
    
    postToss : function(url, param) {
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            dataType:'json',
            success: function( response ) {
                $('.post_toss_form').attr('action', response.url);

                $('.post_toss_form input[name="bankCode"]').val(response.bankCode);
                $('.post_toss_form input[name="accountNo"]').val(response.accountNo);
                
                $('.post_toss_form').submit();
            }
        });
    },
    
    clearInput : function(){
        $('[name="name"], [name="contents"], [name="passwd"]').val('');
    },
    
    input_validate : function(_form){
        var inputs = $(_form).find('input, textarea');
        
        var len = inputs.size();
        
        for (var i = 0; i < len; i++) {
            if ( inputs.eq(i).val() == '' ) {
                
                var message = '????????? ????????? ?????????.';
                if (inputs.eq(i).attr('placeholder') != undefined ) {
                    message = inputs.eq(i).attr('placeholder');
                }
                
                alert(message);
                
                return false;
            }
        }
        
        return true;
    },
        
    setKakaotalkLink : function(){
        
        var _href = location.href.toString();
        
        _href = _href.replace(/www\./, '');
        
        // ????????? ?????? JavaScript ?????? ????????? ?????????.
        Kakao.init('f2f15d3b34f8a4552ebe75cbdf8e5f78');
        
        var _title = $('meta[property="og:title"]').attr('content'); // ????????? ????????? ?????????
        var _desc  = $('meta[property="og:description"]').attr('content'); // ??????
        var _date  = $('meta[property="og:desc_date"]').attr('content'); // ????????????
        var _place = $('meta[property="og:desc_place"]').attr('content'); // ????????????
        var _image = $('meta[property="og:image"]').attr('content'); // ?????????
        var _address = $('meta[property="og:desc_address"]').attr('content'); // ????????? ????????????
        
        // ??????????????? ????????? ???????????????. ?????? ????????? ???????????? ?????????.
        Kakao.Link.createDefaultButton({
            container: '#kakao-link-btn', // ?????? id
            objectType: 'location', // ???????????? ?????? ??????
            content: {
	          	title: _title+"\n"+_date, // ?????????
	          	description: _place, // ????????????
	          	imageUrl: _image, // ????????? 
	          	link: {
	          	    mobileWebUrl: _href, // ????????? ?????? ??? location.href
	          	    webUrl: _href  // ??? ?????? ??? location.href
	          	},
	          	imageWidth  : 450, // ??????????????? 
	          	imageHeight : 800 // ????????? ??????
            },
            address : _address // container ??? location ?????? ???????????? ????????? ??? ??? ?????? (ex. ?????? ????????? ????????? ?????????47????????? 47)
        });
    },
    
    kakaoNavi : function (_name, _x, _y) {
        Kakao.Navi.start({
            name: _name,
            x: parseFloat(_x),
            y: parseFloat(_y),
            coordType: 'wgs84'
        });
    },
    
    setSwiper : function() {
        var swiper = new Swiper('.slide_gallgery .swiper-container', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
            spaceBetween: 10,
        });
    },
    
    thumbnail : function(){
        var $thumb = $('.thumb');
        var thumb_w = $thumb.width();
        
        $thumb.height(thumb_w);
        
        $thumb.children('a').on('click', function(){
            var index = $(this).parent().index();
            
            $('.thumb_zoom').removeClass('hidden');
            
            var swiper = new Swiper('.thumb_swiper', {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  },
                spaceBetween: 10,
                initialSlide : index
            });
            
            if(index == 0){
                $('.swiper-wrapper').css('transform', 'translate3d(0px, 0px, 0px)');
            }
            
            return false;
        });
        
        $('.swiper_close').on('click', function(){
            $('.thumb_zoom').addClass('hidden');
        });
    }
    
};



$(document).ready(function(){
    mobileIndex.init();
});
