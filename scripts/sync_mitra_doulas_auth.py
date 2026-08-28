import urllib.request
import json
import time

API_KEY = "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g"
PROJECT_ID = "momsie-app"

femaleNames = [
    "Siti Rahmawati", "Anisa Putri", "Dewi Lestari", "Bunga Citra", "Nurul Aini",
    "Rina Astuti", "Fitriani Agustina", "Dian Sastrowardoyo", "Maya Indah Permata", "Ratna Juwita",
    "Tari Melati", "Eka Yuliana", "Intan Permata Sari", "Amanda Putri", "Ningrum Wulandari",
    "Melati Sukma Dewi", "Nabila Maharani", "Rizky Amelia", "Utami Sri Handayani", "Sri Handayani",
    "Yulia Lestari", "Clarissa Anggraini", "Tari Rahayu", "Farida Nur Aini", "Kusuma Wardani",
    "Nadya Safira", "Alya Rahma", "Bella Kartika", "Tri Utami", "Wulan Dari",
    "Shinta Prameswari", "Kartika Sari", "Endang Sri Wahyuni", "Larasati Anggraeni", "Mega Kusuma Dewi",
    "Novita Sari", "Pratiwi Rahmawati", "Retno Palupi", "Sari Asih", "Tiara Maharani",
    "Widya Wulandari", "Yuni Shara", "Zulaikha Rahma", "Ayu Tingting", "Cinta Laura",
    "Desy Ratnasari", "Erlina Febriani", "Febby Rastanty", "Gita Gutawa", "Hesti Purwadinata"
]

rolesPool = [
    "Doula (On-going Certified)", "Bidan (On-going Certified)",
    "Hypnobirthing Practitioner (On-going Certified)", "Birth Doula (On-going Certified)",
    "Doula Certified", "Postpartum Doula (On-going Certified)"
]

cities = [
    "Sleman, DI Yogyakarta", "Bantul, DI Yogyakarta", "Kota Yogyakarta, DI Yogyakarta",
    "Kulon Progo, DI Yogyakarta", "Gunungkidul, DI Yogyakarta", "Daerah Istimewa Yogyakarta",
    "Solo, Jawa Tengah", "Klaten, Jawa Tengah", "Magelang, Jawa Tengah"
]

def get_or_create_doula_auth(email, password="DoulaMomsie123!"):
    url_signup = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}"
    body = {"email": email, "password": password, "returnSecureToken": True}
    req = urllib.request.Request(url_signup, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            return res["idToken"], res["localId"]
    except Exception:
        url_signin = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
        req = urllib.request.Request(url_signin, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            return res["idToken"], res["localId"]

def sync_50_doulas():
    print("Syncing 50 Female Mitra Doulas to Cloud Firestore 'mitra' collection...")
    
    count = 0
    for i in range(50):
        email = f"doula.{i + 1}@momsie.id"
        name = femaleNames[i % len(femaleNames)]
        role = rolesPool[i % len(rolesPool)]
        city = cities[i % len(cities)]

        token, uid = get_or_create_doula_auth(email)
        
        firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/mitra/{uid}?key={API_KEY}"
        mitra_data = {
            "fields": {
                "id": {"stringValue": uid},
                "uid": {"stringValue": uid},
                "name": {"stringValue": name},
                "email": {"stringValue": email},
                "pekerjaan": {"stringValue": role},
                "kotaProvinsi": {"stringValue": city},
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
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
            method="PATCH"
        )

        try:
            with urllib.request.urlopen(patch_req) as fresp:
                fres = json.loads(fresp.read().decode("utf-8"))
                count += 1
        except Exception as e:
            print(f"Error syncing doula {i+1}:", e)

    print(f"SUCCESS! {count} Female Mitra Doula documents written to 'mitra' collection in Cloud Firestore!")

sync_50_doulas()
