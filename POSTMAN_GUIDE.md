# 🚀 CRM Admin API - Postman Kullanım Rehberi

## 📋 Genel Bakış

Bu rehber, CRM Admin sisteminin API'lerini Postman kullanarak test etmek için kapsamlı bir kılavuzdur. Tüm endpoint'leri adım adım öğreneceksiniz.

### 🎯 Ön Gereksinimler
- ✅ **Postman** uygulaması ([İndir](https://www.postman.com/downloads/))
- ✅ **CRM Admin** deployment URL'i
- ✅ **API Token** (`crm-api-token-2025`)

---

## 🔧 1. Postman Kurulumu ve İlk Ayarlar

### 1.1 Workspace Oluşturma
```
1. Postman'ı açın
2. "Workspaces" → "Create Workspace"
3. Name: "CRM Admin API"
4. Type: "Personal"
5. Create butonuna tıklayın
```

### 1.2 Environment Kurulumu
```
1. Sol sidebar'da "Environments" sekmesine tıklayın
2. "+" butonuna tıklayarak yeni environment oluşturun
3. Environment Name: "CRM Admin - Production"
4. Variables ekleyin:
```

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `https://fdggfh-73pn1zxc9-storytels-projects.vercel.app` | `{{base_url}}` |
| `api_token` | `crm-api-token-2025` | `{{api_token}}` |

```
5. Save butonuna tıklayın
6. Environment'ı aktif hale getirin (dropdown'dan seçin)
```

---

## 📁 2. Collection Oluşturma

### 2.1 Ana Collection
```
1. "Collections" sekmesine gidin
2. "+" butonuna tıklayın
3. Name: "CRM Admin API"
4. Description: "Customer Management API Endpoints"
5. Create butonuna tıklayın
```

### 2.2 Sub-Collections Oluşturma
Ana collection altında şu alt koleksiyonları oluşturun:

#### 📋 Customers API
#### 🔐 Authentication
#### 📊 Analytics

---

## 🔐 3. Authentication Kurulumu

### 3.1 Authorization Setup
```
1. Ana collection'ı açın (CRM Admin API)
2. "Authorization" tab'ına gidin
3. Type: "Bearer Token"
4. Token: {{api_token}}
5. ✅ "Inherit auth from parent" aktif olsun
```

### 3.2 Headers Kurulumu
```
1. Ana collection'da "Headers" tab'ına gidin
2. Aşağıdaki header'ı ekleyin:
   - Key: Content-Type
   - Value: application/json
3. ✅ "Inherit headers from parent" aktif olsun
```

---

## 🧪 4. API Testleri

### 4.1 🔍 GET - Tüm Müşterileri Listele

#### Request Oluşturma
```
1. Customers API sub-collection'ında yeni request oluşturun
2. Name: "Get All Customers"
3. Method: GET
4. URL: {{base_url}}/api/public/customers
5. Save butonuna tıklayın
```

#### Test Scripti Ekleyin
```
Tests tab'ına aşağıdaki kodu ekleyin:

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has customers array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

#### Send butonuna tıklayın ve sonucu kontrol edin ✅

---

### 4.2 ➕ POST - Yeni Müşteri Oluştur

#### Request Oluşturma
```
1. Yeni request oluşturun
2. Name: "Create New Customer"
3. Method: POST
4. URL: {{base_url}}/api/public/customers
5. Body tab'ına gidin
6. raw ve JSON seçin
```

#### Request Body
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet.yilmaz@email.com",
  "phone": "+905551234567",
  "company": "ABC Şirketi",
  "isActive": true,
  "notes": {
    "source": "website",
    "priority": "high"
  }
}
```

#### Test Scripti
```
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has customer data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData.name).to.eql("Ahmet Yılmaz");
});

// Customer ID'yi environment variable'a kaydet
const jsonData = pm.response.json();
pm.environment.set("customer_id", jsonData.id);
```

---

### 4.3 🔍 GET - Tek Müşteri Detayı

#### Request Oluşturma
```
1. Yeni request oluşturun
2. Name: "Get Customer by ID"
3. Method: GET
4. URL: {{base_url}}/api/public/customers/{{customer_id}}
```

#### Test Scripti
```
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Customer data is correct", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.name).to.eql("Ahmet Yılmaz");
    pm.expect(jsonData.email).to.eql("ahmet.yilmaz@email.com");
});
```

---

### 4.4 ✏️ PUT - Müşteri Güncelle

#### Request Oluşturma
```
1. Yeni request oluşturun
2. Name: "Update Customer"
3. Method: PUT
4. URL: {{base_url}}/api/public/customers/{{customer_id}}
```

#### Request Body
```json
{
  "name": "Ahmet Yılmaz (Güncellendi)",
  "phone": "+905559876543",
  "company": "XYZ Corporation",
  "notes": {
    "source": "website",
    "priority": "high",
    "updated": true
  }
}
```

#### Test Scripti
```
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Customer updated successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.name).to.eql("Ahmet Yılmaz (Güncellendi)");
    pm.expect(jsonData.phone).to.eql("+905559876543");
});
```

---

### 4.5 🗑️ DELETE - Müşteri Sil

#### Request Oluşturma
```
1. Yeni request oluşturun
2. Name: "Delete Customer"
3. Method: DELETE
4. URL: {{base_url}}/api/public/customers/{{customer_id}}
```

#### Test Scripti
```
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Customer deleted successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
});
```

---

## 🔄 5. Runner ile Toplu Test

### 5.1 Collection Runner Kurulumu
```
1. Ana collection'a sağ tıklayın
2. "Run collection" seçeneğine tıklayın
3. Environment: "CRM Admin - Production"
4. Iterations: 1
5. Delay: 1000ms (istekler arası bekleme)
```

### 5.2 Test Sonuçlarını İnceleme
```
✅ Status Code: 200 OK
✅ Response Time: < 2000ms
✅ Response Body: Valid JSON
✅ Required Fields: Present
```

---

## 🐛 6. Troubleshooting

### 6.1 Common Errors

#### ❌ 401 Unauthorized
```
Çözüm:
- Authorization header'ını kontrol edin
- Token'ın doğru olduğundan emin olun
- Environment variable'larının set edildiğini kontrol edin
```

#### ❌ 404 Not Found
```
Çözüm:
- URL'yi kontrol edin
- Base URL'in doğru olduğundan emin olun
- Endpoint path'ini kontrol edin
```

#### ❌ 400 Bad Request
```
Çözüm:
- Request body'nin JSON formatında olduğundan emin olun
- Required field'ların eksik olmadığını kontrol edin
- Data type'larının doğru olduğunu kontrol edin
```

#### ❌ 500 Internal Server Error
```
Çözüm:
- Server loglarını kontrol edin
- Request body'nin doğru formatta olduğunu kontrol edin
- Network bağlantısını kontrol edin
```

---

## 🎯 7. Advanced Features

### 7.1 Query Parameters Kullanımı

#### Filtreleme ve Sayfalama
```
GET {{base_url}}/api/public/customers?page=1&limit=10&q=ahmet&isActive=true
```

#### Sort ve Order
```
GET {{base_url}}/api/public/customers?sort=name&order=asc
```

### 7.2 Data Generation Scripts

#### Pre-request Script Örneği
```javascript
// Random customer data oluştur
const names = ["Ali", "Ayşe", "Mehmet", "Fatma", "Ahmet"];
const surnames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin"];

const randomName = names[Math.floor(Math.random() * names.length)];
const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];

pm.globals.set("random_customer_name", `${randomName} ${randomSurname}`);
pm.globals.set("random_email", `${randomName.toLowerCase()}.${randomSurname.toLowerCase()}@example.com`);
```

### 7.3 Automated Testing

#### Newman ile CLI Test
```bash
# Postman collection'ını export edin
# Sonra Newman ile çalıştırın
npm install -g newman
newman run crm-admin-api.postman_collection.json -e crm-admin-production.postman_environment.json
```

---

## 📊 8. Monitoring ve Analytics

### 8.1 Response Time Monitoring
```javascript
pm.test("Response time is acceptable", function () {
    const responseTime = pm.response.responseTime;

    if (responseTime < 500) {
        pm.expect(responseTime).to.be.below(500);
    } else if (responseTime < 1000) {
        console.warn(`Slow response: ${responseTime}ms`);
    } else {
        pm.expect.fail(`Very slow response: ${responseTime}ms`);
    }
});
```

### 8.2 Data Validation Tests
```javascript
pm.test("Customer data structure is valid", function () {
    const customer = pm.response.json();

    // Schema validation
    pm.expect(customer).to.have.property('id');
    pm.expect(customer).to.have.property('name');
    pm.expect(customer).to.have.property('email');
    pm.expect(customer).to.have.property('createdAt');
    pm.expect(customer).to.have.property('updatedAt');

    // Data type validation
    pm.expect(customer.id).to.be.a('string');
    pm.expect(customer.name).to.be.a('string');
    pm.expect(customer.isActive).to.be.a('boolean');
});
```

---

## 📝 9. Best Practices

### ✅ Do's
- 🔄 Environment variables kullanın
- 📝 Descriptive request names verin
- 🧪 Test scriptleri yazın
- 📚 Documentation ekleyin
- 🔄 Regular backup alın
- 👥 Team workspace kullanın

### ❌ Don'ts
- 🚫 Hard-coded URL'ler kullanmayın
- 🚫 Sensitive data'yı loglamayın
- 🚫 Production token'ları paylaşmayın
- 🚫 Test olmadan deploy etmeyin
- 🚫 Version control olmadan çalışmayın

---

## 🎉 Başlangıç Checklist'i

- [ ] Postman workspace oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Authentication kuruldu
- [ ] İlk GET request test edildi
- [ ] POST request ile data oluşturuldu
- [ ] PUT request ile data güncellendi
- [ ] DELETE request ile data silindi
- [ ] Collection runner test edildi
- [ ] Error handling test edildi

---

## 📞 Support

Herhangi bir sorun yaşarsanız:

1. **Postman Console**'u kontrol edin (View → Show Postman Console)
2. **Network tab**'ında request detaylarını inceleyin
3. **Environment variables**'ın doğru set edildiğini kontrol edin
4. **API Documentation**'ı tekrar okuyun

**Happy Testing! 🧪✨**
