"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useComplaints, type Complaint } from "@/context/complaint-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "./mode-toggle";
import { ComplaintList } from "./complaint-list";
import { ComplaintDetail } from "./complaint-detail";
import { LogOut, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";

export default function RectorDashboard() {
  const { user, logout } = useAuth();
  const { getAllComplaints } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );

  if (!user) return null;

  const allComplaints = getAllComplaints();
  const pendingComplaints = allComplaints.filter((c) => c.status === "pending");
  const resolvedComplaints = allComplaints.filter(
    (c) => c.status === "resolved"
  );
  const rejectedComplaints = allComplaints.filter(
    (c) => c.status === "rejected"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <h1 className="text-xl font-bold">PU Hostel Complaints</h1>
          <Image
            src="/logo.png"
            alt="PU Hostel Complaints Logo"
            width={140}
            height={140}
          />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="outline" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome, {user.name}
            </h2>
            <p className="text-muted-foreground">
              Manage and respond to student complaints
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Complaints
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pendingComplaints.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complaints awaiting your response
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resolved Complaints
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {resolvedComplaints.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Successfully resolved issues
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rejected Complaints
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {rejectedComplaints.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complaints that were rejected
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Complaint Management
                </CardTitle>
                <CardDescription>
                  View and update the status of student complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pending" className="mt-4">
                    <ComplaintList
                      complaints={pendingComplaints}
                      emptyMessage="There are no pending complaints."
                      onSelect={setSelectedComplaint}
                      selectedId={selectedComplaint?.id}
                    />
                  </TabsContent>
                  <TabsContent value="resolved" className="mt-4">
                    <ComplaintList
                      complaints={resolvedComplaints}
                      emptyMessage="There are no resolved complaints."
                      onSelect={setSelectedComplaint}
                      selectedId={selectedComplaint?.id}
                    />
                  </TabsContent>
                  <TabsContent value="rejected" className="mt-4">
                    <ComplaintList
                      complaints={rejectedComplaints}
                      emptyMessage="There are no rejected complaints."
                      onSelect={setSelectedComplaint}
                      selectedId={selectedComplaint?.id}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Complaint Details</CardTitle>
                <CardDescription>
                  View and update the selected complaint
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedComplaint ? (
                  <ComplaintDetail
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      No complaint selected
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select a complaint from the list to view its details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
