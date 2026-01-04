# 📊 API Thống Kê Bài Thi - Documentation

## 🎯 Tổng Quan

API này cung cấp thống kê chi tiết về kết quả làm bài thi của người dùng, được phân chia theo 4 loại:

- **Reading Statistics**: Thống kê kỹ năng Reading (bao gồm: Reading-only exams + phần Reading từ Full Tests)
- **Listening Statistics**: Thống kê kỹ năng Listening (bao gồm: Listening-only exams + phần Listening từ Full Tests)
- **Full Test Statistics**: Thống kê đề thi thật (TOEIC Full Test - 200 câu)
- **Overall Statistics**: Thống kê tổng hợp (bao gồm TẤT CẢ các loại bài thi)

### 💡 Điểm Quan Trọng: Logic Thống Kê Mới

**Full Test được chia thành 2 phần:**

- **Part 1-4 (Listening)**: 100 câu → tính vào `listeningStatistics`
- **Part 5-7 (Reading)**: 100 câu → tính vào `readingStatistics`

**Ví dụ:**
User A làm:

- 3 bài Reading-only (30 câu/bài)
- 2 bài Listening-only (25 câu/bài)
- 1 bài Full Test (100 Reading + 100 Listening)

**Kết quả:**

- `readingStatistics.numberOfExamsTaken` = **4** (3 Reading + 1 Full Test)
- `listeningStatistics.numberOfExamsTaken` = **3** (2 Listening + 1 Full Test)
- `fullTestStatistics.numberOfExamsTaken` = **1**

---

## 📍 API Endpoint

### **GET /api/v1/exams/statistics**

Lấy thống kê bài thi của người dùng

#### **Request Parameters**

| Parameter | Type | Required | Description                        |
| --------- | ---- | -------- | ---------------------------------- |
| `userId`  | Long | ✅ Yes   | ID của người dùng cần xem thống kê |

#### **Example Request**

```http
GET http://localhost:8080/api/v1/exams/statistics?userId=1
```

```javascript
// JavaScript/Axios
const response = await axios.get("/api/v1/exams/statistics", {
  params: { userId: 1 },
});
```

```java
// Java/RestTemplate
String url = "http://localhost:8080/api/v1/exams/statistics?userId=1";
ResponseEntity<UserExamStatisticsResponse> response =
    restTemplate.getForEntity(url, UserExamStatisticsResponse.class);
```

---

## 📤 Response Structure

### **UserExamStatisticsResponse**

Response chính chứa 4 đối tượng thống kê

```json
{
  "userId": 1,
  "readingStatistics": { ... },
  "listeningStatistics": { ... },
  "fullTestStatistics": { ... },
  "overallStatistics": { ... }
}
```

| Field                 | Type                         | Description                                |
| --------------------- | ---------------------------- | ------------------------------------------ |
| `userId`              | Long                         | ID người dùng                              |
| `readingStatistics`   | ExamStatisticsByTypeResponse | Thống kê bài thi Reading                   |
| `listeningStatistics` | ExamStatisticsByTypeResponse | Thống kê bài thi Listening                 |
| `fullTestStatistics`  | ExamStatisticsByTypeResponse | Thống kê đề thi thật (Full Test - 200 câu) |
| `overallStatistics`   | ExamStatisticsByTypeResponse | Thống kê tổng hợp (tất cả loại bài thi)    |

---

### **ExamStatisticsByTypeResponse**

Chi tiết thống kê cho từng loại bài thi

| Field                     | Type    | Description                                                      |
| ------------------------- | ------- | ---------------------------------------------------------------- |
| `examType`                | String  | Loại bài thi: `"READING"`, `"LISTENING"`, `"FULL_TEST"`, `"ALL"` |
| `numberOfExamsTaken`      | Integer | **Số bài đã làm**                                                |
| `accuracy`                | Double  | **Độ chính xác (%)** - Tỷ lệ câu trả lời đúng                    |
| `averageTimeMinutes`      | Double  | **Thời gian trung bình làm bài (phút)** ⚠️ Hiện tại null         |
| `averageScore`            | Double  | **Điểm trung bình**                                              |
| `totalQuestionsAttempted` | Integer | Tổng số câu đã làm                                               |
| `totalCorrectAnswers`     | Integer | Tổng số câu đúng                                                 |
| `highestScore`            | Double  | Điểm cao nhất đạt được                                           |
| `lowestScore`             | Double  | Điểm thấp nhất                                                   |

