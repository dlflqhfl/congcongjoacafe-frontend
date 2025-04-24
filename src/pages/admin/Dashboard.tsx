import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from "react-chartjs-2";
import { Store, Coffee, Users, DollarSign, ChevronDown } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useNavigate} from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const SalesChart = () => {
  const [salesPeriod, setSalesPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const [chartData, setChartData] = useState({
    labels: salesPeriod === 'monthly'
        ? ['1월', '2월', '3월', '4월', '5월', '6월']
        : ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: salesPeriod === 'monthly' ? '월 매출' : '연 매출',
        data: salesPeriod === 'monthly'
            ? [12000000, 19000000, 15000000, 25000000, 22000000, 30000000]
            : [150000000, 180000000, 210000000, 250000000, 300000000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: '#2C5F2D',
        borderWidth: 1,
      },
    ],
  });
  const [chartType, setChartType] = useState('line');
  const [dataView, setDataView] = useState('overall');

  const handleDataViewChange = useCallback((view: 'byStore' | 'byMenu' | 'overall') => {
    setDataView(view);
    // Here you would typically fetch new data based on the selected view
    // For this example, we'll just use dummy data
    if (view === "byStore") {
      setChartData({
        labels: ["매장1", "매장2", "매장3", "매장4", "매장5"],
        datasets: [{
          label: "매장별 매출",
          data: [300000, 450000, 320000, 280000, 390000],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: "#2C5F2D",
          borderWidth: 1,
        }],
      });
    } else if (view === "byMenu") {
      setChartData({
        labels: ["아메리카노", "카페라떼", "카푸치노", "에스프레소", "녹차라떼"],
        datasets: [{
          label: "메뉴별 판매량",
          data: [500, 300, 200, 100, 150],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: "#2C5F2D",
          borderWidth: 1,
        }],
      });
    } else {
      // Reset to overall view
      setChartData({
        labels: salesPeriod === "monthly"
            ? ["1월", "2월", "3월", "4월", "5월", "6월"]
            : ["2019", "2020", "2021", "2022", "2023"],
        datasets: [
          {
            label: salesPeriod === "monthly" ? "월 매출" : "연 매출",
            data: salesPeriod === "monthly"
                ? [12000000, 19000000, 15000000, 25000000, 22000000, 30000000]
                : [150000000, 180000000, 210000000, 250000000, 300000000],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
              "rgba(255, 159, 64, 0.5)",
            ],
            borderColor: "#2C5F2D",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [salesPeriod]);

  return (
      <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <h2 className="text-lg font-semibold">매출 추이</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Select
                value={salesPeriod}
                onValueChange={(value: 'monthly' | 'yearly') => {
                  setSalesPeriod(value);
                  handleDataViewChange(dataView as "overall" | "byStore" | "byMenu");
                }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="매출 기간 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">월별 매출</SelectItem>
                <SelectItem value="yearly">연간 매출</SelectItem>
              </SelectContent>
            </Select>
            <Select
                value={chartType}
                onValueChange={(value) => setChartType(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="차트 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">선 그래프</SelectItem>
                <SelectItem value="bar">막대 그래프</SelectItem>
                <SelectItem value="pie">원형 그래프</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Tabs value={dataView} onValueChange={(value: string) => handleDataViewChange(value as "byStore" | "byMenu" | "overall")} className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="overall">전체 매출</TabsTrigger>
            <TabsTrigger value="byStore">매장별 매출</TabsTrigger>
            <TabsTrigger value="byMenu">메뉴별 매출</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="h-[400px] w-full">
          {chartType === 'line' && (
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          )}
          {chartType === 'bar' && (
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          )}
          {chartType === 'pie' && (
              <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          )}
        </div>
      </>
  );
};

const AdminDashboard = () => {
  const [storeRankings, setStoreRankings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [totalPages, setTotalPages] = useState(5); // 예시로 5페이지로 설정
  const loadingRef = useRef(null);
  const navigate = useNavigate();

  const fetchStoreRankings = useCallback(async () => {
    // 실제 API 호출로 대체해야 합니다
    const itemsPerPage = 5;
    const newRankings = Array.from({ length: itemsPerPage }, (_, i) => ({
      id: i + 1 + (currentPage - 1) * itemsPerPage,
      name: `콩콩조아 ${i + 1 + (currentPage - 1) * itemsPerPage}호점`,
      location: '서울시 강남구',
      sales: Math.floor(Math.random() * 100000000) + 10000000
    }));

    setStoreRankings(newRankings);
    setHasMore(currentPage < totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    fetchStoreRankings();
  }, [fetchStoreRankings, currentPage]);

  const stats = [
    {
      title: '총 매장 수',
      value: '32',
      icon: Store,
      change: '+2',
      changeType: 'increase',
    },
    {
      title: '이번 달 매출',
      value: '₩30,000,000',
      icon: DollarSign,
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: '신규 회원',
      value: '245',
      icon: Users,
      change: '+18%',
      changeType: 'increase',
    },
    {
      title: '인기 메뉴',
      value: '아메리카노',
      icon: Coffee,
      change: '2,341잔',
      changeType: 'neutral',
    },
  ];

  const handleSortChange = (value) => {
    setSortOrder(value);
    setStoreRankings([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">관리자 대시보드</h1>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Button
                onClick={() =>  navigate('/admin/stores')}
                className="flex items-center justify-center flex-1 md:flex-none"
            >
              <Store className="w-5 h-5 mr-2" />
              매장 관리
            </Button>
            <Button
                onClick={() => navigate('/admin/menus')}
                className="flex items-center justify-center flex-1 md:flex-none"
            >
              <Coffee className="w-5 h-5 mr-2" />
              메뉴 관리
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
              <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    <div className={`flex items-center mt-2 text-sm ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg"
          >
            <SalesChart />
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">매장별 매출 순위</h2>
              <Select value={sortOrder} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="정렬 순서" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">매출 높은 순</SelectItem>
                  <SelectItem value="asc">매출 낮은 순</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {storeRankings.map((store, index) => (
                  <div key={store.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-sm text-gray-500">{store.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₩{store.sales.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">월 매출</p>
                    </div>
                  </div>
              ))}
              <div ref={loadingRef} className="flex justify-center items-center p-4 md:hidden">
                {hasMore && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    </motion.div>
                )}
              </div>
            </div>
            <div className="mt-4 hidden md:block">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} className={currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} className={currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </motion.div>
        </div>
      </div>
  );
};

export default AdminDashboard;

