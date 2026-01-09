# 🎯 FRONTEND USER - HƯỚNG DẪN TÍCH HỢP PREMIUM & PAYMENT

> **Dành cho:** Frontend Developer (User-facing features)  
> **Tech Stack:** ReactJS + Vite + Tailwind CSS  
> **Backend Base URL:** `http://localhost:8080/api/v1`  
> **Frontend Redirect URL:** `http://localhost:3000` (có thể thay đổi trong config)

---

## 📚 MỤC LỤC

1. [Tech Stack & Setup](#1-tech-stack--setup)
2. [Tổng quan Flow](#2-tổng-quan-flow)
3. [Authentication](#3-authentication)
4. [API Endpoints](#4-api-endpoints)
5. [Tích hợp từng tính năng](#5-tích-hợp-từng-tính-năng)
6. [UI/UX Examples](#6-uiux-examples)
7. [Error Handling](#7-error-handling)
8. [Testing Guide](#8-testing-guide)

---

## 1. TECH STACK & SETUP

### 🛠️ Tech Stack

- **Framework:** React 18.x
- **Build Tool:** Vite 5.x
- **Styling:** Tailwind CSS 3.x
- **Routing:** React Router 6.x
- **HTTP Client:** Fetch API / Axios
- **Charts:** Chart.js / Recharts (optional)
- **Icons:** Lucide React / Heroicons

### 📦 Installation

```bash
# Tạo project mới với Vite
npm create vite@latest engapp-frontend -- --template react
cd engapp-frontend

# Cài đặt dependencies
npm install

# Cài Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Cài các packages cần thiết
npm install react-router-dom
npm install axios  # hoặc dùng fetch API built-in
npm install chart.js react-chartjs-2  # nếu cần charts
npm install lucide-react  # icons
```

### ⚙️ Tailwind CSS Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        premium: "#fbbf24",
      },
    },
  },
  plugins: [],
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer components {
  .btn-primary {
    @apply bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200;
  }

  .btn-secondary {
    @apply bg-secondary hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200;
  }

  .btn-danger {
    @apply bg-danger hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200;
  }

  .card {
    @apply bg-white rounded-lg shadow-lg p-6;
  }

  .premium-badge {
    @apply inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold;
  }
}
```

### 🚀 Project Structure

```
src/
├── components/
│   ├── payment/
│   │   ├── PricingPage.jsx
│   │   ├── PaymentSuccess.jsx
│   │   ├── PaymentFailure.jsx
│   │   └── UpgradeModal.jsx
│   ├── subscription/
│   │   ├── SubscriptionPage.jsx
│   │   └── PremiumBadge.jsx
│   └── common/
│       ├── PremiumChecker.jsx
│       └── LoadingSpinner.jsx
├── hooks/
│   ├── usePremiumFeatures.js
│   └── usePayment.js
├── services/
│   ├── api.js
│   └── paymentService.js
├── utils/
│   ├── auth.js
│   └── errorHandler.js
├── App.jsx
└── main.jsx
```

---

## 2. TỔNG QUAN FLOW

### 🔄 Payment Flow Diagram

```
[User] → Chọn gói Premium
   ↓
[Frontend] → POST /api/v1/payment/create
   ↓
[Backend] → Tạo transaction → Trả về VNPay URL
   ↓
[Frontend] → Redirect user đến VNPay
   ↓
[User] → Nhập thông tin thanh toán tại VNPay
   ↓
[VNPay] → Callback to Backend → GET /api/v1/payment/vnpay-callback
   ↓
[Backend] → Verify signature → Update transaction → Create/Renew subscription
   ↓
[Backend] → Redirect to Frontend
   ↓
[Frontend] → Hiển thị kết quả (Success/Failure)
   ↓
[User] → Check subscription status
```

### 🎨 Premium Features

| Feature                  | Free User    | Premium User |
| ------------------------ | ------------ | ------------ |
| **Dịch thuật**           | 10 lượt/ngày | Unlimited    |
| **Bài test**             | 5 bài/tháng  | Unlimited    |
| **Đọc bài báo**          | Limited      | Unlimited    |
| **Tải audio**            | ❌ No        | ✅ Yes       |
| **Xem lịch sử chi tiết** | ❌ No        | ✅ Yes       |

---

## 3. AUTHENTICATION

### Headers cần thiết

```javascript
// Tất cả requests (trừ callback) cần có JWT token
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};
```

### Lấy thông tin user hiện tại

```javascript
// User info đã có trong JWT token hoặc context
const userId = getCurrentUser().id;
```

---

## 4. API ENDPOINTS

### 📋 User Payment APIs

| Method | Endpoint                       | Auth | Description             |
| ------ | ------------------------------ | ---- | ----------------------- |
| POST   | `/payment/create`              | ✅   | Tạo payment URL         |
| GET    | `/payment/vnpay-callback`      | ❌   | VNPay callback (public) |
| GET    | `/payment/transaction/{code}`  | ✅   | Chi tiết transaction    |
| GET    | `/payment/history`             | ✅   | Lịch sử giao dịch       |
| GET    | `/payment/subscription`        | ✅   | Thông tin subscription  |
| GET    | `/payment/check-premium`       | ✅   | Kiểm tra premium status |
| POST   | `/payment/subscription/cancel` | ✅   | Hủy subscription        |
| GET    | `/payment/features`            | ✅   | Check quyền features    |

---

## 5. TÍCH HỢP TỪNG TÍNH NĂNG

### 5.1. 🛍️ TRANG CHỌN GÓI PREMIUM

#### UI Components với Tailwind CSS:

```jsx
// components/payment/PricingPage.jsx
import { useState } from "react";
import { Crown, Check } from "lucide-react";

const SUBSCRIPTION_PLANS = [
  {
    type: "PREMIUM_MONTHLY",
    name: "Premium Monthly",
    price: 99000,
    duration: "1 tháng",
    features: [
      "Dịch thuật không giới hạn",
      "Tất cả bài test",
      "Đọc mọi bài báo",
      "Tải audio",
      "Lịch sử chi tiết",
    ],
  },
  {
    type: "PREMIUM_YEARLY",
    name: "Premium Yearly",
    price: 990000,
    duration: "12 tháng",
    features: ["Tất cả tính năng Monthly", "Tiết kiệm 17%", "Ưu tiên hỗ trợ"],
    badge: "Tiết kiệm nhất",
  },
];

function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyPremium = async (subscriptionType) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/v1/payment/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionType: subscriptionType,
            bankCode: null, // User chọn bank tại VNPay
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Không thể tạo thanh toán");
      }

      const data = await response.json();

      // Redirect to VNPay
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Lỗi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pricing-container">
      <h1>Nâng cấp Premium</h1>
      <div className="pricing-cards">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div key={plan.type} className="pricing-card">
            {plan.badge && <span className="badge">{plan.badge}</span>}
            <h2>{plan.name}</h2>
            <div className="price">{plan.price.toLocaleString("vi-VN")} ₫</div>
            <p className="duration">{plan.duration}</p>
            <ul className="features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>✅ {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleBuyPremium(plan.type)}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? "Đang xử lý..." : "Mua ngay"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### API Request Example:

```javascript
// POST /api/v1/payment/create
const createPayment = async (subscriptionType) => {
  const response = await fetch("http://localhost:8080/api/v1/payment/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscriptionType: "PREMIUM_MONTHLY", // or 'PREMIUM_YEARLY'
      bankCode: null, // optional, user chọn tại VNPay
    }),
  });

  const data = await response.json();
  // Response: { paymentUrl: "https://sandbox.vnpayment.vn/...", transactionCode: "ABC123", message: "..." }

  return data;
};
```

**Response Format:**

```json
{
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=9900000&...",
  "transactionCode": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Payment URL created successfully"
}
```

---

### 4.2. ✅ TRANG KẾT QUẢ THANH TOÁN

#### Success Page:

```jsx
// PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transactionCode = searchParams.get("transaction");

    if (transactionCode) {
      fetchTransactionDetail(transactionCode);
    }
  }, [searchParams]);

  const fetchTransactionDetail = async (code) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/payment/transaction/${code}`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      const data = await response.json();
      setTransaction(data);
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="payment-success">
      <div className="success-icon">✅</div>
      <h1>Thanh toán thành công!</h1>

      {transaction && (
        <div className="transaction-details">
          <p>
            <strong>Mã giao dịch:</strong> {transaction.transactionCode}
          </p>
          <p>
            <strong>Gói đã mua:</strong> {transaction.subscriptionType}
          </p>
          <p>
            <strong>Số tiền:</strong>{" "}
            {transaction.amount.toLocaleString("vi-VN")} ₫
          </p>
          <p>
            <strong>Thời gian:</strong>{" "}
            {new Date(transaction.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      )}

      <div className="success-message">
        <p>🎉 Tài khoản Premium của bạn đã được kích hoạt!</p>
        <p>Bạn có thể sử dụng tất cả tính năng Premium ngay bây giờ.</p>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => navigate("/premium/subscription")}
          className="btn-primary"
        >
          Xem thông tin Premium
        </button>
        <button
          onClick={() => navigate("/payment/history")}
          className="btn-secondary"
        >
          Xem lịch sử giao dịch
        </button>
      </div>
    </div>
  );
}
```

#### Failure Page:

```jsx
// PaymentFailure.jsx
function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionCode = searchParams.get("transaction");

  return (
    <div className="payment-failure">
      <div className="error-icon">❌</div>
      <h1>Thanh toán thất bại</h1>

      <div className="error-message">
        <p>Rất tiếc, giao dịch của bạn không thành công.</p>
        <p className="transaction-code">Mã giao dịch: {transactionCode}</p>
      </div>

      <div className="possible-reasons">
        <h3>Nguyên nhân có thể:</h3>
        <ul>
          <li>Thông tin thẻ không chính xác</li>
          <li>Tài khoản không đủ số dư</li>
          <li>Ngân hàng từ chối giao dịch</li>
          <li>Phiên thanh toán hết hạn</li>
        </ul>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate("/pricing")} className="btn-primary">
          Thử lại
        </button>
        <button onClick={() => navigate("/")} className="btn-secondary">
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
```

---

### 4.3. 👤 TRANG QUẢN LÝ SUBSCRIPTION

```jsx
// SubscriptionPage.jsx
import { useEffect, useState } from "react";

function SubscriptionPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/payment/subscription",
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn hủy Premium? Bạn vẫn có thể sử dụng đến hết hạn."
      )
    ) {
      return;
    }

    try {
      setCanceling(true);

      const response = await fetch(
        "http://localhost:8080/api/v1/payment/subscription/cancel",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      if (response.ok) {
        alert("Đã hủy subscription thành công");
        fetchSubscription(); // Refresh data
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Lỗi: " + error.message);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  if (!subscription || !subscription.isActive) {
    return (
      <div className="no-subscription">
        <h2>Bạn chưa có Premium</h2>
        <p>Nâng cấp để truy cập tất cả tính năng!</p>
        <button onClick={() => navigate("/pricing")} className="btn-primary">
          Xem gói Premium
        </button>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="subscription-card">
        <div className="premium-badge">👑 Premium</div>

        <div className="subscription-info">
          <h2>{subscription.subscriptionType.replace("_", " ")}</h2>

          <div className="dates">
            <p>
              <strong>Ngày bắt đầu:</strong>
              {new Date(subscription.startDate).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Ngày hết hạn:</strong>
              {new Date(subscription.endDate).toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="days-remaining">
            <div className="progress-circle">{subscription.daysRemaining}</div>
            <p>ngày còn lại</p>
          </div>

          <div className="features-status">
            <h3>Quyền lợi của bạn:</h3>
            <ul>
              <li>
                ✅ Dịch thuật:
                {subscription.dailyTranslationLimit
                  ? `${subscription.dailyTranslationLimit}/ngày`
                  : "Unlimited"}
              </li>
              <li>
                ✅ Bài test:
                {subscription.monthlyTestLimit
                  ? `${subscription.monthlyTestLimit}/tháng`
                  : "Unlimited"}
              </li>
              <li>✅ Đọc bài báo: Unlimited</li>
              <li>✅ Tải audio: Có</li>
            </ul>
          </div>

          {subscription.autoRenew && (
            <div className="auto-renew-notice">
              ℹ️ Tự động gia hạn khi hết hạn
            </div>
          )}
        </div>

        <div className="subscription-actions">
          <button
            onClick={() => navigate("/pricing")}
            className="btn-secondary"
          >
            Gia hạn ngay
          </button>

          {subscription.isActive && !subscription.autoRenew && (
            <button
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="btn-danger"
            >
              {canceling ? "Đang hủy..." : "Hủy Premium"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**API Response Format:**

```json
{
  "id": 1,
  "userId": 123,
  "subscriptionType": "PREMIUM_MONTHLY",
  "startDate": "2026-01-05T10:00:00",
  "endDate": "2026-02-05T10:00:00",
  "isActive": true,
  "autoRenew": false,
  "dailyTranslationLimit": null,
  "monthlyTestLimit": null,
  "dailyArticleLimit": null,
  "isPremium": true,
  "daysRemaining": 31
}
```

---

### 4.4. 📜 LỊCH SỬ GIAO DỊCH

```jsx
// TransactionHistory.jsx
import { useEffect, useState } from "react";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const fetchTransactions = async (pageNum) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/v1/payment/history?page=${pageNum}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      const data = await response.json();
      setTransactions(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      SUCCESS: { text: "Thành công", class: "badge-success", icon: "✅" },
      PENDING: { text: "Đang xử lý", class: "badge-warning", icon: "⏳" },
      FAILED: { text: "Thất bại", class: "badge-danger", icon: "❌" },
      CANCELLED: { text: "Đã hủy", class: "badge-secondary", icon: "🚫" },
      REFUNDED: { text: "Đã hoàn tiền", class: "badge-info", icon: "↩️" },
    };
    return badges[status] || badges.PENDING;
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="transaction-history">
      <h1>Lịch sử giao dịch</h1>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có giao dịch nào</p>
          <button onClick={() => navigate("/pricing")} className="btn-primary">
            Mua Premium ngay
          </button>
        </div>
      ) : (
        <>
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Mã GD</th>
                  <th>Gói</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const badge = getStatusBadge(tx.paymentStatus);
                  return (
                    <tr key={tx.id}>
                      <td className="transaction-code">{tx.transactionCode}</td>
                      <td>{tx.subscriptionType.replace("_", " ")}</td>
                      <td className="amount">
                        {tx.amount.toLocaleString("vi-VN")} ₫
                      </td>
                      <td>
                        <span className={`badge ${badge.class}`}>
                          {badge.icon} {badge.text}
                        </span>
                      </td>
                      <td>{new Date(tx.createdAt).toLocaleString("vi-VN")}</td>
                      <td className="message">{tx.responseMessage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-secondary"
            >
              ← Trước
            </button>
            <span>
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="btn-secondary"
            >
              Sau →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

### 4.5. 🔒 KIỂM TRA QUYỀN TRUY CẬP FEATURES

```jsx
// hooks/usePremiumFeatures.js
import { useEffect, useState } from "react";

export const usePremiumFeatures = () => {
  const [features, setFeatures] = useState({
    canUseTranslation: false,
    canAccessTest: false,
    canReadArticle: false,
    canDownloadAudio: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFeatures();
  }, []);

  const checkFeatures = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/payment/features",
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error("Error checking features:", error);
    } finally {
      setLoading(false);
    }
  };

  return { features, loading, refetch: checkFeatures };
};

// Usage in component
function TranslationFeature() {
  const { features, loading } = usePremiumFeatures();

  const handleTranslate = () => {
    if (!features.canUseTranslation) {
      // Show upgrade modal
      showUpgradeModal("Bạn cần Premium để sử dụng dịch thuật không giới hạn");
      return;
    }

    // Proceed with translation
    doTranslation();
  };

  return (
    <div>
      <button onClick={handleTranslate} disabled={loading}>
        Dịch thuật
      </button>
      {!features.canUseTranslation && (
        <span className="premium-required">👑 Premium</span>
      )}
    </div>
  );
}
```

**Quick Check Premium Status:**

```jsx
// components/PremiumChecker.jsx
import { useEffect, useState } from "react";

export const PremiumChecker = ({ children, feature }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremium();
  }, []);

  const checkPremium = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/payment/check-premium",
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      const data = await response.json();
      setIsPremium(data.isPremium);
    } catch (error) {
      console.error("Error checking premium:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!isPremium) {
    return (
      <div className="premium-required-overlay">
        <div className="upgrade-prompt">
          <h3>🔒 Tính năng Premium</h3>
          <p>Nâng cấp để sử dụng {feature}</p>
          <button onClick={() => navigate("/pricing")} className="btn-primary">
            Nâng cấp ngay
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Usage
<PremiumChecker feature="dịch thuật không giới hạn">
  <TranslationComponent />
</PremiumChecker>;
```

---

## 5. UI/UX EXAMPLES

### 5.1. Premium Badge Component

```jsx
// components/PremiumBadge.jsx
function PremiumBadge({ isPremium }) {
  if (!isPremium) return null;

  return (
    <span className="premium-badge">
      <span className="crown-icon">👑</span>
      Premium
    </span>
  );
}

// CSS
.premium-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### 5.2. Upgrade Modal

```jsx
// components/UpgradeModal.jsx
function UpgradeModal({ isOpen, onClose, feature }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-icon">🔒</div>
        <h2>Tính năng Premium</h2>
        <p>
          {feature} chỉ dành cho thành viên Premium. Nâng cấp ngay để trải
          nghiệm!
        </p>

        <div className="benefits">
          <h3>Quyền lợi Premium:</h3>
          <ul>
            <li>✅ Dịch thuật không giới hạn</li>
            <li>✅ Truy cập tất cả bài test</li>
            <li>✅ Đọc mọi bài báo</li>
            <li>✅ Tải audio miễn phí</li>
          </ul>
        </div>

        <div className="modal-actions">
          <button onClick={() => navigate("/pricing")} className="btn-primary">
            Xem gói Premium
          </button>
          <button onClick={onClose} className="btn-secondary">
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. ERROR HANDLING

### Error Response Format

```json
{
  "timestamp": "2026-01-05T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Bạn đang có giao dịch chưa hoàn thành",
  "path": "/api/v1/payment/create"
}
```

### Common Errors & Solutions

| Error Code | Message                                 | Giải pháp                                |
| ---------- | --------------------------------------- | ---------------------------------------- |
| 400        | "Bạn đang có giao dịch chưa hoàn thành" | Hoàn thành hoặc hủy transaction cũ trước |
| 401        | "Unauthorized"                          | Refresh token hoặc đăng nhập lại         |
| 404        | "Transaction not found"                 | Kiểm tra lại transaction code            |
| 500        | "Failed to create payment URL"          | Retry hoặc liên hệ support               |

### Error Handling Code

```javascript
const handleApiError = (error, response) => {
  if (response?.status === 400) {
    if (response.data?.message?.includes("giao dịch chưa hoàn thành")) {
      // Show pending transaction warning
      showPendingTransactionModal();
      return;
    }
  }

  if (response?.status === 401) {
    // Token expired
    redirectToLogin();
    return;
  }

  // Generic error
  showErrorNotification(error.message || "Đã có lỗi xảy ra");
};

// Usage
try {
  const response = await createPayment(subscriptionType);
} catch (error) {
  handleApiError(error, error.response);
}
```

---

## 7. TESTING GUIDE

### 7.1. Test với VNPay Sandbox

**Thông tin test:**

- **URL:** https://sandbox.vnpayment.vn
- **Thẻ test:** Sử dụng thẻ test của VNPay sandbox

**Test Cases:**

```javascript
// Test 1: Success Payment
test("User can buy premium monthly", async () => {
  // 1. Login as test user
  // 2. Go to pricing page
  // 3. Click "Mua ngay" for PREMIUM_MONTHLY
  // 4. Redirect to VNPay
  // 5. Complete payment with test card
  // 6. Verify redirect to success page
  // 7. Check subscription is active
});

// Test 2: Failed Payment
test("Handle failed payment", async () => {
  // 1. Start payment flow
  // 2. Cancel at VNPay
  // 3. Verify redirect to failure page
  // 4. Verify transaction status is FAILED
});

// Test 3: Check Features Access
test("Premium user can access all features", async () => {
  // 1. Buy premium
  // 2. Check all features return true
  // 3. Try to use translation (should work)
});

// Test 4: Cancel Subscription
test("User can cancel subscription", async () => {
  // 1. Have active premium
  // 2. Go to subscription page
  // 3. Click cancel
  // 4. Verify autoRenew = false
  // 5. Verify still active until end date
});
```

### 7.2. Mock Data for Development

```javascript
// mockData.js
export const MOCK_SUBSCRIPTION = {
  id: 1,
  userId: 123,
  subscriptionType: "PREMIUM_MONTHLY",
  startDate: "2026-01-05T10:00:00",
  endDate: "2026-02-05T10:00:00",
  isActive: true,
  autoRenew: false,
  dailyTranslationLimit: null,
  monthlyTestLimit: null,
  dailyArticleLimit: null,
  isPremium: true,
  daysRemaining: 31,
};

export const MOCK_TRANSACTIONS = [
  {
    id: 1,
    transactionCode: "550e8400-e29b-41d4-a716-446655440000",
    paymentMethod: "VNPAY",
    paymentStatus: "SUCCESS",
    subscriptionType: "PREMIUM_MONTHLY",
    amount: 99000,
    currency: "VND",
    orderInfo: "Thanh toan goi PREMIUM_MONTHLY",
    bankCode: "NCB",
    responseMessage: "Thanh toán thành công",
    createdAt: "2026-01-05T10:00:00",
  },
];

// Use in development
const useMockData = process.env.NODE_ENV === "development";

const fetchSubscription = async () => {
  if (useMockData) {
    return MOCK_SUBSCRIPTION;
  }
  // Real API call
};
```

---

## 8. BEST PRACTICES

### ✅ DO's

1. **Luôn verify payment status** sau khi callback
2. **Cache premium status** để giảm API calls
3. **Show loading states** khi processing
4. **Handle redirect properly** (VNPay callback)
5. **Show clear error messages** cho users
6. **Implement retry logic** cho failed requests
7. **Use optimistic UI** cho better UX

### ❌ DON'Ts

1. **Không trust client-side premium check** - luôn verify ở backend
2. **Không hardcode payment amounts** - lấy từ backend
3. **Không skip error handling** cho payment flows
4. **Không store sensitive payment data** ở client
5. **Không redirect without user action** (except VNPay flow)

---

## 9. DEPLOYMENT CHECKLIST

- [ ] Update `FRONTEND_REDIRECT_URL` trong backend config
- [ ] Update VNPay credentials (production)
- [ ] Test payment flow end-to-end
- [ ] Setup error tracking (Sentry)
- [ ] Configure CORS properly
- [ ] Add analytics tracking cho conversion
- [ ] Test on multiple devices/browsers
- [ ] Prepare customer support for payment issues

---

## 10. SUPPORT & RESOURCES

### API Documentation

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Base URL:** http://localhost:8080/api/v1

### Contact

- **Backend Team:** backend-team@email.com
- **VNPay Support:** https://sandbox.vnpayment.vn/apis/docs/

### Additional Files

- `PREMIUM_PAYMENT_ANALYSIS.md` - Phân tích kiến trúc
- `QUICK_START_V2.md` - Testing guide chi tiết
- `Admin_Payment_Management.postman_collection.json` - Postman collection

---

**🎉 Happy Coding!**
