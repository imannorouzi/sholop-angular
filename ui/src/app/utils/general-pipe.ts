import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'generalFilter',
  pure: false
})
export class GeneralPipe implements PipeTransform{
  transform(items: any[], filter: string): any {
    if(!items || !filter || items.length === 0) return items;

    return items.filter(item => this.applyFilter(item, filter));
  }

  private applyFilter(item: any, filter: string) {

    for(let field in item){

      if (typeof item[field] === 'string') {
        if (item[field].toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          return true;
        }
      }
    }

    return false;
  }
}
