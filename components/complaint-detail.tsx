"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { type Complaint, useComplaints } from "@/context/complaint-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CheckCircle, XCircle, ArrowLeft, Clock } from "lucide-react"

interface ComplaintDetailProps {
  complaint: Complaint
  onClose: () => void
}

export function ComplaintDetail({ complaint, onClose }: ComplaintDetailProps) {
  const { updateComplaintStatus } = useComplaints()
  const [comments, setComments] = useState(complaint.comments || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (status: "resolved" | "rejected") => {
    setIsUpdating(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateComplaintStatus(complaint.id, status, comments)
    setIsUpdating(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-green-500/10 text-green-500">
            <CheckCircle className="h-4 w-4 mr-1" />
            Resolved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-500">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onClose} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{complaint.title}</h3>
          {getStatusBadge(complaint.status)}
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Category:</span> {complaint.category}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Room:</span> {complaint.roomNumber}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Student:</span> {complaint.studentName}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Submitted:</span> {format(new Date(complaint.createdAt), "PPpp")}
          </div>
          {complaint.updatedAt && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Last Updated:</span> {format(new Date(complaint.updatedAt), "PPpp")}
            </div>
          )}
        </div>

        <div className="p-3 bg-muted rounded-md">
          <p className="whitespace-pre-wrap">{complaint.description}</p>
        </div>

        {complaint.status === "pending" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rector Comments</label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your comments or feedback here..."
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                <Button
                  onClick={() => handleStatusUpdate("resolved")}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isUpdating}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                <Button
                  onClick={() => handleStatusUpdate("rejected")}
                  variant="destructive"
                  className="w-full"
                  disabled={isUpdating}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Complaint
                </Button>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Rector Comments</h4>
            <div className="p-3 bg-muted rounded-md">
              <p className="whitespace-pre-wrap">{complaint.comments || "No comments provided."}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

