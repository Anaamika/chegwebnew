import { FilterArrayPipe } from './filter-array.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { MaskPipe } from './mask.pipe';

export const pipes: any[] = [FilterArrayPipe, SanitizeHtmlPipe, MaskPipe];

export * from './filter-array.pipe';
export * from './sanitize-html.pipe';
export * from './mask.pipe';
