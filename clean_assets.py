import os
from PIL import Image

img_path = r"C:\Users\ACM\.gemini\antigravity-ide\scratch\nikkah-invitation\assets\images\1.png"
im = Image.open(img_path)
print("1.png Size:", im.size)

# 1.png has size (width, height)
# Let's see if we can create a version of 1.png where the text in the parchment area is cleaned.
# The parchment area is inside the gold arch frame.
# We can sample a clean patch of parchment from above or below the text and blend it,
# or create a clean parchment background.
width, height = im.size

# Let's inspect the bounding box of the text inside the arch:
# In 1.png, the text runs roughly from y = 0.22 * height to y = 0.85 * height.
# Let's sample a clean parchment section from y = 0.16 * height to 0.22 * height
# or fill the inner arch with the parchment color gradient.
# Let's save a clean version: 1_clean.png
clean_im = im.copy()

# Sample parchment patch (e.g. from y=380 to 450 in normalized coords)
# Let's see: what are the actual pixel coordinates?
print(f"Dimensions: {width} x {height}")
