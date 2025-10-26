import React, { useState, useMemo, type ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import UserForm, { type User } from "@/pages/UserForm";
import { Grid3x2, List, Pencil, Search, Trash } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { createUser, deleteUserById, getUserList, updateUserById } from "@/apiCall/v1/api_v1";

interface ConfirmDialogProps {
    trigger: ReactNode;
    title?: string;
    description?: string;
    onConfirm: () => void;
}

function DeleteUserButton({
    trigger,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-end gap-2">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const Users: React.FC = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const users = useSelector((state: RootState) => state.layout.users);

    const [view, setView] = useState<"table" | "card">("table");
    const [search, setSearch] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [editUserInfo, setEditUserInfo] = useState<User | null>(null);


    const fetchData = async () => {
        await getUserList();
    }

    useEffect(() => {
        fetchData();
    }, [])


    const handleUserSubmit = async (userData: Partial<User>) => {
        let result;
        if (editUserInfo) {
            result = await updateUserById(editUserInfo._id!, userData);
            if (result.success) {
                toast({
                    title: "User Updated",
                    description: `${userData.firstName} ${userData.lastName} updated successfully`,
                    variant: "default",
                });
            } else {
                toast({
                    title: "Update Failed",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } else {
            result = await createUser(userData);
            if (result.success) {
                toast({
                    title: "User Created",
                    description: `${userData.firstName} ${userData.lastName} created successfully`,
                    variant: "default",
                });
            } else {
                toast({
                    title: "Creation Failed",
                    description: result.message,
                    variant: "destructive",
                });
            }
        }
        setIsOpen(false);
        getUserList();
    };

    const handleDelete = async (id: string) => {
        const result = await deleteUserById(id);
        if (result.success) {
            toast({
                title: "User Deleted",
                description: "The user has been deleted successfully.",
                variant: "default",
            });
            getUserList();
        } else {
            toast({
                title: "Delete Failed",
                description: result.message,
                variant: "destructive",
            });
        }
    };


    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            `${user.firstName} ${user.lastName} ${user.emailId}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [users, search]);

    const onCancelDialog = () => {
        setIsOpen(false);
        setEditUserInfo(null);
    }
    return (
        <div>

            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-semibold mb-4">Users</h1>
                <div className="flex gap-2">
                    <div className="relative w-full max-w-sm">
                        <input
                            type="search"
                            placeholder="Search user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-600">Create User</Button>
                        </DialogTrigger>
                        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                            <UserForm
                                onCancel={onCancelDialog}
                                onSubmit={handleUserSubmit}
                                user={{ firstName: "", lastName: "", emailId: "", imageUrl: "" }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex my-2">
                <div
                    className={`
                    flex gap-2 border py-1 px-2 items-center cursor-pointer
                    ${view === "table" ? 'text-blue-600 border-blue-600 rounded-l-md ' : 'text-gray-600 border-r-0 border-gray-400 rounded-l-md'}
                    `}
                    onClick={() => setView("table")}
                >
                    <Grid3x2 size={20} />
                    Table
                </div>

                <div
                    className={`
                    flex gap-2 border py-1 px-2 items-center cursor-pointer
                    ${view === "card" ? 'text-blue-600 border-blue-600 rounded-r-md' : 'text-gray-600 border-l-0 border-gray-400 rounded-r-md'}
                    `}
                    onClick={() => setView("card")}
                >
                    <List size={20} />
                    Card
                </div>
            </div>


            {view === "table" ? (
                <table className="w-full bg-white rounded shadow">
                    <thead className="bg-gray-200">
                        <tr className="border-b">
                            <th className="p-2 text-left"></th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">First Name</th>
                            <th className="p-2 text-left">Last Name</th>
                            <th className="p-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50 text-left">
                                <td className="p-2">
                                    <img
                                        src={user.imageUrl}
                                        alt={user.firstName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </td>
                                <td className="p-2">{user.emailId}</td>
                                <td className="p-2">{user.firstName}</td>
                                <td className="p-2">{user.lastName}</td>
                                <td className="p-2 flex gap-2">
                                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                onClick={() => {
                                                    setEditUserInfo(user);
                                                }}
                                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-500 hover:bg-blue-600 text-white" variant="secondary" size="sm">Edit</Button>
                                        </DialogTrigger>
                                        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                                            <UserForm
                                                onCancel={onCancelDialog}
                                                onSubmit={handleUserSubmit}
                                                user={editUserInfo}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <DeleteUserButton
                                        trigger={
                                            <Button className="focus:outline-none focus:ring-2 focus:ring-blue-500" variant="destructive" size="sm">
                                                Delete
                                            </Button>
                                        }
                                        title={`Delete ${user.firstName} ${user.lastName}?`}
                                        description="This action cannot be undone."
                                        onConfirm={() => handleDelete(user._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.emailId}
                            className="relative group p-6 flex flex-col items-center gap-2 bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
                        >
                            <img
                                src={user.imageUrl}
                                alt={user.firstName}
                                className="w-16 h-16 rounded-full object-cover"
                            />

                            <div className="font-semibold">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-500">{user.emailId}</div>

                            <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center gap-4 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300">
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            onClick={() => {
                                                setEditUserInfo(user);
                                            }}
                                            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition">
                                            <Pencil size={20} />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                                        <UserForm
                                            onCancel={onCancelDialog}
                                            onSubmit={handleUserSubmit}
                                            user={editUserInfo}
                                        />
                                    </DialogContent>
                                </Dialog>


                                <DeleteUserButton
                                    trigger={
                                        <button className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition">
                                            <Trash size={20} />
                                        </button>
                                    }
                                    title={`Delete ${user.firstName} ${user.lastName}?`}
                                    description="This action cannot be undone."
                                    onConfirm={() => handleDelete(user._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default React.memo(Users);
