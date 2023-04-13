import { TrimPipe } from './trim.pipe';
import { FilterListPipe } from './filter-list.pipe';
import { FilterObjectPipe } from './filter-object.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe'

export const pipes: any[] = [TrimPipe, FilterListPipe, FilterObjectPipe, SanitizeHtmlPipe];

export * from './trim.pipe';
export * from './filter-list.pipe';
export * from './filter-object.pipe';
export * from './sanitize-html.pipe';