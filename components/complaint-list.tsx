"use client"

import { motion } from "framer-motion"
import type { Complaint } from "@/context/complaint-context"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface ComplaintListProps {
  complaints: Complaint[]
  emptyMessage: string
  onSelect?: (complaint: Complaint) => void
  selectedId?: string
}

export function ComplaintList({ complaints, emptyMessage, onSelect, selectedId }: ComplaintListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    }
  }

  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4 space-y-4">
        {complaints.map((complaint) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: onSelect ? 1.02 : 1 }}
            onClick={() => onSelect && onSelect(complaint)}
            className={`p-4 rounded-lg border ${
              selectedId === complaint.id ? "border-primary" : ""
            } ${onSelect ? "cursor-pointer" : ""}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{complaint.title}</h3>
              <Badge variant="outline" className={getStatusColor(complaint.status)}>
                <span className="flex items-center">
                  {getStatusIcon(complaint.status)}
                  <span className="ml-1 capitalize">{complaint.status}</span>
                </span>
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-2 line-clamp-2">{complaint.description}</div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Room: {complaint.roomNumber}</span>
              <span>{formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}

