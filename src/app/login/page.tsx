"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@/features/auth/auth.schema";
import { loginUserAction } from "@/features/auth/server/auth.actions ";
import { redirect } from "next/navigation";

const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginUserSchema),
        mode: "onTouched",
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onSubmit = async (data: LoginFormData) => {
        let status= false
        try {
            const result = await loginUserAction(data);

            if (result.status === "SUCCESS") {
                status = true;
                toast.success(result.message);
            }
            else toast.error(result.message);
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error("Login error:", error);
        }
        if (status) redirect("/dashboard");
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-[400px] shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-center text-2xl font-bold tracking-tight">
                        Login to the Job Portal
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>

                {/* Wrap the content AND the footer button in the form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                {...register("email")}
                                className={`px-4 ${errors.email ? "border-destructive" : ""
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    {...register("password")}
                                    className={`px-4 ${errors.password ? "border-destructive" : ""
                                        }`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col py-2 gap-4">
                        <Button type="submit" className="w-full">
                            Login
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            No account?{" "}
                            <Link href="/register" className="text-primary font-semibold hover:underline">
                                Sign Up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Login