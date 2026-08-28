import urllib.request
import json

API_KEY = "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g"
PROJECT_ID = "momsie-app"

# 1. Sign in with email and password to get idToken
url_signin = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
body = {"email": "sync.admin@momsie.id", "password": "MomsieAdmin123!", "returnSecureToken": True}
req = urllib.request.Request(url_signin, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode("utf-8"))
    id_token = res["idToken"]
    print("Auth Token obtained successfully!")

# 2. Test writing a user document with pregnancyProfile via Firestore REST API
doc_id = "USR-100"
firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/users/{doc_id}?key={API_KEY}"

user_data = {
    "fields": {
        "id": {"stringValue": "USR-100"},
        "uid": {"stringValue": "USR-100"},
        "name": {"stringValue": "Siti Rahmawati"},
        "email": {"stringValue": "siti.rahmawati1@gmail.com"},
        "phone": {"stringValue": "081234567890"},
        "domisili": {"stringValue": "Sleman, DI Yogyakarta"},
        "registeredAt": {"stringValue": "2026-06-01T10:00:00.000Z"},
        "status": {"stringValue": "aktif"},
        "totalOrders": {"integerValue": "3"},
        "totalSpend": {"integerValue": "97500"},
        "pregnancyProfile": {
            "mapValue": {
                "fields": {
                    "usiaRange": {"stringValue": "26-30 tahun"},
                    "faseKehamilan": {"stringValue": "Trimester 2"},
                    "kehamilanPertama": {"stringValue": "Ya"},
                    "butuhPendampingan": {"stringValue": "Sangat Membutuhkan (Skor 5/5)"},
                    "kebutuhanUtama": {"stringValue": "Persiapan persalinan, Prenatal Yoga, Konsultasi Doula"},
                    "fiturFavorit": {"stringValue": "Layanan Doula Care & Prenatal Yoga"},
                    "sumberInformasi": {"stringValue": "Dokter/Bidan, Rumah Sakit, Komunitas Ibu Hamil"},
                    "alasanMomsie": {"stringValue": "Kombinasi layanan profesional Doula & fitur digital terpadu"},
                    "estimasiHargaDoulaChat": {"stringValue": "Rp25.000-Rp35.000"},
                    "estimasiHargaDoulaFull": {"stringValue": "Rp2.000.000-Rp3.000.000"}
                }
            }
        }
    }
}

patch_req = urllib.request.Request(
    firestore_url,
    data=json.dumps(user_data).encode("utf-8"),
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {id_token}"},
    method="PATCH"
)

try:
    with urllib.request.urlopen(patch_req) as fresp:
        fres = json.loads(fresp.read().decode("utf-8"))
        print("SUCCESS! User document USR-100 with pregnancyProfile written to Cloud Firestore!")
        print("Doc Name:", fres.get("name"))
except Exception as e:
    print("FAILED:", e)
    if hasattr(e, "read"):
        print("Error details:", e.read().decode("utf-8"))
