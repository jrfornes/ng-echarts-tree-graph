import { importProvidersFrom, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

echarts.use([TreeChart, TooltipComponent, CanvasRenderer]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(NgxEchartsModule.forRoot({ echarts })),
  ],
};
