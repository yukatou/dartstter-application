(function($){

   $.fn.myPlugin = function(options) {
        // 初期値を設定
        var defaults = {
            'hoge'    : 'fuga',
            'default' : 'value'
        };

        // オプションの初期値を設定
        var setting = $.extend(defaults, options);

        // プラグインで使用するメソッド
        var method = function() {
            // 処理を書く
            alert(setting.hoge);
        };
        var fillHeight = function() {
              scroll(0, 0);
              var header = $("[data-role=header]:visible");
              var footer = $("[data-role=footer]:visible");
              var content = $("[data-role=content]:visible");
              var viewport_height = $(window).height();
              var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
              
              content_height -= (content.outerHeight() - content.height());
              return content_height;
        }

        // セレクタで指定した要素を処理
        this.each(function() {
            var obj = $(this);
            obj.height(fillHeight());
        });

        // メソッドチェーン用
        return this;
    };

})(jQuery)
