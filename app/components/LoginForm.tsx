"use client"; // Client component directive

import React, { useState } from "react";
import { Button, Form, Input, Typography, Divider, Drawer } from "antd";
import { GoogleLogin } from "@react-oauth/google"; // Google login import

const { Title, Text } = Typography;

// Define types for the props of the LoginForm component
interface LoginFormProps {
    onSubmit: (values: LoginInput) => void;
    onGoogleLogin: (credential?: string) => void; // GoogleLogin's response is the credential string
}

export interface LoginInput {
    email: string;
    password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onGoogleLogin }) => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [isLoading, setIsLoading] = useState(false); // For handling loading state during form submission

    // Handle form submission
    const handleSubmit = async (values: LoginInput) => {
        setIsLoading(true);
        try {
            await onSubmit(values); // Call the passed function for form submission (e.g., login API call)
        } catch (error) {
            console.error("Login failed:", error);
        }
        setIsLoading(false);
    };

    return (
        <Drawer
            title={null}
            placement={"right"} // Dynamic placement based on screen size
            closable={true}
            onClose={() => onSubmit}
            open={true}
            width={500}
            className={`auth-drawer`} // Add class for mobile style if needed
        >
            <div className="auth-drawer max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="auth-header">
                    <Title level={3} className="auth-title text-center text-2xl mb-6">Login</Title>
                    <Text className="auth-subtext text-center mb-4">Please enter your details</Text>
                </div>

                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    initialValues={{ email: "", password: "" }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email", message: "Please enter a valid email address" }]}>
                        <Input placeholder="Enter your email" className="auth-input" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password!" }]}>
                        <Input.Password placeholder="Enter your password" className="auth-input" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                            className="auth-button"
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <Divider className="auth-divider">OR</Divider>

                <div className="text-center">
                    <GoogleLogin
                        onSuccess={({ credential }) => onGoogleLogin(credential)} // Pass the credential to onGoogleLogin
                        onError={() => alert("Google login failed")}
                    />
                </div>

                <div className="mt-4 text-center">
                    <Text>
                        Don&apos;t have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
                    </Text>
                </div>
            </div>
        </Drawer>
    );
};

export default LoginForm;
