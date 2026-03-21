# scraper.py

import re
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "https://www.noff.gg"
LIST_URL = f"{BASE_URL}/cookie-run-kingdom/cookies"

PAGE_WAIT = 6  # seconds to wait for each cookie page to render


def make_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(30)
    return driver


def get_cookie_urls(driver):
    print("Loading cookie list...")
    driver.get(LIST_URL)
    try:
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "cookiesList"))
        )
    except Exception:
        print("Timed out waiting for cookiesList — trying anyway...")
    time.sleep(2)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    div_tag = soup.find("div", id="cookiesList")
    if not div_tag:
        print("ERROR: cookiesList div not found.")
        return []

    urls = []
    for tag in div_tag.find_all("a", href=True):
        href = tag["href"]
        url = href if href.startswith("http") else BASE_URL + href
        if url not in urls:
            urls.append(url)

    print(f"Found {len(urls)} cookie URLs\n")
    return urls


def grab_cookieinfo(page_source, url):
    soup = BeautifulSoup(page_source, "html.parser")

    # ── Name ──
    name_div = soup.find("div", class_="scoop-container-content")
    if not name_div:
        raise ValueError("No scoop-container-content")
    h1 = name_div.find("h1")
    if not h1:
        raise ValueError("No h1 found")
    name = h1.text.strip()

    # ── Rarity ──
    # Now in: <span class="rarity-span rarity-span-super-epic">Super Epic</span>
    rarity = None
    rarity_span = soup.find("span", class_=re.compile(r"rarity-span"))
    if rarity_span:
        rarity = rarity_span.text.strip()

    # ── Type and Position ──
    # Each is a <span> containing an <img alt="X Icon"> followed by plain text "X"
    # e.g. <span><img alt="Bomber Icon">Bomber</span>
    type_ = None
    position = None

    types_container = soup.find("div", id="typesContainer")
    if types_container:
        known_types     = {"Charge","Defense","Ambush","Magic","Ranged","Bomber","Support","Healing"}
        known_positions = {"Front","Middle","Rear"}

        for span in types_container.find_all("span"):
            # Get direct text (not from child tags)
            text = span.get_text(strip=True)
            # Remove any rarity text already captured
            if rarity and text == rarity:
                continue
            if text in known_types and not type_:
                type_ = text
            if text in known_positions and not position:
                position = text

    # ── Skill ──
    # <div class="skill-header">
    #   <div>
    #     <span>14s</span>   ← cooldown
    #     <h2>Mind Venom</h2>
    #   </div>
    # </div>
    skill_name = ""
    skill_cooldown = 0

    header_div = soup.find("div", class_="skill-header")
    if header_div:
        inner = header_div.find("div")
        if inner:
            span = inner.find("span")
            if span:
                cd_text = re.sub(r"[^0-9]", "", span.text.strip())
                skill_cooldown = int(cd_text) if cd_text else 0
            h2 = inner.find("h2")
            if h2:
                skill_name = h2.text.strip().replace("'", "\\'")

    return f"('{name}','{rarity}','{type_}','{position}','{skill_name}',{skill_cooldown}),"


def main():
    driver = make_driver()
    failed = []

    try:
        urls = get_cookie_urls(driver)
        if not urls:
            print("No URLs found — exiting.")
            return

        for i, url in enumerate(urls, 1):
            try:
                driver.get(url)
                time.sleep(PAGE_WAIT)
                info = grab_cookieinfo(driver.page_source, url)
                print(f"[{i:3}/{len(urls)}] {info}")

            except Exception as e:
                short_err = str(e).split("\n")[0]
                print(f"[{i:3}/{len(urls)}] FAILED {url.split('/')[-1]}: {short_err}")
                failed.append(url)

                # Restart driver if 3 consecutive failures
                if (len(failed) >= 3 and
                        urls[max(0, i-3):i] == failed[-3:]):
                    print("  Multiple failures — restarting driver...")
                    try:
                        driver.quit()
                    except Exception:
                        pass
                    driver = make_driver()

    finally:
        try:
            driver.quit()
        except Exception:
            pass

    if failed:
        print(f"\n--- {len(failed)} failed ---")
        for u in failed:
            print(f"  {u}")
    else:
        print("\nAll cookies scraped successfully!")


if __name__ == "__main__":
    main()