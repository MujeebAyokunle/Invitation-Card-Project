"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FloralCorner from "@/components/FloralCorner";
import Monogram from "@/components/Monogram";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signIn } from "../../../supabase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();

    // useEffect(() => {
    //     async function fetchData() {
    //         const { data, error } = await supabase.auth.getUser()

    //         console.log({ data })
    //         if (error) console.error(error)
    //         // else setData(data)
    //     }

    //     fetchData()
    // }, [])

    useEffect(() => {
        if (user) {
            // navigate.push("/admin");
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await signIn(email, password);

            if (error) {
                toast({
                    title: "Sign in failed",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                navigate.push("/admin");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: "hsl(36 47% 97%)" }} className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Background decorations */}
            <FloralCorner position="top-left" size="lg" className="opacity-30" />
            <FloralCorner position="top-right" size="lg" className="opacity-30" />
            <FloralCorner position="bottom-left" size="lg" className="opacity-30" />
            <FloralCorner position="bottom-right" size="lg" className="opacity-30" />

            <Card className="w-full max-w-md relative z-10  shadow-lg"
                style={{ border: "1px solid hsl(40 35% 82%)" }}
            >
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <Monogram letter="T" size="sm" />
                    </div>
                    <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
                    {/* <CardDescription>
                        80th Birthday Event Management
                    </CardDescription> */}
                    <br />
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            style={{ backgroundColor: "hsl(18 70% 47%)" }}
                            className="w-full hover:bg-[hsl(18_70%_47%)]/90 text-white cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-[hsl(30_15%_50%)] hover:text-[hsl(30_25%_20%)] transition-colors">
                            ← Back to home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
