from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

import os
import json
import hashlib
from datetime import datetime

from pymongo import MongoClient

# ============================================================
# RESNET18 IMPORTS
# ============================================================

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

from blockchain import add_block


# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)
CORS(app)


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ============================================================
# UPLOAD FOLDER
# ============================================================

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ============================================================
# BLOCKCHAIN FILE
# ============================================================

BLOCKCHAIN_FILE = os.path.join(
    BASE_DIR,
    "blockchain.json"
)


# ============================================================
# MONGODB - OPTIONAL
# ============================================================

MONGO_URI = "mongodb://localhost:27017/"

mongo_client = None
db = None
certificates_collection = None

try:

    mongo_client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )

    mongo_client.admin.command("ping")

    db = mongo_client[
        "certificate_validator"
    ]

    certificates_collection = db[
        "certificates"
    ]

    print("--------------------------------")
    print("MongoDB connected successfully!")
    print("--------------------------------")

except Exception as e:

    print("--------------------------------")
    print("MongoDB connection failed!")
    print("Backend will continue without MongoDB.")
    print("Error:", e)
    print("--------------------------------")

    mongo_client = None
    db = None
    certificates_collection = None


# ============================================================
# RESNET18 MODEL
# ============================================================

RESNET_MODEL_PATH = os.path.join(
    BASE_DIR,
    "resnet18_finetuned_best.pth"
)


resnet_model = None


# IMPORTANT:
# This mapping matches the trained model:
#
# fake     = 0
# original = 1

resnet_class_names = {
    0: "fake",
    1: "original"
}


# ============================================================
# RESNET IMAGE TRANSFORM
# ============================================================

resnet_transform = transforms.Compose([

    transforms.Resize(
        (224, 224)
    ),

    transforms.ToTensor(),

    transforms.Normalize(

        mean=[
            0.485,
            0.456,
            0.406
        ],

        std=[
            0.229,
            0.224,
            0.225
        ]

    )

])


# ============================================================
# LOAD RESNET18 MODEL
# ============================================================

try:

    print("--------------------------------")
    print("Loading Fine-Tuned ResNet18...")
    print("Model:", RESNET_MODEL_PATH)
    print("--------------------------------")


    # --------------------------------------------------------
    # CREATE RESNET18
    # --------------------------------------------------------

    resnet_model = models.resnet18(
        weights=None
    )


    # --------------------------------------------------------
    # REPLACE FINAL CLASSIFICATION LAYER
    # --------------------------------------------------------

    resnet_model.fc = nn.Linear(
        resnet_model.fc.in_features,
        2
    )


    # --------------------------------------------------------
    # LOAD TRAINED CHECKPOINT
    # --------------------------------------------------------

    checkpoint = torch.load(
        RESNET_MODEL_PATH,
        map_location="cpu"
    )


    # --------------------------------------------------------
    # LOAD MODEL WEIGHTS
    # --------------------------------------------------------

    resnet_model.load_state_dict(
        checkpoint["model_state_dict"]
    )


    # --------------------------------------------------------
    # EVALUATION MODE
    # --------------------------------------------------------

    resnet_model.eval()


    print("--------------------------------")
    print("ResNet18 model loaded successfully!")
    print("--------------------------------")


    # --------------------------------------------------------
    # SHOW MODEL INFORMATION
    # --------------------------------------------------------

    if isinstance(
        checkpoint,
        dict
    ):

        if "accuracy" in checkpoint:

            print(
                "Best Validation Accuracy:",
                checkpoint["accuracy"],
                "%"
            )


        if "class_to_idx" in checkpoint:

            print(
                "Classes:",
                checkpoint["class_to_idx"]
            )


except Exception as e:

    print("--------------------------------")
    print("ResNet18 model loading failed!")
    print("Error:", e)
    print("--------------------------------")

    resnet_model = None


# ============================================================
# HOME
# ============================================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify({

        "message":
        "Blockchain Certificate Validator Backend is Running!",

        "status":
        "running",

        "model":
        "ResNet18"
        if resnet_model
        else "not loaded",

        # Compatibility field
        # Existing frontend won't break.

        "yolo":
        "loaded"
        if resnet_model
        else "not loaded",

        "mongodb":
        "connected"
        if certificates_collection is not None
        else "not connected"

    })


