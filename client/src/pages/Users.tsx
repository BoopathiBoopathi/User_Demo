import React, { useState, useMemo, type ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import UserForm, { type User } from "@/pages/UserForm";
import { ChevronLeft, ChevronRight, Grid3x2, List, LogOut, Pencil, Search, Trash } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { clearTokens, createUser, deleteUserById, getUserList, updateUserById } from "@/apiCall/v1/api_v1";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


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
    const { toast } = useToast();
    const users = useSelector((state: RootState) => state.layout.users);

    const [view, setView] = useState<"table" | "card">("table");
    const [search, setSearch] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [editUserInfo, setEditUserInfo] = useState<User | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const fetchData = async () => {
        await getUserList();
    }

    useEffect(() => {
        fetchData();
    }, [])

    const onCancelDialog = () => {
        setIsOpen(false);
        setEditUserInfo(null);
    }

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
        setEditUserInfo(null);
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

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);



    // const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);


    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;



    return (
        <div className="flex flex-col h-[calc(100vh-50px)]">
            <div className="flex-shrink-0">
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
                                <DialogTitle className="text-lg font-semibold mb-2 pb-3 border-b border-[#ccc]">
                                    Create User
                                </DialogTitle>
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
            </div>

            <div className="flex-1 overflow-y-auto mt-2">

                {view === "table" ? (
                    <>
                        <div className="flex flex-col border rounded shadow rounded-t-md h-full">
                            <table className="w-full bg-white rounded shadow table-fixed">
                                <thead className="bg-gray-200 sticky top-0 z-10">
                                    <tr className="border-b">
                                        <th className="p-2 text-left"></th>
                                        <th className="p-2 text-left">Email</th>
                                        <th className="p-2 text-left">First Name</th>
                                        <th className="p-2 text-left">Last Name</th>
                                        <th className="p-2 text-left">Action</th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="overflow-y-auto flex-1">
                                <table className="w-full table-fixed">
                                    <tbody>
                                        {paginatedUsers.map((user) => (
                                            <tr key={user._id} className="border-b hover:bg-gray-50 text-left">
                                                <td className="p-2">
                                                    <img
                                                        src={user.imageUrl}
                                                        alt={user.firstName}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                </td>
                                                <td className="p-2 text-blue-600">{user.emailId}</td>
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
                                                            <DialogTitle className="text-lg font-semibold mb-2 pb-3 border-b border-[#ccc]">
                                                                Edit User
                                                            </DialogTitle>
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
                            </div>
                            <div className="flex items-center justify-between border-t bg-white rounded-b-md px-4 py-3">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Items per page:</span>
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(value) => {
                                            setItemsPerPage(Number(value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-16 h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="75">75</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <span className="text-sm text-gray-600">
                                        Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of{" "}
                                        {users.length} items
                                    </span>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        className="disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        <ChevronLeft />
                                    </Button>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(pageNum)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        className="disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        <ChevronRight />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>

                ) : (
                    <div className="flex-1 overflow-y-auto">
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
                                                <DialogTitle className="text-lg font-semibold mb-2 pb-3 border-b border-[#ccc]">
                                                    Edit User
                                                </DialogTitle>
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
                    </div>
                )}

            </div>
        </div >
    );
};

export default React.memo(Users);
