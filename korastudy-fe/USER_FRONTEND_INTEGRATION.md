# 👤 User Frontend Integration Guide - Content Locking (V13)

> **Hướng dẫn chi tiết** implement frontend cho User với logic content locking mới

---

## 📌 Tổng quan cho Frontend User

### **User cần biết gì?**

- Một số bài thi/bài báo có **🔒 badge** = Premium only
- Khi click vào locked content → Hiển thị modal upgrade
- Nếu admin đã grant quyền cho user → Vẫn access được dù FREE

### **User KHÔNG cần biết:**

- Chi tiết về grants
- Ai grant cho mình
- Khi nào hết hạn (auto handle)

---

## 🎯 Use Cases từ góc nhìn User

### **Case 1: User là FREE - Access unlocked content**

```
User click vào exam (isLocked = false)
→ API trả về exam detail → OK
→ User làm bài bình thường
```

### **Case 2: User là FREE - Access locked content (không có grant)**

```
User click vào exam (isLocked = true)
→ API trả về HTTP 403
→ Frontend hiển thị modal: "Bài thi này chỉ dành cho Premium"
→ Button: "Nâng cấp Premium"
```

### **Case 3: User là FREE - Access locked content (có grant từ admin)**

```
User click vào exam (isLocked = true)
→ Backend check: User có grant valid
→ API trả về exam detail → OK
→ User làm bài bình thường
→ User KHÔNG biết mình được grant (transparent)
```

### **Case 4: User là PREMIUM**

```
User click vào BẤT KỲ exam/article nào
→ API trả về content → OK
→ Không bao giờ bị block
```

---

## 🔌 API Endpoints cho User

### **1. Lấy danh sách exams**

```http
GET /exams
Authorization: Bearer {user_token}
```

**Response:**

```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "title": "TOEIC Part 1 Practice",
      "level": "INTERMEDIATE",
      "isLocked": false, // ⬅️ Check field này
      "totalQuestions": 50,
      "durationTimes": 60
    },
    {
      "id": 2,
      "title": "TOEIC Full Test Advanced",
      "level": "ADVANCED",
      "isLocked": true, // ⬅️ Locked = Premium only
      "totalQuestions": 200,
      "durationTimes": 120
    }
  ]
}
```

### **2. Lấy chi tiết exam**

```http
GET /exams/{id}
Authorization: Bearer {user_token}
```

**Response Success (200):**

```json
{
  "id": 1,
  "title": "TOEIC Part 1 Practice",
  "parts": [...],
  "questions": [...]
}
```

**Response Error (403) - Locked Content:**

```json
{
  "error": "EXAM_ACCESS_DENIED",
  "message": "Bài thi này chỉ dành cho tài khoản Premium. Vui lòng nâng cấp để tiếp tục!",
  "upgradeUrl": "/payment/plans"
}
```

### **3. Lấy danh sách articles**

```http
GET /articles
```

Response tương tự, có field `isLocked`

### **4. Lấy chi tiết article**

```http
GET /articles/{id}
Authorization: Bearer {user_token}
```

Response tương tự exam

---

## 💻 Implementation - Step by Step

### **STEP 1: Update TypeScript Types**

```typescript
// types/exam.ts
export interface Exam {
  id: number;
  title: string;
  level: string;
  isLocked: boolean; // ⬅️ Thêm field mới
  totalQuestions: number;
  durationTimes: number;
  // ... other fields
}

export interface Article {
  id: number;
  title: string;
  isLocked: boolean; // ⬅️ Thêm field mới
  // ... other fields
}

export interface ApiError {
  error: string;
  message: string;
  upgradeUrl?: string;
}
```

---

### **STEP 2: Create Premium Badge Component**

```typescript
// components/PremiumBadge.tsx
import React from "react";
import { Badge } from "antd";
import { LockOutlined } from "@ant-design/icons";

interface PremiumBadgeProps {
  isLocked: boolean;
  size?: "small" | "default";
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  isLocked,
  size = "default",
}) => {
  if (!isLocked) return null;

  return (
    <Badge
      count={
        <span className="premium-badge">
          <LockOutlined /> Premium
        </span>
      }
      style={{
        backgroundColor: "#ffd700",
        color: "#000",
        fontWeight: "bold",
        fontSize: size === "small" ? "10px" : "12px",
      }}
    />
  );
};
```

**CSS:**

```css
/* styles/premium.css */
.premium-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.premium-badge svg {
  font-size: 10px;
}
```

---

### **STEP 3: Update Exam List Page**

