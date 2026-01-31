import os
import re

directory = "/home/hiyo2044/Project/html-to-pptx/슬라이드"
script_tag = '<script src="navigation.js"></script>'

for filename in os.listdir(directory):
    if filename.startswith("슬라이드") and filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        if "navigation.js" in content:
            print(f"Skipping {filename}, already has navigation.js")
            continue

        # Insert before </body>
        if "</body>" in content:
            new_content = content.replace("</body>", f"{script_tag}\n</body>")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"Warning: No </body> tag in {filename}")
