import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StepCardProps {
  number: number
  title: string
  description: string
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <Card className="relative bg-slate-950/50 border-slate-800 backdrop-blur-xl">
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-purple-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400">{description}</p>
      </CardContent>
    </Card>
  )
}

