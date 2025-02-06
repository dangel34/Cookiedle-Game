import re
import requests
from bs4 import BeautifulSoup

# Get the initial list of URLs
page = requests.get('https://www.noff.gg/cookie-run-kingdom/cookies').content
soup = BeautifulSoup(page, 'html.parser')

div_tag = soup.find('div', id='cookiesList')
a_tags = div_tag.find_all('a')

urls = []
for tag in a_tags:
    extension = tag['href']
    url = 'https://www.noff.gg/' + str(extension)
    urls.append(url)


def grab_cookieinfo(page):
    soup = BeautifulSoup(page, 'html.parser')

    name_div = soup.find('div', class_='scoop-container-content')
    name = name_div.find('h1').text.strip()

    container = soup.find('div', id='typesContainer').text.strip()
    classes = re.findall(r'[A-Z][a-z]*', str(container))

    header_div = soup.find('div', class_='skill-header')
    skill_div = header_div.find('div')
    cd_num = re.sub(r'[^0-9]', '', skill_div.find('span').text.strip())

    skill_cooldown = int(cd_num)
    skill_name = skill_div.find('h2').text.strip().replace("'", "\\'")

    cookie_rarity = classes[0]
    cookie_type = classes[1]
    cookie_position = classes[2]

    return f"('{name}','{cookie_rarity}','{cookie_type}','{cookie_position}','{skill_name}',{skill_cooldown}),"


for url in urls:
    try:
        page = requests.get(url).content
        cookie_info = grab_cookieinfo(page)
        print(cookie_info)
    except Exception as e:
        print(f"Failed to retrieve or process {url}: {e}")
