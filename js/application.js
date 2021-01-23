(function() {
  var handleApproval, handleMailchimp, handleThumbsUp, pingForImage;

  pingForImage = function() {
    var img, shortcode;
    img = $(".master-drawing");
    if (!img.length) {
      return;
    }
    if (img.attr("src") !== "/images/loading.gif") {
      return;
    }
    shortcode = window.location.pathname.split("/").pop();
    return $.get("/api/image-url/" + shortcode, function(data) {
      if (data) {
        return $(".master-drawing").attr("src", data);
      } else {
        return window.setTimeout(pingForImage, 500);
      }
    });
  };

  handleThumbsUp = function() {
    var mom, thumb;
    thumb = $(this);
    mom = thumb.parent();
    if (thumb.hasClass("up")) {
      mom.removeClass("flagged");
      return mom.toggleClass("recommended");
    } else {
      mom.removeClass("recommended");
      return mom.toggleClass("flagged");
    }
  };

  handleApproval = function() {
    var i, obj;
    obj = {
      approved: [],
      flagged: [],
      recommended: []
    };
    $('.review_bucket').each(function() {
      var drawing, me;
      me = $(this);
      drawing = me.data("drawing");
      if (me.hasClass("flagged")) {
        return obj.flagged.push(drawing);
      } else {
        obj.approved.push(drawing);
        if (me.hasClass("recommended")) {
          return obj.recommended.push(drawing);
        }
      }
    });
    i = $("<input>").attr("type", "hidden").attr("name", "approvals");
    i.val(JSON.stringify(obj));
    return $('#approve').append($(i));
  };

  this.handleTermsCheck = function() {
    var box;
    box = $('#terms');
    return $('#drawing-submit').toggleClass("disabled", !(box.is(':checked') && window.drawing_exists));
  };

  handleMailchimp = function(e) {
    var promise;
    e.preventDefault();
    promise = $.post("/subscribe", {
      email: $("#email", this).val()
    });
    promise.done(function() {
      $('#mailchimp').hide();
      return $('#mailchimp-thanks').removeClass('hidden');
    });
    return promise.fail(function() {
      return $('#mailchimp').val("");
    });
  };

  $('body').on("submit", "#submit-drawing", function(e) {
    var data, i, n, point;
    $('#drawing-submit').addClass("disabled").text("Submitting drawing...");
    data = (function() {
      var j, ref, results;
      results = [];
      for (n = j = 0, ref = Math.random().toFixed(4) * 100; 0 <= ref ? j <= ref : j >= ref; n = 0 <= ref ? ++j : --j) {
        results.push([+Math.random().toFixed(4), +Math.random().toFixed(4)]);
      }
      return results;
    })();
    data = (function() {
      var j, len, ref, results;
      ref = window.drawing_points;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        point = ref[j];
        results.push([point.x, point.y]);
      }
      return results;
    })();
    i = $("<input>").attr("type", "hidden").attr("name", "drawing");
    i.val(JSON.stringify(data));
    return $('#submit-drawing').append($(i));
  });

  $((function(_this) {
    return function() {
      $('.thumbs').on("click", handleThumbsUp);
      $('#approve').on("submit", handleApproval);
      $('#terms').on("change", handleTermsCheck);
      $('#mailchimp').on("submit", handleMailchimp);
      return pingForImage();
    };
  })(this));

}).call(this);

/*
//@ sourceMappingURL=application.js.map
*/
