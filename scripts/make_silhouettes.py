from PIL import Image
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR  = os.path.join(SCRIPT_DIR, '..', 'docs', 'cookie_images')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, '..', 'docs', 'cookie_silhouettes')

# Color of the silhouette (dark gray works better than pure black for UI)
SILHOUETTE_COLOR = (0, 0, 0)

def make_silhouette(src_path, dest_path):
    img = Image.open(src_path).convert('RGBA')
    _, _, _, a = img.split()

    # Fill a solid-color canvas the same size, then stamp the original alpha on it
    silhouette = Image.new('RGBA', img.size, SILHOUETTE_COLOR + (255,))
    silhouette.putalpha(a)
    silhouette.save(dest_path)

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    files = [f for f in os.listdir(INPUT_DIR) if f.lower().endswith('.webp')]
    if not files:
        print(f'No .webp files found in ./{INPUT_DIR}/')
        return

    print(f'Processing {len(files)} image(s)...\n')
    for filename in sorted(files):
        src  = os.path.join(INPUT_DIR,  filename)
        dest = os.path.join(OUTPUT_DIR, filename)
        try:
            make_silhouette(src, dest)
            print(f'  [ok]   {filename}')
        except Exception as e:
            print(f'  [err]  {filename} — {e}')

    print(f'\nDone. Silhouettes saved to ./{OUTPUT_DIR}/')

if __name__ == '__main__':
    main()
