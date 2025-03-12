import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortByKey'
})
export class SortByKeyPipe implements PipeTransform {

    transform<T>(array: T[], key: keyof T): T[] {

        if (!array || array.length === 0)
            return [];

        return array.sort((a, b) => {

            const aValue = a[key];
            const bValue = b[key];

            if (typeof aValue === 'string' && typeof bValue === 'string')
                return aValue.toLowerCase().localeCompare(bValue.toLowerCase());

            if (aValue < bValue)
                return -1;

            if (aValue > bValue)
                return 1;

            return 0;

        });

    }

}
