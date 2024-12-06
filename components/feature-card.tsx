import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-slate-950/50 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <Icon className="h-8 w-8 text-purple-500" />
        <CardTitle className="text-xl text-purple-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400">{description}</p>
      </CardContent>
    </Card>
  )
}

