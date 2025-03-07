#!/usr/bin/env python3

import json

# Read the file
with open("output.txt", "r") as f:
    data = eval(f.read())  # Convert the text into a Python object

# Write as JSON
with open("output.json", "w") as f:
    json.dump(data, f, indent=4)
