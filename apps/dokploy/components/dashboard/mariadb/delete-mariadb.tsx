import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const deleteMariadbSchema = z.object({
	projectName: z.string().min(1, {
		message: "Database name is required",
	}),
});

type DeleteMariadb = z.infer<typeof deleteMariadbSchema>;

interface Props {
	mariadbId: string;
}
export const DeleteMariadb = ({ mariadbId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { mutateAsync, isLoading } = api.mariadb.remove.useMutation();
	const { data } = api.mariadb.one.useQuery(
		{ mariadbId },
		{ enabled: !!mariadbId },
	);
	const { push } = useRouter();
	const form = useForm<DeleteMariadb>({
		defaultValues: {
			projectName: "",
		},
		resolver: zodResolver(deleteMariadbSchema),
	});

	const onSubmit = async (formData: DeleteMariadb) => {
		const expectedName = `${data?.name}/${data?.appName}`;
		if (formData.projectName === expectedName) {
			await mutateAsync({ mariadbId })
				.then((data) => {
					push(`/dashboard/project/${data?.projectId}`);
					toast.success("Database deleted successfully");
					setIsOpen(false);
				})
				.catch(() => {
					toast.error("Error deleting the database");
				});
		} else {
			form.setError("projectName", {
				message: "Database name does not match",
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" isLoading={isLoading}>
					<TrashIcon className="size-4 text-muted-foreground" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete the
						database. If you are sure please enter the database name to delete
						this database.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							id="hook-form-delete-mariadb"
							className="grid w-full gap-4"
						>
							<FormField
								control={form.control}
								name="projectName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<span>
												To confirm, type{" "}
												<Badge
													className="p-2 rounded-md ml-1 mr-1 hover:border-primary hover:text-primary-foreground hover:bg-primary hover:cursor-pointer"
													variant="outline"
													onClick={() => {
														if (data?.name && data?.appName) {
															navigator.clipboard.writeText(
																`${data.name}/${data.appName}`,
															);
															toast.success("Copied to clipboard. Be careful!");
														}
													}}
												>
													{data?.name}/{data?.appName}&nbsp;
													<Copy className="h-4 w-4 ml-1 text-muted-foreground" />
												</Badge>{" "}
												in the box below:
											</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter database name to confirm"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</div>
				<DialogFooter>
					<Button
						variant="secondary"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button
						isLoading={isLoading}
						form="hook-form-delete-mariadb"
						type="submit"
						variant="destructive"
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
