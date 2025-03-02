"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", expenses: 2400 },
  { name: "Feb", expenses: 1398 },
  { name: "Mar", expenses: 3200 },
  { name: "Apr", expenses: 2780 },
  { name: "May", expenses: 1890 },
  { name: "Jun", expenses: 2390 },
]

export function ExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          formatter={(value) => [`$${value}`, "Expenses"]}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
          }}
        />
        <Bar dataKey="expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