```typescript
// pages/ExamListPage.tsx
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Tag } from "antd";
import { PremiumBadge } from "@/components/PremiumBadge";
import { useNavigate } from "react-router-dom";

export const ExamListPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const response = await fetch("/api/exams", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    setExams(data.data);
  };

  const handleExamClick = (exam: Exam) => {
    // Nếu locked, có thể warn trước (optional)
    if (exam.isLocked) {
      // Option 1: Navigate anyway, sẽ show modal ở detail page
      navigate(`/exams/${exam.id}`);

      // Option 2: Show warning modal trước
      // Modal.confirm({
      //   title: 'Premium Content',
      //   content: 'This exam requires Premium subscription',
      //   okText: 'Continue',
      //   onOk: () => navigate(`/exams/${exam.id}`)
      // });
    } else {
      navigate(`/exams/${exam.id}`);
    }
  };

  return (
    <div className="exam-list-page">
      <h1>Danh sách bài thi</h1>

      <Row gutter={[16, 16]}>
        {exams.map((exam) => (
          <Col xs={24} sm={12} md={8} lg={6} key={exam.id}>
            <Card
              hoverable
              onClick={() => handleExamClick(exam)}
              cover={
                <div className="exam-card-cover">
                  {/* Badge ở góc trên phải */}
                  <div className="exam-badge-container">
                    <PremiumBadge isLocked={exam.isLocked} />
                  </div>
                  <img src={exam.thumbnailUrl} alt={exam.title} />
                </div>
              }
            >
              <Card.Meta
                title={
                  <div className="exam-title">
                    {exam.title}
                    {exam.isLocked && (
                      <LockOutlined
                        style={{ marginLeft: 8, color: "#ffd700" }}
                      />
                    )}
                  </div>
                }
                description={
                  <div>
                    <Tag color={getLevelColor(exam.level)}>{exam.level}</Tag>
                    <div className="exam-meta">
                      <span>{exam.totalQuestions} câu hỏi</span>
                      <span>{exam.durationTimes} phút</span>
                    </div>
                  </div>
                }
              />

              <Button
                type={exam.isLocked ? "default" : "primary"}
                block
                style={{ marginTop: 12 }}
              >
                {exam.isLocked ? (
                  <>
                    <LockOutlined /> Nâng cấp để mở khóa
                  </>
                ) : (
                  "Bắt đầu làm bài"
                )}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
```

**CSS:**

```css
/* styles/exam-list.css */
.exam-card-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.exam-badge-container {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.exam-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exam-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exam-meta {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}
```

---

### **STEP 4: Create Upgrade Modal Component**

```typescript
// components/UpgradeModal.tsx
import React from "react";
import { Modal, Button } from "antd";
import { CrownOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  contentType?: "exam" | "article";
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  visible,
  onClose,
  message = "Nội dung này chỉ dành cho tài khoản Premium",
  contentType = "exam",
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/payment/plans");
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      className="upgrade-modal"
    >
      <div className="upgrade-modal-content">
        {/* Icon */}
        <div className="upgrade-icon">
          <CrownOutlined style={{ fontSize: 64, color: "#ffd700" }} />
        </div>

        {/* Title */}
        <h2>Nâng cấp lên Premium</h2>

        {/* Message */}
        <p className="upgrade-message">{message}</p>

        {/* Benefits */}
        <div className="upgrade-benefits">
          <h3>Lợi ích khi nâng cấp Premium:</h3>
          <ul>
            <li>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <span>
                Truy cập <strong>KHÔNG GIỚI HẠN</strong> tất cả bài thi
              </span>
            </li>
            <li>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <span>
                Truy cập <strong>KHÔNG GIỚI HẠN</strong> tất cả bài báo
              </span>
            </li>
            <li>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <span>Không giới hạn dịch thuật AI</span>
            </li>
            <li>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <span>Hỗ trợ ưu tiên từ giáo viên</span>
            </li>
            <li>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <span>Tải xuống tài liệu PDF</span>
            </li>
          </ul>
        </div>

        {/* Pricing */}
        <div className="upgrade-pricing">
          <div className="price-option">
            <span className="price">99.000đ</span>
            <span className="period">/tháng</span>
          </div>
          <div className="price-option highlighted">
            <span className="badge">Tiết kiệm 20%</span>
            <span className="price">990.000đ</span>
            <span className="period">/năm</span>
          </div>
        </div>

        {/* Actions */}
        <div className="upgrade-actions">
          <Button size="large" onClick={onClose}>
            Để sau
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<CrownOutlined />}
            onClick={handleUpgrade}
            style={{
              background: "linear-gradient(135deg, #ffd700, #ffed4e)",
              borderColor: "#ffd700",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Nâng cấp ngay
          </Button>
        </div>

        {/* Note */}
        <p className="upgrade-note">
          🎁 Dùng thử 7 ngày miễn phí khi đăng ký lần đầu
        </p>
      </div>
    </Modal>
  );
};
```

**CSS:**

