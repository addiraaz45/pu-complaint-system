"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useComplaints } from "@/context/complaint-context";
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
import { ComplaintForm } from "./complaint-form";
import { ComplaintList } from "./complaint-list";
import { LogOut, Plus, FileText } from "lucide-react";
import Image from "next/image";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { getStudentComplaints } = useComplaints();
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);

  if (!user) return null;

  const studentComplaints = getStudentComplaints(user.id);

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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome, {user.name}
              </h2>
              <p className="text-muted-foreground">
                Manage and track your hostel complaints
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowNewComplaintForm(!showNewComplaintForm)}
              >
                {showNewComplaintForm ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    New Complaint
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {showNewComplaintForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Submit New Complaint</CardTitle>
                    <CardDescription>
                      Fill out the form below to submit a new complaint
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ComplaintForm
                      onSuccess={() => setShowNewComplaintForm(false)}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Your Complaints
              </CardTitle>
              <CardDescription>
                View and track the status of your submitted complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved/Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <ComplaintList
                    complaints={studentComplaints}
                    emptyMessage="You haven't submitted any complaints yet."
                  />
                </TabsContent>
                <TabsContent value="pending" className="mt-4">
                  <ComplaintList
                    complaints={studentComplaints.filter(
                      (c) => c.status === "pending"
                    )}
                    emptyMessage="You don't have any pending complaints."
                  />
                </TabsContent>
                <TabsContent value="resolved" className="mt-4">
                  <ComplaintList
                    complaints={studentComplaints.filter(
                      (c) => c.status === "resolved" || c.status === "rejected"
                    )}
                    emptyMessage="You don't have any resolved or rejected complaints."
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}