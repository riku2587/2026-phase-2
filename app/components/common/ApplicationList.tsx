import { CopyIcon } from "lucide-react"
import { useFetcher } from "react-router"
import { formatPlainDateTime } from "~/lib/plain-datetime-utils"
import { wrapPromise } from "~/lib/result"
import type { LiveApplicationWithUrl } from "~/routes/app/live/application"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { showToast } from "./toast"

export function ApplicationList({
	applications,
	buttonIcon,
	intent,
	content,
}: {
	applications: LiveApplicationWithUrl[]
	buttonIcon: any
	intent: string
	content: string
}) {
	const fetcher2 = useFetcher()

	const handleCopy = async (url: string) => {
		const result = await wrapPromise(navigator.clipboard.writeText(url))
		if (!result.success) {
			showToast({
				type: "error",
				message: "クリップボードへのコピーが失敗しました",
			})
		}
		showToast({ type: "success", message: "申請リンクをコピーしました" })
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex gap-1 items-center">{content}</CardTitle>
			</CardHeader>
			<CardContent>
				{applications.length === 0 ? (
					<span className="text-muted-foreground text-sm">
						{content}はありません
					</span>
				) : (
					<div className="space-y-4">
						{applications.map((apl) => (
							<div className="space-y-1" key={apl.id}>
								<div className="w-full flex items-baseline gap-2">
									<span className="shrink-0">{apl.name}</span>
									<span className="shrink-0 text-muted-foreground text-xs">
										{formatPlainDateTime(apl.updatedAt)}
									</span>
								</div>
								<div className="flex gap-2 items-center">
									<div className="grow truncate text-muted-foreground py-2 px-4 bg-muted rounded-lg">
										{apl.url}
									</div>
									<Button
										size="icon-lg"
										variant="destructive"
										onClick={() => {
											const formData = new FormData()
											formData.append("intent", intent)
											formData.append("application-id", String(apl.id))
											fetcher2.submit(formData, { method: "POST" })
										}}
									>
										{buttonIcon}
									</Button>
									<Button
										size="icon-lg"
										className="w-16"
										onClick={() => handleCopy(apl.url)}
									>
										<CopyIcon />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
