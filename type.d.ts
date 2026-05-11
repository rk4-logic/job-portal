import {
  JOB_LEVEL, JOB_TYPE, MIN_EDUCATION, SALARY_CURRENCY, SALARY_PERIOD, WORK_TYPE,} from "@/config/constants";

export {};

declare global {
interface LoginFormData {
    email: string;
    password: string;
};

interface RegistrationFormData extends LoginFormData {
    name: string;
    userName: string;
    confirmPassword: string;
    role: 'applicant' | 'employer';
};

type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

type UserSessionData = {
  userAgent: string;
  ip: string;
  userId: number;
  token: string;
  tx?: DbClient;
};

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

type OrganizationType = (typeof organizationTypeOptions)[number];

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

type TeamSize = (typeof teamsizeOptions)[number];

interface IFormInput {    
    name: string;
    description: string;
    yearOfEstablishment: string;
    location: string;
    websiteUrl: string;
    organizationType: OrganizationType;
    teamSize: TeamSize;
    avatarUrl: string;
    bannerImageUrl: string;
}

interface Props {
    initialData?: Partial<IFormInput>;
}

type ImageUploadProps = Omit<ComponentProps<"div">, "onChange"> & {
  value?: string;
  boxText?: string;
  onChange: (url: string) => void;
};

interface JobPostFormProps {
  initialData?: any; 
  isEditMode?: boolean;
};

type WorkType = (typeof WORK_TYPE)[number];
type JobLevel = (typeof JOB_LEVEL)[number];
type JobType = (typeof JOB_TYPE)[number];
type SalaryCurrency = (typeof SALARY_CURRENCY)[number];
type SalaryPeriod = (typeof SALARY_PERIOD)[number];
type MinEducation = (typeof MIN_EDUCATION)[number];

interface Job {
  id: number;
  title: string;
  description: string;
  employerId: number;
  isFeatured: Boolean;
  jobType: JobType;
  workType: WorkType;
  jobLevel: JobLevel;

  location: string | null;
  tags: string | null;

  minSalary: number | null;
  maxSalary: number | null;
  salaryCurrency: SalaryCurrency | null;
  salaryPeriod: SalaryPeriod | null;

  minEducation: MinEducation | null;
  experience: string | null;

  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
};

interface JobCardProps {
  job: Job;
  onEdit?: (jobId: number) => void;
  onDelete?: (jobId: number) => void;
};

interface EditJobPageProps {
  params: Promise<{ jobId: string }>;
}
}