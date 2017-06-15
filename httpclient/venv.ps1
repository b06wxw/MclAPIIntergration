
# Recreate the virtual environment and reinstall libs.
# Requires Python 3; version 3.6 recommended.

write-Host "deleting previous venv..."

rm -r  Lib
rm -r .\Include
rm -r .\Scripts

write-Host "creating new venv ..."

python -m venv .

.\Scripts\activate

python --version

write-host  "upgrading pip-tools ..."
pip install --upgrade pip-tools

write-host 'pip-compile requirements.in ...'
pip-compile --output-file requirements.txt requirements.in

write-host 'pip install requirements.txt ...'
pip install -r requirements.txt

pip list --format=columns

write-host 'done'
