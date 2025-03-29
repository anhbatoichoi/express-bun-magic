
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">MedConnect</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A powerful Express.js and TypeScript backend for healthcare appointment booking
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Authentication and profile management</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>User registration and login</li>
                <li>Profile management</li>
                <li>Role-based permissions</li>
                <li>Secure password handling</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">API Documentation</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Doctor Management</CardTitle>
              <CardDescription>Doctor profiles and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Doctor profiles and specializations</li>
                <li>Availability management</li>
                <li>Patient reviews and ratings</li>
                <li>Qualification verification</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">API Documentation</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment System</CardTitle>
              <CardDescription>Scheduling and management</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Appointment booking</li>
                <li>Status updates and notifications</li>
                <li>Medical records management</li>
                <li>Calendar integration</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">API Documentation</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-8">
            The backend is ready for integration with your frontend application.
            Connect your React frontend to these API endpoints to build a complete healthcare platform.
          </p>
          <Button size="lg">View API Documentation</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
