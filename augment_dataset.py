from PIL import Image, ImageEnhance, ImageFilter
import os
import random

# ==============================
# PATHS
# ==============================

SOURCE = r"certificate_dataset\classification_v2\train"
OUTPUT = r"certificate_dataset\classification_augmented\train"

CLASSES = ["fake", "original"]

# Each original image will create 4 new images
AUG_PER_IMAGE = 4

random.seed(42)


# ==============================
# AUGMENTATION FUNCTION
# ==============================

def augment_image(img):

    # Small rotation
    angle = random.uniform(-3, 3)
    img = img.rotate(
        angle,
        resample=Image.Resampling.BICUBIC,
        expand=False
    )

    # Small brightness variation
    brightness = random.uniform(0.90, 1.10)
    img = ImageEnhance.Brightness(img).enhance(brightness)

    # Small contrast variation
    contrast = random.uniform(0.90, 1.10)
    img = ImageEnhance.Contrast(img).enhance(contrast)

    # Small color variation
    color = random.uniform(0.90, 1.10)
    img = ImageEnhance.Color(img).enhance(color)

    # Very small sharpness variation
    sharpness = random.uniform(0.90, 1.10)
    img = ImageEnhance.Sharpness(img).enhance(sharpness)

    return img


# ==============================
# CREATE DATASET
# ==============================

total_original = 0
total_augmented = 0

for class_name in CLASSES:

    source_folder = os.path.join(SOURCE, class_name)
    output_folder = os.path.join(OUTPUT, class_name)

    os.makedirs(output_folder, exist_ok=True)

    images = [
        f for f in os.listdir(source_folder)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    print(f"\nClass: {class_name}")
    print(f"Original images: {len(images)}")

    for filename in images:

        source_path = os.path.join(source_folder, filename)

        try:
            img = Image.open(source_path).convert("RGB")

            # Save original image
            original_name = os.path.splitext(filename)[0]
            original_output = os.path.join(
                output_folder,
                filename
            )

            img.save(original_output)
            total_original += 1

            # Create augmented copies
            for i in range(1, AUG_PER_IMAGE + 1):

                aug_img = augment_image(img)

                aug_name = f"{original_name}_aug{i}.jpg"

                aug_path = os.path.join(
                    output_folder,
                    aug_name
                )

                aug_img.save(
                    aug_path,
                    quality=95
                )

                total_augmented += 1

        except Exception as e:
            print(f"Error: {filename}")
            print(e)


print("\n====================================")
print("AUGMENTATION COMPLETED")
print("====================================")
print(f"Original images copied : {total_original}")
print(f"Augmented images       : {total_augmented}")
print(f"Total training images  : {total_original + total_augmented}")
print("====================================")