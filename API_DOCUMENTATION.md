# CRM Admin - Customers API Documentation

## 📋 Genel Bakış

Bu API, CRM sistemindeki müşteri yönetimi için kullanılır. Tüm endpoint'ler authentication ve permission kontrolü gerektirir.

**Base URL:** `https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers`


tüm document vs. her şeyi url ile değiştir : 

@https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/ 

## 🔐 Authentication

Tüm API istekleri için aşağıdaki authentication bilgileri gereklidir:

- **Access Token:** Bearer token formatında
- **Token:** `crm-api-token-2025` (test için)

**Header Format:**
```
Authorization: Bearer crm-api-token-2025
```

**Örnek İstek:**
```bash
curl -X GET "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers" \
  -H "Authorization: Bearer crm-api-token-2025"
```

## 📊 Veri Modeli

### Customer Model

```typescript
type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  isActive: boolean;
  notes?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};
```

### API Response Format

```typescript
type SuccessResponse<T> = {
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ErrorResponse = {
  error: string;
};
```

## 🛠️ Endpoint'ler

### 1. Müşteri Listele (GET)

**Endpoint:** `/api/admin/customers`

**Method:** `GET`

**Permission:** `admin.customers.view`

**Query Parametreleri:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| `page` | number | Hayır | Sayfa numarası (default: 1) |
| `limit` | number | Hayır | Sayfa başına ürün (default: 20) |
| `q` | string | Hayır | Arama sorgusu |
| `isActive` | boolean | Hayır | Aktif filtresi |

**Örnek İstek:**

```bash
curl -X GET "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/admin/customers?page=1&limit=10&q=ahmet&isActive=true" \
  -H "Cookie: ecu_session=your_session_token"
```

**Örnek Cevap:**

```json
{
  "items": [
    {
      "id": "clx1a2b3c4d5e6f7g8h9",
      "name": "Ahmet Yılmaz",
      "email": "ahmet@example.com",
      "phone": "+90 555 123 4567",
      "company": "ABC Şirketi",
      "isActive": true,
      "notes": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 2. Yeni Müşteri Oluştur (POST)

**Endpoint:** `/api/admin/customers`

**Method:** `POST`

**Permission:** `customers.create`

**Request Body:**

```typescript
{
  name: string;           // Zorunlu
  email?: string;         // Opsiyonel
  phone?: string;         // Opsiyonel
  company?: string;       // Opsiyonel
  notes?: Record<string, unknown>;  // Opsiyonel
  isActive?: boolean;     // Opsiyonel (default: true)
}
```

**Örnek İstek:**

```bash
curl -X POST "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/admin/customers" \
  -H "Content-Type: application/json" \
  -H "Cookie: ecu_session=your_session_token" \
  -d '{
    "name": "Mehmet Demir",
    "email": "mehmet@example.com",
    "phone": "+90 555 987 6543",
    "company": "XYZ Teknoloji",
    "notes": {"source": "website", "interest": "chiptuning"},
    "isActive": true
  }'
