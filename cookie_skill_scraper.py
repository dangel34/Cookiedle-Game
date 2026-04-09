import os
import re
import time
import unicodedata
import cloudscraper
from bs4 import BeautifulSoup

BASE_URL   = 'https://www.noff.gg'
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR  = os.path.join(SCRIPT_DIR, 'cookie_images')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, 'cookie_skill_images')

HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    ),
    'Referer': BASE_URL,
    'Accept-Language': 'en-US,en;q=0.9',
}

def filename_to_slugs(filename):
    """
    Returns a list of URL slugs to try, most specific first.
    e.g. "Captain_Caviar_Cookie.webp" → ["captain-caviar-cookie", "captain-caviar"]
         "Lychee_Dragon_Cookie.webp"  → ["lychee-dragon-cookie", "lychee-dragon"]
    Handles accents and special characters by normalizing to ASCII.
    """
    name = os.path.splitext(filename)[0]  # strip .webp

    # Normalize unicode (e.g. accented chars → base ASCII)
    name = unicodedata.normalize('NFKD', name)
    name = name.encode('ascii', 'ignore').decode('ascii')

    # Replace underscores/spaces with hyphens, strip anything not alphanumeric or hyphen
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', name).strip('-').lower()

    slugs = [slug]

    # Also try without the trailing "-cookie"
    if slug.endswith('-cookie'):
        slugs.append(slug[:-7])  # len('-cookie') == 7

    return slugs

def try_fetch_page(session, filename):
    """Try each slug variant; return (resp, page_url) for the first one that has a skill image."""
    slugs = filename_to_slugs(filename)
    for slug in slugs:
        page_url = f'{BASE_URL}/cookie-run-kingdom/cookie/{slug}'
        try:
            resp = session.get(page_url, timeout=20)
        except Exception as e:
            print(f'         fetch error for {page_url}: {e}')
            continue

        if resp.status_code != 200:
            continue

        # Check if this page actually has a skill image (guards against soft 404s)
        soup = BeautifulSoup(resp.text, 'html.parser')
        img_tag = find_skill_img(soup)
        if img_tag:
            return resp, page_url, img_tag

    return None, None, None

def find_skill_img(soup):
    return (
        soup.select_one('.skill-header img') or
        soup.select_one('div.skill-header img') or
        soup.select_one('[class*="skill"] img[src*="/skills/"]')
    )

def main():
    print('=== DEBUG ===')
    print(f'INPUT_DIR  : {INPUT_DIR}  (exists: {os.path.isdir(INPUT_DIR)})')
    print(f'OUTPUT_DIR : {OUTPUT_DIR}')

    if not os.path.isdir(INPUT_DIR):
        print(f'\nERROR: cookie_images folder not found at {INPUT_DIR}')
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    cookie_files = sorted(f for f in os.listdir(INPUT_DIR) if f.endswith('.webp'))
    print(f'Cookies to process: {len(cookie_files)}')
    print('=============\n')

    session = cloudscraper.create_scraper()
    session.headers.update(HEADERS)

    ok = skip = err = 0

    for filename in cookie_files:
        dest = os.path.join(OUTPUT_DIR, filename)

        if os.path.exists(dest):
            print(f'  [skip] {filename}')
            skip += 1
            continue

        _, _, img_tag = try_fetch_page(session, filename)

        if img_tag is None:
            slugs = filename_to_slugs(filename)
            print(f'  [err]  {filename} — skill image not found (tried: {slugs})')
            err += 1
            continue

        src = img_tag.get('src') or img_tag.get('data-src') or ''
        if src.startswith('/'):
            src = BASE_URL + src

        try:
            r = session.get(src, timeout=15)
            r.raise_for_status()
            with open(dest, 'wb') as f:
                f.write(r.content)
            print(f'  [ok]   {filename}  ← {os.path.basename(src)}')
            ok += 1
        except Exception as e:
            print(f'  [err]  {filename} — image download failed: {e}')
            err += 1

        time.sleep(0.3)

    print(f'\nDone. {ok} saved, {skip} skipped, {err} errors')

if __name__ == '__main__':
    main()
