/*获取当前页面url和标题*/
chrome.tabs.getSelected(function (tab) {
  $("#post-url").html(tab.url);
  $("#post-title").val(tab.title);
});

/*获取子社区分类*/
$.ajax({
  url: 'http://geek.csdn.net/service/news/categories',
  type: 'get',
  dataType: 'json',
  chrset: 'utf-8',
  success: function (list) {
    for (var i = 0; i < list.data.length; i++) {
      var optionVal = list.data[i];
      $("#post-sort").append('<option value=' + optionVal.id + '>' + optionVal.name + '</option>')
    }
  }
});

/*获取cookies*/
function getCookies(domain, name, callback) {
  chrome.cookies.get({"url": domain, "name": name}, function (cookie) {
    if (callback) {
      callback(cookie.value);
    }
  });
}
getCookies("http://geek.csdn.net", "UserName", function (UserName) {
  username = UserName;
});

/*发送表单内容*/
$("#post").on("click", function () {
  if ($("#post-title").val() != null && $("#post-sort option:selected").val() != 0) {
    $.ajax({
      url: ' http://geek.csdn.net/service/news/add_edit',
      type: 'post',
      charset: 'utf-8',
      data: {
        "username": username,
        "title": $("#post-title").val(),
        "forum_id": $("#post-sort option:selected").val(),
        "url": $("#post-url").html(),
        "description": $("#post-reason").val()
      },
      success: function (data) {
        hide();
        if (data.status == 1) {
          $(".success").show();
        } else if (data.status == 0) {
          $(".error").show().children("p").append(data.error);
        }
        console.log("状态:" + data.status);
        console.log("文章ID:" + data.data.id);
        console.log("错误:" + data.error)
      },

    })
  }

});

/*弹窗切换*/
function hide() {
  $(".pop-title").hide();
  $("form").hide();
}

/*底部友情链接*/
$(".footer  a").on("click", function () {
  chrome.tabs.create({url: $(this).attr("href")});
});