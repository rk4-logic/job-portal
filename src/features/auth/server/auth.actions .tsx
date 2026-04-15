"use server";

import { db } from "@/config/db";
import { loginUserSchema, registerUserSchema } from "../auth.schema";
import { applicants, employers, users } from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";
import argon2 from "argon2";
import { createSessionAndSetCookies, invalidateSession } from "./use-cases/sessions";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { cookies } from "next/headers";

export const registerUserAction = async (data: RegistrationFormData) => {

    try {

        const { data: validatedData, error } = registerUserSchema.safeParse(data);
        if (error) return { status: "ERROR", message: error.issues[0].message };

        const { name, userName, email, password, role } = validatedData;
        const [user] = await db
            .select()
            .from(users)
            .where(or(eq(users.email, email), eq(users.userName, userName)));

        if (user) {
            if (user.email === email)
                return { status: "ERROR", message: "Email Already Exists" };
            else
                return {
                    status: "ERROR",
                    message: "UseName Already Exists",
                };
        }

        const hashedPassword = await argon2.hash(password);

        await db.transaction(async (tx) => {
            const [result] = await tx
                .insert(users)
                .values({ name, userName, email, password: hashedPassword, role });

            console.log(result);

            if (role === "applicant") {
                await tx.insert(applicants).values({ id: result.insertId });
            } else {
                await tx.insert(employers).values({ id: result.insertId });
            }

            await createSessionAndSetCookies(result.insertId, tx);
        });

        return {
            status: "SUCCESS",
            message: "Registration Completed Successfully",
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            status: "ERROR",
            message: "An error occurred while registering the user",
            errorDetails: error instanceof Error ? error.message : String(error),
        };
    }
};

export const loginUserAction = async (data: LoginFormData) => {
    try {
        const { data: validatedData, error } = loginUserSchema.safeParse(data);
        if (error) return { status: "ERROR", message: error.issues[0].message };

        const { email, password } = validatedData;
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) return { status: "ERROR", message: "Invalid Email or Password" };

        const isValidPassword = await argon2.verify(user.password, password);
        if (!isValidPassword) return { status: "ERROR", message: "Invalid Email or Password" };

        await createSessionAndSetCookies(user.id);

        return {
            status: "SUCCESS",
            message: " Login Successful"
        }

    } catch (error) {
        return {
            status: "ERROR",
            message: "An error occurred while logging in the user",
        };
    }
};

export const logoutUserAction = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return redirect("/login");
    console.log(session);

    const hashedToken = crypto
        .createHash("sha-256")
        .update(session)
        .digest("hex");

    await invalidateSession(hashedToken);
    cookieStore.delete("session");

    return redirect("/login");
};