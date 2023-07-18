import { Injectable } from '@nestjs/common';
import { Appointment } from './models/appointment.model';
import { AppointmentInput } from './interface/appointment-input.interface';

@Injectable()
export class AppointmentService {
  scheduleAppointment(appointmentData: AppointmentInput): Appointment {
    if (appointmentData.endTime <= appointmentData.startTime) {
      throw new Error('appointment`s endTime should be after startTime');
    }
    if (this.endTimeIsInTheNextDay(appointmentData)) {
      throw new Error(
        'appointment`s endTime should be in the same day as startTime',
      );
    }
    return { ...appointmentData, confirmed: false };
  }

  endTimeIsInTheNextDay(appointmentData: AppointmentInput): boolean {
    const [differentDays, differentMonths, differentYears] = [
      appointmentData.startTime.getUTCDate() !==
        appointmentData.endTime.getUTCDate(),
      appointmentData.startTime.getUTCMonth() !==
        appointmentData.endTime.getUTCMonth(),
      appointmentData.startTime.getUTCFullYear() !==
        appointmentData.endTime.getUTCFullYear(),
    ];
    return differentDays || differentMonths || differentYears;
  }
}
