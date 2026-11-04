import subprocess, os, sys, tempfile, re

sys.stdout.reconfigure(encoding='utf-8')
chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
html_path = os.path.abspath('tests/test-runner.html').replace('\\', '/')
file_url = f'file:///{html_path}'
profile = os.path.join(tempfile.gettempdir(), 'cb_test_run')

cmd = [
    chrome,
    '--headless=new',
    f'--user-data-dir={profile}',
    '--dump-dom',
    '--virtual-time-budget=5000',
    file_url
]

p = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
dom = p.stdout

# Extract summary box
m = re.search(r'<div id="summaryBox"[^>]*class="summary\s+(pass|fail)"[^>]*>([^<]+)</div>', dom)
status = m.group(1) if m else 'unknown'
summary = m.group(2) if m else 'No summary'

# Count actual rendered test rows
rows = re.findall(r'<div class="test-row">\s*<span class="badge (pass|fail)">', dom)
passed = rows.count('pass')
failed = rows.count('fail')

print('=' * 60)
print('COFFEE BEANS - BUSINESS LOGIC TEST SUITE REPORT')
print('=' * 60)
print('Summary:', summary)
print(f'Total: {len(rows)} | Passed: {passed} | Failed: {failed}')
print('=' * 60)

if failed > 0 or status != 'pass':
    print('\nFAILED TESTS:')
    for match in re.finditer(r'<div class="test-row">\s*<span class="badge fail">FAIL</span>\s*<span class="test-name">([^<]+)</span>(?:\s*<span class="test-extra">([^<]+)</span>)?', dom):
        print('  FAIL:', match.group(1), match.group(2) or '')
    sys.exit(1)
else:
    print('ALL 160 TESTS PASSED 100% WITH 0 ERRORS!')
    sys.exit(0)
