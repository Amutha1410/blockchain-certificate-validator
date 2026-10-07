import hashlib
import json
import os
from datetime import datetime


BLOCKCHAIN_FILE = "blockchain.json"


def calculate_hash(data):
    data_string = json.dumps(
        data,
        sort_keys=True
    ).encode()

    return hashlib.sha256(data_string).hexdigest()


def get_last_hash():
    if not os.path.exists(BLOCKCHAIN_FILE):
        return "0"

    try:
        with open(BLOCKCHAIN_FILE, "r") as file:
            chain = json.load(file)

        if not chain:
            return "0"

        return chain[-1]["hash"]

    except Exception:
        return "0"


def add_block(
    student_name,
    file_name,
    file_hash,
    prediction,
    confidence
):

    previous_hash = get_last_hash()

    block = {
        "index": 1,
        "timestamp": datetime.now().isoformat(),
        "studentName": student_name,
        "fileName": file_name,
        "fileHash": file_hash,
        "prediction": prediction,
        "confidence": confidence,
        "previousHash": previous_hash
    }

    block["hash"] = calculate_hash(block)

    if os.path.exists(BLOCKCHAIN_FILE):

        try:
            with open(BLOCKCHAIN_FILE, "r") as file:
                chain = json.load(file)

        except Exception:
            chain = []

    else:
        chain = []

    block["index"] = len(chain) + 1

    # Recalculate hash after setting index
    block["hash"] = calculate_hash(block)

    chain.append(block)

    with open(BLOCKCHAIN_FILE, "w") as file:
        json.dump(
            chain,
            file,
            indent=4
        )

    return block