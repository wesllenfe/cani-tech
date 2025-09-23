import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ageLabel', standalone: true })
export class AgePipe implements PipeTransform {
  transform(months: number): string {
    if (!months && months !== 0) return '';
    const yrs = Math.floor(months / 12);
    const m = months % 12;
    const parts: string[] = [];
    if (yrs > 0) parts.push(`${yrs} ${yrs === 1 ? 'ano' : 'anos'}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? 'mês' : 'meses'}`);
    if (parts.length === 0) return '0 meses';
    return parts.join(' e ');
  }
}
