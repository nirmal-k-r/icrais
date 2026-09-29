import fitz, pathlib
root = pathlib.Path(__file__).resolve().parents[2]
d = fitz.open(root / 'submission_paper.pdf')
out = pathlib.Path(__file__).resolve().parents[1] / 'sources' / 'paper.txt'
out.write_text('\n=====PAGE=====\n'.join(p.get_text() for p in d))
print('pages', len(d), '->', out)
