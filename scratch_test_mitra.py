import urllib.request
import json

API_KEY = "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g"
PROJECT_ID = "momsie-app"

url_signin = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
body = {"email": "sync.admin@momsie.id", "password": "MomsieAdmin123!", "returnSecureToken": True}
req = urllib.request.Request(url_signin, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode("utf-8"))
    id_token = res["idToken"]

# Test writing doc in 'mitra' collection
firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/mitra/doula_anastasia?key={API_KEY}"
mitra_data = {
    "fields": {
        "id": {"stringValue": "doula_anastasia"},
        "name": {"stringValue": "Anastasia Mawardi"},
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
        print("SUCCESS writing to mitra collection:", fres.get("name"))
except Exception as e:
    print("FAILED:", e)
    if hasattr(e, "read"):
        print("Error details:", e.read().decode("utf-8"))
