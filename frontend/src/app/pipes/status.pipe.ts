import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusPipe implements PipeTransform {
  transform(status: string): string {
    const statusMap: { [key: string]: string } = {
      'available': 'Disponível',
      'adopted': 'Adotado',
      'under_treatment': 'Em tratamento',
      'unavailable': 'Indisponível'
    };
    return statusMap[status] || status;
  }
}