---

## 📋 Example Response

### **Full Response Example**

```json
{
  "userId": 1,
  "readingStatistics": {
    "examType": "READING",
    "numberOfExamsTaken": 5,
    "accuracy": 78.5,
    "averageTimeMinutes": null,
    "averageScore": 85.6,
    "totalQuestionsAttempted": 150,
    "totalCorrectAnswers": 118,
    "highestScore": 95.0,
    "lowestScore": 72.0
  },
  "listeningStatistics": {
    "examType": "LISTENING",
    "numberOfExamsTaken": 3,
    "accuracy": 82.3,
    "averageTimeMinutes": null,
    "averageScore": 88.7,
    "totalQuestionsAttempted": 100,
    "totalCorrectAnswers": 82,
    "highestScore": 92.0,
    "lowestScore": 85.0
  },
  "fullTestStatistics": {
    "examType": "FULL_TEST",
    "numberOfExamsTaken": 2,
    "accuracy": 75.5,
    "averageTimeMinutes": null,
    "averageScore": 820.0,
    "totalQuestionsAttempted": 400,
    "totalCorrectAnswers": 302,
    "highestScore": 850.0,
    "lowestScore": 790.0
  },
  "overallStatistics": {
    "examType": "ALL",
    "numberOfExamsTaken": 10,
    "accuracy": 80.0,
    "averageTimeMinutes": null,
    "averageScore": 86.5,
    "totalQuestionsAttempted": 350,
    "totalCorrectAnswers": 280,
    "highestScore": 95.0,
    "lowestScore": 72.0
  }
}
```

### **Empty Statistics (User chưa làm bài)**

```json
{
  "userId": 99,
  "readingStatistics": {
    "examType": "READING",
    "numberOfExamsTaken": 0,
    "accuracy": 0.0,
    "averageTimeMinutes": null,
    "averageScore": 0.0,
    "totalQuestionsAttempted": 0,
    "totalCorrectAnswers": 0,
    "highestScore": 0.0,
    "lowestScore": 0.0
  },
  "listeningStatistics": {
    "examType": "LISTENING",
    "numberOfExamsTaken": 0,
    "accuracy": 0.0,
    "averageTimeMinutes": null,
    "averageScore": 0.0,
    "totalQuestionsAttempted": 0,
    "totalCorrectAnswers": 0,
    "highestScore": 0.0,
    "lowestScore": 0.0
  },
  "fullTestStatistics": {
    "examType": "FULL_TEST",
    "numberOfExamsTaken": 0,
    "accuracy": 0.0,
    "averageTimeMinutes": null,
    "averageScore": 0.0,
    "totalQuestionsAttempted": 0,
    "totalCorrectAnswers": 0,
    "highestScore": 0.0,
    "lowestScore": 0.0
  },
  "overallStatistics": {
    "examType": "ALL",
    "numberOfExamsTaken": 0,
    "accuracy": 0.0,
    "averageTimeMinutes": null,
    "averageScore": 0.0,
    "totalQuestionsAttempted": 0,
    "totalCorrectAnswers": 0,
    "highestScore": 0.0,
    "lowestScore": 0.0
  }
}
```

---

## 💡 Cách Sử Dụng

### **1. Frontend Display - React Example**

```jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function ExamStatistics({ userId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("/api/v1/exams/statistics", {
          params: { userId },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="statistics-dashboard">
      {/* Reading Statistics */}
      <div className="stat-card reading">
        <h3>📖 Reading Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">Số bài đã làm:</span>
            <span className="value">
              {stats.readingStatistics.numberOfExamsTaken}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Độ chính xác:</span>
            <span className="value">{stats.readingStatistics.accuracy}%</span>
          </div>
          <div className="stat-item">
            <span className="label">Điểm trung bình:</span>
            <span className="value">
              {stats.readingStatistics.averageScore}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Điểm cao nhất:</span>
            <span className="value">
              {stats.readingStatistics.highestScore}
            </span>
          </div>
        </div>
      </div>

      {/* Listening Statistics */}
      <div className="stat-card listening">
        <h3>🎧 Listening Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">Số bài đã làm:</span>
            <span className="value">
              {stats.listeningStatistics.numberOfExamsTaken}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Độ chính xác:</span>
            <span className="value">{stats.listeningStatistics.accuracy}%</span>
          </div>
          <div className="stat-item">
            <span className="label">Điểm trung bình:</span>
            <span className="value">
              {stats.listeningStatistics.averageScore}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Điểm cao nhất:</span>
            <span className="value">
              {stats.listeningStatistics.highestScore}
            </span>
          </div>
        </div>
      </div>

      {/* Full Test Statistics */}
      <div className="stat-card fulltest">
        <h3>🎯 Full Test Statistics (Đề Thi Thật)</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">Số đề đã làm:</span>
            <span className="value">
              {stats.fullTestStatistics.numberOfExamsTaken}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Độ chính xác:</span>
            <span className="value">{stats.fullTestStatistics.accuracy}%</span>
          </div>
          <div className="stat-item">
            <span className="label">Điểm trung bình:</span>
            <span className="value">
              {stats.fullTestStatistics.averageScore}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Điểm cao nhất:</span>
            <span className="value">
              {stats.fullTestStatistics.highestScore}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="stat-card overall">
        <h3>📊 Overall Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">Tổng số bài:</span>
            <span className="value">
              {stats.overallStatistics.numberOfExamsTaken}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Độ chính xác:</span>
            <span className="value">{stats.overallStatistics.accuracy}%</span>
          </div>
          <div className="stat-item">
            <span className="label">Điểm TB:</span>
            <span className="value">
              {stats.overallStatistics.averageScore}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Tổng câu đúng:</span>
            <span className="value">
              {stats.overallStatistics.totalCorrectAnswers}/
              {stats.overallStatistics.totalQuestionsAttempted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamStatistics;
```

### **2. Chart.js Visualization Example**

```javascript
import { Bar } from "react-chartjs-2";

function StatisticsChart({ stats }) {
  const chartData = {
    labels: ["Reading", "Listening", "Full Test", "Overall"],
    datasets: [
      {
        label: "Số bài đã làm",
        data: [
          stats.readingStatistics.numberOfExamsTaken,
          stats.listeningStatistics.numberOfExamsTaken,
          stats.fullTestStatistics.numberOfExamsTaken,
          stats.overallStatistics.numberOfExamsTaken,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Độ chính xác (%)",
        data: [
          stats.readingStatistics.accuracy,
          stats.listeningStatistics.accuracy,
          stats.fullTestStatistics.accuracy,
          stats.overallStatistics.accuracy,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Điểm trung bình",
        data: [
          stats.readingStatistics.averageScore,
          stats.listeningStatistics.averageScore,
          stats.fullTestStatistics.averageScore,
          stats.overallStatistics.averageScore,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return <Bar data={chartData} />;
}
```

---

## 🔍 Business Logic

### **Cách Tính Toán Thống Kê**

#### **1. Số bài đã làm (numberOfExamsTaken)**

```java
numberOfExams = results.size(); // Số lần submit exam
```

#### **2. Độ chính xác (accuracy)**

```java
accuracy = (totalCorrectAnswers / totalQuestionsAttempted) * 100;
```

**Ví dụ:**

- Làm 150 câu, đúng 118 câu
- Accuracy = (118 / 150) × 100 = 78.67%

#### **3. Điểm trung bình (averageScore)**

```java
averageScore = results.stream()
    .mapToDouble(r -> r.getScores())
    .average()
    .orElse(0.0);
```

**Ví dụ:**

- Bài 1: 85 điểm
- Bài 2: 90 điểm
- Bài 3: 82 điểm
- Average = (85 + 90 + 82) / 3 = 85.67 điểm

#### **4. Điểm cao nhất/thấp nhất**

```java
highestScore = results.stream()
    .mapToDouble(r -> r.getScores())
    .max()
    .orElse(0.0);

lowestScore = results.stream()
    .mapToDouble(r -> r.getScores())
    .min()
    .orElse(0.0);
```

---

## ⚠️ Lưu Ý Quan Trọng

### **1. Field `averageTimeMinutes` hiện tại là `null`**

**Lý do:** Database `comprehensive_test_results` không có column lưu thời gian làm bài.

**Giải pháp:**

1. Thêm column vào database:

```sql
ALTER TABLE comprehensive_test_results
ADD COLUMN duration_minutes INT;
```

2. Update entity `ComprehensiveTestResult.java`:

```java
@Column(name = "duration_minutes")
private Integer durationMinutes;
```

3. Lưu thời gian khi submit exam trong `ExamService.submitExam()`:

