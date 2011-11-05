# sitemap.xml
xml.instruct! :xml, :version=> '1.0', :encoding => 'UTF-8'
xml.urlset :xmlns => 'http://www.sitemaps.org/schemas/sitemap/0.9' do
  xml.url do
    xml.loc root_url
    xml.changefreq 'daily'
    xml.priority '0.9'
  end

  xml.url do
    xml.loc help_url
    xml.changefreq 'monthly'
    xml.priority '0.9'
  end
end
