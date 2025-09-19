# CRM API - Müşteri Yönetimi

Bu API, CRM sistemindeki müşteri verilerini yönetmek için kullanılır. Dış dünyaya açıktır ancak Access Token ile korunmaktadır.

## 📊 API Özellikleri

- ✅ **CRUD İşlemleri**: Müşteri ekleme, güncelleme, silme, listeleme
- ✅ **Arama ve Filtreleme**: İsim, email, telefon, şirket bazında arama
- ✅ **Pagination**: Büyük veri setleri için sayfalama desteği
- ✅ **JSON Formatı**: Modern REST API formatı
- ✅ **Hata Yönetimi**: Detaylı hata mesajları

## 🌐 Base URL

```
http://localhost:3001/api/public/customers
```

## 🔐 Access Token

**Access Token:** `crm-api-token-2025`

**Header Format:**
```
Authorization: Bearer crm-api-token-2025
```

## 📋 Endpoint'ler

### Müşteri Listeleme
- **GET** `/api/public/customers`
- **Parametreler**: `page`, `limit`, `q`, `isActive`
- **Örnek**: `GET /api/public/customers?page=1&limit=10&q=ahmet`

### Yeni Müşteri Ekleme
- **POST** `/api/public/customers`
- **Body**: `{ "name": "Müşteri Adı", "email": "email@example.com", "phone": "+905551234567", "company": "Şirket Adı" }`

### Tek Müşteri Getirme
- **GET** `/api/public/customers/[id]`
- **Örnek**: `GET /api/public/customers/123`

### Müşteri Güncelleme
- **PUT** `/api/public/customers/[id]`
- **Body**: Güncellenecek alanlar

### Müşteri Silme
- **DELETE** `/api/public/customers/[id]`

## 🧪 Test

### cURL ile Test Örnekleri

```bash
# Müşteri Listele
curl -H "Authorization: Bearer crm-api-token-2025" \
  "http://localhost:3001/api/public/customers?page=1&limit=5"

# Yeni Müşteri Ekle
curl -X POST "http://localhost:3001/api/public/customers" \
  -H "Authorization: Bearer crm-api-token-2025" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Müşteri",
    "email": "test@example.com",
    "phone": "+905551234567",
    "company": "Test Şirketi"
  }'

# Müşteri Güncelle
curl -X PUT "http://localhost:3001/api/public/customers/[ID]" \
  -H "Authorization: Bearer crm-api-token-2025" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Güncellenmiş Müşteri Adı"
  }'

# Müşteri Sil
curl -X DELETE "http://localhost:3001/api/public/customers/[ID]" \
  -H "Authorization: Bearer crm-api-token-2025"
```

### JavaScript ile Test

```javascript
// Müşteri Listeleme
async function getCustomers() {
  const response = await fetch('http://localhost:3001/api/public/customers', {
    headers: {
      'Authorization': 'Bearer crm-api-token-2025'
    }
  });
  return await response.json();
}

// Yeni Müşteri Ekleme
async function createCustomer(customerData) {
  const response = await fetch('http://localhost:3001/api/public/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer crm-api-token-2025'
    },
    body: JSON.stringify(customerData)
  });
  return await response.json();
}

// Müşteri Güncelleme
async function updateCustomer(id, updateData) {
  const response = await fetch(`http://localhost:3001/api/public/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer crm-api-token-2025'
    },
    body: JSON.stringify(updateData)
  });
  return await response.json();
}

// Müşteri Silme
async function deleteCustomer(id) {
  const response = await fetch(`http://localhost:3001/api/public/customers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer crm-api-token-2025'
    }
  });
  return await response.json();
}

// Örnek Kullanım
getCustomers().then(data => console.log(data));

createCustomer({
  name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  phone: '+905551234567',
  company: 'ABC Şirketi'
}).then(data => console.log(data));
```

## 📚 Detaylı Dokümantasyon

Detaylı API dokümantasyonu için `API_DOCUMENTATION.md` dosyasını inceleyebilirsiniz.

## 🔐 Dokümantasyon Erişimi

API dokümantasyonuna erişmek için:
1. Tarayıcınızdan `http://localhost:3001/document` adresine gidin
2. Şifre olarak `crm2024` girin
3. Tam API dokümantasyonunu ve kullanım örneklerini görüntüleyin

## 🔗 İlgili Linkler

- [CRM Admin Paneli](http://localhost:3001/admin/customers)
- [API Detaylı Dokümantasyon](./API_DOCUMENTATION.md)
- [Web Dokümantasyonu](http://localhost:3001/document)

---

**Önemli Not**: Bu API sadece test ve geliştirme amaçlıdır. Production ortamında kullanılmadan önce güvenlik önlemleri alınmalıdır.