```css
/* styles/upgrade-modal.css */
.upgrade-modal-content {
  text-align: center;
  padding: 20px;
}

.upgrade-icon {
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.upgrade-modal-content h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffd700, #ff8800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.upgrade-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.upgrade-benefits {
  text-align: left;
  margin-bottom: 24px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.upgrade-benefits h3 {
  font-size: 16px;
  margin-bottom: 12px;
  text-align: center;
}

.upgrade-benefits ul {
  list-style: none;
  padding: 0;
}

.upgrade-benefits li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
}

.upgrade-pricing {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.price-option {
  flex: 1;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  position: relative;
}

.price-option.highlighted {
  border-color: #ffd700;
  background: #fffef8;
}

.price-option .badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4d4f;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
}

.period {
  font-size: 14px;
  color: #666;
}

.upgrade-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.upgrade-actions button {
  flex: 1;
  max-width: 200px;
}

.upgrade-note {
  font-size: 13px;
  color: #52c41a;
  margin: 0;
}
```

---

### **STEP 5: Update Exam Detail Page với Error Handling**

```typescript
// pages/ExamDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { UpgradeModal } from "@/components/UpgradeModal";

export const ExamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchExamDetail();
  }, [id]);

  const fetchExamDetail = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/exams/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // ⬅️ CHECK HTTP 403 - Locked content
      if (response.status === 403) {
        const error: ApiError = await response.json();

        setErrorMessage(error.message);
        setShowUpgradeModal(true);
        setLoading(false);

        // Optional: Navigate back sau 3s
        setTimeout(() => {
          navigate("/exams");
        }, 3000);

        return;
      }

      // Other errors
      if (!response.ok) {
        throw new Error("Failed to fetch exam");
      }

      const data = await response.json();
      setExam(data);
    } catch (error) {
      console.error("Error fetching exam:", error);
      message.error("Không thể tải bài thi");
      navigate("/exams");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!exam) {
    return null; // Modal will show
  }

  return (
    <>
      <div className="exam-detail-page">
        {/* Exam content */}
        <h1>{exam.title}</h1>
        {/* ... rest of exam detail */}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          navigate("/exams");
        }}
        message={errorMessage}
        contentType="exam"
      />
    </>
  );
};
```

---

### **STEP 6: Create API Service với Error Handling**

```typescript
// services/api.service.ts
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 403 errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 403) {
      // Có thể emit event để show modal ở App level
      const apiError = error.response.data;

      // Emit custom event
      window.dispatchEvent(
        new CustomEvent("show-upgrade-modal", {
          detail: {
            message: apiError.message,
            upgradeUrl: apiError.upgradeUrl,
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

// API methods
export const examApi = {
  getList: () => api.get<Exam[]>("/exams"),

  getDetail: async (id: number) => {
    try {
      const response = await api.get<Exam>(`/exams/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        return {
          data: null,
          error: error.response.data as ApiError,
        };
      }
      throw error;
    }
  },

  submit: (id: number, answers: any) =>
    api.post(`/exams/${id}/submit`, answers),
};

export const articleApi = {
  getList: () => api.get<Article[]>("/articles"),
  getDetail: (id: number) => api.get<Article>(`/articles/${id}`),
};
```

---

### **STEP 7: Global Upgrade Modal Listener (Optional)**

```typescript
// App.tsx
import React, { useState, useEffect } from "react";
import { UpgradeModal } from "@/components/UpgradeModal";

export const App: React.FC = () => {
  const [upgradeModal, setUpgradeModal] = useState({
    visible: false,
    message: "",
  });

  useEffect(() => {
    // Listen to global upgrade modal event
    const handleShowUpgrade = (event: CustomEvent) => {
      setUpgradeModal({
        visible: true,
        message: event.detail.message,
      });
    };

    window.addEventListener(
      "show-upgrade-modal",
      handleShowUpgrade as EventListener
    );

    return () => {
      window.removeEventListener(
        "show-upgrade-modal",
        handleShowUpgrade as EventListener
      );
    };
  }, []);

  return (
    <>
      {/* Your app routes */}
      <Routes>{/* ... */}</Routes>

      {/* Global upgrade modal */}
      <UpgradeModal
        visible={upgradeModal.visible}
        onClose={() => setUpgradeModal({ visible: false, message: "" })}
        message={upgradeModal.message}
      />
    </>
  );
};
```

---

## 🎨 UI/UX Best Practices

### **1. Visual Indicators**

```typescript
// Hiển thị badge rõ ràng
✅ DO:
<Card>
  <PremiumBadge isLocked={true} /> {/* Góc trên phải */}
  <h3>{title} <LockOutlined /></h3>
</Card>

❌ DON'T:
<Card>
  <h3>{title}</h3> {/* Không có indicator */}
