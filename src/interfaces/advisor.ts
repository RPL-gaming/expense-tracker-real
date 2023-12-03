export type Advisor = {
  id: string;
  name: string;
  specialties: string[];
  email: string;
  ratePerHour: number;
  bio: string;
  image: string;
  yearsOfExperience: number;
  availableSchedules: AvailableSchedules[];
};

export type AvailableSchedules = {
  id: string;
  advisorId: string;
  dateTime: Date;
};

export type MeetingDetails = {
  meetUrl: string;
};
