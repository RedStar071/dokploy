import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React from "react";
import { api } from "@/utils/api";
import { UpdateServer } from "./web-server/update-server";
import { cn } from "@/lib/utils";
import { ShowDokployActions } from "./servers/actions/show-dokploy-actions";
import { ShowTraefikActions } from "./servers/actions/show-traefik-actions";
import { ShowStorageActions } from "./servers/actions/show-storage-actions";
import { ToggleDockerCleanup } from "./servers/actions/toggle-docker-cleanup";

interface Props {
	className?: string;
}
export const WebServer = ({ className }: Props) => {
	const { data } = api.admin.one.useQuery();

	const { data: dokployVersion } = api.settings.getDokployVersion.useQuery();

	return (
		<Card className={cn("rounded-lg w-full bg-transparent p-0", className)}>
			<CardHeader>
				<CardTitle className="text-xl">Web server settings</CardTitle>
				<CardDescription>Reload or clean the web server.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 ">
				<div className="grid md:grid-cols-2 gap-4">
					<ShowDokployActions />
					<ShowTraefikActions />
					<ShowStorageActions />

					<UpdateServer />
				</div>

				<div className="flex items-center flex-wrap justify-between gap-4">
					<span className="text-sm text-muted-foreground">
						Server IP: {data?.host}
					</span>
					<span className="text-sm text-muted-foreground">
						Version: {dokployVersion}
					</span>

					<ToggleDockerCleanup />
				</div>
			</CardContent>
		</Card>
	);
};
