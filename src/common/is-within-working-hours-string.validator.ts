import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsWithinWorkingHoursString', async: false })
export class IsWithinWorkingHoursString implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (!value) return false;

    const [hourStr] = value.split(':');
    const hour = parseInt(hourStr, 10);

    // Validar entre 7 AM (07:00) y antes de 6 PM (18:00)
    return hour >= 7 && hour < 18;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La hora de inicio debe ser entre las 07:00 y las 18:00 horas';
  }
}
