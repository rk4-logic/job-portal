"use server";

import { db } from "@/config/db";
import { JobFormData, jobSchema } from "../jobs/jobs.schema";
import { jobs } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { and, eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

export const createJobAction = async (data: JobFormData) => {
  try {
    const { success, data: result, error } = jobSchema.safeParse(data);
    if (!success) {
      console.error("ZOD ERRORS:", error.flatten());
      console.log("RECEIVED DATA:", data);

      return {
        status: "ERROR",
        message: error.issues[0].message,
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    await db.insert(jobs).values({ ...result, employerId: currentUser.id });
    return { status: "SUCCESS", message: "Job posted successfully" };

  } catch (error) {
    return {
      status: "ERROR",
      message: "Something went wrong, please try again",
    };
  }
};

export const getEmployerJobsAction = async (): Promise<{
  status: "SUCCESS" | "ERROR";
  data?: Job[];
  message?: string;
}> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", data: [] };
    }

    const result = await db
      .select()
      .from(jobs)
      .where(eq(jobs.employerId, currentUser.id))
      .orderBy(jobs.createdAt);

    return { status: "SUCCESS", data: result as Job[] };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Something went wrong",
    };
  }
};

export const deleteJobAction = async (jobId: number) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    await db
      .delete(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, currentUser.id)));
    
    return { status: "SUCCESS", message: "Job deleted successfully" };
  } catch (error) {
    console.error("DELETE_JOB_ERROR", error);
    return { status: "ERROR", message: "Something went wrong while deleting" };
  }
};

export const getJobByIdAction = async (jobId: number) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { status: "ERROR", message: "Unauthorized" };

    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, currentUser.id)))
      .limit(1);

    if (!job) {
      return { status: "ERROR", message: "Job not found" };
    }

    return { status: "SUCCESS", data: job };
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch job details" };
  }
};

export const updateJobAction = async (jobId: number, values: any) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    await db
      .update(jobs)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, currentUser.id)));

    return { status: "SUCCESS", message: "Job updated successfully" };
  } catch (error) {
    return { status: "ERROR", message: "Failed to update job" };
  }
};