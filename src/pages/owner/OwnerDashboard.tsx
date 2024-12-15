import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useOwnerAuthStore } from "@/store/ownerAuthStore"
import { ownerAxios } from "@/api/axiosInterceptor"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const OwnerDashboard = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [operatingHours, setOperatingHours] = useState({ start: 9, end: 22 })
  const sName = useOwnerAuthStore(state => state.sName)

  const fetchDashboardStats = async () => {
    const { data } = await ownerAxios.get('/api/owner/dashboard-stats')
    return data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  })

  const { orders, revenue, menu, customers } = data || {
    orders: { count: 0, pending: 0 },
    revenue: { total: 0, percentage: '0%' },
    menu: { name: '', sales: 0, revenue: 0 },
    customers: { total: 0, unanswered: 0 },
  }

  const stats = [
    {
      title: '오늘의 주문',
      value: isLoading ? <Skeleton className="h-8 w-24" /> : orders?.count,
      status: isLoading ? <Skeleton className="h-4 w-20" /> : `대기중: ${orders?.pending}`,
    },
    {
      title: '오늘의 매출',
      value: isLoading ? <Skeleton className="h-8 w-32" /> : `₩${revenue?.total}`,
      status: isLoading ? <Skeleton className="h-4 w-20" /> : revenue?.percentage,
    },
    {
      title: '오늘의 메뉴',
      value: isLoading ? <Skeleton className="h-8 w-28" /> : menu?.name,
      status: isLoading ? <Skeleton className="h-4 w-32" /> : `${menu?.sales}개 판매(₩${menu?.revenue})`,
    },
    {
      title: '고객 문의',
      value: isLoading ? <Skeleton className="h-8 w-24" /> : customers?.total,
      status: isLoading ? <Skeleton className="h-4 w-24" /> : `미답변: ${customers?.unanswered}`,
    },
  ]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const generateHourlyLabels = (start: number, end: number) => {
    const labels = []
    for (let i = start; i <= end; i++) {
      labels.push(`${i}시`)
    }
    return labels
  }

  const dailyOrdersData = {
    labels: generateHourlyLabels(operatingHours.start, operatingHours.end),
    datasets: [
      {
        label: '주문 수',
        data: isLoading
            ? Array(operatingHours.end - operatingHours.start + 1).fill(0)
            : Array.from({ length: operatingHours.end - operatingHours.start + 1 }, () =>
                Math.floor(Math.random() * 20)
            ),
        backgroundColor: '#2C5F2D',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '시간대별 주문',
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  }

  const realTimeOrders = isLoading
      ? []
      : [
        { id: 1, time: '5분 전', items: '아메리카노 외 2개', status: 'pending' },
        { id: 2, time: '12분 전', items: '카페라떼 외 1개', status: 'preparing' },
        { id: 3, time: '18분 전', items: '바닐라라떼', status: 'completed' },
      ]

  const topSales = isLoading
      ? []
      : [
        { rank: 1, name: '아메리카노', sales: 52 },
        { rank: 2, name: '카페라떼', sales: 38 },
        { rank: 3, name: '바닐라라떼', sales: 25 },
      ]

  return (
      <div className={`${isMobile ? 'h-[calc(100vh-4rem)]' : ''} overflow-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">콩콩조아 {sName}</h1>
              <p className="text-gray-500">영업중 · {operatingHours.start}:00 - {operatingHours.end}:00</p>
            </div>
            {!isMobile && (
                <div className="flex space-x-4">
                  <button className="btn-primary">영업 상태 변경</button>
                  <button className="btn-primary">메뉴 관리</button>
                </div>
            )}
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
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-500 truncate">{stat.title}</p>
                      <div className="bg-primary/10 p-3 rounded-full">
                        {/* Icon placeholder */}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-2xl font-semibold break-words">{stat.value}</p>
                    </div>
                    <p className="text-sm text-primary mt-2 truncate">{stat.status}</p>
                  </div>
                </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">시간대별 주문</h2>
              {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="space-y-3">
                      <Skeleton className="h-[250px] w-[500px]" />
                    </div>
                  </div>
              ) : (
                  <Bar data={dailyOrdersData} options={chartOptions} />
              )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-lg"
            >
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                      value="orders"
                      className="text-gray-600 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors appearance-none p-2"
                  >
                    실시간 주문
                  </TabsTrigger>
                  <TabsTrigger
                      value="topSales"
                      className="text-gray-600 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors appearance-none p-2"
                  >
                    매출 순위 TOP3
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                  <div className="space-y-4 mt-4">
                    {isLoading ? (
                        <div className="space-y-3">
                          <Skeleton className="h-[60px] w-full" />
                          <Skeleton className="h-[60px] w-full" />
                          <Skeleton className="h-[60px] w-full" />
                        </div>
                    ) : realTimeOrders.length > 0 ? (
                        realTimeOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <div className="flex items-center space-x-2">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    order.status === 'pending'
                                        ? 'bg-yellow-400'
                                        : order.status === 'preparing'
                                            ? 'bg-blue-400'
                                            : 'bg-green-400'
                                }`}
                            />
                                  <p className="font-medium">주문 #{order.id}</p>
                                </div>
                                <p className="text-sm text-gray-500">{order.items}</p>
                                <p className="text-xs text-gray-400">{order.time}</p>
                              </div>
                              <div className="flex space-x-2">
                                {order.status === 'pending' && (
                                    <>
                                      <button className="px-3 py-1 bg-primary text-white rounded-md">승인</button>
                                      <button className="px-3 py-1 bg-red-500 text-white rounded-md">거절</button>
                                    </>
                                )}
                                {order.status === 'preparing' && (
                                    <button className="px-3 py-1 bg-green-500 text-white rounded-md">완료</button>
                                )}
                              </div>
                            </div>
                        ))
                    ) : (
                        <p>주문 내역이 없습니다.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="topSales">
                  <div className="space-y-4 mt-4">
                    {isLoading ? (
                        <div className="space-y-3">
                          <Skeleton className="h-[60px] w-full" />
                          <Skeleton className="h-[60px] w-full" />
                          <Skeleton className="h-[60px] w-full" />
                        </div>
                    ) : topSales.length > 0 ? (
                        topSales.map((item) => (
                            <div key={item.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <span className="text-2xl font-bold">{item.rank}</span>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-500">{item.sales}잔 판매</p>
                                </div>
                              </div>
                            </div>
                        ))
                    ) : (
                        <p>매출 데이터가 없습니다.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {isMobile && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <div className="flex space-x-4">
                  <button className="flex-1 py-3 bg-primary text-white rounded-lg">영업 상태 변경</button>
                  <button className="flex-1 py-3 bg-primary text-white rounded-lg">메뉴 관리</button>
                </div>
              </div>
          )}
        </div>
      </div>
  )
}

export default OwnerDashboard