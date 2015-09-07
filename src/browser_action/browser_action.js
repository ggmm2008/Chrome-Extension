/*��ȡ��ǰҳ��url�ͱ���*/
chrome.tabs.getSelected(function (tab) {
  $("#post-url").html(tab.url);
  $("#post-title").val(tab.title);
});

/*��ȡ����������*/
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

/*��ȡcookies*/
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

/*���ͱ�����*/
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
        console.log("״̬:" + data.status);
        console.log("����ID:" + data.data.id);
        console.log("����:" + data.error)
      },

    })
  }

});

/*�����л�*/
function hide() {
  $(".pop-title").hide();
  $("form").hide();
}

/*�ײ���������*/
$(".footer  a").on("click", function () {
  chrome.tabs.create({url: $(this).attr("href")});
});