```java
// Frontend gửi startTime và endTime
long durationMinutes = (endTime - startTime) / 60000; // Convert ms to minutes
result.setDurationMinutes((int) durationMinutes);
```

### **2. Phân biệt Reading vs Listening vs Full Test**

API tự động lọc theo `examType` trong bảng `mock_tests`:

- `readingStatistics`: Chỉ lấy bài thi có `exam_type = 'READING'` (30 câu Reading)
- `listeningStatistics`: Chỉ lấy bài thi có `exam_type = 'LISTENING'` (25 câu Listening)
- `fullTestStatistics`: Chỉ lấy bài thi có `exam_type = 'FULL_TEST'` (200 câu - đề thi thật có cả Reading + Listening)
- `overallStatistics`: Lấy TẤT CẢ bài thi (READING + LISTENING + FULL_TEST)

### **3. Xử lý User chưa làm bài**

Nếu user chưa làm bài nào, API vẫn trả về response nhưng tất cả giá trị = 0:

```json
{
  "numberOfExamsTaken": 0,
  "accuracy": 0.0,
  "averageScore": 0.0,
  ...
}
```

Frontend cần check và hiển thị message thích hợp:

```javascript
if (stats.readingStatistics.numberOfExamsTaken === 0) {
  return <div>Bạn chưa làm bài Reading nào. Hãy bắt đầu ngay!</div>;
}

if (stats.fullTestStatistics.numberOfExamsTaken === 0) {
  return (
    <div>Bạn chưa làm đề thi thật nào. Hãy thử sức với đề thi 200 câu!</div>
  );
}
```

### **4. Ý nghĩa của Full Test Statistics**

**Full Test (Đề thi thật)** là bài kiểm tra tổng hợp với 200 câu hỏi:

- **Part 1-4**: Listening (100 câu)
- **Part 5-7**: Reading (100 câu)
- **Thời gian**: 120 phút (45 phút Listening + 75 phút Reading)
- **Điểm**: Thang điểm 990 (mỗi phần 495 điểm)

**Khác biệt với Reading/Listening riêng lẻ:**

- Reading/Listening: Bài tập luyện tập từng kỹ năng (30 câu hoặc 25 câu)
- Full Test: Mô phỏng kỳ thi TOEIC chính thức, đánh giá năng lực tổng hợp

---

## 🧪 Testing với Postman

Import request này vào Postman:

```json
{
  "name": "Lấy thống kê bài thi của user",
  "request": {
    "method": "GET",
    "url": {
      "raw": "{{base_url}}/api/v1/exams/statistics?userId={{user_id}}",
      "host": ["{{base_url}}"],
      "path": ["api", "v1", "exams", "statistics"],
      "query": [
        {
          "key": "userId",
          "value": "{{user_id}}"
        }
      ]
    }
  }
}
```

**Variables:**

- `base_url`: http://localhost:8080
- `user_id`: 1 (hoặc ID của user test)

---

## 📊 Use Cases

### **1. Dashboard Overview**

Hiển thị thống kê tổng quan của user trên dashboard

### **2. Progress Tracking**

Theo dõi tiến độ học tập theo từng kỹ năng (Reading/Listening)

### **3. Performance Comparison**

So sánh hiệu suất giữa Reading và Listening để biết điểm mạnh/yếu

### **4. Goal Setting**

Đặt mục tiêu cải thiện dựa trên số liệu hiện tại

### **5. Leaderboard**

Xếp hạng người dùng dựa trên điểm trung bình hoặc độ chính xác

---

## 🔗 Related APIs

- `POST /api/v1/exams/{id}/submit` - Nộp bài thi (tạo dữ liệu cho statistics)
- `GET /api/v1/exams/history?userId={userId}` - Lịch sử làm bài
- `GET /api/v1/exams/result/{resultId}` - Chi tiết kết quả 1 lần thi

---

## 📞 Support

Nếu có vấn đề với API, kiểm tra:

1. ✅ User ID có tồn tại trong database không?
2. ✅ User đã làm bài thi nào chưa?
3. ✅ Bảng `comprehensive_test_results` có dữ liệu không?
4. ✅ Bảng `mock_tests` có column `exam_type` chưa?

**Backend Log để debug:**

```java
System.out.println("Fetching statistics for userId: " + userId);
System.out.println("Reading results: " + readingResults.size());
System.out.println("Listening results: " + listeningResults.size());
```
