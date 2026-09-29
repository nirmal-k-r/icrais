import sys, glob, re, collections
from PIL import Image, ImageDraw
theme = sys.argv[1] if len(sys.argv) > 1 else 'light'
files = sorted(glob.glob(f'review/*-{theme}.png'))
last = collections.OrderedDict()
for f in files:
    m = re.match(r'review/(\d+)-(\w+)-(\d+)-' + theme + r'\.png', f)
    last[m.group(2)] = f   # sorted order => last step wins
items = list(last.items())
per = 6
for k in range(0, len(items), per):
    chunk = items[k:k+per]
    W, H = 960, 540
    sheet = Image.new('RGB', (W*2, H*3), 'white')
    for i, (name, f) in enumerate(chunk):
        im = Image.open(f).convert('RGB').resize((W, H))
        sheet.paste(im, ((i%2)*W, (i//2)*H))
        ImageDraw.Draw(sheet).text(((i%2)*W+10, (i//2)*H+6), name, fill=(200,0,0))
    sheet.save(f'review/sheet-{theme}-{k//per+1}.jpg', quality=85)
    print('sheet', k//per+1, [n for n,_ in chunk])
