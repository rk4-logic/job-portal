'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Building2, Calendar, FileText, Globe, MapPin } from "lucide-react";
import { updateEmployerProfileAction } from "../server/employer.action";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployerProfileData, employerProfileSchema } from "../employers.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Tiptap from "@/components/text-editor";

const organizationTypeOptions = [
    "development",
    "business",
    "finance & accounting",
    "it & software",
    "office productivity",
    "personal development",
    "design",
    "marketing",
    "photography & video",
    "healthcare",
    "education",
    "retail",
    "manufacturing",
    "hospitality",
    "consulting",
    "real estate",
    "legal",
    "other",
] as const;

const teamsizeOptions = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5001-10000",
    "10001+"
] as const;


const EmployerSettingForm = ({ initialData }: Props) => {

    const { register, handleSubmit, control, formState: { errors, isDirty, isSubmitting } } = useForm<EmployerProfileData>({
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            organizationType: initialData?.organizationType || undefined,
            teamSize: initialData?.teamSize || undefined,
            location: initialData?.location || "",
            websiteUrl: initialData?.websiteUrl || "",
            yearOfEstablishment: initialData?.yearOfEstablishment,
            // avatarUrl: initialData?.avatarUrl || "",
            // bannerImageUrl: initialData?.bannerImageUrl || "",
        },
        resolver: zodResolver(employerProfileSchema),
    });

    const handleFormSubmit = async (data: EmployerProfileData) => {
        console.log("Form Data:", data);
        const response = await updateEmployerProfileAction(data);
        if (response.status === "SUCCESS") {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    };

    return (
        <Card className="w-3/4">
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 md:space-y-6">
                    {/* Company Name */}
                    <div className="space-y-3">
                        <Label htmlFor="companyName">Company Name</Label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <Input type="text" id="companyName" className="pl-10" {...register("name", { required: "Company Name is required" })} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                    </div>

                    {/* Company Description */}

                    {/* <div className="space-y-3">
                        <Label htmlFor="companyDescription">Company Description</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <Textarea id="companyDescription" className="pl-10" {...register("description", { required: "Company Description is required" })} />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                    </div> */}

                    <div className="space-y-2">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label>Description *</Label>
                                    <Tiptap content={field.value} onChange={field.onChange} />

                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="yearOfEstablishment">
                                Year of Establishment *
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="yearOfEstablishment"
                                    type="text"
                                    placeholder="e.g., 2020"
                                    maxLength={4}
                                    className="pl-10"
                                    {...register("yearOfEstablishment")}
                                />
                            </div>
                            {errors.yearOfEstablishment && (
                                <p className="text-sm text-destructive">
                                    {errors.yearOfEstablishment.message}
                                </p>
                            )}
                        </div>

                        {/* Organization Type and Team Size - Two columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Organization Type */}
                            <div className="space-y-2">
                                <Label htmlFor="organizationType">Organization Type *</Label>

                                <Controller
                                    name="organizationType"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="pl-10 w-full ">
                                                    <SelectValue placeholder="Select organization type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {organizationTypeOptions.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {/* {capitalizeWords(type)} */}
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                                {errors.organizationType && (
                                    <p className="text-sm text-destructive">
                                        {errors.organizationType.message}
                                    </p>
                                )}
                            </div>

                            {/* Organization Type */}
                            <div className="space-y-2">
                                <Label htmlFor="teamSize">Team Size *</Label>
                                <Controller
                                    name="teamSize"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="pl-10 w-full ">
                                                    <SelectValue placeholder="Select Team Size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teamsizeOptions.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {/* {capitalizeWords(type)} */}
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                                {errors.teamSize && (
                                    <p className="text-sm text-destructive">
                                        {errors.teamSize.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Year of Establishment and Location - Two columns */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>

                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="e.g., Pune, Bangalore"
                                    className="pl-10"
                                    {...register("location")}
                                />
                            </div>
                        </div>
                        {errors.location && (
                            <p className="text-sm text-destructive">
                                {errors.location.message}
                            </p>
                        )}
                    </div>
                    {/* Website URL */}
                    <div className="space-y-2">
                        <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="websiteUrl"
                                type="text"
                                placeholder="https://www.yourcompany.com"
                                className="pl-10"
                                {...register("websiteUrl")}
                            />
                        </div>
                        {errors.websiteUrl && (
                            <p className="text-sm text-destructive">
                                {errors.websiteUrl.message}
                            </p>
                        )}
                    </div>

                    <Button disabled={isSubmitting || !isDirty} type="submit" className="bg-primary cursor-pointer text-white px-4 py-2 rounded-md">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                    {!isDirty && <p className="text-sm text-muted-foreground">No changes to save</p>}
                </form>
            </CardContent>
        </Card>
    )
}

export default EmployerSettingForm
