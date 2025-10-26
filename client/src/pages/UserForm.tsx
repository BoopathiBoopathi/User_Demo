import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export interface User {
    firstName: string;
    lastName: string;
    emailId: string;
    imageUrl: string;
    _id?: string;
}

interface UserFormProps {
    user?: User | null;
    onSubmit: (data: User) => void;
    onCancel?: () => void;
}

export default function UserForm({
    user = { firstName: "", lastName: "", emailId: "", imageUrl: "" },
    onSubmit,
    onCancel,
}: UserFormProps) {
    const { toast } = useToast();

    const [formData, setFormData] = useState<User>(user ?? { firstName: "", lastName: "", emailId: "", imageUrl: "" });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.emailId.trim() ||
            !formData.imageUrl.trim()
        ) {
            toast({
                title: "Missing Required Fields",
                description: "Please fill out all fields before submitting.",
                variant: "destructive",
            });
            return;
        }
        onSubmit(formData);
    };

    const handleCancel = () => {
        onCancel?.();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold mb-2 pb-3 border-b border-[#ccc]">
                {user?._id ? "Edit User" : "Create User"}
            </h2>

            <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                    <span className="text-red-500">*</span> First Name
                </label>
                <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                    <span className="text-red-500">*</span> Last Name
                </label>
                <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="emailId" className="text-sm font-medium">
                    <span className="text-red-500">*</span> Email
                </label>
                <Input
                    id="emailId"
                    name="emailId"
                    type="email"
                    value={formData.emailId}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                    <span className="text-red-500">*</span> Profile Image Link
                </label>
                <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    required
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button type="submit">Submit</Button>
            </div>
        </form>
    );
}
