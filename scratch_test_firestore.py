import urllib.request
import json

API_KEY = "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g"
PROJECT_ID = "momsie-app"

# Test signUp with email and password
url_signup = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}"
body = {
    "email": "sync.admin@momsie.id",
    "password": "MomsieAdmin123!",
    "returnSecureToken": True
}
req = urllib.request.Request(url_signup, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        id_token = res["idToken"]
        user_id = res["localId"]
        print(f"SUCCESS! Auth Token obtained for email sync.admin@momsie.id (uid: {user_id})")
except Exception as e:
    # If account exists, signInWithPassword
    url_signin = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
    req = urllib.request.Request(url_signin, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            id_token = res["idToken"]
            user_id = res["localId"]
            print(f"SUCCESS! Signed in for sync.admin@momsie.id (uid: {user_id})")
    except Exception as e2:
        print("FAILED signin:", e2)

# Test writing to Firestore with authenticated user
if 'id_token' in locals():
    firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/users/{user_id}?key={API_KEY}"
    doc_body = {
        "fields": {
            "name": {"stringValue": "Sync Admin"},
            "email": {"stringValue": "sync.admin@momsie.id"},
            "uid": {"stringValue": user_id}
        }
    }
    patch_req = urllib.request.Request(
        firestore_url,
        data=json.dumps(doc_body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {id_token}"
        },
        method="PATCH"
    )
    try:
        with urllib.request.urlopen(patch_req) as fresp:
            fres = json.loads(fresp.read().decode("utf-8"))
            print("SUCCESS Writing to Firestore REST API:", fres.get("name"))
    except Exception as e3:
        print("FAILED Firestore write:", e3)
        if hasattr(e3, "read"):
            print("Error details:", e3.read().decode("utf-8"))
