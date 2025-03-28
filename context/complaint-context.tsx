"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export type ComplaintStatus = "pending" | "resolved" | "rejected"

export interface Complaint {
  id: string
  title: string
  description: string
  category: string
  roomNumber: string
  createdAt: string
  status: ComplaintStatus
  studentId: string
  studentName: string
  hostelId: string
  updatedAt?: string
  comments?: string
}

interface ComplaintContextType {
  complaints: Complaint[]
  addComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "status">) => void
  updateComplaintStatus: (id: string, status: ComplaintStatus, comments?: string) => void
  getStudentComplaints: (studentId: string) => Complaint[]
  getHostelComplaints: (hostelId: string) => Complaint[]
  getAllComplaints: () => Complaint[]
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined)

export function ComplaintProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Load complaints from localStorage
    const storedComplaints = localStorage.getItem("complaints")
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints))
    }
  }, [])

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("complaints", JSON.stringify(complaints))
  }, [complaints])

  const addComplaint = (complaintData: Omit<Complaint, "id" | "createdAt" | "status">) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: `complaint-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    }

    setComplaints((prev) => [...prev, newComplaint])
  }

  const updateComplaintStatus = (id: string, status: ComplaintStatus, comments?: string) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? {
              ...complaint,
              status,
              updatedAt: new Date().toISOString(),
              comments: comments || complaint.comments,
            }
          : complaint,
      ),
    )
  }

  const getStudentComplaints = (studentId: string) => {
    return complaints.filter((complaint) => complaint.studentId === studentId)
  }

  const getHostelComplaints = (hostelId: string) => {
    return complaints.filter((complaint) => complaint.hostelId === hostelId)
  }

  const getAllComplaints = () => {
    return complaints
  }

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        addComplaint,
        updateComplaintStatus,
        getStudentComplaints,
        getHostelComplaints,
        getAllComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  )
}

export function useComplaints() {
  const context = useContext(ComplaintContext)
  if (context === undefined) {
    throw new Error("useComplaints must be used within a ComplaintProvider")
  }
  return context
}

