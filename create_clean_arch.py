from PIL import Image, ImageDraw, ImageFilter

im1 = Image.open(r"C:\Users\ACM\.gemini\antigravity-ide\scratch\nikkah-invitation\assets\images\1.png").convert("RGBA")
im3 = Image.open(r"C:\Users\ACM\.gemini\antigravity-ide\scratch\nikkah-invitation\assets\images\3.png").convert("RGBA")

arch_points = [
    (470, 110),
    (410, 160), (350, 210), (285, 235), 
    (245, 225), (195, 275), (155, 345), (128, 420),
    (128, 1430),
    (150, 1455), (200, 1455), (470, 1455), (740, 1455), (790, 1455),
    (814, 1430),
    (814, 420),
    (787, 345), (747, 275), (697, 225),
    (657, 235), (592, 210), (532, 160)
]

mask = Image.new("L", im1.size, 0)
draw = ImageDraw.Draw(mask)
draw.polygon(arch_points, fill=255)

mask = mask.filter(ImageFilter.GaussianBlur(6))

clean_im = Image.composite(im3, im1, mask)
clean_im.save(r"C:\Users\ACM\.gemini\antigravity-ide\scratch\nikkah-invitation\assets\images\1_clean.png")
print("Saved flawless 1_clean.png!")
