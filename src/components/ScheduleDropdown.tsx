import React from "react";
import { AvailableSchedules } from "@/interfaces/advisor";

type ScheduleDropdownProps = {
  availableSchedules: AvailableSchedules[];
  onSelectSchedule: (schedule: AvailableSchedules) => void;
  scheduleButtonText: string;
};

const ScheduleDropdown: React.FC<ScheduleDropdownProps> = ({
  availableSchedules,
  onSelectSchedule,
  scheduleButtonText,
}) => {
  return (
    <div className="dropdown">
      <strong className="ml-2">Schedule</strong>
      <br></br>
      <div tabIndex={0} className="btn m-1">
        {scheduleButtonText}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {availableSchedules.map((schedule, index) => (
          <li key={index}>
            <a onClick={() => onSelectSchedule(schedule)}>
              {new Date(schedule.dateTime).toLocaleString("id-ID")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleDropdown;