```

**Örnek Cevap:**

```json
{
  "message": "Müşteri oluşturuldu",
  "data": {
    "id": "clx2b3c4d5e6f7g8h9i0",
    "name": "Mehmet Demir",
    "email": "mehmet@example.com",
    "phone": "+90 555 987 6543",
    "company": "XYZ Teknoloji",
    "isActive": true,
    "notes": {
      "source": "website",
      "interest": "chiptuning"
    },
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### 3. Tek Müşteri Getir (GET)

**Endpoint:** `/api/admin/customers/[id]`

**Method:** `GET`

**Permission:** `admin.customers.view`

**Örnek İstek:**

```bash
curl -X GET "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/admin/customers/clx2b3c4d5e6f7g8h9i0" \
  -H "Cookie: ecu_session=your_session_token"
```

**Örnek Cevap:**

```json
{
  "id": "clx2b3c4d5e6f7g8h9i0",
  "name": "Mehmet Demir",
  "email": "mehmet@example.com",
  "phone": "+90 555 987 6543",
  "company": "XYZ Teknoloji",
  "isActive": true,
  "notes": {
    "source": "website",
    "interest": "chiptuning"
  },
  "createdAt": "2024-01-15T10:35:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

### 4. Müşteri Güncelle (PUT)

**Endpoint:** `/api/admin/customers/[id]`

**Method:** `PUT`

**Permission:** `customers.update`

**Request Body:** Sadece güncellenecek alanlar

```typescript
{
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: Record<string, unknown>;
  isActive?: boolean;
}
```

**Örnek İstek:**

```bash
curl -X PUT "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/admin/customers/clx2b3c4d5e6f7g8h9i0" \
  -H "Content-Type: application/json" \
  -H "Cookie: ecu_session=your_session_token" \
  -d '{
    "name": "Mehmet Demir (Güncellendi)",
    "phone": "+90 555 111 2222",
    "company": "XYZ Teknoloji A.Ş."
  }'
```

**Örnek Cevap:**

```json
{
  "message": "Müşteri güncellendi",
  "data": {
    "id": "clx2b3c4d5e6f7g8h9i0",
    "name": "Mehmet Demir (Güncellendi)",
    "email": "mehmet@example.com",
    "phone": "+90 555 111 2222",
    "company": "XYZ Teknoloji A.Ş.",
    "isActive": true,
    "notes": {
      "source": "website",
      "interest": "chiptuning"
    },
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

### 5. Müşteri Sil (DELETE)

**Endpoint:** `/api/admin/customers/[id]`

**Method:** `DELETE`

**Permission:** `customers.delete`

**Örnek İstek:**

```bash
curl -X DELETE "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/admin/customers/clx2b3c4d5e6f7g8h9i0" \
  -H "Cookie: ecu_session=your_session_token"
```

**Örnek Cevap:**

```json
{
  "message": "Müşteri silindi"
}
```

## 📝 Hata Kodları

| Status Code | Açıklama |
|-------------|----------|
| 200 | Başarılı |
| 201 | Kayıt başarılı |
| 400 | Geçersiz istek |
| 401 | Authentication hatası |
| 403 | Permission hatası |
| 404 | Kayıt bulunamadı |
| 500 | Sunucu hatası |

## 🔄 CRUD İşlem Örnekleri

### JavaScript/TypeScript Örnekleri

```typescript
// Müşteri Listeleme
async function getCustomers(page = 1, limit = 20, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });

  const response = await fetch(`/api/admin/customers?${params}`, {
    method: 'GET',
    headers: {
      'Cookie': `ecu_session=${sessionToken}`
    }
  });

  return response.json();
}

// Yeni Müşteri Oluşturma
async function createCustomer(customerData) {
  const response = await fetch('/api/admin/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `ecu_session=${sessionToken}`
    },
    body: JSON.stringify(customerData)
  });

  return response.json();
}

// Müşteri Güncelleme
async function updateCustomer(id, updateData) {
  const response = await fetch(`/api/admin/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `ecu_session=${sessionToken}`
    },
    body: JSON.stringify(updateData)
  });

  return response.json();
}

// Müşteri Silme
async function deleteCustomer(id) {
  const response = await fetch(`/api/admin/customers/${id}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `ecu_session=${sessionToken}`
    }
  });

  return response.json();
}
```

### Python Örnekleri

```python
import requests
import json

class CustomerAPI:
    def __init__(self, base_url, session_token):
        self.base_url = base_url
        self.session_token = session_token
        self.headers = {
            'Cookie': f'ecu_session={session_token}',
            'Content-Type': 'application/json'
        }

    def get_customers(self, page=1, limit=20, q=None, is_active=None):
        params = {'page': page, 'limit': limit}
        if q:
            params['q'] = q
        if is_active is not None:
            params['isActive'] = is_active

        response = requests.get(
            f'{self.base_url}/api/admin/customers',
            params=params,
            headers=self.headers
        )
        return response.json()

    def create_customer(self, customer_data):
        response = requests.post(
            f'{self.base_url}/api/admin/customers',
            json=customer_data,
            headers=self.headers
        )
        return response.json()

    def update_customer(self, customer_id, update_data):
        response = requests.put(
            f'{self.base_url}/api/admin/customers/{customer_id}',
            json=update_data,
            headers=self.headers
        )
        return response.json()

    def delete_customer(self, customer_id):
        response = requests.delete(
            f'{self.base_url}/api/admin/customers/{customer_id}',
            headers=self.headers
        )
        return response.json()
```

## 📚 Ek Bilgiler

- **Pagination:** Tüm listeleme endpoint'leri pagination destekler
- **Arama:** `q` parametresi ile isim, email, telefon ve şirket alanlarında arama yapılabilir
- **Filtreleme:** `isActive` parametresi ile aktif/pasif müşteriler filtrelenebilir
- **Audit Trail:** Tüm değişiklikler kim tarafından yapıldığı kaydedilir
- **Validation:** Gerekli alanlar için otomatik validation yapılır

## 🛡️ Güvenlik

- Tüm endpoint'ler authentication gerektirir
- Her endpoint için permission kontrolü yapılır
- SQL injection önlemleri alınmıştır
- CSRF koruması mevcuttur

---

**Not:** Bu API sadece yetkili kullanıcılar tarafından kullanılabilir. API erişimi için gerekli permission'lara sahip olmanız gerekmektedir.