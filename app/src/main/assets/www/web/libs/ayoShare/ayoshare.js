/*********************************************************************
 * #### jQuery Awesome Sosmed Share Button / AyoShare.js v17 ####
 * Coded by Ican Bachors 2014.
 * https://github.com/bachors/jQuery-Awesome-Sosmed-Share-Button
 * Updates will be posted to this site.
 *********************************************************************/
$.fn.ayoshare = function(options) {
    var defaults = {
		counter: false,
        content:"",
		button: {
			google: false,
			stumbleupon: false,
			facebook: false,
			linkedin: false,
			pinterest: false,
			bufferapp: false,
			reddit: false,
			vk: false,
			pocket: false,
			twitter: false,
			flipboard: false,
			digg: false,
			email: false,
			whatsapp: false,
			telegram: false,
			viber: false,
			line: false,
			bbm: false,
			sms: false
		}
    };
    var settings = $.extend({}, defaults, options);

    var ua = navigator.userAgent;
    $(this).each(function(i, d) {
        var b = $(this).data('ayoshare'),
            html = '';
        if(!b)
            b = settings.content;
        var c = ($(this).attr('id') != null && $(this).attr('id') != undefined ? '#' + $(this).attr('id') : '.' + $(this).attr('class'));
        if (settings.button.facebook) {
			html += '<div class="facebook button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'facebook\');" title="Facebook">';
			if(settings.counter){
				html += '<i class="icon"><i class="fa fa-facebook"></i></i><div class="counter"><p><i class="fa fa-spinner fa-spin"></i></p></div></a></div>';
				ayo_facebook(b, c, i);
			}else{
				html += '<i class="mobile"><i class="fa fa-facebook"></i></i></a></div>';
			}
        }
        if (settings.button.reddit) {
			html += '<div class="reddit button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'reddit\');" title="Reddit">';
			if(settings.counter){
				html += '<i class="icon"><i class="fa fa-reddit"></i></i><div class="counter"><p><i class="fa fa-spinner fa-spin"></i></p></div></a></div>';
				ayo_reddit(b, c, i);
			}else{
				html += '<i class="mobile"><i class="fa fa-reddit"></i></i></a></div>';
			}
        }
        if (settings.button.linkedin) {
			html += '<div class="linkedin button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'linkedin\');" title="Linkedin">';
			if(settings.counter){
				html += '<i class="icon"><i class="fa fa-linkedin"></i></i><div class="counter"><p><i class="fa fa-spinner fa-spin"></i></p></div></a></div>';
				ayo_linkedin(b, c, i);
			}else{
				html += '<i class="mobile"><i class="fa fa-linkedin"></i></i></a></div>';
			}
        }
        if (settings.button.pinterest) {
			html += '<div class="pinterest button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'pinterest\');" title="Pinterest">';
			if(settings.counter){
				html += '<i class="icon"><i class="fa fa-pinterest"></i></i><div class="counter"><p><i class="fa fa-spinner fa-spin"></i></p></div></a></div>';
				ayo_pinterest(b, c, i);
			}else{
				html += '<i class="mobile"><i class="fa fa-pinterest"></i></i></a></div>';
			}
        }
        if (settings.button.stumbleupon) {
			html += '<div class="stumbleupon button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'stumbleupon\');" title="Stumbleupon">';
			if(settings.counter){
				html += '<i class="icon"><i class="fa fa-stumbleupon"></i></i><div class="counter"><p><i class="fa fa-spinner fa-spin"></i></p></div></a></div>';
				ayo_stumbleupon(b, c, i);
			}else{
				html += '<i class="mobile"><i class="fa fa-stumbleupon"></i></i></a></div>';
			}
        }
        if (settings.button.bufferapp) {
			html += '<div class="bufferapp button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'bufferapp\');" title="Bufferapp">';
			if(settings.counter){
				html += '<i class="icon"><i class="fa fa-bufferapp"></i></i><div class="counter"><p><i class="fa fa-spinner fa-spin"></i></p></div></a></div>';
				ayo_bufferapp(b, c, i);
			}else{
				html += '<i class="mobile"><i class="fa fa-bufferapp"></i></i></a></div>';
			}
        }
        if (settings.button.vk) {
			html += '<div class="vk button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'vk\');" title="VK">';
			if(settings.counter){
				html += '<i class="icon"><i class="fa fa-vk"></i></i><div class="counter"><p><i class="fa fa-spinner fa-spin"></i></p></div></a></div>';
				ayo_vk(b, c, i);
			}else{
				html += '<i class="mobile"><i class="fa fa-vk"></i></i></a></div>';
			}
        }
        if (settings.button.pocket) {
			html += '<div class="pocket button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'pocket\');" title="Pocket">';
			if(settings.counter){
				html += '<i class="icon"><i class="fa fa-get-pocket"></i></i><div class="counter"><p><i class="fa fa-spinner fa-spin"></i></p></div></a></div>';
				ayo_pocket(b, c, i);
			}else{
				html += '<i class="mobile"><i class="fa fa-get-pocket"></i></i></a></div>';
			}
        }
        if (settings.button.google) {
            html += '<div class="google button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'google\');" title="Google+">';
            html += '<i class="mobile"><i class="fa fa-google-plus"></i></i></a></div>';
        }
        if (settings.button.twitter) {
            html += '<div class="twitter button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'twitter\');" title="Twitter">';
            html += '<i class="mobile"><i class="fa fa-twitter"></i></i></a></div>';
        }
        if (settings.button.flipboard) {
            html += '<div class="flipboard button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'flipboard\');" title="Flipboard">';
            html += '<i class="mobile"><i class="fa fa-flipboard"></i></i></a></div>'
        }
        if (settings.button.digg) {
            html += '<div class="digg button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'digg\');" title="Digg">';
            html += '<i class="mobile"><i class="fa fa-digg"></i></i></a></div>'
        }
        if (settings.button.email) {
            html += '<div class="email button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'email\');" title="Email">';
            html += '<i class="mobile"><i class="fa fa-envelope"></i></i></a></div>';
        }
		if(ua.match(/mobile/i)){
			if (settings.button.whatsapp) {
				html += '<div class="whatsapp button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'whatsapp\');" title="Whatsapp">';
				html += '<i class="mobile"><i class="fa fa-whatsapp"></i></i></a></div>';
			}
			if (settings.button.telegram) {
				html += '<div class="telegram button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'telegram\');" title="Telegram">';
				html += '<i class="mobile"><i class="fa fa-telegram"></i></i></a></div>';
			}
			if (settings.button.viber) {
				html += '<div class="viber button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'viber\');" title="Viber">';
				html += '<i class="mobile"><i class="fa fa-volume-control-phone"></i></i></a></div>';
			}
			if (settings.button.line) {
				html += '<div class="line button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'line\');" title="Line">';
				html += '<i class="mobile"><i class="fa fa-line"></i></i></a></div>';
			}
			if (settings.button.bbm) {
				html += '<div class="bbm button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'bbm\');" title="BBM">';
				html += '<i class="mobile"><i class="fa fa-bbm"></i></i></a></div>';
			}
			if (settings.button.sms) {
				html += '<div class="sms button' + (settings.counter ? '' : ' small') + '"><a onclick="ayo_share_og(\'' + b + '\', \'sms\');" title="SMS">';
				html += '<i class="mobile"><i class="fa fa-comment"></i></i></a></div>';
			}
		}
        $(this).html('<div class="ayoshare">' + html + '</div>');
    });

    function ayo_bufferapp(c, d, z) {
        $.ajax({
            url: 'https://api.bufferapp.com/1/links/shares.json?url=' + encodeURIComponent(c),
            crossDomain: true,
            dataType: 'jsonp'
        }).done(function(a) {
            var b = ayo_num(a.shares);
            $(d + ':eq(' + z + ') .ayoshare .bufferapp .counter p').html(b);
        }).fail(function() {
            $(d + ':eq(' + z + ') .ayoshare .bufferapp .counter p').html(0);

        })
    }

    function ayo_facebook(c, d, z) {
        $.ajax({
            url: 'https://graph.facebook.com/v2.7/?id=' + encodeURIComponent(c) + '&access_token=443213172472393|l2IEt1tuyYta_278fR5NAg8V1jI',
            crossDomain: true,
            dataType: 'jsonp'
        }).done(function(a) {
            var b = 0;
            if(a.share)
            b = ayo_num(a.share.share_count);
            $(d + ':eq(' + z + ') .ayoshare .facebook .counter p').html(b);
        }).fail(function() {
            $(d + ':eq(' + z + ') .ayoshare .facebook .counter p').html(0);

        })
    }

    function ayo_linkedin(c, d, z) {
        $.ajax({
            url: 'https://www.linkedin.com/countserv/count/share?url=' + encodeURIComponent(c) + '&callback=?',
            crossDomain: true,
            dataType: 'json'
        }).done(function(a) {
            var b = ayo_num(a.count);
            $(d + ':eq(' + z + ') .ayoshare .linkedin .counter p').html(b);
        }).fail(function() {
            $(d + ':eq(' + z + ') .ayoshare .linkedin .counter p').html(0);

        })
    }

    function ayo_pinterest(c, d, z) {
        $.ajax({
            url: 'https://api.pinterest.com/v1/urls/count.json?url=' + encodeURIComponent(c) + '&callback=?',
            crossDomain: true,
            dataType: 'json'
        }).done(function(a) {
            var b = ayo_num(a.count);
            $(d + ':eq(' + z + ') .ayoshare .pinterest .counter p').html(b);
        }).fail(function() {
            $(d + ':eq(' + z + ') .ayoshare .pinterest .counter p').html(0);

        })
    }

    function ayo_vk(f, g, z) {
        $.ajax({
            type: "GET",
            dataType: "xml",
            url: "https://query.yahooapis.com/v1/public/yql",
            data: {
                q: "SELECT content FROM data.headers WHERE url=\"http://vk.com/share.php?act=count&index=1&url=" + encodeURIComponent(f) + "\" and ua=\"#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36\"",
                format: "xml",
                env: "store://datatables.org/alltableswithkeys"
            }
        }).done(function(a) {
            var b = $(a).find("content").text();
            var c = b.split(",");
            var d = c[1].split(")");
            var e = ayo_num(d[0]);
            $(g + ':eq(' + z + ') .ayoshare .vk .counter p').html(e);
        }).fail(function() {
            $(g + ':eq(' + z + ') .ayoshare .vk .counter p').html(0);

        })
    }

    function ayo_reddit(d, e, z) {
        $.ajax({
            url: 'https://www.reddit.com/api/info.json?url=' + encodeURIComponent(d),
            crossDomain: true,
            dataType: 'json'
        }).done(function(a) {
            var b = (a.data.children != null) ? a.data.children.length : 0;
            var c = (b == 25) ? 25 + '+' : b;
            $(e + ':eq(' + z + ') .ayoshare .reddit .counter p').html(c);
        }).fail(function() {
            $(e + ':eq(' + z + ') .ayoshare .reddit .counter p').html(0);

        })
    }

    function ayo_stumbleupon(e, f, z) {
        $.ajax({
            type: "GET",
            dataType: "xml",
            url: "https://query.yahooapis.com/v1/public/yql",
            data: {
                q: "SELECT content FROM data.headers WHERE url=\"http://www.stumbleupon.com/services/1.01/badge.getinfo?url=" + encodeURIComponent(e) + "\" and ua=\"#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36\"",
                format: "xml",
                env: "store://datatables.org/alltableswithkeys"
            }
        }).done(function(a) {
            var b = $(a).find("content").text();
            var c = b.match(/views\":([0-9]+),/i);
            var d = (c !== null) ? ayo_num(c[1]) : 0;
            $(f + ':eq(' + z + ') .ayoshare .stumbleupon .counter p').html(d);
        }).fail(function() {
            $(f + ':eq(' + z + ') .ayoshare .stumbleupon .counter p').html(0);

        })
    }

    function ayo_pocket(e, f, z) {
        $.ajax({
            type: "GET",
            dataType: "xml",
            url: "https://query.yahooapis.com/v1/public/yql",
            data: {
                q: "SELECT content FROM data.headers WHERE url=\"https://widgets.getpocket.com/v1/button?label=pocket&count=horizontal&v=1&url=" + encodeURIComponent(e) + "\" and ua=\"#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36\"",
                format: "xml",
                env: "store://datatables.org/alltableswithkeys"
            }
        }).done(function(a) {
            var b = $(a).find("content").text();
            var c = b.match(/<em\sid=\"cnt\">([0-9]+)<\/em>/i);
            var d = (c !== null) ? ayo_num(c[1]) : 0;
            $(f + ':eq(' + z + ') .ayoshare .pocket .counter p').html(d);
        }).fail(function() {
            $(f + ':eq(' + z + ') .ayoshare .pocket .counter p').html(0);

        })
    }

    function ayo_num(a) {
        var b = parseInt(a, 10);
        if (b === null) {
            return 0;
        }
        if (b >= 1000000000) {
            return (b / 1000000000).toFixed(1).replace(/\.0$/, "") + "g";
        }
        if (b >= 1000000) {
            return (b / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
        }
        if (b >= 1000) {
            return (b / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        }
        return b;
    }

}

function ayo_share_og(c, s) {
    var e = new RegExp(location.host || "localhost");
    if (window.location.href == c) {
        var tit = ($(document).attr('title') !== null && $(document).attr('title') !== undefined ? $(document).attr('title') : ''),
            des = ($('meta[name="description"]').attr("content") != null && $('meta[name="description"]').attr("content") != undefined ? $('meta[name="description"]').attr("content") : ''),
            img = ($('meta[property="og:image"]').attr("content") != null && $('meta[property="og:image"]').attr("content") != undefined ? $('meta[property="og:image"]').attr("content") : '');
       
	    openShare(s, c, tit, des, img);

    } else if (e.test(c)) {
        $.ajax({
            url: c
        }).done(function(a) {
            var tit = ($(a).filter('title').text() != null && $(a).filter('title').text() != undefined ? $(a).filter('title').text() : ''),
                des = ($(a).filter('meta[name="description"]').attr("content") != null && $(a).filter('meta[name="description"]').attr("content") != undefined ? $(a).filter('meta[name="description"]').attr("content") : ''),
                img = ($(a).filter('meta[property="og:image"]').attr("content") != null && $(a).filter('meta[property="og:image"]').attr("content") != undefined ? $(a).filter('meta[property="og:image"]').attr("content") : '');
            openShare(s, c, tit, des, img);
        });
    } else {
        $.ajax({
            type: "GET",
            dataType: "xml",
            url: "https://query.yahooapis.com/v1/public/yql",
            data: {
                q: "SELECT content FROM data.headers WHERE url=\"" + c + "\" and ua=\"#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36\"",
                format: "xml",
                env: "store://datatables.org/alltableswithkeys"
            }
        }).done(function(x) {
            var a = $(x).find("content").text(),
                tit = ($(a).filter('title').text() != null && $(a).filter('title').text() != undefined ? $(a).filter('title').text() : ''),
                des = ($(a).filter('meta[name="description"]').attr("content") != null && $(a).filter('meta[name="description"]').attr("content") != undefined ? $(a).filter('meta[name="description"]').attr("content") : ''),
                img = ($(a).filter('meta[property="og:image"]').attr("content") != null && $(a).filter('meta[property="og:image"]').attr("content") != undefined ? $(a).filter('meta[property="og:image"]').attr("content") : '');
            
			 openShare(s, c, tit, des, img);
			
        }).fail(function(e) {
            var tit = ($(document).attr('title') !== null && $(document).attr('title') !== undefined ? $(document).attr('title') : ''),
                des = ($('meta[name="description"]').attr("content") != null && $('meta[name="description"]').attr("content") != undefined ? $('meta[name="description"]').attr("content") : ''),
                img = ($('meta[property="og:image"]').attr("content") != null && $('meta[property="og:image"]').attr("content") != undefined ? $('meta[property="og:image"]').attr("content") : '');
            openShare(s, c, tit, des, img);
        });
    }
}

function openShare(s, c, tit="", des="", img=""){
	if (s == 'facebook') {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + c, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'google') {
            window.open('https://plus.google.com/share?url=' + c, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'linkedin') {
            window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + c + '&title=' + tit + '&summary=' + des, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'reddit') {
            window.open('http://reddit.com/submit?url=' + c + '&title=' + tit + '+-+via @bachors', 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'pinterest') {
            window.open('http://pinterest.com/pin/create/button/?url=' + c + '&media=' + img + '&description=' + des, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'stumbleupon') {
            window.open('http://www.stumbleupon.com/badge/?url=' + c, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'bufferapp') {
            window.open('https://bufferapp.com/add?url=' + c + '&text=' + des, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'vk') {
            window.open('http://vk.com/share.php?url=' + c, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'pocket') {
            window.open('https://getpocket.com/save?title=' + tit + '&url=' + c, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'twitter') {
            window.open('https://twitter.com/share?text=' + tit + '+-+via @bachors&url=' + c, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'flipboard') {
            window.open('https://share.flipboard.com/bookmarklet/popout?v=2&title=' + tit + '&url=' + c, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'digg') {
            window.open('http://digg.com/submit?url=' + c, 'bachors.com', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        } else if (s == 'whatsapp') {
            window.location = 'whatsapp://send?text=' + tit + '%20' + c;
        } else if (s == 'telegram') {
            window.location = 'tg://msg_url?text=' + tit + '%20' + c;
        } else if (s == 'viber') {
            window.location = 'viber://forward?text=' + tit + '%20' + c;
        } else if (s == 'email') {
            window.location = 'mailto:?subject=' + tit + '&amp;body=' + des + '%20' + c;
        } else if (s == 'line') {
            window.location = 'line://msg/text/' + tit + '%20' + c;
        } else if (s == 'bbm') {
            window.location = 'bbmi://api/share?message=' + tit + '%20' + c;
        } else if (s == 'sms') {
            window.location = 'sms:?body=' + tit + '%20' + c;
        }
}
