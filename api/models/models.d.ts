interface UserAttributes {
  id: number;
  name: string;
  email: string;
  language?: string | null;
  encrypedPassword: string | null;
  ypUserId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  Roles?: Array<RoleAttributes>;
}

interface RoleAttributes {
  id: number;
  nameToken: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectPublicDataAttributes {
  service: string;
  locations: string;
  keyContacts: string;
  languages: string;
}

interface ProjectAttributes {
  id: number;
  userId: number;
  name: string;
  description: string;
  language: string | null;
  publicData: ProjectPublicDataAttributes | null;
  createdAt?: Date;
  updatedAt?: Date;
  Rounds?: Array<RoundAttributes>;
  Users?: Array<UserAttributes>;
}

interface RoundPublicDataAttributes {
  meetings: Record<string, number>;
}

interface RoundAttributes {
  id: number;
  userId: number;
  projectId: number;
  publicData?: RoundPublicDataAttributes | null;
  createdAt?: Date;
  updatedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

interface StoryPublicDataAttributes {
  data: string;
}

interface StoryAttributes {
  id: number;
  userId: number;
  projectId: number;
  publicData: StoryPublicDataAttributes | null;
  createdAt?: Date;
  updatedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

interface StageAttributes {
  id: number;
  roundId: number;
  nameToken: string;
  type: number;
  audience: number;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

interface MeetingAttributes {
  id: number;
  roundId: number;
  userId: number;
  type: number;
  state: number;
  subState: number;
  forUsers: boolean;
  forServiceProviders: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  Round?: RoundAttributes;
}

interface EmailCampaignAttributes {
  id: number;
  stageId: number;
  userId: number;
  language: string;
  createdAt?: Date;
  updatedAt?: Date;
  sentAt?: Date;
}

interface SentEmailAttributes {
  id: number;
  emailCampaignId: number;
  userId: number;
  loginCode: string;
  createdAt?: Date;
  updatedAt?: Date;
  clickedAt?: Date;
  clickCount?: number;
}

interface IssuePublicDataAttributes {
  data: string;
}

interface IssuePrivateDataAttributes {
  data: string;
}

interface IssueAttributes {
  id: number;
  description: string;
  language?: string;
  roundId: number;
  userId: number;
  projectId: number;
  type: number;
  state: number;
  counterUpVotes: number;
  counterDownVotes: number;
  createdAt?: Date;
  updatedAt?: Date;
  Comments?: Array<CommentAttributes> | null;
  Actions?: Array<ActionAttributes> | null;
  publicData: IssuePublicDataAttributes | null;
  privateData: IssuePublicDataAttributes | null;
}

interface ActionPlanAttributes {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ActionAttributes {
  id?: number;
  description: string;
  language?: string;
  actionPlanId: number;
  userId: number;
  state: number;
  counterUpVotes: number;
  counterDownVotes: number;
  completeBy: Date | null;
  completedPercent: number;
  assignedToType?: number;
  assignedToName?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  completedAt?: Date | null;
}

interface ScoreCardAttributes {
  id: number;
  roundId: number;
  state: number;
  type: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentPublicDataAttributes {
  data: string;
}

interface CommentPrivateDataAttributes {
  data: string;
}

interface CommentAttributes {
  id: number;
  content: string;
  language?: string;
  roundId: number;
  actionId: number;
  issueId: number;
  userId: number;
  type: number;
  status: number;
  counterUpVotes: number;
  counterDownVotes: number;
  createdAt?: Date;
  updatedAt?: Date;
  publicData: CommentPublicDataAttributes | null;
  privateData: CommentPrivateDataAttributes | null;
}

interface ProgressReportAttributes {
  id: number;
  actionId: number;
  userId: number;
  content: string;
  language?: string;
  timeFrame: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ParticipantsUploadAttributes {
  participants: string;
  roleId: number;
  language: string;
  projectId: number;
}

interface StateAttributes {
  tabIndex: number;
  storyPageIndex?: number;
  issueIndex?: number;
  coreIssueIndex?: number;
  votingIssueIndex?: number;
  actionIssueIndex?: number;
  isLive: boolean;
}

interface TranslationCacheAttributes {
  id: number;
  indexKey: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
