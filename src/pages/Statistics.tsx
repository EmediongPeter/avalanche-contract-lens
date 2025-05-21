
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const vulnerabilityData = [
  { name: "Reentrancy", value: 32, color: "#FF3E3E" },
  { name: "Access Control", value: 28, color: "#FF9F2D" },
  { name: "Integer Overflow", value: 25, color: "#FFD600" },
  { name: "Other", value: 15, color: "#4ADE80" }
];

const severityData = [
  { name: "Critical", value: 24, color: "#FF3E3E" },
  { name: "High", value: 32, color: "#FF9F2D" },
  { name: "Medium", value: 40, color: "#FFD600" },
  { name: "Low", value: 48, color: "#4ADE80" },
  { name: "Info", value: 44, color: "#38BDF8" }
];

const statCards = [
  { title: "Total Contracts", value: "247" },
  { title: "Total Issues", value: "1,532" },
  { title: "Critical Issues", value: "127", color: "text-red-500" },
  { title: "Avg Issues/Contract", value: "6.2" }
];

export default function Statistics() {
  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gradient text-center sm:text-left">Statistics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index} className="card-glass border-gray-800/50">
            <CardContent className="p-5 sm:p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-400">{card.title}</p>
                <p className={`text-3xl font-bold ${card.color || "text-gradient"}`}>{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-glass border-gray-800/50 h-[450px] md:h-[500px]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gradient">Vulnerability Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#333", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-gray-800/50 h-[450px] md:h-[500px]">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-xl font-bold text-gradient">Severity Distribution</CardTitle>
            <select className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 12 months</option>
              <option>All time</option>
            </select>
          </CardHeader>
          <CardContent className="h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={severityData}
                margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#A0A0A0' }}
                  axisLine={{ stroke: '#333' }}
                />
                <YAxis 
                  hide={true}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#333", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
