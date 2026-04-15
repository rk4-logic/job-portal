import { ShieldAlertIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import Link from "next/link"
import { getCurrentEmployerDetails } from "../server/employers.queries"
import { redirect } from "next/navigation"

export async function EmployerProfileCompletionStatus() {

    const currentEmployer = await getCurrentEmployerDetails();
    if (!currentEmployer) return redirect("/login");
    if (currentEmployer.isProfileCompleted) return null;
    
    return (
        <div className="flex flex-col gap-6 w-full">
            <Item className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
                <ItemMedia className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full">
                    <ShieldAlertIcon size={20} />
                </ItemMedia>

                <ItemContent>
                    <ItemTitle className="text-amber-900 dark:text-amber-100 font-semibold">
                        Action Required: Incomplete Profile
                    </ItemTitle>
                    <ItemDescription className="text-amber-800/80 dark:text-amber-300/70">
                        You haven't completed your employer profile yet. Finish setting
                        up to start posting jobs and viewing candidates.
                    </ItemDescription>
                </ItemContent>

                <ItemActions>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-100"
                        asChild
                    >
                        <Link href="/employer-dashboard/settings">Complete Profile</Link>
                    </Button>
                </ItemActions>
            </Item>
        </div>
    )
}