</Card>
```

### **2. Clear CTAs**

```typescript
// Button text rõ ràng
✅ DO:
{isLocked ? (
  <Button icon={<LockOutlined />}>
    Nâng cấp để mở khóa
  </Button>
) : (
  <Button type="primary">
    Bắt đầu làm bài
  </Button>
)}

❌ DON'T:
<Button>Xem chi tiết</Button> {/* Không rõ ràng */}
```

### **3. Non-intrusive**

```typescript
// Không spam modal ngay khi vào trang
✅ DO:
// User click vào locked item → Show modal

❌ DON'T:
// Vừa vào trang → Show modal ngay
```

---

## 📱 Responsive Design

```css
/* Mobile first */
.exam-card {
  width: 100%;
}

@media (min-width: 768px) {
  .exam-card {
    width: calc(50% - 16px);
  }
}

@media (min-width: 1024px) {
  .exam-card {
    width: calc(25% - 16px);
  }
}

/* Premium badge responsive */
.premium-badge {
  font-size: 10px;
  padding: 2px 6px;
}

@media (min-width: 768px) {
  .premium-badge {
    font-size: 12px;
    padding: 4px 8px;
  }
}
```

---

## 🧪 Testing Scenarios

### **Test 1: FREE user - Unlocked content**

```
1. Login as FREE user
2. Navigate to exam list
3. Click vào exam isLocked = false
4. ✅ Should: Load exam detail successfully
```

### **Test 2: FREE user - Locked content (no grant)**

```
1. Login as FREE user
2. Navigate to exam list
3. Click vào exam isLocked = true
4. ✅ Should: Show upgrade modal
5. Click "Nâng cấp ngay"
6. ✅ Should: Navigate to /payment/plans
```

### **Test 3: FREE user - Locked content (có grant)**

```
1. Admin grant access cho FREE user (via admin panel)
2. Login as FREE user
3. Navigate to exam list
4. Click vào exam isLocked = true
5. ✅ Should: Load exam detail successfully (user không biết có grant)
```

### **Test 4: PREMIUM user**

```
1. Login as PREMIUM user
2. Navigate to exam list
3. Click vào BẤT KỲ exam nào
4. ✅ Should: Load successfully (không bị block)
```

### **Test 5: Grant expired**

```
1. Admin grant access với expiresAt = yesterday
2. Login as FREE user
3. Try access locked content
4. ✅ Should: Show upgrade modal (grant hết hạn)
```

---

## 🔍 Debugging Tips

### **1. Check API Response**

```typescript
// Console log response
const response = await fetch(`/api/exams/${id}`);
console.log("Status:", response.status);
console.log("Body:", await response.json());

// Expected for locked content:
// Status: 403
// Body: { error: "EXAM_ACCESS_DENIED", message: "...", upgradeUrl: "/payment/plans" }
```

### **2. Check isLocked Field**

```typescript
// In exam list
exams.forEach((exam) => {
  console.log(`${exam.title}: isLocked = ${exam.isLocked}`);
});
```

### **3. Test with Different Users**

```typescript
// Tạo 3 test accounts:
// 1. FREE user (no grant)
// 2. FREE user (có grant)
// 3. PREMIUM user

// Test cùng 1 locked exam với 3 accounts
```

---

## 🚀 Quick Start Checklist

- [ ] Update TypeScript types (thêm `isLocked: boolean`)
- [ ] Tạo `PremiumBadge` component
- [ ] Tạo `UpgradeModal` component
- [ ] Update `ExamListPage` - hiển thị badge
- [ ] Update `ExamDetailPage` - handle 403 error
- [ ] Update `ArticleListPage` - tương tự
- [ ] Update `ArticleDetailPage` - tương tự
- [ ] Tạo API service với error handling
- [ ] Add CSS cho premium badge & modal
- [ ] Test với 3 loại user (FREE, FREE + grant, PREMIUM)

---

## 📚 Summary

### **Key Points:**

1. **Check `isLocked` field** ở list page → Hiển thị badge
2. **Handle HTTP 403** ở detail page → Show upgrade modal
3. **User với grant**: Transparent (không cần hiển thị gì đặc biệt)
4. **PREMIUM user**: Never blocked
5. **Clear CTAs**: Button text phải rõ ràng
6. **Non-intrusive**: Modal chỉ show khi user thực sự click

### **Files cần tạo/update:**

- ✅ `types/exam.ts` - Add isLocked field
- ✅ `components/PremiumBadge.tsx` - New
- ✅ `components/UpgradeModal.tsx` - New
- ✅ `pages/ExamListPage.tsx` - Update
- ✅ `pages/ExamDetailPage.tsx` - Update
- ✅ `services/api.service.ts` - Update error handling
- ✅ `styles/premium.css` - New
- ✅ `styles/upgrade-modal.css` - New

Happy coding! 🎉
