
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
    // avatarUrl: string;
    // bannerImageUrl: string;
}

interface Props {
    initialData?: Partial<IFormInput>;
}