# ============================================================
# HEALTH
# ============================================================
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )

@app.route(
    "/health",
    methods=["GET"]
)
def health():

    return jsonify({

        "backend":
        "running",

        "model":
        "ResNet18"
        if resnet_model
        else "not loaded",

        # Compatibility field

        "yolo":
        "loaded"
        if resnet_model
        else "not loaded",

        "mongodb":
        "connected"
        if certificates_collection is not None
        else "not connected"

    })


# ============================================================
# ADMIN STATISTICS
# ============================================================

@app.route(
    "/admin/stats",
    methods=["GET"]
)
def admin_stats():

    try:

        # ----------------------------------------------------
        # CHECK BLOCKCHAIN FILE
        # ----------------------------------------------------

        if not os.path.exists(
            BLOCKCHAIN_FILE
        ):

            return jsonify({

                "success":
                True,

                "totalVerifications":
                0,

                "originalMarksheets":
                0,

                "fakeMarksheets":
                0,

                "blockchainBlocks":
                0

            }), 200


        # ----------------------------------------------------
        # READ BLOCKCHAIN FILE
        # ----------------------------------------------------

        with open(
            BLOCKCHAIN_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            chain = json.load(file)


        # ----------------------------------------------------
        # HANDLE DIFFERENT BLOCKCHAIN FORMATS
        # ----------------------------------------------------

        if isinstance(
            chain,
            dict
        ):

            chain = chain.get(
                "chain",
                []
            )


        if not isinstance(
            chain,
            list
        ):

            chain = []


        # ----------------------------------------------------
        # STATISTICS
        # ----------------------------------------------------

        total_verifications = 0

        original_marksheets = 0

        fake_marksheets = 0


        # ----------------------------------------------------
        # LOOP THROUGH BLOCKS
        # ----------------------------------------------------

        for block in chain:

            # Skip genesis block

            if block.get(
                "index"
            ) == 0:

                continue


            data = block.get(
                "data",
                {}
            )


            # ------------------------------------------------
            # GET PREDICTION
            # ------------------------------------------------

            prediction = (

                data.get(
                    "prediction"
                )

                or block.get(
                    "prediction"
                )

                or data.get(
                    "result"
                )

                or block.get(
                    "result"
                )

                or ""

            )


            prediction = str(
                prediction
            ).lower().strip()


            # ------------------------------------------------
            # COUNT VERIFICATION
            # ------------------------------------------------

            total_verifications += 1


            # ------------------------------------------------
            # ORIGINAL
            # ------------------------------------------------

            if prediction in [

                "original",

                "true",

                "real"

            ]:

                original_marksheets += 1


            # ------------------------------------------------
            # FAKE
            # ------------------------------------------------

            elif prediction in [

                "fake",

                "false",

                "forged"

            ]:

                fake_marksheets += 1


        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return jsonify({

            "success":
            True,

            "totalVerifications":
            total_verifications,

            "originalMarksheets":
            original_marksheets,

            "fakeMarksheets":
            fake_marksheets,

            "blockchainBlocks":
            len(chain)

        }), 200


    except Exception as e:

        print("")
        print("ADMIN STATISTICS ERROR:")
        print(e)
        print("")


        return jsonify({

            "success":
            False,

            "totalVerifications":
            0,

            "originalMarksheets":
            0,

            "fakeMarksheets":
            0,

            "blockchainBlocks":
            0,

            "error":
            str(e)

        }), 500


# ============================================================
# UPLOAD / VERIFY
# ============================================================

@app.route(
    "/upload",
    methods=["POST"]
)
def upload_certificate():

    try:

        # ====================================================
        # RESNET MODEL CHECK
        # ====================================================

        if resnet_model is None:

            return jsonify({

                "success":
                False,

                "error":
                "ResNet18 model is not loaded."

            }), 500


        # ====================================================
        # STUDENT NAME
        # ====================================================

        student_name = request.form.get(
            "studentName",
            ""
        ).strip()


        # ====================================================
        # CERTIFICATE FILE
        # ====================================================

        certificate = request.files.get(
            "certificate"
        )


        # ====================================================
        # VALIDATION
        # ====================================================

        if not student_name:

            return jsonify({

                "success":
                False,

                "error":
                "Student name is required."

            }), 400


        if certificate is None:

            return jsonify({

                "success":
                False,

                "error":
                "Certificate file is required."

            }), 400


        if certificate.filename == "":

            return jsonify({

                "success":
                False,

                "error":
                "No certificate file selected."

            }), 400


        # ====================================================
        # ORIGINAL FILE NAME
        # ====================================================

        original_filename = certificate.filename


        filename_without_extension = os.path.splitext(
            original_filename
        )[0]


        extension = os.path.splitext(
            original_filename
        )[1].lower()


        # ====================================================
        # FILE TYPE CHECK
        # ====================================================

        allowed_extensions = [

            ".jpg",

            ".jpeg",

            ".png"

        ]


        if extension not in allowed_extensions:

            return jsonify({

                "success":
                False,

                "error":
                "Please upload JPG, JPEG or PNG marksheet."

            }), 400


        # ====================================================
        # CREATE UNIQUE FILE NAME
        # ====================================================

        timestamp = datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )


        safe_filename = (

            filename_without_extension

            + "_"

            + timestamp

            + extension

        )


        file_path = os.path.join(

            app.config[
                "UPLOAD_FOLDER"
            ],

            safe_filename

        )


        # ====================================================
        # SAVE FILE
        # ====================================================

        certificate.save(
            file_path
        )


        # ====================================================
        # SHA-256 HASH
        # ====================================================

        sha256_hash = hashlib.sha256()


        with open(
            file_path,
            "rb"
        ) as file:

            for chunk in iter(

                lambda:
                file.read(8192),

                b""

            ):

                sha256_hash.update(
                    chunk
                )


        file_hash = sha256_hash.hexdigest()


        # ====================================================
        # RESNET18 PREDICTION
        # ====================================================

        print("")
        print("--------------------------------")
        print("Starting ResNet18 Prediction")
        print("File:", safe_filename)
        print("--------------------------------")


        # ----------------------------------------------------
        # OPEN IMAGE
        # ----------------------------------------------------

        image = Image.open(
            file_path
        ).convert(
            "RGB"
        )


        # ----------------------------------------------------
        # TRANSFORM IMAGE
        # ----------------------------------------------------

        image_tensor = resnet_transform(
            image
        )


        # ----------------------------------------------------
        # ADD BATCH DIMENSION
        # ----------------------------------------------------

        image_tensor = image_tensor.unsqueeze(
            0
        )


        # ----------------------------------------------------
        # MODEL PREDICTION
        # ----------------------------------------------------

        with torch.no_grad():

            outputs = resnet_model(
                image_tensor
            )


            probabilities = torch.softmax(
                outputs,
                dim=1
            )


            confidence_tensor, class_tensor = torch.max(

                probabilities,

                dim=1

            )


        # ----------------------------------------------------
        # GET CLASS INDEX
        # ----------------------------------------------------

        top_class_index = int(
            class_tensor.item()
        )


        # ----------------------------------------------------
        # GET CONFIDENCE
        # ----------------------------------------------------

        confidence = float(
            confidence_tensor.item()
        )


        confidence_percentage = round(

            confidence * 100,

            2

        )


        # ----------------------------------------------------
        # GET CLASS NAME
        # ----------------------------------------------------

        predicted_class = resnet_class_names.get(

            top_class_index,

            "unknown"

        )


        predicted_class = str(
            predicted_class
        ).lower().strip()


        # ====================================================
        # PREDICTION MAPPING
        # ====================================================

        if predicted_class == "fake":

            prediction = "Fake"

            verification_status = "Rejected"

            fake_detections = 1

            original_detections = 0


        elif predicted_class == "original":

            prediction = "Original"

            verification_status = "Verified"

            fake_detections = 0

            original_detections = 1


        else:

            prediction = predicted_class

            verification_status = "Unknown"

            fake_detections = 0

            original_detections = 0


        # ====================================================
        # PRINT AI RESULT
        # ====================================================

        print("")
        print("AI MODEL RESULT")
        print("--------------------------------")
        print(
            "Predicted Class:",
            predicted_class
        )
        print(
            "Prediction:",
            prediction
        )
        print(
            "Confidence:",
            confidence_percentage,
            "%"
        )
        print(
            "Class Index:",
            top_class_index
        )
        print("--------------------------------")


        # ====================================================
        # BLOCKCHAIN
        # ====================================================

        block = add_block(

            student_name=student_name,

            file_name=safe_filename,

            file_hash=file_hash,

            prediction=prediction,

            confidence=confidence_percentage

        )


        # ====================================================
        # GET BLOCK VALUES
        # ====================================================

        blockchain_hash = block.get(
            "hash"
        )


        previous_hash = block.get(
            "previousHash"
        )


        block_index = block.get(
            "index"
        )


        # ====================================================
        # MONGODB
        # ====================================================

        if certificates_collection is not None:

            try:

                certificates_collection.insert_one({

                    "studentName":
                    student_name,

                    "fileName":
                    safe_filename,

                    "prediction":
                    prediction,

                    "confidence":
                    confidence_percentage,

                    "fakeDetections":
                    fake_detections,

                    "originalDetections":
                    original_detections,

                    "verificationStatus":
                    verification_status,

                    "fileHash":
                    file_hash,

                    "blockchainHash":
                    blockchain_hash,

                    "previousHash":
                    previous_hash,

                    "blockIndex":
                    block_index,

                    "timestamp":
                    datetime.now()

                })


            except Exception as mongo_error:

                print(
                    "MongoDB insert failed:",
                    mongo_error
                )


        # ====================================================
        # FINAL RESPONSE
        # ====================================================

        response_data = {

            "success":
            True,

            "studentName":
            student_name,

            "fileName":
            safe_filename,

            "prediction":
            prediction,

            "confidence":
            confidence_percentage,

            "fakeDetections":
            fake_detections,

            "originalDetections":
            original_detections,

            "verificationStatus":
            verification_status,

            "fileHash":
            file_hash,

            "blockchainHash":
            blockchain_hash,

            "previousHash":
            previous_hash,

            "blockIndex":
            block_index,

            # ------------------------------------------------
            # MODEL INFORMATION
            # ------------------------------------------------

            "model":
            "ResNet18",

            "modelAccuracy":
            96.67,

            # ------------------------------------------------
            # COMPATIBILITY FIELDS
            # ------------------------------------------------

            "index":
            block_index,

            "hash":
            blockchain_hash

        }


        # ====================================================
        # TERMINAL OUTPUT
        # ====================================================

        print("")
        print("========================================")
        print("VERIFICATION RESULT")
        print("========================================")


        print(
            "Student Name:",
            student_name
        )


        print(
            "Certificate:",
            safe_filename
        )


        print(
            "Model:",
            "ResNet18"
        )


        print(
            "Prediction:",
            prediction
        )


        print(
            "Confidence:",
            confidence_percentage,
            "%"
        )


        print(
            "Fake Detection:",
            fake_detections
        )


        print(
            "Original Detection:",
            original_detections
        )


        print(
            "SHA-256:",
            file_hash
        )


        print(
            "Blockchain Hash:",
            blockchain_hash
        )


        print(
            "Previous Hash:",
            previous_hash
        )


        print(
            "Block Index:",
            block_index
        )


        print("========================================")
        print("")


        return jsonify(
            response_data
        ), 200


    # ========================================================
    # ERROR
    # ========================================================

    except Exception as e:

        print("")
        print("UPLOAD ERROR:")
        print(e)
        print("")


        return jsonify({

            "success":
            False,

            "error":
            str(e)

        }), 500


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    print("")
    print("========================================")
    print(" BLOCKCHAIN CERTIFICATE VALIDATOR")
    print("========================================")


    print(
        "Backend URL: http://127.0.0.1:5000"
    )


    print(
        "Upload API:  http://127.0.0.1:5000/upload"
    )


    print(
        "Health API:  http://127.0.0.1:5000/health"
    )


    print(
        "Admin API:   http://127.0.0.1:5000/admin/stats"
    )


    print(
        "AI Model:    Fine-Tuned ResNet18"
    )


    print(
        "Validation:  96.67%"
    )


    print("========================================")
    print("")


    app.run(

        host="127.0.0.1",

        port=5000,

        debug=False

    )