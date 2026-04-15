'use server';

import { db } from "@/config/db";
import { employers } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq } from "drizzle-orm";

export const updateEmployerProfileAction = async (data: IFormInput) => {
try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    const {
      name,
      description,
      yearOfEstablishment,
      location,
      websiteUrl,
      organizationType,
      teamSize,
      // avatarUrl,
      // bannerImageUrl,
    } = data;

    const updatedEmployer = await db
      .update(employers)
      .set({
        name,
        description,
        location,
        websiteUrl,
        organizationType,
        teamSize,
        // bannerImageUrl,
        yearOfEstablishment: yearOfEstablishment
          ? parseInt(yearOfEstablishment)
          : null,
      })
      .where(eq(employers.id, currentUser.id));

    console.log("employers ", updatedEmployer);

    // await db
    //   .update(users)
    //   .set({
    //     avatarUrl,
    //   })
    //   .where(eq(users.id, currentUser.id));

    return { status: "SUCCESS", message: "Profile updated successfully" };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Something went wrong, please try again",
    };
  }
}