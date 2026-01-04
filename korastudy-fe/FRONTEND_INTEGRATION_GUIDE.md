# 📘 Frontend Integration Guide - Exam Statistics API

## 📋 Table of Contents

1. [API Overview](#api-overview)
2. [TypeScript Interfaces](#typescript-interfaces)
3. [React Hooks Setup](#react-hooks-setup)
4. [API Service Layer](#api-service-layer)
5. [Statistics Dashboard Components](#statistics-dashboard-components)
6. [Chart Visualization with Chart.js](#chart-visualization-with-chartjs)
7. [Error Handling](#error-handling)
8. [Responsive Design Examples](#responsive-design-examples)
9. [Performance Optimization](#performance-optimization)
10. [Complete Example](#complete-example)

---

## 🎯 API Overview

**Endpoint:** `GET /api/v1/exams/statistics?userId={userId}`

**Purpose:** Retrieve comprehensive exam statistics for a specific user, including:

- **Reading Statistics** (includes Reading-only exams + Reading portion of Full Tests)
- **Listening Statistics** (includes Listening-only exams + Listening portion of Full Tests)
- **Full Test Statistics** (complete TOEIC Full Test results)
- **Overall Statistics** (aggregated data from all exam types)

**Authentication:** Required (JWT Bearer token)

---

## 📦 TypeScript Interfaces

Create a `types/exam-statistics.ts` file:

```typescript
// types/exam-statistics.ts

/**
 * Statistics for a specific exam type
 */
export interface ExamStatisticsByType {
  examType: "READING" | "LISTENING" | "FULL_TEST" | "OVERALL";
  numberOfExamsTaken: number;
  accuracy: number; // Percentage (0-100)
  averageTimeMinutes: number | null; // Will be null until duration tracking is implemented
  averageScore: number; // Percentage (0-100)
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  highestScore: number;
  lowestScore: number;
}

/**
 * Complete user exam statistics response
 */
export interface UserExamStatistics {
  userId: number;
  readingStatistics: ExamStatisticsByType;
  listeningStatistics: ExamStatisticsByType;
  fullTestStatistics: ExamStatisticsByType;
  overallStatistics: ExamStatisticsByType;
}

/**
 * API error response structure
 */
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}
```

---

## 🪝 React Hooks Setup

Create a custom hook for fetching statistics:

```typescript
// hooks/useExamStatistics.ts

import { useState, useEffect } from "react";
import { UserExamStatistics, ApiError } from "@/types/exam-statistics";
import { examStatisticsService } from "@/services/exam-statistics.service";

interface UseExamStatisticsResult {
  statistics: UserExamStatistics | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export const useExamStatistics = (userId: number): UseExamStatisticsResult => {
  const [statistics, setStatistics] = useState<UserExamStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examStatisticsService.getUserStatistics(userId);
      setStatistics(data);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || "Failed to fetch statistics",
        status: err.response?.status || 500,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStatistics();
    }
  }, [userId]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
};
```

---

## 🔧 API Service Layer

Create an API service for handling HTTP requests:

```typescript
// services/exam-statistics.service.ts

import axios, { AxiosInstance } from "axios";
import { UserExamStatistics } from "@/types/exam-statistics";

class ExamStatisticsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add JWT token interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response error interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch user exam statistics
   * @param userId - The ID of the user
   * @returns Promise with UserExamStatistics
   */
  async getUserStatistics(userId: number): Promise<UserExamStatistics> {
    const response = await this.api.get<UserExamStatistics>(
      `/api/v1/exams/statistics`,
      {
        params: { userId },
      }
    );
    return response.data;
  }
}

export const examStatisticsService = new ExamStatisticsService();
```

---

## 🧩 Statistics Dashboard Components

### Main Dashboard Component

```typescript
// components/ExamStatisticsDashboard.tsx

import React from "react";
import { useExamStatistics } from "@/hooks/useExamStatistics";
import { StatisticsCard } from "./StatisticsCard";
import { StatisticsChart } from "./StatisticsChart";
import { Loader } from "./Loader";
import { ErrorAlert } from "./ErrorAlert";

interface Props {
  userId: number;
}

export const ExamStatisticsDashboard: React.FC<Props> = ({ userId }) => {
  const { statistics, loading, error, refetch } = useExamStatistics(userId);

  if (loading) {
    return <Loader message="Loading statistics..." />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={refetch} />;
  }

  if (!statistics) {
    return <div>No statistics available</div>;
  }

  return (
    <div className="statistics-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Exam Statistics Dashboard</h1>
        <button onClick={refetch} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Overall Summary */}
      <div className="summary-section">
        <h2>Overall Performance</h2>
        <StatisticsCard
          title="All Exams"
          statistics={statistics.overallStatistics}
          color="#6366f1"
        />
      </div>

      {/* Skills Breakdown */}
      <div className="skills-grid">
        <StatisticsCard
          title="Reading Skills"
          statistics={statistics.readingStatistics}
          color="#10b981"
          subtitle="Includes Reading-only + Reading portion of Full Tests"
        />
        <StatisticsCard
          title="Listening Skills"
          statistics={statistics.listeningStatistics}
          color="#f59e0b"
          subtitle="Includes Listening-only + Listening portion of Full Tests"
        />
        <StatisticsCard
          title="Full Tests"
          statistics={statistics.fullTestStatistics}
          color="#ef4444"
          subtitle="Complete TOEIC practice tests (200 questions)"
        />
      </div>

      {/* Chart Visualizations */}
      <div className="charts-section">
        <StatisticsChart statistics={statistics} />
      </div>
    </div>
  );
};
```

### Statistics Card Component

```typescript
// components/StatisticsCard.tsx

import React from "react";
import { ExamStatisticsByType } from "@/types/exam-statistics";

interface Props {
  title: string;
  subtitle?: string;
  statistics: ExamStatisticsByType;
  color: string;
}

export const StatisticsCard: React.FC<Props> = ({
  title,
  subtitle,
  statistics,
  color,
}) => {
  return (
    <div className="statistics-card" style={{ borderLeftColor: color }}>
      {/* Header */}
      <div className="card-header">
        <h3>{title}</h3>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>

      {/* Main Metrics */}
      <div className="main-metrics">
        <div className="metric">
          <span className="metric-label">Exams Taken</span>
          <span className="metric-value">{statistics.numberOfExamsTaken}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Average Score</span>
          <span className="metric-value" style={{ color }}>
            {statistics.averageScore.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="detailed-stats">
        <div className="stat-row">
          <span className="stat-label">📊 Accuracy</span>
          <span className="stat-value">{statistics.accuracy.toFixed(1)}%</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">✅ Correct Answers</span>
          <span className="stat-value">
            {statistics.totalCorrectAnswers} /{" "}
            {statistics.totalQuestionsAttempted}
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-label">🏆 Highest Score</span>
          <span className="stat-value">
            {statistics.highestScore.toFixed(1)}%
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-label">📉 Lowest Score</span>
          <span className="stat-value">
            {statistics.lowestScore.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-label">Overall Progress</div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${statistics.accuracy}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
};
```

---

## 📊 Chart Visualization with Chart.js

Install dependencies:

```bash
npm install chart.js react-chartjs-2
```

### Chart Component

```typescript
// components/StatisticsChart.tsx

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import { Bar, Radar, Doughnut } from "react-chartjs-2";
import { UserExamStatistics } from "@/types/exam-statistics";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  statistics: UserExamStatistics;
}

export const StatisticsChart: React.FC<Props> = ({ statistics }) => {
  // Bar Chart Data - Average Scores Comparison
  const barChartData = {
    labels: ["Reading", "Listening", "Full Test", "Overall"],
    datasets: [
      {
        label: "Average Score (%)",
        data: [
          statistics.readingStatistics.averageScore,
          statistics.listeningStatistics.averageScore,
          statistics.fullTestStatistics.averageScore,
          statistics.overallStatistics.averageScore,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)", // Green
          "rgba(245, 158, 11, 0.6)", // Orange
          "rgba(239, 68, 68, 0.6)", // Red
          "rgba(99, 102, 241, 0.6)", // Indigo
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(99, 102, 241)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Radar Chart Data - Skills Profile
  const radarChartData = {
    labels: ["Reading", "Listening", "Full Test"],
    datasets: [
      {
        label: "Accuracy (%)",
        data: [
          statistics.readingStatistics.accuracy,
          statistics.listeningStatistics.accuracy,
          statistics.fullTestStatistics.accuracy,
        ],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(99, 102, 241)",
      },
    ],
  };

  // Doughnut Chart Data - Exams Distribution
  const doughnutChartData = {
    labels: ["Reading Only", "Listening Only", "Full Test"],
    datasets: [
      {
        label: "Number of Exams",
        data: [
          statistics.readingStatistics.numberOfExamsTaken,
          statistics.listeningStatistics.numberOfExamsTaken,
          statistics.fullTestStatistics.numberOfExamsTaken,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="charts-container">
      {/* Bar Chart */}
      <div className="chart-wrapper">
        <h3>Average Scores Comparison</h3>
        <div style={{ height: "300px" }}>
          <Bar
            data={barChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: "Average Score by Exam Type",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: (value) => `${value}%`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Radar Chart */}
      <div className="chart-wrapper">
        <h3>Skills Profile</h3>
        <div style={{ height: "300px" }}>
          <Radar
            data={radarChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: "Accuracy Profile",
                },
              },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: (value) => `${value}%`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="chart-wrapper">
        <h3>Exam Distribution</h3>
        <div style={{ height: "300px" }}>
          <Doughnut
            data={doughnutChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: "Number of Exams by Type",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
```

---

## ⚠️ Error Handling

### Error Alert Component

```typescript
// components/ErrorAlert.tsx

import React from "react";
import { ApiError } from "@/types/exam-statistics";

interface Props {
  error: ApiError;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<Props> = ({ error, onRetry }) => {
  return (
    <div className="error-alert">
      <div className="error-icon">❌</div>
      <div className="error-content">
        <h3>Failed to Load Statistics</h3>
        <p>{error.message}</p>
        <p className="error-details">
          Status: {error.status} | Time:{" "}
          {new Date(error.timestamp).toLocaleString()}
        </p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  );
};
```

### Loader Component

```typescript
// components/Loader.tsx

import React from "react";

interface Props {
  message?: string;
}

export const Loader: React.FC<Props> = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};
```

---

## 📱 Responsive Design Examples

### CSS Styles (Tailwind CSS)

```tsx
// app/globals.css or components/ExamStatistics.module.css

.statistics-dashboard {
  @apply p-6 max-w-7xl mx-auto;
}

.dashboard-header {
  @apply flex justify-between items-center mb-8;
}

.dashboard-header h1 {
  @apply text-3xl font-bold text-gray-900 dark:text-white;
}

.refresh-btn {
  @apply px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition;
}

.summary-section {
  @apply mb-8;
}

.summary-section h2 {
  @apply text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200;
}

.skills-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8;
}

.statistics-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 transition-transform hover:scale-105;
}

.card-header h3 {
  @apply text-xl font-semibold text-gray-800 dark:text-white mb-1;
}

.subtitle {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.main-metrics {
  @apply flex justify-around my-6 py-4 border-y border-gray-200 dark:border-gray-700;
}

.metric {
  @apply flex flex-col items-center;
}

.metric-label {
  @apply text-sm text-gray-600 dark:text-gray-400 mb-1;
}

.metric-value {
  @apply text-2xl font-bold;
}

.detailed-stats {
  @apply space-y-3 mb-6;
}

.stat-row {
  @apply flex justify-between items-center;
}

.stat-label {
  @apply text-gray-700 dark:text-gray-300;
}

.stat-value {
  @apply font-semibold text-gray-900 dark:text-white;
}

.progress-bar-container {
  @apply mt-4;
}

.progress-label {
  @apply text-sm text-gray-600 dark:text-gray-400 mb-2;
}

.progress-bar {
  @apply w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden;
}

.progress-fill {
  @apply h-full rounded-full transition-all duration-500;
}

.charts-container {
  @apply grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6;
}

.chart-wrapper {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6;
}

.chart-wrapper h3 {
  @apply text-lg font-semibold mb-4 text-gray-800 dark:text-white;
}

.error-alert {
  @apply flex items-start gap-4 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg;
}

.error-icon {
  @apply text-3xl;
}

.error-content h3 {
  @apply text-lg font-semibold text-red-900 dark:text-red-200 mb-2;
}

.error-content p {
  @apply text-red-700 dark:text-red-300;
}

.error-details {
  @apply text-sm text-red-600 dark:text-red-400 mt-2;
}

.retry-button {
  @apply mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition;
}

.loader-container {
  @apply flex flex-col items-center justify-center min-h-[400px];
}

.spinner {
  @apply w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin;
}

.loader-container p {
  @apply mt-4 text-gray-600 dark:text-gray-400;
}
```

---

## ⚡ Performance Optimization

### Memoization with React.memo

```typescript
// Memoize components to prevent unnecessary re-renders

export const StatisticsCard = React.memo<Props>(
  ({ title, subtitle, statistics, color }) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return (
      prevProps.statistics === nextProps.statistics &&
      prevProps.color === nextProps.color
    );
  }
);

export const StatisticsChart = React.memo<Props>(({ statistics }) => {
  // Component implementation
});
```

### Data Caching with React Query

```bash
npm install @tanstack/react-query
```

```typescript
// hooks/useExamStatisticsQuery.ts

import { useQuery } from "@tanstack/react-query";
import { examStatisticsService } from "@/services/exam-statistics.service";

export const useExamStatisticsQuery = (userId: number) => {
  return useQuery({
    queryKey: ["examStatistics", userId],
    queryFn: () => examStatisticsService.getUserStatistics(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
```

### Setup React Query Provider

```typescript
// app/providers.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 🚀 Complete Example

### Next.js Page Component

```typescript
// app/statistics/page.tsx

"use client";

import React from "react";
import { ExamStatisticsDashboard } from "@/components/ExamStatisticsDashboard";
import { useSession } from "next-auth/react"; // or your auth solution
import { redirect } from "next/navigation";

export default function StatisticsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const userId = session?.user?.id;

  return (
    <main>
      <ExamStatisticsDashboard userId={userId} />
    </main>
  );
}
```

### React (Non-Next.js) Example

```typescript
// pages/Statistics.tsx

import React, { useContext } from "react";
import { ExamStatisticsDashboard } from "../components/ExamStatisticsDashboard";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const StatisticsPage: React.FC = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page-container">
      <ExamStatisticsDashboard userId={user.id} />
    </div>
  );
};
```

---

## 📝 Environment Variables

Create a `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# For production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 🧪 Testing Example

```typescript
// __tests__/ExamStatisticsDashboard.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { ExamStatisticsDashboard } from "@/components/ExamStatisticsDashboard";
import { examStatisticsService } from "@/services/exam-statistics.service";

jest.mock("@/services/exam-statistics.service");

const mockStatistics = {
  userId: 1,
  readingStatistics: {
    examType: "READING",
    numberOfExamsTaken: 5,
    accuracy: 85.5,
    averageScore: 82.3,
    totalQuestionsAttempted: 150,
    totalCorrectAnswers: 128,
    highestScore: 95.0,
    lowestScore: 70.0,
    averageTimeMinutes: null,
  },
  // ... other stats
};

describe("ExamStatisticsDashboard", () => {
  it("renders statistics when loaded", async () => {
    (examStatisticsService.getUserStatistics as jest.Mock).mockResolvedValue(
      mockStatistics
    );

    render(<ExamStatisticsDashboard userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Reading Skills")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument(); // numberOfExamsTaken
      expect(screen.getByText("82.3%")).toBeInTheDocument(); // averageScore
    });
  });

  it("displays error message on failure", async () => {
    (examStatisticsService.getUserStatistics as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    render(<ExamStatisticsDashboard userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to Load Statistics")).toBeInTheDocument();
    });
  });
});
```

---

## 📊 Sample API Response

```json
{
  "userId": 1,
  "readingStatistics": {
    "examType": "READING",
    "numberOfExamsTaken": 8,
    "accuracy": 87.5,
    "averageTimeMinutes": null,
    "averageScore": 85.25,
    "totalQuestionsAttempted": 320,
    "totalCorrectAnswers": 280,
    "highestScore": 95.0,
    "lowestScore": 76.67
  },
  "listeningStatistics": {
    "examType": "LISTENING",
    "numberOfExamsTaken": 6,
    "accuracy": 82.0,
    "averageTimeMinutes": null,
    "averageScore": 80.5,
    "totalQuestionsAttempted": 250,
    "totalCorrectAnswers": 205,
    "highestScore": 92.0,
    "lowestScore": 68.0
  },
  "fullTestStatistics": {
    "examType": "FULL_TEST",
    "numberOfExamsTaken": 3,
    "accuracy": 84.67,
    "averageTimeMinutes": null,
    "averageScore": 83.33,
    "totalQuestionsAttempted": 600,
    "totalCorrectAnswers": 508,
    "highestScore": 88.5,
    "lowestScore": 79.0
  },
  "overallStatistics": {
    "examType": "OVERALL",
    "numberOfExamsTaken": 17,
    "accuracy": 84.87,
    "averageTimeMinutes": null,
    "averageScore": 83.0,
    "totalQuestionsAttempted": 1170,
    "totalCorrectAnswers": 993,
    "highestScore": 95.0,
    "lowestScore": 68.0
  }
}
```

---

## 🎨 UI/UX Best Practices

1. **Loading States**: Always show loading indicators during data fetching
2. **Error Boundaries**: Wrap components in error boundaries to prevent crashes
3. **Empty States**: Display meaningful messages when no data is available
4. **Tooltips**: Add tooltips to explain metrics (e.g., "Accuracy = Correct Answers / Total Questions")
5. **Responsive Charts**: Ensure charts are readable on mobile devices
6. **Color Consistency**: Use consistent colors for Reading (green), Listening (orange), Full Test (red)
7. **Accessibility**: Add ARIA labels and ensure keyboard navigation works

---

## 🔐 Security Considerations

1. **Token Expiration**: Handle JWT token expiration gracefully
2. **HTTPS Only**: Always use HTTPS in production
3. **Input Validation**: Validate userId on both frontend and backend
4. **Rate Limiting**: Implement rate limiting on API calls
5. **CORS**: Configure CORS properly on backend

---

## 📦 Dependencies Summary

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "@tanstack/react-query": "^5.0.0",
    "next": "^14.0.0" // if using Next.js
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 🚀 Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` for production
- [ ] Enable HTTPS on API server
- [ ] Configure CORS for production domain
- [ ] Test authentication flow in production
- [ ] Verify charts render correctly on all devices
- [ ] Test error handling and retry mechanisms
- [ ] Enable production logging and monitoring
- [ ] Set up CDN for static assets
- [ ] Implement analytics tracking

---

## 📚 Additional Resources

- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 💡 Tips & Tricks

### Debouncing Refetch Calls

```typescript
import { debounce } from "lodash";

const debouncedRefetch = debounce(() => {
  refetch();
}, 500);
```

### Custom Hook for Statistics Calculations

```typescript
export const useStatisticsCalculations = (
  statistics: UserExamStatistics | null
) => {
  const totalExams = statistics
    ? statistics.readingStatistics.numberOfExamsTaken +
      statistics.listeningStatistics.numberOfExamsTaken +
      statistics.fullTestStatistics.numberOfExamsTaken
    : 0;

  const averageAccuracy = statistics
    ? (
        (statistics.readingStatistics.accuracy +
          statistics.listeningStatistics.accuracy +
          statistics.fullTestStatistics.accuracy) /
        3
      ).toFixed(1)
    : "0.0";

  return { totalExams, averageAccuracy };
};
```

### Dark Mode Support

```typescript
// Use CSS variables for theme switching
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
}

[data-theme='dark'] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}
```

---

## 🤝 Support

For questions or issues:

- Backend API: Check `EXAM_STATISTICS_API.md`
- Frontend: Refer to this guide
- GitHub Issues: [Create an issue](your-repo-url)

---

**Last Updated:** January 2026  
**Version:** 1.0.0
