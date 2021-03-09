interface UserAttributes {
  id: number;
  name: string;
  email: string;
  language?: string | null;
  encrypedPassword: string | null;
  ypUserId?: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  language: string | null;
  publicData: ProjectPublicDataAttributes | null;
  createdAt: Date;
  updatedAt: Date;
}

interface RoundPublicDataAttributes {
  data: string;
}

interface RoundAttributes {
  id: number;
  userId: number;
  projectId: number;
  publicData: RoundPublicDataAttributes | null;
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
