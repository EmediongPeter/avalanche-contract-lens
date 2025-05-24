
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
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-400">{card.title}</p>
                <p className={`text-3xl font-bold ${card.color || "text-white"}`}>{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Vulnerability Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                    contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#333" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Severity Distribution</CardTitle>
            <select className="px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-white">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 12 months</option>
              <option>All time</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                    contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#333" }}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
