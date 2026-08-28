import urllib.request
import json

API_KEY = "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g"
PROJECT_ID = "momsie-app"

# 1. Create or Sign in Doula Auth User
url_signup = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}"
body = {"email": "doula.anastasia@momsie.id", "password": "DoulaMomsie123!", "returnSecureToken": True}
req = urllib.request.Request(url_signup, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        id_token = res["idToken"]
        user_id = res["localId"]
except Exception:
    url_signin = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
    req = urllib.request.Request(url_signin, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        id_token = res["idToken"]
        user_id = res["localId"]

print(f"Auth Token obtained for Doula UID: {user_id}")

# 2. Write to mitra/{user_id}
firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/mitra/{user_id}?key={API_KEY}"
mitra_data = {
    "fields": {
        "id": {"stringValue": user_id},
        "uid": {"stringValue": user_id},
        "name": {"stringValue": "Anastasia Mawardi"},
        "email": {"stringValue": "doula.anastasia@momsie.id"},
        "pekerjaan": {"stringValue": "Bidan (On-going Certified)"},
        "kotaProvinsi": {"stringValue": "Daerah Istimewa Yogyakarta"},
        "role": {"stringValue": "Doula"},
        "saldo_escrow": {"integerValue": "0"},
        "saldo_tersedia": {"integerValue": "0"},
        "totalPendapatan": {"integerValue": "0"},
        "isAvailable": {"booleanValue": True},
        "rating": {"doubleValue": 5.0}
    }
}

patch_req = urllib.request.Request(
    firestore_url,
    data=json.dumps(mitra_data).encode("utf-8"),
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {id_token}"},
    method="PATCH"
)

try:
    with urllib.request.urlopen(patch_req) as fresp:
        fres = json.loads(fresp.read().decode("utf-8"))
        print("SUCCESS writing to mitra collection with matching UID!", fres.get("name"))
except Exception as e:
    print("FAILED:", e)
    if hasattr(e, "read"):
        print("Error details:", e.read().decode("utf-8"))
