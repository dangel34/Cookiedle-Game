import os
import re
import cloudscraper
from bs4 import BeautifulSoup

URL      = 'https://www.noff.gg/cookie-run-kingdom/cookies'
BASE_URL = 'https://www.noff.gg'
OUTPUT_DIR = 'cookie_images'

HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    ),
    'Referer': URL,
}

def safe_filename(alt_text, fallback):
    if alt_text:
        name = re.sub(r'[^\w\s-]', '', alt_text).strip().replace(' ', '_')
        if name:
            return name + '.webp'
    return fallback

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    session = cloudscraper.create_scraper()
    session.headers.update(HEADERS)

    print(f'Fetching {URL} ...')
    resp = session.get(URL, timeout=20)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, 'html.parser')
    cookie_list = soup.find(id='cookiesList')
    if not cookie_list:
        print('ERROR: Could not find #cookiesList in the page.')
        print('First 500 chars of response:')
        print(resp.text[:500])
        return

    imgs = cookie_list.select('.cookie-img-container img')
    print(f'Found {len(imgs)} cookie image(s).\n')

    for img in imgs:
        src = img.get('src') or img.get('data-src') or ''
        if not src:
            continue
        if src.startswith('/'):
            src = BASE_URL + src

        alt      = img.get('alt', '')
        raw_name = os.path.basename(src.split('?')[0])
        filename = safe_filename(alt, raw_name)
        dest     = os.path.join(OUTPUT_DIR, filename)

        if os.path.exists(dest):
            print(f'  [skip] {filename}')
            continue

        try:
            r = session.get(src, timeout=15)
            r.raise_for_status()
            with open(dest, 'wb') as f:
                f.write(r.content)
            print(f'  [ok]   {filename}')
        except Exception as e:
            print(f'  [err]  {src} — {e}')

    print(f'\nDone. Images saved to ./{OUTPUT_DIR}/')

if __name__ == '__main__':
    main()
