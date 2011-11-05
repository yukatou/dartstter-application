class Settings < Settingslogic
  source "#{Rails.root}/config/application.yml"
  namespace Rails.env # これを記述すると動作環境により設定ファイルを読み込んでくれます
end
