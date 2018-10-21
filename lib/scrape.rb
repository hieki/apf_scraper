require 'open-uri'
require 'nokogiri'
require 'aws-sdk-dynamodb'

def perform_request(url)
  puts "fetch #{url}"
  html = open(url) do |f|
    f.read
  end
  return Nokogiri::HTML.parse(html, nil)
end

def collect_articles_list(articles = [], i = 1)
  url = "http://www.afpbb.com/subcategory/column?page=#{i}"
  page = perform_request(url)
  links = page.css('main a.block')
  links.each do |link|
    begin
      href = link[:href]
      title = link.css('h3.title').children.to_s
      articles.push({title: title, href: href})
    rescue => e
      raise e
    end

  end

  collect_articles_list(articles, i + 1) if links.length > 0
  return articles
end

def collect_article(articles)
  res = articles.map do |article|
    article_page = perform_request(article[:href])
    body = article_page.css('body')
    full_text = body.css('body #container p').map { |a| a.text }.join
    images = article_page.css('body img.img').map{ |img| "http://www.afpbb.com/#{img[:src]}" }

    {
      full_text: full_text,
      images: images,
      raw_title: article[:title],
      title: article[:title].split('】').last,
      href: article[:href]
    }
  end
  return res
end

def save(full_articles)
  puts "Saving Database..."
  client = Aws::DynamoDB::Client.new({region: 'ap-northeast-1'})
  full_articles.each do |article|
    id = get_id(client)
    save_article(client, id, article)
  end
  puts "DONE."
end

def get_id(client)
  res = client.update_item({
    table_name: 'sequences',
    expression_attribute_names: {
      '#value': 'value'
    },
    expression_attribute_values:{
      ':incr': 1
    },
    key: {
      table_name: 'afp_articles'
    },
    return_values: "ALL_NEW",
    update_expression: 'SET #value = #value + :incr',
  })
  res.attributes['value'].to_i
end

def save_article(client, id, article)
  client.put_item({
  item: {
    "id": id,
    "title": article[:title],
    "raw_title": article[:raw_title],
    "full_text": article[:full_text],
    "href": article[:href],
    "images": article[:images],
  },
  table_name: "afp_articles",
})
end

articles = collect_articles_list()
full_articles = collect_article(articles)
save(full_articles)
